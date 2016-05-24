angular.module('directives.embed', [])

  .config(function() {
    var ejs = window.ejs;

    ejs.setOptions({
      inlineEmbed: 'all',
      inlineText: false,
      imageEmbed: true,
      videoDetails: false,
      emoji: false,
      fontIcons: false,
      locationEmbed: false,
      audioEmbed: false
    });
  })

  .directive('embed', function($sanitize) {
    var embedIdCounter = 0;

    return {
      restrict: 'A',
      scope: {
        embed: '=',
        videoHeight: '@'
      },
      link: function($scope, element, attrs) {
        var ejs = window.ejs,
            embedId = 'embed_' + embedIdCounter,
            embedElement = angular.element(_.template('<div class="<%= embedId %>"></div>')({'embedId': embedId}));

        function processEmbed(embedValue) {
          embedElement.html($sanitize(embedValue));
          ejs.applyEmbedJS('.' + embedId);
        };

        embedIdCounter++;

        element.html(embedElement);

        $scope.$watch('embed', processEmbed);
      }
    };
  });