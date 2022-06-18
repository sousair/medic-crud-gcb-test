import { Specialty } from '@domain/models/specialty';
import { Either } from '@utils/either';

export namespace IFindOrInsertSpecialtyUseCase {
  export type Params = {
    specialty: string;
  };

  export type Result = Promise<Either<{ message: string }, Specialty>>;
}

export interface IFindOrInsertSpecialtyUseCase {
  findOrInsert(
    params: IFindOrInsertSpecialtyUseCase.Params
  ): IFindOrInsertSpecialtyUseCase.Result;
}
