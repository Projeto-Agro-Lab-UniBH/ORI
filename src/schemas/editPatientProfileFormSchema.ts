import { z } from "zod";

export const editPatientProfileFormSchema = z.object({
  name: z
    .string()
    .nonempty({ message: "O paciente precisa de um nome" })
    .transform((name) => {
      return name
        .trim()
        .split(" ")
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1));
        })
        .join(" ");
    }),
  age: z.string(),
  date_of_birth: z.string(),
  pedigree_RGA: z.string(),
  chip_number: z.string(),
  owner: z.string(),
  ownerless_patient: z.boolean(),
  specie: z.string(),
  undefined_specie: z.boolean(),
  race: z.string(),
  undefined_race: z.boolean(),
  status: z.any(),
  gender: z.any(),
  physical_shape: z.any(),
  starting_weight: z.string(),
  current_weight: z.string(),
  notes: z.string().max(1000, { message: "O texto não pode conter mais do que 1000 caracteres."}),
})
.superRefine((field, ctx) => {
  const addCustomIssue = (path: string[], message: string) => {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message,
      path,
    });
  };

  if (!field.owner && !field.ownerless_patient) {
    addCustomIssue(
      ["owner"],
      "Se o paciente não tem o nome do tutor identificado selecione à caixinha abaixo"
    );
  }

  if (!field.specie && !field.undefined_specie) {
    addCustomIssue(
      ["specie"],
      "Se o paciente não possui espécie definiada selecione à caixinha abaixo"
    );
  }

  if (!field.race && !field.undefined_race) {
    addCustomIssue(
      ["race"],
      "Se o paciente não possui raça definiada selecione à caixinha abaixo"
    );
  }
});

export type editPatientProfileFormData = z.infer<typeof editPatientProfileFormSchema>;