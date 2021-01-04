const Joi = require('joi');

module.exports.blogSchema = Joi.object({
  blog: Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    // image: Joi.string().required()
  }).required()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
    // comments: Joi.string()
  }).required()
})