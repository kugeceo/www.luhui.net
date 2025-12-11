var startParHeight=480; //悬浮父框架初始高度

document.writeln('<style type="text/css">');
document.writeln('<!--');
document.writeln('html { min-width:900px; text-align:center; border:none; background:none;  padding:0; }');
document.writeln('body { min-width:900px; width:900px; border-top:none; margin-top:0; margin-left:auto; margin-right:auto; padding:0; border:none; }');
document.writeln('#nav { width:880px; border-left:10px #EFEFEF solid; border-right:10px #EFEFEF solid; border-bottom:4px #EFEFEF solid; margin:0; background-color:#EFEFEF; font-size:13px; text-align:right; }');
document.writeln('#nav a { }');
document.writeln('#nav #nav_mingz { float:left; color:#999999; font-weight:bold; }');
document.writeln('#nav #nav_session img.close { }');
document.writeln('#body { width:880px; margin-bottom:0; padding-left:10px; padding-right:10px; padding-bottom:6px; background-color:#EFEFEF; }');
document.writeln('#body_p { margin:0; width:878px; height:'+(startParHeight-50)+'px; overflow:hidden; padding:0; border:1px #D4D4D4 solid; background-color:#FFFFFF; }');
document.writeln('#body_p_in { width:878px; }');
document.writeln('.menu { border:none; }');
document.writeln('.menu_right { width:auto !important; }');
document.writeln('.menu_left { width:149px; }');
document.writeln('#bar_id_ a{ width:136px; }');
document.writeln('.i1 { width:892px; height:1px; overflow:hidden; background-color:#EFEFEF; }');
document.writeln('.i2 { width:896px; height:1px; overflow:hidden; background-color:#EFEFEF; }');
document.writeln('.i3 { width:898px; height:2px; overflow:hidden; background-color:#EFEFEF; }');
document.writeln('.close { vertical-align:text-bottom; }');
document.writeln('#loginform { width:100%; }');

//document.writeln('#page_img { height:'+(startParHeight-38)+'px; top:38px; display:block; background-image:url(readonly/images/loading2.gif); }');

document.writeln('-->');
document.writeln('</style>');

var par=parent.document.getElementById('addCFrame');
try{par.style.display='block';}catch(e){}
var parShowH=parent.document.documentElement.clientHeight;
var thisH=startParHeight;
var bop=null;
//alert(parShowH);

function parClose(){
  //if (par!=null){
    try{parent.delSubmitSafe();}catch(e){}
    try{top.delSubmitSafe();}catch(e){}
    try{par.style.display='none';}catch(e){}
  //}
}




function openMy(){
  if (par!=null){
    //par.style.display='block';
    bop=document.getElementById('body_p');
    bop.style.height='auto';

    //var parShowH=parent.document.documentElement.clientHeight;
    thisH=document.body.offsetHeight;

	showMy(parShowH, thisH, bop);
	
    //if(parent.$('submit_safe')==null){
    //  try{parent.addSubmitSafe(1);}catch(e){}
    //}


  }
  try{if(typeof(eval(atParSize))=="function"){atParSize();}}catch(e){} //函数在detail_current.php页面
  //try{if($('page_img')!=null) $('page_img').style.display='none';}catch(e){}
  //try{if(parent.$('page_img')!=null) parent.$('page_img').style.display='none';}catch(e){}
  return;
}


function showMy(parShowH, thisH, bop){
    var ie6=!-[1,]&&!window.XMLHttpRequest;

    if(parShowH<startParHeight){
      if(thisH>parShowH){
        t=0;
        par.style.position='absolute';
        try{par.style.setProperty('position', 'absolute', 'important');}catch(e){}
        try{par.setAttribute('style', 'position:absolute !important; height:'+thisH+'px');}catch(e){}
      }
    }else{
      if(thisH>parShowH){
        thisH=parShowH-40; //上下各留空20
        if(bop!=null){
		  try{
            bop.style.overflowX='hidden';
            bop.style.overflowY='auto';
            bop.style.height=(thisH-50)+'px';
          }catch(e){}
		}
      }
    }
    if(ie6){
      var parScTop=Math.max(parent.document.body.scrollTop,parent.document.documentElement.scrollTop);
      t=(parScTop+(parShowH-thisH)/2);
    }else{
      t=(parShowH-thisH)/2;
    }

    par.style.height=thisH+'px';
    par.style.top=t+'px';
}

showMy(parShowH, thisH, bop);
try{parent.$('submit_safe').onmousedown=function (){return false;}}catch(e){}

if (document.all) {
  window.attachEvent('onload', openMy);//对于IE
} else {
  window.addEventListener('load', openMy, false);//对于FireFox
}


