// JavaScript Document
document.write("<span id=intx></span><input type=\"hidden\"  id=\"year\"  /><input type=\"hidden\"  id=\"mon\"  /><input type=\"hidden\"  id=\"date\" >");

function yys()
{
 var now = new Date()
    var year = now.getYear()
    var month = now.getMonth()
	var thisym=parseInt(document.all.year.value)+parseInt(document.all.mon.value)
	//alert(parseInt(year+month)+" | "+thisym);
//if (parseInt(year+month)>thisym)
//{
var year=document.all.year.value;
var mon;
if (parseInt(document.all.mon.value)+1>11)
{
mon=0;
year=parseInt(document.all.year.value)+1
}
else
{
mon=parseInt(document.all.mon.value)+1;
}
var date=document.all.date.value;
var firstDayInstance = new Date(year, mon, 1);
var firstDay = firstDayInstance.getDay();
var days = getDays(mon, year)
var monthName = getMonthName(mon)
drawCal(firstDay + 1, days, date, monthName, year, mon+1);
document.all.year.value=year;
document.all.mon.value=mon;
document.all.date.value=date;
//}
}
function yhn()
{

var year=document.all.year.value;
var mon;
if (parseInt(document.all.mon.value)-1<0)
{
mon=11;
year=parseInt(document.all.year.value)-1
}
else
{
mon=parseInt(document.all.mon.value)-1;
}
var date=document.all.date.value;
var firstDayInstance = new Date(year, mon, 1);
    var firstDay = firstDayInstance.getDay();
	 var days = getDays(mon, year)
	 var monthName = getMonthName(mon)
	 drawCal(firstDay + 1, days, date, monthName,year, parseInt(document.all.mon.value));
document.all.year.value=year;
document.all.mon.value=mon;
document.all.date.value=date;
}
    <!-- Hide this script from old browsers --
    setCal()
    function getTime() {
    // 初始化时�?
    var now = new Date()
    var hour = now.getHours()
    var minute = now.getMinutes()
	
    now = null
    var ampm = "" 
    // 时间检测，并设置上下午AM和PM
    if (hour >= 12) {
    hour -= 12
    ampm = "PM"
    } else
    ampm = "AM"
    hour = (hour == 0) ? 12 : hour
    // add zero digit to a one digit minute
    if (minute < 10)
    minute = "0" + minute // do not parse this number!
    // return time string
    return hour + ":" + minute + " " + ampm
    }
    function leapYear(year) {
    if (year % 4 == 0) // basic rule
    return true // is leap year
    /* else */ // else not needed when statement is "return"
    return false // is not leap year
    }
    function getDays(month, year) {
    // 设定每月的天数数�?
    var ar = new Array(12)
    ar[0] = 31 // January
    ar[1] = (leapYear(year)) ? 29 : 28 // February
    ar[2] = 31 // March
    ar[3] = 30 // April
    ar[4] = 31 // May
    ar[5] = 30 // June
    ar[6] = 31 // July
    ar[7] = 31 // August
    ar[8] = 30 // September
    ar[9] = 31 // October
    ar[10] = 30 // November
    ar[11] = 31 // December
    
    return ar[month]
    }
    function getMonthName(month) {
    // 为月份名称设定数�?
    var ar = new Array(12)
    ar[0] = "1�?
    ar[1] = "2�?
    ar[2] = "3�?
    ar[3] = "4�?
    ar[4] = "5�?
    ar[5] = "6�?
    ar[6] = "7�?
    ar[7] = "8�?
    ar[8] = "9�?
    ar[9] = "10�?
    ar[10] = "11�?
    ar[11] = "12�?
    
    return ar[month]
    }
    function setCal() {
    
    var now = new Date()
    var year = now.getYear()
    var month = now.getMonth()
    var monthName = getMonthName(month)
    var date = now.getDate()
	
document.all.year.value=year;
document.all.mon.value=month;
document.all.date.value=date;
	
    now = null
    
    var firstDayInstance = new Date(year, month, 1)
    var firstDay = firstDayInstance.getDay()
	
    firstDayInstance = null
    
    var days = getDays(month, year)
	//alert(firstDayInstance+""-+firstDay+"-"+days+"-"+date)
    // 呼叫函数画日�?
    drawCal(firstDay + 1, days, date, monthName, year,month+1)
    }
    function drawCal(firstDay, lastDate, date, monthName, year,month) {
	
    // 以下设定表格的属性，这些参数可以自己改变，只是注意相互匹配�?
    var headerHeight = 25 // height of the table's header cell
    var border = 0 // 3D height of table's border
    var cellspacing = 0 // width of table's border
    var headerColor = "#333399" // color of table's header
    var headerSize = "3" // size of tables header font
    var colWidth = 15 // width of columns in table
    var dayCellHeight = 12 // height of cells containing days of the week
    var dayColor = "000000" // color of font representing week days
    var cellHeight = 20 // height of cells representing dates in the calendar
    var todayColor = "red" // color specifying today's date in the calendar
    var timeColor = "black" // color of font representing current time
    // create basic table structure
    var text = "" ; // initialize accumulative variable to empty string
    text += '<CENTER>'
    text += '<TABLE bgcolor=ffffff BORDER=' + border + ' CELLSPACING=' + cellspacing + ' id=ycs background=image/date/'+month+'.jpg>' // table settings
    text += '<TH COLSPAN=7 bgcolor=#f8f8f8 HEIGHT=' + headerHeight + '>' // create table header cell
    text += '<FONT COLOR="' + headerColor + '" SIZE=' + headerSize + '>' // set font for table header
    text += year +'�?+monthName 
    text += '</FONT>'
	text +='<input type=image src=image/arrowl.gif  onclick=yhn() title=上个�?/><input type=image src=image/arrowr.gif  onclick=yys() id=nex title=下个�?/>'
    text += '<FONT COLOR="' + timeColor + '" >'
   // text += getTime() 
    
    text += '</FONT>' // close table header's font settings
    text += '</TH>' // close header cell
    // variables to hold constant settings
    var openCol = '<TD WIDTH=' + colWidth + ' HEIGHT=' + dayCellHeight + ' class=trweek>'
    openCol += '<FONT COLOR="' + dayColor + '">'
    var closeCol = '</FONT></TD>'
    // create array of abbreviated day names
    var weekDay = new Array(7)
    weekDay[0] = "<font color=#ff0000>�?/font>"
    weekDay[1] = "一"
    weekDay[2] = "�?
    weekDay[3] = "�?
    weekDay[4] = "�?
    weekDay[5] = "�?
    weekDay[6] = "<font color=#006633>�?/font>"
    
    // create first row of table to set column width and specify week day
    text += '<TR ALIGN="center" VALIGN="center" class=trweek>'
    for (var dayNum = 0; dayNum < 7; ++dayNum) {
    text += openCol + weekDay[dayNum] + closeCol 
    }
    text += '</TR>'
    
    var digit = 1
    var curCell = 1
   
    
    for (var row = 1; row <= Math.ceil((lastDate + firstDay - 1) / 7); ++row) {
    text += '<TR ALIGN="right" VALIGN="top">'
    for (var col = 1; col <= 7; ++col) {
    if (digit > lastDate)
    break
    if (curCell < firstDay) {
    text += '<TD></TD>';
    curCell++
    } else {
    
	 var now = new Date()
    var year_ = now.getYear()
    var month_ = now.getMonth()
    var thisurl
	if (month==0)
	{
	month_e=11;
	thisurl="diary.aspx?year="+year+'&month='+12+'&day='+digit;
	}
	else
	{
	month_e=month-1;
	thisurl="diary.aspx?year="+year+'&month='+parseInt(month)+'&day='+digit;
	}
    
    if (digit == date && year==year_ && month_==month_e) {
    text += '<TD HEIGHT=' + cellHeight + ' background=image/date/bg_today.gif>'
    text += '<a href='+thisurl+'>'
    text += digit
    text += '</a><BR>'
    
    text += '</TD>'
    } else
	{
	
    text += '<TD HEIGHT=' + cellHeight + '><a href='+thisurl+'>' + digit + '</a></TD>'
    }
	digit++
	
    }
    }
    text += '</TR>'
    }
    text += '</TABLE>'
    text += '</CENTER>'
	
    //document.write(text) 
	document.all.intx.innerHTML=text;
    }
	
    // -- End Hiding Here -->