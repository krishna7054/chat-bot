"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [role, setRole] = useState("frontend");

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Interview Copilot</h1>

      <select
        className="border p-2 rounded"
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="frontend">Frontend</option>
        <option value="backend">Backend</option>
        <option value="dsa">DSA</option>
      </select>

      <button
        className="bg-black text-white px-4 py-2 rounded"
        onClick={() => router.push(`/interview?role=${role}`)}
      >
        Start Interview
      </button>
    </div>
  );
}