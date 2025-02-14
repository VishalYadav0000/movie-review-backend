const Movie = require("../models/Movie");
exports.getMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        console.log(error)

        res.status(500).json({ message: "Server error" });
    }
};
exports.getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.addMovie = async (req, res) => {
    try {
        const { title, description, poster  } = req.body;
        const movie = new Movie({ title, description, poster, user: req.user._id});
        await movie.save();
        res.status(201).json(movie);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.movieId);
        
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        // ❌ Check if the logged-in user is the owner
        if (movie.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only delete your own movies" });
        }

        await movie.deleteOne();
        res.json({ message: "Movie deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
