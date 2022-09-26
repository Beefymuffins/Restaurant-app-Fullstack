const mongoose = require('mongoose');
const Review = mongoose.model('Review');

exports.addReview = async (req, res) => {
  req.body.author = req.user._id;
  req.body.store = req.params.id;
  // Save the new Review
  const newReview = new Review(req.body);
  await newReview.save();
  req.flash('success', 'Thanks for leaving a Review!');
  // Send em back to the the page they came from
  res.redirect('back');
};
