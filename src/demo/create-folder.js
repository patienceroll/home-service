import fs from "fs";

const CreateFolder = (folderPath, level = 1) => {
  const folder = folderPath.split("\\");
  const currentfolderPath = folder.slice(0, level).join("\\");
  if (fs.existsSync(currentfolderPath)) {
    if (level !== folder.length) {
      CreateFolder(folderPath, ++level);
    }
  } else {
    fs.mkdir(currentfolderPath, (err) => {
      if (err) {
        throw new Error(err.message);
      } else {
        CreateFolder(folderPath, ++level);
      }
    });
  }
};

CreateFolder("D:\\personal-program\\home-service\\src\\upload\\file\\2021318");
