const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const slug = require('slugs');

// Indexing will always happen in your schema
const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: 'Please enter a store name!',
    },
    slug: String,
    description: {
      type: String,
      trim: true,
    },
    tags: [String],
    created: {
      type: Date,
      default: Date.now,
    },
    location: {
      type: {
        type: String,
        default: 'Point',
      },
      coordinates: [
        {
          type: Number,
          required: 'You must supply coordinates!',
        },
      ],
      address: {
        type: String,
        required: 'You must supply an address!',
      },
    },
    photo: String,
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: 'You must supply a author',
    },
  },
  {
    // Make the virtual fields visible by adding these lines to schema
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Define our indexes
storeSchema.index({
  name: 'text',
  description: 'text',
});

storeSchema.index({ location: '2dsphere' });

storeSchema.pre('save', async function (next) {
  if (!this.isModified('name')) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(this.name);
  // find other stores that have a slug of beef. beef-1, beef-2 ect.
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }

  next();
});

storeSchema.statics.getTagsList = function () {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
};

// Find the reviews where the stores _id property === reviews store property
// Look at mongoDB for better visual understanding
storeSchema.virtual('reviews', {
  // virtual is a mongoose function
  ref: 'Review', // What model to link?
  localField: '_id', // Which field on the store?
  foreignField: 'store', // Which field on the review?
});

module.exports = mongoose.model('Store', storeSchema);
