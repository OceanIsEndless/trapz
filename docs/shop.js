window.shop = {};
window.shop.btnsData = [
		{"img":"img/base.png", "name":"Cowboy", "codeName": "default",  "descr":"At your service", "status":"open"}, 
		{"img":"img/old.png", "name":"Old friend", "descr":"Collect 100 gold in a single game","codeName": "whiteHair", "check":'gold100', "status":"locked"},
		{"img":"img/zombie_av.png", "name":"Zombie","codeName": "zombie", "descr":"Play for 5 days in a row", "check":'days5', "status":"locked"},
		{"img":"img/batman.png", "name":"Batman","codeName": "batman", "descr":"Kill the king", "check":'killKing', "status":"locked"},
		{"img":"img/redhead.png", "name":"Redhead","codeName": "redHat", "descr":"Collect 1500 gold in a single game", "check":'gold1500', "status":"locked"},//5
		{"img":"img/bender.png", "name":"Bender","codeName": "bender", "descr":"Tweet","check":'tweet', "status":"locked"},
		{"img":"img/panda.png", "name":"Panda","codeName": "panda", "descr":"Like us on Facebook","check":'fbLike', "status":"locked"},
		{"img":"img/skeleton.png", "name":"Skeleton","codeName": "skeleton", "descr":"Kill 50 players in a single game", "check":'kill50',"status":"locked"},
		{"img":"img/spiderman.png", "name":"Spiderman","codeName": "spiderman", "descr":"Stay alive for 20 minutes in a single game","check":'alive20min', "status":"locked"},
		{"img":"img/bigSkin_choo.png", "name":"Chewbacca","codeName": "choo", "descr":"Kill 150 players in a single game","check":'kill150', "status":"locked"}
	];
	
	window.shop.availSkinsList = ['default'];
	
	
	  // возвращает cookie с именем name, если есть, если нет, то undefined
        window.getCookie = function(name) {
            var matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        }
	
	var cookieSkin = window.getCookie('skin');
	var cookieId = window.getCookie('id');
	
	window.checkId = function()
	{
		if(typeof cookieId === 'undefined' || cookieId === 'undefined')
		{
			var id = uuidv1();
			window.genId = id;
			console.log('create uid');
			window.document.cookie = "id=" + window.genId + "; expires=Fri, 31 Dec 2024 23:59:59 GMT";
		}
		else
		{
			window.genId = cookieId;
		}
	}
	window.checkId();
	
	window.checkDayPlay = function()
	{
		let curTime = new Date();
		let day = curTime.getDate();
		window.lastDayTime = Utils.loadSave('lastTimePlay');
		window.lastDay = Utils.loadSave('lastTimePlayDay');
		//dateObj.getUTCDate();
		var daysPlayed = 0;
		if(typeof window.lastDayTime == 'undefined' || window.lastDayTime == -1)//haven't saved it yet
		{
			daysPlayed = 0
				
			Utils.save('daysPlayedCount', daysPlayed);
		}
		else
		{
			if(window.lastDay != day)//we didn't do it today yet
			{
				let time = curTime - window.lastDayTime;
				console.log('time difference is: ' + time);
				if(time < 1000*60*60*24)
				{
					daysPlayed = Utils.loadSave('daysPlayedCount');
					daysPlayed++;
					console.log("added day, Now: " + daysPlayed);
					if(daysPlayed >= 4)
					{
						Utils.save(window.shop.btnsData[2].check, true);
						window.shop.btnsData[2].status = 'open';
						console.log('unlock zombie');
					}
					Utils.save('daysPlayedCount', daysPlayed);
				}
				else
				{
					daysPlayed = 0
					
					Utils.save('daysPlayedCount', daysPlayed);
				}
			}
			else
			{
				console.log('checked the day today already');
			}
			
		}
		
		
		Utils.save('lastTimePlay', curTime.getTime());
		Utils.save('lastTimePlayDay', curTime.getDate());
	}
	
	
	window.checkUnlocks = function()
	{
		for (var i = 0; i < window.shop.btnsData.length; i++) {
			if (Utils.loadSave(window.shop.btnsData[i].check) == true)
			{
				window.shop.btnsData[i].status = 'open';
				if(window.shop.availSkinsList.indexOf(window.shop.btnsData[i].codeName)<0)
				window.shop.availSkinsList.push(window.shop.btnsData[i].codeName);
			}
			
		}
	}
	
	window.checkChosenShopBtns = function()
	{
		for(j=0;j<window.shop.btnsData.length;j++) 
		{
			if(window.shop.btnsData[j].codeName == window.shop.chosenSkin)
			{
				window.shop.btnsData[j].status = 'chosen';
			}
		}
	}
	
	window.checkChosenShopBtns();
	
	/*
	function findRightHash(hash)
	{
		for(j=0;j<10;j++) {
			var hashNew = md5(window.shop.btnsData[j].codeName, cookieId);
			if(hash == hashNew)
			{
				return window.shop.btnsData[j].codeName;
			}
		}
	}*/
	
	window.shop.doWhenOpen = function()
	{
		window.checkUnlocks();
		window.socket.emit('skinStats', /*JSON.stringify(*/{
                id: window.getCookie('id'),
				skins: window.shop.availSkinsList
            });
	}
	
	window.shop.shopBtns = [];
	window.shop.upgradesState = [];
	
	for(j=0;j<10;j++) {
		window.shop.upgradesState[j] = false;
	}
	
       function addShopBtn(id)
		{
			  // create a new div element
			  // and give it some content
			  let link = document.createElement("a");
			  //createElement('input');
				//execBtn.setAttribute("type", "button");
			  link.setAttribute("style", "-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;" );//"window.clickShopBtn("+ 'id' + ");" );
			  link.setAttribute("href", "javascript:void(0);" );//"window.clickShopBtn("+ 'id' + ");" );
			  //link.setAttribute("href", "javascript:window.clickShopBtn(id);" );//"window.clickShopBtn("+ 'id' + ");" );
			  //link.setAttribute("onclick", "javascript:void(0);" );
	 
			 
			  
			 let mainDiv = document.createElement("div");
			  mainDiv.setAttribute("class", "main-trapz__item main-trapz__item_right trapz-block shopBtnBlock" );
			  mainDiv.setAttribute("id", "shopBtn"+id );
			
			  let btn = document.createElement("div");
			  btn.setAttribute("class", "trapz-info shopBtn" );
			 // mainDiv.appendChild(btn);
			  
			  let nameH2 = document.createElement("h2");
			  nameH2.innerHTML = window.shop.btnsData[id].name;
			  nameH2.setAttribute("style", "padding-top: 0px;" );
			  btn.appendChild(nameH2);
			  /*
			  let linkA = document.createElement("h2");
			  linkA.setAttribute("href", "javascript:void(0);" );
			  linkA.setAttribute("onclick", "javascript:void(0);" );
			  btn.appendChild(linkA);*/
					
			let overlayDiv = document.createElement("div");
			//overlayDiv.setAttribute("class", "col-xxs-12 col-xs-10" );
			overlayDiv.setAttribute("style", "position: absolute; display: block; top: 0px; left: 0px;" );
			  
			  let imgInner = document.createElement("img");
			  imgInner.setAttribute("src", window.shop.btnsData[id].img );
			  imgInner.setAttribute("href", "javascript:void(0);" );
			   btn.appendChild(imgInner);
			   
			  let imgLocked = document.createElement("img");
			  imgLocked.setAttribute("src", 'img/lock.png');
			  imgLocked.setAttribute("style", "display: none;" );
			  imgLocked.setAttribute("id", "shopLocked"+id );
			  
			  let imgOpen = document.createElement("img");
			  imgOpen.setAttribute("src", 'img/shopSelect.png');
			  imgOpen.setAttribute("style", "display: none;" );
			  imgOpen.setAttribute("id", "shopOpenSlot"+id );
			 // imgInner.setAttribute("onclick", 'window.clickShopBtn('+id+');' );//javascript:void(0);
			
			//imgInner.setAttribute('onclick','doSomething();'); // for FF
			
			  overlayDiv.appendChild(imgLocked);
			  overlayDiv.appendChild(imgOpen);
			  
			var paddT =( $("#shopBtn"+id).innerWidth() - $("#shopBtn"+id).width())*0.5;
			let paddY =( $("#shopBtn"+id).innerHeight() - $("#shopBtn"+id).height())*0.5;
			let centerBtnX = $("#shopBtn"+id).width()*0.5 ;//$("#shopBtn"+id).offset().left
				  
			if(id == 5)
			{
				
				let link = document.createElement("a");
				link.setAttribute("onclick", "clickTweeter();" );
				link.setAttribute("href", "https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Ftrapz.io%2F&ref_src=twsrc%5Etfw&text=TRAPZ.IO&tw_p=tweetbutton&url=https%3A%2F%2Ftrapz.io%2F" );
				link.setAttribute("target", "_blank" );
			  
				let imgOpen = document.createElement("img");
				imgOpen.setAttribute("src", 'img/tweetBtn.png');
				imgOpen.setAttribute("id", "tweetBtnShop");
				link.appendChild(imgOpen);
				
				$("#tweetBtnShop").css({display: 'inline', position: 'absolute', top:  paddY+$("#shopBtn"+id).height()*0.35-$("#tweetBtnShop").height()*0.5,//$("#shopBtn"+id).offset().top
						left:paddT+centerBtnX- $("#tweetBtnShop").width()*0.5}); // centerBtnXAndC 
				
				overlayDiv.appendChild(link);
				
			}
			else if( id ==6)
			{
				let link = document.createElement("a");
				link.setAttribute("onclick", "clickFb();" );
				link.setAttribute("href", "https://www.facebook.com/trapzio" );
				link.setAttribute("target", "_blank" );
			  
				let imgOpen = document.createElement("img");
				imgOpen.setAttribute("src", 'img/fbShopBtn.png');
				imgOpen.setAttribute("id", "fbBtnShop");
				link.appendChild(imgOpen);
				
				$("#fbBtnShop").css({display: 'inline', position: 'absolute', top:  paddY+$("#shopBtn"+id).height()*0.35-$("#fbBtnShop").height()*0.5,//$("#shopBtn"+id).offset().top
						left:paddT+centerBtnX- $("#fbBtnShop").width()*0.5}); // centerBtnXAndC 
				
				overlayDiv.appendChild(link);
			}
			else
			{
				let innerName = document.createElement("p");
				innerName.setAttribute("id", "innerText" + id);
				innerName.innerHTML = window.shop.btnsData[id].descr;
				btn.appendChild(innerName);
			}
		  
		  link.appendChild(btn);
		  mainDiv.appendChild(link);
		  mainDiv.appendChild(overlayDiv);
		  
		  
		  mainDiv.onclick = function() {
				
			  if(window.shop.btnsData[id].status != 'locked')
			  {
				  console.log('click btn ' + id);
				   for(i=0; i < window.shop.btnsData.length ; i++) {
					   if(window.shop.btnsData[i].status == 'chosen')
						window.shop.btnsData[i].status = 'open';
				   }
					window.shop.btnsData[id].status = 'chosen';
					$("#shopOpenSlot"+id).attr("src", 'img/tickOn.png');
					//var key = 'tryKey';
					//var hash = md5(window.shop.btnsData[id].name, key);
					
					window.shop.chosenSkin = window.shop.btnsData[id].codeName;//hash;
					window.document.cookie = "skin=" + window.shop.chosenSkin + "; expires=Fri, 31 Dec 2024 23:59:59 GMT";
					console.log("check cookie after save: " + window.getCookie('skin'));
					Utils.save('skin', window.shop.chosenSkin);
					console.log("hash skin: "+window.shop.chosenSkin );
					$.fancybox.close(); 
			  }
			  window.checkShopBtns();
			 
			}; // 
		 
		  // add the newly created element and it's content into the DOM
		  let my_div = document.getElementById("contentsShop");
		  my_div.appendChild(mainDiv);
		  
		  window.shop.shopBtns.push(mainDiv);
		  //mainDiv.insertBefore( '#stretchLine');
		  $("#shopBtn"+id).insertBefore( '#stretchLine');
		}
		
		 for(j=0;j<10;j++) {
			addShopBtn(j);
		 }
		 
		clickTweeter = function()
		{
			setTimeout(function(){
				Utils.save(window.shop.btnsData[5].check, true);
				window.shop.btnsData[5].status = 'open';
				console.log('unlock tweeter');
				window.checkShopBtns();
			}, 500);
			
			
		}
		
		clickFb = function()
		{
			setTimeout(function(){
				Utils.save(window.shop.btnsData[6].check, true);
				window.shop.btnsData[6].status = 'open';
				console.log('unlock fb');
			}, 500);
		}
		 
		window.checkShopBtns = function()
		{
			
			window.checkUnlocks ();
			window.checkChosenShopBtns();
			
			let paddT =( $("#shopBtn"+0).innerWidth() - $("#shopBtn"+0).width())*0.5;
			let paddY =( $("#shopBtn"+0).innerHeight() - $("#shopBtn"+0).height())*0.5;
			let centerBtnX = $("#shopBtn"+0).width()*0.5 ;//$("#shopBtn"+id).offset().left
				  
			if(window.shop.btnsData[5].status == 'locked')
			{
				$("#tweetBtnShop").css({display: 'inline', position: 'absolute', top:  paddY+$("#shopBtn"+0).height()*0.83-$("#tweetBtnShop").height()*0.5,//$("#shopBtn"+id).offset().top
						left:paddT+centerBtnX- $("#tweetBtnShop").width()*0.5}); // centerBtnXAndC 
			}
			else
			{
				$("#tweetBtnShop").css({display: 'none', position: 'absolute', top:  paddY+$("#shopBtn"+0).height()*0.83-$("#tweetBtnShop").height()*0.5,//$("#shopBtn"+id).offset().top
						left:paddT+centerBtnX- $("#tweetBtnShop").width()*0.5}); // centerBtnXAndC 
			}
			
			if(window.shop.btnsData[6].status == 'locked')
			{
				$("#fbBtnShop").css({display: 'inline', position: 'absolute', top:  paddY+$("#shopBtn"+0).height()*0.83-$("#fbBtnShop").height()*0.5,//$("#shopBtn"+id).offset().top
					left:paddT+centerBtnX- $("#fbBtnShop").width()*0.5}); // centerBtnXAndC 
			}
			else
			{
				$("#fbBtnShop").css({display: 'none', position: 'absolute', top:  paddY+$("#shopBtn"+0).height()*0.83-$("#fbBtnShop").height()*0.5,//$("#shopBtn"+id).offset().top
					left:paddT+centerBtnX- $("#fbBtnShop").width()*0.5}); // centerBtnXAndC 
			}
			
			
			 for(id=0; id < window.shop.shopBtns.length ;id++) {
				 let btn = $("#shopBtn"+id);
				  paddT =( $("#shopBtn"+id).innerWidth() - $("#shopBtn"+id).width())*0.5;
				  paddY =( $("#shopBtn"+id).innerHeight() - $("#shopBtn"+id).height())*0.5;
				  centerBtnX = $("#shopBtn"+id).width()*0.5 ;//$("#shopBtn"+id).offset().left
				  let centerBtnXAndC = centerBtnX + paddT; //$("#shopBtn"+id).css('padding');
				  //console.log("centerBtnX " + centerBtnX);
				  //console.log("centerBtnXAndC " + centerBtnXAndC);
				  if(window.shop.btnsData[id].status == 'locked')
				  {
					  $("#shopBtn"+id).attr("css", 'background-color: #BAB4B4');
					//console.log(id+" show locked Y " + $("#shopBtn"+id).offset().top + ", X: " + (- $("#shopLocked"+id).width()*0.5) );
				    $("#shopOpenSlot"+id).css({display: 'none'});
					$("#shopLocked"+id).css({display: 'inline', position: 'absolute', top:  paddY+$("#shopBtn"+id).height()*0.35,//$("#shopBtn"+id).offset().top
					left:paddT+centerBtnX- $("#shopLocked"+id).width()*0.5}); // centerBtnXAndC 
					
					
				  }
				  else
				  {
					    $("#shopOpenSlot"+id).attr("css", 'background-color: #e4e2e2');
				  // console.log("show open");
					   $("#shopLocked"+id).css({display: 'none'});
					   $("#innerText"+id).css({display: 'none'});
					 
					  
					  if(window.shop.btnsData[id].status == 'chosen')
					  {
					   $("#shopOpenSlot"+id).attr("src", 'img/tickOn.png');
					   $("#shopOpenSlot"+id).css({display: 'inline', position: 'absolute', top:  paddY+$("#shopBtn"+id).height()*0.7,//$("#shopBtn"+id).offset().top
					left:paddT+centerBtnX- $("#shopOpenSlot"+id).width()*0.5}); // centerBtnXAndC 
						/*$("#chosen").css({display: 'block', position: 'absolute', top:  $("#shopBtn"+id).offset().top+ $("#shopBtn"+id).height()*0.4+3,
						left:  $("#shopOpenSlot"+id).offset().left}); */
					  }
					  else
					  {
						
						$("#shopOpenSlot"+id).attr("src", 'img/shopSelect.png');
						 $("#shopOpenSlot"+id).css({display: 'inline', position: 'absolute', top: paddY+  $("#shopBtn"+id).height()*0.7,
					  left: paddT+centerBtnX - $("#shopOpenSlot"+id).width()*0.5});  // 
					  }
					   
				  }
				  
				 
			 }
		}
		