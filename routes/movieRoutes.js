const express = require("express");
const { getMovies, addMovie, getMovieById,deleteMovie } = require("../controllers/movieController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", getMovies);
router.get("/:movieId", getMovieById);
router.post("/", protect, addMovie);
router.delete("/:movieId", protect, deleteMovie);

module.exports = router;
