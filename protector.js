(function() {
  let regexProvided = document.currentScript.hasAttribute('data-allow');
  let isAllowed;
  if (regexProvided) {
//get allow-regex and remove it from script-tag
    let regexstr = document.currentScript.getAttribute('data-allow');
    let regex = RegExp(regexstr);
    let test = regex.test;
    // use the test function of the regex as allow-function
    isAllowed = test.bind(regex);
    document.currentScript.removeAttribute('data-allow');
  } else {
    //if no regex is provided  we will disallow every change
    isAllowed = function(x) {
      return false;
    };
  }
//create a new link so we can make sure to get the prototype of links
  let a = document.createElement('a');
  a.style.display = 'none';
  window.addEventListener('load', function() {
    document.body.appendChild(a);
  });

// get the link-prototype
  let prototype = Object.getPrototypeOf(a);

//set a new, saver, setter for links
  let real_descriptor = Object.getOwnPropertyDescriptor(prototype, 'href');
  let real_descriptor_apply = real_descriptor.set.apply;
  let boundapply = real_descriptor_apply.bind(real_descriptor.set);
  let safer_descriptor = {
    set: function(x) {
      if (isAllowed(x)) {
        boundapply(this, [x]);
        console.log('PROTECTOR: Allowed update of href: ', x);
      } else {
        console.error('PROTECTOR: Denied update of href: ', x);
      }
    },
    configurable: false,
  };
  Object.defineProperty(prototype, 'href', safer_descriptor);
  a.remove();
})();