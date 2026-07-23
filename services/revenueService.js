const User = require("../models/User");
const Course = require("../models/Course");

const {
  getOrCreateWallet,
  creditWallet,
} = require("./walletService");

const {
  createLedgerEntry,
} = require("./ledgerService");

// ======================================
// Process Revenue Sharing
// ======================================
const processRevenue = async (payment) => {
  try {
    console.log("\n========== REVENUE PROCESS STARTED ==========");
    console.log("Payment ID:", payment._id);
    console.log("Course ID:", payment.course);
    console.log("Amount:", payment.amount);

    // ======================================
    // Get Course
    // ======================================
    const course = await Course.findById(payment.course);

    if (!course) {
      throw new Error("Course not found.");
    }

    console.log("Course:", course.title);

    // ======================================
    // Get Tutor
    // ======================================
    const tutor = await User.findById(course.tutor);

    if (!tutor) {
      throw new Error("Tutor not found.");
    }

    console.log(
      `Tutor: ${tutor.firstName} ${tutor.lastName}`
    );

    // ======================================
    // Revenue Split
    // ======================================
    const tutorAmount = payment.amount * 0.6;
    const companyAmount = payment.amount * 0.4;

    console.log("Tutor Share:", tutorAmount);
    console.log("Company Share:", companyAmount);

    // ======================================
    // Tutor Wallet
    // ======================================
    console.log("Creating/Getting Tutor Wallet...");

    const tutorWallet = await getOrCreateWallet(
      tutor._id,
      "tutor"
    );

    console.log("Tutor Wallet ID:", tutorWallet._id);

    const tutorBalanceBefore =
      tutorWallet.availableBalance;

    const updatedTutorWallet =
      await creditWallet(
        tutor._id,
        "tutor",
        tutorAmount
      );

    console.log(
      "Tutor Wallet Balance:",
      updatedTutorWallet.availableBalance
    );

    await createLedgerEntry({
      wallet: updatedTutorWallet._id,
      owner: tutor._id,
      payment: payment._id,
      amount: tutorAmount,
      type: "credit",
      category: "revenue_share",
      description: `Tutor earnings from ${course.title}`,
      balanceBefore: tutorBalanceBefore,
      balanceAfter:
        updatedTutorWallet.availableBalance,
    });

    console.log("Tutor ledger created.");

    // ======================================
    // Company Wallet
    // ======================================
    const company = await User.findOne({
      roles: "admin",
    });

    if (!company) {
      console.log(
        "No admin found. Company revenue skipped."
      );

      console.log(
        "========== REVENUE PROCESS FINISHED ==========\n"
      );

      return;
    }

    console.log(
      `Company Account: ${company.firstName} ${company.lastName}`
    );

    const companyWallet =
      await getOrCreateWallet(
        company._id,
        "company"
      );

    const companyBalanceBefore =
      companyWallet.availableBalance;

    const updatedCompanyWallet =
      await creditWallet(
        company._id,
        "company",
        companyAmount
      );

    console.log(
      "Company Wallet Balance:",
      updatedCompanyWallet.availableBalance
    );

    await createLedgerEntry({
      wallet: updatedCompanyWallet._id,
      owner: company._id,
      payment: payment._id,
      amount: companyAmount,
      type: "credit",
      category: "revenue_share",
      description: `Company revenue from ${course.title}`,
      balanceBefore:
        companyBalanceBefore,
      balanceAfter:
        updatedCompanyWallet.availableBalance,
    });

    console.log("Company ledger created.");

    console.log(
      "========== REVENUE PROCESS FINISHED ==========\n"
    );
  } catch (error) {
    console.error(
      "========== REVENUE PROCESS FAILED =========="
    );
    console.error(error);
    console.error(
      "============================================"
    );
  }
};

module.exports = {
  processRevenue,
};