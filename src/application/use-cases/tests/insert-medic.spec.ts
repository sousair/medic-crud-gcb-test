/* eslint-disable @typescript-eslint/no-unused-vars */
import { Medic } from '@domain/models/medic';
import { MedicAddress } from '@domain/models/medic-address';
import { Specialty } from '@domain/models/specialty';
import { IInsertMedicRepository } from '@domain/repositories/medic/insert';
import { IFindOrInsertSpecialtyUseCase } from '@domain/use-cases/find-or-insert-specialty';
import { IInsertMedicUseCase } from '@domain/use-cases/insert-medic';
import { IInsertMedicAddressUseCase } from '@domain/use-cases/insert-medic-address';
import { Failure, failure, success, Success } from '@utils/either';
import { InsertMedicUseCase } from '../insert-medic';

describe('InsertMedic UseCase', () => {
  let sut: IInsertMedicUseCase;
  let insertMedicAddressUseCaseStub: IInsertMedicAddressUseCase;
  let findOrInsertSpecialtyUseCaseStub: IFindOrInsertSpecialtyUseCase;
  let insertMedicRepositoryStub: IInsertMedicRepository;

  let insertMedicParams: IInsertMedicUseCase.Params;

  beforeEach(() => {
    insertMedicParams = {
      name: 'anyName',
      crm: '1234567',
      landline: 1112345678,
      phone: 11912345678,
      zipCode: '12345678',
      addressNumber: '123',
      addressComplement: 'anyComplement',
      specialties: ['pediatra', 'ginecologista'],
    };

    class InsertMedicAddressUseCaseStub implements IInsertMedicAddressUseCase {
      async insert(
        _params: IInsertMedicAddressUseCase.Params
      ): IInsertMedicAddressUseCase.Result {
        return Promise.resolve(
          success(
            new MedicAddress({
              id: 'medicAddressId',
            })
          )
        );
      }
    }

    class FindOrInsertSpecialtyUseCaseStub implements IFindOrInsertSpecialtyUseCase
    {
      async findOrInsert(
        _params: IFindOrInsertSpecialtyUseCase.Params
      ): IFindOrInsertSpecialtyUseCase.Result {
        return Promise.resolve(success(new Specialty({ id: 'specialtyId' })));
      }
    }

    class InsertMedicRepositoryStub implements IInsertMedicRepository {
      async insert(
        params: IInsertMedicRepository.Params
      ): IInsertMedicRepository.Result {
        return Promise.resolve(success(new Medic({ id: 'medicId' })));
      }
    }

    insertMedicAddressUseCaseStub = new InsertMedicAddressUseCaseStub();
    findOrInsertSpecialtyUseCaseStub = new FindOrInsertSpecialtyUseCaseStub();
    insertMedicRepositoryStub = new InsertMedicRepositoryStub();

    sut = new InsertMedicUseCase(
      insertMedicAddressUseCaseStub,
      findOrInsertSpecialtyUseCaseStub,
      insertMedicRepositoryStub
    );
  });

  test('Should return failure on has less than 2 specialties', async () => {
    insertMedicParams.specialties = ['pediatra'];

    const result = await sut.insert(insertMedicParams);

    expect(result).toBeInstanceOf(Failure);
  });

  test('Should call InsertMedicAddressUseCase with correct values', async () => {
    const insertMedicAddressUseCaseInsertSpy = jest.spyOn(
      insertMedicAddressUseCaseStub,
      'insert'
    );

    await sut.insert(insertMedicParams);

    expect(insertMedicAddressUseCaseInsertSpy).toHaveBeenCalledTimes(1);
    expect(insertMedicAddressUseCaseInsertSpy).toHaveBeenCalledWith({
      zipCode: insertMedicParams.zipCode,
      addressNumber: insertMedicParams.addressNumber,
      addressComplement: insertMedicParams.addressComplement,
    });
  });

  test('Should return failure when InsertMedicAddressUseCase returns failure', async () => {
    jest
      .spyOn(insertMedicAddressUseCaseStub, 'insert')
      .mockResolvedValueOnce(failure({ message: 'anyMessage' }));

    const result = await sut.insert(insertMedicParams);

    expect(result).toBeInstanceOf(Failure);
  });

  test('Should call FindOrInsertSpecialtyUseCase with correct values', async () => {
    const findOrInsertSpecialtyUseCaseSpy = jest.spyOn(
      findOrInsertSpecialtyUseCaseStub,
      'findOrInsert'
    );

    await sut.insert(insertMedicParams);

    expect(findOrInsertSpecialtyUseCaseSpy).toHaveBeenCalledTimes(
      insertMedicParams.specialties.length
    );

    for (const specialty of insertMedicParams.specialties) {
      expect(findOrInsertSpecialtyUseCaseSpy).toHaveBeenCalledWith({
        specialty,
      });
    }
  });

  test('Should return failure when FindOrInsertSpecialtyUseCase returns failure', async () => {
    jest
      .spyOn(findOrInsertSpecialtyUseCaseStub, 'findOrInsert')
      .mockResolvedValueOnce(failure({ message: 'anyMessage' }));

    const result = await sut.insert(insertMedicParams);

    expect(result).toBeInstanceOf(Failure);
  });

  test('Should call InsertMedicRepository with correct values', async () => {
    const insertMedicRepositorySpy = jest.spyOn(
      insertMedicRepositoryStub,
      'insert'
    );

    await sut.insert(insertMedicParams);

    expect(insertMedicRepositorySpy).toHaveBeenCalledTimes(1);
    const {
      zipCode,
      addressNumber,
      addressComplement,
      specialties,
      ...insertMedicRepositoryParams
    } = insertMedicParams;
    expect(insertMedicRepositorySpy).toHaveBeenCalledWith({
      ...insertMedicRepositoryParams,
      medicAddressId: 'medicAddressId',
      specialtiesIds: new Array(specialties.length).fill('specialtyId'),
    });
  });

  test('Should return failure when InsertMedicRepository returns failure', async () => {
    jest
      .spyOn(insertMedicRepositoryStub, 'insert')
      .mockResolvedValueOnce(failure({ message: 'anyMessage' }));

    const result = await sut.insert(insertMedicParams);

    expect(result).toBeInstanceOf(Failure);
  });

  test('Should return success with Medic on success', async () => {
    const result = await sut.insert(insertMedicParams);

    expect(result).toBeInstanceOf(Success);
    expect(result).toStrictEqual(success(new Medic({ id: 'medicId' })));
  });
});
