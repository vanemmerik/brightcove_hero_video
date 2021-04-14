var	videoRequest = new XMLHttpRequest();
	baseURL = "//solutions.brightcove.com/jvanemmerik/hero/";
	// baseURL = "//anz-demo/";
	var videoOptions = ["6053791210001", "6053794109001", "6051555639001", "6050678412001", "6051854284001", "6051854776001", "6051584128001", "6051584488001", "6051571372001", "6051560203001", "6051561405001", "6051556891001", "6051455119001", "6051454712001"];
	//	var	videoOptions = ["5790731620001"],
	pageProtocol = document.location.protocol, // http or https
	pageLocation = encodeURI(window.location.href), // The current URL
	pageSource = encodeURI(document.referrer), // The referrer source
	// player = "ANZ-Demo hero - HTML video element", // You should not do this. The BC analytics system hates it
	DCAPIbaseURL = pageProtocol + "//metrics.brightcove.com/v2/tracker?", // data-collection api
    rand = Math.random() * 1000000,
    now = new Date().toISOString(),
    session = parseInt(rand).toString() + '_' + now,
	videoID = videoOptions[Math.floor(Math.random() * videoOptions.length)],
	heroVideo = document.getElementById("heroVideo"),
	bc_logo = document.getElementById("bc_hero_logo"),
	source = document.getElementById("videoSrc");
	videoRequest.open('GET', baseURL + 'request.php/?video_id=' + videoID, true);
	videoRequest.setRequestHeader("cache-control", "no-cache");

// Grab the first video and create the element.

videoRequest.onload = function() {
	var data = JSON.parse(this.response);
	if (videoRequest.status >= 200 && videoRequest.status < 400) {
		videoName = data.name;
		pubID = data.account_id;
		let lightVideo = ["6051571372001", "6051560203001", "6051854284001", "6051854776001"].indexOf(videoID) > -1;
		let mp4Source = data.sources.find((source) => source.container === 'MP4' && source.src.match(/^https/));
		// let mp4Source = data.sources.find((source) => source.type === 'application/x-mpegURL' && source.src.match(/^https/)); // Will not work in all browsers 
		if (mp4Source) { 
			source.src = mp4Source.src;
			// console.log(mp4Source);
		}
		heroVideo.setAttribute("poster", data.poster);
		heroVideo.appendChild(source);
		if(lightVideo){
			let logoSwap = document.getElementById("root").childNodes;
			logoSwap[1].id = "bc_hero_logo_dark";
		}else{
			bc_logo.id = "bc_hero_logo";
		}
		heroVideo.load();
	}else{
		console.log("error");
	}
}
videoRequest.send();

heroVideo.onloadedmetadata = function(){
	let epochTime = new Date().getTime();
	let vidDuration = Math.round(heroVideo.duration);
	let playLoadRequest = DCAPIbaseURL + "event=video_impression" + "&session=" + session + "&destination=" + encodeURIComponent(pageLocation) + "&source=" + encodeURIComponent(pageSource) + "&video=" + videoID + "&video_name=" + encodeURIComponent(videoName) + "&domain=videocloud" + "&account=" + pubID + "&time=" + epochTime + "&video_duration=" + vidDuration;
	let scriptElement = document.createElement("img");
	scriptElement.setAttribute("src", playLoadRequest);
	scriptElement.id = "tracking_impression";
	document.getElementsByTagName("body")[0].appendChild(scriptElement);
	console.log("%cMetadata loaded: ","background: #409CA9; color:#FFF; font-family:sans-serif; font-weight: bold; font-size: 15px;"); 
	console.log("Video name: " + videoName + "\n" + "Video ID: " + videoID + "\n" + "Video length: " + vidDuration + "\n" + "Video impression trigger: " + session + "\n" + "Time in ms: " +  epochTime);
	return true;
}
heroVideo.onplay = function(){
	let epochTime = new Date().getTime();
	var vidDuration = Math.round(heroVideo.duration),
		rangeOneStart = 0,
		rangeOneEnd = Math.round(vidDuration / 4 - 1),
		rangeTwoStart = Math.round(vidDuration / 4),
		rangeTwoEnd = Math.round(vidDuration / 4 * 2 - 1),
		rangeThreeStart = Math.round(vidDuration / 4 * 2),
		rangeThreeEnd = Math.round(vidDuration / 4 * 3 -1),
		rangeFourStart = Math.round(vidDuration / 4 * 3),
		rangeFourEnd = Math.round(vidDuration),
		rangePoints = [rangeOneStart, rangeTwoStart, rangeThreeStart, rangeFourStart],
		rangeOneRequest = DCAPIbaseURL + "event=video_engagement" + "&session=" + session + "&destination=" + encodeURIComponent(pageLocation) + "&source=" + encodeURIComponent(pageSource) + "&video=" + videoID + "&video_name=" + encodeURIComponent(videoName) + "&domain=videocloud" + "&account=" + pubID + "&time=" + epochTime + "&video_duration=" + vidDuration + "&range=" + rangeOneStart + ".." + rangeOneEnd,
		rangeTwoRequest = DCAPIbaseURL + "event=video_engagement" + "&session=" + session + "&destination=" + encodeURIComponent(pageLocation) + "&source=" + encodeURIComponent(pageSource) + "&video=" + videoID + "&video_name=" + encodeURIComponent(videoName) + "&domain=videocloud" + "&account=" + pubID + "&time=" + epochTime + "&video_duration=" + vidDuration + "&range=" + rangeTwoStart + ".." + rangeTwoEnd, 
		rangeThreeRequest = DCAPIbaseURL + "event=video_engagement" + "&session=" + session + "&destination=" + encodeURIComponent(pageLocation) + "&source=" + encodeURIComponent(pageSource) + "&video=" + videoID + "&video_name=" + encodeURIComponent(videoName) + "&domain=videocloud" + "&account=" + pubID + "&time=" + epochTime + "&video_duration=" + vidDuration + "&range=" + rangeThreeStart + ".." + rangeThreeEnd;
		rangeFourRequest = DCAPIbaseURL + "event=video_engagement" + "&session=" + session + "&destination=" + encodeURIComponent(pageLocation) + "&source=" + encodeURIComponent(pageSource) + "&video=" + videoID + "&video_name=" + encodeURIComponent(videoName) + "&domain=videocloud" + "&account=" + pubID + "&time=" + epochTime + "&video_duration=" + vidDuration + "&range=" + rangeFourStart + ".." + rangeFourEnd;
		videoComplete = DCAPIbaseURL + "event=video_complete" + "&session=" + session + "&destination=" + encodeURIComponent(pageLocation) + "&source=" + encodeURIComponent(pageSource) + "&video=" + videoID + "&video_name=" + encodeURIComponent(videoName) + "&domain=videocloud" + "&account=" + pubID + "&time=" + epochTime + "&video_duration=" + vidDuration;
	let playEventRequest = DCAPIbaseURL + "event=video_view" + "&session=" + session + "&destination=" + encodeURIComponent(pageLocation) + "&source=" + encodeURIComponent(pageSource) + "&video=" + videoID + "&video_name=" + encodeURIComponent(videoName) + "&domain=videocloud" + "&account=" + pubID + "&time=" + epochTime + "&video_duration=" + vidDuration;
	let scriptElement = document.createElement("img");
	scriptElement.setAttribute("src", playEventRequest);
	scriptElement.id = "tracking_view";
	document.getElementsByTagName("body")[0].appendChild(scriptElement); 
	console.log("%cVideo played: ", "background: #D32781; color:#FFF; font-family:sans-serif; font-weight: bold; font-size: 15px;");
	console.log("Video view trigger: " + session + "\n" + "Time in ms: " + epochTime + "\n" + "Range of 1st quartile: " + rangeOneStart + ".." + rangeOneEnd + "\n" + "Range of 2nd quartile: " + rangeTwoStart + ".." + rangeTwoEnd+ "\n" + "Range of 3rd quartile: " + rangeThreeStart + ".." + rangeThreeEnd + "\n" + "Range of final quartile: " + rangeFourStart + ".." + rangeFourEnd);
	heroVideo.trackingPoint = 0; // Reset tracking count on new video load.
	heroVideo.ontimeupdate = function() {
			let currentTime = Math.round(heroVideo.currentTime);
			// console.log(currentTime + "-" + heroVideo.trackingPoint);
		if(currentTime + 1 > rangeOneStart && heroVideo.trackingPoint === 0){
			console.log("%cRange one: ", "font-family:sans-serif; font-weight: bold; font-size: 20px; text-shadow: 1px 1px 0px #32488A, -1px -1px 0px #32488A, 1px -1px 0px #32488A, -1px 1px 0px #32488A, 2px 1px 0px #D32781, 4px 2px 0px #fdd447, 6px 3px 0px #409CA9, 8px 4px 0px #F67E33, 10px 5px 0px #409CA9; color: #a5c13f; background: transparent;");
			console.log("Range: " + rangeOneStart + ".." + rangeOneEnd);
			heroVideo.trackingPoint++;
			let omitRangeOne = document.getElementById("rangeOne");
			omitRangeOne && omitRangeOne.remove();
			let scriptElement = document.createElement("img");
			scriptElement.setAttribute("src", rangeOneRequest);
			scriptElement.id = "rangeOne";
			document.getElementsByTagName("body")[0].appendChild(scriptElement);	
		}else if(currentTime === rangeTwoStart && heroVideo.trackingPoint === 1){
			console.log("%cRange two: ", "font-family:sans-serif; font-weight: bold; font-size: 25px; text-shadow: 1px 1px 0px #32488A, -1px -1px 0px #32488A, 1px -1px 0px #32488A, -1px 1px 0px #32488A, 2px 1px 0px #D32781, 4px 2px 0px #fdd447, 6px 3px 0px #409CA9, 8px 4px 0px #F67E33, 10px 5px 0px #409CA9; color: #a5c13f; background: transparent;");
			console.log("Range: " + rangeTwoStart + ".." + rangeTwoEnd);
			heroVideo.trackingPoint++;
			let omitRangeTwo = document.getElementById("rangeTwo");
			omitRangeTwo && omitRangeTwo.remove();
			let scriptElement = document.createElement("img");
			scriptElement.setAttribute("src", rangeTwoRequest);
			scriptElement.id = "rangeTwo";
			document.getElementsByTagName("body")[0].appendChild(scriptElement);
		}else if(currentTime === rangeThreeStart && heroVideo.trackingPoint === 2){
			console.log("%cRange three: ", "font-family:sans-serif; font-weight: bold; font-size: 30px; text-shadow: 1px 1px 0px #32488A, -1px -1px 0px #32488A, 1px -1px 0px #32488A, -1px 1px 0px #32488A, 2px 1px 0px #D32781, 4px 2px 0px #fdd447, 6px 3px 0px #409CA9, 8px 4px 0px #F67E33, 10px 5px 0px #409CA9; color: #a5c13f; background: transparent;");
			console.log("Range: " + rangeThreeStart + ".." + rangeThreeEnd);
			heroVideo.trackingPoint++;
			let omitRangeThree = document.getElementById("rangeThree");
			omitRangeThree && omitRangeThree.remove();
			let scriptElement = document.createElement("img");
			scriptElement.setAttribute("src", rangeThreeRequest);
			scriptElement.id = "rangeThree";
			document.getElementsByTagName("body")[0].appendChild(scriptElement);
		}else if(currentTime === rangeFourStart && heroVideo.trackingPoint === 3){
			console.log("%cRange four: ", "font-family:sans-serif; font-weight: bold; font-size: 35px; text-shadow: 1px 1px 0px #32488A, -1px -1px 0px #32488A, 1px -1px 0px #32488A, -1px 1px 0px #32488A, 2px 1px 0px #D32781, 4px 2px 0px #fdd447, 6px 3px 0px #409CA9, 8px 4px 0px #F67E33, 10px 5px 0px #409CA9; color: #a5c13f; background: transparent;");
			console.log("Range: " + rangeFourStart + ".." + rangeFourEnd);
			heroVideo.trackingPoint++;
			let omitRangeFour = document.getElementById("rangeFour");
			omitRangeFour && omitRangeFour.remove();
			let scriptElement = document.createElement("img");
			scriptElement.setAttribute("src", rangeFourRequest);
			scriptElement.id = "rangeFour";
			document.getElementsByTagName("body")[0].appendChild(scriptElement);
		}else if(currentTime === rangeFourEnd && heroVideo.trackingPoint === 4){
			console.log("%cVideo complete: ", "font-family:sans-serif; font-weight: bold; font-size: 40px; text-shadow: 1px 1px 0px #32488A, -1px -1px 0px #32488A, 1px -1px 0px #32488A, -1px 1px 0px #32488A, 2px 1px 0px #D32781, 4px 2px 0px #fdd447, 6px 3px 0px #409CA9, 8px 4px 0px #F67E33, 10px 5px 0px #409CA9; color: #a5c13f; background: transparent;");
			console.log("End time: " + rangeFourEnd + "\n" + "Thanks for watching.");
			heroVideo.trackingPoint++;
			let omitVideoComplete = document.getElementById("videoComplete");
			omitVideoComplete && omitVideoComplete.remove();
			let scriptElement = document.createElement("img");
			scriptElement.setAttribute("src", videoComplete);
			scriptElement.id = "videoComplete";
			document.getElementsByTagName("body")[0].appendChild(scriptElement);
			// heroVideo.trackingPoint = 0; // condition to track events after a loop
		}
	}
}	
heroVideo.onerror = function(){
	console.log("error");
}

// After N time set a new video src and play the video with a new poster and src.

function switchVideo(){
		let omitImpression = document.getElementById("tracking_impression"),
			omitView = document.getElementById("tracking_view"),
			omitRangeOne = document.getElementById("rangeOne"),
			omitRangeTwo = document.getElementById("rangeTwo"),
			omitRangeThree = document.getElementById("rangeThree"),
			omitRangeFour = document.getElementById("rangeFour");
		omitImpression && omitImpression.remove();
		omitView && omitView.remove();
		omitRangeOne && omitRangeOne.remove();
		omitRangeTwo && omitRangeTwo.remove();
		omitRangeThree && omitRangeThree.remove();
		videoID = videoOptions[Math.floor(Math.random() * videoOptions.length)];
		videoRequest.open('GET', baseURL + 'request.php/?video_id=' + videoID, true);
		videoRequest.setRequestHeader("cache-control", "no-cache");
		videoRequest.send();
		console.log("%c New video •͡˘㇁•͡˘ ", "background: #f67e33; color: #FFF; font-family:monospace; font-size: 15px;");
}

// Trigger the new video.

setInterval(() => {
	switchVideo();
}, 180 * 1000);
