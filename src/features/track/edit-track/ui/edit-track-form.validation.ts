import {z} from "zod";

export const editTrackSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title is required")
        .max(100, "Title must be at most 100 characters"),
    lyrics: z
        .string()
        .trim()
        .max(5000, "Lyrics must be at most 5000 characters"),
    releaseDate: z.string().nullable(),
    tagIds: z.array(z.string()).max(5, "Maximum 5 tags allowed"),
    artistsIds: z.array(z.string()).max(5, "Maximum 5 artists allowed"),
})

export type EditTrackFormValues = z.infer<typeof editTrackSchema>

export const validateEditTrackForm = (values: EditTrackFormValues) => {
    return editTrackSchema.safeParse(values)
}
