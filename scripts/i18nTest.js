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

// Check that i18n files are valid JSON.

var fs = require('fs');
var jsonlint = require('jsonlint');

var files = [
  'main/src/i18n/studies-fi.json',
  'main/src/i18n/studies-sv.json',
  'main/src/i18n/studies-en.json',
  'profile/src/i18n/profile-fi.json',
  'profile/src/i18n/profile-sv.json',
  'profile/src/i18n/profile-en.json'
];

function checkFile(file) {
  var content = fs.readFileSync(file, 'utf-8');
  jsonlint.parse(content);
}

files.forEach(checkFile);

