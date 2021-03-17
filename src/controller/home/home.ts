import Koa from "koa";
import Router from "koa-router";
import { MongoClient } from "mongodb";
import fs from "fs";
import KoaStatic from "koa-static";

import config from "../../config/config";
import Validate from "../../helper/validate-value/validate-value";
import Response from "../../base-response/base-response";
import MongoAction from "../../mongo/action/action";
import Data from "./data";
import path from "path";
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

    if (typeof files === "undefined") {
      ctx.body = Response.errResponese(1, null, "未获取到文件流");
    } else {
      if (Array.isArray(files.file)) {
        const fileRead = fs.createReadStream(files.file[0].path);
        const date = new Date();
        const dateString = `${date.getFullYear()}${
          date.getMonth() + 1
        }${date.getDate()}`;
        const filePath = `D:\\personal-program\\home-service\\src\\upload\\image\\${dateString}`;
        const fileWrite = fs.createWriteStream(files.file[0].path);
        if (fs.existsSync(filePath)) {
          fs.mkdir(filePath, {}, (err) => {
            if (err) {
              console.error(err);
            } else {
              fileRead.pipe(fileWrite);
              ctx.body = Response.baseResponse(
                `${filePath}\\${(files as any).file[0].name}`
              );
            }
          });
        } else {
          fileRead.pipe(fileWrite);
          ctx.body = Response.baseResponse(
            `${filePath}\\${(files as any).file[0].name}`
          );
        }
      } else {
        const fileRead = fs.createReadStream(files.file.path);
        const date = new Date();
        const dateString = `${date.getFullYear()}${
          date.getMonth() + 1
        }${date.getDate()}`;

        const folderPath = `D:\\personal-program\\home-service\\src\\upload\\image\\${dateString}`;
        const filePath = `${folderPath}\\${(files as any).file.name}`;
        const fileWrite = fs.createWriteStream(filePath);
        if (!fs.existsSync(folderPath)) {
          fs.mkdir(folderPath, {}, (err) => {
            if (err) {
              console.error(err);
            } else {
              fileRead.pipe(fileWrite);
            }
          });
        } else {
          console.log(filePath);
          fileRead.pipe(fileWrite);
        }
        ctx.body = Response.baseResponse(filePath);
      }
    }
  });
};

export default InitHomeRouters;
