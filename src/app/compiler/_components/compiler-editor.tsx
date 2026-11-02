"use client";

interface CompilerEditorProps {
  code: string;
  setCode: (code: string) => void;
  runCode: () => void;
}

export default function CompilerEditor({ code, setCode, runCode }: CompilerEditorProps) {
  return (
    <div className="mt-4">
      <textarea
        className="w-full h-40 p-3 border rounded bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your code here..."
      />
      <button
        onClick={runCode}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Run Code
      </button>
    </div>
  );
}
