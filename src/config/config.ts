import Router from "koa-router";
import readLineSync from "readline-sync";

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

const getDbUrl = () => {
  const dbName = readLineSync.question("please enter DBname:");
  const userName = readLineSync.question("please enter db userName:");
  const password = readLineSync.question("please enter db password:");

  return `mongodb://${userName.trim()}:${password.trim()}@1.15.54.144:27017/?authSource=${dbName.trim()}&readPreference=primary&appname=MongoDB%20Compass&ssl=false`;
};

const config: configType = {
  port: 3001,
  dbUrl: getDbUrl(),
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
