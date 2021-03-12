declare namespace Responses {
  /** 通用响应数据类型 */
  type BaseResponse<T> = {
    code: 0;
    data: T;
    msg: string;
  };

  /** 通用响应函数 */
  type baseResponse = <T>(data: T) => BaseResponse<T>;
}

export = Responses;
