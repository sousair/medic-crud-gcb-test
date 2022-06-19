/* eslint-disable @typescript-eslint/no-unused-vars */
import { IHttpRequesterProvider } from '@application/providers/http-requester';
import { IAddressInquiryAdapter } from '@domain/adapters/address-inquiry';
import { Failure, success, Success } from '@utils/either';
import { BrasilAPIAddressInquiryAdapter } from '../brasil-api-address-inquiry';
import { RawBrasilApiResultDTO } from '../dtos/raw-brasil-api-result';

describe('BrasilApiAddressInquiry Adapter', () => {
  let sut: IAddressInquiryAdapter;
  let httpRequesterProviderStub: IHttpRequesterProvider;

  let addressInquiryParams: IAddressInquiryAdapter.Params;
  let rawBrasilAPIInquiryData: RawBrasilApiResultDTO;
  beforeEach(() => {
    addressInquiryParams = {
      zipCode: '00000000',
    };

    rawBrasilAPIInquiryData = {
      cep: '00000000',
      state: 'anyStateName',
      city: 'anyCityName',
      neighborhood: 'anyNeighborhoodName',
      street: 'anyStreetName',
      service: 'anyServiceName',
    };

    class HttpRequesterProviderStub implements IHttpRequesterProvider {
      async makeRequest(
        _params: IHttpRequesterProvider.Params
      ): IHttpRequesterProvider.Result {
        return Promise.resolve({
          statusCode: 200,
          data: rawBrasilAPIInquiryData,
        });
      }
    }

    httpRequesterProviderStub = new HttpRequesterProviderStub();

    sut = new BrasilAPIAddressInquiryAdapter(httpRequesterProviderStub);
  });

  test('Should call HttpRequesterProvider with correct values', async () => {
    const httpRequesterProviderSpy = jest.spyOn(
      httpRequesterProviderStub,
      'makeRequest'
    );

    await sut.execute(addressInquiryParams);

    expect(httpRequesterProviderSpy).toHaveBeenCalledTimes(1);
    expect(httpRequesterProviderSpy).toHaveBeenCalledWith({
      method: 'get',
      url: `${process.env.BRASIL_API_URL}/${addressInquiryParams.zipCode}`,
    });
  });

  test('Should return failure when HttpRequesterProvider returns a statusCode different from 200', async () => {
    jest.spyOn(httpRequesterProviderStub, 'makeRequest').mockResolvedValueOnce({
      statusCode: 500,
    });

    const result = await sut.execute(addressInquiryParams);

    expect(result).toBeInstanceOf(Failure);
  });

  test('Should return failure when HttpRequesterProvider returns a undefined data', async () => {
    jest.spyOn(httpRequesterProviderStub, 'makeRequest').mockResolvedValueOnce({
      statusCode: 200,
    });

    const result = await sut.execute(addressInquiryParams);

    expect(result).toBeInstanceOf(Failure);
  });

  test('Should return failure when inquiry zipCode is different from providedZipCode', async () => {
    const result = await sut.execute({ zipCode: '00000001' });

    expect(result).toBeInstanceOf(Failure);
  });

  test('Should return success with correct values on request success', async () => {
    const result = await sut.execute(addressInquiryParams);

    expect(result).toBeInstanceOf(Success);
    const {
      street,
      neighborhood,
      city,
      state,
      cep: zipCode,
    } = rawBrasilAPIInquiryData;
    expect(result).toStrictEqual(
      success({
        street,
        neighborhood,
        city,
        state,
        zipCode,
      })
    );
  });
});
