import Reservation from "../models/Reservation.js";

class ReservationService {
  async createReservation(reservationData) {
    try {
      const restaurantReservations = await this.getRestaurantReservationsCount(
        reservationData.restaurantId,
        reservationData.date
      );
      if (restaurantReservations >= 15) {
        throw new Error("Restaurant is fully booked for this date");
      }

      const globalReservations = await this.getGlobalReservationsCount(
        reservationData.date
      );
      if (globalReservations >= 20) {
        throw new Error("No more reservations available for this date");
      }

      const reservation = new Reservation(reservationData);
      return await reservation.save();
    } catch (error) {
      throw new Error(`Error creating reservation: ${error.message}`);
    }
  }

  async getReservationsByUser(userId) {
    try {
      return await Reservation.find({ userId }).populate("restaurantId");
    } catch (error) {
      throw new Error(`Error fetching reservations: ${error.message}`);
    }
  }

  async getRestaurantReservationsCount(restaurantId, date) {
    const startOfDay = new Date(date).setHours(0, 0, 0, 0);
    const endOfDay = new Date(date).setHours(23, 59, 59, 999);

    return await Reservation.countDocuments({
      restaurantId,
      date: { $gte: startOfDay, $lt: endOfDay },
    });
  }

  async getGlobalReservationsCount(date) {
    const startOfDay = new Date(date).setHours(0, 0, 0, 0);
    const endOfDay = new Date(date).setHours(23, 59, 59, 999);

    return await Reservation.countDocuments({
      date: { $gte: startOfDay, $lt: endOfDay },
    });
  }
}

export default new ReservationService();
