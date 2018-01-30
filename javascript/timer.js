(function($) {
  $.timer = Timer;
  /**
   * First parameter can either be a function or an object of parameters.
   *
   * @param {function | {
   *   action: function,
   *   time: int=,
   *   autostart: boolean=
   * }} action
   * @param {int=} time
   * @param {boolean=} autostart
   * @returns {Timer}
   */
  function Timer(action, time, autostart) {
    if (this.constructor != Timer || this.init) {
      return new Timer(action, time, autostart);
    }
    this.set(action, time, autostart);
    return this;
  }
  /**
   * @see Timer
   *
   * @param {function | {
   *   action: function,
   *   time: int=,
   *   autostart: boolean=
   * }} action
   * @param {int=} time
   * @param {boolean=} autostart
   * @returns {Timer}
   */
  Timer.prototype.set = function(action, time, autostart) {
    this.init = true;
    if (typeof action == "object") {
      if (action.time) {
        time = action.time;
      }
      if (action.autostart) {
        autostart = action.autostart;
      }
      action = action.action;
    }
    if (typeof action == "function") {
      this.action = action;
    }
    if (!isNaN(time)) {
      this.intervalTime = time;
    }
    if (autostart && this.isReadyToStart()) {
      this.isActive = true;
      this.setTimer();
    }
    return this;
  };
  Timer.prototype.isReadyToStart = function() {
    var notActive = !this.active;
    var hasAction = typeof this.action == "function";
    var hasTime = !isNaN(this.intervalTime);
    return notActive && hasAction && hasTime;
  };
  /**
   * @param {int=} time
   * @returns {Timer}
   */
  Timer.prototype.once = function(time) {
    var timer = this;
    if (isNaN(time)) {
      timer.action();
      return this;
    }
    setTimeout(fnTimeout, time);
    return this;

    function fnTimeout() {
      timer.action();
    }
  };
  /**
   * @param {boolean=} reset
   * @returns {Timer}
   */
  Timer.prototype.play = function(reset) {
    if (this.isReadyToStart()) {
      if (reset) {
        this.setTimer();
      } else {
        this.setTimer(this.remaining);
      }
      this.isActive = true;
    }
    return this;
  };
  /**
   * @returns {Timer}
   */
  Timer.prototype.pause = function() {
    if (this.isActive) {
      this.isActive = false;
      this.remaining -= new Date() - this.last;
      this.clearTimer();
    }
    return this;
  };
  /**
   * @returns {Timer}
   */
  Timer.prototype.stop = function() {
    this.isActive = false;
    this.remaining = this.intervalTime;
    this.clearTimer();
    return this;
  };
  /**
   * @param {boolean=} reset
   * @returns {Timer}
   */
  Timer.prototype.toggle = function(reset) {
    if (this.isActive) {
      this.pause();
    } else if (reset) {
      this.play(true);
    } else {
      this.play();
    }
    return this;
  };
  /**
   * @returns {Timer}
   */
  Timer.prototype.reset = function() {
    this.isActive = false;
    this.play(true);
    return this;
  };
  /**
   * @returns {Timer}
   */
  Timer.prototype.clearTimer = function() {
    clearTimeout(this.timeoutObject);
    return this;
  };
  /**
   * @returns {Timer}
   */
  Timer.prototype.setTimer = function(time) {
    var timer = this;
    if (isNaN(time)) {
      time = this.intervalTime;
    }
    this.remaining = time;
    this.last = new Date();
    this.clearTimer();
    this.timeoutObject = setTimeout(fnTimeout, time);
    return this;

    function fnTimeout() {
      timer.execute();
    }
  };
  /**
   * @returns {Timer}
   */
  Timer.prototype.execute = function() {
    if (this.isActive) {
      try {
        this.action();
      } finally {
        this.setTimer();
      }
    }
    return this;
  };
})(jQuery);