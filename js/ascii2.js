function str2asc(asc_string, div_id)
{
    /* 转ASCII */
   var asc_string = asc_string; //"想上山下海";

   div_id.innerHTML = '';
   for(i = 0; i < asc_string.length; i++)
   {
       asc = asc_string.charCodeAt(i);
       var str = String.fromCharCode(asc);
       document.getElementById(div_id).innerHTML += str + ':' + asc + '<br/>';
    }
}