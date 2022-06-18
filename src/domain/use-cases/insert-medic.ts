import { Either } from '@utils/either';
import { Medic } from '../models/medic';

export namespace IInsertMedicUseCase {
  export type Params = {
    name: string;
    crm: string;
    landline: number;
    phone: number;
    zipCode: string;
    addressNumber: string;
    addressComplement?: string;
    specialties: string[];
  };
  export type Result = Promise<Either<{ message: string }, Medic>>;
}

export interface IInsertMedicUseCase {
  insert(params: IInsertMedicUseCase.Params): IInsertMedicUseCase.Result;
}
