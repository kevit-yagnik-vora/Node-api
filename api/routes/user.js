const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");


router.get("/getAllUsers", userController.getAllUsers);

router.post("/addUser", userController.addUser);

router.post("/login", userController.userLogin);
router.post("/test", (req, res) => {
  // This is just a test endpoint
  res.status(200).send({ message: "POST Request is called" });
});

module.exports = router;
