"use client"

import { useChatAssistant } from "@/components/ChatAssistantProvider";
import { ChatAssistantCard } from "@/components/ChatAssistantCard";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isExpanded, toggleChat, width, setWidth } = useChatAssistant();

  return (
    <>
      {children}
      <ChatAssistantCard
        isExpanded={isExpanded}
        onToggle={toggleChat}
        width={width}
        onWidthChange={setWidth}
      />
    </>
  );
}
