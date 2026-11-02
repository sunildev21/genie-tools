interface OutputConsoleProps {
    output: string;
  }
  
  export default function OutputConsole({ output }: OutputConsoleProps) {
    return (
      <div className="mt-4 p-3 border rounded bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600">
        <h2 className="font-semibold">Output:</h2>
        <pre className="whitespace-pre-wrap p-2 bg-gray-200 dark:bg-gray-700 rounded">{output || "No output yet..."}</pre>
      </div>
    );
  }
  