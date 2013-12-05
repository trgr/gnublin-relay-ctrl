$(function(){
    $("form > #create").click(function(event){
	var relay = {};
	relay.name = $("#newRelayName").val();
	relay.address = $("#newRelayAddress").val();
	var pincount = $("#newRelayPinCount").val();
	var pins = [];

	for(var i=0; pincount>i; i++){
	    pins[i] = {};
	    pins[i].state ="in";
	    pins[i].value = 0;
	}
	relay.pins = pins;
	$.post("/relay/create",{relay:relay},function(data,status){
	    console.log(data);
	    if(data.status=="success"){
		$(this).parent().parent().html("");
		var info = $("<div><div>");
		info.addClass("alert alert-success alert-dismissable");
		info.html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>Relay created");
		$("#message").append(info);
	    }
	});
    });
});
    

