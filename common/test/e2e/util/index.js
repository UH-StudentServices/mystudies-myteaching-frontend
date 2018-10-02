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

import {Selector} from 'testcafe';

const loginAsUser = async (t, name, expectedWeekFeedHeader) => {
  const loginAsUserButton = Selector('a.button').withText(name);
  const weekFeedHeader = Selector('h2 span').withText(expectedWeekFeedHeader);


  return await t
    .click(loginAsUserButton)
    .expect(weekFeedHeader.exists).ok();
};

const openAvatarMenu = async t => t.click(Selector('.user-avatar'));

export const openPortfolio = async (t, portfolioLinkText, expectedPortfolioTitle) => {
  const porfolioLinkSelector = Selector('a').withText(portfolioLinkText);
  const portfolioStudiesSelector = Selector('.ui-component__studies');
  const portfolioLinkSelector = Selector('.portfolio-intro__title');
  const portfolioIntroSelector = portfolioLinkSelector.withText(expectedPortfolioTitle);


  await openAvatarMenu(t);
  await t
    .click(porfolioLinkSelector)
    .expect(portfolioIntroSelector.exists).ok()
    .click(portfolioLinkSelector)
    .expect(portfolioStudiesSelector.exists).ok();
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
export const loginAndOpenPortfolio = async (t) => {
  await loginAsStudent(t);
  await openPortfolio(t, 'Portfolio', 'OLLI OPISKELIJA');
};
export const loginAndOpenAcademicPortfolio = async (t) => {
  await loginAsTeacher(t);
  await openPortfolio(t, 'Yliopistoportfolio', 'OLLI OPETTAJA');
};
