import CopilotChat from "@/components/CopilotChat";

export default function ChatPage() {
  return (
    <div className="p-6 md:p-10 flex flex-col gap-6 max-w-5xl mx-auto w-full h-full min-h-[calc(100vh-2rem)] pb-12">
      <section className="flex flex-col gap-2 shrink-0">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          ASMO Copilot
        </h1>
        <p className="text-muted-foreground">
          Your AI market intelligence assistant. Ask about trends, macroeconomic shifts, or specific assets.
        </p>
      </section>

      <div className="flex-1 min-h-[500px]">
        <CopilotChat isFloating={false} />
      </div>
    </div>
  );
}
