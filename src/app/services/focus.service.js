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

angular.module('services.focus', [])

  .factory('Focus', function($timeout) {
    var focusableQuery ='a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';
    var currentFocusElement, storedFocusElement;

    $('body').on('focusin', function(event) {
      currentFocusElement = $(event.target);
    });

    function setFocus(e) {
      $timeout(function() {
        if(e && typeof e.focus === 'function') {
          e.focus();
        } else if(e && typeof e === 'string') {
          $(e).filter(':visible').first().focus()
        }
      }, 0);
    }

    return {
      setFocus : setFocus,
      focusNext : function() {
        if(currentFocusElement) {
          var focusables = $(focusableQuery).filter(':visible');
          var index = focusables.index(currentFocusElement);

          if(focusables.length > index + 1) {
            setFocus(focusables.get(index + 1));
          }
        }
      },
      storeFocus : function() {
        storedFocusElement = currentFocusElement;
      },
      revertFocus : function() {
        setFocus(storedFocusElement);
      }
    }

  });