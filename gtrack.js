//center: new google.maps.LatLng(31.80116, 35.20706)
$(document).ready(function(){
  var timer;
  var count = 0;
  var logcount=window.localStorage.length;
  var vibrate;
  var beep;
  var bubble;
  var interval =  $('#interval').val() * 60;

  setMapSize();
  $("#log").hide();
  $("#btnStop").hide();
  $("#settingsPage").hide();
  $("#helpPage").hide();
  $("#mapnav").hide();
  $("#aboutPage").hide();
  $("#text").hide();
  $("#btnHome").hide();
  $("#btnUpdate").hide();
  
  /*var op = { 
      consumerKey : 'VrMZEDv9aS06xVHHY9wqQw', 
      consumerSecret : 'htOvACr5avCYeX7NsI8LUqSWGCZYuAh8yUxn4Y52t0' ,
      callbackUrl: 'http://gtrackapp.blogspot.co.il/'
    };
    
  var requestParams;
  var accessParams;

  var oauth = OAuth(op);
  
  oauth.get('https://api.twitter.com/oauth/request_token',
  // success
  
  function(data) {
    console.dir(data);
    window.open('https://api.twitter.com/oauth/authorize?'+data.text);
    requestParams = data.text; 
  },
  // fail!
  function(data) { console.dir(data) });   */
  
  
  
  var mapOptions = {
    zoom: 12,
    streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_RIGHT
      
    },
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL,
      position: google.maps.ControlPosition.TOP_LEFT
    }        
   };
	
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);
  
  /*if (window.localStorage.length>0){
	  getMarkers( map); 
	  getLogItem( window.localStorage.length);
  }
  else{ */
    navigator.geolocation.getCurrentPosition(function(position){
        map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));   
	});   
  //}

  $("#btnStart").click(function(){
      $("#btnStop").show();
      $("#btnStart").hide();
       timer = $.timer(function() {
    	 count++;
        $('#counter').html('<b>Elapsed time:</b> ' + count + ' seconds');
          
      });    
      timer.set({ time : 1000, autostart : true });         
  });
  
  $("#btnClear").click(function(){
     window.localStorage.clear();
     $("#activity").val('');
     map = new google.maps.Map(document.getElementById("map"), mapOptions);
      navigator.geolocation.getCurrentPosition(function(position){
         map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));   
     }); 
     count=0;
    });
  
  
  $("#btnHome").click(function(){
    $("#text").hide();
    $("#map").show();
    $("#btnNote").show();
    $("#btnHome").hide();
    $("#btnUpdate").hide(); 
  });
  
  $("#btnNote").click(function(){
    $("#text").show();
    $("#map").hide();
    $("#btnNote").hide();
    $("#btnHome").show();
    $("#btnUpdate").show(); 
  });
  
  $("#btnStop").click(function(){
    $("#btnStop").hide();
    $("#btnStart").show();
    timer.stop(); 
  });
  
  $("#mapnav").click(function(){
    interval =  $('#interval').val() * 60;
    vibrate = $('#vibrate').val();
    beep = $('#beep').val();
    //bubble = $('#bubble').val();
    $("#settingsPage").hide();
    $("#mapnav").hide();
    $("#aboutPage").hide();
    $("#cfgnav").show();
    $("#logPage").show();
    $("#controls").show();
    $("#nav").collapse('toggle');
  });
  
  $("#cfgnav").click(function(){
    $("#logPage").hide();
    $("#cfgnav").hide();
    $("#controls").hide();
    $("#mapnav").show();
    $("#settingsPage").show();
    $("#nav").collapse('toggle');
  });
  
  $("#aboutnav").click(function(){
    $("#settingsPage").hide();
    $("#logPage").hide();
    $("#controls").hide();
    $("#cfgnav").hide();
    $("#aboutPage").show();
    $("#mapnav").show();
    $("#nav").collapse('toggle');
  });
  
  
  $("#btnPos").click(function(){		
  	navigator.geolocation.getCurrentPosition(function(position){
     getNewMarker(position, map);
     postUpdate(logcount); 
  	}); 
  });

  $("#btnNxt").click(function(){  
   logcount++;
   logcount = checkcount(logcount, 1, window.localStorage.length);
   getLogItem( logcount);
   getMapPos(logcount, map);
   upDateDetails(logcount);
  });
  
  $("#btnPrv").click(function(){
    logcount--;
    logcount = checkcount(logcount, 1, window.localStorage.length);
    getLogItem( logcount);
    getMapPos(logcount, map);
    upDateDetails(logcount);
  });
  
  $("#btnUpdate").click(function(){		
    upDateDetails(logcount); 
  });
  
}); 

function postUpdate(keyname){
   var currPos = JSON.parse( window.localStorage.getItem( keyname ) );
   oauth.post('https://api.twitter.com/1/statuses/update.json',
                    { 'status' : currPos.location,  // jsOAuth encodes for us
                      'trim_user' : 'true' },
                    function(data) {
                        alert('Success Tweeting.'); 
                    },
                    function(data) { 
                        alert('Error Tweeting.'); 
                    }
            );             
  

}


function upDateDetails(keyname){
  	
    var currPos = JSON.parse( window.localStorage.getItem( keyname ) );
    currPos.details = $("#details").val(); 
    window.localStorage.setItem(keyname, JSON.stringify(currPos, '\n')); 
    
}


function setMapSize(){
	var res =  screen.availHeight;
	      
	if(res <= 320){
      $("#map").height('200px');
	}
	else if(res > 320 && res < 400){
      $("#map").height('250px');
    } 
 	else if(res >= 400 && res < 480 ){
      $("#map").height('275px');
    }
 	else if(res >= 480 && res < 540 ){
      $("#map").height('350px');
 	}
 	else if(res > 540 ){
 	  $("#map").height('400px');
 	}
     
}


function getNewMarker(position, map){

  map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));   
  var point = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  
	
  var count=window.localStorage.length+1;
	
  var title = "Loc: " +  count;
  
  var marker = new google.maps.Marker({
        position: point,
        map: map,
        title: title 
    });
    
  
  logPos(position, count); 
  resolvePlaceName(marker, map, point,  count); 
  
   
}

function resolvePlaceName(marker, map, point, keyname){

	var geocoder = new google.maps.Geocoder();
	map.setCenter(point);
	var currPos = JSON.parse( window.localStorage.getItem( keyname ) ); 
	var d = new Date(currPos.ts);
	
	var info = 'Unable to resolve location name'; 
	geocoder.geocode({'latLng': point}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
	      if (results[1]) {
	      	info =  results[1].formatted_address;
	       }        
	  }
	    
	  currPos.location = info;
	  
	  $("#location").val('Lat: ' + currPos.lat + ', ' + 
		      'Lng: ' + currPos.lng + '\n' + info);
	  
	  var pos = 'Location ' + currPos.id + '<br>' +
	      d.toLocaleDateString() +  '<br>' + 
	      d.toLocaleTimeString() + '<br>' +
	      'Lat: ' + currPos.lat + ', ' + 
	      'Lng: ' + currPos.lng + '<br>' + info;
	      
      var infowindow = new google.maps.InfoWindow({            
	       content:  pos,
	       maxWidth: 60		
	   });
	  
	  google.maps.event.addListener(marker, 'click', function() { 
		  infowindow.open(map,marker);
	  });
    
    infowindow.open(map, marker); 
         
  });
}

function logPos(position, keyname){
 
  var currPos = new Object;
  var d = new Date(position.timestamp);
  
  currPos.id = keyname;  
  currPos.ts = position.timestamp;
  currPos.lng = position.coords.longitude;
  currPos.lat = position.coords.latitude;
  currPos.details;
  //currPos.location ='';
     
  window.localStorage.setItem(keyname, JSON.stringify(currPos, '\n')); 
  getLogItem( keyname);
      
 	
}

function getLogItem( keyname){
  var currPos = JSON.parse( window.localStorage.getItem( keyname ) );
  var d = new Date(currPos.ts);
  $("#details").val(currPos.details );
  $("#activity").val('Location: ' + currPos.id );
  $("#date").val(d.toLocaleDateString() +  ' (' + d.toLocaleTimeString() + ')' );
  
}

function getMarkers( map){
	var keyname;
	for ( keyname=1; keyname < window.localStorage.length; keyname++) {	
		var currPos = JSON.parse( window.localStorage.getItem( keyname ) ); 
		var point = new google.maps.LatLng(currPos.lat, currPos.lng); 	
		var title = "Loc: " +  keyname + ' ' + point;  
		var marker = new google.maps.Marker({
	        position: point,
	        map: map,
	        title: title 
		});
		resolvePlaceName(marker, map, point, keyname);    	
	}     
}


function getMapPos(keyname, map){
  var currPos = JSON.parse( window.localStorage.getItem( keyname ) ); 
  map.setCenter(new google.maps.LatLng(currPos.lat, currPos.lng));   
  var point = new google.maps.LatLng(currPos.lat, currPos.lng); 
	
  var title = "Loc: " +  keyname + ' ' + point;
  
  var marker = new google.maps.Marker({
        position: point,
        map: map,
        title: title 
  });
  
  resolvePlaceName(marker, map, point, currPos.id);
     
}

function checkcount(count, min, max){

  if(count<min){
    return 0;
  }
  else if(count>max){
    return max;
  }
  else{
    return count;
  }
} 

function success(fileSystem) {
    console.log(fileSystem.name);
    console.log(fileSystem.root.name);
}

function fail(evt) {
    console.log(evt.target.error.code);
}