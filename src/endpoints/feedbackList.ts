import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

export class FeedbackList extends OpenAPIRoute {
	schema = {
		tags: ["Feedback"],
		summary: "List analyzed customer feedback",
		responses: {
			"200": {
				description: "A list of feedback with sentiment and themes",
				content: {
					"application/json": {
						schema: z.object({
							feedback: z.array(
								z.object({
									text: z.string(),
									sentiment: z.string(),
									theme: z.string(),
								})
							),
						}),
					},
				},
			},
		},
	};

	async handle(c: any) {
		return c.json({
			feedback: [
				{
					text: "The dashboard is confusing and slow",
					sentiment: "Negative",
					theme: "UX",
				},
				{
					text: "Pricing is too high for small teams",
					sentiment: "Negative",
					theme: "Pricing",
				},
				{
					text: "Love the new analytics feature",
					sentiment: "Positive",
					theme: "Features",
				},
			],
		});
	}
}

