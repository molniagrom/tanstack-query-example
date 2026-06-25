import {z} from "zod";

export const editPlaylistSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title is required")
        .max(100, "Title must be at most 100 characters"),
    description: z
        .string()
        .trim()
        .max(1000, "Description must be at most 1000 characters"),
    tagIds: z.array(z.string()).max(5, "Maximum 5 tags allowed"),
})

export type EditPlaylistFormValues = z.infer<typeof editPlaylistSchema>

export const validateEditPlaylistForm = (values: EditPlaylistFormValues) => {
    return editPlaylistSchema.safeParse(values)
}
