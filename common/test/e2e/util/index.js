/*
 * This file is part of UniHow application.
 *
 * UniHow application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * UniHow application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with UniHow application.  If not, see <http://www.gnu.org/licenses/>.
 */
import {Selector} from 'testcafe';

const loginAsUser = async (t, name, expectedWeekFeedHeader) => {
  const loginAsUserButton = Selector('a.button').withText(name);
  const weekFeedHeader = Selector('h2 span').withText(expectedWeekFeedHeader);

  return await t
    .click(loginAsUserButton)
    .expect(weekFeedHeader).ok();
};

const openAvatarMenu = async t => t.click(Selector('.user-avatar'));

export const openPortfolio = async (t, portfolioLinkText, expectedPortfolioTitle) => {
  const porfolioLinkSelector = Selector('a').withText(portfolioLinkText);
  const portfolioIntroSelector = Selector('.portfolio-intro__title').withText(expectedPortfolioTitle);

  await openAvatarMenu(t);
  await t
    .click(porfolioLinkSelector)
    .expect(portfolioIntroSelector.exists).ok();
};

export const loginAsStudent = async t => loginAsUser(t, 'Olli Opiskelija', 'NYT OPINNOISSANI');
export const loginAsTeacher = async t => loginAsUser(t, 'Olli Opettaja', 'NYT OPETUKSESSANI');
export const loginAndOpenPortfolio = async (t) => {
  await loginAsStudent(t);
  await openPortfolio(t, 'Portfolio', 'OLLI OPISKELIJA');
};
export const loginAndOpenAcademicPortfolio = async (t) => {
  await loginAsTeacher(t);
  await openPortfolio(t, 'Yliopistoportfolio', 'OLLI OPETTAJA');
};
