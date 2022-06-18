import { Specialty } from './specialty';
import { MedicAddress } from './medic-address';

export class Medic {
  id: string;
  name: string;
  crm: string;
  landline: number;
  phone: number;
  address: MedicAddress;
  addressId: string;
  specialties: Specialty[];
  specialtiesIds: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(data: Partial<Medic>) {
    if (data) Object.assign(this, data);
  }
}
