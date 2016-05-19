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

/**!
 * Add To Homescreen is a javascript widget that opens an overlaying message inviting
 * the user to add the web site/application to the home screen on mobile devices (iOS and Android).
 * It is developed by Matteo Spinelli.
 * http://cubiq.org/add-to-home-screen
 *
 * With this wrapper it can be used as part of an AngularJS app.
 */

angular.module('ngAddToHomescreen', [])
  .factory('ngAddToHomescreen', function($window) {
    var addToHomescreen = $window.addToHomescreen;
    delete $window.addToHomescreen;
    return addToHomescreen;
  });