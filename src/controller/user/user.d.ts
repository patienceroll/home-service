/** 用户信息 */
interface User {
  id: string;
  /** 姓名 */
  name: string;
  /** 账号 */
  acount: string;
  /** 密码 */
  password: string;
  /** 头像 */
  avatar: string | null;
}

type Data = {
  User: User;
};

export default Data;
