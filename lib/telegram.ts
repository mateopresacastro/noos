import "server-only";

import { Bot } from "grammy";

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN not set");
}

const bot = new Bot(token);

export async function sendTelegramMessage(message: string) {
  try {
    if (!chatId) throw new Error("chatId not set");
    await bot.api.sendMessage(chatId, message);
  } catch (error) {
    console.error("Error sending message to Telegram", { error });
  }
}
