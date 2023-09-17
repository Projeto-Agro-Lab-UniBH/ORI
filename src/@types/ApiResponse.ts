import { Page } from "./page";
import { Patient } from "./patient";

export type DashboardPatientDataResponse = Page<
  Pick<
    Patient,
    "id"| "profile_photo"| "name"| "specie"| "race"| "gender" | "weight" | "prognosis" | "diagnosis" | "physical_shape" | "exams"
  >
>;

export type SearchPatientResponse = Pick<
  Patient,
  "id" | "profile_photo" | "name" | "specie" | "race"
>;
