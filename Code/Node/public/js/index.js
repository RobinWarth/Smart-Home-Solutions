/* global $ */

/* menu toggle */
$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});



/* router */
$("#route-home").click(function(e) {
    $("#route-output").load("/switches");
});

$("#route-records").click(function(e) {
    $("#route-output").load("/records");
});

$("#route-switches").click(function(e) {
    $("#route-output").load("/switches");
});



/* document on load */
$(document).ready(function() {
    $("#route-output").load("/switches");
});


