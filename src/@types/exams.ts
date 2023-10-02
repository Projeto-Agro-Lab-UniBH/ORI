import { Option } from "../interfaces/Option";

export type Exams = {
  id: string;
  patientId: string;
  username: string;
  execution_date: string;
  runtime: string;
  execution_period: string;
  responsible_person: string;
  type_of_exam: string;
  exam_name: string;
  diagnosis: Option[];
  prognosis: string;
  description_of_treatment: string;
  createdAt: Date;
  updatedAt: Date;
}