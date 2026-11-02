import Link from "next/link";
import { useState, useEffect } from "react";

export default function CompilerPage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Online Code Compiler</h1>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className="mt-4">
        <Link href="/compiler/js">
          <button className="px-4 py-2 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600">JavaScript</button>
        </Link>
        <Link href="/compiler/python">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Python</button>
        </Link>
      </div>
    </div>
  );
}
