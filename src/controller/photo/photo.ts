import config from "src/config/config";
import type { WithId } from "mongodb";

import Response from "src/base-response/base-response";
import * as Validate from "src/helper/validate-value/validate-value";

import { ErrorCodeMap } from "src/base-response/error-code";

import type { InitRoutersType } from "src/global";
import type * as Data from "./data";

const { listResponese } = Response;
const { isEmpty, isNumber, isString } = Validate;

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

  router.post("新建", "/photo", async (ctx, next) => {
    const { title, date, cover, describe, content } = ctx.request
      .body as Data.Photo;

    if (!isString([title, date, cover, describe, content])) {
      ctx.body = Response.errResponese<null>(1, null, ErrorCodeMap[1]);
      next();
    }
  });
};

export default InitPhotoRouters;
