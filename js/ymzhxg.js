document.writeln("<base target=\"_blank\"\/>")
function fadein(){
mytransition.innerHTML=''
if (cur!='x'){
mytransition.filters.revealTrans.Transition=cur
mytransition.filters.revealTrans.apply()
mytransition.innerHTML='<p align="center"><a href="http://www.wofav.com/"><font face="Verdana">Wofav网页分享按钮(增加网站流量)</font></a></p><big><big><p align="center"><a href="http://www.wofav.com/daima.html"><img src="http://www.wofav.com/images/wofav_a.gif" border="0"></a></p><br><p align="center"><font face="Verdana">分享"wo"最喜欢的</font></p>'
mytransition.filters.revealTrans.play()
}
else{
mytransition.filters.blendTrans.apply()
mytransition.innerHTML='<p align="center"><a href="http://www.wofav.com/"><font face="Verdana">Wofav网页分享按钮(增加网站流量)</font></a></p><big><big><p align="center"><a href="http://www.wofav.com/daima.html"><img src="http://www.wofav.com/images/wofav_a.gif" border="0"></a></p><br><p align="center"><font face="Verdana">分享"wo"最喜欢的</font></p>'
mytransition.filters.blendTrans.play()
}
}