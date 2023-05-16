import { api } from "../providers/Api"

type PatientResponse = {
  id: string;
  profile_photo: string;
  name: string;
  owner: string;
  specie: string;
  gender: string;
  type: string;
  weight: string;
  physical_shape: string;
  entry_date: string;
  departure_date: string;
}

function patientProfile(id: string) {
  return api.get<PatientResponse>(`/animal/${id}`)
}

function filterByAnimalType(type: string) {
  return api.get<PatientResponse[]>(`/animal/filter/${type}`)
}

function listAllPatients() {
  return api.get<PatientResponse[]>('/animal/')
}

export const PatientService = { patientProfile, filterByAnimalType, listAllPatients }