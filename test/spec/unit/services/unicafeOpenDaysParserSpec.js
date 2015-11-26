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

describe('UnicafeOpenDaysParser', function(){

  var UnicafeOpenDaysParser;

  var unicafeDataRegular = {
    information : {
      business : {
        exception : [
          {from : '1.6',
           to : '30.8',
           closed : false}],
        regular : [
          {when : ['Ma', 'Ti', 'Ke', 'To', false, false, false]},
          {when : ['previous', 'previous', 'previous', 'previous', 'Pe', false, false]}
        ]
      }
    }
  };

  var unicafeDataException = {
    information : {
      business : {
        exception : [
          {from : '1.6',
            to : '30.8',
            closed : true}],
        regular : [
          {when : ['Ma', 'Ti', 'Ke', 'To', false, false, false]},
          {when : ['previous', 'previous', 'previous', 'previous', 'Pe', false, false]}
        ]
      }
    }
  };

  beforeEach(module('directives.favorites.unicafe'));

  beforeEach(inject(function(_UnicafeOpenDaysParser_) {
    UnicafeOpenDaysParser = _UnicafeOpenDaysParser_;
  }));

  it('Should show the restaurant is regularly open from monday to friday', function() {
    _.each(['17.8', '18.8', '19.8', '20.8', '21.9'], function (d) {
      expect(UnicafeOpenDaysParser.isRestaurantClosed(unicafeDataRegular, moment(d, 'DD.M'))).toEqual(false);
    })
  });

  it('Should show the restaurant is regularly closed from saturday to sunday', function() {
    _.each(['22.8', '23.8'], function(d){
      expect(UnicafeOpenDaysParser.isRestaurantClosed(unicafeDataRegular, moment(d, 'DD.M'))).toEqual(true);
    })
  });

  it('Should show the restaurant is closed by exception during 1.6 - 30.8', function() {
    expect(UnicafeOpenDaysParser.isRestaurantClosed(unicafeDataException, moment('20.8', 'DD.M'))).toEqual(true);
  });
});