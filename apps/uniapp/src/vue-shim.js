// Vue shim for @dcloudio compatibility
// Provides internal APIs that @dcloudio/uni-app imports from 'vue'
// but which are not part of Vue's public API
import * as Vue from 'vue';

let isInSSRComponentSetup = false;

function injectHook(type, hook, target = Vue.getCurrentInstance(), prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = {
      __v_isShallow: false,
      effect: hook,
      dirs: null,
      cleanup: null
    };
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return () => {
      const idx = hooks.indexOf(wrappedHook);
      if (idx > -1) hooks.splice(idx, 1);
    };
  }
}

export { isInSSRComponentSetup, injectHook };
export * from 'vue';
