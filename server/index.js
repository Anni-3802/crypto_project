const dotenv = require("dotenv");
const path = require("path");

// Load environment variables first
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Now require other modules
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const protectedRoutes = require("./routes/protectedRoutes");
const cryptoRoutes = require("./routes/cryptoRoutes");
const watchlistRoutes = require("./routes/watchlistRoutes");
const newsRoutes = require("./routes/newsRoutes");

connectDB();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/crypto", cryptoRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api", newsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listen at port ${PORT}`);
});
