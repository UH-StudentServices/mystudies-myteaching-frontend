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

'use strict';

angular.module('services.freeTextContent', ['resources.freeTextContent', 'services.profile'])

  .factory('FreeTextContentService', function (ProfileService, FreeTextContentResource) {
    var Rx = window.Rx;
    var freeTextContentSubject;
    var initialDataPromise;
    var cachedFreeTextContent = [];

    function publish(freeTextContentItems) {
      freeTextContentSubject.onNext(freeTextContentItems);

      return freeTextContentItems;
    }

    function initCache() {
      initialDataPromise = ProfileService.getProfile()
        .then(_.partialRight(_.get, 'freeTextContent', []))
        .then(function (freeTextContentItems) {
          cachedFreeTextContent = freeTextContentItems;
          freeTextContentSubject = new Rx.BehaviorSubject(cachedFreeTextContent);
          return freeTextContentItems;
        }).then(publish);
    }

    function getFreeTextContentSubject() {
      return freeTextContentSubject;
    }

    function getProfileId() {
      return ProfileService.getProfile().then(_.property('id'));
    }

    function updateCache(freeTextContent, visibilityDescriptor, remove) {
      if (_.find(cachedFreeTextContent, ['id', freeTextContent.id])) {
        cachedFreeTextContent = remove
          ? _.differenceBy(cachedFreeTextContent, [freeTextContent], 'id')
          : _.unionBy([freeTextContent], cachedFreeTextContent, 'id');
      } else {
        cachedFreeTextContent = cachedFreeTextContent.concat(freeTextContent);
      }

      return cachedFreeTextContent;
    }

    function getInitialData() {
      return initialDataPromise;
    }

    function insertFreeTextContent(freeTextContent, visibilityDescriptor) {
      return getProfileId().then(function (profileId) {
        return FreeTextContentResource.insertFreeTextContent(profileId, freeTextContent);
      }).then(function (ftc) {
        return updateCache(ftc, visibilityDescriptor);
      }).then(publish);
    }

    function updateFreeTextContent(freeTextContent, visibilityDescriptor) {
      return getProfileId().then(function (profileId) {
        return FreeTextContentResource.updateFreeTextContent(profileId, freeTextContent);
      }).then(function (ftc) {
        return updateCache(ftc, visibilityDescriptor);
      });
    }

    function deleteFreeTextContent(freeTextContent, visibilityDescriptor) {
      return getProfileId().then(function (profileId) {
        return FreeTextContentResource.deleteFreeTextContent(profileId, freeTextContent,
          visibilityDescriptor.instanceName);
      }).then(function () {
        return updateCache(freeTextContent, visibilityDescriptor, true);
      }).then(publish);
    }

    return {
      initCache: initCache,
      getInitialData: getInitialData,
      getFreeTextContentSubject: getFreeTextContentSubject,
      insertFreeTextContent: insertFreeTextContent,
      updateFreeTextContent: updateFreeTextContent,
      deleteFreeTextContent: deleteFreeTextContent
    };
  });
