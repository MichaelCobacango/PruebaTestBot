const express = require('express');
const router = express.Router()
const { getQr } = require('../controllers/web')

router.use('/', getQr)

module.exports = router