//<script>
function MM_reloadPage(init) {  //reloads the window if Nav4 resized
  if (init==true) with (navigator) {if ((appName=="Netscape")&&(parseInt(appVersion)==4)) {
    document.MM_pgW=innerWidth; document.MM_pgH=innerHeight; onresize=MM_reloadPage; }}
  else if (innerWidth!=document.MM_pgW || innerHeight!=document.MM_pgH) location.reload();
}
MM_reloadPage(true);


function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_findObj(n, d) { //v4.0
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && document.getElementById) x=document.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

function MM_openDiWindow(theURL,winName,features) { //v2.0
  window.open(theURL,winName,features);
}

function MM_openBrWindow(theURL,winName,features) { //v2.0
  window.open(theURL,winName,features);
}

function MM_showHideLayers() { //v3.0
	var i,p,v,obj,args=MM_showHideLayers.arguments;
	for (i=0; i<(args.length-2); i+=3)
	if ((obj=MM_findObj(args[i]))!=null) {
		v=args[i+2];
		if (obj.style) {
			obj=obj.style;
			v=(v=='show')?'visible':(v='hide')?'hidden':v; 
		}
	obj.visibility=v; }
}


function navigator_check(){
var ts="[ 系统信息 ]\n"+
			 "　　你现在使用的浏览器是Microsoft Internet Explorer，\n"+
			 "但版本过旧，请马上升级你的浏览器到 Version 6.0 以上。\n"+
			 "如因为浏览器版本导至显示不正常、物品丢失、使用后没有效\n"+
			 "果、操作不正常等，OnCity一概不负责。\n\n"+
			 "　　　　　　　　　　　　　　　　　　　　OnCity 管理组\n"+
			 "　　　　　　　　　　　　　　　　　　　　2002年11月13日";
	if (navigator.appName=='Microsoft Internet Explorer'){
		var version=navigator.appVersion.split(';');
		if(version[1].substring(5)<6){
			alert(ts);
			window.open("http://www.luhui.net");
		}
	}
}

function js_error_add(err,page,url){
	alert('程序出现错误，确定后自动刷新，请与管理员联系！');
	location.replace("/online/");
}