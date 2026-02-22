const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const authMiddleware = require("../middleware/authMiddleware");

/*
CREATE PAYMENT (Public - Student)
*/
router.post("/create", async (req, res) => {
  try {
    const { studentName, phone, course, amount, transactionId } = req.body;

    const newPayment = new Payment({
      studentName,
      phone,
      course,
      amount,
      transactionId
    });

    await newPayment.save();

    res.status(201).json({
      message: "Payment submitted successfully",
      payment: newPayment
    });

  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

/*
GET ALL PAYMENTS (Admin Only)
*/
router.get("/", authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
UPDATE PAYMENT STATUS (Admin Only)
*/
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({
      message: "Payment status updated",
      payment: updated
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
/*
GET ANALYTICS (Admin)
*/
const auth = require("../middleware/authMiddleware");
router.get("/analytics", auth, async (req, res) => {
  try {
    const payments = await Payment.find();

    const totalPayments = payments.length;

    const totalRevenue = payments
      .filter(p => p.status === "Success")
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingAmount = payments
      .filter(p => p.status === "Pending")
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingCount = payments.filter(p => p.status === "Pending").length;

    const rejectedCount = payments.filter(p => p.status === "Rejected").length;

    res.json({
      totalPayments,
      totalRevenue,
      pendingAmount,
      pendingCount,
      rejectedCount
    });

  } catch (error) {
    res.status(500).json({ message: "Analytics error" });
  }
});


module.exports = router;
