import Koa from "koa";
import Router from "koa-router";
import KoaBody from "koa-body";

import config from "src/config/config";

import { connect } from "mongodb";

import InitUpload from "src/controller/common/upload/upload";
import InitProjectRouters from "src/controller/project";
import InitNotesRouters from "src/controller/notes";
import InitAuthRouters from "src/controller/auth";

const App = async () => {
  const koa = new Koa();
  const router = new Router(config.router);
  const mongoClient = await connect(config.dbUrl);

  koa.use(
    KoaBody({
      multipart: true,
    })
  );
  koa.use(router.routes());

  InitAuthRouters(koa, router, mongoClient);
  InitUpload(koa, router, mongoClient);
  InitProjectRouters(koa, router, mongoClient);
  InitNotesRouters(koa, router, mongoClient);

  koa.listen(config.port);
  console.log(`app is running at http://localhost:${config.port}`);
};

App();
