"use strict";
//Step One: define functions, objects, variables
function pageCreateAcct() {
    $("#pageCreateAcct").toggle();
}




//Step Two: Use functions, object, variables (triggers)
$(document).ready(function () {
    //  Hides All
    $(".jsHide").hide();

    //  Shows Login Page
    $("#pageLogin").toggle();
    //Hides Forgot Password form
    $("#forgotPassword").hide();

    //  Login Page >> Submit > Operator
    //    $("form#userLogin").submit(function () {
    //        event.preventDefault();
    //        $(".jsHide").hide();
    //        $("#pageInputPigging").toggle();
    //        $(".select-launch").hide();
    //        $(".select-receive").hide();
    //        $(".select-exception").hide();
    //    });


    //  Login Page >> Submit > Foreman
    $("form#userLogin").submit(function () {
        event.preventDefault();
        $(".jsHide").hide();
        $("#pageAdminMenu").toggle();
    });

    //  Login Page >> Submit > Report Viewer
    //    $("form#userLogin").submit(function () {
    //        event.preventDefault();
    //        $(".jsHide").hide();
    //        $("#pagePiggingSchedule").toggle();
    //        $(".foreman-header").hide();
    //        $(".operator").hide();
    //
    //    });


    //  Login Page >> Forgot Password
    $("form#userLogin + p").click(function () {
        $("#forgotPassword").toggle();
    });

    //  Login Page >> Create Account
    $("form#forgotPassword + p").click(function () {
        $(".jsHide").hide();
        $("#pageCreateAcct").toggle();
    });
});


//  Login >> Forgot Your Password >> Cancel
$(document).on('click', '#forgotPassword .js-cancel', function () {
    $("#forgotPassword").hide();
});

//  Login >> Forgot Your Password >> Submit
$(document).on('submit', '#forgotPassword', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageResetPwd").toggle();
});

//  Password Reset Page >> Submit
$(document).on('submit', '#userPwdReset', function (event) {
    event.preventDefault();

    $(".jsHide").hide();
    $("#pageLogin").toggle();
    $("#forgotPassword").toggle();
    alert("Your password has been reset.");
});

//  Password Reset Page  >> Cancel
$(document).on('click', '#userPwdReset .js-cancel', function () {
    $(".jsHide").hide();
    $("#pageLogin").toggle();
    $("#forgotPassword").hide();
});


//  Create Account Page >> Submit
$(document).on('submit', '#userCreateAcct', function (event) {
    event.preventDefault();

    $(".jsHide").hide();
    $("#pageLogin").toggle();
    $("#forgotPassword").hide();
    alert("Your account is waiting for approval.");
});

//  Create Account Page >> Cancel
$(document).on('click', '#userCreateAcct .js-cancel', function () {
    $(".jsHide").hide();
    $("#pageLogin").toggle();
    $("#forgotPassword").hide();
});

//  Header >> Account Info
$(document).on('click', 'header img', function () {
    $(".jsHide").hide();
    $("#pageUpdateAcct").toggle();

});

//  Header >> Exit Application
$(document).on('click', 'header img + img', function () {
    $(".jsHide").hide();
    $("#pageLogin").toggle();

});

//  Foreman Header >> Admin Menu
$(document).on('click', '.foreman-header img:first-of-type', function () {
    $(".jsHide").hide();
    $("#pageAdminMenu").toggle();
});

//  Admin Menu >> View Pigging Schedule
$(document).on('click', 'p.viewPigSched', function () {
    $(".jsHide").hide();
    $("#pagePiggingSchedule").toggle();
    $("#pagePiggingSchedule .normal-header").hide();
    $(".ops-nav").hide();
});

//  Admin Menu >> View Debris Report
$(document).on('click', 'p.viewDebRep', function () {
    $(".jsHide").hide();
    $("#pageDebrisReport").toggle();
    $("#pageDebrisReport .normal-header").hide();
    $(".debris-results").hide();
    $("#debrisReport select").hide();
    $(".ops-nav").hide();

});
//  Admin Menu >> Pigging Activity
//  Admin Menu >> View/Update History
//  Admin Menu >> Add Pipeline
//  Admin Menu >> Update/Remove Pipeline
//  Admin Menu >> Add User
//  Admin Menu >> Update/Remove User

//  Input Pigging >>
