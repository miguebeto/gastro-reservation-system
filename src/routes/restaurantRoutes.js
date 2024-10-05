import express from "express";
import RestaurantController from "../controllers/restaurantController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticateToken, RestaurantController.createRestaurant);
router.get("/", RestaurantController.getRestaurants);
router.get("/:id", RestaurantController.getRestaurant);
router.put("/:id", authenticateToken, RestaurantController.updateRestaurant);
router.delete("/:id", authenticateToken, RestaurantController.deleteRestaurant);

export default router;
