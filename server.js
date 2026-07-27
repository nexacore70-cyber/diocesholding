const mongoose = require("mongoose");
require("dotenv").config();

const app = require("./app");

const Wallet = require("./models/Wallet");
const Ledger = require("./models/Ledger");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB Atlas");
    console.log("Connected Database:", mongoose.connection.name);

    console.log("Wallet Collection:", Wallet.collection.name);
    console.log("Ledger Collection:", Ledger.collection.name);

    console.log("Wallet Count:", await Wallet.countDocuments());
    console.log("Ledger Count:", await Ledger.countDocuments());

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database Connection Error:", err);
  });