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

'use strict';

angular.module('directives.dropdown', [])
  .directive('dropdown', function($document, $parse) {

    var uniqueId = 0;

    return {
      restrict: 'A',
      link: function($scope, element, attrs) {

        function applyCloseCallback() {
          if (attrs.closeCallback) {
            var fn = $parse(attrs.closeCallback);

            fn($scope);
            $scope.$apply();
          }
        }

        function applyOpenCallback() {
          if (attrs.openCallback) {
            var fn = $parse(attrs.openCallback);

            fn($scope);
            $scope.$apply();
          }
        }

        var id = uniqueId++;

        var toggleElement = element.find('.dropdown-toggle');
        var contentElement = element.find('.dropdown-content');

        toggleElement.data('dropdowntoggle' + id, true);
        contentElement.data('dropdowncontent' + id, true);
        contentElement.hide();

        var doToggle = function() {
          console.log('toggle');
          contentElement.toggle();
          toggleElement.toggleClass('active');

          if (toggleElement.hasClass('active')) {
            applyOpenCallback();
          }
        };

        toggleElement.click(doToggle);
        toggleElement.keydown(function(event) {
          if (event.which === 13) {
            doToggle();
          }
        });

        /*
         Some explaining why this check is necessary:
         ng-file-upload library appends an "<input type="file" ngf-select..." element
         to the body when "<a ngf-select..." is used for file upload.
         It then programmatically clicks the "<input type="file" ngf-select..." element
         when a user clicks the "<a ngf-select..." element. This would close the
         dropdown if a user clicks on such link in dropdown content, because the programmatically
         triggered click happens outside dropdown content.
         */
        function isNgfSelectInput(target) {
          return target.attr('ngf-select') !== undefined;
        }

        angular.element($document[0].body).bind('click', function(event) {
          var target = angular.element(event.target);
          var contentClicked = target.inheritedData('dropdowncontent' + id);
          var toggleClicked = target.inheritedData('dropdowntoggle' + id);

          function close() {
            contentElement.hide();
            toggleElement.removeClass('active');
            applyCloseCallback();
          }

          if (contentClicked && attrs.closeOnContentClick !== undefined) {
            close();
          } else if (!contentClicked && !toggleClicked &&
                     contentElement.is(':visible') && !isNgfSelectInput(target)) {
            close();
          }
        });
      }
    };
  });
