import { Patient } from '../interfaces/Patient';
import { api } from '../providers/Api';

type listAllPatientsResponse = Pick<Patient, 'id' | 'profile_photo' | 'name' | 'specie' | 'gender' | 'type' | 'weight' | 'situation' | 'physical_shape'>;
type getPatientProfileResponse = Patient;

function getPatientProfile(id: string) {
	return api.get<getPatientProfileResponse>(`/animal/${id}`);
}

function filterByAnimalType(type: string) {
	return api.get<listAllPatientsResponse[]>(`/animal/filter/${type}`);
}

function listAllPatients() {
	return api.get<listAllPatientsResponse[] | null>('/animal/');
}

export const PatientService = { patientProfile: getPatientProfile, listAllPatients, filterByAnimalType };
