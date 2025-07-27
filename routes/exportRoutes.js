const express = require("express");
const router = express.Router();
const { downloadComponent } = require("../controllers/exportController");

router.get("/download/:id", downloadComponent);

module.exports = router;
