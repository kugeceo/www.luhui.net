var urld = null;			
var lpdd;				
var lbak = null;			
var oop = null;				
var loopx=2;				
var sval, medTT, alTXT;			
var zslen=0;				
var rndX = false;			
var rnd = [];				
var rndBJ = 0;				
var noplay = false;
var reN;				
var xdbj=0, xxL,xxR;			
var mute = false;			

function loadUserList()	
{
  home.load("AboutPlayer_UserList");
  var sstt = home.getAttribute("list");
  home.removeAttribute("list");
  if(sstt==null) { dsts("目前没有列表！"); return; }
  sstt = sstt.split("|;|");
  newlist(true);
  for(var ii=0; ii<sstt.length; ii++)
  {
    var ca = sstt[ii].split("|,|");
    addlist(ca[0],ca[1],ca[2]);
  }
  playlist(true);

}

function saveUserList()	
{
  if(urld[0].uu == "") { dsts("目前没有列表！"); return; }
  if(!confirm("是否将当前列表保存到用户本地以便下次读取？\n目前只能保存一个列表，新列表将覆盖旧列表！")) return;
  var sstt = "";
  for(var ii=0; ii<urld.length; ii++)
  {
    sstt += "|;|"+urld[ii].nn+"|,|"+gtpp(urld[ii].uu)+"|,|"+urld[ii].oo;
    if(sstt.length>40000)
      break;
  }
  home.setAttribute("list",sstt.slice(3));
  home.save("AboutPlayer_UserList");
  home.removeAttribute("list");
}

function newlist(zzs)		
{
  listbak(zzs);
  if(zzs)
  {
    urld = [];
    rnd = [];
  }
  rndBJ = urld.length;
}

function playlist(zzs)		
{
  if(urld.length<1)	
    urld[0] = new urlDataClass("列表为空！","",0,"");
  sxdfbd();
  rtxt3.style.visibility = (urld.length<=1)?"hidden":"visible";
  rtxt3b.innerText = urld.length;
  newrnd(rndBJ);
  if(zzs)
  {
    if(rndX)
      playrnd();
    else
      openfile(0);
  }
}


function listbak(zzs)		
{
  if(urld==null || !zzs) return;
  if(urld.length<2) return;
  lbak = urld; 
}

function returnlist()		
{
  if(lbak==null) { dsts("没有列表可召回！"); return; }
  var bbb = lbak;
  lbak = null;
  newlist(true);
  urld = bbb;
  playlist(true);
}


function UDC_dk()
{
  var s = /\.[^\.]+$/.exec(this.uu);
  return (s!=null)?s[0].toUpperCase():"***";
}

function UDC_oot()
{
  if(this.uu.slice(2,3)=="*") {
    var vvv="egy+nb@QwXvCWjKPRxVzDl/h7EOMtSa9f6*FpNr81i_0kqdG2LBcuZIAJYo34m-sT%5.UH3SYZ0hzt/y@qDTNECf1BpujiO.X6ks+oIR8GPVg9wbm%xJvKLWrn*F4HAe-QladM27Uc5_";
    var du = parseInt(this.uu.slice(0,2));
    var uu = "";
    var ht = (vvv.slice(70)+vvv.slice(70)).slice(du);
    for(var ii=3; ii<this.uu.length; ii++)
    {  
      var w = (ii-3)%10;
      var k = ht.indexOf(this.uu.slice(ii,ii+1),w)-w;
      uu += vvv.slice(k,k+1);
    }
    this.uu = unescape(uu);  }
  this.uu = this.uu.replace(/\\/g,"/");
  if(this.oo>=1 && this.oo<=2) return;
  var st = /^[^:\/]+:\/\//.exec(this.uu);
  if(st!=null)
  {
    st = st[0].toUpperCase();
    if(LX_M_x.indexOf(";"+st)!=-1) 
    { this.oo = 1; return; }
    if(LX_R_x.indexOf(";"+st)!=-1) 
    { this.oo = 2; return; }
  }
  if(this.uu.indexOf("?")!=-1) 
  { this.oo = 1; return; }
  var sd = this.dk()+";";
  if(LX_M_v.indexOf(sd)!=-1) 
  { this.oo = 1; return; }
  if(LX_R_v.indexOf(sd)!=-1) 
  { this.oo = 2; return; }
}

function urlDataClass(nn,uu,oo)		
{
  this.nn = nn;
  this.uu = uu;
  this.oo = oo;		

  this.dk = UDC_dk;
  this.oot = UDC_oot;

  this.oot();
}


function sxdfbd()		
{
 loplist.options.length = urld.length;
 for(var ii=0; ii<urld.length; ii++)
   loplist.options[ii].text = ii+1+"."+urld[ii].nn;
 loplist.selectedIndex = 0;
}

function openadddong(n,u,o,zzs)		
{
  var ls = new urlDataClass(n,u,o);
  if(urld==null)
    zzs = true;
  newlist(zzs);
  urld[urld.length] = ls;
  playlist(zzs);
}

function newrnd(s)		
{
  for(var ii=s; ii<urld.length; ii++)
    rnd[rnd.length++] = ii;
}

function playrnd()		
{
  if(rnd.length==0) return;
  var rr,zzz;
  rr = Math.floor(Math.random()*rnd.length);
  zzz = rnd[rr];
  rnd[rr] = rnd[rnd.length-1];
  rnd.length--;
  openfile(zzz);
}

function openaddfile()		
{
   window.showModalDialog("player/seturl.htm", [self,0],"dialogHeight:120px;dialogWidth:335px;status:0;help:0;scroll:0");
}

///////////////////////////////////////////////////////

function closedObj()		
{
  clearTimeout(medTT);
  clearInterval(sval);
  if(xdbj!=0)
  {
    xdbj=2;
    xdbfsz();
  }
  oop.closed();
  rtxt1.innerText = "空闲";
  rtxt4.innerText = "";
}

function openfile(uuu)		
{
  if(oop!=null)
    closedObj();
//------------------
  oop = null;
  lpdd = uuu;
  rtxt2.innerText = urld[lpdd].nn;
  rtxt3a.innerText = lpdd+1;
  loplist.selectedIndex = lpdd;
//---------------------------------
  var zzo = urld[lpdd].oo;
  if(zzo==1)
  {
    if(or_m) { ort_m=or_player(ort_m); return; }
    document.WebLrc.document.all("PLAYERTYPED").value = "wmp";
    Jts22.style.display = "block";
    Jts11.style.display = "none";
    oop = new mediaClass();
  }
  else if(zzo==2)
  {
    if(or_r) { ort_r=or_player(ort_r); return; }
    document.WebLrc.document.all("PLAYERTYPED").value = "real";
    Jts11.style.display = "block";
    Jts22.style.display = "none";
    oop = new realClass();
  }
  else
  { 
    dsts("此文件无法播放！");
    medTT = setTimeout("autonext();",1000);
    return; 
  }
//-------------------------------
  reN = 0;
  oop.open(urld[lpdd].uu);
  setTimeout("document.WebLrc.BodyLoaded();", 2000);
  if(!noplay)
  {
    oop.stop();
    noplay = true;
  }
  ylyyd();
  oop.mute(mute);
  jdhk.setposition(0);
  zslen=0;
  sval = setInterval("genzong()",300);
}

function or_player(n)
{
  if(n!="")
    alert(n);
  dsts("系统无播放控件!");
  medTT = setTimeout("autonext();",1000);
  return "";
}

function lenvar()
{
  var zzl = oop.length();
  if(zzl<=0) return;
  zslen=zzl;
  rtxt4.innerText = oop.sjxs(zzl);
}

function genzong()		
{
 try {

  var pos = oop.pos();
  if(zslen==0)
    lenvar();
  else 
  {
    if(!jdhk.moing)
      jdhk.setposition(Math.round(jdhk.mlength()/zslen*pos));
    if(xdbj!=0 && pos>xxR)
      oop.go(xxL);
  }
  dtut.innerText = oop.sjxs(pos);
  oop.ifending();

 } catch(hh){}
}

function aabf()		
{
  if(oop==null) { dsts(); return; }
  oop.play();
}

function aazt()		
{
  if(oop==null) { dsts(); return; }
  oop.pause();
}

function aatz()		
{
  if(oop==null) { dsts(); return; }
  oop.stop();
}

function aaht()		
{
  if(oop==null) { dsts(); return; }
  var v = oop.pos() - oop.gotov;
  if(v<0) v=0;
  oop.go(v);
}

function aaqj()		
{
  if(oop==null) { dsts(); return; }
  var v = oop.pos() + oop.gotov;
  if(v<=oop.length())
    oop.go(v);
}


function lbssdy()		
{
  if(urld==null) { dsts(); return; }
  if(urld.length<=1) { dsts("目前没有列表！"); return; }
  openfile(0);
}

function lbsy()		
{
  if(urld==null) { dsts(); return; }
  if(urld.length<=1) { dsts("目前没有列表！"); return; }
  if(lpdd<=0) { dsts("没有上一段了！"); return; }
  openfile(lpdd-1);
}

function lbxy()		
{
  if(urld==null) { dsts(); return; }
  if(urld.length<=1) { dsts("目前没有列表！"); return; }
  if(lpdd>=urld.length-1)  { dsts("没有下一段了！"); return; }
  openfile(lpdd+1);
}

function lbmmdy()		
{
  if(urld==null) { dsts(); return; }
  if(urld.length<=1) { dsts("目前没有列表！"); return; }
  openfile(urld.length-1);
}

function lhhgo()		
{
  if(urld==null) { dsts(); return; }
  if(urld.length<=1) { dsts("目前没有列表！"); return; }
  openfile(loplist.selectedIndex);
}

function listedit()		
{
  if(urld==null) { dsts("请先播放一个文件！"); return; }
  window.showModalDialog("player/listedit.htm", self, "dialogHeight:230px;dialogWidth:320px;status:0;help:0;scroll:0"); 
}

function admindata()		
{
  window.showModalDialog("admin_data/index.html", self, "status:0;help:0;scroll:0"); 
}

function admincolor()		
{
  window.showModalDialog("admin_color/index.html", self, "status:0;help:0;scroll:0"); 
}

function adminset()		
{
  window.showModalDialog("admin_set/index.html", self, "status:0;help:0;scroll:0"); 
}

function ylyydxx()		
{
 if(zslen==0) return;
 var nx = jdhk.getposition();
 var zzs = Math.round(zslen/jdhk.mlength()*nx);
 oop.go(zzs);
}


function ylyyd()		
{
  if(oop==null) return;
  var nx = Math.floor(ylhk.getposition()/ylhk.mlength()*100);
  oop.volume(nx);
}


function jingbb()	
{
  mute=!mute;
  eval("jingyin.src=bb_jy"+(mute?"1":"0")+".src");
  if(oop!=null)
    oop.mute(mute);
}


function lomd()		
{
  loopx=(loopx+1)%3;
  eval("IM_xh.src=bb_lok"+loopx+".src");
  IM_xh.alt="循环："+["无循环","单曲循环","全部循环"][loopx];
}

function rndkk()	
{
  rndX=!rndX;
  eval("IM_sj.src=bb_rnd"+(rndX?"1":"0")+".src");
  IM_sj.alt="随机播放 "+(rndX?"开":"关");
}



function gonext()		
{
  if(loopx==1 || loopx==2 && urld.length<=1)
  {
    oop.go(0);
    setTimeout("oop.play();",1000);
    return;
  }
  if(urld.length<=1) return;

  if(rndX)
  {
    if(rnd.length==0 && loopx==2)
      newrnd(0);
    playrnd();
  }
  else
  {
    if(lpdd<urld.length-1)
    {
      openfile(lpdd+1);
      return;
    }
    if(loopx==2)
      openfile(0);
  }
}

function errorreplay()
{
  reN++;
  if(reN<=3)
  {
    dsts("错误！重试"+reN+"次");
    medTT = setTimeout("oop.play();",1000);
  }
  else
  {
    dsts("文件无法播放！");
    medTT = setTimeout("autonext();",1000);
  }
}

function autonext()		
{
  if(urld.length<=1) return;
  if(rndX)
  {
    if(rnd.length==0 && loopx!=0)
      newrnd(0);
    playrnd();
  }
  else
  {
    if(lpdd<urld.length-1)
    {
      openfile(lpdd+1);
      return;
    }
    if(loopx!=0)
      openfile(0);
  }
}

function mdip_tt(f)		
{
  if(oop==null) { mediaPlayerObj.controls.stop(); return; }
  if(oop.constructor != mediaClass) { mediaPlayerObj.controls.stop(); return; }
  var fs = ["未定义","已停止","已暂停","正在播放","向前搜索","向后搜索","缓冲中..","等待中..", "播放完毕","转换曲目","准备就绪"];
  if(f<0 || f>=fs.length) return;
  rtxt1.innerText = fs[f];
  if(f == 8)
    medTT = setTimeout("gonext();",500);
}

function reap_tt(f)	
{
  if(oop==null) { realPlayerObj.DoStop(); return; }
  if(oop.constructor != realClass) { realPlayerObj.DoStop(); return; }
  if(f!="")
    rtxt1.innerText = f.slice(0,4);
}

function miderror()	
{
  if(oop==null) return;
  if(oop.constructor != mediaClass) return;
  errorreplay();
}

function reaerror()		
{
  if(oop==null) return;
  if(oop.constructor != realClass) return;
  errorreplay();
}



function dsts(t)		
{
  clearTimeout(alTXT);
  Jts1.innerText = t || "当前无法执行！";
  Jts1.style.display = "block";
  Jts2.style.display = "none";
  alTXT = setTimeout('Jts2.style.display="block";Jts1.style.display="none";',1000);
}



function xdbfsz()		
{
  if(oop==null) { dsts(); return; }
  xdbj=(xdbj+1)%3;
  eval("IM_xd.src=bb_xd"+xdbj+".src");
  IM_xd.alt="选段："+["标记选段开头","标记选段结束","取消选段"][xdbj];
  switch(xdbj)
  {
   case 0:
    jdhkl.style.backgroundPositionX = "9999"; 
    jdhk.style.backgroundPositionX = "9999";
   break;
   case 1:
     xxL = oop.pos();
     xxR = oop.length()-oop.setss*2;
     xdbjsz();
   break;
   case 2:
     xxR = oop.pos();
     if(xxL>=xxR)
     {
       var zz = xxL;
       xxL = xxR;
       xxR = zz;
     }
     xdbjsz();
    break;
  }
}

function xdbjsz()		
{
  var m = oop.length() || 1;
  jdhkl.style.backgroundPositionX = Math.round(xxL/m*100)+"%"; 
  jdhk.style.backgroundPositionX = Math.round(xxR/m*100)+"%";
}

function selectmenu()
{
  var d = menu.selectedIndex;
  menu.selectedIndex = 9;
  switch(d)
  {
   case 0:  openaddfile();  break;
   case 1:  listedit();  break;
   case 2:  returnlist();  break;
   case 3:  loadUserList();  break;
   case 4:  saveUserList();  break;
   case 5:  admindata();  break;
   case 6:  adminset();  break;
   case 7:  admincolor();  break;
   case 8:  openlw();  break;
  } 
}

function openlw()
{
  window.showModalDialog("player/select.htm", self, "dialogHeight:447px;dialogWidth:376px;status:0;help:0;scroll:0");
}

function gtpp(ttv)
{
  var UUUkey = "egy+nb@QwXvCWjKPRxVzDl/h7EOMtSa9f6*FpNr81i_0kqdG2LBcuZIAJYo34m-sT%5.UH3SYZ0hzt/y@qDTNECf1BpujiO.X6ks+oIR8GPVg9wbm%xJvKLWrn*F4HAe-QladM27Uc5_";
  var ul = escape(ttv);
  var du = Math.floor(Math.random()*50);
  var uu = du+(du>9?"*":"**");
  var ht = (UUUkey.slice(70)+UUUkey.slice(70)).slice(du);
  for(var ii=0; ii<ul.length; ii++)
  {  
    var k = UUUkey.indexOf(ul.slice(ii,ii+1))+(ii%10);
    uu += ht.slice(k,k+1);
  }
  return uu;
}

var sTE = false;
function START()
{
  newlist(true);
  sTE = true;
}

function TYPE()
{

}

function DATA(n,u,o)
{
  if(!sTE) return;
  o = o || 0;
  addlist(n,u,o);
}
var data = DATA;
function END()
{
  sTE = false;
  playlist(true);
}

function addlist(n,u,o)			
{
  urld[urld.length] = new urlDataClass(n,u,o);
}

function loadDataFile()
{
  if(openRND)
    rndkk();
  lodapl.src="player/js/data.js";
}

function fullscreen()
{
  if(oop==null) { dsts(); return; }
  var zt = oop.fullscreen();
  if(zt==1) { dsts("此类型不能全屏播放"); return; }
  if(zt==2) { dsts("在播放状态下才能全屏"); return; }
}

window.onload = function()
{
  loading.outerHTML = "";
  apxt.style.visibility = "visible";
  ylhk.setposition(Math.round(PLAY_VOLUME/100*ylhk.mlength()));
  setTimeout('loadDataFile();',300);
  if(openPLAY==1)
    noplay = true;
  else
    if(openPLAY==2)
      if(confirm('您是否需要播放背景音乐？'))
        noplay = true;
}