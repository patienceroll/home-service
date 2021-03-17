import Router from "koa-router";

type configType = {
  /** 端口 */
  port: number;
  /** 数据库url */
  dbUrl: string;
  /** 数据库name */
  db: string;
  /** 集合 */
  collections: {
    /** 测试集合 */
    test: "test";
    /** 用户 */
    users: "users";
    /** home 页面数据 */
    home: "home";
  };
  /** router 配置 */
  router: Router.IRouterOptions;
};

const config: configType = {
  port: 3001,
  dbUrl: "mongodb://localhost:27017",
  db: "home",
  collections: {
    test: "test",
    users: "users",
    home: "home",
  },
  router: {
    prefix: "/api/v1",
  },
};

export default config;
