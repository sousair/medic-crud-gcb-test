export class Specialty {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(data: Partial<Specialty>) {
    if (data) Object.assign(this, data);
  }
}
