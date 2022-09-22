const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "subCategoy must to be  unique"],
      minlength: [2, "To Short sybcategory name"],
      maxlength: [32, "To log sub category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategor must be belong to parent category"],
    },
  },

  {
    timestamps: true,
  }
);

const SubCategoryModel = mongoose.model('SubCategory', subCategorySchema);


module.exports = SubCategoryModel;