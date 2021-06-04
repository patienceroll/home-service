import readLineSync from "readline-sync";

const getDbUrl = () => {
  const dbName = readLineSync.question("please enter DBname:");
  const userName = readLineSync.question("please enter db userName:");
  const password = readLineSync.question("please enter db password:");

  return `mongodb://${userName.trim()}:${password.trim()}@1.15.54.144:27017/?authSource=${dbName.trim()}&readPreference=primary&appname=MongoDB%20Compass&ssl=false`;
};

const config = {
  port: 3001,
  dbUrl: getDbUrl(),
  db: "home",
  /** token 有效期 单位秒 */
  tokenTime: 60 * 60 * 24 * 7,
  collections: {
    users: "users",
    notes: "notes",
    project: "project",
  },
  router: {
    prefix: "/api/v1/",
  },
};

export default config;
