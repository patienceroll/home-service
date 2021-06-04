import { WithId } from "mongodb";
import JsonWebToken from "jsonwebtoken";
import CryptoJS from "crypto-js";

import config from "src/config/config";
import { isEmpty } from "src/helper/validate-value";

import { errResponese, baseResponse } from "src/base-response/base-response";

import type { InitRoutersType } from "src/global";
import type { User } from "./data";

/** 初始化认证相关的路由 */
const InitAuthRouters: InitRoutersType = (koa, router, client) => {
  router.post("注册", "sign", async (ctx) => {
    const { username, password } = ctx.request.body as User;

    if (isEmpty(username))
      return (ctx.body = errResponese(1, null, "请输入账号"));
    if (isEmpty(password))
      return (ctx.body = errResponese(1, null, "请输入密码"));

    const db = client.db(config.db);
    const dbUsers = db.collection(config.collections.users);

    // 判断是否注册过了?
    const exsist = await dbUsers.findOne({ username });
    if (exsist) return (ctx.body = errResponese(3, null, "此账号已注册"));

    // 加密密码
    const encodePassword = CryptoJS.AES.encrypt(
      "password",
      password
    ).toString();

    // 新增用户
    const result = await dbUsers.insertOne({
      username,
      password: encodePassword,
    });

    const id = result.insertedId.toHexString();
    const token = JsonWebToken.sign({ username, id }, "secret", {
      expiresIn: config.tokenTime,
    });
    ctx.body = baseResponse({ id, token });
  });

  router.post("登录", "login", async (ctx) => {
    const { username, password } = ctx.request.body as User;
    if (isEmpty([username, password]))
      return (ctx.body = errResponese(1, null, "请输入账号或密码"));

    const db = client.db(config.db);
    const dbUsers = db.collection(config.collections.users);

    const user = await dbUsers.findOne<WithId<User>>({ username });

    if (user) {
      const token = JsonWebToken.sign(
        { username, id: user._id.toHexString() },
        "secret",
        {
          expiresIn: config.tokenTime,
        }
      );
      ctx.body = baseResponse({ token });
    } else {
      ctx.body = errResponese(2, null, "账号或密码错误");
    }
  });

  router.post("验证登录状态", "islogin", async (ctx) => {
    const { authorization } = ctx.header;
    if (!authorization) return (ctx.body = baseResponse({ islogin: false }));
    try {
      JsonWebToken.verify(authorization, "secret");
      ctx.body = baseResponse({ islogin: true });
    } catch (e) {
      ctx.body = baseResponse({ islogin: false });
    }
  });
};

export default InitAuthRouters;
