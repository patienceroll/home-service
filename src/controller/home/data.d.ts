declare namespace Data {

  /** 首页 Home 每一项基本数据 */
  interface HomeItem {
    /** 名称 */
    title: string;
    /** 子名称 */
    subTitle: string | null;
    /** 跳转地址 */
    url: string;
    /** 背景图片 */
    image: string;
  }
}


export = Data;
