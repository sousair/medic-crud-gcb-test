/* eslint-disable @typescript-eslint/no-unused-vars */
import { Address } from '@domain/models/address';
import { MedicAddress } from '@domain/models/medic-address';
import { IInsertMedicAddressRepository } from '@domain/repositories/medic-address/insert';
import { IFindOrInsertAddressUseCase } from '@domain/use-cases/find-or-insert-address';
import { IInsertMedicAddressUseCase } from '@domain/use-cases/insert-medic-address';
import { failure, Failure, Success, success } from '@utils/either';
import { InsertMedicAddressUseCase } from '../insert-medic-address';

describe('InsertMedicAddress UseCase', () => {
  let sut: IInsertMedicAddressUseCase;
  let findOrInsertAddressUseCaseStub: IFindOrInsertAddressUseCase;
  let insertMedicAddressRepositoryStub: IInsertMedicAddressRepository;

  let insertMedicAddressParams: IInsertMedicAddressUseCase.Params;

  beforeEach(() => {
    insertMedicAddressParams = {
      addressComplement: 'anyComplement',
      addressNumber: 'anyNumber',
      zipCode: '00000000',
    };

    class FindOrInsertAddressUseCaseStub implements IFindOrInsertAddressUseCase
    {
      async findOrInsert(
        _params: IFindOrInsertAddressUseCase.Params
      ): IFindOrInsertAddressUseCase.Result {
        return Promise.resolve(success(new Address({ id: 'addressId' })));
      }
    }

    class InsertMedicAddressRepositoryStub implements IInsertMedicAddressRepository
    {
      async insert(
        params: IInsertMedicAddressRepository.Params
      ): IInsertMedicAddressRepository.Result {
        return Promise.resolve(
          success(new MedicAddress({ id: 'medicAddressId' }))
        );
      }
    }

    findOrInsertAddressUseCaseStub = new FindOrInsertAddressUseCaseStub();
    insertMedicAddressRepositoryStub = new InsertMedicAddressRepositoryStub();

    sut = new InsertMedicAddressUseCase(
      findOrInsertAddressUseCaseStub,
      insertMedicAddressRepositoryStub
    );
  });

  test('Should call FindOrInsertAddressUseCase with correct values', async () => {
    const insertAddressUseCaseSpy = jest.spyOn(
      findOrInsertAddressUseCaseStub,
      'findOrInsert'
    );

    await sut.insert(insertMedicAddressParams);

    expect(insertAddressUseCaseSpy).toHaveBeenCalledTimes(1);
    expect(insertAddressUseCaseSpy).toHaveBeenCalledWith({
      zipCode: insertMedicAddressParams.zipCode,
    });
  });

  test('Should return failure when FindOrInsertAddressUseCase returns failure', async () => {
    jest
      .spyOn(findOrInsertAddressUseCaseStub, 'findOrInsert')
      .mockResolvedValueOnce(failure({ message: 'anyMessage' }));

    const result = await sut.insert(insertMedicAddressParams);

    expect(result).toBeInstanceOf(Failure);
  });

  test('Should call InsertMedicAddressRepository with correct values', async () => {
    const insertMedicAddressRepository = jest.spyOn(
      insertMedicAddressRepositoryStub,
      'insert'
    );

    await sut.insert(insertMedicAddressParams);

    expect(insertMedicAddressRepository).toHaveBeenCalledTimes(1);
    const { zipCode, ...insertMedicAddressRepoParams } =
      insertMedicAddressParams;
    expect(insertMedicAddressRepository).toHaveBeenCalledWith({
      ...insertMedicAddressRepoParams,
      addressId: 'addressId',
    });
  });

  test('Should return failure when InsertMedicAddressRepository returns failure', async () => {
    jest
      .spyOn(insertMedicAddressRepositoryStub, 'insert')
      .mockResolvedValueOnce(failure({ message: 'anyMessage' }));

    const result = await sut.insert(insertMedicAddressParams);

    expect(result).toBeInstanceOf(Failure);
  });

  test('Should return success with MedicAddress on success', async () => {
    const result = await sut.insert(insertMedicAddressParams);

    expect(result).toBeInstanceOf(Success);
    expect(result).toStrictEqual(
      success(new MedicAddress({ id: 'medicAddressId' }))
    );
  });
});
