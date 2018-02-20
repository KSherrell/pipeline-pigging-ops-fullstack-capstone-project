"use strict";

//Step One: define functions, objects, variables

let currentUserFName = "";
let currentUserLName = "";
let currentUserEmail = "";
let currentUserRole = "";
let currentUserActive = "";
let currentUserID = "";
let currentUserPassword = "";
let activePage = "";
let pipelineID = "";
let userValuesArr = [];


function validateSelect(selectionValue, defaultValue) {
    let validateOutput = true;
    if (selectionValue == defaultValue) {
        validateOutput = false;
    }
    return validateOutput;
}

function validateCheckbox(checkboxArray) {
    let validateValue = true;
    if (checkboxArray == "[]") {
        validateValue = false;
    }
    return validateValue;
}

function validateEmail(inputEmail) {
    let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    //let emailFormat = /^(\w+[\.]\w+)*@nblenergy.com+$/; //to restrict access to users with nblenergy.com email addresses
    if (inputEmail.match(emailFormat)) {
        return true;
    } else {
        return false;
    }
}

function checkForAccountRequests() {
    $.ajax({
            type: 'GET',
            url: '/users/requests',
            dataType: 'json',
            contentType: 'application/json'
        })
        .done(function (result) {
            //console.log(result, result.length);
            let userRequestObj = {};
            for (let i = 0; i < result.length; i++) {
                if (result[i].approved == 0) {
                    userRequestObj = {
                        name: result[i].fname + " " + result[i].lname,
                        email: result[i].email
                    };
                    userValuesArr.push(userRequestObj);
                }
            }
            if (userValuesArr.length > 0) {
                alert("You have " + userValuesArr.length + " new account requests awaiting approval.");
            }
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

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


            if (currentUserActive == 4) {
                alert("Your account request has been denied. Please contact the Pipeline Foreman for more information.");
                $(".jsHide").hide();
                $("#pageLogin").show();
                $("#forgotPassword").hide();
                $("#pageLogin p").html("");

            } else {
                if (currentUserRole == "Foreman") {
                    $(".jsHide").hide();
                    $("#pageAdminMenu").show();
                    activePage = "adminMenu";
                    checkForAccountRequests();

                } else if (currentUserRole == "Operator") {
                    $(".jsHide").hide();
                    $("#pageInputPigging").show();
                    $("#pageInputPigging div.select-receive").hide();
                    $("#pageInputPigging div.select-exception").hide();
                    activePage = "inputPigging";
                    getSystems("#inputPigging #systemName");
                } else if (currentUserRole == "Report_Viewer") {
                    $(".jsHide").hide();
                    $("#pagePiggingSchedule").show();
                    $(".foreman-header").hide();
                    $(".show-to-operator").hide();
                    activePage = "piggingScheduleRV";
                } else {
                    alert("User found but not active. Please contact the Pipeline Foreman.");
                }
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
    //this function checks if the email is a valid format; if yes, it checks to see if users already exist. If user does not exist, new users are created; if user exists, then login continues or passwords are reset (or user is directed to contact the Pipeline Foreman.)
    if (validateEmail(email)) {
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
                } else if (origin == "updateuser") {
                    $(".jsHide").hide();
                    $("#pageUpdateUser").show();
                    $("#updateRole").show();
                    document.getElementById("findUpdateUser").reset();
                    updateUserRoleFormFill(result);
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
                } else if (origin == "login" || origin == "updateuser") {
                    alert("User not found.");
                    if (origin == "updateuser") {
                        $("#findUpdateUser #userEmail").val("").focus();
                    }
                }
            })
    } else {
        alert("Invalid email format.");
    }
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
                $.ajax({
                        type: "PUT",
                        url: "/users/reset-pwd/" + userID,
                        data: JSON.stringify(updateUserPwdObj),
                        dataType: 'json',
                        contentType: 'application/json'
                    })
                    .done(function (result) {
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

function updateUserRoleFormFill(userObj) {
    console.log(userObj);

    let userUpdateStatus = "";
    if (userObj.approved == 1) {
        userUpdateStatus = "Active";
        $("input[id=radioUserActive]").prop("checked", true);
    } else {
        userUpdateStatus = "Inactive";
        $("input[id=radioUserInactive]").prop("checked", true);
    };

    $("#updateRole #userUpdateName").text(userObj.fname + " " + userObj.lname);
    $("#updateRole #userUpdateRole").text(userObj.role);
    $("#updateRole #userUpdateStatus").text(userUpdateStatus);
    $('input[id="' + userObj.role + '"]').prop("checked", true);
    $("#updateRole #userEmailHidden").val(userObj.email);

};

function arrayDuplicates(arr) {
    var i,
        len = arr.length,
        temp = [],
        obj = {};
    for (i = 0; i < len; i++) {
        obj[arr[i]] = 0;
    }
    for (i in obj) {
        temp.push(i);
    }
    return temp;
};

function populateDropDown(optionValues, container) {
    let buildList = "";
    buildList += '<option value = "select-option" selected>Select Option</option>'
    $(container).html('');
    $.each(optionValues,
        function (key, value) {
            buildList += '<option value = "' + key + '">' + value + '</option>';
        })
    $(container).html(buildList);
};

function getReportCenters(container) {
    //this function will get a list of RC names, and populate a drop down selection list with those RC names
    $.ajax({
            type: "GET",
            url: '/reportcenters',
            dataType: 'json',
            contentType: 'application/json'

        })
        .done(function (result) {
            //pulling the RC Names from result and putting them into an array
            let optionValues = [];
            for (let options in result) {
                optionValues.push(result[options].RCName);
            }
            //removing duplicates from optionValues
            optionValues = arrayDuplicates(optionValues);

            //sending the optimized optionValues to be used in the appropriate drop down menu (container)
            populateDropDown(optionValues, container);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        })
};

function getSystemsByRC(selectionValue, container) {
    //this function will get a list of System names based on the RC Name selection
    console.log(selectionValue, container);
    $.ajax({
            type: "GET",
            url: '/systems/' + selectionValue,
            dataType: 'json',
            contentType: 'application/json'

        })
        .done(function (result) {
            let optionValues = [];
            for (let options in result) {
                optionValues.push(result[options].systemName);
            }
            optionValues = arrayDuplicates(optionValues);
            populateDropDown(optionValues, container);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        })
};

function getSystems(container) {
    //console.log(container);
    $.ajax({
            type: 'GET',
            url: '/systems',
            dataType: 'json',
            contentType: 'application/json'

        })
        .done(function (result) {
            let optionValues = [];
            for (let options in result) {
                optionValues.push(result[options].systemName);
            }
            optionValues = arrayDuplicates(optionValues);
            populateDropDown(optionValues, container);
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        })
};

function getLauncher(pipelineValue, container) {
    console.log(pipelineValue, container);
    $.ajax({
            type: 'GET',
            url: '/launchers/' + pipelineValue,
            dataType: 'json',
            contentType: 'application/json'

        })
        .done(function (result) {
            console.log(result);
            $(container).text(result[0].launcherName);
        })

        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        })
};

function getPigs(pipelineValue, container) {
    console.log(pipelineValue, container);
    $.ajax({
            type: 'GET',
            url: '/launchers/' + pipelineValue,
            dataType: 'json',
            contentType: 'application/json'

        })
        .done(function (result) {
            console.log(result);

            //creating an array from the stringified result (array was stringified before being submitted and is coming back as a string)
            let inputPigs = result[0].acceptablePigs;
            inputPigs = inputPigs.replace(/["\[\]]/g, "");
            inputPigs = inputPigs.split(",");
            console.log(inputPigs);
            populateDropDown(inputPigs, container);
        })

        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        })
};

function getExceptions(container) {
    console.log(container);
    $.ajax({
            type: 'GET',
            url: '/exceptions',
            dataType: 'json',
            contentType: 'application/json'

        })
        .done(function (result) {
            console.log(result);
            let optionValues = [];
            for (let options in result) {
                optionValues.push(result[options].exception);
            }
            optionValues = arrayDuplicates(optionValues);
            populateDropDown(optionValues, container);

        })

        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        })
};

function getPipelineNames(selectionValue, container, newPipelineObj) {
    //this function will return a list of Pipeline names based on the System name selection; the returned pipeline names will be used to create a drop down selection list or to compare against values in a newPipelineObj
    $.ajax({
            type: "GET",
            url: '/pipelines/' + selectionValue,
            dataType: 'json',
            contentType: 'application/json'
        })
        .done(function (result) {
            let optionValues = [];
            for (let options in result) {
                optionValues.push(result[options].pipelineName);
            }
            // if newPipelineObj has a value, then a new pipeline will be added to the database.
            if (newPipelineObj) {
                let foundPipeline = false;
                let foundLauncher = false;
                let foundReceiver = false;
                //checking to make sure that the pipeline, launcher, and receiver names are all unique
                for (let i = 0; i < result.length; i++) {
                    if (result[i].pipelineName == newPipelineObj.pipelineName) {
                        foundPipeline = true;
                    } else if (result[i].launcherName == newPipelineObj.launcherName) {
                        foundLauncher = true;
                    } else if (result[i].receiverName == newPipelineObj.receiverName) {
                        foundReceiver = true;
                    }
                }
                //alerting user to enter a unique name, focusing on the field that needs attention, and clearing its previously-entered, non-unique name
                if (foundPipeline || foundLauncher || foundReceiver) {
                    alert("This name already exists. Please enter a unique name.");
                    if (foundPipeline) {
                        $("#pageAddPipeline #addPipeline #newPipeline").val("").focus();
                    } else if (foundLauncher) {
                        $("#pageAddPipeline #addPipeline #newLauncher").val("").focus();
                    } else if (foundReceiver) {
                        $("#pageAddPipeline #addPipeline #newReceiver").val("").focus();
                    }

                } else {
                    addNewPipeline(newPipelineObj);
                }
                //if no newPipelineObj, then the GET result is being used to create a drop down list
            } else {
                optionValues = arrayDuplicates(optionValues);
                populateDropDown(optionValues, container);
            }
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        })
};

function populateUpdatePipelineForm(result) {
    //yes, I know: this is a global variable.
    pipelineID = result._id;
    console.log(result);
    //populating the form fields with the result.values
    $("form#updatePipeline #pipelineName").val(result.pipelineName);
    $("form#updatePipeline #launcherName").val(result.launcherName);
    $("form#updatePipeline #receiverName").val(result.receiverName);
    $("form#updatePipeline #piggingFrequency").val(result.piggingFrequency);
    $("form#updatePipeline #pipelineSize").val(result.pipelineSize);
    $("form#updatePipeline #closureName").val(result.closure);

    //creating an array from the stringified result (array was stringified before being submitted and is coming back as a string)
    let updatePigs = result.acceptablePigs;
    updatePigs = updatePigs.replace(/["\[\]]/g, "");
    updatePigs = updatePigs.split(",");
    console.log(updatePigs);

    //creating 'pre-checked' checkboxes based on values called from the database
    let pigsChecked = "";
    for (let i = 0; i < updatePigs.length; i++) {
        pigsChecked = updatePigs[i];
        console.log(pigsChecked);
        $('input[value="' + pigsChecked + '"]').prop("checked", true);
    }

    let updateProduct = result.product;
    updateProduct = updateProduct.replace(/["\[\]]/g, "");
    updateProduct = updateProduct.split(",");
    let productChecked = "";
    for (let i = 0; i < updateProduct.length; i++) {
        productChecked = updateProduct[i];
        $('input[value="' + productChecked + '"]').prop("checked", true);
    }
};

function addNewPipeline(newPipelineObj) {
    $.ajax({
            type: 'POST',
            url: '/pipelines/create',
            dataType: 'json',
            data: JSON.stringify(newPipelineObj),
            contentType: 'application/json'
        })
        .done(function (result) {
            alert('Pipeline added successfully.');
            document.getElementById('addPipeline').reset();
            $("#addPipeline #systemName").html("");

        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            alert('Error adding pipeline. Please try again.');
        });
}

function validateFields(activityObj, lastItem) {
    //check for empty Input Pigging fields
    let fieldFocus = "";
    for (let values in activityObj) {
        if (activityObj[values] == "" || activityObj[values] == "Select Option") {
            fieldFocus = values;
            alert("All fields are required.");
            $("#pageInputPigging #inputPigging #" + fieldFocus).focus();
            break;
        } else if (values == lastItem) {
            postPiggingActivity(activityObj);
        }
    }
};

function postPiggingActivity(activityObj) {
    $.ajax({
            type: "POST",
            url: "/pigging-activity/add",
            data: JSON.stringify(activityObj),
            dataType: "json",
            contentType: "application/json"
        })
        .done(function (result) {
            alert("Pigging activity added successfully.");

            //  clear the form, reset the page
            document.getElementById("inputPigging").reset();
            $(".jsHide").hide();
            $("#pageInputPigging").show();
            $("#pageInputPigging div.select-receive").hide();
            $("#pageInputPigging div.select-exception").hide();

            $("#pageInputPigging div.select-launch").show();
            $("#pageInputPigging div.select-receive").hide();
            $("#pageInputPigging div.select-exception").hide();

            $("#pageInputPigging #inputPigging #pipelineName").html("");
            $("#pageInputPigging #inputPigging #launcherName").text("");
            $("#pageInputPigging #inputPigging #pigType").html("");
            $("#pageInputPigging #inputPigging #exceptions").html("");

        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            alert("Error adding pigging activity. Please try again.");
        })
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

    //removing focus from any specific field
    $('#pageCreateAcct input').blur();

    //checking that all fields are complete
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

    }
    //checking that the passwords match
    else if (password !== pwdConfirm) {
        alert("The passwords must match exactly.");
        $('#pageCreateAcct #pwdConfirm').focus().val("");
    }
    //the fields are completed, the passwords match, but does this user already exist? if not, a new account will be created
    else {
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

//  Normal Header >> Account Info
$(document).on('click', 'header img', function (event) {
    event.preventDefault();
    console.log(activePage);
    $(".jsHide").hide();
    $("#pageUpdateAcct").show();
    $("#pageUpdateAcct #firstName").val(currentUserFName);
    $("#pageUpdateAcct #lastName").val(currentUserLName);
    $("#pageUpdateAcct #email").val(currentUserEmail);
});

//  Update Account Info (Name, Email) >> Submit
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
    $('#pageUpdateAcct input').blur();
    if (!fname || !lname || !email) {
        alert("All fields are required.");
        if (!fname) {
            $('#pageUpdateAcct #firstName').focus();
        } else if (!lname) {
            $('#pageUpdateAcct #lastName').focus();
        } else if (!email) {
            $('#pageUpdateAcct #email').focus();
        }
    } else if (validateEmail(email)) {
        $.ajax({
                type: "PUT",
                url: "/users/reset-name/" + currentUserID,
                data: JSON.stringify(updateUserNameObj),
                dataType: 'json',
                contentType: 'application/json'
            })
            .done(function (result) {
                alert("Account updated. Please login using your updated credentials.");
                window.location.reload(true);

            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                //user not found
                alert("Error updating account information. Please try again.");
            })
    } else {
        alert("Invalid email address.");
        $('#pageUpdateAcct #email').focus();
    }
});

//  Update Account Info (Password) >> Submit
$(document).on('submit', '#pageUpdateAcct #userUpdateAcctPwd', function (event) {
    event.preventDefault();
    let password = $("#pageUpdateAcct #newPwd").val();
    let pwdReenter = $("#pageUpdateAcct #newPwdReenter").val()
    let updateUserPwdObj = {
        password: $("#pageUpdateAcct #newPwd").val()
    }
    if (!password || !pwdReenter) {
        alert("Both fields are required.");
        if (!password) {
            $("#pageUpdateAcct #newPwd").focus();
        } else if (!pwdReenter) {
            $("#pageUpdateAcct #newPwdReenter").focus();
        }
    } else if (password !== pwdReenter) {
        alert("Passwords must match exactly.");
        $("#pageUpdateAcct #newPwdReenter").val("").focus();
    } else {
        $.ajax({
                type: "PUT",
                url: "/users/reset-pwd/" + currentUserID,
                data: JSON.stringify(updateUserPwdObj),
                dataType: 'json',
                contentType: 'application/json'
            })
            .done(function (result) {
                alert("Account updated. Please login using your updated password.");
                window.location.reload(true);

            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                //user not found
                alert("Error updating password. Please try again.");
            })
    }
});

//  Update Account Info >> Cancel
$(document).on('click', '#pageUpdateAcct .js-cancel', function (event) {
    event.preventDefault();
    alert("Account information unchanged.");
    if (currentUserRole == "Foreman") {
        $(".jsHide").hide();
        $("#pageAdminMenu").show();
    } else if (currentUserRole == "Operator") {
        if (activePage == "inputPigging") {
            $(".jsHide").hide();
            $("#pageInputPigging").show();
            $("#pagePiggingSchedule .normal-header").show();
            $("#pagePiggingSchedule .show-to-operator").show();
            $("#pageInputPigging div.select-receive").hide();
            $("#pageInputPigging div.select-exception").hide();
            activePage = "inputPigging";
            // selectPipeline();
        } else if (activePage == "piggingSchedule") {
            $(".jsHide").hide();
            $("#pagePiggingSchedule").show();
            $("#pagePiggingSchedule .normal-header").show();
            $("#pagePiggingSchedule .show-to-operator").show();
            $("#pagePiggingSchedule .foreman-header").hide();
            $("#pagePiggingSchedule .js-viewonly").hide();
            activePage = "piggingSchedule";
        }
    } else if (currentUserRole == "Report_Viewer") {
        $(".jsHide").hide();
        $("#pagePiggingSchedule").show();
        $(".foreman-header").hide();
        $(".show-to-operator").hide();
    }
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
    getReportCenters("#pageAddPipeline #rcName");
});

//  Add Pipeline >> select#rcName.on('change');
$(document).on('change', '#pageAddPipeline select#rcName', function (event) {
    let selectionValue = "";
    $('#pageAddPipeline select#rcName option:selected').each(function () {
        selectionValue = $(this).text();
        getSystemsByRC(selectionValue, "#pageAddPipeline #systemName");
    });
});

//   Add Pipeline >> Submit
$(document).on('submit', '#pageAddPipeline', function (event) {
    event.preventDefault();

    let RCName = "";
    $('#pageAddPipeline select#rcName option:selected').each(function () {
        RCName = $(this).text();
    });
    let systemName = "";
    $('#pageAddPipeline select#systemName option:selected').each(function () {
        systemName = $(this).text();
    });

    let pipelineName = $("#pageAddPipeline #newPipeline").val();
    let launcherName = $("#pageAddPipeline #newLauncher").val();
    let receiverName = $("#pageAddPipeline #newReceiver").val();
    let pipelineSize = $("#pageAddPipeline #newPipelineSize").val();

    let product = $("input[type=checkbox][name=add-product]:checked").map(function () {
        return this.value;
    }).toArray();

    let acceptablePigs = $("input[type=checkbox][name=add-pigs]:checked").map(function () {
        return this.value;
    }).toArray();

    let closure = $("#pageAddPipeline #pipelineClosures").val();
    let piggingFrequency = $("#pageAddPipeline #piggingFrequency").val();
    let dateAdded = $("#pageAddPipeline #addPipelineDate").val();
    let pipelineActive = 1;

    let newPipelineObj = {
        RCName: RCName,
        systemName: systemName,
        pipelineName: pipelineName,
        launcherName: launcherName,
        receiverName: receiverName,
        pipelineSize: pipelineSize,
        product: JSON.stringify(product),
        acceptablePigs: JSON.stringify(acceptablePigs),
        closure: closure,
        piggingFrequency: piggingFrequency,
        dateAdded: dateAdded,
        pipelineActive: pipelineActive
    };

    if (!$('#pageAddPipeline #addPipelineDate').val()) {
        alert("Please enter the date the pipeline started operating.");
        $('#pageAddPipeline #addPipelineDate').focus();
    } else if (validateSelect(RCName, "select-rc") == false) {
        alert("RC Name must be selected.");
        $('#pageAddPipeline #rcName').focus();
    } else if (validateSelect(systemName, "select-system") == false) {
        alert("System name must be selected.");
        $('#pageAddPipeline #systemName').focus();
    } else if (!$('#pageAddPipeline #newPipeline').val()) {
        alert("Please enter new pipeline name.");
        $('#pageAddPipeline #newPipeline').focus();
    } else if (!$('#pageAddPipeline #newLauncher').val()) {
        alert("Please enter new launcher name.");
        $('#pageAddPipeline #newLauncher').focus();

    } else if (!$("#pageAddPipeline #newReceiver").val()) {
        alert("Please enter new receiver name.");
        $("#pageAddPipeline #newReceiver").focus();

    } else if (!$('#pageAddPipeline #newPipelineSize').val()) {
        alert("Please enter the new pipeline size (inches).");
        $('#pageAddPipeline #newPipelineSize').focus();
    } else if (validateSelect(closure, "select-closure") == false) {
        alert("Please select a closure type.");
        $('#pageAddPipeline #pipelineClosures').focus();
    } else if (validateCheckbox(newPipelineObj.acceptablePigs) == false) {
        alert("Please select the acceptable pigs for this pipeline.");
    } else if (validateCheckbox(newPipelineObj.product) == false) {
        alert("Please select a pipeline product.");
    } else if (!$('#pageAddPipeline #piggingFrequency').val()) {
        alert("Please enter a pigging frequency.");
        $('#pageAddPipeline #piggingFrequency').focus();
    } else {
        //check if chosen pipeline name is already in use
        getPipelineNames(systemName, "#genericContainer", newPipelineObj);
    }
});

//   Add Pipeline >> Cancel
$(document).on('click', '#pageAddPipeline .button-cancel', function (event) {
    event.preventDefault();
    document.getElementById("addPipeline").reset();
    $("#addPipeline #systemName").html("");
    $(".jsHide").hide();
    $("#pageAdminMenu").show();
});

//*** Admin Menu >> Update/Remove Pipeline
$(document).on('click', 'p.gotoUdatePipeline', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageUpdatePipeline").show();
    $("#updateSearch").show();
    getReportCenters("#pageUpdatePipeline #rcName");
});

//  Update Pipeline >> select#rcName.on('change');
$(document).on('change', '#pageUpdatePipeline select#rcName', function (event) {
    let rcValue = "";
    $('#pageUpdatePipeline select#rcName option:selected').each(function () {
        rcValue = $(this).text();
        getSystemsByRC(rcValue, "#pageUpdatePipeline #systemName");
    });
});

//  Update Pipeline >> select#systemName.on('change');
$(document).on('change', '#pageUpdatePipeline select#systemName', function (event) {
    let systemValue = "";
    $('#pageUpdatePipeline select#systemName option:selected').each(function () {
        systemValue = $(this).text();
        getPipelineNames(systemValue, "#pageUpdatePipeline #updateSearch #pipelineName", "");
    });
});

//  Update/Remove Pipeline (Search form) >> Submit
$(document).on('submit', '#updateSearch', function (event) {
    event.preventDefault();

    let rcValue = "";
    let systemValue = "";
    let pipelineValue = "";

    $('#pageUpdatePipeline select#rcName option:selected').each(function () {
        rcValue = $(this).text();
    });

    $('#pageUpdatePipeline select#systemName option:selected').each(function () {
        systemValue = $(this).text();
    });

    $('#pageUpdatePipeline select#pipelineName option:selected').each(function () {
        pipelineValue = $(this).text();
    });

    if (rcValue == "Select Option" || (!systemValue || systemValue == "Select Option") || (!pipelineValue || pipelineValue == "Select Option")) {
        alert("All fields are required.");
        if (rcValue == "Select Option") {
            $("#pageUpdatePipeline select#rcName").focus();
        } else if (!systemValue || systemValue == "Select Option") {
            $("#pageUpdatePipeline select#systemName").focus();
        } else if (!pipelineValue || pipelineValue == "Select Option") {
            $("#pageUpdatePipeline select#pipelineName").focus();
        }
    } else {
        $.ajax({
                type: "GET",
                url: "/pipelines/update/" + pipelineValue,
                dataType: 'json',
                contentType: 'application/json'
            })
            .done(function (result) {
                populateUpdatePipelineForm(result);
            })

            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            })

        $(".jsHide").hide();
        $("#pageUpdatePipeline").show();
        $("#updatePipeline").show();
        $("#pageUpdatePipeline .submit-cancel-delete").show();
    }
});


//  Update Pipeline (Update form) >> Submit
$(document).on('submit', '#updatePipeline', function (event) {
    event.preventDefault();

    let pipelineName = $("#updatePipeline #pipelineName").val();
    let launcherName = $("#updatePipeline #launcherName").val();
    let receiverName = $("#updatePipeline #receiverName").val();
    let pipelineSize = $("#updatePipeline #pipelineSize").val();
    let product = $("input[type=checkbox][name=update-product]:checked").map(function () {
        return this.value;
    }).toArray();
    let acceptablePigs = $("input[type=checkbox][name=update-pigs]:checked").map(function () {
        return this.value;
    }).toArray();
    let closure = $("#updatePipeline #closureName").val();
    let piggingFrequency = $("#updatePipeline #piggingFrequency").val();

    let updatePipelineObj = {
        pipelineName: pipelineName,
        launcherName: launcherName,
        receiverName: receiverName,
        pipelineSize: pipelineSize,
        product: JSON.stringify(product),
        acceptablePigs: JSON.stringify(acceptablePigs),
        closure: closure,
        piggingFrequency: piggingFrequency,
    };

    if (!pipelineName || !launcherName || !receiverName || !pipelineSize || product.length == 0 || acceptablePigs.length == 0 || !closure || !piggingFrequency) {
        alert("All fields are required.");
        if (!pipelineName) {
            $("#updatePipeline #pipelineName").focus();
        } else if (!launcherName) {
            $("#updatePipeline #launcherName").focus();
        } else if (!receiverName) {
            $("#updatePipeline #receiverName").focus();
        } else if (!piggingFrequency) {
            $("#updatePipeline #piggingFrequency").focus();
        } else if (!pipelineSize) {
            $("#updatePipeline #pipelineSize").focus();
        } else if (!closure) {
            $("#updatePipeline #closureName").focus();
        } else if (acceptablePigs.length == 0) {
            alert("Please select types of pigs.");
        } else if (product.length == 0) {
            alert("Please select pipeline product.");
        }
    } else {
        $.ajax({
                type: "PUT",
                url: "/pipelines/update/" + pipelineID,
                data: JSON.stringify(updatePipelineObj),
                dataType: 'json',
                contentType: 'application/json'
            })
            .done(function (result) {
                alert("Pipeline updated.");

            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                //user not found
                alert("Error updating pipeline information. Please try again.");
            })

        $("#updateSearch #systemName").html("");
        $("#updateSearch #pipelineName").html("");
        document.getElementById("updatePipeline").reset();
        document.getElementById("addPipeline").reset();

        $(".jsHide").hide();
        $("#pageAdminMenu").show();
    }
});

//  Update/Remove Pipeline (Update form) >> Delete
$(document).on('click', '#pageUpdatePipeline .button-delete', function (event) {
    event.preventDefault();
    //console.log(pipelineID);
    if (window.confirm("Are you sure you want to PERMANENTLY DELETE this pipeline record?")) {
        $.ajax({
                type: 'DELETE',
                url: '/pipelines/delete/' + pipelineID,
                dataType: 'json',
                // data: JSON.stringify(newPipelineObj),
                contentType: 'application/json'
            })
            .done(function (result) {
                alert("Record has been sucessfully deleted.");
                $("#updateSearch #systemName").html("");
                $("#updateSearch #pipelineName").html("");
                document.getElementById("updatePipeline").reset();
                document.getElementById("addPipeline").reset();
                $(".jsHide").hide();
                $("#pageAdminMenu").show();
            })
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                alert('Error deleting pipeline. Please try again.');
            });

    } else {
        alert("Pipeline deletion cancelled.");
    }
});

//  Update/Remove Pipeline >> Cancel
$(document).on('click', '#pageUpdatePipeline .button-cancel', function (event) {
    event.preventDefault();

    $("#updateSearch #systemName").html("");
    $("#updateSearch #pipelineName").html("");
    document.getElementById("updatePipeline").reset();
    document.getElementById("addPipeline").reset();
    $(".jsHide").hide();
    $("#pageAdminMenu").show();
});


//*** Admin Menu >> Add User
$(document).on('click', 'p.gotoAddUser', function (event) {
    event.preventDefault();
    if (userValuesArr.length > 0) {
        let newUserNames = [];
        for (name in userValuesArr) {
            console.log(userValuesArr[name].name);
            newUserNames.push(userValuesArr[name].name)
        }
        populateDropDown(newUserNames, "#newUserRequest");
    }
    $(".jsHide").hide();
    $("#pageAddUser").show();
    $("#findUser").show();
});

//  Add User (Search form) >> Submit
$(document).on('submit', '#findUser', function (event) {
    event.preventDefault();

    let newUserNameSelection = "";
    $('#pageAddUser select#newUserRequest option:selected').each(function () {
        newUserNameSelection = $(this).text();
    })

    $(".jsHide").hide();
    $("#pageAddUser").show();
    $("#assignRole").show();
    $("#pageAddUser #assignRole #newUserName").text(newUserNameSelection);
    console.log(userValuesArr);
});

//  Add User (Assign Role form) >> Submit
$(document).on('submit', '#assignRole', function (event) {
    event.preventDefault();

    let role = $("input[type=radio][name=radio-assign-user-role]:checked").val();
    console.log(role);
    let newUserName = $("#pageAddUser #assignRole #newUserName").text();
    console.log(newUserName);

    let newUserObj = {};
    for (let i = 0; i < userValuesArr.length; i++) {
        if (userValuesArr[i].name == newUserName) {
            let email = userValuesArr[i].email;
            newUserObj = {
                role: role,
                approved: 1
            };
            console.log(email, newUserObj);
            $.ajax({
                    type: "PUT",
                    url: "/users/update/" + email,
                    data: JSON.stringify(newUserObj),
                    dataType: 'json',
                    contentType: 'application/json'
                })
                .done(function (result) {
                    // console.log(result);
                    alert("User role assigned successfully.");
                    userValuesArr.splice(i, 1);
                    console.log(userValuesArr);
                    if (userValuesArr.length > 0) {
                        let newUserNames = [];
                        for (name in userValuesArr) {
                            console.log(userValuesArr[name].name);
                            newUserNames.push(userValuesArr[name].name)
                        }
                        $(".jsHide").hide();
                        $("#pageAddUser").show();
                        $("#findUser").show();
                        populateDropDown(newUserNames, "#newUserRequest");
                        document.getElementById("assignRole").reset();

                    } else {
                        populateDropDown([], "#newUserRequest");
                        $(".jsHide").hide();
                        $("#pageAdminMenu").show();
                    }
                })
                .fail(function (jqXHR, error, errorThrown) {
                    console.log(jqXHR);
                    console.log(error);
                    console.log(errorThrown);
                    //user not found
                    alert("Error assigning user role. Please try again.");
                })

        }
    }

});

//  Add User (Assign Role form) >> Deny
$(document).on('click', '#denyRequest', function (event) {
    event.preventDefault();

    let newUserName = $("#pageAddUser #assignRole #newUserName").text();
    console.log(newUserName);

    let newUserObj = {};
    for (let i = 0; i < userValuesArr.length; i++) {
        if (userValuesArr[i].name == newUserName) {
            let email = userValuesArr[i].email;
            newUserObj = {
                role: "",
                approved: 4
            };
            console.log(email, newUserObj);
            $.ajax({
                    type: "PUT",
                    url: "/users/update/" + email,
                    data: JSON.stringify(newUserObj),
                    dataType: 'json',
                    contentType: 'application/json'
                })
                .done(function (result) {
                    // console.log(result);
                    alert("User account request has been denied.");
                    userValuesArr.splice(i, 1);
                    console.log(userValuesArr);
                    if (userValuesArr.length > 0) {
                        let newUserNames = [];
                        for (name in userValuesArr) {
                            console.log(userValuesArr[name].name);
                            newUserNames.push(userValuesArr[name].name)
                        }
                        $(".jsHide").hide();
                        $("#pageAddUser").show();
                        $("#findUser").show();
                        populateDropDown(newUserNames, "#newUserRequest");
                        document.getElementById("assignRole").reset();

                    } else {
                        populateDropDown([], "#newUserRequest");
                        $(".jsHide").hide();
                        $("#pageAdminMenu").show();
                    }
                })
                .fail(function (jqXHR, error, errorThrown) {
                    console.log(jqXHR);
                    console.log(error);
                    console.log(errorThrown);
                    //user not found
                    alert("Error denying request. Please try again.");
                })

        }
    }

});

//  Add User >> Cancel (for both Cancel buttons on page)
$(document).on('click', '#pageAddUser .button-cancel', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageAdminMenu").show();
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
    let email = $("#pageUpdateUser #findUpdateUser #userEmail").val();
    getUserByEmail(email, "updateuser");

});

$(document).on('submit', '#updateRole', function (event) {
    event.preventDefault();

    let role = $("#updateRole input[type=radio][name=radioUpdateUserRole]:checked").val();

    let approved = $("#updateRole input[type=radio][name=radioUpdateUserStatus]:checked").val();

    let email = $("#updateRole #userEmailHidden").val();
    let updateUserObj = {
        role: role,
        approved: approved
    };

    $.ajax({
            type: "PUT",
            url: "/users/update/" + email,
            data: JSON.stringify(updateUserObj),
            dataType: 'json',
            contentType: 'application/json'
        })
        .done(function (result) {
            alert("User has been updated.");

            $(".jsHide").hide();
            $("#pageUpdateUser").show();
            $("#findUpdateUser").show();
            document.getElementById("findUpdateUser").reset();
            document.getElementById("updateRole").reset();

        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
            //user not found
            alert("Error updating user. Please try again.");
        })
});

//  Update User >> Cancel (for both Cancel buttons on page)
$(document).on('click', '#pageUpdateUser .button-cancel', function (event) {
    event.preventDefault();
    $(".jsHide").hide();
    $("#pageAdminMenu").show();
});


// USER = OPERATOR
//  INPUT PIGGING

// Input Pigging >> Get pipelines dropdown list from system selection
$(document).on('change', '#pageInputPigging #inputPigging #systemName', function () {
    event.preventDefault();
    let systemValue = "";
    $('#pageInputPigging select#systemName option:selected').each(function () {
        systemValue = $(this).text();
        getPipelineNames(systemValue, "#pageInputPigging #inputPigging #pipelineName", "");
    });
    $("#pageInputPigging #inputPigging #launcherName").text("");
});

// Input Pigging >> Get launcher name and pig types from pipeline selection
$(document).on('change', '#pageInputPigging #inputPigging #pipelineName', function () {
    event.preventDefault();
    let pipelineValue = "";
    $('#pageInputPigging select#pipelineName option:selected').each(function () {
        pipelineValue = $(this).text();
        getLauncher(pipelineValue, "#pageInputPigging #inputPigging #launcherName");
        getPigs(pipelineValue, "#pageInputPigging #inputPigging #pigType");
    });

});

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
    // get list of exceptions
    getExceptions("#pageInputPigging #inputPigging #exceptionDesc");
});

//  Input Pigging >> Submit
$(document).on('submit', '#pageInputPigging #inputPigging', function (event) {
    event.preventDefault();

    //what are my fields values?
    let activityName = "";
    let activityDate = $("#activityDate").val();
    let activityTime = $("#activityTime").val();
    let systemValue = "";
    $('#pageInputPigging select#systemName option:selected').each(function () {
        systemValue = $(this).text();
    });
    let pipelineValue = "";
    $('#pageInputPigging select#pipelineName option:selected').each(function () {
        pipelineValue = $(this).text();
    });
    let launcherValue = $("#launcherName").text();
    let pigValue = "";
    $('#pageInputPigging select#pigType option:selected').each(function () {
        pigValue = $(this).text();
    });
    let paraffinValue = $("#paraffinWeight").val();
    let sandValue = $("#sandWeight").val();
    let exceptionValue = "";
    $('#pageInputPigging select#exceptionDesc option:selected').each(function () {
        exceptionValue = $(this).text();
    });
    let notesValue = $("#notes").val();

    // an object holding the common elements of every POST request
    let activityObj = {
        activityDate: activityDate,
        activityTime: activityTime,
        systemName: systemValue,
        pipelineName: pipelineValue,
        launcherName: launcherValue,
        notes: notesValue,
        operatorEmail: currentUserEmail
    };

    // which radio button is selected?
    let inputActivity = $("input[type=radio][name=radioPigActivity]:checked");
    let inputActivityString = inputActivity[0].id;

    //add key:value pairs to activityObj per inputActivity
    if (inputActivityString == "radioLaunch") {
        activityName = "launch";
        activityObj.activityName = activityName;
        activityObj.pigType = pigValue;
        let objLength = Object.keys(activityObj).length - 1;
        let lastItem = Object.keys(activityObj);
        lastItem = lastItem[objLength];
        validateFields(activityObj, lastItem);

    } else if (inputActivityString == "radioReceive") {
        activityName = "receive";
        activityObj.activityName = activityName;
        activityObj.paraffinWeight = paraffinValue;
        activityObj.sandWeight = sandValue;
        let objLength = Object.keys(activityObj).length - 1;
        let lastItem = Object.keys(activityObj);
        lastItem = lastItem[objLength];
        validateFields(activityObj, lastItem);

    } else if (inputActivityString == "radioException") {
        activityName = "exception";
        activityObj.activityName = activityName;
        activityObj.exceptionDesc = exceptionValue;
        let objLength = Object.keys(activityObj).length - 1;
        let lastItem = Object.keys(activityObj);
        lastItem = lastItem[objLength];
        validateFields(activityObj, lastItem);
    }
});

//  Input Pigging >> Pigging Schedule (Operator)
$(document).on('click', '#pageInputPigging .ops-nav', function (event) {

    $(".jsHide").hide();
    $("#pagePiggingSchedule").show();
    $("#pagePiggingSchedule .normal-header").show();
    $("#pagePiggingSchedule .show-to-operator").show();
    $("#pagePiggingSchedule .foreman-header").hide();
    $("#pagePiggingSchedule .show-to-report-viewer").hide();
    activePage = "piggingSchedule";
    getSystems("#pagePiggingSchedule #piggingSchedule #systemName");
});

function getPipelinesForSchedule(systemValue, container) {
    let launchObj = [];

    $.ajax({
            // getting the list of pipelines in the selected system
            type: "GET",
            url: '/pipelines/' + systemValue,
            dataType: 'json',
            contentType: 'application/json'
        })
        .done(function (result1) {
            console.log(result1);
            for (let options in result1) {
                //getting the most recent launch for each pipeline
                $.ajax({
                        type: "GET",
                        url: '/pigging-activity/' + result1[options].pipelineName,
                        dataType: 'json',
                        contentType: 'application/json'
                    })
                    .done(function (result2) {
                        if (result2 === null) {
                            alert("No launch activity found for " + result1[options].pipelineName + ".");
                        }

                        console.log(result2);

                        //creating a new object from results of two api calls
                        launchObj.push({
                            pipelineName: result1[options].pipelineName,
                            piggingDays: result1[options].piggingFrequency,
                            prevLaunch: result2.activityDate
                        });
                        console.log(launchObj);
                        applyStyles(launchObj, container);

                    })

                    .fail(function (jqXHR, error, errorThrown) {
                        console.log(jqXHR);
                        console.log(error);
                        console.log(errorThrown);

                    })

            }
        })
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        })
};

// sorting the array
function compare(a, b) {
    let dateA = a.nextLaunch;
    let dateB = b.nextLaunch;
    let comparison = 0;
    if (dateA > dateB) {
        comparison = -1;
    } else if (dateA < dateB) {
        comparison = 1
    }
    return comparison;
}


function applyStyles(launchObj, container) {

    $(container).html("");
    let buildList = "";
    let className = "";

    console.log(launchObj);
    console.log(typeof (launchObj));

    let sortedLaunchObj = [];
    let today = new Date();

    // sort according to nextLaunch
    for (let options in launchObj) {

        //setting up the due / overdue formulas
        let prevLaunch = new Date(launchObj[options].prevLaunch);
        let piggingDays = Number(launchObj[options].piggingDays) + 1;

        let nextLaunchDate = new Date(prevLaunch);
        nextLaunchDate.setDate(prevLaunch.getDate() + piggingDays);
        let strLaunchDate = nextLaunchDate.toDateString();
        strLaunchDate = strLaunchDate.slice(4, 11);

        let sevenDays = new Date(nextLaunchDate);
        sevenDays.setDate(nextLaunchDate.getDate() - Number(7));

        let daysPastDue = (today - nextLaunchDate);
        daysPastDue = Math.floor(daysPastDue / 86400000);

        sortedLaunchObj.push({
            pipelineName: launchObj[options].pipelineName,
            nextLaunch: strLaunchDate,
            daysPastDue: daysPastDue,
            sevenDays: sevenDays
        });

    }
    console.log(sortedLaunchObj.sort(compare));


    //apply styles, build the html output
    for (let options in sortedLaunchObj) {
        //use due/overdue formulas here
        if (sortedLaunchObj[options].daysPastDue < -7) {
            className = "due-today";
        } else if (sortedLaunchObj[options].daysPastDue < 1 && sortedLaunchObj[options].daysPastDue > -7) {
            className = "due-in-seven";
        } else if (sortedLaunchObj[options].daysPastDue < 30 && sortedLaunchObj[options].daysPastDue >= 1) {
            className = "overdue-within-thirty";
        } else if (sortedLaunchObj[options].daysPastDue >= 31) {
            className = "overdue-plus-thirty";
        }



        buildList +=
            '<div class="schedule-results ' + className + '">' +
            '<p>' + sortedLaunchObj[options].pipelineName + '</p>' +
            '<p class = "date">' + sortedLaunchObj[options].nextLaunch + '</p>' +
            '</div>';
        console.log(buildList);

    }
    $(container).html(buildList);
};



//  Pigging Schedule >> Submit
$(document).on('submit', '#pagePiggingSchedule #piggingSchedule', function (event) {
    event.preventDefault();
    let systemValue = "";
    $('#pagePiggingSchedule select#systemName option:selected').each(function () {
        systemValue = $(this).text();
    });
    $("#pagePiggingSchedule #scheduleResults").html("");
    getPipelinesForSchedule(systemValue, "#scheduleResults");
});





//  Pigging Schedule (Operator) >> Input Pigging
$(document).on('click', '#pagePiggingSchedule .show-to-operator', function (event) {

    $(".jsHide").hide();
    $("#pageInputPigging").show();
    $("#pageInputPigging div.select-receive").hide();
    $("#pageInputPigging div.select-exception").hide();
    activePage = "inputPigging";
    console.log(activePage);
});



//  Previous Launch >> Back (to Pigging Schedule (Operator))
$(document).on('click', '#pagePrevLaunch .show-to-operator', function (event) {

    $(".jsHide").hide();
    //    $("#pagePiggingSchedule").show();
    //    $("#pagePiggingSchedule .normal-header").show();
    //    $("#pagePiggingSchedule .foreman-header").hide();
    //    $("#pagePiggingSchedule .show-to-operator").show();
});

//  Pigging Schedule (Report Viewer) >> Debris Report
$(document).on('click', '#pagePiggingSchedule .js-viewonly', function (event) {

    $(".jsHide").hide();
    $("#pageDebrisReport").show();
    $("#pageDebrisReport .foreman-header").hide();
    $("#pageDebrisReport #debrisReport").show();
    $(".debris-results").hide();
    $("#debrisReport .js-system-debris").hide();
    $("#debrisReport .js-pipeline-debris").hide();
});

//  Debris Report (Report Viewer) >> Pigging Schedule
$(document).on('click', '#pageDebrisReport .ops-nav', function (event) {

    $(".jsHide").hide();
    $("#pagePiggingSchedule").show();
    $("#pagePiggingSchedule .foreman-header").hide();
    $("#pagePiggingSchedule .show-to-operator").hide();
});



//  Normal Header >> Exit Application
$(document).on('click', 'header img + img', function (event) {

    window.location.reload(true);
    $(".jsHide").hide();
    $("#pageLogin").show();

});
