const express = require("express");
const app = express();
const authRoute = require("./routers/auth");
require("dotenv").config();

const PORT = 8081;

app.use(express.json());

app.use("/api/auth", authRoute);

app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));
