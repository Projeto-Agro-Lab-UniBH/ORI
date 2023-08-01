import { z } from "zod";

export const editPatientProfileFormSchema = z.object({
  name: z.string().nonempty(),
  owner: z.string(),
  specie: z.string(),
  race: z.string(),
  gender: z.any(),
  weight: z.string(),
  prognosis: z.any(),
  diagnosis: z.any(),
  physical_shape: z.any(),
  entry_date: z.string(),
  departure_date: z.string(),
});

export type editPatientProfileFormData = z.infer<typeof editPatientProfileFormSchema>;