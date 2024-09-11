import { z } from "zod";

export const newsListFiltersSchema = z
  .object({
    query: z.string().optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    searchIn: z.string().optional(),
    category: z.string().optional(),
    sources: z.string(),
  })
  .refine(
    (data) =>
      !data.from || !data.to || new Date(data.to) >= new Date(data.from),
    { message: "end-date must be later than start-date", path: ["to"] }
  );
