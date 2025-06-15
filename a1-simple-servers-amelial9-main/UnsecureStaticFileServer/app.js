const fs = require("fs").promises;
const express = require("express");
const path = require("path");
const app = express();

app.get("*", async (req, res) => {
  let reqPath = req.path;
  console.log(reqPath);

  if (reqPath == "/") {
    reqPath = "/index.html";
  }

  console.log(path.join("wwwroot", reqPath))
  let filedata = await fs.readFile(path.join("wwwroot", reqPath));
  
  if (reqPath.endsWith(".html")) {
    res.type("html");
  }
  else if (reqPath.endsWith(".css")) {
    res.type("css");
  }
  else if (reqPath.endsWith(".js")) {
    res.type("js");
  }
  else if (reqPath.endsWith(".txt")) {
    res.type("txt");
  }

  res.send(filedata);
});

app.listen(3000, "localhost", () => {
  console.log("Example app listening at http://localhost:3000");
});