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

const reservationQuery = `
  SELECT
    r.*,
    u.username,
    u.full_name AS client_name,
    ps.slot_number,
    ps.parking_location_id,
    pl.name AS parking_name,
    pl.address AS parking_address,
    pl.price_per_hour
  FROM reservations r
  JOIN users u ON u.id = r.user_id
  JOIN parking_slots ps ON ps.id = r.parking_slot_id
  JOIN parking_locations pl ON pl.id = ps.parking_location_id
`;

// GET /api/reservations
router.get(
  "/",
  authorizeRoles("admin"),
  (req, res) => {
    const reservations = db
      .prepare(`
        ${reservationQuery}
        ORDER BY r.created_at DESC
      `)
      .all();

    res.json(reservations);
  }
);

// GET /api/reservations/my
router.get(
  "/my",
  authorizeRoles("client"),
  (req, res) => {
    const reservations = db
      .prepare(`
        ${reservationQuery}
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC
      `)
      .all(req.user.id);

    res.json(reservations);
  }
);

// GET /api/reservations/:id
router.get("/:id", (req, res) => {
  const id = getPositiveId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Invalid reservation ID.",
    });
  }

  let query = `
    ${reservationQuery}
    WHERE r.id = ?
  `;

  const params = [id];

  if (req.user.role === "client") {
    query += " AND r.user_id = ?";
    params.push(req.user.id);
  }

  const reservation = db.prepare(query).get(...params);

  if (!reservation) {
    return res.status(404).json({
      message: "Reservation not found.",
    });
  }

  res.json(reservation);
});

// POST /api/reservations
router.post(
  "/",
  authorizeRoles("client"),
  (req, res) => {
    const {
      parking_slot_id,
      start_time,
      end_time,
      vehicle_number,
    } = req.body;

    const slotId = getPositiveId(parking_slot_id);

    if (
      !slotId ||
      typeof start_time !== "string" ||
      typeof end_time !== "string" ||
      typeof vehicle_number !== "string" ||
      !vehicle_number.trim()
    ) {
      return res.status(400).json({
        message: "Provide a valid slot, time range, and vehicle number.",
      });
    }

    const start = Date.parse(start_time);
    const end = Date.parse(end_time);

    if (
      !Number.isFinite(start) ||
      !Number.isFinite(end) ||
      end <= start ||
      start <= Date.now()
    ) {
      return res.status(400).json({
        message: "Reservation times must be valid and in the future.",
      });
    }

    const slot = db
      .prepare(`
        SELECT
          ps.*,
          pl.price_per_hour
        FROM parking_slots ps
        JOIN parking_locations pl
          ON pl.id = ps.parking_location_id
        WHERE ps.id = ?
      `)
      .get(slotId);

    if (!slot) {
      return res.status(404).json({
        message: "Parking slot not found.",
      });
    }

    if (slot.status !== "available") {
      return res.status(409).json({
        message: "This parking slot is not currently available.",
      });
    }

    const conflictingReservation = db
      .prepare(`
        SELECT id
        FROM reservations
        WHERE parking_slot_id = ?
          AND status IN ('confirmed', 'paid')
          AND start_time < ?
          AND end_time > ?
        LIMIT 1
      `)
      .get(slotId, end_time, start_time);

    if (conflictingReservation) {
      return res.status(409).json({
        message: "This slot already has a reservation during that period.",
      });
    }

    const createReservation = db.transaction(() => {
      const result = db
        .prepare(`
          INSERT INTO reservations (
            user_id,
            parking_slot_id,
            start_time,
            end_time,
            vehicle_number,
            status
          )
          VALUES (?, ?, ?, ?, ?, 'confirmed')
        `)
        .run(
          req.user.id,
          slotId,
          start_time,
          end_time,
          vehicle_number.trim()
        );

      return result.lastInsertRowid;
    });

    try {
      const reservationId = createReservation();

      const reservation = db
        .prepare(`
          ${reservationQuery}
          WHERE r.id = ?
        `)
        .get(reservationId);

      res.status(201).json({
        message: "Reservation created.",
        reservation,
      });
    } catch (error) {
      console.error("Reservation error:", error);

      res.status(500).json({
        message: "Could not create reservation.",
      });
    }
  }
);

// PUT /api/reservations/:id/cancel
router.put(
  "/:id/cancel",
  authorizeRoles("client"),
  (req, res) => {
    const id = getPositiveId(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "Invalid reservation ID.",
      });
    }

    const reservation = db
      .prepare(`
        SELECT *
        FROM reservations
        WHERE id = ? AND user_id = ?
      `)
      .get(id, req.user.id);

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found.",
      });
    }

    if (reservation.status !== "confirmed") {
      return res.status(409).json({
        message: "Only unpaid confirmed reservations can be cancelled.",
      });
    }

    db.prepare(`
      UPDATE reservations
      SET status = 'cancelled'
      WHERE id = ?
    `).run(id);

    res.json({
      message: "Reservation cancelled.",
    });
  }
);

// PUT /api/reservations/:id
// Administrator can update reservation status.
router.put(
  "/:id",
  authorizeRoles("admin"),
  (req, res) => {
    const id = getPositiveId(req.params.id);
    const { status } = req.body;

    const validStatuses = [
      "confirmed",
      "paid",
      "completed",
      "cancelled",
    ];

    if (!id || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Provide a valid reservation ID and status.",
      });
    }

    const result = db
      .prepare(`
        UPDATE reservations
        SET status = ?
        WHERE id = ?
      `)
      .run(status, id);

    if (result.changes === 0) {
      return res.status(404).json({
        message: "Reservation not found.",
      });
    }

    res.json({
      message: "Reservation status updated.",
      reservation: db
        .prepare(`
          ${reservationQuery}
          WHERE r.id = ?
        `)
        .get(id),
    });
  }
);

module.exports = router;