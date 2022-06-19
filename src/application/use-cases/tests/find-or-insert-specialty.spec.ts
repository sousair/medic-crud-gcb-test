/* eslint-disable @typescript-eslint/no-unused-vars */
import { Specialty } from '@domain/models/specialty';
import { IFindOneSpecialtyRepository } from '@domain/repositories/specialty/find-one';
import { IInsertSpecialtyRepository } from '@domain/repositories/specialty/insert';
import { IFindOrInsertSpecialtyUseCase } from '@domain/use-cases/find-or-insert-specialty';
import { Success, success, Failure, failure } from '@utils/either';
import { FindOrInsertSpecialtyUseCase } from '../find-or-insert-specialty';

describe('FindOrInsertSpecialty UseCase', () => {
  let sut: IFindOrInsertSpecialtyUseCase;
  let findOneSpecialtyRepositoryStub: IFindOneSpecialtyRepository;
  let insertSpecialtyRepositoryStub: IInsertSpecialtyRepository;

  let findOrInsertSpecialtyParams: IFindOrInsertSpecialtyUseCase.Params;
  beforeEach(() => {
    findOrInsertSpecialtyParams = {
      specialty: 'anySpecialty',
    };

    class FindOneSpecialtyRepositoryStub implements IFindOneSpecialtyRepository {
      async findOne(
        _params: Partial<Specialty>
      ): IFindOneSpecialtyRepository.Result {
        return Promise.resolve(null);
      }
    }

    class InsertSpecialtyRepositoryStub implements IInsertSpecialtyRepository {
      async insert(
        _params: IInsertSpecialtyRepository.Params
      ): IInsertSpecialtyRepository.Result {
        return Promise.resolve(success(new Specialty({ id: 'specialtyId' })));
      }
    }

    findOneSpecialtyRepositoryStub = new FindOneSpecialtyRepositoryStub();
    insertSpecialtyRepositoryStub = new InsertSpecialtyRepositoryStub();

    sut = new FindOrInsertSpecialtyUseCase(
      findOneSpecialtyRepositoryStub,
      insertSpecialtyRepositoryStub
    );
  });

  test('Should call FindOneSpecialtyRepository with correct values', async () => {
    const findOneSpecialtyRepositorySpy = jest.spyOn(
      findOneSpecialtyRepositoryStub,
      'findOne'
    );

    await sut.findOrInsert(findOrInsertSpecialtyParams);

    expect(findOneSpecialtyRepositorySpy).toBeCalledTimes(1);
    expect(findOneSpecialtyRepositorySpy).toHaveBeenCalledWith({
      name: findOrInsertSpecialtyParams.specialty,
    });
  });

  test('Should return success with Specialty when FindOneSpecialtyRepository returns a Specialty', async () => {
    jest
      .spyOn(findOneSpecialtyRepositoryStub, 'findOne')
      .mockResolvedValueOnce(new Specialty({ id: 'specialtyId' }));

    const result = await sut.findOrInsert(findOrInsertSpecialtyParams);

    expect(result).toBeInstanceOf(Success);
    expect(result).toStrictEqual(success(new Specialty({ id: 'specialtyId' })));
  });

  test('Should call InsertSpecialtyRepository with correct values', async () => {
    const insertSpecialtyRepositorySpy = jest.spyOn(
      insertSpecialtyRepositoryStub,
      'insert'
    );

    await sut.findOrInsert(findOrInsertSpecialtyParams);

    expect(insertSpecialtyRepositorySpy).toBeCalledTimes(1);
    expect(insertSpecialtyRepositorySpy).toHaveBeenCalledWith({
      name: findOrInsertSpecialtyParams.specialty,
    });
  });

  test('Should return failure when InsertSpecialtyRepository returns failure', async () => {
    jest
      .spyOn(insertSpecialtyRepositoryStub, 'insert')
      .mockResolvedValueOnce(failure({ message: 'anyMessage' }));

    const result = await sut.findOrInsert(findOrInsertSpecialtyParams);

    expect(result).toBeInstanceOf(Failure);
  });

  test('Should return success with Specialty on success', async () => {
    const result = await sut.findOrInsert(findOrInsertSpecialtyParams);

    expect(result).toBeInstanceOf(Success);
    expect(result).toStrictEqual(success(new Specialty({ id: 'specialtyId' })));
  });
});
