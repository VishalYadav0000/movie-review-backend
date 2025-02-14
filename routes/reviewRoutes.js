const express = require("express");
const { addReview, likeReview, unlikeReview, editReview, deleteReview, getReviews } = require("../controllers/reviewController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/:movieId", getReviews);
router.post("/:movieId", protect, addReview);
router.put("/:reviewId", protect, editReview);
router.delete("/:reviewId", protect, deleteReview);
router.post("/like/:reviewId", protect, likeReview);
router.post("/unlike/:reviewId", protect, unlikeReview);

module.exports = router;
