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
			map.route.elevation = new google.maps.ElevationService();
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
				switch($(this).attr('id')){
				case "addMarker":
					map.data.clickMode='addMarker';
					break;

				case "removeMarker":
					map.data.clickMode='removeMarker';
					break;

				case "next":
					var n = map.data.sampleData.shift();
					map.utils.kml.load(n);
					map.data.sampleData.push(n);
					break;

				case "previous":
					var p = map.data.sampleData.pop();
					map.utils.kml.load(p);
					map.data.sampleData.unshift(p);
					break;

				case "all":
					for(var i in map.data.sampleData){
						map.utils.kml.load(map.data.sampleData[i]);
					}
					break;

				case "clear":
					for(var i in map.data.sampleData){
						map.utils.kml.clear(map.data.sampleData[i]);
					}
					break;
				}

			});
		},
		overlays:{},
		listener:{
			markerClick:[],
			markerDrop:[]
		},
		utils:{//commonly repeated code
			centerMap:function(callback){
				//set position to current location if available.
				if(navigator.geolocation){
					navigator.geolocation.getCurrentPosition(
						function(position){
							console.log("moving to your location");
							console.log(position);
		  					currentPos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
							map.canvas.setCenter(currentPos);
							map.canvas.setZoom(14);
						},
						function(error){
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
			kml:{
				load: function(data){
					if(typeof(data) === 'string'){
						map.overlays[data] = new google.maps.KmlLayer(data);
						map.overlays[data].setMap(map.canvas);
					}
				},
				clear: function(data){
					if(typeof(data) === 'string'){
						if(typeof(map.overlays[data]) !== "undefined"){
							map.overlays[data].setMap(null);
						}
					}
				}
			},
			encodeAddress: function(location,callback){
				map.geocoder.geocode({ 'address': location}, function(results, status){
					if(status != google.maps.GeocoderStatus.OK){
						console.log("lookup encoded is:"+results[0].geometry.location);
						results=false;
					}
					if(callback){
						callback(results);
					}
				});
			},
			calcRoute: function(waypoints,callback){
				if(waypoints.length>1){
					var origin,destination;
					origin=waypoints.splice(0,1);
					destination=waypoints.pop();
					var req = {
						origin: origin,
						destination: destination,
						unitSystem: google.maps.UnitSystem.IMPERIAL,
						travelMode: google.maps.DirectionsTravelMode[map.prefs.travelMode]
					};
					if(waypoints.length>1){
						req[waypoints] = waypoints;
					}
					map.route.service.route(request, function(response, status){
						if (status == google.maps.DirectionsStatus.OK){
							map.route.display.setDirections(response);
						}
						else{// alert an error message when the route could nog be calculated.
							if (status == 'ZERO_RESULTS') {
								console.log('No route could be found between the origin and destination.');
							} else if (status == 'UNKNOWN_ERROR') {
								console.log('A directions request could not be processed due to a server error. The request may succeed if you try again.');
							} else if (status == 'REQUEST_DENIED') {
								console.log('This webpage is not allowed to use the directions service.');
							} else if (status == 'OVER_QUERY_LIMIT') {
								console.log('The webpage has gone over the requests limit in too short a period of time.');
							} else if (status == 'NOT_FOUND') {
								console.log('At least one of the origin, destination, or waypoints could not be geocoded.');
							} else if (status == 'INVALID_REQUEST') {
								console.log('The DirectionsRequest provided was invalid.');
							} else {
								console.log("There was an unknown error in your request. Requeststatus: nn"+status);
							}
						}
						callback(response,status);
					});
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
					var name = this.store.length;
				}
				while(this.store[name]){
					name=name+"_";
				}
				map.marker.store[name] = new google.maps.Marker({
					position: location
					,map: map.canvas
					,draggable: true
				});
				map.listener.markerClick[name]=google.maps.event.addListener(map.marker.store[name], 'click', function() {
					//handle marker click
				});
				map.listener.markerDrop[name]=google.maps.event.addListener(map.marker.store[name], 'dragend', function() {
					//handle marker drop
				});
				console.log(map.marker.store);
				if(map.marker.store.length > 1){
					map.route.store[name] = new google.maps.Polyline({
						path: [new google.maps.LatLng(37.4419, -122.1419), new google.maps.LatLng(location)],
						strokeColor: "#FF0000",
						strokeOpacity: 1.0,
						strokeWeight: 10,
						map: map.canvas
					});
				}
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
			}
		},
		route:{
			store: []
		},
		prefs:{
			//variables that store preferences
			travelMode : 'BICYCLING',
			routeOptions : { draggable: true },
			mapOptions : {
				zoom: 4,
				center: new google.maps.LatLng(37.09024, -95.712891),
				mapTypeId: google.maps.MapTypeId.TERRAIN
			}
		},
		server:{
			//ajax functions for phoning home
		},
		data:{
			//specific data for routes, etc
			sampleData: ['http://massiveboom.com:3001/sampledata/6800-E-Tennessee-Ave.kml',
				     'http://massiveboom.com:3001/sampledata/6800-E-Tennessee-Ave(2).kml',
				     'http://massiveboom.com:3001/sampledata/6800-E-Tennessee-Ave(3).kml',
				     'http://massiveboom.com:3001/sampledata/6800-E-Tennessee-Ave(4).kml',
				     'http://massiveboom.com:3001/sampledata/6800-E-Tennessee-Ave(5).kml',
				     'http://massiveboom.com:3001/sampledata/6800-E-Tennessee-Ave(6).kml',
				     'http://massiveboom.com:3001/sampledata/6800-E-Tennessee-Ave(7).kml']
		}
	};
	google.maps.event.addDomListener(window, 'load', map.init);
});