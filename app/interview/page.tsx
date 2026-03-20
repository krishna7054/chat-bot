"use client";

import { useSearchParams } from "next/navigation";
import ChatWindow from "./components/ChatWindow";

export default function Page() {
  const params = useSearchParams();
  const role = params.get("role") || "frontend";

  return <ChatWindow role={role} />;
}