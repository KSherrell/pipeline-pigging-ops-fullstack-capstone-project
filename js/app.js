"use strict";
//Step One: define functions, objects, variables
function pageCreateAcct() {
    $("#pageCreateAcct").show();
}




//Step Two: Use functions, object, variables (triggers)
$(document).ready(function () {
    //  Hides All
    $(".jsHide").hide();

    //  Shows Login Page
    $("#pageLogin").show();
    //Hides Forgot Password form
    $("#forgotPassword").hide();

    //  Login Page >> Submit > Operator
    $("form#userLogin").submit(function () {
        event.preventDefault();
        $(".jsHide").hide();
        $("#pageInputPigging").show();
        $("#pageInputPigging #launchTime").prop('required', true);
        $("#pageInputPigging div.select-receive").hide();
        $("#pageInputPigging div.select-exception").hide();
    });


    //  Login Page >> Submit > Foreman
    //    $("form#userLogin").submit(function () {
    //        event.preventDefault();
    //        $(".jsHide").hide();
    //        $("#pageAdminMenu").show();
    //    });

    //  Login Page >> Submit > Report Viewer
    //    $("form#userLogin").submit(function () {
    //        event.preventDefault();
    //        $(".jsHide").hide();
    //        $("#pagePiggingSchedule").show();
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
        $("#pageCreateAcct").show();
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
    $("#pageResetPwd").show();
});

//  Password Reset Page >> Submit
$(document).on('submit', '#userPwdReset', function (event) {
    event.preventDefault();

    $(".jsHide").hide();
    $("#pageLogin").show();
    $("#forgotPassword").show();
    alert("Your password has been reset.");
});

//  Password Reset Page  >> Cancel
$(document).on('click', '#userPwdReset .js-cancel', function () {
    $(".jsHide").hide();
    $("#pageLogin").show();
    $("#forgotPassword").hide();
});


//  Create Account Page >> Submit
$(document).on('submit', '#userCreateAcct', function (event) {
    event.preventDefault();

    $(".jsHide").hide();
    $("#pageLogin").show();
    $("#forgotPassword").hide();
    alert("Your account request has been sent to the Pipeline Foreman for approval.");
});

//  Create Account Page >> Cancel
$(document).on('click', '#userCreateAcct .js-cancel', function () {
    $(".jsHide").hide();
    $("#pageLogin").show();
    $("#forgotPassword").hide();
});

//  Header >> Account Info
$(document).on('click', 'header img', function () {
    $(".jsHide").hide();
    $("#pageUpdateAcct").show();
});

//  Header >> Exit Application
$(document).on('click', 'header img + img', function () {
    $(".jsHide").hide();
    $("#pageLogin").show();
});

//  Update Account >> Submit
$(document).on('submit', '#pageUpdateAcct #userUpdateAcct', function () {
    alert("Will create a BACK function that grabs the page id and uses that to take the user back to her previous page after submitting the udated account info");
    $(".jsHide").hide();
    $("#pageLogin").show();
});

//  Update Account >> Cancel
$(document).on('click', '#pageUpdateAcct .js-cancel', function () {
    alert("Will create a BACK function that grabs the page id and uses that to take the user back to her previous page after clicking Cancel on this page");
    $(".jsHide").hide();
    $("#pageLogin").show();
});

//  Foreman Header >> Admin Menu
$(document).on('click', 'header.foreman-header>div>img', function () {
    $(".jsHide").hide();
    $("#pageAdminMenu").show();
});

//  Admin Menu >> View Pigging Schedule
$(document).on('click', 'p.viewPigSched', function () {
    $(".jsHide").hide();
    $("#pagePiggingSchedule").show();
    $("#pagePiggingSchedule .foreman-header").show();
    $("#pagePiggingSchedule .ops-nav").hide();
});

//  Admin Menu >> View Debris Report
$(document).on('click', 'p.viewDebRep', function () {
    $(".jsHide").hide();
    $("#pageDebrisReport").show();
    $("#pageDebrisReport .normal-header").hide();
    $(".debris-results").hide();
    $("#debrisReport select").hide();
    $("#pageDebrisReport .ops-nav").hide();
});

//  Admin Menu >> Pigging Activity
$(document).on('click', 'p.viewPigAct', function () {
    $(".jsHide").hide();
    $("#pagePiggingActivity").show();
    $("#pagePiggingActivity select").hide();
    $(".pigging-activity-results").hide();
});


//  Admin Menu >> Add Pipeline
$(document).on('click', 'p.addPL', function () {
    $(".jsHide").hide();
    $("#pageAddPipeline").show();
});

//  Admin Menu >> Update/Remove Pipeline
$(document).on('click', 'p.remPL', function () {
    $(".jsHide").hide();
    $("#pageUpdatePipeline").show();
    $("#updatePipeline").hide();
});

//  Admin Menu >> Add User
$(document).on('click', 'p.addUser', function () {
    $(".jsHide").hide();
    $("#pageAddUser").show();
    $("#pageAddUser #assignRole").hide();
});

//  Admin Menu >> Update/Remove User
$(document).on('click', 'p.remUser', function () {
    $(".jsHide").hide();
    $("#pageUdateUser").show();
    $("#pageUdateUser #assignRole").hide();
});

//  Input Pigging >> Radio Launch
$(document).on('click', '#pageInputPigging #radioLaunch', function () {
    $("#pageInputPigging div.select-launch").show();
    $("#pageInputPigging #launchTime").prop('required', true);


    $("#pageInputPigging div.select-receive").hide();
    $("#pageInputPigging #receiveTime").prop('required', false);

    $("#pageInputPigging div.select-exception").hide();
    $("#pageInputPigging #exceptionTime").prop('required', false);

});

//  Input Pigging >> Radio Receive
$(document).on('click', '#pageInputPigging #radioReceive', function () {
    $("#pageInputPigging div.select-launch").hide();
    $("#pageInputPigging #launchTime").prop('required', false);

    $("#pageInputPigging div.select-receive").show();
    $("#pageInputPigging #receiveTime").prop('required', true);

    $("#pageInputPigging div.select-exception").hide();
    $("#pageInputPigging #exeptionTime").prop('required', false);

});

//  Input Pigging >> Radio Exception
$(document).on('click', '#pageInputPigging #radioException', function () {
    $("#pageInputPigging div.select-launch").hide();
    $("#pageInputPigging #launchTime").prop('required', false);


    $("#pageInputPigging div.select-receive").hide();
    $("#pageInputPigging #receiveTime").prop('required', false);

    $("#pageInputPigging div.select-exception").show();
    $("#pageInputPigging #exceptionTime").prop('required', true);

});



//  Input Pigging >> Submit
$(document).on('submit', '#pageInputPigging #inputPigging', function () {
    alert("Merry Christmas @ Input Pigging form");
    //document.getElementById("inputPigging").reset();
    $(".jsHide").hide();
    $("#pageInputPigging").show();
    $("#pageInputPigging div.select-receive").hide();
    $("#pageInputPigging div.select-exception").hide();


});

//  Input Pigging >> Pigging Schedule
