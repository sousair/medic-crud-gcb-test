import { Address } from '@domain/models/address';

export interface IFindOneAddressRepository {
  findOne(
    params: IFindOneAddressRepository.Params
  ): IFindOneAddressRepository.Result;
}

export namespace IFindOneAddressRepository {
  export type Params = Partial<Address>;

  export type Result = Promise<Address | null>;
}
