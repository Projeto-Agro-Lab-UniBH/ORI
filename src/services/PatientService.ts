import { type } from 'os';
import { Patient } from '../interfaces/Patient';
import { api } from '../providers/Api';

type patientProfileResponse = Patient;
type listAllPatientsResponse = Pick<Patient, 'id' | 'profile_photo' | 'name' | 'specie' | 'gender' | 'type' | 'weight' | 'situation' | 'diagnosis' | 'physical_shape'>;
type editPatientDataRequest = Partial<
	Pick<
		Patient,
		'profile_photo' | 'name' | 'owner' | 'specie' | 'race' | 'gender' | 'type' | 'weight' | 'situation' | 'diagnosis' | 'physical_shape' | 'entry_date' | 'departure_date'
	>
>;

function editPatientData(
	id: any,
	{ profile_photo, name, owner, specie, gender, type, weight, situation, diagnosis, physical_shape, entry_date, departure_date, race }: editPatientDataRequest
) {
	return api.patch<patientProfileResponse>(`/animal/${id}`, {
		profile_photo,
		name,
		owner,
		specie,
		race,
		gender,
		type,
		weight,
		situation,
		diagnosis,
		physical_shape,
		entry_date,
		departure_date,
	});
}

function getPatientProfile(id: string) {
	return api.get<patientProfileResponse>(`/animal/${id}`);
}

function filterByAnimalType(type: string) {
	return api.get<listAllPatientsResponse[]>(`/animal/filter/${type}`);
}

function listAllPatients() {
	return api.get<listAllPatientsResponse[] | null>('/animal/');
}

export const PatientService = {
	patientProfile: getPatientProfile,
	listAllPatients,
	filterByAnimalType,
	editPatientData,
};
