import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import { IHttpRequesterProvider } from '@application/providers/http-requester';
import { AxiosHttpRequesterProvider } from '../axios-http-requester';

describe('AxiosHttpRequester Provider', () => {
  let sut: IHttpRequesterProvider;
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    sut = new AxiosHttpRequesterProvider();
  });

  test('should not throw if axios throws', async () => {
    axiosMock.onGet('/anyRoute1').networkErrorOnce();

    await expect(
      sut.makeRequest({
        url: '/anyRoute1',
        method: 'get',
      })
    ).resolves.not.toThrow();
  });

  test('should return status and data on status is out of range 2XX', async () => {
    axiosMock.onGet('/anyRoute2').replyOnce(404, {
      anyData: 'anyValue',
    });

    const result = await sut.makeRequest({
      url: '/anyRoute2',
      method: 'get',
    });

    expect(result).toStrictEqual({
      statusCode: 404,
      data: {
        anyData: 'anyValue',
      },
    });
  });

  test('should return status code and data when status is on range 2XX', async () => {
    axiosMock.onGet('/anyRoute3').replyOnce(200, {
      anyData: 'anyValue',
    });

    const result = await sut.makeRequest({
      url: '/anyRoute3',
      method: 'get',
    });

    expect(result).toStrictEqual({
      statusCode: 200,
      data: {
        anyData: 'anyValue',
      },
    });
  });

  test('should return mount query params', async () => {
    axiosMock.onGet('/anyRoute4?&param=value').replyOnce(200, {
      anyData: 'anyValue',
    });
    
    console.log(axiosMock.adapter());

    const result = await sut.makeRequest({
      url: '/anyRoute4',
      method: 'get',
      queryParams: {
        param: 'value',
      },
    });

    expect(result).toStrictEqual({
      statusCode: 200,
      data: {
        anyData: 'anyValue',
      },
    });
  });
});
