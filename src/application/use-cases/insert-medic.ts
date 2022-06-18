import { IInsertMedicRepository } from '@domain/repositories/medic/insert';
import { IFindOrInsertSpecialtyUseCase } from '@domain/use-cases/find-or-insert-specialty';
import { IInsertMedicUseCase } from '@domain/use-cases/insert-medic';
import { IInsertMedicAddressUseCase } from '@domain/use-cases/insert-medic-address';
import { failure, success } from '@utils/either';

export class InsertMedicUseCase implements IInsertMedicUseCase {
  constructor(
    private readonly insertMedicAddress: IInsertMedicAddressUseCase,
    private readonly findOrInsertSpecialtyUseCase: IFindOrInsertSpecialtyUseCase,
    private readonly insertMedicRepository: IInsertMedicRepository
  ) {}
  async insert({
    name,
    crm,
    landline,
    phone,
    zipCode,
    addressNumber,
    addressComplement,
    specialties,
  }: IInsertMedicUseCase.Params): IInsertMedicUseCase.Result {
    if (specialties.length < 2)
      return failure({ message: 'at least two specialties is required' });

    const medicAddress = await this.insertMedicAddress.insert({
      zipCode,
      addressNumber,
      addressComplement,
    });

    if (medicAddress.isFailure())
      return failure({ message: 'error on insert address' });

    const specialtiesRes = await Promise.all(
      specialties.map((specialtyStr) => {
        return this.findOrInsertSpecialtyUseCase.findOrInsert({
          specialty: specialtyStr,
        });
      })
    );

    const successfullySpecialties = specialtiesRes.map((specialtyRes) => {
      if (specialtyRes.isSuccess()) return specialtyRes.value;
    });

    if (successfullySpecialties.some((specialty) => !specialty))
      return failure({ message: 'error on insert specialties' });

    const medicRes = await this.insertMedicRepository.insert({
      name,
      crm,
      landline,
      phone,
      medicAddressId: medicAddress.value.id,
      specialtiesIds: successfullySpecialties.map((specialty) => specialty.id),
    });

    if (medicRes.isFailure())
      return failure({ message: 'error on insert medic' });

    return success(medicRes.value);
  }
}
