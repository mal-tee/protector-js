(function() {
//get secret and remove it from script-tag
  let secret = document.currentScript.getAttribute('data-secret');
  document.currentScript.removeAttribute('data-secret');

//create a new link so we can make sure to get the protoype of links
  let name = 'protectorjsartificallink';
  document.write(`<a id="${name}" hidden></a>`);
  let a = document.getElementById(name);

// get the link-prototype
  let prototype = Object.getPrototypeOf(a);
//set a new, saver, setter for links
  let real_descriptor = Object.getOwnPropertyDescriptor(prototype, 'href');

  let saver_desc = {
    /**
     * Denies the setting of x, unless x has a secret as prefix.
     * If the secret is present, the rest of the string after the secret is set as href.
     * @param x
     */
    set: function(x) {
      if (x.startsWith(secret)) {
        x = x.slice(secret.length);
        Object.defineProperty(this, 'href', real_descriptor);
        this.href = x;
        Object.defineProperty(this, 'href', saver_desc);
        console.log('PROTECTOR: Allowed update of href: ', x);
      } else {
        console.error('PROTECTOR: Denied update of href: ', x);
      }
    },
  };
  Object.defineProperty(prototype, 'href', saver_desc);
  a.remove();
})();
