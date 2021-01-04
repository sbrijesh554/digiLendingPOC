//imports
const express = require("express");
const app = express();
const cors = require("cors");
// const { v4: uuidv4 } = require("uuid");
// const pool = require("./db");
// const Helper = require("./common/helper");
// const moment = require("moment");
// const emailService = require("./common/utils/nodemailer");
// const jwt = require("jsonwebtoken");
// const generator = require("generate-password");

//db import
// const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json()); //req.body

//routes
app.use("/api/auth", require("./routes/auth"));

app.use("/", require("./routes/index"));

app.listen(8000, () => {
  console.log("server has started at port 8000");
});
