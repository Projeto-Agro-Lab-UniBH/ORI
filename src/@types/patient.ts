import { Option } from "../interfaces/Option";
import { Exams } from "./exams";
import { Files } from "./file";
import { Reports } from "./reports";

export type Patient = {
  id: string;
  profile_photo?: string;
  name: string;
  owner: string;
  race: string;
  specie: string;
  gender: string;
  weight: string;
  prognosis: string;
  diagnosis: Option[];
  physical_shape: string;
  entry_date: string;
  departure_date: string;
  reports: Reports[];
  exams: Exams[];
  files: Files[];
}