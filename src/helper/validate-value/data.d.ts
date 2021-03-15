declare namespace ValidateType {
  /** 校验是否是字符串 */
  type ValidateString = (strings: any) => boolean;
  /** 校验是否是undefined或null */
  type ValidateEmpty = (value: any) => boolean;
  /** 校验是否是number */
  type ValidateNumber = (value: any) => boolean;
}

export = ValidateType;
