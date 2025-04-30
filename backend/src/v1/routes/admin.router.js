import express from "express";
import {
  addMedicineController,
  deleteMedicineController,
  updateMedicineController,
  getUserQueries,
  answerQueries,
  getUserQueryById,
  getAllOrdersController,
  inActiveMeds
} from "../controllers/admin.controller.js";
import authAdmin from "../middleware/accessControl.js";
import uploadFile from "../middleware/multer.middleware.js";
import authUser from "../middleware/auth.user.js";

const router = express.Router();

router
  .route("/addMedicines")
  .post(
    authUser,
    authAdmin(["admin"]),
    uploadFile.single("images"),
    addMedicineController
  );
router
  .route("/deleteMedicines/:id")
  .delete(authUser, authAdmin(["admin"]), deleteMedicineController);
router
  .route("/updateMedicines/:id")
  .patch(
    authUser,
    authAdmin(["admin"]),
    uploadFile.single("images"),
    updateMedicineController
  );
router
  .route("/userQueries")
  .get(authUser, authAdmin(["admin"]), getUserQueries);
router
  .route("/answerQueries/:id")
  .patch(authUser, authAdmin(["admin"]), answerQueries);
router.route("/getUserQuery/:id").get(authUser, authAdmin(["admin"]), getUserQueryById);
router.route("/orders").get(authUser, authAdmin(["admin"]), getAllOrdersController);
router.route("/inActive/Products").get(authUser, authAdmin(["admin"]), inActiveMeds);
export default router;
