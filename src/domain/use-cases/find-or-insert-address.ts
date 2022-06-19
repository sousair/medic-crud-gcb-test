import { Address } from '@domain/models/address';
import { Either } from '@utils/either';

export interface IFindOrInsertAddressUseCase {
  findOrInsert(
    params: IFindOrInsertAddressUseCase.Params
  ): IFindOrInsertAddressUseCase.Result;
}

export namespace IFindOrInsertAddressUseCase {
  export type Params = {
    zipCode: string;
  };

  export type Result = Promise<Either<{ message: string }, Address>>;
}
