import { ObjectId, WithId } from "mongodb";

import config from "src/config/config";
import * as Validate from "src/helper/validate-value/validate-value";
import {
  baseResponse,
  listResponese,
  errResponese,
} from "src/base-response/base-response";
import { InsertOne } from "src/mongo/action/action";

import { ErrorCodeMap } from "src/base-response/error-code";

import type { InitRoutersType } from "src/global";

import Data from "./data";

/** 初始化Home相关的路由 */
const InitHomeRouters: InitRoutersType = (koa, router, client) => {
  router.get("首页列表", "/home", async (ctx) => {
    const { query } = ctx.request;
    const page = Number(query.page);
    const perPage = Number(query.perPage);

    const db = client.db(config.db);
    const dbHome = db.collection<WithId<Data.HomeItem>>(
      config.collections.home
    );

    const total = await dbHome.count();

    const list: (Data.HomeItem & {
      id: string;
    })[] = [];

    await dbHome
      .find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .forEach(({ image, _id, title, subTitle, url }) =>
        list.push({
          id: _id.toHexString(),
          image,
          url,
          subTitle,
          title,
        })
      );
    ctx.body = listResponese({ list, page, perPage, total });
  });

  router.post("新建", "/home", async (ctx) => {
    const { title, subTitle, image, url } = ctx.request.body as Data.HomeItem;
    const validateResult =
      Validate.isString([title, image, url]) &&
      (Validate.isEmpty(subTitle) || Validate.isString(subTitle));
    if (!validateResult) {
      ctx.body = errResponese<null>(1, null, ErrorCodeMap[1]);
      return;
    }
    const db = client.db(config.db);
    const dbHome = db.collection<Data.HomeItem>(config.collections.home);
    const result = await InsertOne<Data.HomeItem>(dbHome, {
      title,
      subTitle,
      image,
      url,
    });
    ctx.body = baseResponse({
      id: result.insertedId.toHexString(),
      title,
      subTitle,
      image,
      url,
    });
  });

  router.get("获取一项", "/home/:id", async (ctx) => {
    const { id } = ctx.params;
    const db = client.db(config.db);
    const dbHome = db.collection<WithId<Data.HomeItem>>(
      config.collections.home
    );
    const item = await dbHome.findOne({ _id: new ObjectId(id) });
    if (item) {
      const { _id, image, url, subTitle, title } = item;
      ctx.body = baseResponse({
        id: _id.toHexString(),
        image,
        url,
        subTitle,
        title,
      });
    } else {
      ctx.body = errResponese(2, null, ErrorCodeMap[2]);
    }
  });

  router.put("编辑一项", "/home/:id", async (ctx, next) => {
    const { id } = ctx.params;
    const { title, subTitle, image, url } = ctx.request.body as Data.HomeItem;
    const db = client.db(config.db);
    const dbHome = db.collection<Data.HomeItem>(config.collections.home);
    const item = await dbHome.findOne({ _id: new ObjectId(id) });

    if (!item) {
      ctx.body = errResponese(2, null, ErrorCodeMap[2]);
    } else {
      await dbHome.updateOne(
        { _id: new ObjectId(id) },
        { $set: { subTitle, title, image, url } }
      );
      ctx.body = baseResponse({ subTitle, title, image, url, id });
    }
  });

  router.delete("删除home", "/home/:id", async (ctx) => {
    const { id } = ctx.params;
    const db = client.db(config.db);
    const dbHome = db.collection<WithId<Data.HomeItem>>(
      config.collections.home
    );
    const result = await dbHome.deleteOne({ _id: new ObjectId(id) });
    if (result.result.ok) {
      ctx.body = baseResponse(null);
    } else {
      ctx.body = errResponese(2, null, ErrorCodeMap[2]);
    }
  });
};

export default InitHomeRouters;
