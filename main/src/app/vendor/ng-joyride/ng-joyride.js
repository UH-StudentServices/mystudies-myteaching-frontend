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

/**
 * Created by abhik.mitra on 27/06/14.
 */

(function (angular) {


    //TYPE = ELEMENT


    //---------------------------------------------------------//

    //TYPE = TITLE


    var defaultTitleTemplate = "ng-joyride-title-tplv1.html";
    var drctv = angular.module('ngJoyRide', []);
    drctv.run(['$templateCache', function ($templateCache) {
        $templateCache.put('ng-joyride-tplv1.html',
            "<div class=\"popover ng-joyride sharp-borders\"> <div class=\"arrow\"></div>   <h3 class=\"popover-title sharp-borders\"></h3> <div class=\"popover-content container-fluid\"></div></div>"
        );
        $templateCache.put('ng-joyride-title-tplv1.html',
            "<div id=\"ng-joyride-title-tplv1\"><div class=\"ng-joyride sharp-borders intro-banner\" style=\"\"><div class=\"popover-inner\"><h3 class=\"popover-title sharp-borders\">{{heading}}</h3><div class=\"popover-content container-fluid\"><div ng-bind-html=\"content\"></div><hr><div class=\"row\"><div class=\"col-md-4 skip-class\"><a class=\"skipBtn pull-left\" type=\"button\"><i class=\"glyphicon glyphicon-ban-circle\"></i>&nbsp; Skip</a></div><div class=\"col-md-8\"><div class=\"pull-right\"><button class=\"prevBtn btn\" type=\"button\"><i class=\"glyphicon glyphicon-chevron-left\"></i>&nbsp;Previous</button> <button id=\"nextTitleBtn\" class=\"nextBtn btn btn-primary\" type=\"button\">Next&nbsp;<i class=\"glyphicon glyphicon-chevron-right\"></i></button></div></div></div></div></div></div></div>"
        );
    }]);
    drctv.factory('joyrideElement', ['$timeout', '$compile', '$sce', function ($timeout, $compile, $sce) {
        function Element(config, currentStep, template, loadTemplateFn, hasReachedEndFn, goToNextFn,
                         goToPrevFn, skipDemoFn,isEnd, curtainClass , addClassToCurtain, shouldDisablePrevious, attachTobody) {
            this.currentStep = currentStep;
            this.content = $sce.trustAsHtml(config.text);
            this.selector = config.selector;
            this.template = template || 'ng-joyride-tplv1.html';
            if(config.elementTemplate){
              this.popoverTemplate = config.elementTemplate(this.content, isEnd);
            }else{
              this.popoverTemplate = '<div class=\"row\"><div id=\"pop-over-text\" class=\"col-md-12\">' + this.content + '</div></div><hr><div class=\"row\"><div class=\"col-md-4 center\"><a class=\"skipBtn pull-left\" type=\"button\">Skip</a></div><div class=\"col-md-8\"><div class=\"pull-right\"><button id=\"prevBtn\" class=\"prevBtn btn btn-xs\" type=\"button\">Previous</button> <button id=\"nextBtn\" class=\"nextBtn btn btn-xs btn-primary\" type=\"button\">' + _generateTextForNext() + '</button></div></div></div>';
            }
            this.heading = config.heading;
            this.placement = config.placement;
            this.scroll = config.scroll;
            this.staticClass = "ng-joyride-element-static";
            this.nonStaticClass = "ng-joyride-element-non-static";
            this.loadTemplateFn = loadTemplateFn;
            this.goToNextFn = goToNextFn;
            this.skipDemoFn = skipDemoFn;
            this.goToPrevFn = goToPrevFn;
            this.hasReachedEndFn = hasReachedEndFn;
            this.type = "element";
            this.curtainClass = curtainClass;
            this.addClassToCurtain = addClassToCurtain;
            this.shouldDisablePrevious = shouldDisablePrevious;
            this.attachTobody = attachTobody;
            function _generateTextForNext() {

                if (isEnd) {

                    return 'Finish';
                } else {
                    return 'Next&nbsp;<i class=\"glyphicon glyphicon-chevron-right\">';

                }
            }

        }

        Element.prototype = (function () {
            var $fkEl;

            function _showTooltip() {
                var self =this;
                $timeout(function () {
                    $fkEl.popover('show');
                    $timeout(function () {

                        $('.nextBtn').one("click",self.goToNextFn);
                        $('.prevBtn').one("click",self.goToPrevFn);
                        $('.skipBtn').one("click",self.skipDemoFn);
                        if(self.shouldDisablePrevious){
                            $('.prevBtn').prop('disabled', true);
                        }
                    });
                }, 500);
            }

            function generate() {
                $fkEl = $(this.selector);
                _highlightElement.call(this);
                handleClicksOnElement();
                this.addClassToCurtain(this.curtainClass);
                return _generateHtml.call(this).then(angular.bind(this, _generatePopover)).then(angular.bind(this, _showTooltip));



            }
            function stopEvent(event){
                event.stopPropagation();
                event.preventDefault();
            }
            function handleClicksOnElement(){
                $fkEl.on("click",stopEvent);
            }
            function _generateHtml() {

                var promise = this.loadTemplateFn(this.template);
                return promise;


            }

            function _generatePopover(html) {

                var scroll = this.scroll;

                $fkEl.popover({
                    title: this.heading,
                    template: html,
                    content: this.popoverTemplate,
                    html: true,
                    placement: this.placement,
                    trigger:'manual',
                    container: this.attachTobody? 'body' : false
                }).on('inserted.bs.popover', function() {
                  if (scroll) {
                    setTimeout(function() {_scrollToElement.call(this,this.selector)}, 0);
                  }
                });
            }

            function _highlightElement() {
                var currentPos = $fkEl.css('position');
                if (currentPos === 'static') {
                    $fkEl.addClass(this.staticClass);
                } else {
                    $fkEl.addClass(this.nonStaticClass);
                }

            }

            function _scrollToElement() {
              var popoverElement = $('.ng-joyride.popover');
              var scrollTo = $fkEl.offset().top;
              var windowHeight = $(window).height();
              var popoverElementTop = popoverElement.offset().top;
              var popoverElementBottom = popoverElementTop + popoverElement.height();

              if(popoverElementBottom > scrollTo + windowHeight) {
                scrollTo = popoverElementBottom - windowHeight;
              } else if(popoverElementTop < scrollTo) {
                scrollTo = popoverElementTop;
              }

              $('html, body').animate({
                scrollTop: scrollTo
              }, 1000);
            }

            function _unhighlightElement() {
                if($fkEl){
                    $fkEl.removeClass(this.staticClass);
                    $fkEl.removeClass(this.nonStaticClass);
                }
            }

            function cleanUp() {
                _unhighlightElement.call(this);
                if($fkEl){
                    $fkEl.off("click",stopEvent);
                    $($fkEl).popover('destroy');
                }



            }

            return {
                generate: generate,
                cleanUp: cleanUp
            };


        })();
        return Element;
    }]);
    drctv.factory('joyrideTitle', ['$timeout', '$compile', '$sce', function ($timeout, $compile, $sce) {

        function setNextBtnText(isEnd){
            if (isEnd) {
                $('.nextBtn').text("Finish");
            } else {
                $('.nextBtn').html("Next&nbsp;<i class='glyphicon glyphicon-chevron-right'>");
            }
        }

        function Title(config, currentStep, scope, loadTemplateFn, hasReachedEndFn, goToNextFn, goToPrevFn, skipDemoFn, curtainClass, addClassToCurtain, shouldDisablePrevious) {

            this.currentStep = currentStep;
            this.heading = config.heading;
            this.content = $sce.trustAsHtml(config.text);
            this.titleMainDiv = '<div class="ng-joyride-title"></div>';
            this.loadTemplateFn = loadTemplateFn;
            this.titleTemplate = config.titleTemplate || defaultTitleTemplate;
            this.setNextBtnTextFn = config.setNextBtnTextFn || setNextBtnText;
            this.hasReachedEndFn = hasReachedEndFn;
            this.goToNextFn = goToNextFn;
            this.skipDemoFn = skipDemoFn;
            this.goToPrevFn = goToPrevFn;
            this.scope = scope;
            this.type = "title";
            this.curtainClass = curtainClass;
            this.addClassToCurtain = addClassToCurtain;
            this.shouldDisablePrevious = shouldDisablePrevious;
        }

        Title.prototype = (function () {
            var $fkEl;

            function generateTitle() {
                $fkEl = $(this.titleMainDiv);
                $('body').append($fkEl);
                this.addClassToCurtain(this.curtainClass);
                var promise = this.loadTemplateFn(this.titleTemplate);
                promise.then(angular.bind(this,_compilePopover));


            }
            
            function _compilePopover(html) {
                var self = this;
                this.scope.heading = this.heading;
                this.scope.content = this.content;
                $fkEl.html($compile(html)(this.scope));
                this.setNextBtnTextFn(this.hasReachedEndFn());
                $fkEl.slideDown(100, function () {
                    $('.nextBtn').one("click",function(){ self.goToNextFn(200);});
                    $('.skipBtn').one("click",self.skipDemoFn);
                    $('.prevBtn').one("click",function(){ self.goToPrevFn(200);});

                    if(self.shouldDisablePrevious){
                        $('.prevBtn').prop('disabled', true);
                    }


                });
            }

            function cleanUp() {
                if($fkEl){
                    $fkEl.slideUp(100, function () {
                        $fkEl.remove();
                    });
                }

            }

            return {
                generate: generateTitle,
                cleanUp: cleanUp
            };

        })();

        return Title;


    }]);
    drctv.factory('joyrideFn', ['$timeout', '$compile', '$sce', function ($timeout, $compile, $sce) {

        function Fn(config, currentStep, parent) {
            this.currentStep = currentStep;
            if(angular.isString(config.fn)){
                this.func = parent[config.fn];
            } else {
                this.func = config.fn;
            }

            this.type = "function";


        }

        Fn.prototype = (function () {
            function generateFn() {
                this.func(true);
            }

            function cleanUp() {

            }

            function rollback(){
                this.func(false);
            }
            return {
                generate: generateFn,
                cleanUp: cleanUp,
                rollback: rollback
            };

        })();

        return Fn;


    }]);
    drctv.factory('joyrideLocationChange', ['$timeout', '$compile', '$sce', '$location', function ($timeout, $compile, $sce,$location) {

        function LocationChange(config, currentStep) {
            this.path = config.path;
            this.currentStep = currentStep;
            this.prevPath = "";
            this.type = "location_change"
            ;

        }

        LocationChange.prototype = (function () {
            function generateFn() {
                var self = this;
                this.prevPath = $location.path();
                $timeout(function () {
                    $location.path(self.path);
                },0);
            }

            function cleanUp() {

            }

            function goToPreviousPath(){
                var self = this;
                $timeout(function () {
                    $location.path(self.prevPath);
                });
            }

            return {
                generate: generateFn,
                cleanUp: cleanUp,
                rollback: goToPreviousPath
            };

        })();

        return LocationChange;


    }]);

    drctv.directive('ngJoyRide', ['$http', '$timeout', '$location', '$window', '$templateCache', '$q' , '$compile', '$sce', 'joyrideFn', 'joyrideTitle', 'joyrideElement', 'joyrideLocationChange', function ($http, $timeout, $location, $window, $templateCache, $q, $compile, $sce, joyrideFn, joyrideTitle, joyrideElement, joyrideLocationChange) {
        return {
            restrict: "A",
            scope: {
                'ngJoyRide': '=',
                'config': '=',
                'onFinish': '&',
                'onSkip': '&'

            },
            link: function (scope, element, attrs) {
                var steps = [];
                var currentStepCount = 0;


                var $fkEl;
                function waitForAngular(callback) {
                  try {
                    var app = angular.element(document.querySelector('body'));
                    var $browser = app.injector().get('$browser');
                    $browser.notifyWhenNoOutstandingRequests(callback)
                  } catch (err) {
                    callback(err.message);
                  }
                }

                function hasReachedEnd() {
                    return currentStepCount === (steps.length - 1);
                }
                function loadTemplate(template) {
                    if (!template) {
                        return '';
                    }
                    return $q.when($templateCache.get(template)) || $http.get(template, { cache: true });
                }
                function goToNext(interval) {
                    if (!hasReachedEnd()) {
                        currentStepCount++;
                        cleanUpPreviousStep();
                        $timeout(function(){
                            generateStep();
                        },interval || 0);

                    } else {
                        endJoyride();
                        scope.onFinish();
                    }
                }
                function endJoyride() {
                    steps[currentStepCount].cleanUp();
                    dropCurtain(false);
                    $timeout(function () {
                        scope.ngJoyRide = false;
                    });
                }
                function goToPrev(interval) {
                    steps[currentStepCount].cleanUp();
                    var requires_timeout = false;
                    currentStepCount -= 1;

                    // Rollback previous steps until we hit a title or element.
                    function rollbackSteps(s, i) {
                        s[i].rollback();
                    }

                    while ((steps[currentStepCount].type === "location_change" || steps[currentStepCount].type === "function") && currentStepCount >= 1) {
                        requires_timeout = true;
                        if (steps[currentStepCount].type == "location_change") {
                            scope.$evalAsync(rollbackSteps(steps, currentStepCount));
                        }
                        else {
                            steps[currentStepCount].rollback();
                        }
                        currentStepCount -= 1;
                    }
                    requires_timeout = requires_timeout || interval;
                    if (requires_timeout) {
                        $timeout(generateStep, interval || 100);
                    }
                    else {
                        generateStep();
                    }
                }

                function skipDemo() {

                    endJoyride();
                    scope.onSkip();
                }

                function dropCurtain(shouldDrop) {
                    var curtain;
                    $fkEl = $('#ng-curtain');
                    if (shouldDrop) {
                        if ($fkEl.size() === 0) {
                            $('body').append('<div id="ng-curtain"></div>');
                            $fkEl = $('#ng-curtain');
                            $fkEl.slideDown(1000);
                            $fkEl.animate({opacity: 0.5}, 400, '');
                        } else {

                            $fkEl.animate({opacity: 0.5}, 400, '');
                        }
                    } else {
                        $fkEl.slideUp(100, function () {
                            $fkEl.remove();
                        });

                    }


                }

                scope.$watch('ngJoyRide', function (newval, oldval) {
                    if(newval){
                        destroyJoyride();
                        initializeJoyride();
                        currentStepCount = 0;
                        dropCurtain(true);
                        cleanUpPreviousStep();
                        generateStep();
                    } else {
                        destroyJoyride();
                    }
                });
                function destroyJoyride(){
                    steps.forEach(function(elem){
                        elem.cleanUp();
                    });
                    dropCurtain(false);
                }
                function cleanUpPreviousStep() {
                    if(currentStepCount!==0){
                        steps[currentStepCount-1].cleanUp();
                    }

                }

                function generateStep() {
                    var currentStep = steps[currentStepCount];
                    currentStep.generate();
                    if (currentStep.type === "location_change" ||
                        currentStep.type === "function") {
                      waitForAngular(function () {
                        goToNext();
                      });
                    }
                }
                function changeCurtainClass(className){
                    $fkEl.removeClass();
                    if(className){
                        $fkEl.addClass(className);
                    }

                }
                function initializeJoyride() {
                    var options = {
                        config : scope.config,
                        templateUri: attrs.templateUri
                    };

                    var count = -1,isFirst = true,disablePrevious;
                    steps = options.config.map(function (step) {
                        count++;
                        switch (step.type) {
                            case "location_change":
                                return new joyrideLocationChange(step, count);

                            case "element":
                                disablePrevious = isFirst;
                                isFirst = isFirst ? false:false;

                                return new joyrideElement(step, count, options.templateUri, loadTemplate, hasReachedEnd, goToNext, goToPrev, skipDemo, count === (options.config.length-1),step.curtainClass,changeCurtainClass, disablePrevious ,step.attachToBody);

                            case "title":
                                disablePrevious = isFirst;
                                isFirst = isFirst ? false:false;
                                return new joyrideTitle(step, count, scope, loadTemplate, hasReachedEnd, goToNext, goToPrev, skipDemo, step.curtainClass,changeCurtainClass,disablePrevious);

                            case "function":
                                return new joyrideFn(step, count, scope.$parent);

                        }

                    });
                }
            }
        };


    }]);


})(angular);