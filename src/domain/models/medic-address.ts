import { Address } from './address';

export class MedicAddress {
  id: string;
  addressId: string;
  address: Address;
  number: string;
  complement: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(data: Partial<MedicAddress>) {
    if (data) Object.assign(this, data);
  }
}
