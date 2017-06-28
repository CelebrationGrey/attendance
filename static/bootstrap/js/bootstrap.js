/*!
 * Bootstrap v3.3.7 (http://getbootstrap.com)
 * Copyright 2011-2017 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.7
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.7
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'

  /**
   * 构造函数
   * @param el
   * @constructor
   */
  var Alert   = function (el) {
    // 绑定点击事件
    $(el).on('click', dismiss, this.close)
  }

  // 版本号
  Alert.VERSION = '3.3.7'

  // 过渡动画时间
  Alert.TRANSITION_DURATION = 150

  /**
   * 关闭函数
   * @param e
   */
  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    // 父容器
    var $parent = $(selector === '#' ? [] : selector)

    // 阻止默认事件
    if (e) e.preventDefault()

    // 类为alert的父元素
    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    // 触发事件
    $parent.trigger(e = $.Event('close.bs.alert'))

    // 上面事件回调函数中调用了preventDefault, 就不处理
    if (e.isDefaultPrevented()) return

    // 隐藏元素
    $parent.removeClass('in')

    // 移除元素
    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    // 过渡动画完成后移除元素
    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  /**
   * 插件函数
   * @param option
   * @returns {*}
   * @constructor
   */
  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      // 取缓存
      var data  = $this.data('bs.alert')

      // 如果没有缓存，则新建一个
      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  // 保留之前的对象
  var old = $.fn.alert

  // 导出
  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  // 有冲突时，还原对象然后返回自己
  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  // 为有[data-dismiss="alert"]属性的元素绑定点击事件
  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.7
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  /**
   * 构造函数
   * @param element
   * @param options
   * @constructor
   */
  var Button = function (element, options) {
    this.$element  = $(element)
    // 合并配置
    this.options   = $.extend({}, Button.DEFAULTS, options)
    // 加载状态
    this.isLoading = false
  }

  // 版本号
  Button.VERSION  = '3.3.7'

  // 默认配置
  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  /**
   * 设置状态函数
   * @param state
   */
  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    // 将
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      // 如果状态为loadingText这使其不可用反之使其可用
      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d).prop(d, true)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d).prop(d, false)
      }
    }, this), 0)
  }

  /**
   * 开关函数
   */
  Button.prototype.toggle = function () {
    var changed = true
    // 获取有[data-toggle="bottons"]属性的元素
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      // 找到input元素
      var $input = this.$element.find('input')
      // 如果input类型为单选框，移除其他容器内按钮active类，点击元素添加active类
      // 如果input类型为多选框，动态添加删除active类
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      // 将有active类的元素设置为checked
      $input.prop('checked', this.$element.hasClass('active'))
      // 触发事件
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  /**
   * 插件函数
   * @param option
   * @returns {*}
   * @constructor
   */
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  // 为有[data-toggle^="button"]属性的元素添加点击和聚焦事件
  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target).closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"], input[type="checkbox"]'))) {
        // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
        e.preventDefault()
        // The target component still receive the focus
        if ($btn.is('input,button')) $btn.trigger('focus')
        else $btn.find('input:visible,button:visible').first().trigger('focus')
      }
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.7
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  /**
   * 构造函数
   * @param element
   * @param options
   * @constructor
   */
  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    // 绑定键盘事件
    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    // 如果设置为hover暂停，不是手机端，则鼠标移入暂停，鼠标移出继续
    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  // 版本号
  Carousel.VERSION  = '3.3.7'

  // 过渡动画时间
  Carousel.TRANSITION_DURATION = 600

  // 默认配置
  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  /**
   * 键盘函数
   * @param e
   */
  Carousel.prototype.keydown = function (e) {
    // 如果触发元素为input或textarea，则返回
    if (/input|textarea/i.test(e.target.tagName)) return
    // 点击左箭头向前，右箭头向后
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }


    // 阻止默认事件
    e.preventDefault()
  }

  /**
   * 循环函数
   * @param e
   * @returns {Carousel}
   */
  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    // 如果设置了定时器，则清除定时器
    this.interval && clearInterval(this.interval)

    // 如果设置了间隔时间，并且处于暂停状态，重新设置定时器
    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  /**
   * 获得索引函数
   * 获得传入元素的索引
   * @param item
   */
  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  /**
   * 获取要移动到的元素
   * @param direction
   * @param active
   * @returns {*}
   */
  Carousel.prototype.getItemForDirection = function (direction, active) {
    // 获得活动索引
    var activeIndex = this.getItemIndex(active)
    //
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  /**
   * 跳转函数
   * @param pos
   * @returns {*}
   */
  Carousel.prototype.to = function (pos) {
    var that        = this
    // 活动元素索引
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    // 如果传入参数溢出，则返回
    if (pos > (this.$items.length - 1) || pos < 0) return

    //
    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    // 如果现在的活动元素与指定元素相同，则暂停后重新开始
    if (activeIndex == pos) return this.pause().cycle()

    // 滑动到制定元素
    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  /**
   * 暂停函数
   * @param e
   * @returns {Carousel}
   */
  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    // 如果正在进行动画
    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    // 清除定时器
    this.interval = clearInterval(this.interval)

    return this
  }

  /**
   * 向后移动函数
   */
  Carousel.prototype.next = function () {
    // 如果正在移动，则返回
    if (this.sliding) return
    // 向后移动
    return this.slide('next')
  }

  /**
   * 向前移动函数
   */
  Carousel.prototype.prev = function () {
    // 如果正在移动，则返回
    if (this.sliding) return
    // 向前移动
    return this.slide('prev')
  }

  /**
   * 滑动函数
   * @param type
   * @param next
   * @returns {*}
   */
  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    // 如果已经移动到目标，则返回且设置sliding为false
    if ($next.hasClass('active')) return (this.sliding = false)

    // 触发自定义事件
    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)

    // 如果设置了阻止默认事件则返回
    if (slideEvent.isDefaultPrevented()) return

    // 设置为正在进行动画
    this.sliding = true

    // 如果有定时器，则清除定时器
    isCycling && this.pause()

    if (this.$indicators.length) {
      // 移除指示器active类
      this.$indicators.find('.active').removeClass('active')
      // 获取目标指示器
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      // 为目标指示器添加active类
      $nextIndicator && $nextIndicator.addClass('active')
    }

    // 触发自定义事件
    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      // 为目标元素添加类
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      // 为活动元素和目标元素添加方向类
      $active.addClass(direction)
      $next.addClass(direction)
      // 动画结束后，移除添加的类，添加active类
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          // 触发事件
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      // 触发事件
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  /**
   * 插件函数
   * @param option
   * @returns {*}
   * @constructor
   */
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      // 取出缓存
      var data    = $this.data('bs.carousel')
      // 合并配置
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      // 如果没有缓存，创建一个新的缓存
      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      // 传入不同参数，则调用不同方法
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  // 保存旧对象
  var old = $.fn.carousel

  // 导出
  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  // 如果冲突，将旧对象还原
  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  /**
   * 点击处理函数
   * @param e
   */
  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    // 获取轮播图容器
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    // 如果轮播图没有carousel类，则返回
    if (!$target.hasClass('carousel')) return
    // 合并配置
    var options = $.extend({}, $target.data(), $this.data())
    // 滑动索引
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    // 添加配置
    Plugin.call($target, options)

    // 移动到目标元素
    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  // 绑定点击事件
  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  // 文档加载完成后，初始化轮播图
  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.7
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  /**
   * 构造函数
   * @param element
   * @param options
   * @constructor
   */
  var Collapse = function (element, options) {
    this.$element      = $(element)
    // 合并配置
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  // 版本号
  Collapse.VERSION  = '3.3.7'

  // 过渡动画时间
  Collapse.TRANSITION_DURATION = 350

  // 默认配置
  Collapse.DEFAULTS = {
    toggle: true
  }

  /**
   * 获取变化属性
   * @returns {string}
   */
  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  /**
   * 显示函数
   * @returns {*}
   */
  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    // 如果设置了父容器获取父容器下打开或打开中的元素
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    // 触发事件
    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    // 如果设置了父容器并取得元素，隐藏所有目标元素
    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    // 移除collapse类，并添加collapsing类改变属性
    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    /**
     * 完成函数
     */
    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    // 如果不支持过渡动画直接调用完成函数
    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    // 过渡动画完成后调用完成函数
    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  /**
   * 隐藏函数
   * @returns {*}
   */
  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  /**
   * 开关函数
   */
  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  /**
   * 获得父元素
   */
  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  /**
   * 添加属性函数
   * @param $element
   * @param $trigger
   */
  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    // 为目标元素添加aria-expanded属性
    $element.attr('aria-expanded', isOpen)
    // 为触发器元素怒添加类和属性
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  /**
   * 获得触发器目标元素
   * @param $trigger
   * @returns {*|HTMLElement}
   */
  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  /**
   * 插件函数
   * @param option
   * @returns {*}
   * @constructor
   */
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  // 为有[data-toggle="collapse"]属性的元素添加点击事件
  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.7
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================


  // 匹配.dropdown-backdrop类的字符串
  var backdrop = '.dropdown-backdrop'
  // 匹配[data-toggle="dropdown"]属性的字符串
  var toggle   = '[data-toggle="dropdown"]'
  /**
   * 构造函数
   * 对传入的元素绑定点击事件
   * @param element
   * @constructor
   */
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  // 版本号
  Dropdown.VERSION = '3.3.7'

  /**
   * 获取父级函数
   * @param $this
   * @returns {*|HTMLElement}
   */
  function getParent($this) {
    // 获取data-target属性值
    var selector = $this.attr('data-target')

    // 兼容IE
    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    // 获取目标元素
    var $parent = selector && $(selector)

    // 有目标元素获取目标元素，没有则获取传入元素的父元素
    return $parent && $parent.length ? $parent : $this.parent()
  }

  /**
   * 关闭菜单函数
   * @param e
   */
  function clearMenus(e) {
    // 这里我查了一下keycode为3代表ctrl+break暂停运行，但ctrl+break很少使用或者有的根本没有这个组合键
    if (e && e.which === 3) return
    // 移除.dropdown-backdrop的元素
    $(backdrop).remove()
    // 遍历每个[data-toggle="dropdown"]属性的元素
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      // 如果没有打开下拉列表，返回
      if (!$parent.hasClass('open')) return

      // 如果是点击事件并且触发元素为input或textarea并且触发元素包含于容器元素，返回
      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      // 触发hide事件
      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      // 如果默认事件阻止被调用则返回
      if (e.isDefaultPrevented()) return

      // 设置aria-expanded为false
      $this.attr('aria-expanded', 'false')
      // 移除容器元素的open类，隐藏下拉菜单并出发hiden事件
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  /**
   * 开关函数
   * @param e
   * @returns {boolean}
   */
  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    // 如果有.disabled类或:disabled属性，返回
    if ($this.is('.disabled, :disabled')) return

    // 容器元素
    var $parent  = getParent($this)
    // 判断是否下拉菜单显示
    var isActive = $parent.hasClass('open')

    // 关闭下拉菜单
    clearMenus()

    // 如果下拉菜单没有显示
    if (!isActive) {
      // 用ontouchstart来判断是否移动端
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        // 移动端插入一个dropdown-backdrop元素（全屏但z-index比下拉框小），做点击下拉框外时隐藏的效果
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      // 触发show事件
      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      // 如果默认事件阻止被调用则返回
      if (e.isDefaultPrevented()) return

      // 触发聚焦事件并添加focus事件
      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      // 在容器元素上添加open类，显示下拉菜单并触发shown事件
      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }
    // 在这里return false阻止冒泡到document上，导致下拉框隐藏
    return false
  }

  /**
   * 按钮事件函数
   * @param e
   */
  Dropdown.prototype.keydown = function (e) {
    // 如果按键不是上，下，esc和空格或者触发元素为input或textarea则返回
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    // 阻止默认事件和冒泡
    e.preventDefault()
    e.stopPropagation()

    // 如果有.disabled类或:disabled属性，返回
    if ($this.is('.disabled, :disabled')) return

    // 容器元素
    var $parent  = getParent($this)
    // 判断是否下拉菜单显示
    var isActive = $parent.hasClass('open')

    // 如果下拉菜单未显示并且按键不是esc或下拉菜单显示并且按键是esc，触发点击事件
    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      // 如果按键为esc这使容器聚焦
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    // 取得可用a标签集合
    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    // 如果集合为空，返回
    if (!$items.length) return

    // 触发元素位于集合的位置
    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    // 使选中的项触发聚焦事件
    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  /**
   * 插件函数
   * @param option
   * @returns {*}
   * @constructor
   */
  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      // 取缓存dropdown对象
      var data  = $this.data('bs.dropdown')

      // 如果没有'bs.dropdown'对象，新建一个Modal对象
      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      // 如果参数为字符串
      if (typeof option == 'string') data[option].call($this)
    })
  }

  // 保留之前的dropdown，防止冲突
  var old = $.fn.dropdown

  // 导出
  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  //有冲突时,还原$.fn.dropdown的引用,然后返回自己
  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  // 为文档绑定事件
  $(document)
    // 绑定点击事件，点击下拉菜单外隐藏下拉菜单
    .on('click.bs.dropdown.data-api', clearMenus)
    // 为.dropdown下的form元素绑定点击事件，阻止事件冒泡
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    // 为有[data-toggle="dropdown"]属性的元素绑定点击事件，触发下拉菜单的开关函数
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    // 为有[data-toggle="dropdown"]属性的元素绑定键盘事件，触发下拉菜单的键盘函数
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    // 为.dropdown-menu元素绑定键盘事件，触发下拉菜单的键盘函数
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.7
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    // 设置选项
    this.options             = options
    // body元素
    this.$body               = $(document.body)
    // 传入元素（模态框）
    this.$element            = $(element)
    // 对话框元素
    this.$dialog             = this.$element.find('.modal-dialog')
    // 遮罩元素
    this.$backdrop           = null
    // 是否显示中
    this.isShown             = null
    // 最原始的右边距大小(未加滚动条之前)
    this.originalBodyPad     = null
    // 滚动条宽度
    this.scrollbarWidth      = 0
    // 忽略遮罩点击
    this.ignoreBackdropClick = false

    /**
     * 如果提供的是 URL，将利用 jQuery 的 load 方法从此 URL 地址加载要展示的内容（只加载一次）并插入
     * .modal-content 内。如果使用的是 data 属性 API，还可以利用 href 属性指定内容来源地址
     * 从远端的数据源加载完数据之后触发loaded.bs.modal事件。
     */
    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  // 版本号
  Modal.VERSION  = '3.3.7'

  // 对话框过渡持续时间
  Modal.TRANSITION_DURATION = 300
  // 遮罩过渡持续时间
  Modal.BACKDROP_TRANSITION_DURATION = 150

  // 模态框默认设置
  Modal.DEFAULTS = {
    // 点击遮罩隐藏
    backdrop: true,
    // esc隐藏
    keyboard: true,
    // 状态框初始化之后就立即显示
    show: true
  }

  /**
   * 开关函数
   * 如果已经显示就隐藏，如果隐藏就显示。
   * @param _relatedTarget 目标元素字符串
   * @returns {*}
   */
  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  /**
   * 显示函数
   * 显示模态框
   * @param _relatedTarget 目标元素字符串
   */
  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    // show 方法调用之后立即触发该事件。
    // 如果是通过点击某个作为触发器的元素，则此元素可以通过事件的 relatedTarget 属性进行访问。
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    // 如果已经显示或者show事件已经阻止了默认事件，结束
    if (this.isShown || e.isDefaultPrevented()) return

    // 设置为显示中
    this.isShown = true

    // 检测是否有滚动条并计算滚动条宽度
    this.checkScrollbar()
    // 如果body具有滚动条添加原paddingRight+滚动条宽度的paddingRight
    this.setScrollbar()
    // 为body添加类
    // 此类隐藏掉body的滚动条
    this.$body.addClass('modal-open')

    // 如果options.keyboard配置为true则监听keyup.dismiss.bs.modal事件
    // 功能就是按esc键,就调用hide方法
    this.escape()
    // 设置模态框左右padding
    this.resize()

    // 为包含data-dismiss="modal"属性的元素注册点击事件
    // 点击隐藏
    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    // 如果在模态框内按下在模态框（包括内部）放开则不隐藏模态框
    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    // 调用backdrop显示遮罩
    // 传入回调函数
    this.backdrop(function () {
      // 是否支持过渡动画并且有fade类
      var transition = $.support.transition && that.$element.hasClass('fade')
      // 没有父元素，则将model附加到body上
      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      // 将模态框显示并将滚动条设置到顶点
      that.$element
        .show()
        .scrollTop(0)

      // 处理溢出问题
      that.adjustDialog()

      // 如果使用过渡动画强制回流
      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      // 为模态框添加类
      // 此类将模态框透明度为1
      that.$element.addClass('in')

      // 解绑并为document对象注册focusin.bs.modal事件
      that.enforceFocus()

      // 此事件在模态框已经显示出来（并且同时在 CSS 过渡效果完成）之后被触发。
      // 如果是通过点击某个作为触发器的元素
      // 则此元素可以通过事件的 relatedTarget 属性进行访问。
      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      // 如果动画完成触发shown.bs.modal事件
      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  /**
   * 隐藏函数
   * @param e
   */
  Modal.prototype.hide = function (e) {
    // 阻止默认事件
    if (e) e.preventDefault()

    // hide 方法调用之后立即触发该事件。
    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    // 如果model状态为未显示
    // 或者上面事件回调函数中调用了preventDefault, 就不处理
    if (!this.isShown || e.isDefaultPrevented()) return

    // 设置为未显示
    this.isShown = false

    // 解除键盘esc退出绑定
    this.escape()
    // 解除调整事件
    this.resize()

    // 关闭获取焦点事件
    $(document).off('focusin.bs.modal')

    // 移除in类使模态框透明度变为0
    // 解绑点击关闭按钮事件和鼠标抬起事件
    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    // 解绑鼠标按下事件
    this.$dialog.off('mousedown.dismiss.bs.modal')

    // 动画结束，调用hideModal方法隐藏遮罩
    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  /**
   * 强制聚焦函数
   * 解绑并为document对象注册focusin.bs.modal事件
   * 如果不是model产生的,就触发model的focus事件
   */
  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (document !== e.target &&
            this.$element[0] !== e.target &&
            !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  /**
   * 键盘退出函数
   * 设置esc隐藏事件
   */
  Modal.prototype.escape = function () {
    // 如果处于显示中并且选择了键盘事件触发
    if (this.isShown && this.options.keyboard) {
      // 绑定keydown事件
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        // 如果按下的为esc，调用隐藏方法
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      // 解绑keydown事件
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  /**
   * 位置调整函数
   * 如果在显示过程中则添加resize事件
   */
  Modal.prototype.resize = function () {
    if (this.isShown) {
      // resize事件触发调用handleUpdate函数
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  /**
   * 隐藏模态框函数
   */
  Modal.prototype.hideModal = function () {
    var that = this
    // 隐藏模态框
    this.$element.hide()
    // 隐藏遮罩
    // 传入回调函数
    this.backdrop(function () {
      // 移除modal-open类恢复body的滚动条
      that.$body.removeClass('modal-open')
      // 恢复模态框左右padding
      that.resetAdjustments()
      // 恢复原paddingRight
      that.resetScrollbar()
      // 触发hidden.bs.modal事件
      that.$element.trigger('hidden.bs.modal')
    })
  }

  /**
   * 移除遮罩函数
   */
  Modal.prototype.removeBackdrop = function () {
    // 如果遮罩存在则移除遮罩
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  /**
   * 遮罩函数
   * @param callback 回调函数
   */
  Modal.prototype.backdrop = function (callback) {
    var that = this
    // 是否包含fade类
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    // 如果模态框显示中并且设置为点击遮罩隐藏
    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      // 创建div元素并添加modal-backdrop类和过渡动画类
      // 插入body中
      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      // 为模态框添加点击事件
      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        // 如果忽略遮罩点击为true则改为false并返回
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        // 如果触发对象和事件监听对象不同则返回
        if (e.target !== e.currentTarget) return
        // 如果backdrop为'static'则获得焦点，否则隐藏模态框
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      // 如果使用过渡动画，强制回流
      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow
      // 为遮罩添加in类透明度变为1
      this.$backdrop.addClass('in')

      // 如果没有回调函数则返回
      if (!callback) return

      // 动画完成后调用回调函数
      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      // 移除in类
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        // 移除遮罩函数
        that.removeBackdrop()
        // 调用回调函数
        callback && callback()
      }
      // 动画完成后调用移除与回调函数
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // 处理溢出问题
  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  /**
   * 溢出函数
   * 处理溢出问题
   */
  Modal.prototype.adjustDialog = function () {
    // 判断模态框高度是否溢出
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    // 设置模态框元素左右内边距
    this.$element.css({
      // 如果body没有溢出并且模态框溢出添加paddingLeft为滚动条宽度
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      // 如果body溢出并且模态框没有溢出添加paddingLeft为滚动条宽度
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  /**
   * 重置调整函数
   * 移除模态框左右padding
   */
  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  /**
   * 检测滚动条函数
   * 检测是否有滚动条并计算滚动条宽度
   */
  Modal.prototype.checkScrollbar = function () {
    // 浏览器窗口宽度
    var fullWindowWidth = window.innerWidth
    // 解决IE8没有window.innerWidth方法
    if (!fullWindowWidth) {
      // 得到根元素的大小及其相对于视口的位置
      var documentElementRect = document.documentElement.getBoundingClientRect()
      // 浏览器窗口宽度=根元素右偏移减左偏移
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    // 判断body元素是否溢出（有滚动条）
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    // 计算滚动条宽度
    this.scrollbarWidth = this.measureScrollbar()
  }

  /**
   * 设置滚动条函数
   * 为body设置一个原paddingRight+滚动条宽度的paddingRight
   */
  Modal.prototype.setScrollbar = function () {
    // 获得原paddingRight值
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    // 将原paddingRight值存储起来
    this.originalBodyPad = document.body.style.paddingRight || ''
    // 如果body具有滚动条
    // 则为body设置一个原paddingRight+滚动条宽度的paddingRight
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  /**
   * 还原滚动条函数
   * 还原，为body添加为原paddingRight
   */
  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  /**
   * 计算滚动条宽度函数
   * @returns {number} 滚动条宽度
   */
  Modal.prototype.measureScrollbar = function () {
    // 创建一个div元素
    var scrollDiv = document.createElement('div')
    // 将div元素添加类名并插入文档最后
    // 此类提供一个隐藏的具有滚动条的元素以供计算
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    // 滚动条宽度=元素总宽度-可视宽度
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    // 移除添加的div元素
    this.$body[0].removeChild(scrollDiv)
    // 返回计算出的滚动条宽度
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================
  /**
   * 插件函数
   * @param option
   * @param _relatedTarget
   * @returns {*}
   * @constructor
   */
  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      // 取缓存model对象
      var data    = $this.data('bs.modal')
      // 合并配置
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      // 如果没有'bs.modal'对象，新建一个Modal对象
      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      // 如果参数为字符串(一般是'toggle','show','hien')
      if (typeof option == 'string') data[option](_relatedTarget)
      // 如果配置为初始显示,就显示
      else if (options.show) data.show(_relatedTarget)
    })
  }

  // 保留之前的modal，防止冲突
  var old = $.fn.modal

  // 导出
  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================
  //有冲突时,还原$.fn.modal的引用,然后返回自己
  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  // 为有[data-toggle="modal"]属性的元素添加点击事件
  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    // 取得点击元素的herf属性值
    var href    = $this.attr('href')
    // 取得目标模态框元素
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    // model元素有缓存 ? 直接调用toggle方法 : 没有就远程获取href内容显示
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    // 如果点击元素为a阻止默认事件
    if ($this.is('a')) e.preventDefault()

    // 为model绑定show.bs.modal(显示前)事件
    $target.one('show.bs.modal', function (showEvent) {
      // 如果前面注册的事件处理器一定调用了preventDefault方法,就不会显示
      if (showEvent.isDefaultPrevented()) return
      // 为model绑定hidden.bs.modal(隐藏后)事件
      // 如果当前元素可见,就触发当前元素焦点事件
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    // 调用Model.toggle方法,或者创建新的model对象,并从远处加载内容
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.7
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  /**
   * 构造函数
   * @param element
   * @param options
   * @constructor
   */
  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    // 初始化
    this.init('tooltip', element, options)
  }

  // 版本号
  Tooltip.VERSION  = '3.3.7'

  // 过渡动画时间
  Tooltip.TRANSITION_DURATION = 150

  // 默认配置
  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  /**
   * 初始化函数
   * @param type
   * @param element
   * @param options
   */
  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    // 如果元素不是文档元素或者没有配置选择器
    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    // 需要的事件类型数组
    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      // 如果为点击事件，为元素绑定点击事件
      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        // 如果为悬停事件，设置为mouseenter和mouseleave否则为focusin和focusout
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        // 为元素绑定点击事件
        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  /**
   * 获得默认配置函数
   * @returns {{animation: boolean, placement: string, selector: boolean, template: string, trigger: string, title: string, delay: number, html: boolean, container: boolean, viewport: {selector: string, padding: number}}|*}
   */
  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  /**
   * 获得配置函数
   * @param options
   * @returns {void|*}
   */
  Tooltip.prototype.getOptions = function (options) {
    // 合并配置参数
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    // 配置延迟参数
    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    // 返回配置
    return options
  }

  /**
   * 获得被替代的配置函数
   * @returns {{}}
   */
  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    // 获得默认配置
    var defaults = this.getDefaults()

    // 将合并配置中与默认配置不同的配置项取出
    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  /**
   * 鼠标移入函数
   * @param obj
   */
  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    // 创建提示工具，如果有in类或者状态为in则返回
    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    // 如果未设置延时则直接显示
    if (!self.options.delay || !self.options.delay.show) return self.show()

    // 如果设置了延时则延时显示
    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  /**
   * 判断状态函数
   * @returns {boolean}
   */
  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  /**
   * 鼠标移出函数
   * @param obj
   * @returns {{show: *, hide}|*}
   */
  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    // 如果状态为true则返回
    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    // 如果没有设置延迟则立即隐藏提示工具
    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    // 延迟隐藏提示工具
    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  /**
   * 显示函数
   */
  Tooltip.prototype.show = function () {
    // 创建自定义事件并触发
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      // 判断元素在dom内
      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      // 如果回调函数中调用了preventDefault或元素不在dom内, 就返回
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      // 创建提示工具
      var $tip = this.tip()

      // 创建工具id
      var tipId = this.getUID(this.type)

      // 设置提示内容
      this.setContent()

      // 设置id属性并添加id
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      // 如果使用过渡动画效果，添加fade类
      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)

      // 如果设置了位置为auto则将auto替换为空
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      // 如果设置了容器将提示工具插入到容器中，如果没有则将提示工具插入到目标元素后
      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      // 触发事件
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      // 计算是否超过页面的显示区域，如果超过则替换为相反项
      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      // 计算偏移
      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      // 设置提示工具准确位置并显示
      this.applyPlacement(calculatedOffset, placement)

      /**
       * 触发事件，还原状态
       */
      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      // 过渡动画结束后，调用完成函数
      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  /**
   * 设置准确位置
   * @param offset
   * @param placement
   */
  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    // 是否在垂直线
    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  /**
   * 替换三角函数
   * @param delta
   * @param dimension
   * @param isVertical
   */
  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  /**
   * 设置内容函数
   */
  Tooltip.prototype.setContent = function () {
    // 创建提示工具
    var $tip  = this.tip()
    // 得到提示内容
    var title = this.getTitle()

    // 向提示工具中插入内容
    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    // 移除提示工具一些类
    $tip.removeClass('fade in top bottom left right')
  }

  /**
   * 隐藏函数
   * @param callback
   * @returns {Tooltip}
   */
  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      if (that.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
        that.$element
          .removeAttr('aria-describedby')
          .trigger('hidden.bs.' + that.type)
      }
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  /**
   * 添加title内容到data-original-title
   */
  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  /**
   * 获得位置函数
   * @param $element
   * @returns {void|*}
   */
  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    // 获取元素位置对象
    var elRect    = el.getBoundingClientRect()
    // IE8这个对象没有宽度和高度，计算出来
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement
    // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset  = isBody ? { top: 0, left: 0 } : (isSvg ? null : $element.offset())
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  // 计算偏移
  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  // 调整三角元素位置
  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  /**
   * 获取内容函数
   * @returns {*}
   */
  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    // 得到title内容
    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  /**
   * 创建id函数
   * @param prefix
   * @returns {*}
   */
  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  /**
   * 创建提示工具模板函数
   * @returns {null|*|HTMLElement}
   */
  Tooltip.prototype.tip = function () {
    // 如果没有提示工具按模板创建一个
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  /**
   * 获取三角元素
   * @returns {*|{}}
   */
  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  /**
   * 开关函数
   * @param e
   */
  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  /**
   * 销毁函数
   */
  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    // 隐藏并销毁提示工具
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
      that.$element = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  /**
   * 插件函数
   * @param option
   * @returns {*}
   * @constructor
   */
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      // 取缓存tooltip对象
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      // 如果没有'bs.tooltip'对象，新建一个Tab对象
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      // 如果参数为字符串
      if (typeof option == 'string') data[option]()
    })
  }

  // 保留之前的tooltip，防止冲突
  var old = $.fn.tooltip

  // 导出
  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  //有冲突时,还原$.fn.tooltip的引用,然后返回自己
  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.7
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  /**
   * 构造函数
   * @param element
   * @param options
   * @constructor
   */
  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  // 依赖于tooltip插件
  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  //版本号
  Popover.VERSION  = '3.3.7'

  // 默认配置
  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================


  // Popover继承tooltip类
  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  // 获取默认配置
  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  // 设置内容
  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  // 获取内容
  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  // 获取三角元素
  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  /**
   * 插件函数
   * @param option
   * @returns {*}
   * @constructor
   */
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      // 取出缓存
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return

      // 如果没有缓存，则新建一个
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  // 保留之前的对象
  var old = $.fn.popover

  // 导出
  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  // 有冲突时，还原对象然后返回自己
  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.7
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  /**
   * 构造函数
   * @param element
   * @param options
   * @constructor
   */
  function ScrollSpy(element, options) {
    // body元素
    this.$body          = $(document.body)
    // 如果传入元素为body元素则使用window否则使用传入元素
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    // 合并设置
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    // 对应的target（即nav）上的a标签作为selector
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    // 绑定滚动事件
    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  // 版本号
  ScrollSpy.VERSION  = '3.3.7'

  // 默认设置
  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  /**
   * 获取滚动条高度函数
   * @returns {number|*}
   */
  ScrollSpy.prototype.getScrollHeight = function () {
    // 返回滚动元素的滚动条高度，如果没有则返回文档的滚动条高度
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  /**
   * 刷新函数
   */
  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    // 得到滚动条高度
    this.scrollHeight = this.getScrollHeight()

    // 如果监听的滚动对象不是body，则使用position方法来获取offsets值
    // jquery的offset()方法是获取匹配元素在当前视口的相对偏移
    // position()方法是获取匹配元素相对父元素的偏移
    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    // 找到全部锚点
    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        // 返回由[offsets，锚点]组成的数组
        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  /**
   * 处理函数
   * 根据this.offsets与当前的scrollTop比较，判断是否需要activate
   * @returns {boolean}
   */
  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    // 获取滚动条高度
    var scrollHeight = this.getScrollHeight()
    // 最大滚动条高度
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    // 如果滚动条高度不一致，调用刷新函数
    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    // 超过当前元素的最大可滚动高度，直接激活最后一个nav
    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    // 没超过第一个offset，清除当前的激活对象
    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    // 循环判断是否需要激活
    for (i = offsets.length; i--;) {
      // 满足当前遍历的target不是激活对象
      activeTarget != targets[i]
        // 满足当前滚动高度大于对应的offset
        && scrollTop >= offsets[i]
        // 满足当前滚动高度小于下一个滚动高度，或下一个滚动高度未定义
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        // 激活
        && this.activate(targets[i])
    }
  }

  /**
   * 活动函数
   * @param target
   */
  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    // 清除当前激活对象
    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    // 添加active类
    var active = $(selector)
      .parents('li')
      .addClass('active')

    // 如果是下拉列表在dropdown容器上添加active类
    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    // 出发activate事件
    active.trigger('activate.bs.scrollspy')
  }

  /**
   * 清除函数
   */
  ScrollSpy.prototype.clear = function () {
    // 清楚active类
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  /**
   * 插件函数
   * @param option
   * @returns {*}
   * @constructor
   */
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      // 取缓存scrollspy对象
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      // 如果没有'bs.scrollspy'对象，新建一个crollspy对象
      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      // 如果参数为字符串
      if (typeof option == 'string') data[option]()
    })
  }

  // 保留之前的scrollspy，防止冲突
  var old = $.fn.scrollspy

  // 导出
  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  //有冲突时,还原$.fn.scrollspy的引用,然后返回自己
  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  // 文档加载完成后，为有[data-spy="scroll"]属性的元素完成初始化
  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.7
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  /**
   * 构造函数
   * @param element
   * @constructor
   */
  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  // 版本号
  Tab.VERSION = '3.3.7'

  // 过渡时间
  Tab.TRANSITION_DURATION = 150

  /**
   * 显示函数
   */
  Tab.prototype.show = function () {
    var $this    = this.element
    // 获取导航栏
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    // 获取每个tab对应的content
    var selector = $this.data('target')

    // 如果selector为空，从href中获取
    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    // 如果点击的是自己，则返回
    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    // 自定义hide，show事件，并触发
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    // 上面事件回调函数中调用了preventDefault, 就不处理
    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    // 获取目标content元素
    var $target = $(selector)

    // 传入当前tab的a标签的li，及其container，完成tab页切换
    this.activate($this.closest('li'), $ul)
    // 完成content页的切换，且自定义触发后事件
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  /**
   * 激活函数
   * @param element
   * @param container
   * @param callback
   */
  Tab.prototype.activate = function (element, container, callback) {
    // 得到激活元素
    var $active    = container.find('> .active')
    // 过渡效果
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    /**
     * 处理函数
     */
    function next() {
      $active
        // 去掉激活元素的active类
        .removeClass('active')
        // 去掉下拉列表的active类
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        // 找到激活元素下有[data-toggle="tab"]属性的元素将打开标志设置为false
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        // 为点击元素添加active类
        .addClass('active')
        // 找到点击元素下有[data-toggle="tab"]属性的元素将打开标志设置为true
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      // 如果支持过渡动画，添加in类触发过渡动画，否则移除fade类
      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      // 如果点击元素是下拉菜单项，将下拉菜单设置为激活
      // 并将元素下有[data-toggle="tab"]属性的元素将打开标志设置为true
      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      // 如果有回调函数则调用
      callback && callback()
    }

    // 如果有过渡效果，等待当前元素完成过渡且触发事件时，再调用next方法出现
    // 如果是没有过渡效果的，调用next方法切换active
    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    // 移除激活元素的in类
    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  /**
   * 插件函数
   * @param option
   * @returns {*}
   * @constructor
   */
  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      // 取缓存model对象
      var data  = $this.data('bs.tab')

      // 如果没有'bs.tab'对象，新建一个Tab对象
      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      // 如果参数为字符串
      if (typeof option == 'string') data[option]()
    })
  }

  // 保留之前的tab，防止冲突
  var old = $.fn.tab

  // 导出
  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  //有冲突时,还原$.fn.tab的引用,然后返回自己
  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  /**
   * 点击处理函数
   * 阻止默认事件，并调用show函数
   * @param e
   */
  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  // 为有[data-toggle="tab"]属性和[data-toggle="pill"]的元素添加点击事件
  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.7
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  /**
   * 构造函数
   * @param element
   * @param options
   * @constructor
   */
  var Affix = function (element, options) {
    // 合并配置
    this.options = $.extend({}, Affix.DEFAULTS, options)

    // 绑定滚动和点击事件
    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  // 版本号
  Affix.VERSION  = '3.3.7'

  // 重置
  Affix.RESET    = 'affix affix-top affix-bottom'

  // 默认配置
  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  /**
   * 获取状态函数
   * @param scrollHeight
   * @param height
   * @param offsetTop
   * @param offsetBottom
   * @returns {*}
   */
  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    // 如果offsetTop为空并且affixed等于top
    if (offsetTop != null && this.affixed == 'top')
      // 如果元素在可视区域内，返回top，反之返回false
      return scrollTop < offsetTop ? 'top' : false

    // 如果affixed为bottom
    if (this.affixed == 'bottom') {
      // 如果offsetTop不为空
      if (offsetTop != null)
        return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    // 如果offsetTop不为空且元素在可视区域内，返回top
    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  /**
   * 获取定位偏移函数
   * @returns {*}
   */
  Affix.prototype.getPinnedOffset = function () {
    // 如果设置了pinnedOffset直接返回它
    if (this.pinnedOffset) return this.pinnedOffset
    // 为元素移除固定类，添加affix类
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    // 计算偏移
    return (this.pinnedOffset = position.top - scrollTop)
  }

  /**
   * 异步调用checkPosition
   */
  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  /**
   * 检测位置函数
   */
  Affix.prototype.checkPosition = function () {
    // 如果元素为隐藏状态，则返回
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      // 触发自定义事件
      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      // 设置固定状态
      this.affixed = affix
      // 如果为底部固定
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      // 移除固定类，添加定义类，并触发事件
      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    // 如果affix为bottom，则设置元素的top为文档总高度-元素高度-设置偏移高度
    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  /**
   * 插件函数
   * @param option
   * @returns {*}
   * @constructor
   */
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      // 取出缓存
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      // 如果没有缓存，生成一个新的
      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  // 保存旧对象
  var old = $.fn.affix

  // 导出
  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  // 如果冲突，将旧对象还原
  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  // 文档加载完成后初始化
  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);
