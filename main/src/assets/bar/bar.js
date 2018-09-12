(function() {

  var htmlTemplate =
    '<div class="hy-bar">' +
    '<div class="l-top-bar">' +
    '<div class="l-top-bar__subregion">' +
    '<div class="l-top-bar__main">' +
    '<a class="logo" href="/fi">' +
    '<h1 class="logo__sitename">Opintoni</h1>' +
    '</a>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<nav class="hy-bar__nav"><div class="l-top-bar__subregion"><ul><li><a href="/">etusivu</a></li><li><a href="/coursepages">opetus</a></li></ul></div></nav>' +
    '</div>';

  $('body').prepend(htmlTemplate);

})();
