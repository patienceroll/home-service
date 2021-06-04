import { ObjectId, WithId } from "mongodb";

import config from "src/config/config";
import * as Validate from "src/helper/validate-value";
import {
  baseResponse,
  listResponese,
  errResponese,
} from "src/base-response/base-response";

import { ErrorCodeMap } from "src/base-response/error-code";

import type { InitRoutersType } from "src/global";

import Data from "./data";

/** 初始化项目相关的路由 */
const InitProjectRouters: InitRoutersType = (koa, router, client) => {
  router.get("项目列表", "project", async (ctx) => {
    const { query } = ctx.request;
    const page = Number(query.page);
    const perPage = Number(query.perPage);

    const db = client.db(config.db);
    const dbProject = db.collection<WithId<Data.ProjectItem>>(
      config.collections.project
    );

    const total = await dbProject.countDocuments();

    const list: (Data.ProjectItem & {
      id: string;
    })[] = [];

    await dbProject
      .find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .forEach(({ image, _id, title, subTitle, url }) =>
        list.unshift({
          id: _id.toHexString(),
          image,
          url,
          subTitle,
          title,
        })
      );
    ctx.body = listResponese({ list, page, perPage, total });
  });

  router.post("新建项目", "project", async (ctx) => {
    const { title, subTitle, image, url } = ctx.request
      .body as Data.ProjectItem;
    const validateResult =
      Validate.isString([title, image, url]) &&
      (Validate.isEmpty(subTitle) || Validate.isString(subTitle));
    if (!validateResult) {
      ctx.body = errResponese<null>(1, null, ErrorCodeMap[1]);
      return;
    }
    const db = client.db(config.db);
    const dbProject = db.collection<Data.ProjectItem>(
      config.collections.project
    );

    const result = await dbProject.insertOne({
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

  router.get("获取项目详情", "project/:id", async (ctx) => {
    const { id } = ctx.params;
    const db = client.db(config.db);
    const dbProject = db.collection<WithId<Data.ProjectItem>>(
      config.collections.project
    );
    const item = await dbProject.findOne({ _id: new ObjectId(id) });
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
      ctx.body = errResponese(2, null);
    }
  });

  router.put("编辑项目", "project/:id", async (ctx, next) => {
    const { id } = ctx.params;
    const { title, subTitle, image, url } = ctx.request
      .body as Data.ProjectItem;
    const db = client.db(config.db);
    const dbProject = db.collection<Data.ProjectItem>(
      config.collections.project
    );
    const item = await dbProject.findOne({ _id: new ObjectId(id) });

    if (!item) {
      ctx.body = errResponese(2, null);
    } else {
      await dbProject.updateOne(
        { _id: new ObjectId(id) },
        { $set: { subTitle, title, image, url } }
      );
      ctx.body = baseResponse({ subTitle, title, image, url, id });
    }
  });

  router.delete("删除项目", "project/:id", async (ctx) => {
    const { id } = ctx.params;
    const db = client.db(config.db);
    const dbProject = db.collection<WithId<Data.ProjectItem>>(
      config.collections.project
    );
    const result = await dbProject.deleteOne({ _id: new ObjectId(id) });
    if (result.result.ok) {
      ctx.body = baseResponse(null);
    } else {
      ctx.body = errResponese(2, null);
    }
  });
};

export default InitProjectRouters;
