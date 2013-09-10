/**
 * Devised by Tim Riley - http://icelab.com.au/articles/levelling-up-with-angularjs-building-a-reusable-click-to-edit-directive/
 * Altered by Alex Rohde
 * Date: 9/9/13, 12:38 AM
 */
var app = angular.module("inlineEditing", []);

app.directive("clickToEdit", function() {
    var editorTemplate = '<span class="click-to-edit">' +
        '<span ng-hide="view.editorEnabled">' +
        '{{bindTo}} ' +
        '<a ng-click="enableEditor()"><img class="inlineEditIcon" alt="Edit This Text" title="Edit This Text"></a>' +
        '</span>' +
        '<span ng-show="view.editorEnabled">' +
        '<input ng-model="view.editableValue" class="click-to-edit-textbox" data-autosize-input=\'{ "space": 1 }\'>' +
        '<img class="inlineEditSaveIcon" href="#" ng-click="save()" title="Save Changes">' +
        '<img class="inlineEditCancelIcon" ng-click="disableEditor()" title="Cancel Changes">' +
        '</span>' +
        '</span>';

    return {
        restrict: "E",
        replace: true,
        template: editorTemplate,
        scope: {
            bindTo: "=",
        },

        controller: function($scope) {
            $scope.view = {
                editableValue: $scope.bindTo,
                editorEnabled: false
            };

            $scope.enableEditor = function() {
                var editor = $('.click-to-edit-textbox').autosizeInput({"space":0}); //slightly hacky
                $scope.view.editorEnabled = true;
                $scope.view.editableValue = $scope.bindTo;
            };

            $scope.disableEditor = function() {
                $scope.view.editorEnabled = false;
            };

            $scope.save = function() {
                $scope.bindTo = $scope.view.editableValue;
                $scope.disableEditor();
            };
        }
    };
});