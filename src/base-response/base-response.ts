import type { ErrorCode } from "./error-code";

import { ErrorCodeMap } from "src/base-response/error-code";

export type ReturnWithId<T extends Record<string, any>> = Omit<T, "id"> & {
  id: string;
};

/** 通用响应 */
export const baseResponse = <T = null>(data: T) => ({
  code: 0,
  data,
  msg: "success",
});

/** 错误响应 */
export const errResponese = <T = null>(
  code: ErrorCode,
  data: T,
  msg?: string
) => ({ code, data, msg: msg || ErrorCodeMap[code] || "未知异常,请刷新重试" });

/** 分页响应 */
export const listResponese = <T = null>(data: {
  page: number;
  perPage: number;
  total: number;
  list: T[];
}) => ({
  code: 0,
  data,
  msg: "success",
});
