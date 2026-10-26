const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(
  path.join(__dirname, "database.sqlite")
);

db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'client')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS parking_locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    total_slots INTEGER NOT NULL DEFAULT 0
      CHECK (total_slots >= 0),
    price_per_hour REAL NOT NULL
      CHECK (price_per_hour >= 0),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS parking_slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parking_location_id INTEGER NOT NULL,
    slot_number TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'available'
      CHECK (
        status IN (
          'available',
          'held',
          'reserved',
          'occupied',
          'maintenance'
        )
      ),
    FOREIGN KEY (parking_location_id)
      REFERENCES parking_locations(id)
      ON DELETE CASCADE,
    UNIQUE (parking_location_id, slot_number)
  );

  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    parking_slot_id INTEGER NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    vehicle_number TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed'
      CHECK (
        status IN (
          'confirmed',
          'paid',
          'completed',
          'cancelled'
        )
      ),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)
      REFERENCES users(id),
    FOREIGN KEY (parking_slot_id)
      REFERENCES parking_slots(id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reservation_id INTEGER NOT NULL,
    amount REAL NOT NULL CHECK (amount >= 0),
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending'
      CHECK (
        payment_status IN ('pending', 'paid', 'failed')
      ),
    paid_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservation_id)
      REFERENCES reservations(id)
  );

  CREATE INDEX IF NOT EXISTS idx_reservations_user
    ON reservations(user_id);

  CREATE INDEX IF NOT EXISTS idx_reservations_slot
    ON reservations(parking_slot_id);

  CREATE INDEX IF NOT EXISTS idx_payments_reservation
    ON payments(reservation_id);
`);

console.log("OnPark database initialized!");

module.exports = db;