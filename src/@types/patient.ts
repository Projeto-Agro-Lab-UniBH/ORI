import { Exams } from "./exams";
import { Files } from "./file";
import { Hospitalizations } from "./hospitalizations";
import { Reports } from "./reports";
import { Surgery } from "./surgery";
import { Vaccine } from "./vaccine";

export type Patient = {
  id: string;
  profile_photo?: string;
  age: string;          
  date_of_birth: string;
  pedigree_RGA: string; 
  chip_number: string;  
  name: string;
  owner: string;
  ownerless_patient: boolean;
  specie: string;
  undefined_specie: boolean;
  race: string;
  undefined_race: boolean;
  status: string;
  gender: string;
  physical_shape: string;
  starting_weight: string;
  current_weight: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  files: Files[];
  exams: Exams[];
  surgery: Surgery[];
  hospitalizations: Hospitalizations[]
  reports: Reports[];
  vaccines: Vaccine[];
}
         