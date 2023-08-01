import { z } from "zod";

export const registerReportFormSchema = z.object({
  shift: z.any(),
  author: z.string().nonempty("Nome completo não pode ser nulo"),
  report_text: z.string().nonempty("Relatório não pode ser nulo"),
  // attachments: z.string(),
});

export type registerReportFormData = z.infer<typeof registerReportFormSchema>;