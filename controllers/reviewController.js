const Review = require("../models/Review");

exports.getReviews = async (req, res) => {
    try {
        const { sortBy = "createdAt", order = "desc", page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ movieId: req.params.movieId })
            .populate("user", "name") // Fetch user name
            .sort({ [sortBy]: order === "desc" ? -1 : 1 }) // ✅ Ensure sorting works properly
            .skip(parseInt(skip)) // ✅ Ensure skip is a number
            .limit(parseInt(limit)); // ✅ Ensure limit is a number

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};



exports.addReview = async (req, res) => {
    try {
        const { text } = req.body;
        const review = new Review({ text, user: req.user.id, movieId: req.params.movieId, likes: [] });
        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.likeReview = async (req, res) => {
    try {
        if (!req.params.reviewId) {
            return res.status(400).json({ message: "Review ID is required" });
        }


        const review = await Review.findById(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        if (!Array.isArray(review.likes)) {
            review.likes = [];
        }

        if (!review.likes.includes(req.user.id)) {
            review.likes.push(req.user.id);
            await review.save();
        }

        res.json({ message: "Review liked", likes: review.likes });
    } catch (error) {
        console.error("Error liking review:", error);
        res.status(500).json({ message: "Server error" });
    }
};




exports.unlikeReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Remove the user ID from likes array
        review.likes = review.likes.filter((userId) => userId.toString() !== req.user._id.toString());
        await review.save();

        // Send back the updated review with user details
        const updatedReview = await Review.findById(req.params.reviewId).populate("user", "name");
        res.json(updatedReview);
    } catch (error) {
        console.error("Error unliking review:", error);
        res.status(500).json({ message: "Server error" });
    }
};


exports.editReview = async (req, res) => {
    try {
        const review = await Review.findOneAndUpdate(
            { _id: req.params.reviewId, user: req.user.id },
            req.body,
            { new: true }
        );
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        await Review.findOneAndDelete({ _id: req.params.reviewId, user: req.user.id });
        res.json({ message: "Review deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
