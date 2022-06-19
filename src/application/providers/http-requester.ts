/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IHttpRequesterProvider {
  makeRequest<T>(
    params: IHttpRequesterProvider.Params
  ): IHttpRequesterProvider.Result<T>;
}

export namespace IHttpRequesterProvider {
  export type Params = {
    method:
      | 'get'
      | 'delete'
      | 'head'
      | 'options'
      | 'post'
      | 'put'
      | 'patch'
      | 'link'
      | 'unlink';
    url: string;
    headers?: {
      [key: string]: string;
    };
    bodyData?: {
      // todo: check this
      [key: string]: Record<string, unknown>;
    };
    queryParams?: {
      [key: string]: string;
    };
  };

  export type Result<T = any> = Promise<{ statusCode: number; data?: T }>;
}
