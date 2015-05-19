/* ======= Model ======= */

// load map
var mapOptions = {
	zoom: 12,
	center: { lat: 25.778183, lng: -80.131178},
	mapTypeId: google.maps.MapTypeId.HYBRID,
	streetViewControl: true
},
// create variables for DRY
$wikiElem = $('#wikipedia-links'),
map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions),
self = this;
var list = [
		{	
			content: '<div id="content">'+ '<p>Ocean Drive</p>',
			title: 'Ocean Drive',
			marker: new google.maps.Marker({
		    	position: new google.maps.LatLng(25.778183,-80.131178),
		    	title: 'Ocean Drive',
				map: map,
				animation: google.maps.Animation.DROP
  			})
		},
		{	
			content: '<div id="content">'+ '<p>Art Basel</p>',
			title: 'Art Basel',
			marker: new google.maps.Marker({
				position: new google.maps.LatLng(25.813684, -80.127085),
				title: 'Art Basel',
				map: map,
				animation: google.maps.Animation.DROP
			})
		},
		{	
			content: '<div id="content">'+ '<p>Lincoln Road</p>',
			title: 'Lincoln Road',
			marker: new google.maps.Marker({
				position: new google.maps.LatLng(25.790938, -80.135870),
				title: 'Lincoln Road',
				map: map,
				animation: google.maps.Animation.DROP
			})
		},
		{	
			content: '<div id="content">'+ '<p>Fountainebleau</p>',
			title: 'Fountainebleau',
			marker: new google.maps.Marker({
				position: new google.maps.LatLng(25.817967, -80.122120),
				title: 'Fountainebleau',
				map: map,
				animation: google.maps.Animation.DROP
			})
		},
		{
			content: '<div id="content">'+ '<p>American Airlines Arena</p>',
			title: 'American Airlines Arena',
			marker: new google.maps.Marker({
				position: new google.maps.LatLng(25.781729, -80.186980),
				title: 'American Airlines Arena',
				map: map,
				animation: google.maps.Animation.DROP	
			})
		}
	];
// Create markerlist observables
var MarkerList = function(data){
	this.title = ko.observable(data.title);
	this.content = ko.observable(data.content);
	this.marker = ko.observable(data.marker);
};

/* ======= viewModel ======= */
var viewModel = function(){
	var self = this;
	this.markerList = ko.observableArray();
	this.search = ko.observable("");
	var $list = $('.list');	
	var locList = document.querySelectorAll(".list");
	var markerAnimation = function(){
		marker.setAnimation(google.maps.Animation.BOUNCE);
		// limit animation to one bounce: http://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
	   	setTimeout(function(){ marker.setAnimation(null); }, 750);
  	};		
	// add map markers to map and push to markerlist observable array
	list.forEach(function(markerItem){
		self.markerList.push(new MarkerList(markerItem));
		var marker = markerItem.marker;
		var list = markerItem.title;
		// Add event listener to marker for animation when marker is clicked
  		google.maps.event.addListener(marker, 'click', function(){
			marker.setAnimation(google.maps.Animation.BOUNCE);
			// limit animation to one bounce: http://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
		   	setTimeout(function(){ marker.setAnimation(null); }, 750);
  		});	
  		// binding for list location / map marker animation
  		console.log($list);
  		for(var i=0;i<locList.length;i++){
			locList[i].addEventListener('click',function(){
				marker.setAnimation(google.maps.Animation.BOUNCE);
				// limit animation to one bounce: http://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
			   	setTimeout(function(){ marker.setAnimation(null); }, 750);
  			},false);
		}
  	});

	// set current marker and invoke wikipedia function to load accompanying wikipedia articles
  	this.currentLoc = ko.observable(this.markerList()[0]);
  	this.setLoc = function(clickedLoc){
  		self.currentLoc(clickedLoc);
  		$wikiElem.text("");
  		self.wikiPedia();
  	};

  	// Filter results - http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
  	this.filterResults = ko.computed(function() {
  		
  		var stringStartsWith = function (string, startsWith) {        	
	    	string = string || "";
	      	if (startsWith.length > string.length)
	      	return false;
	        return string.substring(0, startsWith.length) === startsWith;
    	};
	    var filter = self.search().toLowerCase();
	    if (!filter) {
	        return self.markerList();
	    } else {
	        return ko.utils.arrayFilter(self.markerList(), function(item) {
	            return stringStartsWith(item.title().toLowerCase(), filter);
	        });
	      }
	});

	// add infowindow to markers
	this.markerList().forEach(function(markerItem){
		var infowindow = new google.maps.InfoWindow({
      		content: markerItem.content()
  		});
  		google.maps.event.addListener(markerItem.marker(), 'click', function() {
    		infowindow.open(map,markerItem.marker());
  		});
  		google.maps.event.addListener(map, 'click', function() {
    		infowindow.close();
  		});
	});

	// wikipedia third party ajax
	this.wikiPedia = function(){
		// Wikipedia
		$wikiElem.on('click', function(){
			console.log("works");
		});
	    var wikiUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + self.currentLoc().title()+"&format=json&callback=wikiCallback";
	    $.ajax({
	      url: wikiUrl,
	      dataType: "jsonp",
	      success: function(response){
	        console.log("Wikipedia: " + response);
	        var articleList = response[1];
	        for(var i = 0; i < articleList.length; i++){
	            articleStr = articleList[i];
	            var url = 'http://en.wikipedia.org/wiki' + articleStr;
	            $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></lil>');
	        }
	      }
	    });
	};
};

ko.applyBindings(new viewModel());





