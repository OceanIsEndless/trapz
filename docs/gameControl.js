if(typeof window.patreon === 'undefined'){
	window.patreon = 0;
}
window.pingSave = {};
$('#bannerOverLeftSpr').hide();
$('#bannerOverRightSpr').hide();
checkPing = function()
{
	ping('https://fr.trapz.io/').then(function(delta) {
    console.log('fr Ping time was ' + String(delta) + ' ms');
		window.pingSave.fr = delta;
		window.chosenServerName = 'fr';
		doSetUp();
	}).catch(function(err) {
		window.pingSave.fr = -1;
		console.error('Could not ping remote URL', err);
	});
	
	
}

checkPing();

decideServer = function()
{
	window.chosenServerName = 'fr';
	console.log('choose server: ' + window.chosenServerName );
	//window.chosenServerName = 'ws';//temp for dev
}

doSetUp = function()
{
	console.log('do setUp 01');
	if(typeof window.chosenServerName == 'undefined')
	{
		window.chosenServerName = 'fr';
	}
	
	window.socket = window.io('https://'+window.chosenServerName+'.trapz.io', { transports: ['websocket'] });///ca1 - final //ws - dev
	window.startTimePing = new Date();
	
	window.socket.emit('leaderboard', {});

	window.socket.on('leaderboard', function (msg) {
		$("#gold1").html(msg.gold1);
		/*$("#gold7").html(msg.gold7);
		$("#kills1").html(msg.kills1);
		$("#kills7").html(msg.kills7);
		$("#time1").html(msg.time1);
		$("#time7").html(msg.time7);*/
	});
	
	$('#bannerOverLeftSpr').hide();
	$('#bannerOverRightSpr').hide();
	
	window.socket.on('connect', function () {
		console.log('connect');
		window.endTimePing = new Date();
	});

	var ads1 = document.getElementById("trapz-io_300x250");
	if( ads1 != null ) ads1.style.display = "block";
	var ads2 = document.getElementById("trapz-io_300x600");
	if( ads2 != null ) ads2.style.display = "block";

}


window.startLoadGame = function()
{
	console.log('start load new game');
	var params = {
	"indexroot": "true",
	"base": "",
	"api": "none",
	"autoscale": "true"
	};

	var attr = {

	};
	//enables autoresize
	jsembed.embed("objusctFinal.js", "gameDiv", "990", "630", params, attr);
}

window.goMoreGames = function()
{
	window.open('https://kevin.games', '_blank');
}

window.checkGameOverScreenOn = function()
{
	return $('#gameover').is(':visible');
	//return ($('.game_over').style.display === 'none')
}


window.showGameOver = function()
{
	//$('.how_to').hide();
	//$('#trapzLabel').css("font-size", '55px');
	//$('#trapzLabel').css("padding-top", '5px');
	if(window.checkGameOverScreenOn()===true)
	{
		return;
	}
	if(window.shownGameOver===true)
	{
		console.log("refresh gmover ads");
		aiptag.cmd.display.push(function() { aipDisplayTag.refresh('trapz-io_300x600'); });//dont load it right away - show only on open game over
		//aiptag.cmd.display.push(function() { aipDisplayTag.refresh('bannerid-here_300x600'); });
		//aiptag.cmd.display.push(function() { aipDisplayTag.display('trapz-io_300x250'); }); // for banner on main
	}
	else
	{
		console.log("show gmover ads");
		aiptag.cmd.display.push(function() { aipDisplayTag.display('trapz-io_300x600'); });
	}
	window.shownGameOver = true;
	$('#login').hide();
	$('#howtoplay').hide();
	$("#title").show();
	$("#gameBtn").show();
	$("#bannerSpr").hide();
	$('#bannerOverLeftSpr').show();
	$('#bannerOverRightSpr').show();
	$('#trapzLabelOver').show();
	$('#trapzLabel').hide();
	//document.getElementById("title").style.display = "flex";
	window.updateStatText();
	$('#promote').show();
	$('#othergames').hide();
	$('#fbBlock').show();
	$('#gameover').show();
	console.log("show game over");
	//window.hideGame();
}

window.showMain = function()
{
	//$('.how_to').hide();
	$('#login').show();
	$('#howtoplay').show();
	$("#title").show();
	$("#gameBtn").hide();
	//document.getElementById("title").style.display = "flex";
	if(window.shownGameOver===true)
	{
		//aiptag.cmd.display.push(function() { aipDisplayTag.display('trapz-io_300x250'); }); // for banner on main
		//aiptag.cmd.display.push(function() { aipDisplayTag.refresh('trapz-io_300x250'); }); // for banner on main
	}
	$('#promote').hide();
	$('#fbBlock').hide();
	$('#gameover').hide();
	$('#bannerOverRightSpr').hide();
	$('#bannerOverLeftSpr').hide();
	$('#trapzLabelOver').hide();
	$('#trapzLabel').show();
	console.log("show main");
	$("#bannerSpr").show();
	//window.hideGame();
}

window.hideGameOver = function()
{
	//$('.how_to').hide();
	$('#login').show();
	$('#howtoplay').show();
	$('#gameover').hide();
	$('#bannerOverLeftSpr').hide();
	$('#bannerOverRightSpr').hide();
	$('#trapzLabelOver').hide();
	$('#trapzLabel').show();
	$('#promote').hide();
	$('#fbBlock').hide();
	
}

window.hideGameOverAndStart = function()
{
	//window.hideGameOver();
	if(window.adsReady == true && window.checktimeForAds() == true && window.firstPlay === false && window.patreon == 0)
	{
		window.showGAds();
	}
	else
	{
		console.log("Won't show ads. adsReady: "+ window.adsReady + ", checktimeForAds(): "+ window.checktimeForAds() + ", window.firstPlay: " + window.firstPlay);
		window.showGame();
	}
		
	
	
	
}

window.firstSet = function()
{
	console.log('FIRST GAME LOAD');
	window.inputName = document.getElementById('inputName').value;
	window.didFirstSet = true;
	$("#title").hide();
	$('#gameover').hide();
	$('#promote').hide();
	$("#gameDiv").show();
	$("#loading").show();
	
	document.getElementById("loading").style.backgroundSize = window.innerWidth + 'px ' + window.innerHeight + 'px';
	//widow.startLoadGame();
	
	if(window.game.loaded&&!window.loadedFirst)
	{
		window.game.state.start('PlayState', false, false);//
		//if( window.patreon==0 ) window.showGAds();
	}
	else
	{
		window.showGame();
	}
	window.firstPlay = false;
}

window.firstShowGame= function()
{
	if(window.adsReady == true && window.checktimeForAds() == true&& window.firstPlay === false && window.patreon == 0)
	{
		window.showGAds();
	}
	else
	{
		console.log("Won't show ads. adsReady: "+ window.adsReady + " checktimeForAds(): "+ window.checktimeForAds());
		window.firstSet();
	}
	
}

window.showGame = function()
{
	if(window.checkPageTime())
	{
		window.open('https://trapz.io/?'+'rnd='+ Math.floor(Math.random()*1000)+'&nick='+ window.inputName, '_self');//, '_self'
	}
	else
	{
		$("#title").hide();
		$("#gameDiv").show();
		window.game.paused = false;
		if(typeof window.continueAfterDeath !== 'undefined')
		window.continueAfterDeath();//
	}
	window.firstPlay = false;
	/*
	//removed restrts
	window.restartsCount++;
	if(window.restartsCount>0)
	{
		window.restartsCount= 0;
		window.open('https://trapz.io/?'+'rnd='+ Math.floor(Math.random()*1000)+'&nick='+ window.inputName, '_self');//, '_self'
	}*/
}

window.updateStatText = function()
{
	document.getElementById("statText").innerHTML = "Gold: " + window.goldStat + "<br>Kills: "+ window.killStat +"<br>Time: " + window.timeStat;
	
	if(window.killUser.length == 0)
	document.getElementById("gameOverReason").innerHTML = 'Traps are deadly!';
	else
	document.getElementById("gameOverReason").innerHTML = 'Killed by ' + window.killUser;
	//
}

window.hideGame = function()
{
	console.log("hide game");
	document.getElementById("gameDiv").style.display = "none";
	document.getElementById("title").style.display = "flex";
	$("#gameDiv").hide();
	$("#gameDiv").css("visibility","hidden");
	
}

window.hideGame();
window.hideGameOver();
$("#gameBtn").hide();
//$("#bannerSpr").hide();

$( document ).ready(function() {
	console.log( "ready!" );
	
	//hide console output
   // console.log = function () { }//FOR RELEASE
	
	//window.showGameOver();//temp
	var nick = getUrlParameter('nick');
	if(typeof nick != 'undefined')
	{
		window.inputName = nick;
		document.getElementById('inputName').value = nick;
	}
	window.hideGameOver();
	window.startLoadGame();
	window.hideGame();
	$("#inputName").focus();
	$('#inputName').keydown(function(event) {
		if (event.keyCode == 13) {
		  window.firstShowGame();
		  return false;
		}			
	});
  
	//for zoom
   $(document).keydown(function(event) {
	if (event.ctrlKey==true && (event.which == '61' || event.which == '107' || event.which == '173' || event.which == '109'  || event.which == '187'  || event.which == '189'  ) ) {
	//alert('disabling zooming'); 
	event.preventDefault();
	// 107 Num Key  +
	//109 Num Key  -
	//173 Min Key  hyphen/underscor Hey
	// 61 Plus key  +/=
	   }
  });

	$(window).bind('mousewheel DOMMouseScroll', function (event) {
		 if (event.ctrlKey == true) {
		 //  alert('disabling zooming'); 
	   event.preventDefault();
	 }
	});
	//for zoom end
	
	//ads
	
	console.log("create ads controller");
	//init ADS
	/*window.adsController = new google.outstream.AdsController(
	document.getElementById('outstreamContainer'),
	window.onAdLoaded,
	window.onDoneAds);//make a timer so it wont call it too often
	
	//for ads start
	window.adsController.initialize();
	
	window.askForAds();
	*/
	//end ads
	
})

window.askForAds = function()
{
	return;//not used
	
	console.log('asked for ads');
	
	// Request ads
	var adTagUrl =
	/*
	'https://googleads.g.doubleclick.net/pagead/ads?' +
	'ad_type=video_text_image_flash' +
	'&client=ca-games-pub-8183475346589126'+
	'&videoad_start_delay=0' +
	'&description_url=https%3A%2F%2Ftrapz.io%2Finfo%2F' +
	'&max_ad_duration=30000'*/
	'https://googleads.g.doubleclick.net/pagead/ads?ad_type=video&client=ca-games-pub-8183475346589126&description_url='+
		'https%3A%2F%2Ftrapz.io%2Finfo%2Findex.html&channel=6280516015&videoad_start_delay=0&hl=en&max_ad_duration=30000'; // +
	//'&adtest=on';//remove
	window.adsController.requestAds(adTagUrl);
	//for ads end
}

window.checkPageTime = function(){
	let now = new Date();
	let time =  Math.floor((now.getTime() - window.pageTime.getTime())*0.001);
	console.log('page time ' + time);
	return (time >=60*4);
}

window.uuidv1 = function()//is actually v4 just don't want to update source code referencing v1
{
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	return v.toString(16);
  });
}

window.checktimeForAds = function(){
	let now = new Date();
	let time =  Math.floor((now.getTime() - window.lastTimeAds.getTime())*0.001);
	console.log('time since last ads ' + time);
	return (time >=120);
}

window.updateLastAdsTime = function(){
	let now = new Date();
	window.lastTimeAds.setTime(now.getTime());
}

window.showGAds = function()
{
	console.log("asked to show ads");
	
	if(window.firstPlay==false&& window.adsReady == true && window.checktimeForAds()==true)
	{
		
		window.updateLastAdsTime();
		/*window.adsController.showAd();
		$("#outstreamContainer").show();
		document.getElementById("outstreamContainer").style.display = "block";
		*/
		aiptag.cmd.player.push(function() { adplayer.startPreRoll(); });
		window.game.paused = true;
		console.log("call show ads");
		window.adsOn = true;
		//window.adsReady = false;
	}
	else
	{
		console.log("ads not ready or time passed too little" );
		window.adsOn = false;
		
	}
	
}

window.onAdLoaded = function () {
	console.log("loaded ads");
	window.adsReady = true;
	
}

window.callOnDoneAds = function () {
	console.log("call on done ads");
	window.onDoneAds();
}

window.onDoneAds = function () {
// TODO: Be sure to handle ad completion events.
	if(window.adsOn == true)
	{
		window.hideGameOver();
		$("#outstreamContainer").hide();//need to do it with new ads or???
		window.game.paused = false;
		window.adsOn = false;
		console.log('on done ads');
		document.getElementById("outstreamContainer").style.display = "none";
		if(window.didFirstSet == false)
		{
			window.firstSet();
		}
		else
		{
			window.showGame();
		}
		window.askForAds();
	}
	else
	{
		console.log("called on done but no ads was on so do nothing");
	}
}

window.adsOn = false;
window.didFirstSet = false;
window.adsReady = true;//no load ready callback in new ads
window.goldStat = 10;
window.killStat = 10;
window.timeStat = 100;
window.killUser = '';
window.restartsCount = 0;
window.firstPlay = true;
window.timerForAds  = 120;
window.shownGameOver = false;
window.pageTime = new Date();
window.lastTimeAds = new Date();
window.lastTimeEndedAds = new Date();
let now = new Date();
window.lastTimeAds.setTime(now.getTime()-120000);

window.loadedFirst = false;

var getUrlParameter = function getUrlParameter(sParam) {
	var sPageURL = decodeURIComponent(window.location.search.substring(1)),
		sURLVariables = sPageURL.split('&'),
		sParameterName,
		i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : sParameterName[1];
		}
	}
};