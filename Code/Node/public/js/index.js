function postRaspberry(id, status) {
    jQuery.post("http://192.168.111.90:3000/input",
    {
        id: id,
        status: status
    },
    function(data, status){
        alert("Data: " + data + "\nStatus: " + status);
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
