const express = require("express");
const router = express.Router();
const middlewareController = require("../controllers/middlewareControler");
const {
  getFieldAvailability,
  updateFieldAvailabilityStatus,
  deleteFieldAvailability,
  getBillsUser,
  getBillsOwner,
} = require("../controllers/FieldAvailabilityController");

router.get("/availability", getFieldAvailability);
router.put(
  "/update_status",
  middlewareController.verifyToken,
  updateFieldAvailabilityStatus
);
router.delete(
  "/delete/:id",
  middlewareController.verifyToken,
  deleteFieldAvailability
);
router.get("/bills_user", middlewareController.verifyToken, getBillsUser);

router.get("/bills_owner", middlewareController.verifyToken, getBillsOwner);
module.exports = router;
