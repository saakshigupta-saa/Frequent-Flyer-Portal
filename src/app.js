const express = require("express");
const cors = require("cors");
const path = require("path");

const frequentFlyerRoutes = require("./routes/frequentFlyerRoutes");

const app = express();


// =================================
// MIDDLEWARE
// =================================

app.use(cors());

app.use(express.json());


// =================================
// STATIC FRONTEND
// =================================

app.use(
  express.static(
    path.join(__dirname, "client")
  )
);


// =================================
// HEALTH CHECK
// =================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message:
      "Frequent Flyer Portal API is running",
  });
});


// =================================
// FREQUENT FLYER API
// =================================

app.use(
  "/api/frequent-flyers",
  frequentFlyerRoutes
);


// =================================
// FRONTEND
// =================================

app.get("/", (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      "client",
      "index.html"
    )
  );
});


module.exports = app;