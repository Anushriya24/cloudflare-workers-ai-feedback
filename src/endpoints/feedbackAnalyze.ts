import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

export class FeedbackAnalyze extends OpenAPIRoute {
  schema = {
    tags: ["Feedback"],
    summary: "Analyze a piece of feedback (summary, sentiment, themes) using Workers AI",
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              text: z.string().min(1),
            }),
          },
        },
      },
    },
    responses: {
      "200": {
        description: "AI analysis result",
        content: {
          "application/json": {
            schema: z.object({
              summary: z.string(),
              sentiment: z.enum(["Positive", "Neutral", "Negative"]),
              themes: z.array(z.string()),
              model: z.string(),
            }),
          },
        },
      },
    },
  };

  async handle(c: any) {
    const { text } = (await c.req.json()) as { text: string };
    const env = c.env as any;

    // Keep it lightweight and deterministic-ish
    const model = "@cf/meta/llama-3.1-8b-instruct";

    const prompt = `
You are a product analyst. Analyze the customer feedback below.

Return ONLY valid JSON with this exact shape:
{
  "summary": "one short sentence",
  "sentiment": "Positive" | "Neutral" | "Negative",
  "themes": ["Theme1", "Theme2", "Theme3"]
}

Feedback:
"""${text}"""
`;

    const result = await env.AI.run(model, { prompt }); // Workers AI binding :contentReference[oaicite:2]{index=2}

    // Workers AI often returns { response: "..." } for LLMs. We'll handle both string + object.
    const raw = typeof result === "string" ? result : (result?.response ?? JSON.stringify(result));

    // Try to parse JSON safely. If the model adds extra text, we salvage the JSON block.
    let parsed: any = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    }

    // Fallback if parsing still fails
    if (!parsed || !parsed.summary || !parsed.sentiment || !parsed.themes) {
      parsed = {
        summary: "Could not reliably parse AI output; please try again.",
        sentiment: "Neutral",
        themes: ["Uncategorized"],
      };
    }

    return c.json({
      ...parsed,
      model,
    });
  }
}
