/**
 * Created with JetBrains PhpStorm.
 * User: anfur_000
 * Date: 4/23/13
 * Time: 2:01 AM

 * This file is for the automatic tests the user may want to run to ensure their answers are right before submitting.
 */

var app = angular.module('automatedTest', []);
app.directive("automatedTest", function(){
    return {
        restrict: "E",
        replace: true,
        template: '<div ng-class="{aTest: true,' +
        'testPassed: (test.lastResult == true),' +
        'testFailed: (test.lastResult == false)}">' +
        '<input type="button" ng-click="test.doGuiRun()" value="&gt;" />' +
        '<input ng-model="test.funcName" value="{{theGame.currentStepTesteeFunctionName()}}" class="testFuncName" ng-class="{testParamsFailed: !test.canExtractFunction()}" title="{{ {true: \'Got it\', false: \'Cannot find a function by that name in your global scope\'}[test.canExtractFunction()] }}">' +
        '(<input ng-model="test.paramsJson" class="testParams" ng-class="{testParamsFailed: !test.canParseParams()}" title="{{ {true: \'Got it\', false: \'Not valid JSON array contents\'}[test.canParseParams()] }}">) =' +
        '<input ng-model="test.expectedJson" class="testExpected" ng-class="{testParamsFailed: !test.canParseExpected()}" title="{{ {true: \'Got it\', false: \'Not valid JSON value\'}[test.canParseExpected()] }}">' +
        '<span class="deleteButton" ng-click="theGame.removeTestById($index)" title="Delete Test">×</span>' +
        '</div>',
        link: function($scope, element) {
            $scope.test.flashTo = function(color ) {
                element.css("backgroundColor", color);
                setTimeout(function() {
                    element.css("backgroundColor", "");
                    }, 300);
            };

        }
    };
});

var AutomatedTest;

AutomatedTest = function (obj, funcName, id) {
    this.obj = obj;
    this.paramsJson = "";
    this.expectedJson = '1';
    this.funcName = funcName;
    this.id = id;
    //this.doGuiRun(false);
};

AutomatedTest.prototype.canParseParams = function() {
    try {
        this.parseParams();
    } catch (e) {
        return false;
    }
    return true;
};

/**
 *
 */
AutomatedTest.prototype.parseParams = function() {
    return JSON.parse("[" + this.paramsJson + "]");
};

AutomatedTest.prototype.canParseExpected = function () {
  try { JSON.parse(this.expectedJson); } catch (e) {
      return false;
  }
    return true;
};

AutomatedTest.prototype.canExtractFunction = function() {
    try {
        return typeof(ideExtractFunction(this.funcName, false)) == "function";
    } catch (e) {
        return false;
    }
};

/**
 * This runs a test and provides graphical feedback
 *
 * @param useDebugger can be undefined = neutral, true = force yes, false = force no
 * @returns {*}
 */
AutomatedTest.prototype.run = function(useDebugger) {
    // going forward we can test that these are valid values by json decoding then encoding them
    // if they can't have those done then they are invalid
    var fname = this.funcName;
    var comparer = function(a,b) { return a == b;}, e, prob;

    try {
        var params = this.parseParams();
    } catch (e) {
        if (wouldBeValidJsonIfDoubleQuotes(this.paramsJson)){
            notifyGently("It looks like the parameters for one of your tests would be valid JSON if you swapped ' with \" ");
        };
        return "Parameters weren't parsable";
    }

    try {
        var expected = JSON.parse(this.expectedJson);
    } catch(e) {
        if (wouldBeValidJsonIfDoubleQuotes(this.expectedJson)){
            notifyGently("It looks like the expected value for one of your tests would be valid JSON if you swapped ' with \" ");
        }
        return "Expected wasn't parsable";
    }
    try {
        var functionToBeTested = ideExtractFunctionAndDebugger(fname);
        if (prob = executeOneTest(functionToBeTested, fname, null, params, comparer, expected, useDebugger)) {
            return prob;
        }
    } catch (e) {
        return e.toString();
    }
    return true;
};

/**
 * This simply means update the gui (i.e. the redness of the box at the right etc) because it was a test initiated by the user
 *  and they are expecting a change.
 *
 *  This is a terrible name. As evidenced by the fact that I bothered to write a doc-block.
 *
 * @param useDebugger
 */
AutomatedTest.prototype.doGuiRun = function(useDebugger){
    var returned = this.run(useDebugger);
    this.lastResult = (returned === true);
    if (returned === true) {
        this.lastMessage = 'Success';
        this.flashTo("#50FF50");
    } else {
        this.lastMessage = returned;
        this.flashTo("#FF5050");
    }
    this.lastMessage = "Test #" + this.id + " returned: " + this.lastMessage;
    globalRecordToLog(this.lastMessage);
}

/**
 *
 * @returns {boolean}
 */
AutomatedTest.prototype.runAndDebug = function() {
    if (this.doGuiRun(false)) {
        return true;
    }
    this.run(true);
}