const express = require('express')
const fs = require("fs").promises
const app = express()
const path = require("path")
  
const rootDir = "wwwroot";

app.get("/", (req, res) => {
    res.redirect("/site/");
});

app.get("/site/*", (req, res) => {
    let path = req.path;
    path = path.substring(5);
    if (path == "/") {
        path = "/index.html";
    }
    res.sendFile(process.cwd() + "/" + rootDir + path);
});

app.get("/api/animals", async (req, res) => {
    const query = req.query.animal ? req.query.animal.toLowerCase() : "";

    let files = await fs.readdir("wwwroot/imgs");

    let file = files.filter((file) => file.includes(query));
    file = file.map((name) => "imgs/" + name);

    res.json(file);
});
  
app.listen(3000, () => {  
  console.log('Example app listening at http://localhost:3000')  
});