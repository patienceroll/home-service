import ErrorCodeOptions from "./error-code";

declare namespace Responses {
  /** 通用响应数据类型 */
  type BaseResponse<T> = {
    code: 0;
    data: T;
    msg: string;
  };

  /** 通用响应函数 */
  type baseResponse = <T>(data: T) => BaseResponse<T>;

  /** 错误返回数据类型 */
  type ErrorResponse<T = null> = {
    code: ErrorCodeOptions.ErrorCode;
    data: T;
    msg: string;
  };

  /** 通用响应函数 */
  type errorResponse = <T>(
    code: ErrorCodeOptions.ErrorCode,
    data: T,
    msg?: string
  ) => ErrorResponse<T>;
}

export = Responses;
