import { Option } from './utils';

export interface Patient {
	id: string;
	profile_photo: string;
	name: string;
	owner: string;
	specie: string;
	race: string;
	gender: string;
	type: string;
	weight: string;
	situation: string;
	diagnosis: Option[];
	physical_shape: string;
	entry_date: string;
	departure_date: string;
}
