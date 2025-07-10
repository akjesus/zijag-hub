const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const InventorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    costPrice: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);


InventorySchema.statics.getTotal = async function () {
  const result = await this.aggregate([
    {
      $group: {
        _id: null,
        costPriceTotal: { $sum: "$costPrice" },
        sellingPriceTotal: { $sum: "$sellingPrice" },
      },
    },
  ]);
  return result.length > 0 ? result[0]: 0;
};

module.exports = Inventory = mongoose.model("Inventory", InventorySchema);
// This model represents the income records in the database.