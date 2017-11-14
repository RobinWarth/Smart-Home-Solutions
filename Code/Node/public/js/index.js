$("button").click(function(){
    $.post("192.168.111.90:3000/input",
    {
        id: 1,
        status: 1
    },
    function(data, status){
        alert("Data: " + data + "\nStatus: " + status);
    });
});