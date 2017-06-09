var config = {
    apiKey: "AIzaSyChtQjEVDa7xxPPDLYzIUl6w1NB6WZj-qA",
    authDomain: "bulletjournal-c32c3.firebaseapp.com",
    databaseURL: "https://bulletjournal-c32c3.firebaseio.com",
    projectId: "bulletjournal-c32c3",
    storageBucket: "bulletjournal-c32c3.appspot.com",
    messagingSenderId: "865005421155"
};
firebase.initializeApp(config);
var database = firebase.database();

var app = angular.module('MyApp', ['firebase', 'ngRoute']);

app.controller('myController', ['$scope', '$firebaseArray', '$interval', function ($scope, $firebaseArray, $interval) {
    $scope.userData = $firebaseArray(database.ref('/users/peteyoon14'));
    $scope.userData.$loaded().then(function (result) {
        for (var i = 0; i < $scope.userData.length; i++) {
            $scope.userData[i].__proto__ = BulletRecord.prototype;
        }
    }).catch(function (error) {
        console.log("Error:", error);
    });
    $scope.myfilter = '';
    $scope.mypendingfilter = '';
    $scope.priorityList = [
        {
            name: '',
            priority: 4
        }, 
        {
            name: 'Due Today',
            priority: 1
        }, 
        {
            name: 'Errands',
            priority: 2
        }, 
        {
            name: 'Brainstorm',
            priority: 3
        }, 
    ];
    $scope.createNewBullet = function() {
        $scope.userData.$add(new BulletRecord());
        return false;
    }
    $scope.saveBullet = function(bullet) {
        $scope.userData.$save(bullet);
        return false;
    }
    $scope.deleteBullet = function(bullet) {
        $scope.userData.$remove(bullet);
        return false;
    }
    $scope.clock = "";
    $scope.callAtInterval = function() {
        $scope.clock = Date.now();
    }
    $interval( function(){
        $scope.callAtInterval();
    }, 1000);
}]);

function BulletRecord() {
    this.description = '';
    this.priority = 4;
    this.priorityLabel = 'Due Today';
    this.category = '';
    this.complete = false;
    this.timestamp = '';
    this.timeCompleted = new Date().getTime();
    this.dateCompleted = new Date(this.timeCompleted);
    this.durationAfterCompleted = 0;
}
BulletRecord.prototype.priorityEdit = function(priority) {
    this.priority = priority;
    if (this.priority === 1) {
        this.priorityLabel = 'Due Today';
    } else if (this.priority === 2) {
        this.priorityLabel = 'Errands';
    } else {
        this.priorityLabel = 'Brainstorm';
    }
}
BulletRecord.prototype.newTimeStamp = function() {
    this.timeCompleted = new Date().getTime();
    this.dateCompleted = new Date(this.timeCompleted);
    console.log(Date.now());
    var doubledigitFormat = function(measure){
        if (measure < 10){
            return "0" + measure;
        } else {
            return measure;
        }
    }
    if (this.dateCompleted.getHours() >12){
        var hours = this.dateCompleted.getHours() - 12;
        var ampm = "PM";
    } else {
        var hours = doubledigitFormat(this.dateCompleted.getHours());
        var ampm = "AM";
    }
    this.timestamp = (this.dateCompleted.getMonth() + 1) + "/" + this.dateCompleted.getDate() + "/" + this.dateCompleted.getFullYear() + " " + hours + ":" + doubledigitFormat(this.dateCompleted.getMinutes()) + ampm;
}