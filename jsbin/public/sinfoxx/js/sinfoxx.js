var app = angular.module('sinfoxx', []);
app.config(function($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {templateUrl: 'pages/index.html'}).
    when('/javascript', {templateUrl: 'pages/javascript.html'}).
    when('/consola', {templateUrl: 'pages/consola.html'}).
    when('/dynamic-typing', {templateUrl: 'pages/dynamic-typing.html'});
});


app.run(function($rootScope) {
  $rootScope.$on('$viewContentLoaded', jsbinify);
});


function jsbinify() {

  (function (window, document, undefined) {


  /*!
    * domready (c) Dustin Diaz 2012 - License MIT
    */
  !function (name, definition) {
    if (typeof module != 'undefined') module.exports = definition()
    else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
    else this[name] = definition()
  }('domready', function (ready) {

    var fns = [], fn, f = false
      , doc = document
      , testEl = doc.documentElement
      , hack = testEl.doScroll
      , domContentLoaded = 'DOMContentLoaded'
      , addEventListener = 'addEventListener'
      , onreadystatechange = 'onreadystatechange'
      , readyState = 'readyState'
      , loaded = /^loade|c/.test(doc[readyState])

    function flush(f) {
      loaded = 1
      while (f = fns.shift()) f()
    }

    doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
      doc.removeEventListener(domContentLoaded, fn, f)
      flush()
    }, f)


    hack && doc.attachEvent(onreadystatechange, fn = function () {
      if (/^c/.test(doc[readyState])) {
        doc.detachEvent(onreadystatechange, fn)
        flush()
      }
    })

    return (ready = hack ?
      function (fn) {
        self != top ?
          loaded ? fn() : fns.push(fn) :
          function () {
            try {
              testEl.doScroll('left')
            } catch (e) {
              return setTimeout(function() { ready(fn) }, 50)
            }
            fn()
          }()
      } :
      function (fn) {
        loaded ? fn() : fns.push(fn)
      })
  });

  // ---- here begins the jsbin embed - based on the embedding doc: https://github.com/remy/jsbin/blob/master/docs/embedding.md

  var innerText = document.createElement('i').innerText === undefined ? 'textContent' : 'innerText';

  // 1. find all links with class=jsbin
  function getLinks() {
    var links = [], alllinks, i = 0, length;
    alllinks = document.getElementsByTagName('a');
    console.log('alllinks:', alllinks);
    length = alllinks.length;
    for (; i < length; i++) {
      console.log('alllinks[i].className:', alllinks[i].className);
      if ((' ' + alllinks[i].className).indexOf(' jsbin-') !== -1) {
        links.push(alllinks[i]);
      }
    }

    return links;
  }

  function findCodeInParent(element) {
    var match = element;

    while (match = match.previousSibling) {
      console.log(match.nodeName);
      if (match.nodeName === 'PRE') {
        break;
      }
      if (match.getElementsByTagName) {
        match = match.getElementsByTagName('pre');
        if (match.length) {
          match = match[0]; // only grabs the first
          break;
        }
      }
    }

    if (match) return match;

    match = element.parentNode.getElementsByTagName('pre');

    if (!match.length) {
      if (element.parentNode) {
        return findCodeInParent(element.parentNode);
      } else {
        return null;
      }
    }

    return match[0];
  }

  function findCode(link) {
    var rel = link.rel,
        query = link.search.substring(1),
        element,
        code,
        panels = [];

    if (rel && (element = document.getElementById(rel.substring(1)))) {
      code = element[innerText];
    // else - try to support multiple targets for each panel...
    // } else if (query.indexOf('=') !== -1) {
    //   // assumes one of the panels points to an ID
    //   query.replace(/([^,=]*)=([^,=]*)/g, function (all, key, value) {
    //     code = document.getElementById(value.substring(1))[innerText];

    //   });
    } else {
      // go looking through it's parents
      element = findCodeInParent(link);
      if (element) {
        code = element[innerText];
      }
    }

    return code;
  }

  function detectLanguage(code) {
    var htmlcount = (code.split("<").length - 1),
        csscount = (code.split("{").length - 1),
        jscount = (code.split(".").length - 1);

    if (htmlcount > csscount && htmlcount > jscount) {
      return 'html';
    } else if (csscount > htmlcount && csscount > jscount) {
      return 'css';
    } else {
      return 'javascript';
    }
  }

  function scoop(link) {
    var code = findCode(link),
        language = detectLanguage(code),
        query = link.search.substring(1);

    if (language === 'html' && code.toLowerCase().indexOf('<html') === -1) {
      // assume this is an HTML fragment - so try to insert in the %code% position
      language = 'code';
    }

    if (query.indexOf(language) === -1) {
      query += ',' + language + '=' + encodeURIComponent(code);
    } else {
      query = query.replace(language, language + '=' + encodeURIComponent(code));
    }

    link.search = '?' + query;
  }

  function embed(link) {
    var iframe = document.createElement('iframe'),
        resize = document.createElement('div');
    iframe.src = link.href;
    iframe.className = 'jsbin-embed';
    iframe.style.border = '1px solid #aaa';
    iframe.style.width = '100%';
    iframe.style.minHeight = '300px';
    link.parentNode.replaceChild(iframe, link);

    var onmessage = function (event) { 
      event || (event = window.event);
      iframe.style.height = event.data.height + 'px';
    };

    if (window.addEventListener) {
      window.addEventListener('message', onmessage, false);
    } else {
      window.attachEvent('onmessage', onmessage);
    }
  }

  domready(function () {
    console.log('domready');
    // 2. process link based on subclass - jsbin-scoop to start with
    var links = getLinks(),
        i = 0,
        length = links.length,
        className = '';

    console.log('links:', links);

    for (; i < length; i++) {
      className = ' ' + links[i].className + ' ';
      if (className.indexOf(' jsbin-scoop ') !== -1) {
        scoop(links[i]);
      } else if (className.indexOf(' jsbin-embed ') !== -1) {
        embed(links[i]);
      }
    }

    $(function() {
      $('.jsbin-embed').each(function(idx, elem) {
        var $embed = $(elem);
        var id = 'embed-' + idx;
        $embed.attr('id', id);

        $embed.wrap('<div class="jsbin-wrap"></div>');

        $embed = $('#' + id).parent();
        $embed.wrap('<div class="wrap"></div>');

        $embed = $('#' + id).parent();
        $embed.after('<div class="run"><a href="#" class="run btn">Run</a><div class="result"></div></div>');

        $embed = $('#' + id);

        var $cont = $embed.parent().parent();
        var $result = $cont.find('.result');

        var iframe = document.getElementById(id);
        $cont.find('.run').click(function() {
          run(iframe, $result);
          return false;
        });
      });  
    });


    function wrapCode(code) {
      if (code.indexOf('\n') === -1 && code.indexOf('return') === -1) code = 'return ' + code;
      return ';(function(window, document, console, undefined) {' + code + '})(window, document, _console);';
    }

    function run(embed, result) {
      
      var consoled = false;

      function printResult(res) {
        if (res === undefined) return;
        if (! consoled) result.text('');
        var text;
        if (typeof res == 'function') {
          text = res.toString();
        } else if (res !== undefined) {
          text = JSON.stringify(res);
        }
        if (consoled) {
          text = result.html() + '<br />' + text;
        }
        text += ' (' + typeof res + ')';
        result.html(text);
      }

      var _console = {};
      _console.log = function(what) {
        if (arguments.length > 1) {
          what = [].slice(arguments);
        }
        printResult(what);
        consoled = true;
      }

      result.text('Running...');
      var _iframe = embed.contentWindow || embed.window;
      console.log(_iframe);
      var code = _iframe.jsbin.panels.panels.javascript.getCode();

      code = wrapCode(code);
      
      var err;
      var res;
      try {
        res = eval(code);
      } catch(er) {
        err = er;
      }
      if (err) {
        console.log(err);
        result.text('Error: ' + err.message);
      } else {
        printResult(res);
      }
    }
  });

  }(this, document));
}