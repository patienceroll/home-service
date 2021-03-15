declare namespace ErrorCodeOptions {
  /** 错误码
   *  @enum 1 请求参数类型错误、缺失
   */
  type ErrorCode = 1 | 2 | 3;

  type ErrorCodeMapType = {
    [key in ErrorCode]: { code: ErrorCode; description: string };
  };
}

export default ErrorCodeOptions;
