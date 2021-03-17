import Koa from "koa";
import Router from "koa-router";
import KoaBody from "koa-body";

import config from "./config/config";

import connectMongo from "./mongo/connect";

import InitHomeRouters from "./controller/home/home";

const App = async () => {
  const koa = new Koa();
  const router = new Router(config.router);
  const mongoClient = await connectMongo();

  InitHomeRouters(koa, router, mongoClient);

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






