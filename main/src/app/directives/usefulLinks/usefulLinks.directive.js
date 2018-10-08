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

angular.module('directives.usefulLinks', [
  'resources.usefulLinks',
  'directives.usefulLinks.title',
  'directives.usefulLinks.editableLink',
  'directives.analytics',
  'services.focus',
  'utils.validator'
])

  .constant('pageTitleSearchDebounceDelay', 1000)

  .constant('SearchState', {
    NO_SEARCH: 'NO_SEARCH',
    SEARCHING: 'SEARCHING',
    SHOW_RESULTS: 'SHOW_RESULTS'
  })

  .constant('UsefulLinkType', {
    DEFAULT: 'DEFAULT',
    USER_DEFINED: 'USER_DEFINED'
  })

  .constant('StudentServicesLinks', {
    fi: 'https://guide.student.helsinki.fi/fi/artikkeli/opiskelijaneuvonta',
    sv: 'https://guide.student.helsinki.fi/sv/artikel/studentservicen',
    en: 'https://guide.student.helsinki.fi/article/student-services'
  })

  .constant('HelpdeskLinks', {
    fi: 'http://www.helsinki.fi/helpdesk',
    sv: 'http://www.helsinki.fi/helpdesk/sve/',
    en: 'http://www.helsinki.fi/helpdesk/eng/'
  })

  .filter('renderUsefulLinkDescription', function ($filter) {
    return function (description, type) {
      if (type === 'DEFAULT') {
        return $filter('upperFirst')($filter('translate')(description));
      }
      return description;
    };
  })
  .directive('usefulLinks', function (UsefulLinksResource,
    SearchState,
    pageTitleSearchDebounceDelay,
    UsefulLinkType,
    $rootScope,
    closeEditUsefulLinkEvent,
    Focus,
    AnalyticsService,
    ValidatorUtils,
    StudentServicesLinks,
    HelpdeskLinks) {
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      templateUrl: 'app/directives/usefulLinks/usefulLinks.html',
      link: function ($scope) {
        UsefulLinksResource.getAll().then(function (usefulLinks) {
          $scope.usefulLinks = usefulLinks;
        });

        $scope.SearchState = SearchState;
        $scope.UsefulLinkType = UsefulLinkType;
        $scope.selectedLanguage = $rootScope.selectedLanguage;

        function setSearchState(searchState) {
          $scope.pageTitleSearchState = searchState;
        }

        setSearchState(SearchState.NO_SEARCH);

        $scope.editMode = false;
        $scope.newLink = {};

        $scope.getStudentServicesLink = function () {
          return StudentServicesLinks[$scope.selectedLanguage];
        };

        $scope.getHelpdeskLink = function () {
          return HelpdeskLinks[$scope.selectedLanguage];
        };

        $scope.edit = function () {
          $scope.editMode = true;
        };

        $scope.exitEdit = function () {
          $scope.editMode = false;
          $scope.clearSearch();
          $rootScope.$broadcast(closeEditUsefulLinkEvent, $scope.usefulLink);
        };

        $scope.deleteLink = function (link) {
          UsefulLinksResource.deleteLink(link).then(function () {
            AnalyticsService.trackRemoveUsefulLink();
            Focus.focusNext();
            _.remove($scope.usefulLinks, { id: link.id });
          });
        };

        $scope.clearSearch = function () {
          $scope.newLink.url = '';
          $scope.newLink.description = '';
          setSearchState(SearchState.NO_SEARCH);
        };

        $scope.sortableOptions = {
          containment: '.useful-links__dropzone',
          containerPositioning: 'relative',
          orderChanged: function () {
            UsefulLinksResource.updateOrder(_.map($scope.usefulLinks, 'id'));
          }
        };

        function searchPageTitle(url) {
          var validUrl = ValidatorUtils.convertValidUrl(url);

          if (validUrl) {
            $scope.newLink.url = validUrl;
            setSearchState(SearchState.SEARCHING);
            UsefulLinksResource
              .searchPageTitle(validUrl, function searchPageTitleFail() {
                $scope.newLink.description = validUrl;
              })
              .then(function searchPageTitleSuccess(pageTitleSearchResult) {
                $scope.newLink.description = pageTitleSearchResult.searchResult
                  ? pageTitleSearchResult.searchResult
                  : validUrl;
              })
              .finally(function () {
                setSearchState(SearchState.SHOW_RESULTS);
              });
          }
        }

        $scope.searchPageTitle = _.debounce(searchPageTitle, pageTitleSearchDebounceDelay);

        $scope.addNewUsefulLink = function () {
          var newLink = $scope.newLink;

          if (newLink.url && newLink.description) {
            UsefulLinksResource.save({
              url: newLink.url,
              description: newLink.description
            }).then(function (usefulLink) {
              AnalyticsService.trackAddUsefulLink();
              $scope.usefulLinks.push(usefulLink);
              $scope.clearSearch();
            });
          }
        };
      }
    };
  });
