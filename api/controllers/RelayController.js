/**
 * RelayController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var gnublin = require("gnublin");

module.exports = {
    
    index : function(req,res){
	res.view();
    },

    create : function(req,res){
	if(req.method == "GET"){
	    return res.view();
	}
	var relay = req.body.relay
	Relay.create(relay).done(function(err){
	    if(err)
		return res.send({status:"error"});
	    return res.send({status:"success"});
	});

    },
    update : function(req,res){
	var nrelay = req.body.relay;

	Relay.findOne(nrelay.id).done(function(err,relay){
	    relay.name = nrelay.name
	    relay.address = nrelay.address
	    relay.pins = nrelay.pins
	    relay.save(function(err){
		if(err)
		    return res.send({status:"error"})
		return res.send({status:"success"})
	    });
	});
    },
    delete : function(req,res){
	var id = req.body.id;
	Relay.findOne(id).done(function(err,relay){
	    relay.destroy(function(err){
		if(err)
		    return res.send({status:"error"})
		return res.send({status:"success"});
	    });
	});
    },
    edit: function(req,res){
	Relay.find().done(function(err,relays){	    
	    res.view({layout:"",relays:relays});
	});
    },
    
    getRelay : function(req,res){

	var id = req.query.id
	
	Relay.findOne(id).done(function(err,relay){
	    res.json(relay);
	});
    },
    
    getAllRelays : function(req,res){
	Relay.find().done(function(err,relay){
	    res.send(relay);
	});
    },
    saveRelay : function(req,res){
	var pca9555 = new gnublin.pca9555()
	var relayData = req.body.relay
	pca9555.SetAddress(relayData.address);
	Object.keys(relayData.pins).forEach(function(v,i){
	    switch(v.state){
	    case "out":
		pca9555.PinMode(i,"out")
		pca9555.DigitalWrite(i,v.value)
		break;
		
	    case "in":
		pca9555.PinMode(i,"in");
		break;
	    }
	});
	Relay.find(relayData.id).done(function(err,relay){
	    relay.name = relayData.name
	    relay.address = relayData.address
	    relay.pins = relayData.pins
	    relay.save(function(err){
		return res.send("ok");
	    });
	});
    
    },
    getRelayStatus : function(req,res){
	var pca9555 = new gnublin.pca9555()
	
	/* Get relay as defined in database */
	Relay.find().done(function(err,relay){
	    /* Loop through each pin and query gnublin for changes */
	    relay.forEach(function(rv,ri){
		pca9555.SetAddress(rv.address)
		var change = false
		rv.pins.forEach(function(v,i){
		    var value;

		    if(v.state == "in")
			value = pca9555.DigitalRead(i)
		    
		    if(v.state == "out")
			value = pca9555.ReadState(i)

		    if (value != v.value){
			relay[ri].pins[i].value = value
			change = true
		    }
		});
		/* If there's been changes, then save them to db */
		if(change == true){
		    relay[ri].save(function(err){});
		}
	    });
	    /* Array.forEach is blocking, so this should be all good */
	    res.view("relay/status.ejs",{layout:"",relays:relay});
	});
    },
    
    insertDummy : function(req,res){
	var pins = [{value:0,state:"in"},
		    {value:0,state:"in"},
		    {value:0,state:"in"},
		    {value:0,state:"in"}]
	Relay.create({
	    name : "Demo Relay",
	    pins : pins,
	    address : "0x20"
	    }).done(function(err,relay){
		res.send(relay);
	    });
	},


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to RelayController)
   */
  _config: {}

  
};
