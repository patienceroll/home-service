import { WithId } from "mongodb";

import config from "../../config/config";
import Validate from "../../helper/validate-value/validate-value";
import Response from "../../base-response/base-response";
import MongoAction from "../../mongo/action/action";

import { InitRoutersType } from "../../global";

import Data from "./data";

/** 初始化Home相关的路由 */
const InitHomeRouters: InitRoutersType = (koa, router, client) => {
  router.get("首页列表", "/home", async (ctx) => {
    const { body } = ctx.request;

    const db = client.db(config.db);
    const collect = db.collection<WithId<Data.HomeItem>>(
      config.collections.home
    );

    const list: (Data.HomeItem & {
      id: string;
    })[] = [];

    await collect.find().forEach(({ image, _id, title, subTitle, url }) =>
      list.push({
        id: _id.toHexString(),
        image: `http://gsea.top/${image}`,
        url,
        subTitle,
        title,
      })
    );
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
    const result = await MongoAction.insertOne<Data.HomeItem>(collect, {
      title,
      subTitle,
      image,
      url,
    });
    ctx.body = Response.baseResponse(result);
  });
};

export default InitHomeRouters;
