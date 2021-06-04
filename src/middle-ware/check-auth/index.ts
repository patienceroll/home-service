import type { Middleware } from "koa";

import JsonWebToken from "jsonwebtoken";

import config from "src/config/config";
import { errResponese } from "src/base-response/base-response";

/** KEY 为 */
const IgnoreRoute: {
  /** 校验请求方法的正则 */
  methods: RegExp;
  path: string | RegExp;
}[] = [
  { path: "login", methods: /POST/g },
  { path: "islogin", methods: /POST/g },
  { path: "sign", methods: /POST/g },
  { path: "project", methods: /GET/g },
  { path: "notes", methods: /GET/g },
];

const isIgnoreRoute = (path: string, method: string) => {
  return IgnoreRoute.findIndex((i) => {
    if (typeof i.path === "string")
      return config.router.prefix + i.path === path && i.methods.test(method);
    return i.path.test(path) && i.methods.test(method);
  });
};

const MiddleWareAuth: Middleware = async (ctx, next) => {
  const {
    path,
    headers: { authorization },
    method,
  } = ctx;

  if (isIgnoreRoute(path, method)) {
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
