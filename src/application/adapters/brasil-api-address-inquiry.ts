import { success, failure } from '../../utils/either';
import { RawBrasilApiResultDTO } from './dtos/raw-brasil-api-result';
import { IHttpRequesterProvider } from '../providers/http-requester';
import { IAddressInquiryAdapter } from '../../domain/adapters/address-inquiry';

export class BrasilAPIAddressInquiryAdapter implements IAddressInquiryAdapter {
  constructor(private readonly httpRequesterProvider: IHttpRequesterProvider) {}

  async execute({
    zipCode,
  }: IAddressInquiryAdapter.Params): IAddressInquiryAdapter.Result {
    const brasilAPIRes =
      await this.httpRequesterProvider.makeRequest<RawBrasilApiResultDTO>({
        method: 'get',
        url: `${process.env.BRASIL_API_URL}/cep/v2/${zipCode}`,
      });

    if (brasilAPIRes.statusCode !== 200 || !brasilAPIRes.data)
      return failure({ message: 'error on brasil API zipCode inquiry' });

    const {
      street,
      neighborhood,
      city,
      state,
      cep: inquiryZipCode,
    } = brasilAPIRes.data;

    if (inquiryZipCode !== zipCode)
      return failure({
        message: 'inquiry zipCode is divergent from provided zipCode',
      });

    return success({
      street,
      neighborhood,
      city,
      state,
      zipCode,
    });
  }
}
