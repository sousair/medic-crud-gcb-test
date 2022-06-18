import { Either } from '@utils/either';
import { Medic } from '@domain/models/medic';

export namespace IInsertMedicRepository {
  export type Params = {
    name: string;
    crm: string;
    landline: number;
    phone: number;
    medicAddressId: string;
    specialtiesIds: string[];
  };

  export type Result = Promise<Either<{ message: string }, Medic>>;
}

export interface IInsertMedicRepository {
  insert: (
    params: IInsertMedicRepository.Params
  ) => IInsertMedicRepository.Result;
}
