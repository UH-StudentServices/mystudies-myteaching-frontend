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

var util = require('./util');

describe('Frontpage', function(){

  function siteNameFinder(siteName) {
    return element(by.cssContainingText('h1', siteName));
  }

  it('Will load the my studies frontpage', function() {
    util.loginStudent();
    expect(siteNameFinder('My studies').isPresent()).toEqual(true);
  });
  it('Will load the teaching frontpage', function() {
    util.loginTeacher();
    expect(siteNameFinder('My teaching').isPresent()).toEqual(true);
  });
  //TODO: Fix Unstability with phantomJS.
  /*it('Will load the my studies frontpage by default for hybrid user and hybrid user is able to switch to teacher page', function() {
    util.loginHydridUser();
    expect(siteNameFinder('My studies').isPresent()).toEqual(true);
    element(by.cssContainingText('option', 'My teaching')).click();

    browser.wait(function(){
      return siteNameFinder('My teaching').isPresent();
    }, 10000);

    expect(siteNameFinder('My teaching').isPresent()).toEqual(true);
  });*/
});