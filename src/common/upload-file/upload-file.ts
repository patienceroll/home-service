import Koa from "koa";
import fs from "fs";

type UoloadImageType = (
  /** 上传的文件对象 */
  files: Koa.Request["files"],
  /** 文件保存的路径 */
  path?: string
) => Promise<{
  fileName: string | string[];
  filePath: string | string[];
}>;

const root = "C:\\Users\\Administrator\\Desktop\\nginx-1.19.7\\html\\";

/**
 * ## 递归生成文件夹路径
 * @param folderPath  文件夹路径
 * @param level 当前所在文件夹层级
 */
const CreateFolder = (folderPath: string, level = 1) => {
  const folder = folderPath.split("\\");
  const currentfolderPath = folder.slice(0, level).join("\\");

  if (fs.existsSync(currentfolderPath)) {
    if (level !== folder.length) {
      CreateFolder(folderPath, ++level);
    }
  } else {
    fs.mkdirSync(currentfolderPath);
    if (level !== folder.length) {
      CreateFolder(folderPath, ++level);
    }
  }
};

/**
 *
 * @param files 上传的文件对象
 * @param folderPath 文件保存的路径
 * @returns
 */
const UploadFile: UoloadImageType = (files, path = "\\upload\\file") => {
  const date = new Date();
  const time = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
  const folderPath = `${root + path}\\${time}`;
  return new Promise((resolve, reject) => {
    if (typeof files === "undefined") return reject("未获取到文件流");
    const { file } = files;
    /** 如果是多个文件 */
    if (Array.isArray(file)) {
      const FileNames: string[] = [];
      const filePathes: string[] = [];
      file.forEach((fileItem) => {
        const fileReader = fs.createReadStream(fileItem.path);
        CreateFolder(folderPath);
        const filePath = `${folderPath}\\${+date}-${fileItem.name}`;
        const fileWrite = fs.createWriteStream(filePath);
        fileReader.pipe(fileWrite);
        FileNames.push(`${+date}-${fileItem.name}`);
        filePathes.push(
          `${path.replace(/\\/g, "/")}/${time}/${+date}-${fileItem.name}`
        );
      });
      resolve({
        fileName: FileNames,
        filePath: filePathes,
      });
    } else {
      // 如果是单个文件
      const fileReader = fs.createReadStream(file.path);
      CreateFolder(folderPath);
      const filePath = `${folderPath}\\${+date}-${file.name}`;
      const fileWrite = fs.createWriteStream(filePath);
      fileReader.pipe(fileWrite);
      resolve({
        fileName: `${+date}-${file.name}`,
        filePath: `${path.replace(/\\/g, "/")}/${time}/${+date}-${file.name}`,
      });
    }
  });
};

export default UploadFile;
