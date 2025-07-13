const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Create Schema
const SalesSchema = new Schema({

  description: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
},
  amount: {
    type: Number,
    required: true,
  },
    quantity: {
    type: Number,
    required: true, 
    default: 1, // Default to 1 if not specified
    },
  source: {
    type: String,
    required: true,
    enum: ["Cash", "Bank", "POS","Other","Mobile Transfers",], // Example sources, can be expanded  

  },
  createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    
},
{timestamps: true});

SalesSchema.statics.getTotal = async function () {
  const result = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: { $multiply: ["$amount", "$quantity"] } },
        quantity: { $sum: "$quantity" },
      },
    },
  ]);
  return result.length > 0 ? { total: result[0].total, quantity: result[0].quantity } : { total: 0, quantity: 0 };
};

module.exports = Sales = mongoose.model("Sales", SalesSchema);
// This model represents the sales records in the database.