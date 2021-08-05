const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const musicalSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Email Already taken!!"],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Not a valid email");
      }
    },
  },
  gender: {
    type: String,
    required: true,
    lowercase: true,
    enum: ["male", "female"],
  },
  phone: {
    type: Number,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

musicalSchema.pre("save", async function(next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
    next();
    }    
})
const Musical = new mongoose.model("Musical", musicalSchema);

module.exports = Musical;
