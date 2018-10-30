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

angular.module('directives.usefulLinks.editableLink', [
  'directives.usefulLinks',
  'directives.usefulLinks.title',
  'resources.usefulLinks',
  'services.focus'
])

  .constant('closeEditUsefulLinkEvent', 'EXIT_EDIT_USEFUL_LINK_EVENT')

  .directive('editableUsefulLink', function ($rootScope, closeEditUsefulLinkEvent,
    UsefulLinksResource, Focus) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/usefulLinks/usefulLinks.editableLink.html',
      require: '^^usefulLinks',
      transclude: true,
      scope: {
        usefulLink: '=',
        editable: '='
      },
      link: function ($scope, element, attrs, parentCtrl) {
        function setFocusOnEdit() {
          Focus.storeFocus();
          Focus.setFocus(element.find('input[ng-model="usefulLink.description"]'));
        }

        function setFocusOnSave() {
          Focus.revertFocus();
        }

        function exitEditUsefulLink() {
          delete $scope.usefulLink.edit;
          parentCtrl.setEditableOpen(false);
        }

        $scope.editUsefulLink = function () {
          if ($scope.editable) {
            $scope.usefulLink.edit = true;
            $rootScope.$broadcast(closeEditUsefulLinkEvent, $scope.usefulLink);
            setFocusOnEdit();
            parentCtrl.setEditableOpen(true);
          }
        };

        $scope.saveUsefulLink = function () {
          if ($scope.usefulLink.url && $scope.usefulLink.description) {
            UsefulLinksResource
              .update(_.omit($scope.usefulLink, 'edit'))
              .then(function () {
                setFocusOnSave();
                exitEditUsefulLink();
              });
          }
        };

        $rootScope.$on(closeEditUsefulLinkEvent, function (event, link) {
          if (link !== $scope.usefulLink) {
            exitEditUsefulLink();
          }
        });
      }
    };
  });
