var how_many_ads =2;
var now = new Date();
var sec = now.getSeconds();
var ad = sec % how_many_ads;
ad +=1;
if (ad==1) {
document.write ("<a href=\"/cs/?UserID=" + UserID + "\"  target=\"_blank\">");
var msg4="<img src=/logo.gif border=0 alt=鲁虺文化网></a>";
document.write(msg4)
}
if (ad==2) {
document.write ("<a href=\"/cs/?UserID=" + UserID + "\"  target=\"_blank\">");
var msg4="<img src=/logo.gif border=0 alt=鲁虺文化网></a>";
document.write(msg4)
}
document.write("<SCRIPT LANGUAGE=javascript src=\"popwin1.js\"></script>");

