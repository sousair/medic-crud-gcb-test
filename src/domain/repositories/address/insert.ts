import { Either } from '@utils/either';
import { Address } from '@domain/models/address';

export interface IInsertAddressRepository {
  insert(
    params: IInsertAddressRepository.Params
  ): IInsertAddressRepository.Result;
}

export namespace IInsertAddressRepository {
  export type Params = Partial<Address>;

  export type Result = Promise<Either<{ message: string }, Address>>;
}
