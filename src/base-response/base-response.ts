import Responese from "./data";

const baseResponse: Responese.baseResponse = (data) => {
  return {
    code: 0,
    data,
    msg: "success",
  };
};

export default {
  baseResponse,
};
