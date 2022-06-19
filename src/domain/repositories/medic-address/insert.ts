import { MedicAddress } from '@domain/models/medic-address';
import { Either } from '@utils/either';

export interface IInsertMedicAddressRepository {
  insert(
    params: IInsertMedicAddressRepository.Params
  ): IInsertMedicAddressRepository.Result;
}

export namespace IInsertMedicAddressRepository {
  export type Params = {
    addressId: string;
    addressNumber: string;
    addressComplement: string;
  };

  export type Result = Promise<Either<{ message: string }, MedicAddress>>;
}
