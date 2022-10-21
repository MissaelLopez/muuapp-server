const router = require("express").Router();
const { User } = require("../models/user.model");
const joi = require("joi");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASS,
  },
  secure: true,
});

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({ msg: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({ msg: "El correo no ha sido registrado" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).send({ msg: "Contraseña Incorrecta" });
    }

    const token = user.generateAuthToken(user.id);

    res
      .status(200)
      .send({ token, user: user.id, msg: "Logged in successfully" });
  } catch (error) {
    res.status(500).send({ msg: "Internal server error" });
  }
});

router.post("/recover", async (req, res) => {
  const mailData = {
    from: "MuuApp",
    to: req.body.email,
    subject: "Sending Email using NodeJS",
    html: `<p>Recuperacion de contrasenia</p>
          <br />
          This is our first message sent with Nodemailer`,
  };

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send({ msg: "Internal server error" });
    }
    res.status(200).send({ msg: "Mail send", messageId: info.messageId });
  });
});

const validate = (data) => {
  const schema = joi.object({
    email: joi.string().email().required().label("Email"),
    password: joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = router;
