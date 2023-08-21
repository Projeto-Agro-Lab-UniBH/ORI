import { z } from "zod";

export const registerExamFormSchema = z.object({
  date: z.string().nonempty("Data de realização não pode ser nulo"),
  type_of_exam: z.string().nonempty("Tipo de exame não pode ser nulo"),
  author: z.string().nonempty("Nome do responsável não pode ser nulo"),
  annotations: z.string().optional()
})

export type registerExamFormData = z.infer<typeof registerExamFormSchema>;