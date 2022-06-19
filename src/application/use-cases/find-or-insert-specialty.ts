import { IFindOrInsertSpecialtyUseCase } from '@domain/use-cases/find-or-insert-specialty';
import { failure, success } from '@utils/either';
import { IFindOneSpecialtyRepository } from './../../domain/repositories/specialty/find-one';
import { IInsertSpecialtyRepository } from './../../domain/repositories/specialty/insert';

export class FindOrInsertSpecialtyUseCase implements IFindOrInsertSpecialtyUseCase {
  constructor(
    private readonly findOneSpecialtyRepository: IFindOneSpecialtyRepository,
    private readonly insertSpecialtyRepository: IInsertSpecialtyRepository,
  ) {}
  async findOrInsert({
    specialty
  }: IFindOrInsertSpecialtyUseCase.Params): IFindOrInsertSpecialtyUseCase.Result {
    const specialtyFind = await this.findOneSpecialtyRepository.findOne({
      name: specialty
    });

    if (specialtyFind) return success(specialtyFind);

    const insertSpecialtyRes = await this.insertSpecialtyRepository.insert({
      name: specialty
    });

    if (insertSpecialtyRes.isFailure())
      return failure({ message: 'error on insert new specialty'});
    
    return success(insertSpecialtyRes.value);
  }
}
