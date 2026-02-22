const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["Pending", "Success", "Rejected"],
    default: "Pending"
  }
});

module.exports = mongoose.model("Payment", paymentSchema);
