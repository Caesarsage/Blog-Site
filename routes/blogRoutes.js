const express = require('express');
const Blog = require('../models/blogModel');

const router = express.Router();

router.route('/').get