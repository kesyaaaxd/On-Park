const express = require("express");
const db = require("../db");

const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateToken);

function getPositiveId(value) {
  const id = Number(value);

  return Number.isSafeInteger(id) && id > 0
    ? id
    : null;
}

function getReservationForUser(reservationId, user) {
  let query = `
    SELECT
      r.*,
      pl.price_per_hour
    FROM reservations r
    JOIN parking_slots ps ON ps.id = r.parking_slot_id
    JOIN parking_locations pl
      ON pl.id = ps.parking_location_id
    WHERE r.id = ?
  `;

  const params = [reservationId];

  if (user.role === "client") {
    query += " AND r.user_id = ?";
    params.push(user.id);
  }

  return db.prepare(query).get(...params);
}

// POST /api/reservations/:id/payments
router.post(
  "/reservations/:id/payments",
  authorizeRoles("client"),
  (req, res) => {
    const reservationId = getPositiveId(req.params.id);
    const { payment_method } = req.body;

    const validMethods = [
      "Cash",
      "Bank Transfer",
      "E-Wallet",
    ];

    if (
      !reservationId ||
      !validMethods.includes(payment_method)
    ) {
      return res.status(400).json({
        message: "Provide a valid reservation ID and payment method.",
      });
    }

    const reservation = getReservationForUser(
      reservationId,
      req.user
    );

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found.",
      });
    }

    if (reservation.status !== "confirmed") {
      return res.status(409).json({
        message: "This reservation is not eligible for payment.",
      });
    }

    const start = Date.parse(reservation.start_time);
    const end = Date.parse(reservation.end_time);

    if (
      !Number.isFinite(start) ||
      !Number.isFinite(end) ||
      end <= start
    ) {
      return res.status(400).json({
        message: "Reservation time information is invalid.",
      });
    }

    const durationHours = (end - start) / 3600000;

    const amount = Math.round(
      durationHours * reservation.price_per_hour
    );

    const pay = db.transaction(() => {
      const result = db
        .prepare(`
          INSERT INTO payments (
            reservation_id,
            amount,
            payment_method,
            payment_status,
            paid_at
          )
          VALUES (?, ?, ?, 'paid', CURRENT_TIMESTAMP)
        `)
        .run(
          reservationId,
          amount,
          payment_method
        );

      db.prepare(`
        UPDATE reservations
        SET status = 'paid'
        WHERE id = ?
      `).run(reservationId);

      return result.lastInsertRowid;
    });

    try {
      const paymentId = pay();

      const payment = db
        .prepare(`
          SELECT *
          FROM payments
          WHERE id = ?
        `)
        .get(paymentId);

      res.status(201).json({
        message: "Simulated payment recorded successfully.",
        payment,
      });
    } catch (error) {
      console.error("Payment error:", error);

      res.status(500).json({
        message: "Could not record payment.",
      });
    }
  }
);

// GET /api/reservations/:id/payments
router.get(
  "/reservations/:id/payments",
  (req, res) => {
    const reservationId = getPositiveId(req.params.id);

    if (!reservationId) {
      return res.status(400).json({
        message: "Invalid reservation ID.",
      });
    }

    const reservation = getReservationForUser(
      reservationId,
      req.user
    );

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found.",
      });
    }

    const payments = db
      .prepare(`
        SELECT *
        FROM payments
        WHERE reservation_id = ?
        ORDER BY created_at DESC
      `)
      .all(reservationId);

    res.json(payments);
  }
);

// GET /api/payments/:id
router.get("/payments/:id", (req, res) => {
  const id = getPositiveId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Invalid payment ID.",
    });
  }

  const payment = db
    .prepare(`
      SELECT
        p.*,
        r.user_id
      FROM payments p
      JOIN reservations r
        ON r.id = p.reservation_id
      WHERE p.id = ?
    `)
    .get(id);

  if (
    !payment ||
    (
      req.user.role === "client" &&
      payment.user_id !== req.user.id
    )
  ) {
    return res.status(404).json({
      message: "Payment not found.",
    });
  }

  res.json(payment);
});

module.exports = router;