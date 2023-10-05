import { Page } from "./page";
import { Option } from "../interfaces/Option";
import { Exams } from "./exams";
import { Reports } from "./reports";
import { Hospitalizations } from "./hospitalizations";
import { Surgery } from "./surgery";
import { Vaccine } from "./vaccine";

type DashboardPatientData = {
  id: string;
  profile_photo?: string;
  name: string;
  race: string;
  specie: string;
  gender: string;
  physical_shape: string;
  current_weight: string;
  status: string;
  _count: {
    vaccines: number,
    exams: number,
    surgery: number,
    hospitalizations: number,
    reports: number
  }
}

export type DashboardPatientDataResponse = Page<DashboardPatientData>;

export type SearchResponse = {
  id: string;
  profile_photo: string;
  name: string;
  specie: string;
  race: string;
}

export type GetPatientResponse = {
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
  exams: Exams[];
  surgery: Surgery[];
  reports: Reports[];
  vaccines: Vaccine[];
  hospitalizations: Hospitalizations[];
};

export type PatchPatientResponse = {
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
  exams: Exams[];
  reports: Reports[];
  hospitalizations: Hospitalizations[];
};

export type UploadImageResponse = {
  imageUrl: string;
};

export type GetReportResponse = {
  id: string;
  username: string;
  title: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PostReportResponse = {
  id: string;
  username: string;
  title: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PatchReportResponse = {
  id: string;
  username: string;
  title: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export type GetExamResponse = {
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

export type PatchExamResponse = {
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
};

export type PostExamResponse = {
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
};

export type GetHospitalizationResponse = {
  id: string;            
  patientId: string;
  username: string;
  reason: string;      
  prognosis: string;      
  entry_date: string;     
  departure_date: string; 
  notes: string;          
  createdAt: Date;      
  updatedAt: Date;      
}

export type PostHospitalizationResponse = {
  id: string;            
  patientId: string;
  username: string;
  reason: string;      
  prognosis: string;      
  entry_date: string;     
  departure_date: string; 
  notes: string;          
  createdAt: Date;      
  updatedAt: Date;      
}

export type PatchHospitalizationResponse = {
  id: string;            
  patientId: string;
  username: string;
  reason: string;      
  prognosis: string;      
  entry_date: string;     
  departure_date: string; 
  notes: string;          
  createdAt: Date;      
  updatedAt: Date;      
}

export type GetSurgeryResponse = {
  id: string;
  patientId: string;            
  username: string;        
  name_of_surgery: string; 
  risk_level: string;      
  execution_date: string;  
  duration: string;        
  period: string;          
  notes: string;           
  createdAt: Date;       
  updatedAt: Date; 
}

export type PatchSurgeryResponse = {
  id: string;
  patientId: string;            
  username: string;        
  name_of_surgery: string; 
  risk_level: string;      
  execution_date: string;  
  duration: string;        
  period: string;          
  notes: string;           
  createdAt: Date;       
  updatedAt: Date; 
}

export type PostSurgeryResponse = {
  id: string;
  patientId: string;            
  username: string;        
  name_of_surgery: string; 
  risk_level: string;      
  execution_date: string;  
  duration: string;        
  period: string;          
  notes: string;           
  createdAt: Date;       
  updatedAt: Date;  
}

export type GetVaccineResponse = {
  id: string;                   
  patientId: string;            
  username: string;             
  vaccine: string;              
  date_of_vaccination: string;  
  revaccination_date: string;   
  name_of_veterinarian: string; 
  vaccine_code: string;
  age: string;         
  createdAt: Date;            
  updatedAt: Date;      
}

export type PostVaccineResponse = {
  id: string;                   
  patientId: string;            
  username: string;             
  vaccine: string;              
  date_of_vaccination: string;  
  revaccination_date: string;   
  name_of_veterinarian: string; 
  vaccine_code: string;
  age: string;         
  createdAt: Date;            
  updatedAt: Date;      
}

export type PatchVaccineResponse = {
  id: string;                   
  patientId: string;            
  username: string;             
  vaccine: string;              
  date_of_vaccination: string;  
  revaccination_date: string;   
  name_of_veterinarian: string; 
  vaccine_code: string;     
  age: string;    
  createdAt: Date;            
  updatedAt: Date;      
}