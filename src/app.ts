import Koa from "koa";
import Router from "koa-router";
import KoaBody from "koa-body";

import config from "src/config/config";

import connectMongo from "src/mongo/connect";

import InitUpload from "src/controller/common/upload/upload";
import InitProjectRouters from "src/controller/project";
import InitNotesRouters from "src/controller/notes";

const App = async () => {
  const koa = new Koa();
  const router = new Router(config.router);
  const mongoClient = await connectMongo();

  InitUpload(koa, router, mongoClient);
  InitProjectRouters(koa, router, mongoClient);
  InitNotesRouters(koa, router, mongoClient);

  koa.use(
    KoaBody({
      multipart: true,
    })
  );

  koa.use(router.routes());
  koa.listen(config.port);
  console.log(`app is running at http://localhost:${config.port}`);
};

App();
