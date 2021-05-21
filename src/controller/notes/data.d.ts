/** 相册单项数据 */
export type Note = {
  /** 标题 */
  title: string;
  /** 日期 */
  date: string;
  /** 封面 */
  cover: string;
  /** 描述 */
  describe: string;
  /** 内容 */
  content: string;
};

type NoteDetail = Note & {
  /** 上一个数据的 id */
  previousId: string | null;
  /** 下一个数据的id */
  nextId: string | null;
};
