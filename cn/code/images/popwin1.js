function Get(){
var Then = new Date() 
Then.setTime(Then.getTime() + 60 * 60 * 1000 ) //√Î∑÷
var cookieString = new String(document.cookie)
var cookieHeader = "Cookie1=" 
var beginPosition = cookieString.indexOf(cookieHeader)
if (beginPosition != -1){ 
} 
else 
{ 
document.cookie = "Cookie1=POPWIN;expires="+ Then.toGMTString()  
window.open('/grphp/?countid=26028&ads=2','win','width=628,height=220,top=0,left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes,location=yes,status=yes')
}
Get();
//¥˙¬ÎΩ· ¯