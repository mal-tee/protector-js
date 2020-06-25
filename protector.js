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
  let real_descriptor_apply = real_descriptor.set.apply;
  let boundapply = real_descriptor_apply.bind(real_descriptor.set);
  let saver_desc = {
    set: function(x) {
      if (boundtest(x)) {
        boundapply(this, [x]);
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
