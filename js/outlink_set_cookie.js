function setBodyHeightCookie(){
	try{
		var height = 500;
		if(document.all){
			height = document.compatMode=="CSS1Compat" ? document.documentElement.scrollHeight:document.body.scrollHeight; 
		}else{
			height = document.body.scrollHeight;
		}
		if(!height) height = 500;
		height += 20;
		var h = ((typeof(outlink_height) == "undefined")?height:outlink_height);
		var arr = location.hostname.split(".");
		if(arr.length>1){
			document.cookie = "oulink_h="+ h +";domain="+ arr[arr.length-2] + "." + arr[arr.length-1] +";path=/";
		}
	}catch(exp){}
}

try{
	if(top.frames["index"]){
		if (window.addEventListener) {
			window.addEventListener("load",setBodyHeightCookie,false);
		}else if(window.attachEvent) {
			window.attachEvent("onload", setBodyHeightCookie);
		}
		window.setInterval("setBodyHeightCookie();", 3000);
	}
}catch(exp){}