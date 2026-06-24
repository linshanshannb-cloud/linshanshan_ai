import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

type CozeResponse<T> = {
  code?: number;
  msg?: string;
  message?: string;
  data?: T;
};

type ChatData = {
  id: string;
  conversation_id: string;
  status: string;
  last_error?: {
    code?: number;
    msg?: string;
  };
};

type CozeMessage = {
  id?: string;
  role?: string;
  type?: string;
  content?: string;
  content_type?: string;
};

class CozeApiError extends Error {
  constructor(
    message: string,
    readonly code?: number,
    readonly httpStatus = 500,
    readonly rawResponse?: unknown,
  ) {
    super(message);
    this.name = "CozeApiError";
  }
}

const CHAT_TIMEOUT_MS = 58_000;
const POLL_INTERVAL_MS = 1_000;

const sleep = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

function getConfig() {
  const token = process.env.COZE_PAT_TOKEN;
  const botId = process.env.COZE_BOT_ID;
  const userId = process.env.COZE_USER_ID;
  const baseUrl = (process.env.COZE_API_BASE_URL || "https://api.coze.com").replace(
    /\/$/,
    "",
  );

  const missing = [
    !token && "COZE_PAT_TOKEN",
    !botId && "COZE_BOT_ID",
    !userId && "COZE_USER_ID",
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(`服务端缺少环境变量：${missing.join("、")}`);
  }

  return {
    token: token as string,
    botId: botId as string,
    userId: userId as string,
    baseUrl,
  };
}

async function cozeRequest<T>({
  label,
  url,
  token,
  deadline,
  init,
}: {
  label: string;
  url: string;
  token: string;
  deadline: number;
  init?: RequestInit;
}): Promise<T> {
  const remainingTime = deadline - Date.now();

  if (remainingTime <= 0) {
    throw new Error("等待 Coze 回答超时（60 秒）");
  }

  let response: Response;

  try {
    response = await fetch(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...init?.headers,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(remainingTime),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new Error("等待 Coze 回答超时（60 秒）");
    }
    throw error;
  }

  const rawText = await response.text();
  let result: CozeResponse<T> | null = null;

  try {
    result = rawText ? (JSON.parse(rawText) as CozeResponse<T>) : null;
  } catch {
    // 非 JSON 响应仍然会在控制台打印，并原样返回为错误信息。
  }

  console.log(`[Coze][${label}] HTTP status:`, response.status);
  console.log(
    "Coze raw result:",
    JSON.stringify(result ?? rawText, null, 2),
  );
  console.log(`[Coze][${label}] error code:`, result?.code ?? "无");
  console.log(
    `[Coze][${label}] error message:`,
    result?.msg || result?.message || "无",
  );

  if (!response.ok) {
    throw new CozeApiError(
      result?.msg ||
        result?.message ||
        rawText ||
        `Coze API HTTP ${response.status}`,
      result?.code,
      response.status,
      result ?? rawText,
    );
  }

  if (!result) {
    throw new CozeApiError(
      rawText || "Coze API 返回了空响应",
      undefined,
      502,
      rawText,
    );
  }

  if (typeof result.code === "number" && result.code !== 0) {
    throw new Error(
      `Coze API 错误码：${result.code}，错误信息：${
        result.msg || result.message || "未知错误"
      }`,
    );
  }

  if (result.data === undefined || result.data === null) {
    throw new CozeApiError(
      result.msg || "Coze API 响应中没有 data",
      result.code,
      502,
      result,
    );
  }

  return result.data;
}

async function waitForChat({
  baseUrl,
  token,
  conversationId,
  chatId,
  deadline,
}: {
  baseUrl: string;
  token: string;
  conversationId: string;
  chatId: string;
  deadline: number;
}): Promise<ChatData> {
  while (Date.now() < deadline) {
    const chat = await cozeRequest<ChatData>({
      label: "retrieve chat",
      url: `${baseUrl}/v3/chat/retrieve?conversation_id=${encodeURIComponent(
        conversationId,
      )}&chat_id=${encodeURIComponent(chatId)}`,
      token,
      deadline,
    });

    if (chat.status === "completed") {
      return chat;
    }

    if (["failed", "canceled"].includes(chat.status)) {
      throw new CozeApiError(
        chat.last_error?.msg || `Coze Chat 状态为 ${chat.status}`,
        chat.last_error?.code,
        502,
        chat,
      );
    }

    const remainingTime = deadline - Date.now();
    if (remainingTime <= 0) break;

    await sleep(Math.min(POLL_INTERVAL_MS, remainingTime));
  }

  throw new Error("等待 Coze 回答超时（60 秒）");
}

export async function POST(request: Request) {
  const deadline = Date.now() + CHAT_TIMEOUT_MS;

  try {
    const body = (await request.json()) as {
      message?: unknown;
      conversationId?: unknown;
    };
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const previousConversationId =
      typeof body.conversationId === "string" ? body.conversationId.trim() : "";

    if (!message) {
      return NextResponse.json({ error: "请输入问题" }, { status: 400 });
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: "问题过长，请控制在 2000 字以内" },
        { status: 400 },
      );
    }

    const { token, botId, userId, baseUrl } = getConfig();
    const conversationQuery = previousConversationId
      ? `?conversation_id=${encodeURIComponent(previousConversationId)}`
      : "";

    // 第一步：创建 Chat。非流式调用通常先返回 created / in_progress。
    const createdChat = await cozeRequest<ChatData>({
      label: "create chat",
      url: `${baseUrl}/v3/chat${conversationQuery}`,
      token,
      deadline,
      init: {
        method: "POST",
        body: JSON.stringify({
          bot_id: botId,
          user_id: userId,
          stream: false,
          auto_save_history: true,
          additional_messages: [
            {
              role: "user",
              content: message,
              content_type: "text",
            },
          ],
        }),
      },
    });

    if (!createdChat.id || !createdChat.conversation_id) {
      throw new CozeApiError(
        "Coze 创建 Chat 后没有返回 chat id 或 conversation id",
        undefined,
        502,
        createdChat,
      );
    }

    // 第二步：如果未完成，持续查询 Chat 状态。
    const completedChat =
      createdChat.status === "completed"
        ? createdChat
        : await waitForChat({
            baseUrl,
            token,
            conversationId: createdChat.conversation_id,
            chatId: createdChat.id,
            deadline,
          });

    // 第三步：Chat 完成后，单独查询消息列表。
    const messages = await cozeRequest<CozeMessage[]>({
      label: "list messages",
      url: `${baseUrl}/v3/chat/message/list?conversation_id=${encodeURIComponent(
        completedChat.conversation_id,
      )}&chat_id=${encodeURIComponent(completedChat.id)}`,
      token,
      deadline,
    });

    // 第四步：只提取 Coze 标记为最终 answer 的助手消息。
    const answer = messages
      .filter(
        (item) =>
          item.role === "assistant" &&
          item.type === "answer" &&
          typeof item.content === "string",
      )
      .map((item) => item.content!.trim())
      .filter(Boolean)
      .join("\n\n");

    if (!answer) {
      throw new CozeApiError(
        "Coze Chat 已完成，但消息列表中没有 type=answer 的内容",
        undefined,
        502,
        messages,
      );
    }

    return NextResponse.json({
      answer,
      conversationId: completedChat.conversation_id,
    });
  } catch (error) {
    console.error("[POST /api/chat]", error);

    if (error instanceof CozeApiError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          cozeResponse: error.rawResponse,
        },
        { status: error.httpStatus },
      );
    }

    const message =
      error instanceof Error ? error.message : "服务暂时不可用，请稍后重试";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
