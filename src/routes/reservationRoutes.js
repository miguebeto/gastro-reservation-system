import express from "express";
import ReservationController from "../controllers/reservationController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticateToken, ReservationController.createReservation);
router.get("/", authenticateToken, ReservationController.getReservations);
router.get("/:id", authenticateToken, ReservationController.getReservation);
router.put("/:id", authenticateToken, ReservationController.updateReservation);
router.delete(
  "/:id",
  authenticateToken,
  ReservationController.deleteReservation
);

export default router;
