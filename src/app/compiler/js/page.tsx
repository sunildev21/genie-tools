"use client";

import { Heading } from '@/components/heading';
import CompilerEditor from "../_components/compiler-editor";
import OutputConsole from "../_components/output-console";
import { useState } from "react";

export default function JavaScriptCompiler() {
  const [code, setCode] = useState("// Write your JavaScript code here");
  const [output, setOutput] = useState<string>("");

  const runCode = async () => {
    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "compiler",       // ✅ Include the 'type' to prevent 400 error
          code,                   // ✅ Send the code properly
          language: "javascript", // ✅ Specify language
        }),
      });

      if (!response.ok) {
        let message = "Failed to compile code";
        try {
          const errorData = await response.json();
          console.error("Error:", errorData);
          message = errorData?.details
            ? `${errorData.error || "Failed to compile code"}\n${errorData.details}`
            : (errorData?.error || message);
        } catch {
          const fallbackText = await response.text();
          if (fallbackText) message = fallbackText;
        }
        setOutput(`Error: ${message}`);
        return;
      }

      const result = await response.json();
      console.log("Compilation Result:", result);

      // ✅ Display output or error
      if (result.run?.output) {
        setOutput(result.run.output); 
      } else {
        setOutput("No output returned.");
      }
    } catch (error) {
      console.error("Execution failed:", error);
      setOutput("Execution failed.");
    }
  };

  return (
    <div>
      <Heading
        title="Online JS Compiler"
        description="Write, run, and test your JavaScript code instantly."
      />

      <CompilerEditor 
        code={code} 
        setCode={setCode} 
        runCode={runCode} 
      />
      
      <OutputConsole output={output} />
    </div>
  );
}
