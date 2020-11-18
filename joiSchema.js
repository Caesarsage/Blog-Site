const Joi = require('joi');

module.exports.blogSchema = Joi.object({
  blog: Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    // image: Joi.string().required()
  }).required()
});

module.exports.reviewSchema = Join.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5)
  }).required()
})