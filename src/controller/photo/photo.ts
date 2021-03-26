import { ObjectId, WithId } from "mongodb";

import Response from "src/base-response/base-response";
import * as Validate from "src/helper/validate-value/validate-value";
import { InsertOne } from "src/mongo/action/action";

import { ErrorCodeMap } from "src/base-response/error-code";
import config from "src/config/config";

import type { InitRoutersType } from "src/global";
import type * as Data from "./data";

const { listResponese, baseResponse, errResponese } = Response;
const { isString } = Validate;

/** 初始化Photo相关的路由 */
const InitPhotoRouters: InitRoutersType = (koa, router, client) => {
  router.get("相册列表", "/photo", async (ctx) => {
    const { query } = ctx.request;
    const page = Number(query.page);
    const perPage = Number(query.perPage);
    const db = client.db(config.db);
    const dbPhoto = db.collection<WithId<Data.Photo>>(config.collections.photo);

    const total = await dbPhoto.count();
    const list: (Data.Photo & { id: string })[] = [];

    await dbPhoto
      .find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .forEach(({ title, date, cover, describe, content, _id }) => {
        list.push({
          title,
          date,
          cover,
          describe,
          content,
          id: _id.toHexString(),
        });
      });

    ctx.body = listResponese({ list, page, perPage, total });
  });

  router.post("新建", "/photo", async (ctx) => {
    const { title, date, cover, describe, content } = ctx.request
      .body as Data.Photo;

    if (!isString([title, date, cover, describe, content])) {
      ctx.body = errResponese<null>(1, null, ErrorCodeMap[1]);
      return;
    }

    const db = client.db(config.db);
    const dbPhoto = db.collection(config.collections.photo);

    const result = await InsertOne<Data.Photo>(dbPhoto, {
      title,
      date,
      cover,
      describe,
      content,
    });

    ctx.body = baseResponse({
      id: result.insertedId.toHexString(),
      title,
      date,
      cover,
      describe,
      content,
    });
  });

  router.put("编辑photo", "/photo/:id", async (ctx, next) => {
    const { id } = ctx.params;
    const { title, date, cover, describe, content } = ctx.request
      .body as Data.Photo;
    const db = client.db(config.db);
    const dbPhoto = db.collection(config.collections.photo);
    const item = await dbPhoto.findOne({ _id: new ObjectId(id) });

    if (!item) {
      ctx.body = errResponese(2, null, ErrorCodeMap[2]);
      return;
    } else {
      await dbPhoto.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: { title, date, cover, describe, content },
        }
      );

      ctx.body = baseResponse({
        title,
        date,
        cover,
        describe,
        content,
        id,
      });
    }
  });
};

export default InitPhotoRouters;
