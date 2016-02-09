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

angular.module('directives.tour', ['services.userSettings', 'utils.browser', 'opintoniDialog'])

  .constant('StartTourEvent', 'START_TOUR_EVENT')

  .factory('TourTemplate', function($filter) {

    var translate = function(key) {
          return $filter('translate')(key);
        },
        startText = _.partial(translate, 'tour.common.start'),
        skipText = _.partial(translate, 'tour.common.skip'),
        nextText = _.partial(translate, 'tour.common.next'),
        finishText = _.partial(translate, 'tour.common.finish');

    function getElementTemplate(content, isEnd) {
      var tpl = _.template('<div id="pop-over-text" class="popover-text"><%= content %></div>' +
        '<a class="skipBtn" aria-label="<%= skipText %>"></a><ul class="list-of-links--dark">' +
        '<li><a class="nextBtn"><span><%= nextText %></span></a></li></ul></div></div>');

      return tpl({
        content: content, skipText: skipText(), nextText: isEnd ? finishText() : nextText()
      });
    }

    function getTitleTemplate() {
      var tpl = _.template('<div><h3 class="popover-title">{{heading}}</h3>' +
        '<a class="skipBtn" aria-label="<%= skipText %>"></a>' +
        '<div class="popover-text" ng-bind-html="content"></div><ul class="list-of-links--dark">' +
        '<li><a class="nextBtn"><span><%= startText %></span></a></li></ul></div>');

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

  .service('TourElementSelectorByMedia', function(BrowserUtil) {
    //This is usable for shared elements between mobile and normal
    function generateSelectorByMedia(selector) {
      if(BrowserUtil.isMobile()) {
        return '.show-mobile-only ' + selector;
      } else {
        return '.hide-mobile-only ' + selector;
      }
    }

    return generateSelectorByMedia;
  })

  .directive('tour', function(StartTourEvent, $rootScope, $timeout, Dialog) {
    return {
      restrict: 'E',
      replace: 'true',
      templateUrl: 'app/directives/header/userMenu/tour/tour.html',
      scope: {
        config: '=',
        onFinish: '=',
        onSkip: '=',
        startTour: '='
      },
      link: function($scope) {
        function clickInsidePopover(event, popoverElement) {
          var offset = popoverElement.offset(),
              width = popoverElement.width(),
              height = popoverElement.height();

          return event.pageX >= offset.left &&
            event.pageX <= offset.left + width && event.pageY >= offset.top &&
            event.pageY <= offset.top + height;
        }

        function showEndTourDialog() {
          Dialog.modalDialog(
            'tour.common.closeConfirm',
            'general.yes',
            'general.no',
            function okCallback() {
              $scope.startTour = false;
            });
        }

        $rootScope.$on(StartTourEvent, function() {
          $scope.startTour = true;
        });

        $('body').on('click', '#ng-curtain', showEndTourDialog);
      }
    };
  })

  .directive('studentTour', function(TourTemplate, $templateCache, UserSettingsService,
                                     TourElementSelectorByMedia) {

    $templateCache.put('studentTourTitleTemplate.html', TourTemplate.getTitleTemplate());

    return {
      restrict: 'E',
      replace: 'true',
      templateUrl: 'app/directives/header/userMenu/tour/studentTour.html',
      link: function($scope) {
        var translate = TourTemplate.translate;

        var config = [
            {
              type: 'title',
              heading: translate('tour.student.intro.heading'),
              text: translate('tour.student.intro.text'),
              titleTemplate: 'studentTourTitleTemplate.html',
              setNextBtnTextFn: TourTemplate.getNextButtonText
            },
            {
              type: 'element',
              selector: TourElementSelectorByMedia('.tour-element__search'),
              heading: translate('tour.common.search.heading'),
              text: translate('tour.common.search.text'),
              placement: 'bottom'
            },
            {
              type: 'element',
              selector: TourElementSelectorByMedia('.tour-element__notifications'),
              heading: translate('tour.common.notifications.heading'),
              text: translate('tour.common.notifications.text'),
              placement: 'bottom'
            },
            {
              type: 'element',
              selector: TourElementSelectorByMedia('.new-todo-item'),
              heading: translate('tour.common.todoItems.heading'),
              text: translate('tour.common.todoItems.text'),
              placement: 'bottom'
            },
            {
              type: 'element',
              selector: '#week-feed',
              heading: translate('tour.student.weekFeed.heading'),
              text: translate('tour.student.weekFeed.text'),
              placement: 'top'
            },
            {
              type: 'element',
              selector: '#useful-links',
              heading: translate('tour.common.usefulLinks.heading'),
              text: translate('tour.common.usefulLinks.text'),
              placement: 'bottom'
            },
            {
              type: 'element',
              selector: '#favorites',
              heading: translate('tour.common.favorites.heading'),
              text: translate('tour.common.favorites.text'),
              placement: 'top'
            }
        ];

        var commonElementProperties = {
          scroll: true,
          attachToBody: true,
          elementTemplate: TourTemplate.getElementTemplate
        };

        _.each(_.filter(config, {'type': 'element'}), function(e) {
          _.assign(e, commonElementProperties);
        });

        $scope.config = config;
        UserSettingsService.showMyStudiesTour().then(function(show) {
          $scope.startTour = show;
        });

        $scope.markAsShown = UserSettingsService.markStudentTourShown;
      }
    };
  })

  .directive('teacherTour', function(TourTemplate, $templateCache, UserSettingsService,
                                     TourElementSelectorByMedia) {

    $templateCache.put('teacherTourTitleTemplate.html', TourTemplate.getTitleTemplate());

    return {
      restrict: 'E',
      replace: 'true',
      templateUrl: 'app/directives/header/userMenu/tour/teacherTour.html',
      link: function($scope) {

        var translate = TourTemplate.translate;

        var config = [
            {
              type: 'title',
              heading: translate('tour.teacher.intro.heading'),
              text: translate('tour.teacher.intro.text'),
              titleTemplate: 'teacherTourTitleTemplate.html',
              setNextBtnTextFn: TourTemplate.getNextButtonText
            },
            {
              type: 'element',
              selector: TourElementSelectorByMedia('.tour-element__search'),
              heading: translate('tour.common.search.heading'),
              text: translate('tour.common.search.text'),
              placement: 'bottom',
              attachToBody: true
            },
            {
              type: 'element',
              selector: TourElementSelectorByMedia('.tour-element__notifications'),
              heading: translate('tour.common.notifications.heading'),
              text: translate('tour.common.notifications.text'),
              placement: 'bottom'
            },
            {
              type: 'element',
              selector: TourElementSelectorByMedia('.new-todo-item'),
              heading: translate('tour.common.todoItems.heading'),
              text: translate('tour.common.todoItems.text'),
              placement: 'bottom'
            },
            {
              type: 'element',
              selector: '#week-feed',
              heading: translate('tour.teacher.weekFeed.heading'),
              text: translate('tour.teacher.weekFeed.text'),
              placement: 'top'
            },
            {
              type: 'element',
              selector: '#useful-links',
              heading: translate('tour.common.usefulLinks.heading'),
              text: translate('tour.common.usefulLinks.text'),
              placement: 'bottom'
            },
            {
              type: 'element',
              selector: '#favorites',
              heading: translate('tour.common.favorites.heading'),
              text: translate('tour.common.favorites.text'),
              placement: 'top'
            }
        ];

        var commonElementProperties = {
          scroll: true,
          attachToBody: true,
          elementTemplate: TourTemplate.getElementTemplate
        };

        _.each(_.filter(config, {'type': 'element'}), function(e) {
          _.assign(e, commonElementProperties);
        });

        $scope.config = config;

        UserSettingsService.showMyTeachingTour().then(function(show) {
          $scope.startTour = show;
        });

        $scope.markAsShown = UserSettingsService.markTeacherTourShown;
      }
    };
  })

  .directive('startTour', function($rootScope, StartTourEvent, AnalyticsService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        startTourText: '@'
      },
      templateUrl: 'app/directives/header/userMenu/tour/startTour.html',
      controller: function($scope) {
        $scope.startTour = function() {
          AnalyticsService.trackStartTour();
          $rootScope.$broadcast(StartTourEvent);
        };
      }
    };
  });
