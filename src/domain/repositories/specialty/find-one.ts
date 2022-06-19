import { Specialty } from './../../models/specialty';

export interface IFindOneSpecialtyRepository {
  findOne(
    params: IFindOneSpecialtyRepository.Params
  ): IFindOneSpecialtyRepository.Result;
}

export namespace IFindOneSpecialtyRepository {
  export type Params = Partial<Specialty>;

  export type Result = Promise<Specialty | null>;
}
