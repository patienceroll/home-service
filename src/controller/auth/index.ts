import { ObjectId, WithId } from "mongodb";
import JsonwebToken from "jsonwebtoken";
import CryptoJS from "crypto-js";

import config from "src/config/config";
import { isEmpty } from "src/helper/validate-value";

import { errResponese, baseResponse } from "src/base-response/base-response";

import type { InitRoutersType } from "src/global";
import type { User } from "./data";

/** 初始化认证相关的路由 */
const InitAuthRouters: InitRoutersType = (koa, router, client) => {
  router.post("注册", "/sign", async (ctx) => {
    const { username, password } = ctx.request.body as User;

    if (isEmpty(username))
      return (ctx.body = errResponese(1, null, "请输入账号"));
    if (isEmpty(password))
      return (ctx.body = errResponese(1, null, "请输入密码"));

    const db = client.db(config.db);
    const dbUsers = db.collection(config.collections.users);

    // 判断是否注册过了?
    const exsist = await dbUsers.findOne({ username });
    console.log(exsist);
    if (exsist) return (ctx.body = errResponese(3, null, "此账号已被使用"));

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

    const token = JsonwebToken.sign({ username, id }, "home");

    ctx.body = baseResponse({ id, token });
  });

  router.post("登录", "/login", async (ctx) => {
    const { username, password } = ctx.request.body as User;
    if (isEmpty(username) || isEmpty(password))
      return (ctx.body = errResponese(1, null, "请输入账号或密码"));

    const collection = client.db(config.collections.users);

    ctx.body = baseResponse(null);
  });
};

export default InitAuthRouters;
