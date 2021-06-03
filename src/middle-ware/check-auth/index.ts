import type { Middleware } from "koa";

import JsonWebToken from "jsonwebtoken";

import { errResponese } from "src/base-response/base-response";

const MiddleWareAuth: Middleware = async (ctx, next) => {
  const {
    path,
    headers: { authorization },
  } = ctx;

  if (path) {
    console.log(path);
    await next();
  } else if (typeof authorization === "undefined") {
    ctx.body = errResponese(4, null);
  } else {
    try {
      JsonWebToken.verify(authorization, "secret");
      await next();
    } catch (e) {
      ctx.body = errResponese(4, null);
    }
  }
};

export default MiddleWareAuth;
