$(document).ready(function(){
    window.map={
	init:function(){
	    //load api resources
	    map.canvas = new google.maps.Map(document.getElementById("map"),map.prefs.mapOptions);
	    map.geocoder = new google.maps.Geocoder();
            map.route.service = new google.maps.DirectionsService();
            map.route.display = new google.maps.DirectionsRenderer(map.prefs.routeOptions);
            map.route.display.setMap(map.canvas);
            map.route.display.setPanel(map.data.route);
            map.listener.mapClick = new google.maps.event.addListener(map.canvas, 'click', function(e) {
		console.log(['click',e]);
	    });
	    //test markers
	    var testlocation = new google.maps.LatLng(37.7699298, -122.4469157);
	    map.marker.addMarker(testlocation,"testmark");    
	    map.listener.uiClick = $('#buttons').on('click', 'a', function()
	    {
			switch($(this).attr('id'))
			{
				case "next":
					var next = map.prefs.sampleData.shift();
					map.utils.kml.load(next);
					
					map.prefs.sampleData.push(next);
					break;
					
				case "previous":
					var previous = map.prefs.sampleData.pop();
					map.utils.kml.load(previous);
					
					map.prefs.sampleData.unshift(previous);
					break;
					
				case "all":
					for(var i in map.prefs.sampleData)
					{
						map.utils.kml.load(map.prefs.sampleData[i]);
					}
					break;
					
				case "clear":
					for(var i in map.prefs.sampleData)
					{
						map.utils.kml.clear(map.prefs.sampleData[i]);
					}
					break;
			}
		});
	    //event listeners go here
	    $('body').on('click',function(event){
		console.log('clicked');
		console.log(event);
	    });	
	},
	overlays:{},
	listener:{},
	utils:{//commonly repeated code
	    kml:
	    {		
		load: function(data)
		{
		    if(typeof(data) === 'string')
		    {
			map.overlays[data] = new google.maps.KmlLayer(data);
			map.overlays[data].setMap(map.canvas);
		    }
		},		
		clear: function(data)
		{
		    if(typeof(data) === 'string')
		    {
			if(typeof(map.overlays[data]) !== "undefined")
			{
			    map.overlays[data].setMap(null);

			}
		    }
		},
	    },
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
            },
            calcRoute: function(waypoints){
                if(waypoints.length>1){
                    var origin,destination;
                    origin=waypoints.splice(0,1);
                    destination=waypoints.pop();
                    var req = {
                        origin: origin,
                        destination: destination,
                        waypoints: waypoints,
                        unitSystem: google.maps.UnitSystem.IMPERIAL,
                        travelMode: google.maps.DirectionsTravelMode[map.prefs.travelMode]
                    };
                }
            }            
	},
	marker:{
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
		console.log(map.marker.store);
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
	},
	prefs:{
	    //variables that store preferences
            travelMode : 'BICYCLING',
	    routeOptions : { draggable: true },
	    mapOptions : {
		zoom: 4,
		center: new google.maps.LatLng(37.09024, -95.712891),
		mapTypeId: google.maps.MapTypeId.TERRAIN
	    },
	    sampleData: ['http://massiveboom.com:3001/sampledata/6800-E-Tennessee-Ave.kml',
			 'http://massiveboom.com:3001/sampledata/6800-E-Tennessee-Ave(2).kml',
			 'http://massiveboom.com:3001/sampledata/6800-E-Tennessee-Ave(3).kml',
			 'http://massiveboom.com:3001/sampledata/6800-E-Tennessee-Ave(4).kml',
			 'http://massiveboom.com:3001/sampledata/6800-E-Tennessee-Ave(5).kml',
			 'http://massiveboom.com:3001/sampledata/6800-E-Tennessee-Ave(6).kml',
			 'http://massiveboom.com:3001/sampledata/6800-E-Tennessee-Ave(7).kml']
	},
	server:{
	    //ajax functions for phoning home
	},
        data:{
            //specific data for routes, etc
        }
    }
    google.maps.event.addDomListener(window, 'load', map.init);
});
