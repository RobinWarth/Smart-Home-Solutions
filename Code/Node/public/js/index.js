function postRaspberry(id, status) {
    var url      = window.location.href;
    var fullUrl = url + "input";
    jQuery.post(fullUrl,
    {
        id: id,
        status: status
    },
    function(data, status){
        console.log("Data: " + data + "\nStatus: " + status);
    });
}
jQuery("#buttonAon").click(function(){
    var a = postRaspberry(1,1);
});

jQuery("#buttonAoff").click(function(){
    postRaspberry(1,0);
});

jQuery("#buttonBon").click(function(){
    postRaspberry(2,1);
});

jQuery("#buttonBoff").click(function(){
    postRaspberry(2,0);
});

jQuery("#buttonCon").click(function(){
    postRaspberry(4,1);
});

jQuery("#buttonCoff").click(function(){
    postRaspberry(4,0);
});

jQuery("#buttonDon").click(function(){
    postRaspberry(8,1);
});

jQuery("#buttonDoff").click(function(){
    postRaspberry(8,0);
});
