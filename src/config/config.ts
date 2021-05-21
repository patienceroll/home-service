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
  collections: {
    users: "users",
    notes: "notes",
    project: "project",
  },
  router: {
    prefix: "/api/v1",
  },
};

export default config;
