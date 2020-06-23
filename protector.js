(function() {
//get allow-regex and remove it from script-tag
  let regexstr = document.currentScript.getAttribute('data-allow');
  let regex = RegExp(regexstr);
  let test = regex.test;
  let boundtest = test.bind(regex);
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
      if (boundtest(x)) {
        // an Attacker might overwrite the apply-function with something else
        // i.e. setting the value might not always work, but an attacker never can change the value
        real_descriptor.set.apply(this, [x]);
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
