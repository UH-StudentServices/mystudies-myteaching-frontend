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

import config from '../config';
import { loginAsStudent, changeLanguage } from '../util';

const loginAsStudentInFinnishAndChangeLanguage = async (langCode, t) => {
  await loginAsStudent(t);
  return changeLanguage(langCode, t);
};

fixture('My Studies')
  .page(config.myStudiesBaseUrl);

test('My Studies page opens', t => loginAsStudent(t));

test('Language is changed to English', t => loginAsStudentInFinnishAndChangeLanguage('en', t));

test('Language is changed to Swedish', t => loginAsStudentInFinnishAndChangeLanguage('sv', t));

