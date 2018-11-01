/**
 * options
 * 
 * options from preact
 */
import { options } from 'preact';

/**
 * OPTS
 * 
 * Various options
 * 
 * duration: number of milliseconds duration for long press
 */
const OPTS = {
  duration: 500
};

/**
 * Initalizing some global variables
 */
let timer, 
  injected,
  isTouch = (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));

/**
 * Initializing event names
 */
const mouseDown = isTouch ? 'ontouchstart' : 'onmousedown',
  mouseOut = isTouch ? 'ontouchcancel' : 'onmouseout',
  mouseUp = isTouch ? 'ontouchend' : 'onmouseup',
  mouseMove = isTouch ? 'ontouchmove' : 'onmousemove',
  mouseWheel = 'onmousewheel',
  wheel = 'onwheel',
  scroll = 'onscroll';

/**
 * longPressInjector
 */
const longPressInjector = opts => {
  for (let i in opts) {
    if(opts.hasOwnProperty(i)) {
      OPTS[i] = opts[i];
    }
  }

  /**
   * check if already injected
   */
  if(injected) {
    return;
  }

  injected = true;

  let old = options.vnode;

  options.vnode = vnode => {
    let attrs = vnode.attributes;

    if(attrs) {
      for(let i in attrs) {
        if(attrs.hasOwnProperty(i) && i.toLowerCase() === 'onlongpress') {
          proxy(attrs);
          break;
        }
      }
    }

    if(old) {
      old(vnode);
    }
  }
}
/**
 * proxy
 * 
 * Proxy for onLongPress
 * @param {*} attrs 
 */
function proxy(attrs) {
  let map = {};

  for(let i in attrs) {
    if(attrs.hasOwnProperty(i)) {
      map[i.toLowerCase()] = i;
    }
  }

  const onLongPress = attrs[map.onlongpress],
    onMouseDown = attrs[mouseDown];

  function callback(event) {
    event.stopPropagation();
    
    removeEventListener('longPress', callback);
    
    onLongPress(event);
    return false;
  }

  /**
   * other existing callbacks
   */
  const callbacks = {};
  callbacks[mouseOut] = attrs[mouseOut];
  callbacks[mouseUp] = attrs[mouseUp];
  callbacks[mouseMove] = attrs[mouseMove];
  callbacks[mouseWheel] = attrs[mouseWheel];
  callbacks[wheel] = attrs[wheel];
  callbacks[scroll] =  attrs[scroll];

  attrs[mouseDown] = e => {
    timer = setTimeout(fireEvent.bind(e.currentTarget, callback), OPTS.duration);

    if(onMouseDown) {
      onMouseDown(e);
    }
  }

  for(let c in callbacks) {
    attrs[c] = e => {
      clearTimeout(timer);

      if(callbacks[c]) {
        callbacks[c](e);
      }
    }
  }
}

function fireEvent(callback) {
  clearTimeout(timer);
  this.removeEventListener('longPress', callback);
  this.addEventListener('longPress', callback, false);
  this.dispatchEvent(new Event('longPress'));
}

export default longPressInjector;