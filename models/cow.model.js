const joi = require("joi");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const pesoSchema = mongoose.Schema(
  {
    nacer: { type: String, required: false, default: 0 },
    destetar: { type: String, required: false, default: 0 },
    unAnio: { type: String, required: false, default: 0 },
    actual: { type: String, required: false, default: 0 },
  },
  { _id: false }
);

const padresSchema = mongoose.Schema(
  {
    padre: { type: String, required: false, default: "" },
    madre: { type: String, required: false, default: "" },
  },
  { _id: false }
);

const CowSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  picture: { type: String, required: true },
  genero: { type: String, required: true },
  raza: { type: String, required: true },
  utp: { type: String, required: true },
  fechaNacimiento: { type: Date, required: true },
  etapa: { type: String, required: true },
  peso: pesoSchema,
  padres: padresSchema,
  pesos: [{ fecha: Date, peso: String, descripcion: String, _id: false }],
  leche: [
    {
      fecha: Date,
      ltsManiana: String,
      ltsTarde: String,
      _id: false,
    },
  ],
  tratamientos: [
    { fecha: Date, diagnostico: String, medicamento: String, dias: String, _id: false, },
  ],
  vacunas: [
    { fecha: Date, enfermedad: String, vacuna: String, dosis: String, _id: false, },
  ],
  ranch: { type: ObjectId, ref: "ranch", required: true },
});

const Cow = mongoose.model("cow", CowSchema);

const validate = (data) => {
  const schema = joi.object({
    nombre: joi.string().required().label("nombre"),
    picture: joi.string().required().label("picture"),
    genero: joi.string().required().label("genero"),
    raza: joi.string().required().label("raza"),
    utp: joi.string().required().label("utp"),
    fechaNacimiento: joi.date().required().label("fechaNacimiento"),
    etapa: joi.string().required().label("etapa"),
    peso: joi.object().label("peso"),
    padres: joi.object().label("padres"),
    ranch: joi.string().required().label("ranch id"),
  });
  return schema.validate(data);
};

module.exports = { Cow, validate };
