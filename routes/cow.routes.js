const router = require("express").Router();
const { Cow, validate } = require("../models/cow.model");
const { Ranch } = require("../models/ranch.model");
const methods = require("../methods");

// Get Livestocks
router.get("/", methods.ensureToken, async (req, res) => {
  const cows = await Cow.find();
  res.status(200).json(cows);
});

// Get a Livestock
router.get("/:id", methods.ensureToken, async (req, res) => {
  const cow = await Cow.findById(req.params.id);
  res.status(200).json(cow);
});

// Create a new Livestock
router.post("/", methods.ensureToken, async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send({ msg: error.details[0].message });
    }

    const cow = await Cow.findOne({ nombre: req.body.nombre });
    if (cow) {
      return res.status(409).send({
        msg: `Ya existe un bovino registrado con el nombre ${req.body.nombre}`,
      });
    }

    const newCow = await new Cow({ ...req.body }).save();

    const ranchId = req.body.ranch;
    const cowId = newCow._id;

    const ranch = await Ranch.findById(ranchId);
    ranch.cows.push(cowId);
    await ranch.save();

    res.status(201).send({ msg: "Cow created successfully" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

// Add Weight
router.post("/weight", methods.ensureToken, async (req, res) => {
  try {
    const cow = await Cow.findById(req.body.id);
    cow.pesos.push({
      fecha: req.body.fecha,
      peso: req.body.peso,
      descripcion: req.body.descripcion,
    });
    await cow.save();
    res.status(200).send({ msg: "Weight added successfully" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

router.post("/milk", methods.ensureToken, async (req, res) => {
  try {
    const cow = await Cow.findById(req.body.id);
    cow.leche.push({
      fecha: req.body.fecha,
      ltsManiana: req.body.ltsManiana,
      ltsTarde: req.body.ltsTarde,
    });
    await cow.save();
    res.status(200).send({ msg: "Lts of milk added successfully" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

router.post("/treatments", methods.ensureToken, async (req, res) => {
  try {
    const cow = await Cow.findById(req.body.id);
    cow.tratamientos.push({
      fecha: req.body.fecha,
      diagnostico: req.body.diagnostico,
      medicamento: req.body.medicamento,
      dias: req.body.dias,
    });
    await cow.save();
    res.status(200).send({ msg: "Treatment added successfully" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

router.post("/vaccinations", methods.ensureToken, async (req, res) => {
  try {
    const cow = await Cow.findById(req.body.id);
    cow.vacunas.push({
      fecha: req.body.fecha,
      enfermedad: req.body.enfermedad,
      vacuna: req.body.vacuna,
      dosis: req.body.dosis,
    });
    await cow.save();
    res.status(200).send({ msg: "Vaccination added successfully" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

router.delete("/:id", methods.ensureToken, async (req, res) => {
  try {
    await Cow.findByIdAndDelete(req.params.id);
    res.status(200).send({ msg: "Cow deleted successfully" });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
});

module.exports = router;
