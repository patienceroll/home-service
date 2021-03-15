import Responese from "./data";

const baseResponse: Responese.baseResponse = (data) => {
  return {
    code: 0,
    data,
    msg: "success",
  };
};

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

export default {
  baseResponse,
  errResponese,
};
