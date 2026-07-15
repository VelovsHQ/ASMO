import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, context } = await req.json();

  // TODO: Inject real data grounding from 'context' here before calling model.
  // When backend is wired up, we will retrieve relevant market data and append it as a system or user message here.

  const result = streamText({
    model: anthropic('claude-3-5-sonnet-20240620'),
    system: "You are ASMO, an elite AI Market Intelligence assistant. Provide concise, confident analysis of market conditions. Do not include disclaimers about being an AI or giving financial advice. Be direct, authoritative, and data-driven.",
    messages,
  });

  return result.toDataStreamResponse();
}
