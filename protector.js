(function() {
//get allow-regex and remove it from script-tag
  let regexstr = document.currentScript.getAttribute('data-allow');
  let regex = RegExp(regexstr);
  document.currentScript.removeAttribute('data-allow');

//create a new link so we can make sure to get the prototype of links
  let name = 'protectorjsartificallink';
  document.write(`<a id="${name}" hidden></a>`);
  let a = document.getElementById(name);

// get the link-prototype
  let prototype = Object.getPrototypeOf(a);

//set a new, saver, setter for links
  let real_descriptor = Object.getOwnPropertyDescriptor(prototype, 'href');
  let saver_desc = {
    set: function(x) {
      if (regex.test(x)) {
        real_descriptor.set.apply(this, ['test']);
        console.log('PROTECTOR: Allowed update of href: ', x);
      } else {
        console.error('PROTECTOR: Denied update of href: ', x);
      }
    },
    configurable: false,
  };
  Object.defineProperty(prototype, 'href', saver_desc);
  a.remove();
})();
