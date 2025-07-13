const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const IncomeSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			required: true,
			default: Date.now(), // Automatically set the date to now if not provided
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
		source: {
			type: String,
			required: true,
			enum: ["Cash", "Bank", "POS", "Other", "Mobile Transfers"], // Example sources, can be expanded
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);

IncomeSchema.statics.getTotal = async function () {
  const result = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);
  return result.length > 0 ? result[0].total : 0;
};

module.exports = Income = mongoose.model("incomes", IncomeSchema);
// This model represents the income records in the database.