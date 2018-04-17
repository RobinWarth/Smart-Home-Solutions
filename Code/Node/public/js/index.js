/* global $ */

/* menu toggle */
$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});



/* router */
$("#route-home").click(function(e) {
    $("#route-output").load("/switches.html");
});

$("#route-records").click(function(e) {
    $("#route-output").load("/records.html");
});

$("#route-switches").click(function(e) {
    $("#route-output").load("/switches.html");
});

$("#route-live-cam").click(function(e) {
    $("#route-output").load("/live-cam.html");
});



/* document on load */
$(document).ready(function() {
    $("#route-output").load("/switches.html");
});


