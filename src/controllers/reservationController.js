import ReservationService from "../services/reservationService.js";

class ReservationController {
  async createReservation(req, res) {
    try {
      const reservation = await ReservationService.createReservation({
        ...req.body,
        userId: req.user.id,
      });
      res.status(201).json(reservation);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getReservations(req, res) {
    try {
      const reservations = await ReservationService.getReservationsByUser(
        req.user.id
      );
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getReservation(req, res) {
    try {
      const reservation = await ReservationService.getReservationById(
        req.params.id
      );
      if (!reservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }
      if (reservation.userId.toString() !== req.user.id) {
        return res.status(403).json({ error: "Not authorized" });
      }
      res.json(reservation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateReservation(req, res) {
    try {
      const reservation = await ReservationService.updateReservation(
        req.params.id,
        req.body
      );
      if (!reservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }
      res.json(reservation);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteReservation(req, res) {
    try {
      const reservation = await ReservationService.deleteReservation(
        req.params.id
      );
      if (!reservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }
      res.json({ message: "Reservation deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new ReservationController();
