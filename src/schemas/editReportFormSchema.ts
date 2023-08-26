import { z } from "zod";

export const editReportFormSchema = z.object({
  shift: z.any(),
  author: z.string().nonempty("Nome completo não pode ser nulo"),
  title: z.string().nonempty('Título não pode ser nulo'),
  report_text: z.string().nonempty("Relatório não pode ser nulo"),
});

export type editReportFormData = z.infer<typeof editReportFormSchema>;