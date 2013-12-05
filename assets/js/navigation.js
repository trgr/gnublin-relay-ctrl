$(function(){
    function load(name){
	$("#content").load(name);
    }
    var statusRefresh = 10000;
    
    /* By default load status and set it to refresh*/
    $("#content").load("/relay/getRelayStatus");
    var refresh = setInterval(function(){
	$("#content").load("/relay/getRelayStatus");
    },statusRefresh);
    
    $("#menu li").click(function(event){
	event.preventDefault();
	var items = $("#menu").children();
	items.each(function(k,v){
	    $(v).removeClass("active");
	});
	$(this).addClass("active");
	switch($(this).attr("id")){
	case "status":
	    //Clear any refreshes
	    window.clearInterval(refresh);
	    //Load it
	    load("/relay/getRelayStatus");
	    //And add a new refresh
	    refresh = setInterval(function(){
		load("/relay/getRelayStatus");
	    },statusRefresh);
	    break;
	case "edit":
	    //Edit does not autorefresh so just clear
	    window.clearInterval(refresh);
	    load("/edit");
	    break;
	case "create":
	    //Create does not autorefresh so just clear
	    window.clearInterval(refresh);
	    load("/create");
	    
	    break;
	    
	}
    });
});
