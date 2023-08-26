import { z } from "zod";

export const editUserProfileFormSchema = z.object({
  username: z.string().nonempty(),
  email: z.string().nonempty(),
});

export type editUserProfileFormData = z.infer<typeof editUserProfileFormSchema>;