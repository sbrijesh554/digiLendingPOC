//imports
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Helper = require("../utils/helper");
const { v4: uuidv4 } = require("uuid");
const pool = require("../utils/db");
const moment = require("moment");
const emailService = require("../utils/nodemailer");
const generator = require("generate-password");
require("dotenv").config();

//routes
//create user
router.post("/signUp/", async (req, res) => {
  if (!req.body.email || !req.body.role) {
    return res.status(400).send({ message: "Some values are missing" });
  }

  if (!Helper.isValidEmail(req.body.email)) {
    return res
      .status(400)
      .send({ message: "Please enter a valid email address" });
  }

  const password = generator.generate({
    length: 10,
    numbers: true
  });

  // 'uEyMTw32v9'
  console.log("generated password", password);

  const hashPassword = Helper.hashPassword(password);
  console.log("hashpassword", hashPassword);
  try {
    console.log(req.body);
    //    const {email} = await req.body.email;
    //    const {password} = await req.body.password;
    //     const {role} = await req.body.role;

    //     console.log("uuid ",uuidv4());
    //     // const {new_uuid} = await uuidv4();
    //     // console.log(new_uuid);

    const new_user = await pool.query(
      "INSERT INTO users (id,email,password,role,created_date) VALUES($1,$2,$3,$4,$5) returning *",
      [
        uuidv4(),
        req.body.email,
        hashPassword,
        req.body.role,
        moment(new Date())
      ]
    );
    const token = Helper.generateToken(new_user.rows[0].id);
    console.log("token check", token);

    const baseUrl = req.protocol + "://" + req.get("host");

    console.log(process.env.EMAIL_USERNAME, process.env.EMAIL_PASSWORD);
    console.log("to", new_user.rows[0].email);
    const data = {
      from: process.env.EMAIL_USERNAME,
      to: new_user.rows[0].email,
      subject: "Your Activation Link for YOUR APP",
      text: `Please use the following link within the next 10 minutes to activate your account on YOUR APP: ${baseUrl}/activateAccount/${new_user.rows[0].id}/${token}`,
      html: `<p>Please use the following link within the next 12 minutes to activate your account on YOUR APP: <strong><a href="${baseUrl}/activateAccount/${new_user.rows[0].id}/${token}" target="_blank">CLICK TO VERIFY</a></strong></p>`
    };
    await emailService.sendMail(data, (err, info) => {
      if (err) {
        console.log("email error", err);
        return;
      }
      console.log("email info --", info);
    });

    res.json({
      user_info: new_user.rows[0],
      token: token,
      message: "please check your inbox and activate your account",
      temporary_password: password
    });
  } catch (err) {
    console.log("error  -- ", err);
    res.status(409).json(err.detail);
  }
});

//api for activating the email account
router.get("/activateAccount/:userId/:token", async (req, res) => {
  console.log("PARAMS -----", req.params);

  try {
    const decoded = await jwt.verify(req.params.token, process.env.SECRET);
    console.log("decode --", decoded);
    const text = "SELECT * FROM users WHERE id = $1";
    const { rows } = await pool.query(text, [decoded.userId]);

    console.log("rows --", rows);

    if (!rows[0]) {
      return res
        .status(400)
        .send({ message: "The token you provided is invalid" });
    } else {
      const updateText = "update users set active=$1 where id=$2 returning *";
      const { rows } = await pool.query(updateText, [true, decoded.userId]);
      console.log("rows check--", rows);
      return res
        .status(201)
        .json({ message: "account activated", details: rows });
    }
  } catch (err) {
    console.log("err--", err);
    return res.status(400).json({ error: err });
  }
});

//api for making status active

router.patch("/user/changeStatus/", (req, res) => {
  console.log("change status");

  if (!req.body.user_id) {
    return res.status(400).send({ message: "Some values are missing" });
  }

  try {
    text = "Update users set active= $1 where id=$2 returning * ";

    const { rows } = pool.query(text, [true, req.body.user_id]);

    console.log("rows", rows);

    res.status(201).json({
      message: "account activated",
      details: rows
    });
  } catch (err) {
    res.status(409).send(err);
  }
});

// api to login

router.post("/login/", async (req, res) => {
  console.log("req", req);
  console.log("req.user", req.user);
  console.log("req.body", req.body);
  console.log(req.body.password, req.body.role);

  if (!req.body.email || !req.body.password || !req.body.role) {
    return res.status(400).send({ message: "Some values are missing" });
  }
  if (!Helper.isValidEmail(req.body.email)) {
    return res
      .status(400)
      .send({ message: "Please enter a valid email address" });
  }

  const text = "SELECT * FROM users WHERE email = $1 AND role= $2";

  try {
    const { rows } = await pool.query(text, [req.body.email, req.body.role]);
    console.log("rows", rows);
    if (!rows[0]) {
      return res
        .status(400)
        .send({ message: "The email and role you provided is incorrect" });
    }
    if (!Helper.comparePassword(rows[0].password, req.body.password)) {
      return res
        .status(400)
        .send({ message: "The password you provided is incorrect" });
    }
    const token = Helper.generateToken(rows[0].id);
    // return res.status(200).send({ token });
    return res.status(200).json({
      status: "success",
      message: "successful login",
      token: token,
      details: rows[0]
    });
  } catch (error) {
    return res.status(400).send(error);
  }
});

//api for password reset

router.patch("/passwordReset/", async (req, res) => {
  console.log(req.body.password1, req.body.password2);

  if (!req.body.email || !req.body.password1 || !req.body.password2) {
    return res.status(400).send({ message: "Some values are missing" });
  }

  if (req.body.password1 != req.body.password2) {
    return res
      .status(400)
      .send({ message: "password1 not equal to password2" });
  }

  const hashPassword = Helper.hashPassword(req.body.password1);
  console.log("hashpassword", hashPassword);

  try {
    text = "Update users set password=$1 where email=$2 returning *";
    const { rows } = await pool.query(text, [hashPassword, req.body.email]);
    console.log("rows", rows);

    res.status(201).json({
      message: "password changed successfully",
      details: rows
    });
  } catch (err) {
    res.status(409).send(err);
  }
});

//api for practice logics
router.get("/practice/", async (req, res) => {
  try {
    const text = "select email from users";
    const rows = await pool.query(text);
    console.log("rows", rows.rows[0]);

    for (item in rows.rows) {
      console.log("email ", rows.rows[item].email);
    }

    res.status(200).json({
      rows: rows.rows
    });
  } catch (err) {
    console.log(err);
    res.status(409).json({
      err: err
    });
  }
});

//api for bulk upload of personel details
router.post("/bulkUpload/personelDetails/", async (req, res) => {
  console.log(req.body.user_details);
  const array = req.body.user_details;
  console.log("array", array);
  if (!req.body.user_details) {
    res.status(400).send("data is missing");
  }

  try {
    text =
      "INSERT INTO personel_details1 (id,user_id,name,created_date) VALUES($1,$2,$3,$4) returning *";

    for (index in array) {
      console.log("check");
      console.log(array[index].user_id);
      const { rows } = await pool.query(text, [
        uuidv4(),
        array[index].user_id,
        array[index].name,
        moment(new Date())
      ]);
      console.log("rows", rows);
    }
    console.log("ends");
    res.status(200).json({
      message: "bulk data uploaded"
    });
  } catch (err) {
    res.status(409).send(err);
  }
});

module.exports = router;
