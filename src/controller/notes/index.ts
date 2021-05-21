import { ObjectId, WithId } from "mongodb";

import {
  baseResponse,
  errResponese,
  listResponese,
} from "src/base-response/base-response";
import type { ReturnWithId } from "src/base-response/base-response";

import * as Validate from "src/helper/validate-value/validate-value";
import { InsertOne } from "src/mongo/action/action";

import { ErrorCodeMap } from "src/base-response/error-code";
import config from "src/config/config";

import type { InitRoutersType } from "src/global";
import type { Note, NoteDetail } from "./data";

const { isString } = Validate;

/** 初始化Photo相关的路由 */
const InitPhotoRouters: InitRoutersType = (koa, router, client) => {
  router.get("随记列表", "/notes", async (ctx) => {
    const { query } = ctx.request;
    const page = Number(query.page);
    const perPage = Number(query.perPage);
    const db = client.db(config.db);
    const dbPhoto = db.collection<WithId<Note>>(config.collections.notes);

    const total = await dbPhoto.countDocuments();
    const list: (Omit<Note, "content"> & { id: string })[] = [];

    await dbPhoto
      .find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .forEach(({ title, date, cover, describe, _id }) => {
        // 列表按照后添加的放到最前
        list.unshift({
          title,
          date,
          cover,
          describe,
          id: _id.toHexString(),
        });
      });

    ctx.body = listResponese({ list, page, perPage, total });
  });

  router.post("新建随记", "/notes", async (ctx) => {
    const { title, date, cover, describe, content } = ctx.request.body as Note;

    if (!isString([title, date, cover, describe, content])) {
      ctx.body = errResponese<null>(1, null, ErrorCodeMap[1]);
      return;
    }

    const db = client.db(config.db);
    const dbPhoto = db.collection(config.collections.notes);

    const result = await InsertOne<Note>(dbPhoto, {
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

  router.put("编辑随记", "/notes/:id", async (ctx, next) => {
    const { id } = ctx.params;
    const { title, date, cover, describe, content } = ctx.request.body as Note;
    const db = client.db(config.db);
    const dbPhoto = db.collection(config.collections.notes);
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

  router.get("获取随记详情", "/notes/:id", async (ctx) => {
    const { id } = ctx.params;
    const db = client.db(config.db);
    const dbPhoto = db.collection<WithId<Note>>(config.collections.notes);
    const _id = new ObjectId(id);
    const item = await dbPhoto.findOne({ _id });
    // 因为列表是新数据在最前面,即 ObjectId 小的在最后
    // 所以此处 id 更小的为 next
    const [next] = await dbPhoto
      .find({
        _id: {
          $lt: _id,
        },
      })
      .sort({ _id: -1 })
      .limit(1)
      .toArray();
    const [previous] = await dbPhoto
      .find({ _id: { $gt: _id } })
      .sort({ _id: 1 })
      .limit(1)
      .toArray();

    if (!item) {
      ctx.body = errResponese(2, null, ErrorCodeMap[2]);
    } else {
      const { content, cover, describe, title, date, _id } = item;

      ctx.body = baseResponse<ReturnWithId<NoteDetail>>({
        id: _id.toHexString(),
        content,
        cover,
        describe,
        title,
        date,
        previousId: previous ? previous._id.toHexString() : null,
        nextId: next ? next._id.toHexString() : null,
      });
    }
  });

  router.delete("删除随记", "/notes/:id", async (ctx) => {
    const { id } = ctx.params;
    const db = client.db(config.db);
    const dbPhoto = db.collection<WithId<Note>>(config.collections.notes);
    const result = await dbPhoto.deleteOne({ _id: new ObjectId(id) });
    if (result.result.ok) {
      ctx.body = baseResponse(null);
    } else {
      ctx.body = errResponese(2, null, ErrorCodeMap[2]);
    }
  });
};

export default InitPhotoRouters;
