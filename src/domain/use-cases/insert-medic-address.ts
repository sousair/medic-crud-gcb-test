import { Either } from '@utils/either';
import { MedicAddress } from '../models/medic-address';

export namespace IInsertMedicAddressUseCase {
  export type Params = {
    zipCode: string;
    addressNumber: string;
    addressComplement: string;
  };
  export type Result = Promise<Either<{ message: string }, MedicAddress>>;
}

export interface IInsertMedicAddressUseCase {
  insert(
    params: IInsertMedicAddressUseCase.Params
  ): IInsertMedicAddressUseCase.Result;
}
