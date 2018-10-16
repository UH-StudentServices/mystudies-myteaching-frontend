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

const git = require('git-rev-sync');
const fs = require('fs');
const path = require('path');

const gitInfoFile = path.join(__dirname, '..', 'main/dist/version-info.json');

const getGitInfo = () => ({
  git: {
    commit: {
      id: git.short(),
      time: git.date()
    },
    branch: git.branch()
  }
});

// eslint-disable no-console
const writeGitInfo = () => {
  fs.writeFile(gitInfoFile, JSON.stringify(getGitInfo()), 'utf-8', (err) => {
    if (err) {
      console.error(`Can't write file to ${gitInfoFile}`);
      return;
    }
    console.info(`Git info written to ${gitInfoFile}`);
  });
};

writeGitInfo();
