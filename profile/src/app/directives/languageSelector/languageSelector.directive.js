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

angular.module('directives.languageSelector', [
  'services.profile',
  'services.profileRole',
  'services.session',
  'directives.popover'
])

  .directive('languageSelector', function ($q, $window, $state, $translate, ProfileService,
    ProfileRoleService, SessionService) {
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      templateUrl: 'app/directives/languageSelector/languageSelector.html',
      link: function (scope) {
        var supportedLangs = ['en', 'fi', 'sv'];
        var role = ProfileRoleService.getActiveRole();
        var profile;
        var session;

        function canCreateRoleProfileInLang(lang) {
          return Object.keys(session.profilePathsByRoleAndLang[role]).indexOf(lang) === -1;
        }

        function togglePopover() {
          scope.displayPopover = !scope.displayPopover;
        }

        function closePopover() {
          scope.displayPopover = false;
        }

        function confirm() {
          // use of _.defer is warranted since otherwise ngIf will
          // kick in before angular-click-outside which would
          // close the popover instead of presenting the user with a different dialog
          _.defer(function () {
            scope.hasConfirmed = true;
            scope.$apply();
          });
        }

        function hasMultipleProfiles(userSession) {
          return Object.keys(userSession.profilePathsByRoleAndLang[role]).length > 1;
        }

        function createAndSwitchToNewProfile(lang) {
          ProfileService.createProfile(role, lang).then(function (newProfile) {
            $window.location.href = newProfile.url;
          });
        }

        function switchToProfileInLang(lang) {
          if (canCreateRoleProfileInLang(lang)) {
            createAndSwitchToNewProfile(lang);
          } else {
            $translate.fallbackLanguage(lang);
            $state.go('profile', { lang: lang });
          }
        }

        function translateCurrentLang(lang) {
          return $translate.instant(['languages', 'code', lang].join('.'));
        }

        $q.all([ProfileService.getProfile(), SessionService.getSession()])
          .then(function (data) {
            profile = data[0];
            session = data[1];

            _.assign(scope, {
              currentLang: profile.lang,
              translatedLang: translateCurrentLang(profile.lang),
              supportedLangs: supportedLangs,
              availableLangs: supportedLangs.filter(canCreateRoleProfileInLang),
              hasOnlyOneProfile: !hasMultipleProfiles(session),
              togglePopover: togglePopover,
              closePopover: closePopover,
              confirm: confirm,
              createAndSwitchToNewProfile: createAndSwitchToNewProfile,
              switchToProfileInLang: switchToProfileInLang
            });
          });
      }
    };
  });
