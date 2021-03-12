import Koa from "koa";
import Router from "koa-router";
import { MongoClient } from "mongodb";

import config from "../../config/config";
import Response from "../../base-response/base-response";
import Data from "./data";

/** 初始化 Home 的路由 */
type InitHomeRoutersType = (
  /** koa 实例 */
  koa: Koa<Koa.DefaultState, Koa.DefaultContext>,
  /** koa-router 实例 */
  router: Router<any, {}>,
  /** mongoDB Client */
  client: MongoClient
) => void;

const InitHomeRouters: InitHomeRoutersType = (koa, router, client) => {
  router.get("首页列表", "/home", async (ctx) => {
    const db = client.db(config.db);
    const collect = db.collection<Data.HomeItem>(config.collections.home);
    const list: Data.HomeItem[] = [];
    await collect
      .find()
      .forEach((item) => list.push(item))
      .then();

    ctx.body = Response.baseResponse(list);
  });
};

export default InitHomeRouters;
