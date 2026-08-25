const Wallet = require("../models/Wallet");

// ======================================
// Get Wallet
// ======================================

const getWallet = async (owner) => {
  if (!owner) {
    throw new Error("Wallet owner is required.");
  }

  const wallet = await Wallet.findOne({ owner });

  if (!wallet) {
    throw new Error("Wallet not found.");
  }

  return wallet;
};

// ======================================
// Get Or Create Wallet
// ======================================

const getOrCreateWallet = async (
  owner,
  ownerType = "student",
  session = null,
) => {
  if (!owner) {
    throw new Error("Wallet owner is required.");
  }

  const options = session ? { session } : {};

  let wallet = await Wallet.findOne({ owner }).session(session);

  if (wallet) {
    if (wallet.ownerType !== ownerType) {
      throw new Error("Wallet owner type mismatch.");
    }

    return wallet;
  }

  try {
    const created = await Wallet.create(
      [
        {
          owner,
          ownerType,
          currency: "NGN",
          availableBalance: 0,
          pendingBalance: 0,
          totalEarned: 0,
          totalWithdrawn: 0,
          status: "active",
        },
      ],
      options,
    );

    wallet = created[0];
  } catch (error) {
    // Unique owner index protects against concurrent creation.
    if (error.code === 11000) {
      wallet = await Wallet.findOne({ owner }).session(session);
    } else {
      throw error;
    }
  }

  return wallet;
};

// ======================================
// Credit Wallet
// ======================================

const creditWallet = async (
  owner,
  ownerType,
  amount,
  session = null,
) => {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("Credit amount must be a positive integer.");
  }

  const wallet = await getOrCreateWallet(owner, ownerType, session);

  if (wallet.status !== "active") {
    throw new Error("Wallet is not active.");
  }

  const balanceBefore = wallet.availableBalance;

  wallet.availableBalance += amount;
  wallet.totalEarned += amount;
  wallet.lastTransactionAt = new Date();

  await wallet.save({ session });

  return {
    wallet,
    balanceBefore,
    balanceAfter: wallet.availableBalance,
  };
};

// ======================================
// Get Wallet Balance
// ======================================

const getWalletBalance = async (owner) => {
  const wallet = await getWallet(owner);

  return {
    availableBalance: wallet.availableBalance,
    pendingBalance: wallet.pendingBalance,
    totalEarned: wallet.totalEarned,
    totalWithdrawn: wallet.totalWithdrawn,
    currency: wallet.currency,
    status: wallet.status,
  };
};

module.exports = {
  getWallet,
  getOrCreateWallet,
  creditWallet,
  getWalletBalance,
};