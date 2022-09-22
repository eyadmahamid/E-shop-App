const express = require("express");

const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdBody,
  createFilterObj
} = require("../services/subCategoryServices");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  deleteSubCategoryValidator,
  updateSubCategoryValidator
} = require("../utils/Validators/subCategoriesValidator");


const AuthService = require('../services/authService');


// MergeParamas : Allow use to access the paramters on other routers
// ex: We need to access categoryId from categoryt router
const router = express.Router({
  mergeParams: true
});
router
  .route("/")
  .post(AuthService.protect,AuthService.allowedTo('admin','manager'),setCategoryIdBody, createSubCategoryValidator, createSubCategory)
  .get(createFilterObj, getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(AuthService.protect, AuthService.allowedTo('admin', 'manager'), updateSubCategoryValidator, updateSubCategory)
  .delete(AuthService.protect, AuthService.allowedTo('admin'  ), deleteSubCategoryValidator, deleteSubCategory);
module.exports = router;