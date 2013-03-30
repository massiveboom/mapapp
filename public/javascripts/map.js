var map={
    init:function(){
	var mapOptions = {
	    center: new google.maps.LatLng(37.09024, -95.712891),
	    zoom: 4,
	    mapTypeId: google.maps.MapTypeId.TERRAIN
	};
	map.canvas = new google.maps.Map(document.getElementById("map"),map.prefs.mapOptions);
    },
    utils:{//commonly repeated code
	
    },
    geo:{
	//geolocation functions
	
    },
    markers:{
	//markers on the map
	//add marker
	//remove marker
	
    },
    route:{
	//routes on the map
	//create path 
    },
    prefs:{
	//variables that store preferences
	mapOptions : {
	    zoom: 4,
   	    center: new google.maps.LatLng(37.09024, -95.712891),
   	    mapTypeId: google.maps.MapTypeId.TERRAIN
   	}
    },
    listeners:{
	//event listeners go here
    },
    display:{
	//functions that augment the layout
	init:function(callback){
	    //$("#map").css("width",($(window).width())+"px");
	    if(callback){
		console.log('yo dawg');
		callback();
	    }
	}
    },
    server:{
	//ajax functions for phoning home
    }
}

google.maps.event.addDomListener(window, 'load', map.init);
