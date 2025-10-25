var str = "";

function show_range(){

	var nVal = document.getElementById('type').options[document.getElementById('type').selectedIndex].value	;

	if (nVal > 0)
	{

		str = document.business_tax.fanwei[nVal-1].value;

		document.getElementById('range').innerHTML  = '<strong style="color:#000">征收范围: </strong>'+str;


	}
	else
	{

		document.getElementById('range').innerText  = "";
	}

}

//是否为数值
String.prototype.is_number = function(){

	return /^[1-9][0-9]*(.[0-9]+)?$/.test(this);

}

function account(){
	var nVal =  document.getElementById('type').options[document.getElementById('type').selectedIndex].value	;
	var strtext = document.getElementById('type').options[document.getElementById('type').selectedIndex].text;

	var paynum=document.getElementById('number').value;

	if (nVal == "0")
	{
		alert("请选择税目");
		return false;
	}
	if(!checkData(document.getElementById('number'),"营业额")) return;



	if(paynum.is_number() == false){
		alert("请确定您输入的营业额是数字！");
		return false;
	}
	else{

	   paynum=eval(paynum);
	
	}

	var tax = paynum*document.business_tax.shuilv[nVal-1].value;
	tax=Math.round(tax*100)/100;
	var  remarks=" 您输入的营业额为：" + paynum + "\n 输入的税目为：" +strtext
	+ "\n 应纳营业税额为：" + tax;
	alert(remarks);
}


function checkData(Obj,Str){
	if (Obj.value==""){alert("请您输入"+Str+"\n");Obj.focus();return false;}else{return true;}
}