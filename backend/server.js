require("dotenv").config();

const express = require("express");
const cors = require("cors");

require("./db");

const authRoutes = require("./routes/authRoutes");
const parkingRoutes = require("./routes/parkingRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const {
  authenticateToken,
  authorizeRoles,
} = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  res.json({
    message: "OnPark Backend is running!",
    version: "1.0.0",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api", parkingRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api", paymentRoutes);

// Example protected admin endpoint
app.get(
  "/api/admin/dashboard",
  authenticateToken,
  authorizeRoles("admin"),
  (req, res) => {
    const locationCount = require("./db")
      .prepare("SELECT COUNT(*) AS count FROM parking_locations")
      .get().count;

    const reservationCount = require("./db")
      .prepare("SELECT COUNT(*) AS count FROM reservations")
      .get().count;

    res.json({
      message: "Administrator dashboard data.",
      statistics: {
        parkingLocations: locationCount,
        reservations: reservationCount,
      },
    });
  }
);

// Not found
app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found.",
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    message: "Internal server error.",
  });
});

app.listen(PORT, () => {
  console.log(`OnPark server running at http://localhost:${PORT}`);
});