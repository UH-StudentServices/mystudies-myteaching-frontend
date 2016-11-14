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

angular.module('directives.tour', ['services.userSettings', 'utils.browser'])

  .constant('StartTourEvent', 'START_TOUR_EVENT')

  .factory('TourTemplate', function($filter) {

    var translate = function(key) {
      return $filter('translate')(key);
    };

    var startText = _.partial(translate, 'tour.start');
    var skipText = _.partial(translate, 'tour.skip');
    var nextText = _.partial(translate, 'tour.next');
    var finishText = _.partial(translate, 'tour.finish');

    function getElementTemplate(content, isEnd) {
      var tpl = _.template('<div id="pop-over-text" class="popover-text"><%= content %></div>' +
        '<div class="list-of-links theme-dark">' +
        '<a class="skipBtn" aria-label="<%= skipText %>" tabindex="0"></a>' +
        '<a class="btn list-of-links__link nextBtn" tabindex="0"><span><%= nextText %></span></a></div></div>');

      return tpl({
        content: content,
        skipText: skipText(),
        nextText: isEnd ? finishText() : nextText()
      });
    }

    function getTitleTemplate() {
      var tpl = _.template('<div><h3 class="popover-title">{{heading}}</h3>' +
        '<div class="popover-text" ng-bind-html="content"></div>' +
        '<div class="list-of-links theme-dark"><a class="skipBtn" aria-label="<%= skipText %>" tabindex="0">' +
        '</a><a class="btn list-of-links__link nextBtn" tabindex="0"><span><%= startText %></span></a>' +
        '</div></div>');

      return tpl({skipText: skipText(), startText: startText()});
    }

    function getNextButtonText(isEnd) {
      return isEnd ? finishText() : nextText();
    }

    return {
      getTitleTemplate: getTitleTemplate,
      getElementTemplate: getElementTemplate,
      translate: translate,
      getNextButtonText: getNextButtonText
    };
  })

  .factory('TourElementSelectorByMedia', function(BrowserUtil) {
    //This is usable for shared elements between mobile and normal
    function generateSelectorByMedia(selector) {
      if (BrowserUtil.isMobile()) {
        return '.show-mobile-only ' + selector;
      } else {
        return '.hide-mobile-only ' + selector;
      }
    }

    return generateSelectorByMedia;
  })

  .directive('tour', function(StartTourEvent, $rootScope) {
    return {
      restrict: 'E',
      replace: 'true',
      templateUrl: 'app/directives/tour/tour.html',
      scope: {
        config: '=',
        onFinish: '=',
        onSkip: '=',
        startTour: '='
      },
      link: function($scope) {
        $rootScope.$on(StartTourEvent, function() {
          $scope.startTour = true;
        });
      }
    };
  })

  .directive('portfolioTour', function(TourTemplate, $templateCache, UserSettingsService) {

    $templateCache.put('portfolioTourTitleTemplate.html', TourTemplate.getTitleTemplate());

    return {
      restrict: 'E',
      replace: 'true',
      templateUrl: 'app/directives/tour/portfolioTour.html',
      scope: {
        tourDisabled: '='
      },
      link: function($scope) {
        var translate = TourTemplate.translate;

        var config = [
            {
              type: 'title',
              heading: translate('tour.intro.heading'),
              text: translate('tour.intro.text'),
              titleTemplate: 'portfolioTourTitleTemplate.html',
              setNextBtnTextFn: TourTemplate.getNextButtonText
            },
            {
              type: 'element',
              selector: '.tour-element__studies',
              heading: translate('tour.studies.heading'),
              text: translate('tour.studies.text'),
              placement: 'bottom'
            }
        ];

        var commonElementProperties = {
          scroll: true,
          attachToBody: true,
          elementTemplate: TourTemplate.getElementTemplate
        };

        _.each(_.filter(config, {'type': 'element'}),
          function(e) {_.assign(e, commonElementProperties);});

        $scope.config = config;
        UserSettingsService.showPortfolioTour().then(function(show) {
          $scope.startTour = $scope.tourDisabled !== true && show;
        });
        $scope.markAsShown = function() {
          UserSettingsService.markPortfolioTourAsShown();
        };
      }
    };
  })

  .directive('startTour', function($rootScope, StartTourEvent) {
    return {
      restrict: 'E',
      replace: 'true',
      templateUrl: 'app/directives/tour/startTour.html',
      scope: {},
      link: function($scope) {
        $scope.startTour = function() {
          $rootScope.$broadcast(StartTourEvent);
        };
      }
    };
  });
