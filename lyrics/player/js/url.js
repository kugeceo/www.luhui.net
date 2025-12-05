var p = dialogArguments[0];
var btg = dialogArguments[1];

function liulan()
{
  var zzo = furvl.value;
  furvl.click();
  var uur = furvl.value;
  if(zzo==uur || uur=="") return;
  url.value = uur.replace(/\\/g,"/");
  /^[^\?]+\/([^\/\?]+)\.[^\/\.\?]+($|\?.+$)/.exec(url.value);
  vname.value = RegExp.$1;
}

function ok(tk)
{
  var u = url.value;
  var reu0 = /^[a-z]+\:\/\/[a-z0-9]+(\-[a-z0-9]+)?(\.[a-z0-9]+(\-[a-z0-9]+)?)*(\:\d+)?(\/?|\/.+)$/i.test(u);
  var reu1 = /^([a-z]{1,2}\:|\/)\/[^\/]/i.test(u);
  var njs = /\.[^\.]+$/.exec(u);
  var ki = (njs!=null)?njs[0].toUpperCase():"***";

  if((!reu0)&&(!reu1))
  {
    alert("请输入正确的地址！");
    url.focus();
    url.select();
    return;
  }
  if((reu0 && u.indexOf("?")==-1) || reu1)
    if((LX_M_v+LX_R_v).indexOf(ki+";")==-1)
    {
      alert("你所输入(选择)的文件不能播放！");
      url.focus();
      url.select();
      return;
    }
  
  if(vname.value=="")
  {
    /^[^\?]+\/([^\/\?]+)\.[^\/\.\?]+($|\?.+$)/.exec(url.value);
    vname.value = RegExp.$1;
  }
  try {
    p.openadddong(vname.value, u, objp.selectedIndex, tk);
  } catch(hh){
    window.close();
  }
  if(tk)
    window.close();
  else
    if(!sdwin.checked)
      window.close();
}

window.onload = function()
{
  window.dialogWidth = (parseInt(window.dialogWidth)-document.body.clientWidth+328)+"px";
  window.dialogHeight = (parseInt(window.dialogHeight)-document.body.clientHeight+152)+"px";
  if(btg==1)
  {
    butt1.style.display = "none";
    butt2.value = "添 加";  
  }
}
