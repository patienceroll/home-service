import Responese from "./data";

/** 通用响应 */
const baseResponse: Responese.baseResponse = (data) => {
  return {
    code: 0,
    data,
    msg: "success",
  };
};

/** 错误响应 */
const errResponese: Responese.errorResponse = (
  code,
  data,
  msg = "未知异常"
) => {
  return {
    data,
    code,
    msg,
  };
};

/** 分页响应 */
const listResponese: Responese.listResponese = (data) => {
  return {
    code: 0,
    msg: "success",
    data,
  };
};

export default {
  baseResponse,
  errResponese,
  listResponese,
};
