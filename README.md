# Cloudflare Workers AI – Customer Feedback Analyzer

This project is a prototype API built using **Cloudflare Workers**, **Workers AI**, and **OpenAPI 3.1** to analyze customer feedback at scale.

The goal is to demonstrate how Cloudflare’s serverless and AI tooling can be combined to extract actionable product insights from unstructured customer feedback.

---

## What this does

- Accepts raw customer feedback text
- Uses **Workers AI (LLaMA 3.1)** to generate:
  - A concise summary
  - Sentiment classification (Positive / Neutral / Negative)
  - Key product themes
- Exposes all functionality via a fully documented **OpenAPI** interface

---

## API Endpoints

### GET `/api/feedback`
Returns a list of analyzed customer feedback entries (mocked data for demonstration).

---

### POST `/api/feedback/analyze`
Analyzes a single piece of customer feedback using Workers AI.

**Example request**
```json
{
  "text": "The dashboard is confusing and slow and users cannot find billing settings."
}
{
  "summary": "User is frustrated with dashboard usability and performance.",
  "sentiment": "Negative",
  "themes": ["UX", "Performance", "Billing"],
  "model": "@cf/meta/llama-3.1-8b-instruct"
}

Live Demo

OpenAPI documentation and live API:
👉 https://dawn-mouse-3efc.anushriyaroy24.workers.dev
