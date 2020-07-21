#`Protector.js`

Protector.js is a proof-of-concept script that can be deployed alongside (untrusted) third-party scripts to prevent Click Interception by changed href-attributes of hyperlinks. 

## Threat Model
This script only protects against unwanted changes to links which are made by third-party scripts.

## Usage
This script must be included before any third-party script.
```
<head>
    <!-- Pass a regex in data-allow which defines which values are allowed-->
    <script src="protector.js" data-allow="^shop.html(#[a-z0-9]*)?$"></script>
</head>
<body>
    <a href="shop.html" id="s">Shop</a>
    <!--The bad.js will attempt to change the href of all links.
        It will not be allowed by protector.js-->
    <script src="bad.js"></script>
    <script>
      //This will be allowed by the regex
      s.href = 'shop.html#cart';
    </script>
    <script src="bad.js"></script>
</body>
```

## Idea
`protector.js` overwrites the href attribute setter of the link-prototype.
Now this setter is called on writes like `a.href = "http://b.ad"` and we can discard unwanted changes. This is only a proof of concept and does not protect against other kinds of Click Interception. But we assume that protection against other kinds, such as Interception with Event Handlers, can be implemented similarly.