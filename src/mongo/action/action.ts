import { Collection, InsertOneWriteOpResult, OptionalId, WithId } from "mongodb";

/**
 * 向数据库添加一条数据
 * @param collect 集合实例
 * @param data 添加的数据
 *
 */
export const InsertOne = <T extends { [key: string]: any }>(
  collect: Collection<T>,
  data: OptionalId<T>
) => {
  return new Promise<InsertOneWriteOpResult<WithId<T>>>((resove, reject) => {
    collect.insertOne(data, (error, resuilt) => {
      if (Object.is(null, error)) {
        resove(resuilt);
      } else {
        reject(error);
      }
    });
  });
};

export default {
  InsertOne,
};
