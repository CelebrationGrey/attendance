var $ = require('jquery')
const OK = 1
const ERROR = 0;

(function ($) {
  var Login = function (elem) {
    this.username = null
    this.password = null
    this.rule = null
    this.isRemember = null
    this.eLoginForm = $(elem.loginForm)
    this.eUsername = $(elem.username)
    this.ePassword = $(elem.password)
    this.eRule = $(elem.rule)
    this.eUsernameGroup = $(elem.usernameGroup)
    this.ePasswordGroup = $(elem.passwordGroup)
    this.eUsernameAlert = $(elem.usernameAlert)
    this.ePasswordAlert = $(elem.passwordAlert)
    this.eLoginAlert = $(elem.loginAlert)
    this.eLoginButton = $(elem.loginButton)
    this.eRemember = $(elem.remember)
  }

  Login.prototype.init = function () {
    $.proxy(this.remember('get'), this)
    this.eUsername.on('blur', $.proxy(this.checkUsername, this))
    this.ePassword.on('blur', $.proxy(this.checkPassword, this))
    this.eLoginButton.on('click', $.proxy(this.postLogin, this))
  }

  Login.prototype.checkUsername = function () {
    if (this.eUsername.val().length === 0) {
      this.eUsernameAlert.text('用户名不能为空')
      this.eUsernameAlert.fadeIn()
      this.eUsernameGroup.addClass('has-error')
      return false
    } else {
      this.eUsernameAlert.fadeOut()
      this.eUsernameGroup.removeClass('has-error')
    }
    return true
  }

  Login.prototype.checkPassword = function () {
    if (this.ePassword.val().length === 0) {
      this.ePasswordAlert.text('密码不能为空')
      this.ePasswordAlert.fadeIn()
      this.ePasswordGroup.addClass('has-error')
      return false
    } else if (this.ePassword.val().length < 6) {
      this.ePasswordAlert.text('密码不能少于6位')
      this.ePasswordAlert.fadeIn()
      this.ePasswordGroup.addClass('has-error')
      return false
    } else {
      this.ePasswordAlert.fadeOut()
      this.ePasswordGroup.removeClass('has-error')
    }
    return true
  }

  Login.prototype.postLogin = function () {
    if (this.checkUsername() && this.checkPassword()) {
      this.username = this.eUsername.val()
      this.password = this.ePassword.val()
      this.rule = this.eRule.val()
      this.isRemember = this.eRemember.is(':checked')
      var data = this.eLoginForm.serialize()
      this.eLoginButton.addClass('disabled')
      this.eLoginButton.text('登录中')
      $.ajax({
        url: '/api/login',
        type: 'POST',
        data: data,
        success: $.proxy(this.loginSuccess, this),
        error: $.proxy(this.loginError, this),
        timeout: 100000
      })
    }
  }

  Login.prototype.loginSuccess = function (res) {
    if (res.code === OK) {
      if (this.isRemember === true) {
        $.proxy(this.remember('set'), this)
      } else {
        localStorage.removeItem('username')
        localStorage.removeItem('password')
        localStorage.removeItem('rule')
      }
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('userId', res.data.userId)
      var url
      if (this.rule === 1) {
        localStorage.setItem('teacherId', res.data.teacherId)
        url = '/teacher.html'
      } else if (this.rule === 2) {
        url = '/'
      } else if (this.rule === 3) {
        url = '/'
      }
      window.open(url, '_self')
    } else if (res.code === ERROR) {
      this.eLoginButton.text('登录')
      this.eLoginButton.removeClass('disabled')
      this.eLoginAlert.text(res.msg)
      this.eLoginAlert.fadeIn()
      setTimeout($.proxy(function () {
        this.eLoginAlert.fadeOut()
      }, this), 2000)
    }
  }

  Login.prototype.loginError = function () {
    this.eLoginButton.text('登录')
    this.eLoginButton.removeClass('disabled')
    this.eLoginAlert.text('网络错误')
    this.eLoginAlert.fadeIn()
    setTimeout($.proxy(function () {
      this.eLoginAlert.fadeOut()
    }, this), 2000)
  }

  Login.prototype.remember = function (option) {
    if (option === 'get') {
      var tempUsername = localStorage.getItem('username')
      var tempPassword = localStorage.getItem('password')
      var tempRule = localStorage.getItem('rule')
      if (tempUsername && tempPassword) {
        this.eUsername.val(tempUsername)
        this.ePassword.val(tempPassword)
        this.eRule.val(tempRule)
        this.eRemember.attr('checked', true)
      }
    } else if (option === 'set') {
      localStorage.setItem('username', this.username)
      localStorage.setItem('password', this.password)
      localStorage.setItem('rule', this.rule)
    }
  }

  module.exports = Login
}($))
