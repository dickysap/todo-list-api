const fs = require("fs");

const createFile = (folder, json) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  if (!fs.existsSync(json)) {
    fs.writeFileSync(json, "[]", "utf-8");
  }
};

// const createUserLogin = () => {
//   const DATA_DIR = "./user-login";
//   if (!fs.existsSync(DATA_DIR)) {
//     fs.mkdirSync(DATA_DIR);
//     console.log("Folder Berhasil dibuat");
//   }
//   const DATA_JSON = "./user-login/user-login.json";
//   if (!fs.existsSync(DATA_JSON)) {
//     fs.writeFileSync(DATA_JSON, "[]", "utf-8");
//     console.log("file user-login.json berhasil di buat");
//   }
// };

const readNotes = (dir) => {
  const fileBuffer = fs.readFileSync(dir, "utf-8");
  const data = JSON.parse(fileBuffer);
  return data;
};

module.exports = {
  createFile,
  readNotes,
};
