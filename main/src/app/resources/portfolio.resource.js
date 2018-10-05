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

angular.module('resources.portfolio', ['services.state'])

  .factory('PortfolioResource', function ($resource) {
    var studentPortfolioResource = $resource('/api/private/v1/portfolio/student');


    var teacherPortfolioResource = $resource('/api/private/v1/portfolio/teacher');

    function createPortfolio(resource) {
      return resource.save().$promise;
    }

    function getPortfolio(resource) {
      return resource.get().$promise;
    }

    return {
      createStudentPortfolio: _.partial(createPortfolio, studentPortfolioResource),
      getStudentPortfolio: _.partial(getPortfolio, studentPortfolioResource),
      createTeacherPortfolio: _.partial(createPortfolio, teacherPortfolioResource),
      getTeacherPortfolio: _.partial(getPortfolio, teacherPortfolioResource)
    };
  });
