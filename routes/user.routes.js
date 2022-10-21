const router = require("express").Router();
const { User, validate } = require("../models/user.model");
const bcrypt = require("bcrypt");
const methods = require("../methods");

// Get users
router.get("/", methods.ensureToken, async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

// Get a user
router.get("/:id", methods.ensureToken, async (req, res) => {
  const user = await User.findById(req.params.id).populate("ranchs");
  res.status(200).json(user);
});

// Create a new user
router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error) {
      if (
        error.details[0].message ===
        '"Password" should be at least 8 characters long'
      ) {
        return res
          .status(400)
          .send({ msg: "La contraseña debe contener 8 caracteres" });
      }

      if (
        error.details[0].message ===
        '"Password" should contain at least 1 lower-cased letter'
      ) {
        return res
          .status(400)
          .send({ msg: "La contraseña debe contener una letra minúscula" });
      }

      if (
        error.details[0].message ===
        '"Password" should contain at least 1 upper-cased letter'
      ) {
        return res
          .status(400)
          .send({ msg: "La contraseña debe contener una letra mayúscula" });
      }

      if (
        error.details[0].message ===
        '"Password" should contain at least 1 symbol'
      ) {
        return res
          .status(400)
          .send({ msg: "La contraseña debe contener un símbolo" });
      }
    }

    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(409).send({ msg: "El email ya esta registrado" });
    }

    const salt = await bcrypt.genSalt(Number(10));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await new User({ ...req.body, password: hashPassword }).save();
    res.status(201).send({ msg: "User created successfully" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

router.delete("/:id", methods.ensureToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send({ msg: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

module.exports = router;
