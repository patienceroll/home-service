import { MongoClient } from "mongodb";

import config from "../config/config";

type ConnectMongoType = () => Promise<MongoClient>;

/** 连接数据库 */
const connectMongo: ConnectMongoType = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(config.dbUrl, (error, result) => {
      if (Object.is(null, error)) {
        resolve(result);
      } else {
        throw new Error(error.errmsg);
      }
    });
  });
};

export default connectMongo;
