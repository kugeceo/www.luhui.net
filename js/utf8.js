var mode="zhuan";
function encode(obj,btn){
   if(mode=="zhuan"){
       obj.value=obj.value.replace(/[^\u0000-\u00FF]/g,function($0){return escape($0).replace(/(%u)(\w{4})/gi,"&#x$2;")});
       btn.value="还原";
       mode="huan";
   }else{
       obj.value=unescape(obj.value.replace(/&#x/g,'%u').replace(/;/g,''));
       btn.value="转化";
       mode="zhuan";
   }
}