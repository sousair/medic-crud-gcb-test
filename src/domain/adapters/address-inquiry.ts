import { Either } from '@utils/either';

export interface IAddressInquiryAdapter {
  execute(params: IAddressInquiryAdapter.Params): IAddressInquiryAdapter.Result;
}

export namespace IAddressInquiryAdapter {
  export type Params = {
    zipCode: string;
  };

  export type Result = Promise<
    Either<
      { message: string },
      {
        street: string;
        neighborhood: string;
        city: string;
        state: string;
        zipCode: string;
      }
    >
  >;
}
