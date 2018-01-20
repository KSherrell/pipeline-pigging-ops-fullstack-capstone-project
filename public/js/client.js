"use strict";

//Step One: define functions, objects, variables

let currentUserFName = "";
let currentUserLName = "";
let currentUserEmail = "";
let currentUserRole = "";
let currentUserActive = "";
let currentUserID = "";
let currentUserPassword = "";

function loginUser(email, password) {
    let loginObject = {
        email: email,
        password: password
    };
    $.ajax({
            type: "POST",
            url: "/users/login",
            dataType: 'json',
            data: JSON.stringify(loginObject),
            contentType: 'application/json'
        })
        .done(function (result) {

            currentUserFName = result.fname;
            currentUserLName = result.lname;
            currentUserEmail = result.email;
            currentUserRole = result.role;
            currentUserID = result._id;
            currentUserActive = result.approved;
            currentUserPassword = result.password;

            //I'm (maybe) creating this global variable on purpose
            //            currentUserObj = {
            //                currentUserFName: result.fname,
            //                currentUserLName: result.lname,
            //                currentUserEmail: result.email,
            //                currentUserRole: result.role,
            //                currentUserID: result._id,
            //                currentUserActive: result.approved
            //            };

            if (currentUserRole == "foreman") {
                $(".jsHide").hide();
                $("#pageAdminMenu").show();
            } else if (currentUserRole == "operator") {

                //operatorFunction
                $(".jsHide").hide();
                $("#pageInputPigging").show();
                $("#pageInputPigging div.select-receive").hide();
                $("#pageInputPigging div.select-exception").hide();
                // selectPipeline();

            } else if (currentUserRole == "reportViewer") {
                $(".jsHide").hide();
                $("#pagePiggingSchedule").show();
                $(".foreman-header").hide();
                $(".js-operator").hide();

            } else {
                alert("User found but not active. Please contact the Pipeline Foreman.");
            }

        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            alert('Invalid username and password combination. Please check your username and password and try again.');
        });
}

function getUserByEmail(email, origin, userObj) {

    $.ajax({
            type: "GET",
            url: "/users/check-email/" + email,
            dataType: 'json',
            contentType: 'application/json'
        })
        .done(function (result) {
            let userID = result._id;
            let userActive = result.approved;

            if (origin == "resetpwd") {
                console.log("origin = " + origin);
                resetPwdPage(userID, userActive, email);
            } else if (origin == "createacct") {
                if (userActive == 0) {
                    alert("User found but not active. Please contact the Pipeline Foreman.")
                } else {
                    alert("User already exists. Please login normally.")
                }
                $(".jsHide").hide();
                $("#pageLogin").show();
                $("#forgotPassword").hide();
            } else if (origin == "login") {
                loginUser(email, userObj.password);
            }
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            //user not found
            if (origin == "resetpwd") {
                let userActive = "usernotfound";
                resetPwdPage(userID, userActive, email);
            } else if (origin == "createacct") {
                registerNewUser(userObj);
            } else if (origin == "login") {
                alert("User not found.");
            }

        })
};

function resetPwdPage(userID, userActive, email) {

    if (userActive == "usernotfound") {
        alert("User not found.");
        $(".jsHide").hide();
        $("#pageLogin").show();
        $("#forgotPassword").hide();
    } else if (userActive == 0) {
        alert("User account not active. Please contact the Pipeline Foreman.");
        $(".jsHide").hide();
        $("#pageLogin").show();
        $("#forgotPassword").hide();
    } else if (userActive == 1) {
        //load reset password page
        console.log("userActive = 1");
        console.log(email);
        $(".jsHide").hide();
        $("#pageResetPwd").show();
        $("#pageResetPwd #userEmail").text(email);

        //user inputs new password
        $(document).on('submit', '#userPwdReset', function (event) {
            event.preventDefault();
            let newPwd = $("#pageResetPwd #newPwd").val();
            let newPwdReenter = $("#pageResetPwd #newPwdReenter").val();
            $("#pageResetPwd #userEmailHidden").val(email);

            if (!newPwd || !newPwdReenter) {
                alert("Both fields are required.");
                if (!newPwd) {
                    $('#pageResetPwd #newPwd').focus();
                } else
                if (!newPwdReenter) {
                    $('#pageResetPwd #newPwdReenter').focus();
                } else if (newPwd !== newPwdReenter) {
                    alert("Passwords must match exactly.");
                    $('#pageResetPwd #newPwdReenter').focus().val("");
                }
            } else {
                let updateUserPwdObj = {
                    password: newPwd
                };
                console.log(updateUserPwdObj);
                $.ajax({
                        type: "PUT",
                        url: "/users/reset-pwd/" + userID,
                        data: JSON.stringify(updateUserPwdObj),
                        dataType: 'json',
                        contentType: 'application/json'
                    })
                    .done(function (result) {
                        //console.log(result);
                        //reset password success scenario
                        $(".jsHide").hide();
                        $("#pageLogin").show();
                        $("#forgotPassword").hide();
                        alert("Your password has been reset. Please use your new password to login.");

                    })
                    .fail(function (jqXHR, error, errorThrown) {
                        console.log(jqXHR);
                        console.log(error);
                        console.log(errorThrown);
                        //user not found
                        alert("Error resetting password. Please try again.");
                        $('#pageResetPwd #userPwdReset input').val("");
                    })

            };
        });
    };
}

function registerNewUser(userObj) {
    $.ajax({
            type: 'POST',
            url: '/users/create',
            dataType: 'json',
            data: JSON.stringify(userObj),
            contentType: 'application/json'
        })
        .done(function (result) {
            console.log(result);
            $(".jsHide").hide();
            $("#pageLogin").show();
            $("#forgotPassword").hide();
            $("form#forgotPassword + p").hide();
            alert("Your Create Account request has been sent to the Pipeline Foreman for approval.");
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
};

//Step Two: Use functions, object, variables (triggers)


$(document).ready(function () {
    //  Hides All
    $(".jsHide").hide();

    //  Shows Login Page
    $("#pageLogin").show();

    //  Hides Forgot Password form
    $("#forgotPassword").hide();

    //  Login Page >> Submit
    $("form#userLogin").submit(function (event) {
        event.preventDefault();
        let origin = "login"
        let email = $('#pageLogin #userLogin #userEmail').val();
        let password = $('#pageLogin #userLogin #userPwd').val();

        $('#pageLogin #userLogin input').blur();
        if (!email || !password) {
            alert("Both fields are required.");
            if (!email) {
                $('#pageLogin #userLogin #userEmail').focus();
            } else
            if (!password) {
                $('#pageLogin #userLogin #userPwd').focus();
            };
        } else {
            let userObj = {
                email: email,
                password: password
            }
            getUserByEmail(email, origin, userObj);
        };
    });

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
    let email = $('#pageLogin #forgotPassword #userEmail').val();
    if (!email) {
        alert("Please enter your email address.");
        $('#pageLogin #forgotPassword #userEmail').focus();
    } else {
        getUserByEmail(email, "resetpwd");
    };
});

//  Password Reset Page  >> Cancel
$(document).on('click', '#userPwdReset .js-cancel', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageLogin").show();
    $("#forgotPassword").hide();
});

//  Create Account Page  >> Submit
$(document).on('submit', '#userCreateAcct', function (event) {
    event.preventDefault();
    let fname = $('#pageCreateAcct #fName').val();
    let lname = $('#pageCreateAcct #lName').val();
    let email = $('#pageCreateAcct #userEmail').val();
    let password = $('#pageCreateAcct #userPwd').val();
    let pwdConfirm = $('#pageCreateAcct #pwdConfirm').val();

    $('#pageCreateAcct input').blur();
    if (!fname || !lname || !email || !password || !pwdConfirm) {
        alert("All fields are required.");
        if (!fname) {
            $('#pageCreateAcct #fName').focus();
        } else
        if (!lname) {
            $('#pageCreateAcct #lName').focus();
        } else
        if (!email) {
            $('#pageCreateAcct #userEmail').focus();
        } else
        if (!password) {
            $('#pageCreateAcct #userPwd').focus();
        } else
        if (!pwdConfirm) {
            $('#pageCreateAcct #pwdConfirm').focus();
        };
    } else if (password !== pwdConfirm) {
        alert("The passwords must match exactly.");
        $('#pageCreateAcct #pwdConfirm').focus().val("");
    } else {
        //does user already exist?
        let newUserObj = {
            fname: fname,
            lname: lname,
            email: email,
            password: password
        };
        getUserByEmail(email, "createacct", newUserObj);
    };
});

//  Create Account Page >> Cancel
$(document).on('click', '#userCreateAcct .js-cancel', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageLogin").show();
    $("#forgotPassword").hide();
});


//  Normal Header >> Exit Application
//page refresh to log out
$(document).on('click', 'header img + img', function (event) {
    event.preventDefault();
    //currentUserObj = {};
    $(".jsHide").hide();
    $("#pageLogin").show();
});


//  Normal Header >> Account Info
$(document).on('click', 'header img', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageUpdateAcct").show();
    $("#pageUpdateAcct #firstName").val(currentUserFName);
    $("#pageUpdateAcct #lastName").val(currentUserLName);
    $("#pageUpdateAcct #email").val(currentUserEmail);
    //    $("#pageUpdateAcct #password").val("currentUserPassword");
});

//  Update Account Info >> Submit
//  UPDATE USER NAME, EMAIL
$(document).on('submit', '#pageUpdateAcct #userUpdateAcctName', function (event) {
    event.preventDefault();
    let fname = $("#pageUpdateAcct #firstName").val();
    let lname = $("#pageUpdateAcct #lastName").val();
    let email = $("#pageUpdateAcct #email").val();
    let updateUserNameObj = {
        fname: fname,
        lname: lname,
        email: email
    };

    $('#pageCreateAcct input').blur();
    if (!fname || !lname || !email) {
        alert("All fields are required.");
        if (!fname) {
            $('#pageUpdateAcct #firstName').focus();
        } else if (!lname) {
            $('#pageUpdateAcct #lastName').focus();
        } else if (!email) {
            $('#pageUpdateAcct #email').focus();
        }
    } else {
        $.ajax({
                type: "PUT",
                url: "/users/reset-name/" + currentUserID,
                data: JSON.stringify(updateUserNameObj),
                dataType: 'json',
                contentType: 'application/json'
            })
            .done(function (result) {
                alert("Account updated. Please login using your updated credentials.");
            $(".jsHide").hide();
            $("#pageLogin").show();

            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                //user not found
                alert("Error updating account information. Please try again.");

            })
    }
});

//new trigger for this pwd change PUT request
$(document).on('submit', '#pageUpdateAcct #userUpdateAcctPwd', function (event) {
    event.preventDefault();
    let updateUserPwdObj = {
        password: $("#pageUpdateAcct #newPwd").val()
    }
    $.ajax({
            type: "PUT",
            url: "/users/reset-pwd/" + currentUserID,
            data: JSON.stringify(updateUserPwdObj),
            dataType: 'json',
            contentType: 'application/json'
        })
        .done(function (result) {

            alert("Account updated.");
            if (currentUserRole == "operator") {
                //operatorFunction
                $(".jsHide").hide();
                $("#pageInputPigging").show();
                $("#pageInputPigging div.select-receive").hide();
                $("#pageInputPigging div.select-exception").hide();
                // selectPipeline();
            } else if (currentUserRole == "foreman") {
                alert("foreman updating account");
            } else {
                alert("report viewer updating account");
            }
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            //user not found
            alert("Error updating account information. Please try again.");

        })


});



//$(document).getElementById("userUpdateAcct").reset();
//$(".jsHide").hide();
//$("#pageLogin").show();

//  Update Account Info >> Cancel
$(document).on('click', '#pageUpdateAcct .js-cancel', function (event) {
    event.preventDefault();

    alert("CANCEL clicked.");
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

//Input Pigging System and Pipeline Selection
//need to target document not the form bc the form is hidden when the page loads
$(document).change("#systems", function (event) {

    //get value from system selection input, make api call which will return the list of pipelines
})

//function selectPipeline() {
//
//    let selectOptions = {
//        "System 1": ["Alabama Pipeline",
//                "Alaska Pipeline",
//                "Arizona Pipeline"
//            ],
//
//        "System 2": ["California Pipeline",
//                "Colorado Pipeline",
//                "Connecticut Pipeline"
//            ],
//        "System 3": ["Idaho Pipeline",
//                "Illinois Pipeline",
//                "Indiana Pipeline"
//            ]
//    };
//
//
//    let systemsOptions = Object.keys(selectOptions);
//    console.log(systemsOptions);
//
//
//    let pipelinesOptions = Object.values(selectOptions[0]);
//    console.log(pipelinesOptions);
//
//
//};



//  Input Pigging >> Radio Launch
$(document).on('click', '#pageInputPigging #radioLaunch', function () {

    $("#pageInputPigging div.select-launch").show();
    $("#pageInputPigging div.select-receive").hide();
    $("#pageInputPigging div.select-exception").hide();


});

//  Input Pigging >> Radio Receive
$(document).on('click', '#pageInputPigging #radioReceive', function () {
    $("#pageInputPigging div.select-launch").hide();
    $("#pageInputPigging div.select-receive").show();
    $("#pageInputPigging div.select-exception").hide();

});

//  Input Pigging >> Radio Exception
$(document).on('click', '#pageInputPigging #radioException', function () {
    $("#pageInputPigging div.select-launch").hide();
    $("#pageInputPigging div.select-receive").hide();
    $("#pageInputPigging div.select-exception").show();

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


// show the signout link in header as soon as user is signed in
//        $('#js-signout-link').show();
//        if (newUserToggle === true) {
//            showAddPage();
//        } else {
//            showHomePage();
//        }
