const fs = require("fs");
const path = require("path");

fs.writeFile(
  path.join(__dirname, "text.txt"),
  ,
  (err) => {
    if (err) throw err;
    console.log("File was created");
  },
);