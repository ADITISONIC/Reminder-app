const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");


dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.use(
  cors({
    origin: `${import.meta.env.CLIENT_BASE_URL}`, // Allow requests from your frontend's URL
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Routes
const authRoutes = require("./routes/auth").router; // Ensure you're accessing the router from the auth module
const eventRoutes = require("./routes/events"); // Assuming `events.js` exports a router

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
//mongodb://localhost:27017/reminder