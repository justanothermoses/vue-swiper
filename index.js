export default {
  // default config 
  config: {
    threshold: 50, // threshold in px
  },

  install(app, options) {
    this.config = {
      ...this.config,
      ...options
    }

    app.directive('swiper', (target, binding, vnode) => this.registerSwiper(target, binding, vnode))
  },

  registerSwiper(target, binding, vnode) {
    const { arg: mode, value: callback } = binding
    const start = {}

    const calculateMovement = (end) => {
      const movement = {
        x: start.x - end.clientX,
        y: start.y - end.clientY,
        duration: Date.now() - start.timestamp
      }
      invokeCallback(movement)
    }

    const invokeCallback = ({ x, y, duration }) => {
      switch (mode) {
        case 'details':
          callback({ x, y }, duration)
          break
        default:
          const up = y > this.config.threshold,
            down = y < - this.config.threshold,
            left = x > this.config.threshold,
            right = x < - this.config.threshold,
            hypotenuse = Math.sqrt(Math.abs(x) ** 2 + Math.abs(y) ** 2),
            speed = hypotenuse / duration
          callback({ up, right, down, left }, speed)
          break
      }
    }

    const eventListeners = {
      'touchstart': (e) => {
        start.x = e.targetTouches[0].clientX
        start.y = e.targetTouches[0].clientY
        start.timestamp = Date.now()
      },
      'mousedown': (e) => {
        start.x = e.clientX
        start.y = e.clientY
        start.timestamp = Date.now()
      },
      'touchmove': e => e.preventDefault(),
      'mousemove': e => e.preventDefault(),
      'touchend': e => calculateMovement(e.changedTouches[0]),
      'mouseup': e => calculateMovement(e),
    }

    Object.keys(eventListeners).forEach(eventListener => target.addEventListener(eventListener, eventListeners[eventListener], false))
  }
}