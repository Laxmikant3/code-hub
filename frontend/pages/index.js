import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

export default function CodeEditor() {
  const [code, setCode] = useState("// Type your code here...");

  useEffect(() => {
    socket.on("code-update", (newCode) => {
      setCode(newCode);
    });
  }, []);

  const handleChange = (newCode) => {
    setCode(newCode);
    socket.emit("code-change", newCode);
  };

  const runCode = async () => {
    const response = await axios.post("http://localhost:5000/run", { code });
    alert(response.data.output || response.data.error);
  };

  return (
    <div>
      <Editor height="400px" language="javascript" value={code} onChange={handleChange} />
      <button onClick={runCode}>Run Code</button>
    </div>
  );
}
