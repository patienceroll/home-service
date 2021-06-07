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
  { path: "login", methods: /POST/ },
  { path: "islogin", methods: /POST/ },
  { path: "sign", methods: /POST/ },
  { path: "project", methods: /GET/ },
  { path: /notes\/[a-z0-9A-Z]*$/, methods: /GET/ },
];

const isIgnoreRoute = (path: string, method: string) => {
  return (
    -1 !==
    IgnoreRoute.findIndex((i) => {
      if (typeof i.path === "string") {
        return (
          `${config.router.prefix}${i.path}` === path && i.methods.test(method)
        );
      }
      return i.path.test(path) && i.methods.test(method);
    })
  );
};

const MiddleWareAuth: Middleware = async (ctx, next) => {
  const {
    path,
    headers: { authorization },
    method,
  } = ctx;

  if (isIgnoreRoute(path, method)) {
    await next();
  } else if (
    typeof authorization === "undefined" ||
    authorization.trim() === ""
  ) {
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
