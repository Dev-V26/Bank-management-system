const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Loan = require("../models/Loan");
const ATMCard = require("../models/ATMCard");
const FixedDeposit = require("../models/FixedDeposit");
const CreditCard = require("../models/CreditCard");

// Hardcoded admin credentials (for simplicity)
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

// -------------------- HELPERS --------------------
const requireEnv = (res) => {
  if (!process.env.JWT_SECRET) {
    res.status(500).json({ msg: "JWT_SECRET missing in backend/.env" });
    return false;
  }
  return true;
};

const getTokenFromReq = (req) => {
  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) return authHeader.split(" ")[1];

  // fallback for old frontend (x-auth-token)
  const xToken = req.header("x-auth-token");
  if (xToken) return xToken;

  return null;
};

const auth = (req, res, next) => {
  const token = getTokenFromReq(req);
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  if (!requireEnv(res)) return;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Support payload shapes
    const userId = decoded?.id || decoded?._id || decoded?.user?.id || decoded?.user?._id;
    if (!userId) return res.status(401).json({ msg: "Token payload invalid" });

    req.user = { id: userId };
    req.isAdmin = Boolean(decoded?.isAdmin);

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

const adminAuth = (req, res, next) => {
  if (!req.isAdmin) return res.status(403).json({ msg: "Admin access required" });
  next();
};

const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// -------------------- REGISTER --------------------
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body || {};

  try {
    if (!requireEnv(res)) return;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please provide all required fields" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword,

      // defaults for your UI
      balance: 0,
      currency: "INR",
      loanStatus: "none",
      atmCardStatus: "none",
      creditCardStatus: "none",
      loanAmount: 0,
    });

    await user.save();

    const token = signToken({ id: user._id });
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Register error:", err);

    // Helpful Mongo connection error
    if (String(err?.name).includes("Mongo") || String(err?.message).includes("Mongo")) {
      return res.status(500).json({ msg: "Database error. Check MONGO_URI and MongoDB server." });
    }

    return res.status(500).json({ msg: "Server error" });
  }
});

// -------------------- USER LOGIN --------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  try {
    if (!requireEnv(res)) return;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide all required fields" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = signToken({ id: user._id });

    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);

    if (String(err?.name).includes("Mongo") || String(err?.message).includes("Mongo")) {
      return res.status(500).json({ msg: "Database error. Check MONGO_URI and MongoDB server." });
    }

    return res.status(500).json({ msg: "Server error" });
  }
});

// -------------------- ADMIN LOGIN --------------------
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!requireEnv(res)) return;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide all required fields" });
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(400).json({ msg: "Invalid admin credentials" });
    }

    const token = signToken({ id: "admin", isAdmin: true });

    return res.json({
      token,
      admin: { id: "admin", email: ADMIN_EMAIL },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// -------------------- ACCOUNT (USER) --------------------
router.get("/account", auth, async (req, res) => {
  try {
    // prevent mongo cast error if admin token is used
    if (req.user?.id === "admin") {
      return res.status(403).json({ msg: "Admin token cannot access user account" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(401).json({ msg: "Invalid user id in token" });
    }

    const user = await User.findById(req.user.id).select(
      "name email balance currency loanStatus atmCardStatus creditCardStatus loanAmount"
    );

    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.json({
      name: user.name,
      email: user.email,
      balance: user.balance ?? 0,
      currency: user.currency || "INR",
      loanStatus: user.loanStatus || "none",
      loanAmount: user.loanAmount ?? 0,
      atmCardStatus: user.atmCardStatus || "none",
      creditCardStatus: user.creditCardStatus || "none",
    });
  } catch (err) {
    console.error("GET /api/account error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// Update Account Details (User)
router.put("/account", auth, async (req, res) => {
  const { name, email } = req.body || {};

  try {
    if (!name || !email) return res.status(400).json({ msg: "Name and email are required" });

    const normalizedEmail = String(email).toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user.id },
    });

    if (existingUser) return res.status(400).json({ msg: "Email already in use" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.name = String(name).trim();
    user.email = normalizedEmail;
    await user.save();

    return res.json({
      msg: "Profile updated successfully",
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("PUT /account error:", err);
    return res.status(500).json({ msg: "Server error updating profile" });
  }
});

// -------------------- BALANCE + SETTINGS --------------------
router.get("/balance", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("balance");
    if (!user) return res.status(404).json({ msg: "User not found" });
    return res.json({ balance: user.balance ?? 0 });
  } catch (err) {
    console.error("Balance fetch error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

router.get("/me/settings", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("currency balance name email");
    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.json({
      currency: user.currency || "INR",
      balance: user.balance ?? 0,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("GET /me/settings error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

router.post("/balance/add", auth, async (req, res) => {
  try {
    const amount = Number(req.body?.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ msg: "Amount must be a positive number" });
    }

    const user = await User.findById(req.user.id).select("balance currency");
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.balance = Number(user.balance || 0) + amount;
    await user.save();

    return res.json({ balance: user.balance, currency: user.currency || "INR" });
  } catch (err) {
    console.error("POST /balance/add error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

router.put("/settings/currency", auth, async (req, res) => {
  try {
    const allowed = ["INR", "USD", "EUR", "GBP", "CAD", "AUD"];
    const currency = String(req.body?.currency || "").toUpperCase();

    if (!allowed.includes(currency)) {
      return res.status(400).json({ msg: "Invalid currency" });
    }

    const user = await User.findById(req.user.id).select("currency");
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.currency = currency;
    await user.save();

    return res.json({ currency: user.currency });
  } catch (err) {
    console.error("PUT /settings/currency error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// -------------------- TRANSFER --------------------
router.post("/transfer", auth, async (req, res) => {
  const { toEmail, amount } = req.body || {};
  try {
    const amt = Number(amount);
    if (!toEmail || !Number.isFinite(amt) || amt <= 0) {
      return res.status(400).json({ msg: "Valid toEmail and amount required" });
    }

    const sender = await User.findById(req.user.id);
    const receiver = await User.findOne({ email: String(toEmail).toLowerCase().trim() });

    if (!sender) return res.status(404).json({ msg: "Sender not found" });
    if (!receiver) return res.status(400).json({ msg: "Receiver not found" });
    if (Number(sender.balance || 0) < amt) return res.status(400).json({ msg: "Insufficient funds" });

    sender.balance = Number(sender.balance || 0) - amt;
    receiver.balance = Number(receiver.balance || 0) + amt;

    await sender.save();
    await receiver.save();

    await new Transaction({
      userId: req.user.id,
      type: "transfer",
      amount: amt,
      toUserId: receiver._id,
    }).save();

    return res.json({ balance: sender.balance });
  } catch (err) {
    console.error("Transfer error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// -------------------- TRANSACTIONS --------------------
router.get("/transactions", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) return res.json([]);
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
    return res.json(transactions);
  } catch (err) {
    console.error("Transactions error:", err);
    return res.status(500).json({ msg: "Server error fetching transactions" });
  }
});

// -------------------- LOAN --------------------
router.post("/loan/apply", auth, async (req, res) => {
  const { amount } = req.body || {};
  try {
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) return res.status(400).json({ msg: "Valid amount required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.loanStatus !== "none") {
      return res.status(400).json({ msg: "You already have a loan request" });
    }

    const loan = new Loan({ userId: req.user.id, amount: amt, status: "pending" });
    await loan.save();

    user.loanStatus = "pending";
    await user.save();

    return res.json({ msg: "Loan application submitted", loan });
  } catch (err) {
    console.error("Loan apply error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

router.get("/loan/status", auth, async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user.id }).sort({ date: -1 });
    const user = await User.findById(req.user.id).select("loanAmount loanStatus");
    return res.json({ loans, loanAmount: user?.loanAmount ?? 0, loanStatus: user?.loanStatus || "none" });
  } catch (err) {
    console.error("Loan status error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

router.post("/loan/pay", auth, async (req, res) => {
  const { amount } = req.body || {};
  try {
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) return res.status(400).json({ msg: "Valid amount required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.loanStatus !== "approved" || Number(user.loanAmount || 0) <= 0) {
      return res.status(400).json({ msg: "No active loan to pay" });
    }

    if (Number(user.balance || 0) < amt) return res.status(400).json({ msg: "Insufficient funds" });

    user.balance = Number(user.balance || 0) - amt;
    user.loanAmount = Number(user.loanAmount || 0) - amt;

    if (user.loanAmount <= 0) {
      user.loanAmount = 0;
      user.loanStatus = "none";
      await Loan.updateOne({ userId: req.user.id, status: "approved" }, { status: "paid" });
    }

    await user.save();
    return res.json({ balance: user.balance, loanAmount: user.loanAmount, loanStatus: user.loanStatus });
  } catch (err) {
    console.error("Loan pay error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// -------------------- ATM --------------------
router.post("/atm/apply", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.atmCardStatus !== "none") {
      return res.status(400).json({ msg: "You already have an ATM card request" });
    }

    const atmCard = new ATMCard({ userId: req.user.id, status: "applied" });
    await atmCard.save();

    user.atmCardStatus = "applied";
    await user.save();

    return res.json({ msg: "ATM card application submitted" });
  } catch (err) {
    console.error("ATM apply error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

router.get("/atm/status", auth, async (req, res) => {
  try {
    const atmCards = await ATMCard.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const user = await User.findById(req.user.id).select("atmCardStatus");
    return res.json({ atmCards, atmCardStatus: user?.atmCardStatus || "none" });
  } catch (err) {
    console.error("ATM status error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// -------------------- FIXED DEPOSITS --------------------
router.post("/fixed-deposit/apply", auth, async (req, res) => {
  const { amount, interestRate, duration } = req.body || {};
  try {
    const amt = Number(amount);
    const rate = Number(interestRate);
    const dur = Number(duration);

    if (!Number.isFinite(amt) || amt <= 0) return res.status(400).json({ msg: "Valid amount required" });
    if (!Number.isFinite(rate) || rate <= 0) return res.status(400).json({ msg: "Valid interestRate required" });
    if (!Number.isFinite(dur) || dur <= 0) return res.status(400).json({ msg: "Valid duration required" });

    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + dur);

    const fixedDeposit = new FixedDeposit({
      userId: req.user.id,
      amount: amt,
      interestRate: rate,
      duration: dur,
      maturityDate,
    });

    await fixedDeposit.save();
    return res.json({ msg: "Fixed Deposit application submitted", fixedDeposit });
  } catch (err) {
    console.error("FD apply error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

router.get("/fixed-deposits", auth, async (req, res) => {
  try {
    const fixedDeposits = await FixedDeposit.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json(fixedDeposits);
  } catch (err) {
    console.error("FD list error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// -------------------- CREDIT CARD --------------------
router.post("/credit-card/apply", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.creditCardStatus !== "none") {
      return res.status(400).json({ msg: "You already have a credit card request" });
    }

    const creditCard = new CreditCard({ userId: req.user.id, status: "applied" });
    await creditCard.save();

    user.creditCardStatus = "applied";
    await user.save();

    return res.json({ msg: "Credit card application submitted" });
  } catch (err) {
    console.error("CC apply error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

router.get("/credit-card/status", auth, async (req, res) => {
  try {
    const creditCard = await CreditCard.findOne({ userId: req.user.id });
    const user = await User.findById(req.user.id).select("creditCardStatus");
    return res.json({ creditCard, creditCardStatus: user?.creditCardStatus || "none" });
  } catch (err) {
    console.error("CC status error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// -------------------- ADMIN ROUTES --------------------
router.get("/admin/users", auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.json(users);
  } catch (err) {
    console.error("Admin users error:", err);
    return res.status(500).json({ msg: "Failed to fetch users" });
  }
});

router.get("/admin/loans", auth, adminAuth, async (req, res) => {
  try {
    const loans = await Loan.find().populate("userId", "name email");
    return res.json(loans);
  } catch (err) {
    console.error("Admin loans error:", err);
    return res.status(500).json({ msg: "Failed to fetch loans" });
  }
});

router.post("/admin/loan/:id", auth, adminAuth, async (req, res) => {
  const { status } = req.body || {}; // approved/rejected
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan || loan.status !== "pending") return res.status(400).json({ msg: "Invalid loan request" });

    const user = await User.findById(loan.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    loan.status = status;

    if (status === "approved") {
      user.loanStatus = "approved";
      user.loanAmount = loan.amount;
      user.balance = Number(user.balance || 0) + Number(loan.amount || 0);
    } else {
      user.loanStatus = "rejected";
    }

    await loan.save();
    await user.save();

    return res.json({ msg: `Loan ${status}` });
  } catch (err) {
    console.error("Admin loan decision error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

router.get("/admin/atm", auth, adminAuth, async (req, res) => {
  try {
    const atmCards = await ATMCard.find().populate("userId", "name email");
    return res.json(atmCards);
  } catch (err) {
    console.error("Admin atm error:", err);
    return res.status(500).json({ msg: "Failed to fetch ATM card requests" });
  }
});

router.post("/admin/atm/:id", auth, adminAuth, async (req, res) => {
  const { status } = req.body || {}; // issued/rejected
  try {
    const atmCard = await ATMCard.findById(req.params.id);
    if (!atmCard || atmCard.status !== "applied") return res.status(400).json({ msg: "Invalid ATM card request" });

    const user = await User.findById(atmCard.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    atmCard.status = status;
    user.atmCardStatus = status;

    if (status === "issued") atmCard.issuedDate = Date.now();

    await atmCard.save();
    await user.save();

    return res.json({ msg: `ATM card ${status}` });
  } catch (err) {
    console.error("Admin atm decision error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

router.get("/admin/credit-cards", auth, adminAuth, async (req, res) => {
  try {
    const creditCards = await CreditCard.find().populate("userId", "name email");
    return res.json(creditCards);
  } catch (err) {
    console.error("Admin credit-cards error:", err);
    return res.status(500).json({ msg: "Failed to fetch credit card requests" });
  }
});

router.post("/admin/credit-card/:id", auth, adminAuth, async (req, res) => {
  const { status } = req.body || {}; // approved/rejected
  try {
    const creditCard = await CreditCard.findById(req.params.id);
    if (!creditCard || creditCard.status !== "applied") {
      return res.status(400).json({ msg: "Invalid credit card request" });
    }

    const user = await User.findById(creditCard.userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    creditCard.status = status;
    user.creditCardStatus = status;

    if (status === "approved") creditCard.approvedDate = Date.now();

    await creditCard.save();
    await user.save();

    return res.json({ msg: `Credit card ${status}` });
  } catch (err) {
    console.error("Admin credit-card decision error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// Generate Account Report (Admin)
router.get("/account/report/:id", auth, adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: "Invalid user id" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    const transactions = await Transaction.find({ userId }).lean();
    const loans = await Loan.find({ userId }).lean();
    const fixedDeposits = await FixedDeposit.find({ userId }).lean();
    const atmCards = await ATMCard.find({ userId }).lean();
    const creditCards = await CreditCard.find({ userId }).lean();

    const report = {
      user: {
        name: user.name,
        email: user.email,
        balance: user.balance ?? 0,
        currency: user.currency || "INR",
        loanStatus: user.loanStatus || "none",
        loanAmount: user.loanAmount ?? 0,
        atmCardStatus: user.atmCardStatus || "none",
        creditCardStatus: user.creditCardStatus || "none",
      },
      transactions,
      loans,
      fixedDeposits,
      atmCards,
      creditCards,
    };

    return res.status(200).json(report);
  } catch (err) {
    console.error("Error generating report:", err);
    return res.status(500).json({ msg: "Failed to generate report" });
  }
});

module.exports = router;