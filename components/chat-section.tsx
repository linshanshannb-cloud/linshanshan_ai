"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { quickQuestions, resume } from "@/data/resume";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function ChatSection() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `你好，我是${resume.name}的 AI 数字分身。你可以问我关于他的产品经历、AI Agent 项目、ToB SaaS 经验或求职方向。`,
    },
  ]);
  const [conversationId, setConversationId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messageListRef = useRef<HTMLDivElement>(null);
  const activeRequestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => activeRequestRef.current?.abort();
  }, []);

  async function sendMessage(question: string) {
    const content = question.trim();
    if (!content) return;

    activeRequestRef.current?.abort();
    const controller = new AbortController();
    activeRequestRef.current = controller;
    const timeoutId = window.setTimeout(() => controller.abort(), 65_000);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setError("");
    setLoading(true);

    requestAnimationFrame(() => {
      messageListRef.current?.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: "smooth",
      });
    });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, conversationId }),
        signal: controller.signal,
      });

      const data = (await response.json()) as {
        answer?: string;
        conversationId?: string;
        error?: string;
      };

      if (!response.ok || !data.answer) {
        throw new Error(data.error || "AI 暂时没有返回内容，请稍后重试。");
      }

      setConversationId(data.conversationId);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.answer as string,
        },
      ]);
    } catch (caughtError) {
      if (
        caughtError instanceof DOMException &&
        caughtError.name === "AbortError" &&
        activeRequestRef.current !== controller
      ) {
        return;
      }

      setError(
        controller.signal.aborted
          ? "本次回答等待超时，请重新发送问题。"
          : caughtError instanceof Error
          ? caughtError.message
          : "请求失败，请检查网络或服务配置。",
      );
    } finally {
      window.clearTimeout(timeoutId);

      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
        setLoading(false);
      }

      requestAnimationFrame(() => {
        messageListRef.current?.scrollTo({
          top: messageListRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <section id="chat" className="scroll-mt-24 py-20">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          AI Digital Twin
        </p>
        <h2 className="text-3xl font-bold md:text-4xl">
          向 {resume.name} 的 AI 分身提问
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          快速了解他的 AI 项目、产品经历与岗位匹配度。AI 回答仅作辅助，重要信息可通过页面联系方式进一步确认。
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white bg-white shadow-card">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-white">
            AI
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
          </span>
          <div>
            <p className="font-semibold">{resume.name}的 AI 数字分身</p>
            <p className="text-sm text-slate-500">在线 · 通常在一分钟内回复</p>
          </div>
        </div>

        <div
          ref={messageListRef}
          aria-live="polite"
          className="h-[420px] space-y-4 overflow-y-auto bg-slate-50/70 p-5 md:p-7"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-7 md:max-w-[72%] ${
                  message.role === "user"
                    ? "rounded-br-md bg-primary text-white"
                    : "rounded-bl-md border border-slate-100 bg-white text-slate-700 shadow-sm"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-4 py-4 shadow-sm">
                {[0, 1, 2].map((index) => (
                  <span
                    key={index}
                    className="h-2 w-2 animate-bounce rounded-full bg-primary/70"
                    style={{ animationDelay: `${index * 120}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 p-4 md:p-5">
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {quickQuestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => void sendMessage(question)}
                className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:border-primary hover:text-primary"
              >
                {question}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-3">
            <label htmlFor="chat-input" className="sr-only">
              输入你想了解的问题
            </label>
            <input
              id="chat-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={2000}
              placeholder="问问他的 AI 项目、SaaS 经历或核心能力..."
              className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:bg-slate-50"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="rounded-2xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "思考中" : "发送"}
            </button>
          </form>

          {error && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
