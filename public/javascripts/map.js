$(document).ready(function(){
    window.map={
	init:function(){
	    //load api resources
	    map.canvas = new google.maps.Map(document.getElementById("map"),map.prefs.mapOptions);
	    map.geocoder = new google.maps.Geocoder();
	    
	    //event listeners
	    map.listener.click=google.maps.event.addListener(map.canvas, 'click', function(e) {
		console.log(['click',e]);
	    });	
	},
	listener:{},
	utils:{//commonly repeated code
	    
	},
	markers:{
	    //markers on the map
	    //add marker
	    //remove marker
	    addMarker:function(){},
	    removeMarker:function(){},
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
	display:{
	    //functions that augment the layout
	},
	server:{
	    //ajax functions for phoning home
	}
    }
    google.maps.event.addDomListener(window, 'load', map.init);
});



