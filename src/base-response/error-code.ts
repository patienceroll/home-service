/**
 * 错误码 map
 * @param 1  请求参数类型错误、缺失
 * @param 2  未找到项目
 */
export const ErrorCodeMap = {
  1: "请求参数类型错误、缺失",
  2: "未找到项目",
};

/** 
 * #### 错误码
 *  @enum 1 请求参数类型错误、缺失
 *  @enum 2 未找到项目
 */
export type ErrorCode = keyof typeof ErrorCodeMap;

export type ErrorCodeMapType = {
  [key in ErrorCode]: string;
};
