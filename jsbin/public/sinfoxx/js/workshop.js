$(function() {
  $('.jsbin-embed').each(function(idx, elem) {
    var $embed = $(elem);
    var id = 'embed-' + idx;
    $embed.attr('id', id);

    $embed.wrap('<div class="jsbin-wrap"></div>');

    $embed = $('#' + id).parent();
    $embed.wrap('<div class="wrap"></div>');

    $embed = $('#' + id).parent();
    $embed.after('<div class="run"><a href="#" class="run btn">Run</a><pre class="result"></pre></div>');

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
  
  var _console = {};
  _console.log = function(what) {
    if (arguments.length > 1) {
      what = [].slice(arguments);
    }
    result.text(what);
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
    console.log('result:', res);
    if (res !== undefined) {
      var text = JSON.stringify(res);
      
      result.text(text);      
    }
  }
}