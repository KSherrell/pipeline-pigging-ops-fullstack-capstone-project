"use strict";

$(document).ready(function () {
    $(".jsHide").hide();
    appLogin();
});

function toggleHide(e) {

}

function appLogin() {

    $("#pageLogin").toggle();
    $("#forgotPassword").hide();

    $("p:first-of-type").click(function () {

        console.log("Merry Christmas @ click function");

        $("#forgotPassword").toggle();

        console.log($("#forgotPassword").css("visibility"));

    });

    console.log("Merry Christmas @ login");
}
