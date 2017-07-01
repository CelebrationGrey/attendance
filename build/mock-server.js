var express = require('express')
var mockData = require('../mock/db.json')

var apiRouters = express.Router()
Object.keys(mockData).forEach(function (router) {
  apiRouters.post(router, function (req, res) {
    res.json(mockData[router])
  })
})

module.exports = apiRouters
