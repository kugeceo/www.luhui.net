var how_many_gys = 10; 
var now = new Date() 
var sec = now.getSeconds() 
var gy = sec % how_many_gys; 
var width="300"; 
var height="200"; 
gy +=1; 
if (gy==1) { 
url="http://sc.zdic.net/song/1240315961840652.html"; 
alt="人生识字忧患始"; 
banner="http://pic.zdic.net/images/gy/gy1.png"; 
} 
if (gy==2) { 
url="http://gj.zdic.net/archive.php?aid-20661.html"; 
alt="博觀而約取，厚積而薄發"; 
banner="http://pic.zdic.net/images/gy/gy2.png"; 
} 
if (gy==3) { 
url="http://gj.zdic.net/archive.php?aid-19586.html"; 
alt="古之立大事者，不惟有超世之才，亦必有堅忍不拔之志"; 
banner="http://pic.zdic.net/images/gy/gy3.png"; 
} 
if (gy==4) { 
url="http://gj.zdic.net/archive.php?aid-2678.html"; 
alt="父為子隱，子為父隱，直在其中矣"; 
banner="http://pic.zdic.net/images/gy/gy4.png"; 
} 
if (gy==5) { 
url="http://gj.zdic.net/archive.php?aid-2679.html"; 
alt="修己以敬，修己以安人，修己以安百姓"; 
banner="http://pic.zdic.net/images/gy/gy5.png"; 
} 
if (gy==6) { 
url="http://gj.zdic.net/archive.php?aid-2670.html"; 
alt="老者安之，朋友信之，少者懷之"; 
banner="http://pic.zdic.net/images/gy/gy6.png"; 
} 
if (gy==7) { 
url="http://gj.zdic.net/archive.php?aid-2666.html"; 
alt="不患人之不己知，患不知人也"; 
banner="http://pic.zdic.net/images/gy/gy7.png"; 
} 
if (gy==8) { 
url="http://gj.zdic.net/archive.php?aid-2674.html"; 
alt="知其不可而為之"; 
banner="http://pic.zdic.net/images/gy/gy8.png"; 
} 
if (gy==9) { 
url="http://gj.zdic.net/archive.php?aid-19586.html"; 
alt="三軍可奪帥也,匹夫不可奪志也"; 
banner="http://pic.zdic.net/images/gy/gy9.png"; 
} 
if (gy==10) { 
url="http://gj.zdic.net/archive.php?aid-12602.html"; 
alt="信言不美，美言不信"; 
banner="http://pic.zdic.net/images/gy/gy10.png"; 
} 
if (gy==11) { 
url="http://gj.zdic.net/archive.php?aid-12602.html"; 
alt="不尚賢，使民不爭；不貴難得之貨，使民不為盜"; 
banner="http://pic.zdic.net/images/gy/gy11.png"; 
} 
document.write('<div id="gyimg"><a href="' + url + '" target="_blank">'); 
document.write('<img src="' + banner + '" width=') 
document.write(width + ' height=' + height + ' '); 
document.write('title="' + alt + '" border=0></a></div>'); 
