import Restaurant from "../models/Restaurant.js";

class RestaurantService {
  async createRestaurant(restaurantData) {
    try {
      const restaurant = new Restaurant(restaurantData);
      return await restaurant.save();
    } catch (error) {
      throw new Error(`Error creating restaurant: ${error.message}`);
    }
  }

  async getRestaurants(filters, page = 1, limit = 20) {
    try {
      const query = {};
      if (filters.letter) query.name = new RegExp(`^${filters.letter}`, "i");
      if (filters.city) query.city = filters.city;

      const skip = (page - 1) * limit;
      const restaurants = await Restaurant.find(query).skip(skip).limit(limit);

      const total = await Restaurant.countDocuments(query);

      return {
        restaurants,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
      };
    } catch (error) {
      throw new Error(`Error fetching restaurants: ${error.message}`);
    }
  }

  async getRestaurantById(id) {
    try {
      return await Restaurant.findById(id);
    } catch (error) {
      throw new Error(`Error fetching restaurant: ${error.message}`);
    }
  }

  async updateRestaurant(id, updateData) {
    try {
      return await Restaurant.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      throw new Error(`Error updating restaurant: ${error.message}`);
    }
  }

  async deleteRestaurant(id) {
    try {
      return await Restaurant.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting restaurant: ${error.message}`);
    }
  }
}

export default new RestaurantService();
