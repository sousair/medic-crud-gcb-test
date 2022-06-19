import { IFindOrInsertAddressUseCase } from '@domain/use-cases/find-or-insert-address';
import { IInsertMedicAddressUseCase } from '@domain/use-cases/insert-medic-address';
import { failure, success } from '@utils/either';
import { IInsertMedicAddressRepository } from '@domain/repositories/medic-address/insert';

export class InsertMedicAddressUseCase implements IInsertMedicAddressUseCase {
  constructor(
    private readonly findOrInsertMedicAddress: IFindOrInsertAddressUseCase,
    private readonly insertMedicAddressRepository: IInsertMedicAddressRepository
  ) {}

  async insert({
    zipCode,
    addressNumber,
    addressComplement,
  }: IInsertMedicAddressUseCase.Params): IInsertMedicAddressUseCase.Result {
    const addressRes = await this.findOrInsertMedicAddress.findOrInsert({
      zipCode,
    });

    if (addressRes.isFailure())
      return failure({ message: 'error on insert address' });

    const addressId = addressRes.value.id;

    const medicAddressRes = await this.insertMedicAddressRepository.insert({
      addressId,
      addressNumber,
      addressComplement,
    });

    if (medicAddressRes.isFailure())
      return failure({ message: 'error on insert medic address' });

    return success(medicAddressRes.value);
  }
}
