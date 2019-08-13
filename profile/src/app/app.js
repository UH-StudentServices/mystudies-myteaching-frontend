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

angular.module('opintoniProfileApp', [
  'ui.router',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'ngAria',
  'ngEmbed',
  'pascalprecht.translate',
  'angular-google-analytics',
  'ui.utils',
  'profileAnalytics',
  'profileErrors',
  'profileLanders',
  'angular-click-outside',
  'as.sortable',
  'templates',

  'constants.profileTabs',

  'provider.analyticsAccounts',

  'controllers.main',
  'controllers.tinymce',

  'directives.visibility',
  'directives.attainments',
  'directives.pageHeader',
  'directives.pageFooter',
  'directives.intro',
  'directives.menuLanguage',
  'directives.currentLang',
  'directives.studies',
  'directives.contactInformation',
  'directives.focus',
  'directives.editableHeading',
  'directives.degrees',
  'directives.workExperience',
  'directives.samples',
  'directives.navigation',
  'directives.dropdown',
  'directives.avatarImage',
  'directives.printButton',
  'directives.previewButton',
  'directives.previewMessage',
  'directives.freeTextContent',
  'directives.addFreeText',
  'directives.languageProficiencies',
  'directives.feedback',
  'directives.popover',
  'directives.cookieNotification',
  'directives.tabSet',
  'directives.stickyMessage',
  'directives.accordion',
  'directives.languageSelector',
  'directives.notifications',
  'directives.browseFiles',
  'directives.sharedLinks',
  'directives.obar',
  'directives.enableEdit',
  'directives.editModeButtons',
  'directives.logoutLink',
  'dialog.verificationDialog',

  'filters.formatting',

  'services.session',
  'services.language',
  'services.state',
  'services.userSettings',
  'services.profile',
  'services.keyword',
  'services.configuration',
  'services.profileRole',
  'services.scriptInjector',
  'services.stylesheetInjector',
  'services.preview',
  'services.freeTextContent',
  'services.profileFiles',
  'services.sharedLinks',
  'services.obar',
  'services.notifications',

  'resources.session',

  'utils.moment'
])

  .config(function (
    $stateProvider,
    $urlRouterProvider,
    $translateProvider,
    $locationProvider,
    $compileProvider,
    $qProvider,
    $sceDelegateProvider
  ) {
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/');

    $compileProvider.debugInfoEnabled(false);

    $qProvider.errorOnUnhandledRejections(false);

    function profileSession(SessionService) {
      return SessionService.getSession(true);
    }

    function profileUserSettings(StateService, State, UserSettingsService, state) {
      if (state === State.PRIVATE) {
        return UserSettingsService.getUserSettings();
      }
      return undefined;
    }

    $stateProvider.state('profileRoot', {
      url: '/',
      controller: 'MainCtrl',
      resolve: {
        session: profileSession,
        state: function (StateService) {
          return StateService.resolve();
        },
        profile: function (ProfileService,
          ProfileRoleService,
          LanguageService,
          $state,
          session) {
          var role = ProfileRoleService.getActiveRole();
          var currentLang = LanguageService.getCurrent();
          var profilePathsForRole;
          var profilePath;
          var lang;
          var userpath;

          if (!session) {
            $state.go('anonymousUser', null, { location: 'replace' });
          }

          profilePathsForRole = session.profilePathsByRoleAndLang[role];

          if (profilePathsForRole) {
            profilePath = (profilePathsForRole[currentLang] || profilePathsForRole[0])[0].split('/').slice(1);
            lang = profilePath[0];
            userpath = profilePath[1];
            $state.go('profile', { lang: lang, userpath: userpath }, { location: 'replace' });
          } else {
            ProfileService.createProfile(role, currentLang).then(function (response) {
              lang = response.lang;
              userpath = response.url.split('/').pop();

              $state.go('profile', { lang: lang, userpath: userpath }, { location: 'replace' });
            });
          }
        }
      }
    }).state('profileBySharedLink', {
      url: '/:sharedlink',
      templateUrl: 'app/partials/_profile.html',
      controller: 'MainCtrl',
      resolve: {
        session: profileSession,
        state: function (StateService) {
          return StateService.resolve();
        },
        userSettings: profileUserSettings,
        profile: function (ProfileService,
          FreeTextContentService,
          $location,
          $state,
          $stateParams,
          session,
          state,
          $translate) {
          $translate.fallbackLanguage('fi');

          return ProfileService.findProfileBySharedLink($stateParams.sharedlink)
            .catch(function findProfileFail(error) {
              if (error.status === 404) {
                if (session) {
                  $state.go('notFound');
                } else {
                  $state.go('loginNeeded', { originalUrl: $location.absUrl() });
                }
              }
            })
            .finally(function () {
              FreeTextContentService.initCache();
            });
        }
      }
    }).state('profile', {
      url: '/:lang/:userpath',
      templateUrl: 'app/partials/_profile.html',
      controller: 'MainCtrl',
      resolve: {
        session: profileSession,
        state: function (StateService, $stateParams, session) {
          return StateService.resolve(session, $stateParams.lang, $stateParams.userpath);
        },
        userSettings: profileUserSettings,
        profile: function (ProfileService,
          FreeTextContentService,
          $location,
          $state,
          $stateParams,
          session,
          state,
          $translate) {
          $translate.fallbackLanguage($stateParams.lang);
          return ProfileService.findProfileByPath(
            state,
            $stateParams.lang,
            $stateParams.userpath
          )
            .catch(function findProfileFail(error) {
              if (error.status === 404) {
                if (session) {
                  $state.go('notFound', { location: 'replace' });
                } else {
                  $state.go('loginNeeded', { originalUrl: $location.absUrl() }, { location: 'replace' });
                }
              }
            })
            .finally(function () {
              FreeTextContentService.initCache();
            });
        }
      }
    }).state('files', {
      url: '/files',
      templateUrl: 'app/partials/_files.html'
    })
      .state('links', {
        url: '/links',
        templateUrl: 'app/partials/_shared_links.html'
      });

    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      // Allow loading from embed.ly.
      'https://api.embed.ly/1/oembed**'
    ]);
  })

  .run(function ($rootScope,
    $window,
    LanguageService,
    Configuration,
    AnalyticsService,
    StateService,
    State) {
    var language = LanguageService.getCurrent();

    $rootScope.selectedLanguage = language;
    $rootScope.useObar = Configuration.obarBaseUrl
      && StateService.getStateFromDomain() === State.MY_STUDIES;

    moment.locale(language);
    $window.FastClick.attach($window.document.body);

    AnalyticsService.trackPageView();
  });
