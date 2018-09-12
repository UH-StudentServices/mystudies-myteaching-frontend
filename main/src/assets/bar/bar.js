/*
 * This file is part of MystudiesMyteaching application.
 *
 * MystudiesMyteaching application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MystudiesMyteaching application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with MystudiesMyteaching application.  If not, see <http://www.gnu.org/licenses/>.
 */

(function($) {

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
    '<nav class="hy-bar__nav">' +
    '<div class="l-top-bar__subregion">' +
    '<ul>' +
    '<li><a href="/" target="_self">etusivu</a></li><li><a href="/coursepages" target="_self">opetus</a></li>' +
    '</ul>' +
    '</div>' +
    '</nav>' +
    '</div>';

  $('.l-header').remove();
  $('.menu-wrapper').remove();

  $('body').prepend(htmlTemplate);

})(window.jQuery);
