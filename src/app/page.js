"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ChatComponent from "../../components/ChatComponent";
import { Suspense } from "react";

function ChatPageContent() {
  const searchParams = useSearchParams();
  return <ChatComponent searchParams={searchParams} />;
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div
            class="w-12 h-12 rounded-full animate-spin
  border-4 border-solid border-[#638efe] border-t-transparent"
          ></div>
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}
