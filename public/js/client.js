"use strict";

//Step One: define functions, objects, variables
//function pageCreateAcct() {
//    $("#pageCreateAcct").show();
//}



//Step Two: Use functions, object, variables (triggers)
$(document).ready(function () {
    //  Hides All
    $(".jsHide").hide();

    //  Shows Login Page
    $("#pageLogin").show();
    //Hides Forgot Password form
    $("#forgotPassword").hide();


    //  Login Page >> Submit > Foreman
    $("form#userLogin").submit(function (event) {
        event.preventDefault();

        const email = $(this).parent().parent().find('#email-login').val();
        const password = $(this).parent().parent().find('#pwd-login').val();

        //    console.log(email, password);

        $(this).parent().parent('input').blur();

        if (!email || !password) {
            alert("Both fields are required.");
            if (!email) {
                $('#email-login').focus();
            } else
            if (!password) {
                $('#pwd-login').focus();
            };
        } else {

            //Success Scenario for Foreman
            $(".jsHide").hide();
            $("#pageAdminMenu").show();
        };
    });

    //  Login Page >> Submit > Operator
    //    $("form#userLogin").submit(function (event) {
    //        event.preventDefault();
    //        $(".jsHide").hide();
    //        $("#pageInputPigging").show();
    //        $("#pageInputPigging #launchTime").prop('required', true);
    //        $("#pageInputPigging div.select-receive").hide();
    //        $("#pageInputPigging div.select-exception").hide();
    //    });

    //  Login Page >> Submit > Report Viewer
    //    $("form#userLogin").submit(function (event) {
    //        event.preventDefault();
    //        $(".jsHide").hide();
    //        $("#pagePiggingSchedule").show();
    //        $(".foreman-header").hide();
    //        $(".js-operator").hide();
    //
    //    });


    //  Login Page >> Forgot Password
    $("form#userLogin + p a").click(function (event) {
        event.preventDefault();
        $("#forgotPassword").toggle();
    });

    //  Login Page >> Create Account
    $("form#forgotPassword + p a").click(function (event) {
        event.preventDefault();
        $(".jsHide").hide();
        $("#pageCreateAcct").show();
    });
});


//  Login >> Forgot Your Password >> Cancel
$(document).on('click', '#forgotPassword .js-cancel', function (event) {
    event.preventDefault();
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
$(document).on('click', '#userPwdReset .js-cancel', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageLogin").show();
    $("#forgotPassword").hide();
});


//  Create Account Page >> Submit
$(document).on('submit', '#userCreateAcct', function (event) {
    event.preventDefault();
    const fname = $(this).parent().parent().find('#fName-createAcct').val();
    const lname = $(this).parent().parent().find('#lName-createAcct').val();
    const email = $(this).parent().parent().find('#email-createAcct').val();
    const password = $(this).parent().parent().find('#pwd-createAcct').val();
    const pwdConfirm = $(this).parent().parent().find('#pwd-confirm-createAcct').val();
    //    console.log(fname, lname, email, password, pwdConfirm);
    $(this).parent().parent('input').blur();

    if (!fname || !lname || !email || !password || !pwdConfirm) {
        alert("All fields are required.");
        if (!fname) {
            $('#fName-createAcct').focus();

        } else
        if (!lname) {
            $('#lName-createAcct').focus();
        } else
        if (!email) {
            $('#email-createAcct').focus();
        } else
        if (!password) {
            $('#pwd-createAcct').focus();
        } else
        if (!pwdConfirm) {
            $('#pwd-confirm-createAcct').focus();
        };
    } else {

        //Success Scenario
        $(".jsHide").hide();
        $("#pageLogin").show();
        $("#forgotPassword").hide();
        $("form#forgotPassword + p").hide();
        alert("Your account request has been sent to the Pipeline Foreman for approval.");
    };

});

//  Create Account Page >> Cancel
$(document).on('click', '#userCreateAcct .js-cancel', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageLogin").show();
    $("#forgotPassword").hide();
});

//  Normal Header >> Account Info
$(document).on('click', 'header img', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageUpdateAcct").show();
});

//  Normal Header >> Exit Application
$(document).on('click', 'header img + img', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageLogin").show();
});

//  Update Account Info >> Submit
$(document).on('submit', '#pageUpdateAcct #userUpdateAcct', function (event) {
    event.preventDefault();
    alert("SUBMIT clicked. I will create a BACK function that takes the user back to her previous page after submitting the udated account info");
    document.getElementById("userUpdateAcct").reset();
    $(".jsHide").hide();
    $("#pageLogin").show();
});

//  Update Account Info >> Cancel
$(document).on('click', '#pageUpdateAcct .js-cancel', function (event) {
    event.preventDefault();

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

//*** Admin Menu >> View Pigging Schedule
$(document).on('click', 'p.gotoPiggingSchedule', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pagePiggingSchedule").show();
    $("#pagePiggingSchedule .show-to-foreman").show();
});

//  Pigging Schedule (Foreman) >> Previous Launch (via Pipeline Name link)
$(document).on('click', '#pagePiggingSchedule .schedule-results>p', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pagePrevLaunch").show();
    $("#pagePrevLaunch header").show();
    $("#pagePrevLaunch .show-to-foreman").show();
});

//  Previous Launch  >> Back (to Pigging Schedule (Foreman))
$(document).on('click', '#pagePrevLaunch .show-to-foreman', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pagePiggingSchedule, #pagePiggingSchedule .show-to-foreman").show();

});

//*** Admin Menu >> View Debris Report
$(document).on('click', 'p.gotoDebrisReport', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageDebrisReport").show();
    $("#pageDebrisReport  #debrisReport").show();
    $("#pageDebrisReport .show-to-foreman").show();
});

//  Debris Report, Activity Report >> Radio Select by System
$(document).on('click', '#radioSystemDebris, #radioSystemPigs', function (event) {
    event.preventDefault();
    $(".js-system-select").show();
    $(".js-pipeline-select").hide();
});

//  Debris Report, Activity Report >> Radio Select by Pipeline
$(document).on('click', '#radioPipelineDebris, #radioPipelinePigs', function (event) {
    event.preventDefault();
    $(".js-system-select").hide();
    $(".js-pipeline-select").show();
});

//  Debris Report, Activity Report >> Radio Other Selections
$(document).on('click', '.radio-other-selection', function (event) {
    event.preventDefault();
    $("form .jsHide").hide();
});

//  Debris Report (Foreman) >> Submit
$(document).on('submit', '#pageDebrisReport #debrisReport', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageDebrisReport").show();
    $("#pageDebrisReport .show-to-foreman").show();
    $(".debris-results").show();
});
//  Debris Report (Foreman) >> Reset
$(document).on('click', '#pageDebrisReport .submit-reset', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageDebrisReport").show();
    $("#pageDebrisReport #debrisReport").show();
    $("#pageDebrisReport .show-to-foreman").show();
    document.getElementById("debrisReport").reset();
});

//*** Admin Menu >> Pigging Activity
$(document).on('click', 'p.gotoPiggingActivity', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pagePiggingActivity").show();
    $("#piggingActivity").show();
});

//  Pigging Activity >> Submit
$(document).on('submit', '#piggingActivity', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pagePiggingActivity").show();
    $(".pigging-activity-results").show();
    document.getElementById("piggingActivity").reset();
});

//  Pigging Activity >> Reset
$(document).on('click', '#pagePiggingActivity button[type="button"]',
    function (event) {
        event.preventDefault();
        $(".jsHide").hide();
        $("#pagePiggingActivity").show();
        $("#piggingActivity").show();
    });

//*** Admin Menu >> View Pigging History
$(document).on('click', 'p.gotoViewHistory', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageViewHistory").show();
    $("#piggingHistory").show();
});

//  Pigging History >> Submit
$(document).on('submit', '#piggingHistory', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageViewHistory").show();
    $(".history-results").show();
    $("#pageViewHistory .bottom-nav").show();
    document.getElementById("piggingHistory").reset();
});

//  Pigging History >> Reset
$(document).on('click', '#pageViewHistory .bottom-nav', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageViewHistory").show();
    $("#piggingHistory").show();
});

//  Pigging History >> Update Pigging History (via link from history record)
$(document).on('click', '#pageViewHistory p.history-record-id', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageUpdateHistory").show();
});

//  Update History >> Submit
$(document).on('submit', '#updateHistory', function (event) {
    event.preventDefault();
    alert("Updates submitted successfully.");
    $(".jsHide").hide();
    $("#pageViewHistory").show();
    $("#piggingHistory").show();
});

//  Update History >> Cancel
$(document).on('click', '#pageUpdateHistory .button-cancel', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageViewHistory").show();
    $("#piggingHistory").show();
});

//  Update History >> Delete
$(document).on('click', '#pageUpdateHistory .button-delete', function (event) {
    event.preventDefault();
    if (window.confirm("Are you sure you want to PERMANENTLY DELETE this record?")) {
        alert("Record has be sucessfully deleted.");
    };
    $(".jsHide").hide();
    $("#pageViewHistory").show();
    $("#piggingHistory").show();
});

//*** Admin Menu >> Add Pipeline
$(document).on('click', 'p.gotoAddPipeline', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageAddPipeline").show();

});

//   Add Pipeline >> Submit
$(document).on('submit', '#pageAddPipeline', function (event) {
    event.preventDefault();
    if (window.confirm("Pipeline added successfully. Would you like to add another pipeline?")) {
        $(".jsHide").hide();
        $("#pageAddPipeline").show();
        document.getElementById("addPipeline").reset();
    } else {
        $(".jsHide").hide();
        $("#pageAdminMenu").show();
    }
});

//   Add Pipeline >> Cancel
$(document).on('click', '#pageAddPipeline .button-cancel', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageAdminMenu").show();
});

//*** Admin Menu >> Update/Remove Pipeline
$(document).on('click', 'p.gotoUdatePipeline', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageUpdatePipeline").show();
    $("#updateSearch").show();
});

//  Update/Remove Pipeline (Search form) >> Submit
$(document).on('submit', '#updateSearch', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageUpdatePipeline").show();
    $("#updatePipeline").show();
    $("#pageUpdatePipeline .submit-cancel-delete").show();
    document.getElementById("updateSearch").reset();
});

//  Update/Remove Pipeline >> Cancel
$(document).on('click', '#pageUpdatePipeline .button-cancel', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageAdminMenu").show();
});

//  Update/Remove Pipeline (Update form) >> Submit
$(document).on('submit', '#updatePipeline', function (event) {
    event.preventDefault();
    alert("Pipeline information updated successfully.");
    document.getElementById("updateSearch").reset();
    $(".jsHide").hide();
    $("#pageUpdatePipeline").show();
    $("#updateSearch").show();
});


//  Update/Remove Pipeline (Update form) >> Delete
$(document).on('click', '#pageUpdatePipeline .button-delete', function (event) {
    event.preventDefault();
    if (window.confirm("Are you sure you want to PERMANENTLY DELETE this pipeline record?")) {
        alert("Record has be sucessfully deleted.");
    }
    $(".jsHide").hide();
    $("#pageUpdatePipeline").show();
    $("#updateSearch").show();
});

//*** Admin Menu >> Add User
$(document).on('click', 'p.gotoAddUser', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageAddUser").show();
    $("#findUser").show();
});

//  Add User (Search form) >> Submit
$(document).on('submit', '#findUser', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageAddUser").show();
    $("#assignRole").show();
    document.getElementById("findUser").reset();
});

//  Add User >> Cancel (for both Cancel buttons on page)
$(document).on('click', '#pageAddUser .button-cancel', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageAdminMenu").show();
});

//  Add User (Assign Role form) >> Submit
$(document).on('submit', '#assignRole', function (event) {
    event.preventDefault();
    alert("User added successfully.")
    $(".jsHide").hide();
    $("#pageAddUser").show();
    $("#findUser").show();
});

//*** Admin Menu >> Update/Remove User
$(document).on('click', 'p.gotoUpdateUser', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageUpdateUser").show();
    $("#findUpdateUser").show();
});

//  Update User (Search form) >> Submit
$(document).on('submit', '#findUpdateUser', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageUpdateUser").show();
    $("#updateRole").show();
    document.getElementById("findUpdateUser").reset();
});

//  Update User (Update form) >> Submit
$(document).on('submit', '#updateRole', function (event) {
    event.preventDefault();
    alert("User role and/or status has been updated.");
    document.getElementById("findUpdateUser").reset();
    $(".jsHide").hide();
    $("#pageUpdateUser").show();
    $("#findUpdateUser").show();
});

//  Update User >> Cancel (for both Cancel buttons on page)
$(document).on('click', '#pageUpdateUser .button-cancel', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageAdminMenu").show();
});




//  Input Pigging >> Radio Launch
$(document).on('click', '#pageInputPigging #radioLaunch', function (event) {
    event.preventDefault();
    $("#pageInputPigging div.select-launch").show();
    $("#pageInputPigging #launchTime").prop('required', true);


    $("#pageInputPigging div.select-receive").hide();
    $("#pageInputPigging #receiveTime").prop('required', false);

    $("#pageInputPigging div.select-exception").hide();
    $("#pageInputPigging #exceptionTime").prop('required', false);

});

//  Input Pigging >> Radio Receive
$(document).on('click', '#pageInputPigging #radioReceive', function (event) {
    event.preventDefault();
    $("#pageInputPigging div.select-launch").hide();
    $("#pageInputPigging #launchTime").prop('required', false);

    $("#pageInputPigging div.select-receive").show();
    $("#pageInputPigging #receiveTime").prop('required', true);

    $("#pageInputPigging div.select-exception").hide();
    $("#pageInputPigging #exeptionTime").prop('required', false);

});

//  Input Pigging >> Radio Exception
$(document).on('click', '#pageInputPigging #radioException', function (event) {
    event.preventDefault();
    $("#pageInputPigging div.select-launch").hide();
    $("#pageInputPigging #launchTime").prop('required', false);


    $("#pageInputPigging div.select-receive").hide();
    $("#pageInputPigging #receiveTime").prop('required', false);

    $("#pageInputPigging div.select-exception").show();
    $("#pageInputPigging #exceptionTime").prop('required', true);

});



//  Input Pigging >> Submit
$(document).on('submit', '#pageInputPigging #inputPigging', function (event) {
    event.preventDefault();
    alert("Pigging activity has been submitted.");
    document.getElementById("inputPigging").reset();

});

//  Input Pigging >> Pigging Schedule (Operator)
$(document).on('click', '#pageInputPigging .ops-nav', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pagePiggingSchedule").show();
    $("#pagePiggingSchedule .foreman-header").hide();
    $("#pagePiggingSchedule .js-viewonly").hide();
});


//  Pigging Schedule >> Submit
$(document).on('submit', '#pagePiggingSchedule #piggingSchedule', function (event) {
    event.preventDefault();
    alert("Pipeline System selection has been submitted. Schedule results will update.");
});



//  Pigging Schedule (Operator) >> Input Pigging
$(document).on('click', '#pagePiggingSchedule .js-operator', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageInputPigging").show();
    $("#pageInputPigging #launchTime").prop('required', true);
    $("#pageInputPigging div.select-receive").hide();
    $("#pageInputPigging div.select-exception").hide();
});

//  Pigging Schedule (Report Viewer) >> Debris Report
$(document).on('click', '#pagePiggingSchedule .js-viewonly', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageDebrisReport").show();
    $("#pageDebrisReport .foreman-header").hide();
    $("#pageDebrisReport #debrisReport").show();
    $(".debris-results").hide();
    $("#debrisReport .js-system-debris").hide();
    $("#debrisReport .js-pipeline-debris").hide();
});



//  Previous Launch >> Back (to Pigging Schedule (Operator))
$(document).on('click', '#pagePrevLaunch .show-to-operator', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    //    $("#pagePiggingSchedule").show();
    //    $("#pagePiggingSchedule .normal-header").show();
    //    $("#pagePiggingSchedule .foreman-header").hide();
    //    $("#pagePiggingSchedule .js-operator").show();
});

//  Debris Report (Report Viewer) >> Pigging Schedule
$(document).on('click', '#pageDebrisReport .ops-nav', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pagePiggingSchedule").show();
    $("#pagePiggingSchedule .foreman-header").hide();
    $("#pagePiggingSchedule .js-operator").hide();
});
