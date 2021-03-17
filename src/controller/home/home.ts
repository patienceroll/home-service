import Koa from "koa";
import Router from "koa-router";
import { MongoClient } from "mongodb";

import config from "../../config/config";
import Validate from "../../helper/validate-value/validate-value";
import Response from "../../base-response/base-response";
import MongoAction from "../../mongo/action/action";
import UploadFile from "../../common/upload-file/upload-file";

import Data from "./data";

import baseResponse from "../../base-response/base-response";

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
    await collect.find().forEach((item) => list.push(item));
    ctx.body = Response.baseResponse(list);
  });

  router.post("新建", "/home", async (ctx, next) => {
    const { title, subTitle, image, url } = ctx.request.body as Data.HomeItem;
    const validateResult =
      Validate.string([title, image, url]) &&
      (Validate.empty(subTitle) || Validate.string(subTitle));
    if (!validateResult) {
      ctx.body = Response.errResponese<null>(1, null, "数据类型错误");
      next();
    }
    const db = client.db(config.db);
    const collect = db.collection<Data.HomeItem>(config.collections.home);
    await MongoAction.insertOne<Data.HomeItem>(collect, {
      title,
      subTitle,
      image,
      url,
    });
    ctx.body = Response.baseResponse(null);
  });

  router.post("上传图片", "/upload/image", async (ctx, next) => {
    const {
      request: { files },
    } = ctx;
    const data = await UploadFile(
      files,
      // "D:\\personal-program\\home-service\\src\\upload\\image"
      "C:\\Users\\Administrator\\Desktop\\nginx-1.19.7\\html\\upload\\image"
    );

    ctx.body = Response.baseResponse(data.fileName);
  });
};

export default InitHomeRouters;
