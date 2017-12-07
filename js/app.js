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


    //  Login Page >> Submit > Foreman
    $("form#userLogin").submit(function () {
        event.preventDefault();
        $(".jsHide").hide();
        $("#pageAdminMenu").show();
    });

    //  Login Page >> Submit > Operator
    //    $("form#userLogin").submit(function () {
    //        event.preventDefault();
    //        $(".jsHide").hide();
    //        $("#pageInputPigging").show();
    //        $("#pageInputPigging #launchTime").prop('required', true);
    //        $("#pageInputPigging div.select-receive").hide();
    //        $("#pageInputPigging div.select-exception").hide();
    //    });

    //  Login Page >> Submit > Report Viewer
    //    $("form#userLogin").submit(function () {
    //        event.preventDefault();
    //        $(".jsHide").hide();
    //        $("#pagePiggingSchedule").show();
    //        $(".foreman-header").hide();
    //        $(".js-operator").hide();
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
    $("#forgotPassword").hide();
    alert("Your password has been reset. Please return to the Login page.");
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

//  Normal Header >> Account Info
$(document).on('click', 'header img', function () {
    $(".jsHide").hide();
    $("#pageUpdateAcct").show();
});

//  Normal Header >> Exit Application
$(document).on('click', 'header img + img', function () {
    $(".jsHide").hide();
    $("#pageLogin").show();
});

//  Update Account Info >> Submit
$(document).on('submit', '#pageUpdateAcct #userUpdateAcct', function () {
    event.preventDefault();
    alert("SUBMIT clicked. I will create a BACK function that takes the user back to her previous page after submitting the udated account info");
    document.getElementById("userUpdateAcct").reset();
    $(".jsHide").hide();
    $("#pageLogin").show();
});

//  Update Account Info >> Cancel
$(document).on('click', '#pageUpdateAcct .js-cancel', function () {

    alert("CANCEL clicked. I will create a BACK function that takes the user back to her previous page after clicking Cancel on this page");
    $(".jsHide").hide();
    $("#pageLogin").show();
});

// USER = FOREMAN

//  Foreman Header >> Admin Menu
$(document).on('click', 'header.foreman-header>div>img', function () {
    $(".jsHide").hide();
    $("#pageAdminMenu").show();
});

//  Admin Menu >> View Pigging Schedule
$(document).on('click', 'p.gotoPiggingSchedule', function () {
    $(".jsHide").hide();
    $("#pagePiggingSchedule").show();
    $("#pagePiggingSchedule .show-to-foreman").show();
});



//  Admin Menu >> Pigging Activity
$(document).on('click', 'p.gotoPiggingActivity', function () {
    $(".jsHide").hide();
    $("#pagePiggingActivity").show();

});


//  Admin Menu >> Add Pipeline
$(document).on('click', 'p.gotoAddPipeline', function () {
    $(".jsHide").hide();
    $("#pageAddPipeline").show();
});

//  Admin Menu >> Update/Remove Pipeline
$(document).on('click', 'p.gotoUdatePipeline', function () {
    $(".jsHide").hide();
    $("#pageUpdatePipeline").show();

});

//  Admin Menu >> Add User
$(document).on('click', 'p.gotoAddUser', function () {
    $(".jsHide").hide();
    $("#pageAddUser").show();

});

//  Admin Menu >> Update/Remove User
$(document).on('click', 'p.gotoUpdateUser', function () {
    $(".jsHide").hide();
    $("#pageUdateUser").show();

});

//  Pigging Schedule (Foreman) >> Previous Launch (via Pipeline Name link)
$(document).on('click', '#pagePiggingSchedule .schedule-results>p', function () {
    $(".jsHide").hide();
    $("#pagePrevLaunch").show();
    $("#pagePrevLaunch header").show();
    $("#pagePrevLaunch .show-to-foreman").show();
});

//  Previous Launch  >> Back (to Pigging Schedule (Foreman))
$(document).on('click', '#pagePrevLaunch .show-to-foreman', function () {
    $(".jsHide").hide();
    $("#pagePiggingSchedule, #pagePiggingSchedule .show-to-foreman").show();
    //    $("#pagePiggingSchedule .show-to-foreman").show();
});

//  Admin Menu >> View Debris Report
$(document).on('click', 'p.gotoDebrisReport', function () {
    $(".jsHide").hide();
    $("#pageDebrisReport").show();
    $("#pageDebrisReport  #debrisReport").show();
    $("#pageDebrisReport .show-to-foreman").show();
});

//  Debris Report >> Radio Debris by System
$(document).on('click', '#pageDebrisReport #radioSystemDebris', function () {
    $("#debrisReport .js-system-debris").show();
    $("#debrisReport .js-pipeline-debris").hide();
});

//  Debris Report >> Radio Debris by Pipeline
$(document).on('click', '#pageDebrisReport #radioPipelineDebris', function () {
    $("#debrisReport .js-system-debris").hide();
    $("#debrisReport .js-pipeline-debris").show();
});

//  Debris Report >> Radio Other Selections
$(document).on('click', '#pageDebrisReport .radio-other-selection', function () {
    $("#debrisReport .jsHide").hide();
});

//  Debris Report (Foreman) >> Submit
$(document).on('submit', '#pageDebrisReport #debrisReport', function () {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageDebrisReport").show();
    $("#pageDebrisReport .show-to-foreman").show();
    $(".debris-results").show();

});
//  Debris Report (Foreman) >> Reset
$(document).on('click', '#pageDebrisReport .submit-reset', function () {
    $(".jsHide").hide();
    $("#pageDebrisReport").show();
    $("#pageDebrisReport #debrisReport").show();
    $("#pageDebrisReport .show-to-foreman").show();
    document.getElementById("debrisReport").reset();
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
    event.preventDefault();
    alert("Pigging activity has been submitted.");
    document.getElementById("inputPigging").reset();

});

//  Input Pigging >> Pigging Schedule (Operator)
$(document).on('click', '#pageInputPigging .ops-nav', function () {
    $(".jsHide").hide();
    $("#pagePiggingSchedule").show();
    $("#pagePiggingSchedule .foreman-header").hide();
    $("#pagePiggingSchedule .js-viewonly").hide();
});


//  Pigging Schedule >> Submit
$(document).on('submit', '#pagePiggingSchedule #piggingSchedule', function () {
    event.preventDefault();
    alert("Pipeline System selection has been submitted. Schedule results will update.");
});



//  Pigging Schedule (Operator) >> Input Pigging
$(document).on('click', '#pagePiggingSchedule .js-operator', function () {
    $(".jsHide").hide();
    $("#pageInputPigging").show();
    $("#pageInputPigging #launchTime").prop('required', true);
    $("#pageInputPigging div.select-receive").hide();
    $("#pageInputPigging div.select-exception").hide();
});

//  Pigging Schedule (Report Viewer) >> Debris Report
$(document).on('click', '#pagePiggingSchedule .js-viewonly', function () {
    $(".jsHide").hide();
    $("#pageDebrisReport").show();
    $("#pageDebrisReport .foreman-header").hide();
    $("#pageDebrisReport #debrisReport").show();
    $(".debris-results").hide();
    $("#debrisReport .js-system-debris").hide();
    $("#debrisReport .js-pipeline-debris").hide();
});



//  Previous Launch >> Back (to Pigging Schedule (Operator))
$(document).on('click', '#pagePrevLaunch .show-to-operator', function () {
    $(".jsHide").hide();
    //    $("#pagePiggingSchedule").show();
    //    $("#pagePiggingSchedule .normal-header").show();
    //    $("#pagePiggingSchedule .foreman-header").hide();
    //    $("#pagePiggingSchedule .js-operator").show();
});

//  Debris Report (Report Viewer) >> Pigging Schedule
$(document).on('click', '#pageDebrisReport .ops-nav', function () {
    $(".jsHide").hide();
    $("#pagePiggingSchedule").show();
    $("#pagePiggingSchedule .foreman-header").hide();
    $("#pagePiggingSchedule .js-operator").hide();
});

//  Debris Report >> Radio Debris by System
$(document).on('click', '#pageDebrisReport #radioSystemDebris', function () {
    $("#debrisReport .js-system-debris").show();
    $("#debrisReport .js-pipeline-debris").hide();
});

//  Debris Report >> Radio Debris by Pipeline
$(document).on('click', '#pageDebrisReport #radioPipelineDebris', function () {
    $("#debrisReport .js-system-debris").hide();
    $("#debrisReport .js-pipeline-debris").show();
});
