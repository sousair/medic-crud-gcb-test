export class Address {
  id: string;
  postalCode: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(data: Partial<Address>) {
    if (data) Object.assign(this, data);
  }
}
