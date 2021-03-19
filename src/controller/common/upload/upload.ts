import { InitRoutersType } from "../../../global";

import UploadFile from "../../../common/upload-file/upload-file";
import Response from "../../../base-response/base-response";

/** 初始化上传文件router */
const InitUploadRouter: InitRoutersType = (koa, router, client) => {
  router.post("上传图片", "/upload/image", async (ctx, next) => {
    const {
      request: { files },
    } = ctx;
    const data = await UploadFile(files, "\\upload\\image");

    ctx.body = Response.baseResponse({
      fileName: data.fileName,
      filePath: data.filePath,
    });
  });
};

export default InitUploadRouter;
