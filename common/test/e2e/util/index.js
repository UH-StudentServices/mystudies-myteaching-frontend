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

/* eslint-disable */

import { Selector } from 'testcafe';

const LANGUAGES = {
  fi: 'Finnish',
  en: 'English',
  sv: 'Svenska'
};

const PAGE_HEADERS = {
  fi: 'HELSINGIN YLIOPISTO',
  en: 'UNIVERSITY OF HELSINKI',
  sv: 'HELSINGFORS UNIVERSITET'
};

const pageHeaderSelector = (headerText = PAGE_HEADERS.fi) => Selector('h1').withText(headerText);

const loginAsUser = async (t, name, expectedWeekFeedHeader) => {
  const loginAsUserButton = Selector('a.button').withText(name);
  const weekFeedHeader = Selector('h2 span').withText(expectedWeekFeedHeader);

  return await t
    .click(loginAsUserButton)
    .expect(pageHeaderSelector().exists).ok()
    .expect(weekFeedHeader.exists).ok();
};

const openAvatarMenu = async t => t.click(Selector('.user-avatar'));

export const openProfile = async (t, profileLinkText, expectedProfileTitle) => {
  const porfolioLinkSelector = Selector('a').withText(profileLinkText);
  const profileStudiesSelector = Selector('.ui-component__studies');
  const profileLinkSelector = Selector('.profile-intro__title');
  const profileIntroSelector = profileLinkSelector.withText(expectedProfileTitle);

  await openAvatarMenu(t);
  await t
    .click(porfolioLinkSelector)
    .expect(profileIntroSelector.exists).ok()
    .expect(pageHeaderSelector().exists).ok()
    .click(profileLinkSelector)
    .expect(profileStudiesSelector.exists)
    .ok();
};

export const loginAsStudent = async t => {
  const tabs = Selector('ul.tab-set');
  const firstWeekFeedItem = Selector('ul.week-feed-items').child(0);

  loginAsUser(t, 'Olli Opiskelija', 'NYT OPINNOISSANI');
  return t
    .click(tabs.child(2))
    .expect(firstWeekFeedItem.exists).ok();
};
export const loginAsTeacher = async t => loginAsUser(t, 'Olli Opettaja', 'NYT OPETUKSESSANI');

export const loginAndOpenProfile = async (t) => {
  await loginAsStudent(t);
  await openProfile(t, 'Profiili', 'OLLI OPISKELIJA');
};

export const loginAndOpenAcademicProfile = async (t) => {
  await loginAsTeacher(t);
  await openProfile(t, 'Yliopistoprofiili', 'OLLI OPETTAJA');
};

export const changeLanguage = async (langCode, t) => {
  const languageButtonSelector = Selector('button.theme-language').withAttribute('aria-label', LANGUAGES[langCode]);

  return t
    .click(languageButtonSelector)
    .expect(pageHeaderSelector(PAGE_HEADERS[langCode]).exists).ok();
};

