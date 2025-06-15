const express = require("express");
const path = require("path");
const app = express();

const rootDir = "wwwroot"
app.use(express.static(path.join(__dirname, rootDir)));

app.get("*", async (req, res) => {
  let reqPath = req.path;
  console.log(reqPath);

  if (reqPath == "/") {
    reqPath = "/index.html";
  }

  res.sendFile(process.cwd() + "/" + rootDir + reqPath);
});

app.listen(3000, "localhost", () => {
  console.log("Example app listening at http://localhost:3000");
});