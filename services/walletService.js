const Wallet = require("../models/Wallet");

// ======================================
// Get or Create Wallet
// ======================================
const getOrCreateWallet = async (owner, ownerType = "student") => {
  if (!owner) {
    throw new Error("Wallet owner is required.");
  }

  console.log("\n========== WALLET SERVICE ==========");
  console.log("Collection:", Wallet.collection.name);
  console.log("Owner:", owner.toString());
  console.log("Owner Type:", ownerType);

  let wallet = await Wallet.findOne({ owner });

  if (!wallet) {
    console.log("No wallet found. Creating new wallet...");

    wallet = await Wallet.create({
      owner,
      ownerType,
      currency: "NGN",
      availableBalance: 0,
      pendingBalance: 0,
      totalEarned: 0,
      totalWithdrawn: 0,
      status: "active",
      lastTransactionAt: null,
    });

    console.log("Wallet created successfully.");
    console.log("Wallet ID:", wallet._id);
  } else {
    console.log("Existing wallet found.");
    console.log("Wallet ID:", wallet._id);
  }

  return wallet;
};

// ======================================
// Credit Wallet
// ======================================
const creditWallet = async (owner, ownerType, amount) => {
  if (amount <= 0) {
    throw new Error("Credit amount must be greater than zero.");
  }

  const wallet = await getOrCreateWallet(owner, ownerType);

  console.log("Balance Before:", wallet.availableBalance);

  wallet.availableBalance += amount;
  wallet.totalEarned += amount;
  wallet.lastTransactionAt = new Date();

  await wallet.save();

  console.log("Balance After:", wallet.availableBalance);

  return wallet;
};

// ======================================
// Debit Wallet
// ======================================
const debitWallet = async (owner, amount) => {
  if (amount <= 0) {
    throw new Error("Debit amount must be greater than zero.");
  }

  const wallet = await getOrCreateWallet(owner);

  if (wallet.availableBalance < amount) {
    throw new Error("Insufficient wallet balance.");
  }

  console.log("Balance Before:", wallet.availableBalance);

  wallet.availableBalance -= amount;
  wallet.totalWithdrawn += amount;
  wallet.lastTransactionAt = new Date();

  await wallet.save();

  console.log("Balance After:", wallet.availableBalance);

  return wallet;
};

// ======================================
// Get Wallet
// ======================================
const getWallet = async (owner, ownerType = "student") => {
  const wallet = await getOrCreateWallet(owner, ownerType);

  console.log("Wallet Retrieved:", wallet._id);

  return wallet;
};

module.exports = {
  getOrCreateWallet,
  creditWallet,
  debitWallet,
  getWallet,
};
