require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const parkRoutes = require("./routes/parkRoutes");
const tripRoutes = require("./routes/tripRoutes");

const app = express();

mongoose.connect(process.env.MONGO_URI);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/parks", parkRoutes);
app.use("/api/trips", tripRoutes);

app.get("/", async (req, res) => {
  res.render("home");
});

module.exports = app;

//parks.js
const mongoose = require("mongoose");

const parkSchema = new mongoose.Schema({
  name: String,
  region: String,
  category: String,
  country: { type: String, default: "Kenya" },
  residentAdult: Number,
  nonResidentAdult: Number,
  childResident: Number,
  childNonResident: Number,
  source: String,
  updatedAt: Date
});

module.exports = mongoose.model("Park", parkSchema);

//hotel.js
const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  name: String,
  city: String,
  area: String,
  stars: Number,
  price: Number,
  currency: String,
  image: String,
  source: String,
  livePrice: Boolean
});

module.exports = mongoose.model("Hotel", hotelSchema);

//restaurant.js
const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: String,
  city: String,
  area: String,
  cuisine: String,
  priceRange: String,
  image: String,
  source: String
});

module.exports = mongoose.model("Restaurant", restaurantSchema);



//server.js
const fetch = require("node-fetch");

async function getLiveHotelPrices(city) {
  const tokenRes = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_CLIENT_ID,
      client_secret: process.env.AMADEUS_CLIENT_SECRET
    })
  });

  const tokenData = await tokenRes.json();

  const hotelRes = await fetch(
    `https://test.api.amadeus.com/v3/shopping/hotel-offers?cityCode=${city}&bestRateOnly=true`,
    {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    }
  );

  return hotelRes.json();
}

module.exports = { getLiveHotelPrices };


//kws service.js
const Park = require("../models/Park");

async function seedOrUpdateParks() {
  const parks = [
    {
      name: "Nairobi National Park",
      region: "Nairobi",
      category: "Premium",
      residentAdult: 1350,
      nonResidentAdult: 80,
      childResident: 675,
      childNonResident: 40,
      source: "KWS fee schedule",
      updatedAt: new Date()
    },
    {
      name: "Amboseli National Park",
      region: "Southern Kenya",
      category: "Premium",
      residentAdult: 2025,
      nonResidentAdult: 90,
      childResident: 1012.5,
      childNonResident: 45,
      source: "KWS fee schedule",
      updatedAt: new Date()
    }
  ];

  for (const park of parks) {
    await Park.updateOne({ name: park.name }, park, { upsert: true });
  }
}

module.exports = { seedOrUpdateParks };


//parkroutes.js
const express = require("express");
const router = express.Router();
const Park = require("../models/Park");

router.get("/", async (req, res) => {
  const parks = await Park.find();
  res.json(parks);
});

module.exports = router;

//hotelRoutes.js
const express = require("express");
const router = express.Router();
const Hotel = require("../models/Hotel");
const { getLiveHotelPrices } = require("../services/amadeusService");

router.get("/", async (req, res) => {
  const { city } = req.query;
  const hotels = await Hotel.find(city ? { city } : {});
  res.json(hotels);
});

router.get("/live", async (req, res) => {
  const { city } = req.query;
  const data = await getLiveHotelPrices(city);
  res.json(data);
});

module.exports = router;


//app.js
async function loadHotels() {
  const city = document.getElementById("city").value;
  const res = await fetch(`/api/hotels${city ? `?city=${city}` : ""}`);
  const data = await res.json();
  render(data, "Hotels");
}

async function loadParks() {
  const res = await fetch("/api/parks");
  const data = await res.json();
  render(data, "Parks");
}

async function loadRestaurants() {
  const res = await fetch("/api/restaurants");
  const data = await res.json();
  render(data, "Restaurants");
}

function render(items, title) {
  const el = document.getElementById("results");
  el.innerHTML = `<h2>${title}</h2>` + items.map(item => `
    <div class="card">
      <h3>${item.name || ""}</h3>
      <p>${item.city || item.region || ""}</p>
      <p>${item.price ? `KES ${item.price}` : ""}</p>
      <p>${item.nonResidentAdult ? `Non-resident adult: ${item.nonResidentAdult}` : ""}</p>
    </div>
  `).join("");
}


