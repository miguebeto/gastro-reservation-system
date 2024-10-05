import RestaurantService from "../services/restaurantService.js";

class RestaurantController {
  async createRestaurant(req, res) {
    try {
      const restaurant = await RestaurantService.createRestaurant(req.body);
      res.status(201).json(restaurant);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getRestaurants(req, res) {
    try {
      const { page, letter, city } = req.query;
      const filters = { letter, city };
      const result = await RestaurantService.getRestaurants(filters, page);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRestaurant(req, res) {
    try {
      const restaurant = await RestaurantService.getRestaurantById(
        req.params.id
      );
      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }
      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateRestaurant(req, res) {
    try {
      const restaurant = await RestaurantService.updateRestaurant(
        req.params.id,
        req.body
      );
      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }
      res.json(restaurant);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteRestaurant(req, res) {
    try {
      const restaurant = await RestaurantService.deleteRestaurant(
        req.params.id
      );
      if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
      }
      res.json({ message: "Restaurant deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new RestaurantController();
