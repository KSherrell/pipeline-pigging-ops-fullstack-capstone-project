"use strict";
//Step One: define functions, objects, variables
function pageCreateAcct() {
    $("#pageCreateAcct").toggle();
}




//Step Two: Use functions, object, variables (triggers)
$(document).ready(function () {
    //  Hides All
    $(".jsHide").hide();

    //  Shows Loging Page
    $("#pageLogin").toggle();
    //Hides Forgot Password form
    $("#forgotPassword").hide();


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
    $("#forgotPassword").toggle();
});
