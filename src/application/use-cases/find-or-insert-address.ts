import { IAddressInquiryAdapter } from '@domain/adapters/address-inquiry';
import { IFindOneAddressRepository } from '@domain/repositories/address/find-one';
import { IInsertAddressRepository } from '@domain/repositories/address/insert';
import { IFindOrInsertAddressUseCase } from '@domain/use-cases/find-or-insert-address';
import { failure, success } from '@utils/either';

export class FindOrInsertAddressUseCase implements IFindOrInsertAddressUseCase {
  constructor(
    private readonly findOneAddressRepository: IFindOneAddressRepository,
    private readonly addressInquiryAdapter: IAddressInquiryAdapter,
    private readonly insertAddressRepository: IInsertAddressRepository
  ) {}

  async findOrInsert({
    zipCode,
  }: IFindOrInsertAddressUseCase.Params): IFindOrInsertAddressUseCase.Result {
    const addressFind = await this.findOneAddressRepository.findOne({
      zipCode,
    });

    if (addressFind) return success(addressFind);

    const addressInquiryRes = await this.addressInquiryAdapter.execute({
      zipCode,
    });

    if (addressInquiryRes.isFailure())
      return failure({ message: 'error on search for address' });

    const addressData = addressInquiryRes.value;

    const insertAddressRes = await this.insertAddressRepository.insert(
      addressData
    );

    if (insertAddressRes.isFailure())
      return failure({ message: 'error on insert address' });

    return success(insertAddressRes.value);
  }
}
