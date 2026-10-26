require("dotenv").config();

const bcrypt = require("bcryptjs");
const db = require("./db");

async function seed() {
  const users = [
    {
      username: "admin01",
      password: "admin123",
      fullName: "OnPark Administrator",
      role: "admin",
    },
    {
      username: "client01",
      password: "client123",
      fullName: "OnPark Client",
      role: "client",
    },
  ];

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (
      username,
      password_hash,
      full_name,
      role
    )
    VALUES (?, ?, ?, ?)
  `);

  for (const user of users) {
    const passwordHash = await bcrypt.hash(
      user.password,
      10
    );

    insertUser.run(
      user.username,
      passwordHash,
      user.fullName,
      user.role
    );
  }

  const locationCount = db
    .prepare("SELECT COUNT(*) AS count FROM parking_locations")
    .get().count;

  if (locationCount === 0) {
    const insertLocation = db.prepare(`
      INSERT INTO parking_locations (
        name,
        address,
        total_slots,
        price_per_hour
      )
      VALUES (?, ?, ?, ?)
    `);

    const insertSlot = db.prepare(`
      INSERT INTO parking_slots (
        parking_location_id,
        slot_number,
        status
      )
      VALUES (?, ?, ?)
    `);

    const seedLocations = db.transaction(() => {
      const locations = [
        {
          name: "Central Mall Parking",
          address: "Jakarta",
          totalSlots: 20,
          price: 5000,
        },
        {
          name: "City Center Parking",
          address: "Tangerang",
          totalSlots: 15,
          price: 4000,
        },
        {
          name: "Grand Parking",
          address: "Bekasi",
          totalSlots: 25,
          price: 3000,
        },
      ];

      for (const location of locations) {
        const result = insertLocation.run(
          location.name,
          location.address,
          location.totalSlots,
          location.price
        );

        const locationId = result.lastInsertRowid;

        for (let i = 1; i <= location.totalSlots; i++) {
          const slotNumber = `S-${String(i).padStart(2, "0")}`;

          insertSlot.run(
            locationId,
            slotNumber,
            "available"
          );
        }
      }
    });

    seedLocations();
  }

  console.log("OnPark seed completed!");
  console.log("Demo Administrator: admin01");
  console.log("Demo Client: client01");

  db.close();
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  db.close();
  process.exitCode = 1;
});