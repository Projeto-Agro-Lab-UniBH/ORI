import { Page } from "./page";
import { Patient } from "./patient";
import { Option } from "../interfaces/Option";
import { Exams } from "./exams";
import { Files } from "./file";
import { Reports } from "./reports";

export type DashboardPatientDataResponse = Page<
  Pick<
    Patient,
    | "id"
    | "profile_photo"
    | "name"
    | "specie"
    | "race"
    | "gender"
    | "weight"
    | "prognosis"
    | "diagnosis"
    | "physical_shape"
    | "exams"
  >
>;

export type SearchPatientResponse = {
  id: string;
  profile_photo: string;
  name: string;
  specie: string;
  race: string;
}

export type GetPatientClipboardResponse = {
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

export type GetPatientEditResponse = {
  profile_photo: string;
  name: string;
  owner: string;
  specie: string;
  race: string;
  gender: string;
  weight: string;
  prognosis: string;
  diagnosis: Option[];
  physical_shape: string;
  entry_date: string;
  departure_date: string;
};

export type PatchPatientResponse = {
  id: string;
  profile_photo: string;
  name: string;
  owner: string;
  specie: string;
  race: string;
  gender: string;
  weight: string;
  prognosis: string;
  diagnosis: Option[];
  physical_shape: string;
  entry_date: string;
  departure_date: string;
};

export type ListReportsResponse = {
	id: string;
	patientId: string;
	shift: string;
	author: string;
	title: string;
	report_text: string;
	filename: string;
  fileUrl: string;
  fileSize: number;
	createdAt: string;
	updatedAt: string;
};

export type ListExamsResponse = {
  id: string;
  patientId: string;
  date: string;
  author: string;
  type_of_exam: string;
  annotations: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
}

export type ListFilesResponse = {
  id: string;
  patientId: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
}

export type UploadImageResponse = {
  imageUrl: string;
};