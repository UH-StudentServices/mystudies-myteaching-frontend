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

angular.module('directives.skillsAndExpertise', [
  'services.skillsAndExpertise',
  'constants.ngEmbedOptions',
  'portfolioAnalytics'
])
  .directive('skillsAndExpertise', function(SkillsAndExpertiseService,
                                            VerificationDialog,
                                            PreviewService,
                                            NG_EMBED_OPTIONS,
                                            AnalyticsService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/directives/skillsAndExpertise/skillsAndExpertise.html',
      scope: {
        portfolioId: '@',
        portfolioLang: '@',
        sectionName: '@',
        skillsAndExpertise: '='
      },
      link: function(scope) {

        function trackIfNeeded(oldText, newText) {
          var host = window.location.hostname;

          // <a href="https://student.helsinki.fi/api/public/v1/portfolio/files/olli-opiskelija/some.file">lalala</a>
          // eslint-disable-next-line max-len
          var hostedFilesRe = new RegExp('<a href="https?://' + host + '.*/api/(?:public|private)/v1/portfolio/files.*">.*</a>', 'gim');
          var imageRe = /((?:https?|ftp|file):\/\/\S*\.(?:gif|jpg|jpeg|tiff|png|svg|webp)(\?([\w=&_%\-]*))?)/gi;
          // eslint-disable-next-line max-len
          var linksRe = /(?:^|[^"'])(?:(https?|ftp|file):\/\/|www\.)[-A-Z0-9+()&@$#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]/gi;

          function getOtherLinks(text) {
            text = text.replace(imageRe, '');
            text = text.replace(hostedFilesRe, '');
            return text.match(linksRe);
          }
          function getHostedFiles(text) {
            return text.match(hostedFilesRe);
          }
          function getImages(text) {
            return text.match(imageRe);
          }

          AnalyticsService.trackEventIfAdded(getHostedFiles(oldText), getHostedFiles(newText),
            AnalyticsService.ec.SKILLS_AND_EXPERTISE, AnalyticsService.ea.ADD_FILE);
          AnalyticsService.trackEventIfAdded(getImages(oldText), getImages(newText),
            AnalyticsService.ec.SKILLS_AND_EXPERTISE, AnalyticsService.ea.ADD_IMAGE);
          AnalyticsService.trackEventIfAdded(getOtherLinks(oldText), getOtherLinks(newText),
            AnalyticsService.ec.SKILLS_AND_EXPERTISE, AnalyticsService.ea.ADD_LINK);
        }

        _.assign(scope, {
          toggleEdit: function() {
            scope.isEditing = true;
            scope.origText = scope.skillsAndExpertiseItem.text;
          },
          exitEdit: function() {
            scope.$broadcast('saveComponent');

            trackIfNeeded(scope.origText, scope.skillsAndExpertiseItem.text);

            var updateSkillsAndExpertiseRequest = {
              skillsAndExpertise: scope.skillsAndExpertiseItem.text
            };

            SkillsAndExpertiseService.update(updateSkillsAndExpertiseRequest)
              .then(scope.isEditing = false);

            return true;
          },
          embedOptions: NG_EMBED_OPTIONS,
        });

        function init() {
          scope.skillsAndExpertiseItem = {text: scope.skillsAndExpertise || ''};
        }

        init();
      }
    };
  });
