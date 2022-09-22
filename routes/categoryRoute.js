const express = require("express");

const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage
} = require("../services/categoryService");
const {
  createCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator
} = require("../utils/Validators/categoryValidator");
// const getCategoryValidator = require('../utils/Validators/categoryValidator')
const subcategoriesRoute = require('./subCategoryRoute');

const AuthService = require('../services/authService');

const router = express.Router();
router.use('/:categoryId/subcategories', subcategoriesRoute);

router
  .route("/")
  .get(getCategories)
  .post(AuthService.protect, AuthService.allowedTo('admin', 'manager'), uploadCategoryImage, resizeImage, createCategoryValidator, createCategory);

// Validation Result => מקצר זמן  בדיקה בלי לכנס ל DATABASE בעזרת Middleware
router
  .route("/:id")
  // -rules
  .get(getCategoryValidator, getCategory)
  .put(AuthService.protect, AuthService.allowedTo('admin', 'manager'), uploadCategoryImage, resizeImage, updateCategoryValidator, updateCategory)
  .delete(AuthService.protect, AuthService.allowedTo('admin'), deleteCategoryValidator, deleteCategory);

module.exports = router;