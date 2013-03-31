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
		console.log(e);
		console.log(map.data.clickMode);
		switch(map.data.clickMode){
		case 'addMarker':
		    map.marker.addMarker(e.latLng);
		    break;
		case 'removeMarker':
		    break;
		default:
		    break;
		}
	    });						    
	    map.listener.uiClick = $('#buttons').on('click', 'a', function(){
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
	},
	overlays:{},
	listener:{},
	utils:{//commonly repeated code
	    centerMap:function(callback){		
		//set position to current location if available.
		if(navigator.geolocation) {
   		    navigator.geolocation.getCurrentPosition(
			function(position) {
			    console.log("moving to your location");
			    console.log(position);
    	  		    currentPos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
   		  	    map.canvas.setCenter(currentPos);
			    map.canvas.setZoom(14);
    			},
			function(error) {
			    console.log('geolocation failed but your browser should support it? idkman.');
			    console.log(error);
   			});
   		}
		else{
		    callback(false);
		}	
	    },
	    ticker:{
		active:false,
		interval:5000,    
		maxInterval:60000, 
		minInterval:1000, 
		start: function(){
		    active=true;
		    console.log();
		},
		stop: function(){
		    active=false;
		},
		init:function(){
		    console.log('thump');
		    active=true;
		    var tick=setTimeout(function(){
			//if stuff happened, reduce interval. else, increase
		    },interval);
		}
	    },
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
            encodeAddress: function(location,callback){
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
		if(!name){
		    console.log(this);
		    var name = this.store.length;
		}
		while(this.store[name]){
		    name=name+"_";
		}
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
		console.log(map);
		if(marker.store.length>0){
		    for(i in marker.store){ 
			if (i == targetMarker) {
			    marker.store[i].setMap(null);
			    marker.store[i].splice(0,1);
			};
		    }
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
	    //clickMode:"addMarker"
        }
    }
    google.maps.event.addDomListener(window, 'load', map.init);
});
