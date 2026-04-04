const express = require("express");
const path = require("path");

const app = express();

// servir arquivos da pasta public
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3000, () => {
  console.log("Servidor rodando em: http://localhost:3000");
});