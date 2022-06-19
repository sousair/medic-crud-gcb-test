/* eslint-disable @typescript-eslint/no-unused-vars */
import { IAddressInquiryAdapter } from '@domain/adapters/address-inquiry';
import { Address } from '@domain/models/address';
import { IFindOneAddressRepository } from '@domain/repositories/address/find-one';
import { IInsertAddressRepository } from '@domain/repositories/address/insert';
import { IFindOrInsertAddressUseCase } from '@domain/use-cases/find-or-insert-address';
import { failure, Failure, Success, success } from '@utils/either';
import { FindOrInsertAddressUseCase } from '../find-or-insert-address';

describe('FindOrInsertAddress UseCase', () => {
  let sut: IFindOrInsertAddressUseCase;
  let findOneAddressRepositoryStub: IFindOneAddressRepository;
  let addressInquiryAdapterStub: IAddressInquiryAdapter;
  let insertAddressRepositoryStub: IInsertAddressRepository;

  let findOrInsertAddressParams: IFindOrInsertAddressUseCase.Params;
  let addressInquiryResult;

  beforeEach(() => {
    findOrInsertAddressParams = {
      zipCode: '00000000',
    };

    addressInquiryResult = {
      street: 'anyStreetName',
      neighborhood: 'anyNeighborhoodName',
      city: 'anyCityName',
      state: 'anyStateName',
      zipCode: 'anyZipCode',
    };

    class FindOneAddressRepositoryStub implements IFindOneAddressRepository {
      async findOne(
        _params: Partial<Address>
      ): IFindOneAddressRepository.Result {
        return Promise.resolve(null);
      }
    }

    class AddressInquiryAdapterStub implements IAddressInquiryAdapter {
      async execute(
        _params: IAddressInquiryAdapter.Params
      ): IAddressInquiryAdapter.Result {
        return Promise.resolve(success(addressInquiryResult));
      }
    }

    class InsertAddressRepositoryStub implements IInsertAddressRepository {
      async insert(_params: Partial<Address>): IInsertAddressRepository.Result {
        return Promise.resolve(success(new Address({ id: 'addressId' })));
      }
    }

    findOneAddressRepositoryStub = new FindOneAddressRepositoryStub();
    addressInquiryAdapterStub = new AddressInquiryAdapterStub();
    insertAddressRepositoryStub = new InsertAddressRepositoryStub();

    sut = new FindOrInsertAddressUseCase(
      findOneAddressRepositoryStub,
      addressInquiryAdapterStub,
      insertAddressRepositoryStub
    );
  });

  test('Should call FindOneAddressRepository', async () => {
    const findOneAddressRepositorySpy = jest.spyOn(
      findOneAddressRepositoryStub,
      'findOne'
    );

    await sut.findOrInsert(findOrInsertAddressParams);

    expect(findOneAddressRepositorySpy).toBeCalledTimes(1);
    expect(findOneAddressRepositorySpy).toHaveBeenCalledWith({
      zipCode: findOrInsertAddressParams.zipCode,
    });
  });

  test('Should return success with Address when FindOneAddressRepository returns a Address', async () => {
    jest
      .spyOn(findOneAddressRepositoryStub, 'findOne')
      .mockResolvedValueOnce(new Address({ id: 'addressId' }));

    const result = await sut.findOrInsert(findOrInsertAddressParams);

    expect(result).toBeInstanceOf(Success);
    expect(result).toStrictEqual(success(new Address({ id: 'addressId' })));
  });

  test('Should call AddressInquiryAdapter with correct values', async () => {
    const addressInquiryAdapterSpy = jest.spyOn(
      addressInquiryAdapterStub,
      'execute'
    );

    await sut.findOrInsert(findOrInsertAddressParams);

    expect(addressInquiryAdapterSpy).toBeCalledTimes(1);
    expect(addressInquiryAdapterSpy).toHaveBeenCalledWith({
      zipCode: findOrInsertAddressParams.zipCode,
    });
  });

  test('Should return failure when AddressInquiryAdapter returns failure', async () => {
    jest
      .spyOn(addressInquiryAdapterStub, 'execute')
      .mockResolvedValueOnce(failure({ message: 'anyMessage' }));

    const result = await sut.findOrInsert(findOrInsertAddressParams);

    expect(result).toBeInstanceOf(Failure);
  });

  test('Should call InsertAddressRepository with correct values', async () => {
    const insertAddressRepositorySpy = jest.spyOn(
      insertAddressRepositoryStub,
      'insert'
    );

    await sut.findOrInsert(findOrInsertAddressParams);

    expect(insertAddressRepositorySpy).toHaveBeenCalledTimes(1);
    expect(insertAddressRepositorySpy).toHaveBeenCalledWith(
      addressInquiryResult
    );
  });

  test('Should return failure when InsertAddressRepository returns failure', async () => {
    jest
      .spyOn(insertAddressRepositoryStub, 'insert')
      .mockResolvedValueOnce(failure({ message: 'anyMessage' }));

    const result = await sut.findOrInsert(findOrInsertAddressParams);

    expect(result).toBeInstanceOf(Failure);
  });

  test('Should return success with Address on success', async () => {
    const result = await sut.findOrInsert(findOrInsertAddressParams);

    expect(result).toBeInstanceOf(Success);
    expect(result).toStrictEqual(success(new Address({ id: 'addressId' })));
  });
});
