/**
 * User: anfur_000
 * Date: 10/4/13, 3:25 PM
 */

function chooseChallengeController($scope, $location){
    $scope.challengeSet =  EXPORT.challengeSet;

    $scope.goToChallenge = function(id){
        $location.path("/challenge/id/" + id);
    };
}