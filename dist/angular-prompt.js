angular.module('cgPrompt',['ui.bootstrap']);

angular.module('cgPrompt').factory('prompt',['$uibModal','$q',function($uibModal,$q){

    var prompt = function(options){

        var defaults = {
            title: '',
            message: '',
            input: false,
            label: '',
            value: '',
            values: false,
            buttons: [
                {label:'Cancel',cancel:true},
                {label:'OK',primary:true}
            ]
        };

        if (options === undefined){
            options = {};
        }

        for (var key in defaults) {
            if (options[key] === undefined) {
                options[key] = defaults[key];
            }
        }

        var defer = $q.defer();

        $uibModal.open({
            templateUrl:'angular-prompt.html',
            controller: 'cgPromptCtrl',
            resolve: {
                options:function(){
                    return options;
                }
            }
        }).result.then(function(result){
            if (options.input){
                defer.resolve(result.input);
            } else {
                defer.resolve(result.button);
            }
        }, function(){
            defer.reject();
        });

        return defer.promise;
    };

    return prompt;
	}
]);

angular.module('cgPrompt').controller('cgPromptCtrl',['$scope','options','$timeout',function($scope,options,$timeout){

    $scope.input = {name:options.value};

    $scope.options = options;

    $scope.form = {};

    $scope.buttonClicked = function(button){
        if (button.cancel){
            $scope.$dismiss();
            return;
        }
        if (options.input && $scope.form.cgPromptForm.$invalid){
            $scope.changed = true;
            return;
        }
        $scope.$close({button:button,input:$scope.input.name});
    };

    $scope.submit = function(){
        var ok;
        angular.forEach($scope.options.buttons,function(button){
            if (button.primary){
                ok = button;
            }
        });
        if (ok){
            $scope.buttonClicked(ok);
        }
    };

    $timeout(function(){
        var elem = document.querySelector('#cgPromptInput');
        if (elem) {
            if (elem.select) {
                elem.select();
            }
            if (elem.focus) {
                elem.focus();
            }
        }
    },100);


}]);


angular.module('cgPrompt').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('angular-prompt.html',
    "<div>\r" +
    "\n" +
    "    <div class=\"modal-header\">\r" +
    "\n" +
    "        <button type=\"button\" class=\"close pull-right\" ng-click=\"$dismiss()\" aria-hidden=\"true\">×</button>\r" +
    "\n" +
    "        <h4 class=\"modal-title\">{{options.title}}</h4>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"modal-body\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <p ng-if=\"options.message\">\r" +
    "\n" +
    "            {{options.message}}\r" +
    "\n" +
    "        </p>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <form id=\"cgPromptForm\" name=\"form.cgPromptForm\" ng-if=\"options.input\" ng-submit=\"submit()\">\r" +
    "\n" +
    "            <div class=\"form-group\" ng-class=\"{'has-error':cgPromptForm.$invalid && changed}\">\r" +
    "\n" +
    "                <label for=\"cgPromptInput\">{{options.label}}</label>\r" +
    "\n" +
    "                <textarea \r" +
    "\n" +
    "                    id=\"cgPromptInput\" \r" +
    "\n" +
    "                    class=\"form-control\"  \r" +
    "\n" +
    "                    placeholder=\"{{options.label}}\" \r" +
    "\n" +
    "                    ng-model=\"input.name\" \r" +
    "\n" +
    "                    required \r" +
    "\n" +
    "                    ng-change=\"changed=true\" \r" +
    "\n" +
    "                    ng-if=\"!options.values || options.values.length === 0\"\r" +
    "\n" +
    "                    autofocus=\"autofocus\">\r" +
    "\n" +
    "                </textarea>\r" +
    "\n" +
    "                <div class=\"input-group\" ng-if=\"options.values\">\r" +
    "\n" +
    "                    <input id=\"cgPromptInput\" type=\"text\" class=\"form-control\" placeholder=\"{{options.label}}\" ng-model=\"input.name\" required ng-change=\"changed=true\" autofocus=\"autofocus\"/>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <div class=\"input-group-btn\" dropdown>\r" +
    "\n" +
    "                        <button type=\"button\" class=\"btn btn-default dropdown-toggle\" dropdown-toggle data-toggle=\"dropdown\"><span class=\"caret\"></span></button>\r" +
    "\n" +
    "                        <ul class=\"dropdown-menu pull-right\">\r" +
    "\n" +
    "                            <li ng-repeat=\"value in options.values\"><a href=\"\" ng-click=\"input.name = value\">{{value}}</a></li>\r" +
    "\n" +
    "                        </ul>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "         </form>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"modal-footer\">\r" +
    "\n" +
    "        <button ng-repeat=\"button in options.buttons track by button.label\" class=\"btn btn-default {{button.class}}\" ng-class=\"{'btn-primary':button.primary}\" ng-click=\"buttonClicked(button)\">{{button.label}}</button>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );

}]);
