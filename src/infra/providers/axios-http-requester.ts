import axios, { AxiosError } from 'axios';
import { IHttpRequesterProvider } from '@application/providers/http-requester';

export class AxiosHttpRequesterProvider implements IHttpRequesterProvider {
  async makeRequest<T>({
    method,
    url,
    bodyData,
    headers,
    queryParams,
  }: IHttpRequesterProvider.Params): IHttpRequesterProvider.Result<T> {
    try {
      const queryParamsMount = queryParams ? Object.entries(queryParams).reduce(
        (queryParamsStr, [key, value]) => queryParamsStr + `&${key}=${value}`,
        '?'
      ) : '';

      const { status: statusCode, data } = await axios({
        method,
        url: `${url}${queryParamsMount}`,
        headers,
        data: bodyData,
      });
      return { statusCode, data };
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.request || axiosError.response) {
        const { status: statusCode, data } = axiosError.request || axiosError.response;

        return { statusCode, data };
      }

      return { statusCode: 500 };
    }
  }
}
