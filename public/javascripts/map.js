console.log('hi.');
var map={
    init:function(){
	var latlng = new google.maps.LatLng(51.764696,5.526042);
	// set direction render options
	var rendererOptions = { draggable: true };
	directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
	var myOptions = {
	    zoom: 14,
	    center: latlng,
	    mapTypeId: google.maps.MapTypeId.ROADMAP,
	    mapTypeControl: false
	};
	// add the map to the map placeholder
	var map = new google.maps.Map(document.getElementById("map"),myOptions);
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById("directionsPanel"));
	// Add a marker to the map for the end-point of the directions.
	var marker = new google.maps.Marker({
	    position: latlng, 
	    map: map, 
	    title:"Rodderhof, Oss"
	}); 
    },
    utils:{//commonly repeated code
	
    },
    canvas:{
	//the actual map
	
    },
    geoip:{
	//geolocation functions
	
    },
    markers:{
	//markers on the map
	
    },
    route:{
	//routes on the map

    },
    prefs:{
	//variables that store preferences

    },
    display:{
	//functions that augment the layout
	init:function(){
	    $(window).resize(function() {
		$("#map").css("width",($(window).width())+"px")
	    });
	}
    },
    server:{
	//ajax functions for phoning home
    }
}

$(document).ready(function(){
    console.log('starting');
    map.init();
});