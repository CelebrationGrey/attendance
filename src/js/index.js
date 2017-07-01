require('../assets/css/style.css')
require('../less/index.less')
var $ = require('jquery')
var Login = require('./login')

$(function () {
  var elem = {}
  elem.username = '#username'
  elem.password = '#password'
  elem.rule = '#rule'
  elem.loginForm = '#loginForm'
  elem.usernameGroup = '#usernameGroup'
  elem.passwordGroup = '#passwordGroup'
  elem.usernameAlert = '#usernameAlert'
  elem.passwordAlert = '#passwordAlert'
  elem.loginAlert = '#loginAlert'
  elem.loginButton = '#loginButton'
  elem.remember = '#remember'
  var login = new Login(elem)
  login.init()
})
