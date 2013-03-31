$(document).ready(function(){
	window.map={
		self : this,
		init:function(){
			//load api resources
			self.canvas = new google.maps.Map(document.getElementById("map"),self.prefs.mapOptions);
			self.geocoder = new google.maps.Geocoder();
			self.route.service = new google.maps.DirectionsService();
			self.route.display = new google.maps.DirectionsRenderer(self.prefs.routeOptions);
			self.route.display.setMap(self.canvas);
			self.route.display.setPanel(self.data.route);
			self.route.elevation = new google.maps.ElevationService();
			self.listener.mapClick = new google.maps.event.addListener(self.canvas, 'click', function(e) {
				console.log(e);
				console.log(self.data.clickMode);
				switch(self.data.clickMode){
				case 'addMarker':
					self.marker.addMarker(e.latLng);
					break;
				case 'removeMarker':
					break;
				default:
					break;
				}
			});
			self.listener.uiClick = $('#buttons').on('click', 'a', function(){
				switch($(this).attr('id')){
				case "addMarker":
					self.data.clickMode='addMarker';
					break;

				case "removeMarker":
					self.data.clickMode='removeMarker';
					break;

				case "next":
					var n = self.data.sampleData.shift();
					self.utils.kml.load(n);
					self.data.sampleData.push(n);
					break;

				case "previous":
					var p = self.data.sampleData.pop();
					self.utils.kml.load(p);
					self.data.sampleData.unshift(p);
					break;

				case "all":
					for(var i in self.data.sampleData){
						self.utils.kml.load(self.data.sampleData[i]);
					}
					break;

				case "clear":
					for(var i in self.data.sampleData){
						self.utils.kml.clear(self.data.sampleData[i]);
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
							self.canvas.setCenter(currentPos);
							self.canvas.setZoom(14);
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
						self.overlays[data] = new google.maps.KmlLayer(data);
						self.overlays[data].setMap(self.canvas);
					}
				},
				clear: function(data){
					if(typeof(data) === 'string'){
						if(typeof(self.overlays[data]) !== "undefined"){
							self.overlays[data].setMap(null);
						}
					}
				}
			},
			encodeAddress: function(location,callback){
				self.geocoder.geocode({ 'address': location}, function(results, status){
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
					origin=waypoints.splice(0,1)[0].position;
					destination=waypoints.pop().position;
					var req = {
						origin: origin,
						destination: destination,
						unitSystem: google.maps.UnitSystem.IMPERIAL,
						travelMode: google.maps.DirectionsTravelMode[self.prefs.travelMode]
					};
					if(waypoints.length>1){
						req[waypoints] = waypoints;
					}
					console.log('routing: ');
					console.log(req);
					self.route.service.route(req, function(response, status){
						console.log(response);
						console.log(status);
						if (status == google.maps.DirectionsStatus.OK){
							self.route.display.setDirections(response);
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
				self.marker.store[name] = new google.maps.Marker({
					position: location
					,map: self.canvas
					,draggable: true
				});
				self.listener.markerClick[name]=google.maps.event.addListener(self.marker.store[name], 'click', function() {
					//handle marker click
				});
				self.listener.markerDrop[name]=google.maps.event.addListener(self.marker.store[name], 'dragend', function() {
					//handle marker drop
				});
				console.log(self.marker.store);
				if(self.marker.store.length > 1){
					self.route.store[name] = new google.maps.Polyline({
						path: [new google.maps.LatLng(37.4419, -122.1419), new google.maps.LatLng(location)],
						strokeColor: "#FF0000",
						strokeOpacity: 1.0,
						strokeWeight: 10,
						map: self.canvas
					});
				}
			},
			removeMarker:function(targetMarker){
				//console.log(self);
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
	google.maps.event.addDomListener(window, 'load', self.init);
});