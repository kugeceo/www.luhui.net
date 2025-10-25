function _zdicInit(){
  if(_zdic_init==1){
    _zdicUpdateStatus();
  	return true;
  }
  if(! document || ! document.body || !document.body.firstChild){
    setTimeout("_zdicInit()",800);
  	return true;
  }
  var agt = navigator.userAgent.toLowerCase();
  var b='border:none;padding:0px;margin:0px;';
  var f='font-weight:normal;font-family:Verdana, Geneva, Arial, Helvetica, sans-serif;';
  _zdic_is_ie = (agt.indexOf("msie")!=-1 && document.all);
  _zdic_opera = (agt.indexOf('opera')!=-1 && window.opera && document.getElementById);
  var h = '<table width="330" height="300" border="0" cellspacing="0" cellpadding="0" ';
  h += 'style="border-top:1px solid #52382b;border-left:1px solid #52382b;';
  h += 'border-right:1px solid #52382b;border-bottom:1px solid #52382b;';
  h += '"><tr><td width="100%" style="'+b+'">';
  h += '<div style="width:330px;height:20px;cursor:move;background-color:#eee4cb;display:inline;'+b+'" onmouseover="_zdic_onmove=1;" onmouseout="_zdic_onmove=0;">' ;
  h += '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td align="left" width="60%" height="20" style="background-color:#eee4cb;color:#6e312d;font-size:14px;line-height:20px;border:none;border-bottom:1px solid #a89b88;padding:0 3px;margin:0px;'+f+'" id="_zdic_title" name="_zdic_title">';
  h += '&#20869;&#25991;&#21462;&#35789; - LuHui.NET';
  h += '</td>';
  h += '<td align="right" height="20" style="background-color:#eee4cb;line-height:20px;border:none;border-bottom:1px solid #a89b88;padding:0 3px 3px 0;margin:0px;'+f+'" valign="middle">';
  h += '<a href="'+_zdic_host+'" target="_blank" title="&#35814;&#32454;&#35299;&#37322;" style="'+b+f+'" id="_zdic_detail" name="_zdic_detail">';
  h += '<img src="'+_zdic_host+'images/ueser_invisible.gif" border="0" style="border:none;display:inline;'+b+'" align="absmiddle"></a> ';
  h += '<a href="'+_zdic_help+'" target="_blank" title="&#24110;&#21161;" style="'+b+f+'">';
  h += '<img src="'+_zdic_host+'images/space.gif" border="0" style="border:none;display:inline;'+b+'" align="absmiddle"></a> ';
  h += '<a href="javascript:_zdicClose()" title="&#20851;&#38381;" target="_self" style="'+b+f+'">';
  h += '<img src="'+_zdic_host+'images/menu_tip_close.gif" border="0" style="border:none;display:inline;'+b+'" align="absmiddle">';
  h += '</a>';
  h += '</td></tr></table>';
  h += '</div>';
  
  h += '<table border="0" cellspacing="4" cellpadding="3" width="100%" align="center" onmouseover="_zdic_onlayer=1;" onmouseout="_zdic_onlayer=0;" style="'+b+'">';
  h += '<tr><td style="'+b+'">';
  h += '<table border="0" width="100%" cellspacing="0" cellpadding="0" align="center" style="'+b+'">';
  h += '<tr><td width="100%" height="252" style="'+b+'" id="_zdicContent" name="_zdicContent">';
  h += '<iframe id="_zdicFrame" name="_zdicFrame" HEIGHT="252" src="about:blank" FRAMEBORDER="0" width="100%"></iframe>';
  h += '</td></tr><tr align="center"><td width="100%" height="18" style="color:#999999;font-size:10px;line-height:18px;'+b+f+'" valign="bottom">';
  h += '&copy;2004-1-11 ';
h += '<a href="http://luhui.net/" target="_blank" style="color:#b8a89d;font-size:10px;line-height:18px;text-decoration:none;'+b+f+'">LuHui.NET</a> <a href="http://luhui.net/" target="_blank" style="color:#999999;font-size:10px;line-height:18px;text-decoration:none;'+b+f+'">&#40065;&#34426;</a>';
  h += '</td></tr></table></td></tr></table>';
  h += '</td></tr></table>';
  try{
  	var els=document.getElementsByTagName("*");
	var zmax=97;
	for(var i=0;i<els.length;i++){
	     if(zmax< els[i].style.zIndex) zmax=els[i].style.zIndex
	}
    var el = document.createElement('div');
    el.id='_zdic_layer';
    if(typeof el.style == "undefined") return;
    el.style.position='absolute';
    el.style.display='none';
    el.style.padding='0px';
    el.style.margin='0px';
    el.style.width='330px';
    el.style.zIndex=zmax+1;
    el.style.backgroundColor='#FFF';
    el.style.filter='Alpha(Opacity=96)';

    document.body.insertBefore(el,document.body.firstChild);
    _zdicSet(el, h);
    
    
    el = document.createElement('div');
    el.id='_zdic_status';
    if(typeof el.style == "undefined") return;
    el.style.position='absolute';
    el.style.backgroundColor='#ede2cb';
    el.style.padding='1px';
    el.style.margin='0px';
    el.style.filter='Alpha(Opacity=80)';
    el.style.fontSize='14px';
    el.style.left = '3px';
    el.style.top = '3px';
    el.style.width='138px';
    el.style.height='22px';
    el.style.textAlign='center';
    el.style.zIndex=zmax+2;
    el.style.border = '1px solid #a49884';
    el.style.display='none';
    document.body.insertBefore(el,document.body.firstChild);
  }catch(x){
    _zdic_init = 2;
    return;
  }
  _zdicClose();

  
  if(document.addEventListener){
    document.addEventListener("mousemove", _zdicMove, true);
    document.addEventListener("dblclick", _zdicQuery, true);
    document.addEventListener("mouseup", _zdicQuery, true);
    document.addEventListener("mousedown", _zdicCheck, true);
    document.addEventListener("keydown", _zdicKey, true);
    document.addEventListener("load", _zdicUpdateStatus, true);
  }else if (document.attachEvent) {
    document.attachEvent("onmousemove", _zdicMove);
    document.attachEvent("ondblclick", _zdicQuery);
    document.attachEvent("onmouseup", _zdicQuery);
    document.attachEvent("onmousedown", _zdicCheck);
    document.attachEvent("onkeydown", _zdicKey);
    document.attachEvent("onload", _zdicUpdateStatus);
  }else{
    var oldmove = (document.onmousemove) ? document.onmousemove : function () {};
  	document.onmousemove =  function () {oldmove(); _zdicMove();};
  	var olddblclick = (document.ondblclick) ? document.ondblclick : function () {};
    document.ondblclick = function () {olddblclick(); _zdicQuery();};
    var oldmouseup = (document.onmouseup) ? document.onmouseup : function () {};
    document.onmouseup = function () {oldmouseup(); _zdicQuery();};
    var oldmousedown = (document.onmousedown) ? document.onmousedown : function () {};
    document.onmousedown = function () {oldmousedown(); _zdicCheck();};
    var oldkeydown = (document.onkeydown) ? document.onkeydown : function () {};
    document.onkeydown = function () {oldkeydown(); _zdicKey();};
    var oldload = (document.onload) ? document.onload : function () {};
    document.onload = function () {oldload(); _zdicUpdateStatus();};
  }
  _zdic_oldselectstart = (document.onselectstart) ? document.onselectstart : function () {};
  document.onselectstart = function () {if(_zdic_moving == 2) return false; else return true;};
  _zdic_onselect = 1;
  var img = new Image();
  img.src = _zdic_host+"images/loading.gif";
  _zdic_layer = _zdic_getObj('_zdic_layer');
  _zdic_status = _zdic_getObj('_zdic_status');
  _zdic_iframe = _zdic_getObj('_zdicFrame');
  _zdic_mode = 1;
  if( _zdic_GetCookie("dicthuaci") == "off"){
  	_zdic_enable = false;
  }
  setTimeout("_zdicUpdateStatus()",1000);
  _zdicUpdateStatus();
  _zdic_init = 1;
}
function _zdic_SetCookie(name,value,day) {
try{
    var domain = document.domain + ":";
    domain = domain.toLowerCase();
	var arydomain = new Array(".com",".com.cn",".net",".net.cn",".cc",".org",".org.cn",".gov.cn",".info",".biz",".tv",".name");
	var tmpdomain = "";
	var strdomain = "";
	for(var i=0;i<arydomain.length; i++){
	    tmpdomain = arydomain[i]+":";      
	    if(domain.indexOf(tmpdomain)!=-1){
			domain = domain.replace(tmpdomain,"");
			domain = domain.substring(domain.lastIndexOf(".")+1,domain.length);
			domain = domain + tmpdomain;
			strdomain = "; domain=." + domain.replace(":","");
			break;
		}
	}
	if(domain.indexOf("luhui.net:")!=-1){
  		strdomain = "; domain=.luhui.net";
    }
    var date = new Date();
	date.setTime(date.getTime()+(day*24*60*60*1000));
	var expires = "; expires="+date.toGMTString();
	document.cookie = name+"="+value+expires+"; path=/"+strdomain;
}catch(x){;}
}
function _zdic_GetCookie(name)
{
    var cookie=String(document.cookie);
    var pos=cookie.indexOf(name+"=");
    if(pos!=-1){
        var end=cookie.indexOf("; ",pos);
        return cookie.substring(pos+name.length+1,end==-1?cookie.length:end);
    }
    return "";
}
function _zdic_getObj(id) {
	if (document.getElementById) return document.getElementById(id);
	else if (document.all) return document.all[id];	
	else if (document.layers) return document.layers[id];
	else {return null;}
}
var _zdic_hexchars = "0123456789ABCDEF";
function _zdic_toHex(n) {
  return _zdic_hexchars.charAt(n>>4)+_zdic_hexchars.charAt(n & 0xF);
}

var _zdic_okURIchars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function _zdic_toutf8(wide) {
  var c, s;
  var enc = "";
  var i = 0;
  while(i<wide.length) {
    c= wide.charCodeAt(i++);
    // handle UTF-16 surrogates
    if (c>=0xDC00 && c<0xE000) continue;
    if (c>=0xD800 && c<0xDC00) {
      if (i>=wide.length) continue;
      s= wide.charCodeAt(i++);
      if (s<0xDC00 || c>=0xDE00) continue;
      c= ((c-0xD800)<<10)+(s-0xDC00)+0x10000;
    }
    // output value
    if (c<0x80) enc += String.fromCharCode(c);
    else if (c<0x800) enc += String.fromCharCode(0xC0+(c>>6),0x80+(c&0x3F));
    else if (c<0x10000) enc += String.fromCharCode(0xE0+(c>>12),0x80+(c>>6&0x3F),0x80+(c&0x3F));
    else enc += String.fromCharCode(0xF0+(c>>18),0x80+(c>>12&0x3F),0x80+(c>>6&0x3F),0x80+(c&0x3F));
  }
  return enc;
}
function _zdic_encodeURIComponentNew(s) {
  s = _zdic_toutf8(s);
  var c;
  var enc = "";
  for (var i= 0; i<s.length; i++) {
    if (_zdic_okURIchars.indexOf(s.charAt(i))==-1)
      enc += "%"+_zdic_toHex(s.charCodeAt(i));
    else
      enc += s.charAt(i);
  }
  return enc;
}

function _zdic_URL(w)
{
	var s = "";
	if (typeof encodeURIComponent == "function")
	{
		s = encodeURIComponent(w);
	}
	else 
	{
		s = _zdic_encodeURIComponentNew(w);
	}
	return s;
}
function _zdicSet(el, htmlCode) {
	if(!el || 'undefined' == typeof el) return;
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('msie') >= 0 && ua.indexOf('opera') < 0) {
        el.innerHTML = '<div style="display:none">for IE</div>' + htmlCode;
        el.removeChild(el.firstChild);
    }
    else {
        var el_next = el.nextSibling;
        var el_parent = el.parentNode;
        el_parent.removeChild(el);
        el.innerHTML = htmlCode;
        if (el_next) {
            el_parent.insertBefore(el, el_next)
        } else {
            el_parent.appendChild(el);
        }
    }
}

function _zdicGetSel()
{
	if (window.getSelection) return window.getSelection();
	else if (document.getSelection) return document.getSelection();
	else if (document.selection) return document.selection.createRange().text;
	else return '';
}

function _zdicGetPos(event){
try{
  if(_zdic_opera){
    _zdic_x = event.clientX + window.pageXOffset;;
    _zdic_y = event.clientY + window.pageYOffset;;
  }else if (_zdic_is_ie) {
    _zdic_x = window.event.clientX + document.documentElement.scrollLeft
      + document.body.scrollLeft;
    _zdic_y = window.event.clientY + document.documentElement.scrollTop
      + document.body.scrollTop;
  }else {
    _zdic_x = event.clientX + window.scrollX;
    _zdic_y = event.clientY + window.scrollY;
  }
}catch(x){}
  if(!_zdic_isInteger(_zdic_x)) _zdic_x = 200;
  if(!_zdic_isInteger(_zdic_y)) _zdic_y = 200;
}

function _zdicKey(e){
_zdicClose();
return true;
}
function _zdicCheck(e) {
	if(window.Event){
	  	if(e.which == 2 || e.which == 3) {_zdicClose(); return true;}
	}else{
	    if(event.button == 2 || event.button == 3) {_zdicClose(); return true;}
	}
    var cx = 0;
    var cy = 0;
    var obj = _zdic_layer;
    if (obj.offsetParent){
        while (obj.offsetParent){
            cx += obj.offsetLeft;
            cy += obj.offsetTop;
            obj = obj.offsetParent;
        }
    }else if (obj.x){
        cx += obj.x;
        cy += obj.y;
    }

 	_zdicGetPos(e);
    if(_zdic_moving>0){
        _zdic_startx = _zdic_x;
        _zdic_starty = _zdic_y;
        if(_zdic_onmove == 1){
		   _zdic_moving = 2;
        }else if(_zdic_x < cx || _zdic_x > (cx + 268) || _zdic_y < cy || (!_zdic_onlayer && _zdic_y > (cy + 100) ) ){
	    	_zdicClose();
        }else{
            _zdic_moving = 1;
        }
    }
    
}

function _zdicQuery(e)  {
	if(window.Event){
	  	if(e.which == 2 || e.which == 3) {_zdicClose(); return true;}  
	}else{
	    if(event.button == 2 || event.button == 3) {_zdicClose(); return true;}  
	}
    if(_zdic_moving == 1){
        if (_zdic_is_ie) {
            window.event.cancelBubble = true;
            window.event.returnValue = false;
        }else{
            e.preventDefault();
        }
        return false;
    }
    _zdicGetPos(e);
    if(_zdic_moving == 2) {
        _zdic_moving = 1;
        _zdic_cx = _zdic_nx;
        _zdic_cy = _zdic_ny;
        return false;
    }

    if (!_zdic_enable) return true;

    var word = _zdicGetSel();
	if(document.editform && document.editform.wpTextbox1 && document.editform.wpTextbox1.value && word == document.editform.wpTextbox1.value) return true;
    word=""+word;
    word=word.replace(/^\s*|\s*$/g,"");
    if(word == "" || word.length > 76 || _zdic_old_word == word) return true;

    _zdicShow(word);

}

function _zdicDisplay(){
    var dx=262;
    var dy=264;
    _zdic_startx = _zdic_x;
    _zdic_starty = _zdic_y;
    _zdic_y += 8;
    _zdic_x += 16;
    if(_zdic_opera){
    	_zdic_x -= 4;
    }else if(_zdic_is_ie){
        if (document.documentElement.offsetHeight && document.body.scrollTop+document.documentElement.scrollTop+document.documentElement.offsetHeight - _zdic_y < dy){
            _zdic_y = document.body.scrollTop+document.documentElement.scrollTop + document.documentElement.offsetHeight - dy;
            _zdic_x += 14;
        }
        if (document.documentElement.offsetWidth && document.body.scrollLeft+document.documentElement.scrollLeft+document.documentElement.offsetWidth - _zdic_x < dx){
            _zdic_x = document.body.scrollLeft+document.documentElement.scrollLeft + document.documentElement.offsetWidth - dx;
        }
    }else{
        dx-=1;
        dy+=11;
        if (self.innerHeight && document.body.scrollTop+document.documentElement.scrollTop + self.innerHeight - _zdic_y < dy) {
            _zdic_y = document.body.scrollTop+document.documentElement.scrollTop + self.innerHeight - dy;
            _zdic_x += 14;
        }
        if (self.innerWidth && document.body.scrollLeft+document.documentElement.scrollLeft + self.innerWidth - _zdic_x < dx) {
            _zdic_x = document.body.scrollLeft+document.documentElement.scrollLeft + self.innerWidth - dx;
        }
    }
    _zdic_nx = _zdic_cx = _zdic_x;
    _zdic_ny = _zdic_cy = _zdic_y;
    _zdic_layer.style.left = _zdic_nx+'px';
    _zdic_layer.style.top = _zdic_ny+'px';
    _zdic_layer.style.display = "inline";
    _zdic_moving = 1;
}
function _zdic_isInteger(s) {
return (s.toString().search(/^-?[0-9]+$/) == 0);
}
function dictShow(q){
	if(_zdic_mode != 1){
		_zdicSet(_zdic_getObj('_zdic_title'), '&#20869;&#25991;&#21462;&#35789; - LuHui.NET');
		_zdic_mode = 1;
	}
	var d = _zdic_getObj('_zdic_add');
	if(d){
		d.href = _zdic_host + 'bwl/?word=' + q;
		d.onclick = function(){ _zdicbwl(q); return false; };
	}
	d = _zdic_getObj('_zdic_detail');
	if(d) d.href = _zdic_host + 'search/?c=401&q='+q;
    if(_zdic_moving==0)_zdicDisplay();
    _zdic_iframe.src = _zdic_host+'search/?c=403&q='+q;
}
function _zdicShow(word){
	var q = _zdic_URL(word);
	if(_zdic_mode != 1){
		_zdicSet(_zdic_getObj('_zdic_title'), '&#20869;&#25991;&#21462;&#35789; - LuHui.NET');
		_zdic_mode = 1;
	}
	var d = _zdic_getObj('_zdic_add');
	if(d){
		d.href = _zdic_host + 'bwl/?word=' + q;
		d.onclick = function(){ _zdicbwl(q); return false; };
	}
	d = _zdic_getObj('_zdic_detail');
	if(d) d.href = _zdic_host + 'spider.php?Category=dict&q='+q;
    if(_zdic_moving==0)_zdicDisplay();
    _zdic_old_word = word;
    _zdic_iframe = false;
    _zdic_geturl(_zdic_host+'groups/yitizi/yiti.php?cc='+q,word);
}

function _zdic_geturl(u,word){
    try{
    	if(_zdic_frametimer){clearTimeout(_zdic_frametimer);_zdic_frametimer = 0;}
		if(!_zdic_iframe){
			_zdic_frameid ++;
			_zdicSet(_zdic_getObj('_zdicContent'),'<iframe id="_zdicFrame'+_zdic_frameid+'" name="_zdicFrame'+_zdic_frameid+'" HEIGHT="252" src="about:blank" FRAMEBORDER="0" width="100%"></iframe>');
			_zdic_iframe = _zdic_getObj('_zdicFrame'+_zdic_frameid);
			if(!_zdic_iframe){
				_zdic_frametimer = setTimeout(function(){_zdic_geturl(u,word)},1000);
				return;
			}
			var iframeWin = window.frames['_zdicFrame'+_zdic_frameid];
	        //alert(iframeWin);
	        iframeWin.document.open();
	        iframeWin.document.write('<html><body><div><span style="color:font-weight:bold;">&#26597;&#35810;&#20013;&#46;&#46;&#46;<img src="'+_zdic_host+'images/loading.gif"/></span><br/><br /></div><center><span style="font-weight:bold;">'+word+'</span> </center></body></html>');
	        iframeWin.document.close();
    	}
    }catch(x){
    }
    _zdic_iframe.src = u;
}
function dictAdd(word){
var q = _zdic_URL(word.replace("%27","'"))
_zdicbwl(q);
}
function _zdicbwl(word){
	if(word == "") return false;
	if(_zdic_mode != 2){
		_zdicSet(_zdic_getObj('_zdic_title'), '&#28155;&#21152;&#22791;&#24536; - LuHui.NET');
		_zdic_mode = 2;
	}
	var d = _zdic_getObj('_zdic_add');
	if(d){
		d.href = _zdic_host + 'bwl/';
		d.onclick = function(){return true;};
	}
	d = _zdic_getObj('_zdic_detail');
	if(d) d.href = _zdic_host + 'search/?c=461&q='+word;
    if(_zdic_moving ==0) _zdicDisplay();
    
    _zdic_iframe.src = _zdic_host+'bwl/?word='+word;
	
}

function _zdicbwlclose(){
	_zdic_scbtimer = 0;
	if(_zdic_mode==2 && _zdic_moving >0){
		_zdicClose();
	}
}

function _zdicMove(e){
	try{
	    if(_zdic_moving==2) {
	    	_zdicGetPos(e);
	        _zdic_nx = _zdic_x-_zdic_startx+_zdic_cx;
	        _zdic_ny = _zdic_y-_zdic_starty+_zdic_cy;
	        if (!_zdic_opera && document.documentElement.scrollWidth && document.documentElement.scrollWidth - _zdic_nx < 262) {
	            _zdic_nx = document.documentElement.scrollWidth - 262;
	        }
	        if(_zdic_nx<0) _zdic_nx = 0;
	        if(_zdic_ny<0) _zdic_ny = 0;
	        _zdic_layer.style.left = _zdic_nx+'px';
	        _zdic_layer.style.top = _zdic_ny+'px';
	        _zdic_layer.focus();
	        _zdic_layer.blur();
	    }
    }catch (x)
    {
    }
}

function _zdicClose() {
    try
    {
    	if(_zdic_moving){
		  var scrOfY = 0;
		  if( document.body && document.body.scrollTop ) {
		    scrOfY = document.body.scrollTop;
		  } else if( document.documentElement && document.documentElement.scrollTop) {
		    scrOfY = document.documentElement.scrollTop;
		  }
	       if(scrOfY < 50 &&_zdic_mode == 2 && document.editform && document.editform.wpTextbox1 && document.editform.wpTextbox1.value) document.editform.wpTextbox1.focus();
	        _zdic_moving = 0;
	        _zdic_onmove = 0;
	        _zdic_onlayer = 0;
	        _zdic_mode = 0;
	        _zdic_layer.style.display="none";
	        setTimeout(function(){_zdic_old_word = "";},500);
		}
    }
    catch (x)
    {
    }

}


function _zdicRemove() {
    try
    {
        _zdic_moving = 0;
        _zdic_onmove = 0;
        _zdic_onlayer = 0;
        _zdic_mode = 0;
        if(_zdic_onselect){
	        document.onselectstart = _zdic_oldselectstart;
	  		_zdic_onselect = 0;
	  	}
    	_zdic_enable = false;
    	_zdic_layer.style.display="none";
		_zdic_status.style.display="none";
    }
    catch (x)
    {
    }

}
function _zdicDisable(){
  _zdic_SetCookie("dicthuaci","off",30);
  _zdic_enable = false;
  _zdicUpdateStatus();
}

function _zdicEnable(){
  if (_zdic_enable){
	_zdic_SetCookie("dicthuaci","off",30);
	_zdic_enable = false;
  }else{
    _zdic_enable = true;
	_zdic_SetCookie("dicthuaci","",-1);
  }
  _zdicUpdateStatus();
}

function dictRemove(){
  _zdicRemove();
}
function dictDisable(){
  _zdic_enable = false;
  _zdic_SetCookie("dicthuaci","off",30);
  _zdicUpdateStatus();
}

function dictEnable(){
  _zdic_enable = true;
  _zdic_SetCookie("dicthuaci","",-1);
  _zdicUpdateStatus();
}

function _zdicUpdateStatus(){
  var d = _zdic_getObj('dict_status');
  if(d){
    if (_zdic_enable){
       _zdicSet(d,'[<a href="'+_zdic_help+'" title="&#26597;&#30475;&#36873;&#23383;&#37322;&#20041;&#24110;&#21161;" target="_blank">&#36873;&#23383;&#37322;&#20041;</a>&#24050;<a href="javascript:dictDisable()" title="&#31105;&#29992;&#36873;&#23383;&#37322;&#20041;">&#24320;&#21551;</a>]');
    }else{
	   _zdicSet(d,'[<a href="'+_zdic_help+'" title="&#26597;&#30475;&#36873;&#23383;&#37322;&#20041;&#24110;&#21161;" target="_blank">&#36873;&#23383;&#37322;&#20041;</a>&#24050;<a href="javascript:dictEnable()" title="&#25105;&#35201;&#24320;&#21551;&#36873;&#23383;&#37322;&#20041;">&#31105;&#29992;</a>]');
    }
  }
  var h = _zdic_getObj('zdic_xzsy');
  if(h){
  	if(_zdic_enable){
  		h.href = "javascript:dictDisable()";
  		//h.onclick = function() {dictDisable();return false;};
  		h.innerHTML = "&#36873;&#23383;&#37322;&#20041;";
  	}else{
	    h.href = "javascript:dictEnable()";
	    //h.onclick = function() {dictEnable();return false;};
  		h.innerHTML ="<s>&#36873;&#23383;&#37322;&#20041;</s>";
  	}
  }
  h = _zdic_getObj('zdic0_status');
  if(h && h.tagName && h.tagName.toLowerCase() == "a"){
  	if(_zdic_enable){
  		h.href = "javascript:dictDisable()";
  		//h.onclick = function() {dictDisable();return false;};
  		h.innerHTML = "&#36873;&#23383;&#37322;&#20041;";
  	}else{
	    h.href = "javascript:dictEnable()";
	    //h.onclick = function() {dictEnable();return false;};
  		h.innerHTML ="<s>&#36873;&#23383;&#37322;&#20041;</s>";
  	}
  }
  if(0){
  	_zdic_status.style.display="inline";
  	_zdicSet(_zdic_status, _zdicStatus());
  }
}

function _zdicStatus(){
	var b='line-height:20px;background-color:#ecdfc7;font-weight:normal;padding:0px;margin:0px;font-size:14px;text-decoration:none;font-family:Verdana, Geneva, Arial, Helvetica, sans-serif;';
    var h='<span style="color:#000000;'+b+'">[<a href="'+_zdic_help+'" title="&#26597;&#30475;&#36873;&#23383;&#37322;&#20041;&#24110;&#21161;" target="_blank" style="color:#6e312d;'+b+'">&#36873;&#23383;&#37322;&#20041;</a>&#24050;';
    if (_zdic_enable){
      h += '<a href="javascript:dictDisable()" title="&#31105;&#29992;&#36873;&#23383;&#37322;&#20041;" target="_self" style="color:#6e312d;'+b+'">&#24320;&#21551;</a>';
    }else{
      h += '<a href="javascript:dictEnable()" title="&#25105;&#35201;&#24320;&#21551;&#36873;&#23383;&#37322;&#20041;" target="_self" style="color:#6e312d;'+b+'">&#31105;&#29992;</a>';
    }
    h +='] <a href="javascript:dictRemove();" target="_self" style="'+b+'"><img src='+_zdic_host+'images/xzsy_b4.gif border=0 align=absmiddle style="padding:0px;margin:0px;"></a>';
    return h;
}
function _zdic_load(){
   if(! document || ! document.body || !document.body.firstChild){
	  if(document.addEventListener){
	    window.addEventListener("load", _zdicInit, true);
	  }else if (document.attachEvent) {
	    window.attachEvent("onload", _zdicInit);
	  }else{
	    var oldload = (document.onload) ? document.onload : function () {};
	    window.onload = function () {oldload(); _zdicInit();};
	  }
   }else{
   	  _zdicInit();
   }
}
function dictInit(){
	_zdicInit();
}
if(typeof(_zdic_loaded) != "string" || _zdic_loaded != "yes"){
var _zdic_is_ie = true;
var _zdic_host = 'http://www.luhui.net/';
var _zdic_bwlhost = 'http://luhui.net/';
var _zdic_help = "http://github.com/kugeceo/huaci.luhui.net#/zh/forum.php?mod=viewthread&tid=280447&highlight=%E5%86%85%E6%96%87";
var _zdic_old_word = "";
var _zdic_oldselectstart = function () {};
var _zdic_onselect = 0;
var _zdic_opera = 0;
var _zdic_frameid = 0;
var _zdic_frametimer = 0;
var _zdic_scbtimer = 0;
var _zdic_moving = 0;
var _zdic_onmove = 0;
var _zdic_onlayer = 0;
var _zdic_startx = 0;
var _zdic_starty = 0;
var _zdic_cx = 0;
var _zdic_cy = 0;
var _zdic_x = 0;
var _zdic_y = 0;
var _zdic_nx = 0;
var _zdic_ny = 0;
var _zdic_enable = true;
var _zdic_layer = null;
var _zdic_status = null;
var _zdic_iframe = null;
var _zdic_mode = 0;
var _zdic_init = 0;
var _zdic_loaded = "yes";
_zdic_load();
}else{
    try{
    _zdic_enable = true;
    _zdicUpdateStatus();
    if(_zdic_onselect == 0){
    	document.onselectstart = function () {if (_zdic_moving == 2) return false;};
  		_zdic_onselect = 1;
  	}
    }catch(x){;}
}
dict_enable = false;
