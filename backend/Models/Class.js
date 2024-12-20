const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ClassModel = mongoose.model("classes", ClassSchema);
module.exports = ClassModel;
