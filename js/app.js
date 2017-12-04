"use strict";

$(document).ready(function () {
    hideAll();
    pageLogin();
});

function hideAll() {
    $(".jsHide").hide();
}

function pageLogin() {
    $("#pageLogin").toggle();
    $("#forgotPassword").hide();
    $("p:first-of-type").click(function () {
        $("#forgotPassword").toggle();
    });
    $("#forgotPassword").submit(function () {
        pageResetPwd();
    });

    $("#forgotPassword .js-cancel").click(function () {
        $("#forgotPassword").hide();
        //console.log("Merry Christmas!");
    });

    $("p:nth-of-type(2)").click(function () {
        pageCreateAcct();
    });


}

function pageResetPwd() {
    hideAll();
    $("#pageResetPwd").toggle();
}

function pageCreateAcct() {
    hideAll();
    $("#pageCreateAcct").toggle();
    console.log("Merry Christmas!");

    $("#userCreateAcct").submit(function () {
        console.log("Merry Christmas!");
    });

    $("#userCreateAcct .js-cancel").click(function () {
        hideAll()
        pageLogin();
        console.log("Merry Christmas!");
    });

}
