import { Specialty } from './../../models/specialty';
import { Either } from './../../../utils/either';
export interface IInsertSpecialtyRepository {
  insert(
    params: IInsertSpecialtyRepository.Params
  ): IInsertSpecialtyRepository.Result;
}

export namespace IInsertSpecialtyRepository {
  export type Params = {
    name: string;
  };

  export type Result = Promise<Either<{ message: string }, Specialty>>;
}
