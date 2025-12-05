var p = dialogArguments;

var dsg = [];		//源数据
var dds;		//数据索引
var pgd, pagemx;
var pagele=20;		//每页行数
var typeu = [];		//分类数组

///////////////////--- data.js中调用 ---//////////////////////////

function TYPE(name)
{
  var v = typeu.length;
  if(v>0 && typeu[v-1].a==dsg.length)
    v--;
  typeu[v] = { n:name , a:dsg.length };
}
TYPE("默认分类");

function DATA(tn,tu,to)
{
  to = to || 0;
  dsg[dsg.length] = { n:tn, u:tu, o:to };
}
var data = DATA;
function START(){}
function END(){}

//////////////////////////////////--- 分类与搜索 ---/////////////////////////////

function gfebl()	
{
  dds = [];
  var vva = 0; 
  var vvb = dsg.length;
  var zzt = typez.selectedIndex-1;
  if(zzt>=0)
  {
    vva = typeu[zzt].a;
    if(zzt<typeu.length-1) vvb = typeu[zzt+1].a;
  }
  for(var ii=vva; ii<vvb; ii++)
    dds[dds.length] = ii;
  sennd();

}

function zpoj(s)	
{
  var rep;
  if(s!="")
  {
    s = s.replace(/([\(\)\[\]\{\}\^\$\+\-\.\"\'\|\/\\])/g,"\\$1");
    var tg = s.split(";");
    for(var ii=0; ii<tg.length; ii++)
      if(!/[\*\?]/.test(tg[ii]))
        tg[ii] = "*"+tg[ii]+"*";
    s = tg.join("|");
    s = s.replace(/\*/g,".*");
    s = s.replace(/\?/g,".");
    rep = new RegExp("^("+s+")$","i");
  }
  dds = [];
  var vva = 0; 
  var vvb = dsg.length;
  var zzt = types.selectedIndex-1;
  if(zzt>=0)
  {
    vva = typeu[zzt].a;
    if(zzt<typeu.length-1) vvb = typeu[zzt+1].a;
  }
  for(var ii=vva; ii<vvb; ii++)
  {
    if(s!="")
      if(!rep.test(dsg[ii].n))
	continue;
    dds[dds.length] = ii;
  }
  sennd();
  typez.selectedIndex = types.selectedIndex;
}

function sennd()	
{
  pagemx = Math.floor((dds.length-1)/pagele)+1;
  ppgg2.innerText = pagemx;
  hgo.options.length = pagemx;
  for(var ii=0; ii<pagemx; ii++)
    hgo.options[ii].text = ii+1+" 页";
  if(dds.length<1)
    bbo.innerHTML = "没有找到任何匹配的项目！";
  else
    page(1);
}


//////////////////////////////////--- 分页 ---/////////////////////////////


function page(s)	
{
  if(s<1 || s>pagemx) return;
  pgd = s;
  var tt = "";
  for(var ii=(s-1)*pagele; ii<s*pagele && ii<dds.length; ii++)
  {
    var w = dsg[dds[ii]];
    tt += '<input type="checkbox" sd="'+dds[ii]+'"> <font face="Webdings">&macr;</font> <font color=#ffffff>'+(ii+1)+'.</font><a class=menubar href="#" onclick="golist(0,true,this)" oncontextmenu="golist(0,false,this)" title="单击右键将此项目追加到播放列表" sd="'+dds[ii]+'">'+w.n+'</a><br>';
  }
  bbo.innerHTML = tt;
  ppgg1.innerText = pgd;
  hgo.selectedIndex = pgd-1;
}

///////////////////////////////////////////////////////////////


function golist(fs,tg,th)
{
  var dali = [];
  var ni = bbo.getElementsByTagName("INPUT");
  if(ni.length<1) return;

  switch(fs)
  {
   case 0:
    dali[0] = th.sd-0;
    break;
   case 1:
    for(var ii=0; ii<ni.length; ii++)
      if(ni[ii].checked)
        dali[dali.length] = ni[ii].sd-0;
    if(dali.length<1)
    {
      alert("请先选择要播放的项目！");
      return;
    }
    break;
   case 2:
      dali = dds;
    break;
  } 
  
  if(p.urld==null)
    tg = true;
  p.newlist(tg);
  for(var ii=0; ii<dali.length; ii++)
  {
    var a = dsg[dali[ii]];
    p.addlist(a.n, a.u, a.o-0);
  }
  p.playlist(tg);
  qbqc();
  if(tg)
    window.close();
}


/////////////////////////////////////////////////////

function fxxz()
{
 var plop = bbo.getElementsByTagName("INPUT");
 for(var ii=0; ii<plop.length; ii++)
   plop[ii].checked = !plop[ii].checked;
}

function qbqc()
{
 var plop = bbo.getElementsByTagName("INPUT");
 for(var ii=0; ii<plop.length; ii++)
   plop[ii].checked = false;
}



////////////////////////////////////////////////////

window.onload = function()
{
  typez.options.length = typeu.length+1;
  typez.options[0].text = "【全部】";
  for(var ii=1; ii<=typeu.length; ii++)
    typez.options[ii].text = typeu[ii-1].n;

  types.options.length = typeu.length+1;
  types.options[0].text = "【全部】";
  for(var ii=1; ii<=typeu.length; ii++)
    types.options[ii].text = typeu[ii-1].n;

  ansmw("");

  gfebl();
}