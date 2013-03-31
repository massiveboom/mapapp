$(document).ready(function(){
    window.map={
	init:function(){
	    //load api resources
	    map.canvas = new google.maps.Map(document.getElementById("map"),map.prefs.mapOptions);
	    map.geocoder = new google.maps.Geocoder();
	    
	    var ctaLayer = new google.maps.KmlLayer('http://massiveboom.com:3044/sample data/6800 E Tennessee Ave.kml');
		ctaLayer.setMap(map.canvas);
	    
	    //event listeners
	    map.listener.click=google.maps.event.addListener(map.canvas, 'click', function(e) {
		console.log(['click',e]);
	    });
	    
	    map.listener.uiClick = $('#buttons').on('click', 'a', function()
	    {
			switch($(this).attr('id'))
			{
				case "next":
					map.utils.kml.load(map.prefs.sampleData[2]);
					break;
					
				case "previous":
				
					break;
					
				case "all":
					map.utils.kml.load(map.prefs.sampleData);
					break;
					
				case "clear":
					map.utils.kml.clear(map.prefs.sampleData);
					break;
			}
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
			
			clear: function() {},
		}
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



