import { NextResponse } from 'next/server';
import mermaid from 'mermaid';
import { JSDOM } from 'jsdom';
import { Buffer } from 'buffer';
import { execFile } from 'child_process';
import { promisify } from 'util';

export const runtime = 'nodejs';

type SupportedLanguage = 'javascript' | 'python';

type CompilerResult = {
  run: {
    output: string;
  };
};

const execFileAsync = promisify(execFile);

const normalizeLanguage = (input: string): SupportedLanguage | null => {
  const lang = input.toLowerCase().trim();

  if (lang === 'javascript' || lang === 'js' || lang === 'node' || lang === 'nodejs') {
    return 'javascript';
  }

  if (lang === 'python' || lang === 'py' || lang === 'python3') {
    return 'python';
  }

  return null;
};

const formatOutput = ({ stdout, stderr, compile_output, message }: {
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
}) => {
  return (stdout ?? stderr ?? compile_output ?? message ?? '').toString();
};

const runLocalCommand = async (command: string, args: string[]): Promise<CompilerResult> => {
  try {
    const { stdout, stderr } = await execFileAsync(command, args, {
      timeout: 7000,
      maxBuffer: 1024 * 1024,
      windowsHide: true,
    });

    return {
      run: {
        output: formatOutput({ stdout, stderr }) || 'No output returned.',
      },
    };
  } catch (error: any) {
    const stdout = error?.stdout?.toString?.() ?? '';
    const stderr = error?.stderr?.toString?.() ?? '';
    const timedOut = error?.killed || error?.signal === 'SIGTERM';
    const message = timedOut
      ? `Execution timed out after 7 seconds.`
      : (stderr || stdout || error?.message || 'Local execution failed');
    throw new Error(message);
  }
};

const executeLocally = async (code: string, language: SupportedLanguage): Promise<CompilerResult> => {
  const allowLocalCompiler =
    process.env.ENABLE_LOCAL_COMPILER === 'true' ||
    (process.env.ENABLE_LOCAL_COMPILER !== 'false' && process.env.NODE_ENV !== 'production');

  if (!allowLocalCompiler) {
    throw new Error('Local compiler is disabled. Set ENABLE_LOCAL_COMPILER=true to enable.');
  }

  if (language === 'javascript') {
    return runLocalCommand('node', ['-e', code]);
  }

  const pythonCommands: Array<{ command: string; args: string[] }> = [
    { command: 'python', args: ['-c', code] },
    { command: 'py', args: ['-3', '-c', code] },
    { command: 'python3', args: ['-c', code] },
  ];

  const errors: string[] = [];

  for (const pythonCommand of pythonCommands) {
    try {
      return await runLocalCommand(pythonCommand.command, pythonCommand.args);
    } catch (error: any) {
      const message = error?.message || 'failed';
      errors.push(`${pythonCommand.command}: ${message}`);

      // Try the next python command if this one is not found.
      if (message.includes('ENOENT') || message.includes('not recognized')) {
        continue;
      }
    }
  }

  throw new Error(`Python runtime not available. ${errors.join(' | ')}`);
};

const executeWithPiston = async (code: string, language: SupportedLanguage): Promise<CompilerResult> => {
  const response = await fetch('https://emkc.org/api/v2/piston/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language,
      version: '*',
      files: [{ content: code }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Piston failed: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  const output = formatOutput(result.run ?? {});

  return {
    run: {
      output: output || 'No output returned.',
    },
  };
};

const JUDGE0_LANGUAGE_MAP: Record<SupportedLanguage, number> = {
  javascript: 63,
  python: 71,
};



const checkJudge0RapidApiAccess = async (rapidApiKey: string) => {
  const aboutResponse = await fetch('https://judge0-ce.p.rapidapi.com/about', {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': rapidApiKey,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
    },
  });

  if (!aboutResponse.ok) {
    const errorText = await aboutResponse.text();
    throw new Error(`Judge0 RapidAPI /about failed: ${aboutResponse.status} ${errorText}`);
  }
};

const executeWithJudge0RapidAPI = async (code: string, language: SupportedLanguage): Promise<CompilerResult> => {
  const rapidApiKey = process.env.RAPIDAPI_KEY

  if (!rapidApiKey) {
    throw new Error('RapidAPI key is missing. Set RAPIDAPI_KEY (or NEXT_PUBLIC_RAPIDAPI_KEY / JUDGE0_RAPIDAPI_KEY / RUN_CODE_ONLINE_RAPIDAPI_KEY).');
  }

  await checkJudge0RapidApiAccess(rapidApiKey);

  const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': rapidApiKey,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
    },
    body: JSON.stringify({
      source_code: code,
      language_id: JUDGE0_LANGUAGE_MAP[language],
      stdin: '',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Judge0 RapidAPI failed: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  const output = formatOutput(result);

  return {
    run: {
      output: output || 'No output returned.',
    },
  };
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const executeWithJudge0PublicNoKey = async (code: string, language: SupportedLanguage): Promise<CompilerResult> => {
  const createResponse = await fetch('https://api.judge0.com/submissions?base64_encoded=false&wait=false', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source_code: code,
      language_id: JUDGE0_LANGUAGE_MAP[language],
      stdin: '',
    }),
  });

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    throw new Error(`Judge0 public create failed: ${createResponse.status} ${errorText}`);
  }

  const createResult = await createResponse.json();
  const token = createResult?.token;
  if (!token) {
    throw new Error('Judge0 public create failed: token missing.');
  }

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const submissionResponse = await fetch(
      `https://api.judge0.com/submissions/${token}?base64_encoded=false`,
      { method: 'GET' }
    );

    if (!submissionResponse.ok) {
      const errorText = await submissionResponse.text();
      throw new Error(`Judge0 public get failed: ${submissionResponse.status} ${errorText}`);
    }

    const submission = await submissionResponse.json();
    const statusId = submission?.status?.id;

    if (statusId !== 1 && statusId !== 2) {
      const output = formatOutput(submission);
      return {
        run: {
          output: output || 'No output returned.',
        },
      };
    }

    await sleep(700);
  }

  throw new Error('Judge0 public execution timed out.');
};

const RUN_CODE_ONLINE_LANGUAGE_MAP: Record<SupportedLanguage, string> = {
  javascript: 'javascript',
  python: 'python',
};

const RUN_CODE_ONLINE_FILE_MAP: Record<SupportedLanguage, string> = {
  javascript: 'index.js',
  python: 'main.py',
};

const extractRunCodeOnlineOutput = (result: any): string => {
  return (
    result?.output ??
    result?.stdout ??
    result?.stderr ??
    result?.message ??
    result?.result?.output ??
    result?.data?.output ??
    ''
  ).toString();
};

const executeWithRunCodeOnlineRapidAPI = async (code: string, language: SupportedLanguage): Promise<CompilerResult> => {
  const rapidApiKey = process.env.RAPIDAPI_KEY

  if (!rapidApiKey) {
    throw new Error('RapidAPI key is missing for run-code-online fallback.');
  }

  const response = await fetch('https://run-code-online.p.rapidapi.com/api/code/exec', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': rapidApiKey,
      'X-RapidAPI-Host': 'run-code-online.p.rapidapi.com',
    },
    body: JSON.stringify({
      name: language === 'python' ? 'Python' : 'JavaScript',
      title: `${language} execution`,
      properties: {
        language: RUN_CODE_ONLINE_LANGUAGE_MAP[language],
        files: [{
          name: RUN_CODE_ONLINE_FILE_MAP[language],
          content: code,
        }],
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`RunCodeOnline RapidAPI failed: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  const output = extractRunCodeOnlineOutput(result);

  return {
    run: {
      output: output || 'No output returned.',
    },
  };
};

export async function POST(req: Request) {
  try {
    const { code, language, diagramCode, diagramType, prompt, type, text, voiceLang } = await req.json();

    if (type === 'compiler') {
      if (!code || !language) {
        return NextResponse.json({ error: 'Missing code or language' }, { status: 400 });
      }

      const normalizedLanguage = normalizeLanguage(language);
      if (!normalizedLanguage) {
        return NextResponse.json(
          { error: 'Unsupported language. Use JavaScript or Python.' },
          { status: 400 }
        );
      }

      const compilerErrors: string[] = [];
      try {
        const localResult = await executeLocally(code, normalizedLanguage);
        return NextResponse.json(localResult);
      } catch (localError: any) {
        console.error('Local compiler failed, trying remote providers:', localError?.message || localError);
        compilerErrors.push(`Local: ${localError?.message || 'failed'}`);
      }

      try {
        const result = await executeWithPiston(code, normalizedLanguage);
        return NextResponse.json(result);
      } catch (pistonError: any) {
        console.error('Piston primary compiler failed, trying Judge0 public no-key fallback:', pistonError?.message || pistonError);
        compilerErrors.push(`Piston: ${pistonError?.message || 'failed'}`);
      }

      try {
        const noKeyResult = await executeWithJudge0PublicNoKey(code, normalizedLanguage);
        return NextResponse.json(noKeyResult);
      } catch (judge0PublicError: any) {
        console.error('Judge0 public no-key fallback failed:', judge0PublicError?.message || judge0PublicError);
        compilerErrors.push(`Judge0 public: ${judge0PublicError?.message || 'failed'}`);
      }

      const rapidApiKey = process.env.RAPIDAPI_KEY
      if (!rapidApiKey) {
        return NextResponse.json(
          {
            error: 'All free no-key compiler providers failed. Configure RAPIDAPI_KEY for extra fallback providers.',
            details: compilerErrors.join(' | '),
          },
          { status: 502 }
        );
      }

      try {
        const fallbackResult = await executeWithJudge0RapidAPI(code, normalizedLanguage);
        return NextResponse.json(fallbackResult);
      } catch (judge0Error: any) {
        console.error('Judge0 RapidAPI fallback failed, trying run-code-online fallback:', judge0Error?.message || judge0Error);
        compilerErrors.push(`Judge0 RapidAPI: ${judge0Error?.message || 'failed'}`);
      }

      try {
        const lastFallbackResult = await executeWithRunCodeOnlineRapidAPI(code, normalizedLanguage);
        return NextResponse.json(lastFallbackResult);
      } catch (runCodeError: any) {
        compilerErrors.push(`Run-code-online RapidAPI: ${runCodeError?.message || 'failed'}`);
        return NextResponse.json(
          {
            error: 'All compiler providers failed.',
            details: compilerErrors.join(' | '),
          },
          { status: 502 }
        );
      }
    } else if (type === 'diagram') {
      if (!diagramCode || !diagramType) {
        return NextResponse.json({ error: 'Missing diagram code or type' }, { status: 400 });
      }

      mermaid.initialize({ startOnLoad: false });

      const { window } = new JSDOM('<div id="container"></div>');
      const container = window.document.querySelector('#container');

      if (!container) {
        throw new Error('Container not found');
      }

      const { svg } = await mermaid.render('diagram', diagramCode, container);
      return NextResponse.json({ svg });
    } else if (type === 'image') {
      if (!prompt) {
        return NextResponse.json({ error: 'Missing image prompt' }, { status: 400 });
      }

      const HF_TOKEN = process.env.NEXT_PUBLIC_HF_TOKEN;

      if (!HF_TOKEN) {
        return NextResponse.json(
          { error: 'Hugging Face token missing or invalid' },
          { status: 401 }
        );
      }

      const imageResponse = await fetch(
        'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      if (!imageResponse.ok) {
        const errorMessage = await imageResponse.text();
        throw new Error(`Image generation failed: ${errorMessage}`);
      }

      const imageBuffer = await imageResponse.arrayBuffer();
      const imageBase64 = Buffer.from(imageBuffer).toString('base64');

      return NextResponse.json({
        image: `data:image/png;base64,${imageBase64}`,
      });
    } else if (type === 'textToSpeech') {
      if (!text || !voiceLang) {
        return NextResponse.json({ error: 'Missing text or language' }, { status: 400 });
      }

      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        text
      )}&tl=${voiceLang}&client=tw-ob`;

      const audioResponse = await fetch(ttsUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36',
        },
      });

      if (!audioResponse.ok) {
        const errorText = await audioResponse.text();
        throw new Error(`TTS generation failed: ${errorText}`);
      }

      const audioBuffer = await audioResponse.arrayBuffer();
      const audioBase64 = Buffer.from(audioBuffer).toString('base64');

      return NextResponse.json({
        audio: `data:audio/mp3;base64,${audioBase64}`,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid request type' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error:', error);

    return NextResponse.json(
      { error: 'Execution, Diagram, Image, or TTS generation failed', details: error.message },
      { status: 500 }
    );
  }
}
