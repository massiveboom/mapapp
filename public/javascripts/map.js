$(document).ready(function() {
    'use strict';
    window.map = (function() {
        var canvas,
            geocoder,
            overlays = {},
            route = { store: [] },
            listener = { markerClick: [], markerDrop: [] },
            prefs = {
                //variables that store preferences
                travelMode: 'BICYCLING',
                routeOptions: { draggable: true },
                mapOptions: {
                    zoom: 4,
                    center: new google.maps.LatLng(37.09024, -95.712891),
                    mapTypeId: google.maps.MapTypeId.TERRAIN
                }
            },
            data = {
                //specific data for routes, etc
                sampleData: ['http://massiveboom.com:3001/sampledata/6800-E-Tennessee-Ave.kml',
                             'http://massiveboom.com:3001/sampledata/6800-E-Tennessee-Ave(2).kml',
                             'http://massiveboom.com:3001/sampledata/6800-E-Tennessee-Ave(3).kml',
                             'http://massiveboom.com:3001/sampledata/6800-E-Tennessee-Ave(4).kml',
                             'http://massiveboom.com:3001/sampledata/6800-E-Tennessee-Ave(5).kml',
                             'http://massiveboom.com:3001/sampledata/6800-E-Tennessee-Ave(6).kml',
                             'http://massiveboom.com:3001/sampledata/6800-E-Tennessee-Ave(7).kml']
            },
            marker = {
                //markers on the map
                //add marker
                //remove marker
                store: [],
                markerUpdate: function() {

                },
                addMarker: function(location, name) {
                    console.log(this);
                    if (name === 'undefined') {
                        name = this.store.length;
                    }
                    while (this.store[name]) {
                        name = name + "_";
                    }
                    this.store[name] = new google.maps.Marker({
                        position: location,
                        map: canvas,
                        draggable: true
                    });
                    listener.markerClick[name] = google.maps.event.addListener(this.store[name], 'click', function() {
                        //handle marker click
                        //route to previous point if in add mode
                    });
                    listener.markerDrop[name] = google.maps.event.addListener(this.store[name], 'dragend', function() {
                        //handle marker drop
                        console.log(this);
                    });
                    console.log(this.store);
                    if (this.store.length > 1) {
                        route.store[name] = new google.maps.Polyline({
                            path: [new google.maps.LatLng(37.4419, -122.1419), new google.maps.LatLng(location)],
                            strokeColor: "#FF0000",
                            strokeOpacity: 1.0,
                            strokeWeight: 10,
                            map: canvas
                        });
                    }
                },
                removeMarker: function(targetMarker) {
                    //console.log(this);
                    var item = "";
                    if (this.length > 0) {
                        for (item in this.store) {
                            if (item === targetMarker) {
                                this.store[item].setMap(null);
                                this.store[item].splice(0, 1);
                            }
                        }
                    }
                }
            },
            utils = {//commonly repeated code
                callback: function(err, msg, cb) {
                    if (cb) {
                        cb(err, msg);
                    }
                },
                centerMap: function(cb) {//set position to current location if available.
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position) {
                            console.log("moving to your location");
                            console.log(position);
                            var currentPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                            canvas.setCenter(currentPos);
                            canvas.setZoom(14);
                            utils.callback(null, currentPos, cb);
                        }, function(error) {
                            utils.callback(false);
                            utils.callback(true, 'geolocation failed but your browser should support it? idkman.', cb);
                            console.log(error);
                        });
                    } else {
                        utils.callback(true, 'Not supported', cb);
                    }
                },
                ticker: {
                    active      : false,
                    interval    : 5000,
                    maxInterval : 60000,
                    minInterval : 1000,
                    start: function() {
                        ticker.active = true;
                        console.log();
                    },
                    stop: function() {
                        ticker.active = false;
                    },
                    init: function() {
                        console.log('thump');
                        ticker.active = true;
                        var tick = setTimeout(function() {
                            //if stuff happened, reduce interval. else, increase
                        }, ticker.interval);
                    }
                },
                kml: {
                    load: function(data, cb) {
                        if ( typeof data === 'string') {
                            overlays[data] = new google.maps.KmlLayer(data);
                            overlays[data].setMap(canvas);
                        } else {
                            if (cb) {utils.callback(null, 'not a string', cb); }
                        }
                    },
                    clear: function(data, cb) {
                        if ( typeof data === 'string') {
                            if ( overlays[data] !== "undefined") {
                                overlays[data].setMap(null);
                                if (cb) {utils.callback(null, undefined, cb); }
                            } else {
                                utils.callback(true, 'can\'t clear undefined', cb);
                            }
                        } else {
                            utils.callback(true, 'not a string', cb);
                        }
                    }
                },
                encodeAddress: function(location, cb) {
                    geocoder.geocode({ 'address': location}, function(results, status) {
                        if (status !== google.maps.GeocoderStatus.OK) {
                            console.log("lookup encoded is:" + results[0].geometry.location);
                            utils.callback(true, status, cb);
                        } else {
                            utils.callback(null, results, cb);
                        }
                    });
                },
                calcRoute: function(waypoints, cb) {
                    if (waypoints.length > 1) {
                        var origin = wp.shift().position, destination = wp.pop().position, wp = waypoints, req;
                        req = {
                            origin: origin,
                            destination: destination,
                            unitSystem: google.maps.UnitSystem.IMPERIAL,
                            travelMode: google.maps.DirectionsTravelMode[prefs.travelMode]
                        };
                        console.log(origin);
                        console.log(wp);
                        if (wp.length > 0) {
                            for (var i in wp) {
                                wp[i] = {location: wp[i].position, stopover: true};
                            }
                            req.waypoints = wp;
                        }
                        console.log('routing: ');
                        console.log(req);
                        route.service.route(req, function(response, status) {
                            console.log(response);
                            console.log(status);
                            if (status == google.maps.DirectionsStatus.OK) {
                                route.display.setDirections(response);
                            } else {// alert an error message when the route could nog be calculated.
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
                            utils.callback(response, status, cb);
                        });
                    }
                }
            },
            init = function() {
                //load api resources
                canvas = new google.maps.Map(document.getElementById("map"), prefs.mapOptions);
                geocoder = new google.maps.Geocoder();
                route.service = new google.maps.DirectionsService();
                route.display = new google.maps.DirectionsRenderer(prefs.routeOptions);
                route.display.setMap(canvas);
                route.display.setPanel(data.route);
                route.elevation = new google.maps.ElevationService();
                listener.mapClick = new google.maps.event.addListener(canvas, 'click', function(e) {
                    console.log(e);
                    switch (data.clickMode) {
                    case 'addMarker':
                        marker.addMarker(e.latLng);
                        break;
                    default:
                        marker.addMarker(e.latLng);
                        break;
                    }
                });
                listener.uiClick = $('#buttons').on('click', 'a', function() {
                    switch($(this).attr('id')) {
                    case "addMarker":
                        data.clickMode = 'addMarker';
                        break;

                    case "removeMarker":
                        data.clickMode = 'removeMarker';
                        break;

                    case "next":
                        var n = data.sampleData.shift();
                        utils.kml.load(n);
                        data.sampleData.push(n);
                        break;

                    case "previous":
                        var p = data.sampleData.pop();
                        utils.kml.load(p);
                        data.sampleData.unshift(p);
                        break;

                    case "all":
                        for (var i in data.sampleData) {
                            utils.kml.load(data.sampleData[i]);
                        }
                        break;

                    case "clear":
                        for (var i in data.sampleData) {
                            utils.kml.clear(data.sampleData[i]);
                        }
                        break;

                    case "center":
                        utils.centerMap();
                        break;

                    case "directions":
                        console.log("Hey guys...");
                        console.log(marker.store);
                        utils.calcRoute(marker.store, function() {});
                        break;
                    }
                });
            };
        var server = {
            //ajax functions for phoning home
        };
        return { init: init };
    })();
    google.maps.event.addDomListener(window, 'load', function() {
        map.init();
        console.log('go');

    });
});
