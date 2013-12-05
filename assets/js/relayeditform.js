$(function(){
    $("form > #delete").click(function(event){
	var id = $(this).parent().find("#relay-id").val();
	var block = this;
	$.post("/relay/delete",{id:id},function(data,status){
	    if(data.status=="success"){
		$(block).parent().parent().parent().html("");
		var info = $("<div><div>");
		info.addClass("alert alert-success alert-dismissable");
		info.html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>Relay deleted");
		$("#message").append(info);
	    }
	});
	//$(this).parent().parent().html("");
	console.log("Delete : "+id);

    });
    $("form").submit(function(event){
	event.preventDefault();
	
	var arr = $(this).serializeArray();
	var id = $(this).find("#relay-id").val();
	var name = $(this).find("#relayName").val();
	var address = $(this).find("#relayAddress").val();
	var pincount = $(this).find("#pin-count").val();
	
	var relay = {};
	relay.id = id;
	relay.name = name;
	relay.address = address;
	relay.pins = [];
	for(var i=0; pincount>i; i++){
	    relay.pins[i] = {};
	    var pinid = id+"-"+i;
	    var state = $("#"+pinid+"-state").val();
	    var value = $("#"+pinid+"-value").val();
	    relay.pins[i].state = state;
	    relay.pins[i].value = value;
	}
	
	$.post("/relay/update",{relay:relay},function(data,status){
	    if(data.status == "success"){
		var info = $("<div><div>");
		info.addClass("alert alert-success alert-dismissable");
		info.html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>Relay updated");
		$("#message").append(info);
	    }
	});
    });
    
    $("select").change(function(){
	var v = $(this).val();
	var idSplit = $(this).attr("id").split("-");
	var valueId = idSplit[0] +"-"+idSplit[1]+"-value";
	if(v == "in"){
	    $("#"+valueId).prop("disabled",true);
	}
	if(v == "out"){
	    $("#"+valueId).prop("disabled",false);
	}
    });
    
});

