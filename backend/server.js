// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
const Property = require("./models/Property");
const User = require("./models/User");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Session config
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions"
    }),
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));


// --- Authentication / role middleware ---
function authRequired(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
}

// --- Property Routes ---
// Create advertisement (Landlord only)
app.post("/api/properties", authRequired, async (req, res) => {
  console.log("Session:", req.session);  
  try {
    const user = await User.findById(req.session.userId);
    if (!user || user.role !== "Landlord") {
      return res.status(403).json({ message: "Only landlords can create advertisements" });
    }

    const { title, description, address, rent, bedrooms, bathrooms, availableFrom, propertyType } = req.body;

    const property = new Property({
      landlord: user._id,
      title,
      description,
      address,
      rent,
      bedrooms,
      bathrooms,
      availableFrom,
      propertyType,
    });

    await property.save();
    res.status(201).json({ message: "Advertisement created successfully", property });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all advertisements of logged-in landlord
app.get("/api/properties/my", authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user || user.role !== "Landlord") {
      return res.status(403).json({ message: "Only landlords can view their advertisements" });
    }

    const properties = await Property.find({ landlord: user._id }).sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Existing Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/", (req, res) => {
  res.send("Rental Connect API running with sessions & controllers...");
});

const PORT = process.env.PORT || 1629;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
