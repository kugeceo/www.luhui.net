var w = 20;
var h = 210;
var str = "";
var obj = document.getElementById("divStayTopLeft");
if (obj)str = obj.innerHTML;
if( typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat'){
document.writeln('<DIV  style="z-index:9;right:0;bottom:0;height:'+h+'px;width:'+w+'px;overflow:hidden;POSITION:fixed;_position:absolute; _margin-top:expression(document.documentElement.clientHeight-this.style.pixelHeight+document.documentElement.scrollTop);">');
}
else {
document.writeln('<DIV style="z-index:9;right:0;bottom:0;height:'+h+'px;width:'+w+'px;overflow:hidden;POSITION:fixed;*position:absolute;*top:expression(eval(document.body.scrollTop)+eval(document.body.clientHeight)-this.style.pixelHeight);">');
}
document.writeln('<div style="clear:both;margin:auto;height:210px;font-size:12px;overflow:hidden;text-align:left;"><a href="http://www.luhui.net/cs"><font color="#FF0000">更多</font></a><br /><br /><a href="javascript:scroll(0,0)" hidefocus="true">↑顶部</a><div class="blank15"></div><a href="javascript:window.close()">×</a><div class="blank15"></div><a href="javascript:scroll(0,99999)" hidefocus="true">底部↓</a></div> ');
document.write('<div style="clear:both;margin:auto;overflow:hidden;text-align:left;">'+str+'</div>');
document.writeln('</DIV>');
window.onerror=function(){return true;}