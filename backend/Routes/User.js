const express = require("express");
const { getUserById } = require("../Controllers/UserController");

const router = express.Router();

router.get("/:id", getUserById);

module.exports = router;
