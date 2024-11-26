import "server-only";

import { Bot } from "grammy";

class Logger {
  #bot: Bot;
  #chatId: string;

  constructor(token?: string, chatId?: string) {
    if (!token) {
      throw new Error("TELEGRAM_BOT_TOKEN not set");
    }

    if (!chatId) {
      throw new Error("TELEGRAM_CHAT_ID not set");
    }

    this.#bot = new Bot(token);
    this.#chatId = chatId;
  }

  async #send(prefix: string, message: string, details?: unknown) {
    try {
      const fullMessage = details
        ? `${prefix}${message}\n${this.#formatDetails(details)}`
        : `${prefix}${message}`;

      await this.#bot.api.sendMessage(this.#chatId, fullMessage);
    } catch (error) {
      console.error("Error sending message to Telegram", { error });
    }
  }

  #formatDetails(details: unknown): string {
    if (details instanceof Error) {
      return details.message;
    }

    try {
      return JSON.stringify(details, null, 2);
    } catch {
      return String(details);
    }
  }

  async info(message: string, details?: unknown) {
    await this.#send("ℹ️ INFO: ", message, details);
  }

  async warn(message: string, details?: unknown) {
    await this.#send("⚠️ WARN: ", message, details);
  }

  async error(message: string, details?: unknown) {
    await this.#send("❌ ERROR: ", message, details);
  }
}

const log =
  process.env.NODE_ENV === "production"
    ? new Logger(process.env.TELEGRAM_BOT_TOKEN, process.env.TELEGRAM_CHAT_ID)
    : console;

export default log;
