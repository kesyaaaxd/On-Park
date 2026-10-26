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

function getLocationById(id) {
  return db
    .prepare(`
      SELECT *
      FROM parking_locations
      WHERE id = ?
    `)
    .get(id);
}

// GET /api/parking-locations
router.get("/parking-locations", (req, res) => {
  const locations = db
    .prepare(`
      SELECT
        pl.*,
        COUNT(ps.id) AS slot_count,
        COALESCE(
          SUM(
            CASE
              WHEN ps.status = 'available' THEN 1
              ELSE 0
            END
          ),
          0
        ) AS available_slots
      FROM parking_locations pl
      LEFT JOIN parking_slots ps
        ON ps.parking_location_id = pl.id
      GROUP BY pl.id
      ORDER BY pl.id
    `)
    .all();

  res.json(locations);
});

// GET /api/parking-locations/:id
router.get("/parking-locations/:id", (req, res) => {
  const id = getPositiveId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Invalid location ID.",
    });
  }

  const location = getLocationById(id);

  if (!location) {
    return res.status(404).json({
      message: "Parking location not found.",
    });
  }

  res.json(location);
});

// POST /api/parking-locations
router.post(
  "/parking-locations",
  authorizeRoles("admin"),
  (req, res) => {
    const { name, address, total_slots, price_per_hour } =
      req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof address !== "string" ||
      !address.trim() ||
      !Number.isSafeInteger(total_slots) ||
      total_slots < 0 ||
      typeof price_per_hour !== "number" ||
      !Number.isFinite(price_per_hour) ||
      price_per_hour < 0
    ) {
      return res.status(400).json({
        message: "Provide valid location information.",
      });
    }

    const result = db
      .prepare(`
        INSERT INTO parking_locations
          (name, address, total_slots, price_per_hour)
        VALUES (?, ?, ?, ?)
      `)
      .run(
        name.trim(),
        address.trim(),
        total_slots,
        price_per_hour
      );

    const location = getLocationById(result.lastInsertRowid);

    res.status(201).json({
      message: "Parking location created.",
      location,
    });
  }
);

// PUT /api/parking-locations/:id
router.put(
  "/parking-locations/:id",
  authorizeRoles("admin"),
  (req, res) => {
    const id = getPositiveId(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "Invalid location ID.",
      });
    }

    const existing = getLocationById(id);

    if (!existing) {
      return res.status(404).json({
        message: "Parking location not found.",
      });
    }

    const {
      name = existing.name,
      address = existing.address,
      total_slots = existing.total_slots,
      price_per_hour = existing.price_per_hour,
    } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof address !== "string" ||
      !address.trim() ||
      !Number.isSafeInteger(total_slots) ||
      total_slots < 0 ||
      typeof price_per_hour !== "number" ||
      !Number.isFinite(price_per_hour) ||
      price_per_hour < 0
    ) {
      return res.status(400).json({
        message: "Provide valid location information.",
      });
    }

    const actualSlotCount = db
      .prepare(`
        SELECT COUNT(*) AS count
        FROM parking_slots
        WHERE parking_location_id = ?
      `)
      .get(id).count;

    if (total_slots < actualSlotCount) {
      return res.status(400).json({
        message: "Total slots cannot be less than existing slot records.",
      });
    }

    db.prepare(`
      UPDATE parking_locations
      SET name = ?,
          address = ?,
          total_slots = ?,
          price_per_hour = ?
      WHERE id = ?
    `).run(
      name.trim(),
      address.trim(),
      total_slots,
      price_per_hour,
      id
    );

    res.json({
      message: "Parking location updated.",
      location: getLocationById(id),
    });
  }
);

// DELETE /api/parking-locations/:id
router.delete(
  "/parking-locations/:id",
  authorizeRoles("admin"),
  (req, res) => {
    const id = getPositiveId(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "Invalid location ID.",
      });
    }

    const existing = getLocationById(id);

    if (!existing) {
      return res.status(404).json({
        message: "Parking location not found.",
      });
    }

    const reservations = db
      .prepare(`
        SELECT COUNT(*) AS count
        FROM reservations r
        JOIN parking_slots ps
          ON ps.id = r.parking_slot_id
        WHERE ps.parking_location_id = ?
      `)
      .get(id).count;

    if (reservations > 0) {
      return res.status(409).json({
        message: "Cannot delete a location that has reservation history.",
      });
    }

    db.prepare(`
      DELETE FROM parking_locations
      WHERE id = ?
    `).run(id);

    res.json({
      message: "Parking location deleted.",
    });
  }
);

// GET /api/parking-locations/:id/slots
router.get(
  "/parking-locations/:id/slots",
  (req, res) => {
    const locationId = getPositiveId(req.params.id);

    if (!locationId) {
      return res.status(400).json({
        message: "Invalid location ID.",
      });
    }

    if (!getLocationById(locationId)) {
      return res.status(404).json({
        message: "Parking location not found.",
      });
    }

    const slots = db
      .prepare(`
        SELECT *
        FROM parking_slots
        WHERE parking_location_id = ?
        ORDER BY slot_number
      `)
      .all(locationId);

    res.json(slots);
  }
);

// GET /api/parking-slots/:id
router.get("/parking-slots/:id", (req, res) => {
  const id = getPositiveId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Invalid slot ID.",
    });
  }

  const slot = db
    .prepare(`
      SELECT *
      FROM parking_slots
      WHERE id = ?
    `)
    .get(id);

  if (!slot) {
    return res.status(404).json({
      message: "Parking slot not found.",
    });
  }

  res.json(slot);
});

// POST /api/parking-locations/:id/slots
router.post(
  "/parking-locations/:id/slots",
  authorizeRoles("admin"),
  (req, res) => {
    const locationId = getPositiveId(req.params.id);
    const { slot_number, status = "available" } = req.body;

    if (!locationId) {
      return res.status(400).json({
        message: "Invalid location ID.",
      });
    }

    if (!getLocationById(locationId)) {
      return res.status(404).json({
        message: "Parking location not found.",
      });
    }

    const validStatuses = [
      "available",
      "held",
      "reserved",
      "occupied",
      "maintenance",
    ];

    if (
      typeof slot_number !== "string" ||
      !slot_number.trim() ||
      !validStatuses.includes(status)
    ) {
      return res.status(400).json({
        message: "Provide a valid slot number and status.",
      });
    }

    const location = getLocationById(locationId);

    const slotCount = db
      .prepare(`
        SELECT COUNT(*) AS count
        FROM parking_slots
        WHERE parking_location_id = ?
      `)
      .get(locationId).count;

    if (slotCount >= location.total_slots) {
      return res.status(409).json({
        message: "The location has reached its slot capacity.",
      });
    }

    try {
      const result = db
        .prepare(`
          INSERT INTO parking_slots
            (parking_location_id, slot_number, status)
          VALUES (?, ?, ?)
        `)
        .run(locationId, slot_number.trim(), status);

      const slot = db
        .prepare(`
          SELECT *
          FROM parking_slots
          WHERE id = ?
        `)
        .get(result.lastInsertRowid);

      res.status(201).json({
        message: "Parking slot created.",
        slot,
      });
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return res.status(409).json({
          message: "That slot number already exists at this location.",
        });
      }

      throw error;
    }
  }
);

// PUT /api/parking-slots/:id
router.put(
  "/parking-slots/:id",
  authorizeRoles("admin"),
  (req, res) => {
    const id = getPositiveId(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "Invalid slot ID.",
      });
    }

    const slot = db
      .prepare(`
        SELECT *
        FROM parking_slots
        WHERE id = ?
      `)
      .get(id);

    if (!slot) {
      return res.status(404).json({
        message: "Parking slot not found.",
      });
    }

    const { slot_number = slot.slot_number, status = slot.status } =
      req.body;

    const validStatuses = [
      "available",
      "held",
      "reserved",
      "occupied",
      "maintenance",
    ];

    if (
      typeof slot_number !== "string" ||
      !slot_number.trim() ||
      !validStatuses.includes(status)
    ) {
      return res.status(400).json({
        message: "Provide a valid slot number and status.",
      });
    }

    const activeReservation = db
      .prepare(`
        SELECT id
        FROM reservations
        WHERE parking_slot_id = ?
          AND status IN ('confirmed', 'paid')
        LIMIT 1
      `)
      .get(id);

    if (
      activeReservation &&
      status !== slot.status
    ) {
      return res.status(409).json({
        message: "Cannot change slot status while an active reservation exists.",
      });
    }

    try {
      db.prepare(`
        UPDATE parking_slots
        SET slot_number = ?, status = ?
        WHERE id = ?
      `).run(slot_number.trim(), status, id);

      res.json({
        message: "Parking slot updated.",
        slot: db
          .prepare("SELECT * FROM parking_slots WHERE id = ?")
          .get(id),
      });
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return res.status(409).json({
          message: "That slot number already exists at this location.",
        });
      }

      throw error;
    }
  }
);

// DELETE /api/parking-slots/:id
router.delete(
  "/parking-slots/:id",
  authorizeRoles("admin"),
  (req, res) => {
    const id = getPositiveId(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: "Invalid slot ID.",
      });
    }

    const slot = db
      .prepare(`
        SELECT *
        FROM parking_slots
        WHERE id = ?
      `)
      .get(id);

    if (!slot) {
      return res.status(404).json({
        message: "Parking slot not found.",
      });
    }

    const reservation = db
      .prepare(`
        SELECT id
        FROM reservations
        WHERE parking_slot_id = ?
        LIMIT 1
      `)
      .get(id);

    if (reservation) {
      return res.status(409).json({
        message: "Cannot delete a slot that has reservation history.",
      });
    }

    db.prepare(`
      DELETE FROM parking_slots
      WHERE id = ?
    `).run(id);

    res.json({
      message: "Parking slot deleted.",
    });
  }
);

module.exports = router;