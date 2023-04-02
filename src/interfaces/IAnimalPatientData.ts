export interface IAnimalPatientData {
  id: string;
  photo?: string;
  name: string;
  specie: string;
  owner?: string;
  entry_date?: Date;
  departure_date?: Date;
  physical_shape: string;
  animal_type: string;
  genre: string;
  weight: string;
  situation: string;
  diagnosis: [];
  exams: [];
}