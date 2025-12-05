var p = dialogArguments;
var lid = p.urld.slice(0);	
var xgg = false; 		
var jtb = [];

///////////////////////////////////////////////

function sxbd()			
{
  list.options.length = lid.length;
  for(var ii=0; ii<lid.length; ii++)
    list.options[ii].text = ii+1+"."+lid[ii].nn;
}

////////////////////////////////////////////////

function dpname()		
{
  var noh=list.selectedIndex;
  vna.value = (noh==-1)?"":lid[noh].nn;
}

function ren()			
{
  var noh=list.selectedIndex;
  if(noh==-1) return;
  if(vna.value=="")
  {
    alert("ÇëÊäÈëÃû³Æ£¡");
    vna.focus();
    return;
  }
  lid[noh].nn = vna.value;
  sxbd();
  list.selectedIndex = noh;
  dpname();
  xgg=true;
}

///////////////////////////////////////////////

function tjdz(uu)		
{
  var noh=list.selectedIndex;
  var n = noh+1;
  lid = lid.slice(0,n).concat(uu, lid.slice(n));
  sxbd();
  list.selectedIndex = n;
  dpname();
  xgg=true;
}


function openaddfile()		
{
  window.showModalDialog("seturl.htm", [self,1], "dialogHeight:120px;dialogWidth:335px;status:0;help:0;scroll:0");
}

function openadddong(n,u,o,zzs)		
{
  var ls = new p.urlDataClass(n,u,o);
  tjdz(ls);
}

///////////////////////////////////////////////

function del()		
{
  for(var ii=list.options.length-1; ii>=0; ii--)
    if(list.options[ii].selected)
      lid = lid.slice(0,ii).concat(lid.slice(ii+1));
}

function aasc()		
{
  var noh=list.selectedIndex;
  if(noh==-1) return;
  del();
  sxbd();
  list.selectedIndex = -1;
  dpname();
  xgg=true;
}


///////////////////////////////////////////////

function pmove(v)	
{
  var k = -1;
  var tp = [];
  for(var ii=0; ii<list.options.length; ii++)
    if(list.options[ii].selected)
    {
      tp[tp.length] = lid[ii];
      if(v)
      {
	if(k==-1) k = ii-1;
      }
      else
        k = ii+2;
    }
  del();
  if(!v)
    k -= tp.length;
  lid = lid.slice(0,k).concat(tp, lid.slice(k));
  sxbd();
  list.selectedIndex = k;
  dpname();
  for(var ii=k; ii<k+tp.length; ii++)
    list.options[ii].selected = true;
}

function aalbsy()		
{
  if(list.selectedIndex==-1) return;
  if(list.options[0].selected) return;
  pmove(true);
  xgg=true;
}

function aalbxy()		
{
  if(list.selectedIndex==-1) return;
  if(list.options[list.options.length-1].selected) return;
  pmove(false);
  xgg=true;
}

////////////////////////////////////////////////


function jj_x()			
{
   jj_c();
   aasc();
}

function jj_c()			
{
  var noh=list.selectedIndex;
  if(noh==-1) return;
  jtb = [];
  for(var ii=0; ii<list.options.length; ii++)
    if(list.options[ii].selected)
      jtb[jtb.length] = lid[ii];
}

function jj_v()			
{
  if(jtb.length<1) return;
  tjdz(jtb);
}

///////////////////////////////////////////

function ok()
{
  if(xgg && lid.length>0)
  {
    p.newlist(true);
    p.urld = lid.slice(0);
    p.playlist(true);
  }
  window.close();
}

window.onload = function()
{
  window.dialogWidth = (parseInt(window.dialogWidth)-document.body.clientWidth+316)+"px";
  window.dialogHeight = (parseInt(window.dialogHeight)-document.body.clientHeight+234)+"px";
  sxbd();
  list.selectedIndex = p.lpdd;
  dpname();
}
