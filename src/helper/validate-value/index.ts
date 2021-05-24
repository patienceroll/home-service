/**
 * 校验是否是字符串
 * @param strings 校验是否是 string,sting[]类型的数据
 */
export const isString = (strings: any) => {
  if (typeof strings === "string") return true;
  if (
    Array.isArray(strings) &&
    strings.filter((i) => typeof i !== "string").length === 0
  )
    return true;

  return false;
};

/**
 * 校验是否是数字
 * @param strings 校验是否是 string,sting[]类型的数据
 */
export const isNumber = (strings: any) => {
  if (typeof strings === "number") return true;
  if (
    Array.isArray(strings) &&
    strings.filter((i) => typeof i !== "number").length === 0
  )
    return true;

  return false;
};

/** 校验是否是undefined或null */
export const isEmpty = (value: any) => {
  if (Object.is(value, null) || Object.is(value, undefined)) return true;
  if (
    Array.isArray(value) &&
    value.filter((i) => !(Object.is(i, null) || Object.is(i, undefined)))
      .length === 0
  )
    return true;
  return false;
};
