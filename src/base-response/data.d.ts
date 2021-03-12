declare namespace Responses {
  /** 通用响应数据类型 */
  type BaseResponse<T> = {
    code: 0;
    data: T;
    msg: string;
  };

  type baseResponse = <T>(data: T) => BaseResponse<T>;
}

export = Responses;
