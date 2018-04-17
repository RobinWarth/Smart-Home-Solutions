/* global $ */

$(document).ready(function() {
    console.log("ready");
    getRecordListFromServer();
});

function createRecordOptionsListHTML(data, status) {
    console.log(data, typeof(data));
    let firstOption = "<option selected>Select Record</option>";
    let recordOptions = "";
    for (let file of data) {
        recordOptions = recordOptions.concat("<option ".concat("value='", file, "' ", "id='", "recordOption#", file, "' onclick='showSelectedVideo()'>", file.slice(0, file.indexOf(".mp4")), "</option>"));
    }
    console.log(firstOption.concat(recordOptions));
    $("#recordSelector").html(firstOption.concat(recordOptions));

};

function getRecordListFromServer() {
    let url = window.location.hostname;
    if (window.location.port) {
        url += ":" + window.location.port;
    }


    let fullUrl = window.location.protocol.concat("//", url, "/record-files");
    console.log(fullUrl);

    $.ajax({
        type: "GET",
        url: fullUrl,
        success: createRecordOptionsListHTML,
        contentType: 'application/json'
    });
};

function showSelectedVideo() {
    let id = $("#recordSelector").find("option:selected").val();
    let videoHTML = "<video width='640' height='480' controls><source src='../record-files/".concat(id, "' type='video/mp4'>", "Your browser does not support the video tag. </video>'");
    $("#videoContainer").html(videoHTML);
};
