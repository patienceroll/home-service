import koa, { DefaultState, DefaultContext } from "koa";
import Router from "koa-router";
import { MongoClient } from "mongodb";

/** 初始化路由 */
export type InitRoutersType = (
  /** koa 实例 */
  koa: Koa<DefaultState, DefaultContext>,
  /** koa-router 实例 */
  router: Router<any, {}>,
  /** mongoDB Client */
  client: MongoClient
) => void;
