$(document).ready(function(){
    window.map={
	init:function(){
	    //load api resources
	    map.canvas = new google.maps.Map(document.getElementById("map"),map.prefs.mapOptions);
	    map.geocoder = new google.maps.Geocoder();
		
			map.listener.mapClick = new google.maps.event.addListener(map.canvas, 'click', function(e) {
		console.log(['click',e]);
	    });

		//test markers
		var testlocation = new google.maps.LatLng(37.7699298, -122.4469157);
		map.markers.addMarker(testlocation,"testmark");

	    //event listeners go here
	    $('body').on('click',function(event){
		console.log('clicked');
		console.log(event);
	    });	
	},
	listener:{},
	utils:{//commonly repeated code
	    loadData: function() {},
	    loadAll: function() {},	    
	    clearData: function() {},
	    clearAll: function() {},
            encodeAddress:function(location,callback){
                map.geocoder.geocode( { 'address': location}, function(results, status) {
      		    if(status != google.maps.GeocoderStatus.OK){
			console.log("lookup encoded is:"+results[0].geometry.location);	
	                results=false;
      		    } 
                    if(callback){
                        callback(results);
                    }
                });
            }
            
	},
	markers:{
		//markers on the map
		//add marker
		//remove marker
		store: [],
		addMarker:function(location, name){
		map.marker.store[name] = new google.maps.Marker(
			{
			position: location
			,map: map.canvas
			,draggable: true
			}
		);
		console.log(map.markers.store);
		},
		removeMarker:function(targetMarker){
			for(i in markers.store){ 
				if (i == targetMarker) {
					markers.store[i].setMap(null);
					markers.store[i].splice(0,1);
				};
			}
		},
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
	    },
	    sampleData: ['/sample data/6800 E Tennessee Ave.kml',
			 '/sample data/6800 E Tennessee Ave(2).kml',
			 '/sample data/6800 E Tennessee Ave(3).kml',
			 '/sample data/6800 E Tennessee Ave(4).kml',
			 '/sample data/6800 E Tennessee Ave(5).kml',
			 '/sample data/6800 E Tennessee Ave(6).kml',
			 '/sample data/6800 E Tennessee Ave(7).kml']
	},
	server:{
	    //ajax functions for phoning home
	}
    }
    google.maps.event.addDomListener(window, 'load', map.init);
});



