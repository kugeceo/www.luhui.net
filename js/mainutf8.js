//function killErrors() {
 //return true;
 //}
// window.onerror = killErrors;


// IE 6 background image cache
if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE6.0") {
    document.execCommand("BackgroundImageCache", false, true);
}
var CONTENTTL = {
    commentlist: ['<div class="pl_block">', '<div class="new">', '<div class="b_left">', '<div class="ico">', '<img src="{#faceurl}">', "</div></div>", '<div class="b_right">', '<div class="line">', '<span class="name">{#username}</span>', '<span class="f">{#lou}楼</span>', '<span class="time">{#saytime}</span></div>', '<p>{#saytext}<br>(感谢参与评论,您的评论内容将在审核后公开。)</p></div> </div></div>'].join("")
};
// Topbar dropdown menu
var chinazTopBarMenu = {
    create: function (target, menucontents) {
        if (!document.getElementById(menucontents)) {
            return;
        }
        var contents_wrap = document.getElementById(menucontents);
        var contents = contents_wrap.innerHTML;
        target.className += " hover";
        var dropdownmenu_wrap = document.createElement("div");
        dropdownmenu_wrap.className = "dropdownmenu-wrap";
        var dropdownmenu = document.createElement("div");
        dropdownmenu.className = "dropdownmenu";
        dropdownmenu.style.width = "auto";
        var dropdownmenu_inner = document.createElement("div");
        dropdownmenu_inner.className = "dropdownmenu-inner";
        dropdownmenu_wrap.appendChild(dropdownmenu);
        dropdownmenu.appendChild(dropdownmenu_inner);
        dropdownmenu_inner.innerHTML = contents;
        if (target.getElementsByTagName("div").length == 0) {
            target.appendChild(dropdownmenu_wrap);
        }
    },
    clear: function (target) {
        target.className = target.className.replace("hover", "");
    }
}

 function checkForm(obj){
          var keyword=obj.keyword.value;
          if(!keyword){
               alert("关键字不能为空!");
               return false;
           }
     }

function btngoUrl(Eid, path, pagecount)//转到某一页
{
    var i = GetValue(Eid);
    if (Num(i)) {
        if (i == 0) {
            alert("请输入大于0的数字！");
            return false;
        }
        if (Number(i) > Number(pagecount)) {
            alert("您输入的页数大于总页数，请输入小于" + (Number(pagecount) + 1) + "的数字！");
            return false;
        }
        else if (i == 1)
	{
          location.href = path + ".html";
	}
	else
	{
            location.href = path +"_"+ i + ".html";
        }
    }
    return false;
}

function btnAspxGoUrl(Eid, path, pagecount)//转到某一页
{
    var i = GetValue(Eid);
    if (Num(i)) {
        if (i == 0) {
            alert("请输入大于0的数字！");
            return false;
        }
        if (Number(i) > Number(pagecount)) {
            alert("您输入的页数大于总页数，请输入小于" + (Number(pagecount) + 1) + "的数字！");
            return false;
        }
        else {
            location.href = path + "&page=" + i;
        }
    }
    return false;
}

function GetValue(Eid)//取TextBox控件的值
{
    var e = document.getElementById(Eid);
    return e.value;
}
function Num(i)//只能填写数字
{
    if (i.search(/^[0-9]+$/) == -1) {
        alert("请填写整数！");
        return false;
    }
    return true;
}



jq = jQuery.noConflict();

jq(function () {
    var a = new FN_InitSidebar();
    a.setTop();
    a.addItem("<a class='research' target='_blank' href='?q=搜索帮助 bangzhu.html'><b></b>搜索帮助</a>");

    a.scroll();

    jq("input[name='keyword']").focus();


    try {
    jq('#container').masonry({
      itemSelector: '.box'
    });
    }
    catch (e) { }

    try {
        jq(".text_left img").lazyload({
            placeholder: "http://down.chinaz.com/images/grey.gif",
            effect: "fadeIn"
        });
    }
   catch (e) { }


    try {
        jq(".down_left img").lazyload({
            placeholder: "http://down.chinaz.com/images/grey.gif",
            effect: "fadeIn"
        });
    }
    catch (e) { }

    try {
        jq(".pngblock img").lazyload({
            placeholder: "http://down.chinaz.com/images/grey.gif",
            effect: "fadeIn"
        });
    }
    catch (e) { }

    try {

		jq('.text_left img').capty({
        animation: 'fade',
        speed:     400
        });


    }
    catch (e) { }

    try {
        jq(".ppt_text img").lazyload({
            placeholder: "http://down.chinaz.com/images/grey.gif",
            effect: "fadeIn"
        });
    }
    catch (e) { }




    try {
        jq("#size").LeeSelect();

        jq("#color").LeeSelect();

        jq("#sizelist").LeeSelect();
    }
    catch (e) { }

    try {

        var nahled_text = unescape(jq.cookie("nahledtext"));
        var velikost_text = unescape(jq.cookie("velikosttext"));
        

        if (nahled_text != null&&nahled_text !='null') {

            jq('.input-text').attr('value', nahled_text);

            jq(".font").each(function () {

                var idd = jq(this).attr("id");
				 var Arr = ["1","2","3"];   
                 var n = Math.floor(Math.random() * Arr.length + 1)-1;     
                var imgsrc = "http://demo"+Arr[n]+".font.chinaz.com/GetFontImg.aspx?text=" + nahled_text + "&path=" + idd + "&size=" + velikost_text + "";
                jq("#imgurl", this).html("<img src='" + imgsrc + "' />");
            });

        }

    }
    catch (e) { }

    jq(".subimt").click(function () {


        var nahled_text = jq("#text").attr("value");
        var velikost_text = jq("#sizes").attr("value");

jq.ajax({
    type: "get",
    url: "/tools/Save.ashx",
    data: "text=" +escape(nahled_text) + "",
        success: function(html){
        
        }
});

        jq(".font").each(function () {


            var idd = jq(this).attr("id");
				 var Arr = ["1","2","3"];   
                 var n = Math.floor(Math.random() * Arr.length + 1)-1;     
            var imgsrc = "http://demo"+Arr[n]+".font.chinaz.com/GetFontImg.aspx?text=" + escape(nahled_text) + "&path=" + idd + "&size=" + escape(velikost_text) + "";
            jq("#imgurl", this).html("<img src='" + imgsrc + "' />");

        });

        jq.cookie("nahledtext", escape(nahled_text), { expires: 1 });
        jq.cookie("velikosttext", escape(velikost_text), { expires: 1 });

    });


    jq("#btyl").click(function () {


        var nahled_text = jq("#text").attr("value");
        var velikost_text = "30";

jq.ajax({
    type: "get",
    url: "/tools/Save.ashx",
    data: "text=" +escape(nahled_text) + "",
        success: function(html){
        
        }
});

        jq(".font").each(function () {


            var idd = jq(this).attr("id");
				 var Arr = ["1","2","3"];   
                 var n = Math.floor(Math.random() * Arr.length + 1)-1;   
            var imgsrc = "http://demo"+Arr[n]+".font.chinaz.com/GetFontImg.aspx?text=" + escape(nahled_text) + "&path=" + idd + "&size=" + velikost_text + "";
            jq("#imgurl", this).html("<img src='" + imgsrc + "' />");

        });

        jq.cookie("nahledtext", escape(nahled_text), { expires: 1 });
        jq.cookie("velikosttext", escape(velikost_text), { expires: 1 });

    });

	    jq("#btsou").click(function () {


        var nahled_text = jq("#text").attr("value");

	        window.open("http://aspx.sc.chinaz.com/search.aspx?keyword="+nahled_text+"&classID=13","_blank");
            return false;


    });



    try {

        jq('#musiclist .n1').hover(function () {
           	jq(this).prepend('<div class="container"></div>');
		    var _this = jq(this);
            if (!_this.find('a.audio-player').children().is('object')) {
                if (_this.find('a.audio-player object')) {
                    _this.find('a.audio-player').show().jmp3({
                        "playerpath": 'http://pics.sc.chinaz.com/',
                        "filepath": _this.attr('thumb'),
                        "backcolor": '',
                        "forecolor": "ffffff",
                        "width": "25",
                        "repeat": "false",
                        "volume": "100",
                        "autoplay": "true",
                        "showdownload": "false",
                        "showfilename": "false"
                    });
                }
            };
        },
        function () {
            jq(this).find('div.container').remove();
        });


    }
    catch (e) { }

    try {
            jq('#downmusic').hover(function () {
                jq(this).prepend('<div class="container"></div>');
                var _this = jq(this);
                _this.addClass('musi_s');
                if (!_this.find('div.audio-player').children().is('object')) {
                    if (_this.find('div.audio-player object')) {
                        _this.find('div.audio-player').show().jmp3({
                            "playerpath": 'http://pics.sc.chinaz.com/',
                            "filepath": _this.attr('thumb'),
                            "backcolor": '',
                            "forecolor": "ffffff",
                            "width": "150",
                            "repeat": "false",
                            "volume": "100",
                            "autoplay": "true",
                            "showdownload": "true",
                            "showfilename": "false"
                        });
                    }
                };
            },
        function () {
            jq(this).removeClass('musi_s').find('div.container').remove();
        });



    }
    catch (e) { }



    jq(".button").click(function () {


        var nahled_text = jq(".input-text").attr("value");
        var velikost_text = jq("#sizes").attr("value");
        var color_text = jq("#colors").attr("value");
        var type_text = jq("#type").attr("value");

				 var Arr = ["1","2","3"];   
                 var n = Math.floor(Math.random() * Arr.length + 1)-1;   
        var idd = jq(".previews").attr("id");
        var imgsrc = "http://demo"+Arr[n]+".font.chinaz.com/GetFontImg.aspx?text=" + escape(nahled_text) + "&path=" + idd + "&size=" + escape(velikost_text) + "&color=" + escape(color_text) + "&type=" + escape(type_text) + "";
        jq(".nahled").html("<img src='" + imgsrc + "' />");





    });

    jq(".del_cooki").click(function () {
        jq.cookie("nahledtext", null);
        jq.cookie("velikosttext", null);
        window.location.reload();

    });


    jq(".copyurl").click(function () {
       // window.clipboardData.setData("text", jq('.sctitle').text() + ':'+' '+location.href);
       // alert("已复制成功，粘贴发送给好友！");

//判断浏览器的类型
var userAgent = navigator.userAgent.toLowerCase();
var is_opera = userAgent.indexOf('opera') != -1 && opera.version();
var is_moz = (navigator.product == 'Gecko') && userAgent.substr(userAgent.indexOf('firefox') + 8, 3);
var is_ie = (userAgent.indexOf('msie') != -1 && !is_opera) && userAgent.substr(userAgent.indexOf('msie') + 5, 3);
var is_safari = (userAgent.indexOf('webkit') != -1 || userAgent.indexOf('safari') != -1);
var _sTxt=jq('.sctitle').text() + ':'+' '+location.href;
	if(is_ie) {
		clipboardData.setData('Text',_sTxt);
		alert ("已经复制到您的剪贴板中\n您可以使用Ctrl+V快捷键粘贴到需要的地方");
	} else {
		prompt("请复制网站地址:",_sTxt);
	}


    });

    jq('#li_show').hide();
    jq('.list').hover(function () { //鼠标移动函数
        jq(this).parent().find('#li_show').slideDown();  //找到ul.son_ul显示
        jq(this).parent().hover(function () { },
function () {
    jq(this).parent().find("#li_show").slideUp();
});
    }, function () { }
);

    jq('#li_show li').click(function () {
        var sv = jq(this).text();
        jq("#cat").html(sv);
        document.forms["searchform"]["classID"].value = jq(this).attr("id");
        jq('#li_show').hide();
    });
    try {
     jq("img.preview").preview();
    }
    catch (e) { }

    try {
    jq('#slider').cycle({
        fx:      'scrollHorz',
        timeout:  0,
        prev:    '#prev',
        next:    '#next',
        pager:   '#pagination',
		speed: 800,
		timeout: 6000, 
		cleartype:  true,
		slideExpr: '.item'
    });
    }
    catch (e) { }

    try {
     var len  = jq("#idNum > li").length;
	 var index = 0;
	 jq("#idNum li").mouseover(function(){
		index  =   jq("#idNum li").index(this);
		showImg(index);
	});	
	 //滑入 停止动画，滑出开始动画.
	 jq('#idTransformView').hover(function(){
			  if(MyTime){
				 clearInterval(MyTime);
			  }
	 },function(){
			  MyTime = setInterval(function(){
			    showImg(index)
				index++;
				if(index==len){index=0;}
			  } , 5000);
	 });
	 //自动开始
	 var MyTime = setInterval(function(){
		showImg(index)
		index++;
		if(index==len){index=0;}
	 } , 2000);
    }
    catch (e) { }



    jq("#postcomment").submit(function(g) {
        g.preventDefault();
        jq("#btncommentSubmit").attr("disabled", "disabled");
		var f = jq(this);
        var h = jq("#comment_text").val();
        var u = jq("#nickname").val();
	    var d = "";
        if ( h == "注：所有评论通过审核后才会被公开。") {
            d = "请填写您的评论内容!";
            jq("#comment_text").focus()
        }

        if (h.length < 5) {
            d = d + (d != "" ? "<br/>": "") + "您提交的意见或建议过短!"
        }
        if (h.length > 500) {
            d = d + (d != "" ? "<br/>": "") + "请将您的评论内容尽量控制在 200 字以内!"
        }
        if (d != "") {
             jq.dialog({
                follow: document.getElementById("btncommentSubmit"),
                title: false,
                content: d,
                cancel: false,
                time: 2
            });
            jq("#btncommentSubmit").removeAttr("disabled");
            return
        }
		 jq.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=utf-8", 
            url: "/tools/SavePost.ashx",
            data: f.formSerialize(),
            success: function(k) {
                if (k.status == "success") {
                    f.resetForm();
                    var e = "";
                    var j = CONTENTTL.commentlist;
                    e = j.replace(/{#username}/g, k.info.username).replace(/{#faceurl}/g, k.info.faceurl).replace(/{#saytime}/g, k.info.saytime).replace(/{#lou}/g, k.info.lou).replace(/{#saytext}/g, h);
                    jq("#commentarea").prepend(e).animate({
                        opacity: "show"
                    },
                    "slow");

                }
                d = k.msg;
                jq.dialog({
                    follow: document.getElementById("btncommentSubmit"),
                    title: false,
                    content: d,
                    cancel: false,
                    time: 2
                });
                jq("#btncommentSubmit").removeAttr("disabled")
            }
        });
        return false
    });
    jq("#saveerror").submit(function(g) {

        g.preventDefault();
	var f = jq(this);
        var h = jq("#content").val();
        var u = jq("#email").val();
	var downid = jq("#downid").val();
	var d = "";

        if (h.length < 2) {
            d = d + (d != "" ? "<br/>": "") + "您提交的意见或建议过短!"
        }
        if (h.length > 500) {
            d = d + (d != "" ? "<br/>": "") + "请将您的内容尽量控制在 200 字以内!"
        }

        if (u.length < 2) {
            d = d + (d != "" ? "<br/>": "") + "请填写联系得到的邮箱或QQ!"
        }
        if (d != "") {
             art.dialog({

                top: '5%',
                title: false,
                content: d,
                cancel: false,
                time: 2
            });
            return
        }
		 jq.ajax({
            type: "POST",
            dataType: "json",
            url: "/tools/SaveError.ashx",
            data: "email="+u+"&content="+h+"&downid="+downid,
            success: function(k) {
                if (k.status == "success") {
                d = k.msg;
                art.dialog({
                top: '5%',
                title: false,
                content: d,
                cancel: false,
                time: 2
                });
                }


            }
        });
        return false

    });
    try {
var nickname = jQuery.cookie("nickname");
var email = jQuery.cookie("email");
var openid = jQuery.cookie("openid");
var headpic = jQuery.cookie("headpic");
var logintype = jQuery.cookie("logintype");

 jq('input[name=nickname]').attr('value',nickname);
 jq('input[name=email]').attr('value',email);
 jq('input[name=openid]').attr('value',openid);
 jq('input[name=headpic]').attr('value',headpic);
 jq('input[name=logintype]').attr('value',logintype);

if (nickname != null) {
jq(".ds-sync").html("游客："+nickname+",<a href='javascript:;' onclick='logout();'>退出</a>");
}
    }
    catch (e) { }


//    jq(".old")
//    .mouseover(function() {
//        jq(this).find(".huifucon").show();

//    })
//    .mouseout(function() {
//        jq(this).find(".huifucon").hide();
 //   });

    try {
	jq(".bq_buttons").manhuaHtmlArea({
		Event : "click",
		Left : -22,
		Top : 23,			
		id : "comment_text"
	});

    }
    catch (e) { }
try {
	jq("a.image_gall").popImage();
    }
    catch (e) { }
});

function Replay(id){


var nickname = jQuery.cookie("nickname");
var email = jQuery.cookie("email");
var headpic = jQuery.cookie("headpic");
var openid = jQuery.cookie("openid");

var d = document;
var f = d.getElementById('reply_' + id);

ri = d.getElementById('u_rpy_' + id);

var str_ = '<div class="wright_in reply" id="u_rpy_'+id+'">'+
    '<textarea name="comment_text'+id+'" id="comment_text'+id+'"}"></textarea>'+
    '<pre class="ds-hidden-text"></pre>'+
		'<input type="hidden" name="email'+id+'" id="email'+id+'" value="'+email+'" />'+
		'<input type="hidden" name="nickname'+id+'" id="nickname'+id+'" value="'+nickname+'" />'+
		'<input type="hidden" name="openid'+id+'" id="openid'+id+'" value="'+openid+'" />'+
		'<input type="hidden" name="headpic'+id+'" id="headpic'+id+'" value="'+headpic+'" />'+
		'<input type="hidden" name="logintype'+id+'" id="logintype'+id+'" value="0" />'+
		'<input type="hidden" name="parentid'+id+'" id="parentid'+id+'" value="'+id+'" />'+
		'<div class="toolbars">'+
		'<span class="button"><a href="javascript:;" onclick="addreplay('+id+');">回复</a></span>'+
 	    '<div class="options">'+
      	'<span style="color: #789dba;" class="ds-sync'+id+'" id="ds-sync'+id+'">可匿名发表评论</span>'+
        '</div>'+
		'<div class="bq_buttons'+id+' faces"><a title="插入表情"  onclick="shoSmile('+id+');"></a></div>'+
		'</div>'+
    '</div>';
if (ri != null) {
	f.removeChild(ri)
}
else
{
	 jq(".reply_"+id).html(str_);							
}



if (nickname != null) {
jq(".ds-sync"+id).html("游客："+nickname+",<a href='javascript:;' onclick='logout();'>退出</a>");
}
}

function logout(){

        jq.cookie("nickname", null, { expires: 7, path: '/', domain: 'chinaz.com', secure: true });
        jq.cookie("email", null, { expires: 7, path: '/', domain: 'chinaz.com', secure: true });

        window.location.reload();
}


function addreplay(id){
        var comment_text=jq("#comment_text"+id).val();
        var email=jq("#email"+id).val();
        var nickname=jq("#nickname"+id).val().replace('null','');
		var openid=jq("#openid"+id).val();
        var headpic=jq("#headpic"+id).val();
        var logintype=jq("#logintype"+id).val();
        var parentid=jq("#parentid"+id).val();
        var downid=jq("#downid").val();
	    var d = "";
        if ( comment_text == "请输入您的评论内容，最多可以输入200字") {
            d = "请填写您的评论内容!";
            jq("#comment_text"+id).focus()
        }

        if (comment_text.length < 2) {
            d = d + (d != "" ? "<br/>": "") + "您提交的意见或建议过短!"
        }
        if (comment_text.length > 500) {
            d = d + (d != "" ? "<br/>": "") + "请将您的评论内容尽量控制在 200 字以内!"
        }
        if (d != "") {
             jq.dialog({
                follow: document.getElementById("btncommentSubmit"),
                title: false,
                content: d,
                cancel: false,
                time: 2
            });
            return
        }
		 jq.ajax({
            type: "POST",
            url: "/tools/SavePost.ashx",
            dataType: "json",
            contentType: "application/x-www-form-urlencoded; charset=utf-8", 
            data: "downid="+downid+"&comment_text="+comment_text+"&email="+email+"&nickname="+nickname+"&openid="+openid+"&headpic="+headpic+"&logintype="+logintype+"&parentid="+parentid,
            success: function(k) {
                if (k.status == "success") {
                    var e = "";
                    var j = CONTENTTL.commentlist;
                    e = j.replace(/{#username}/g, k.info.username).replace(/{#faceurl}/g, k.info.faceurl).replace(/{#saytime}/g, k.info.saytime).replace(/{#lou}/g, k.info.lou).replace(/{#saytext}/g, comment_text);
                    jq("#commentarea").prepend(e).animate({
                        opacity: "show"
                    },
                    "slow");

                }


                jq.dialog({
                    follow: document.getElementById("btncommentSubmit"),
                    title: false,
                    content: k.msg,
                    cancel: false,
                    time: 2
                });

            }
        });
        return false

}


function woding(id) {

        jq.ajax({
            type: "GET",
            url: "/tools/SaveDing.ashx",
            data: "id=" + id,
            dataType: "json",
            success: function(b) {
				jq("#ding_"+id).text(b.num);
                jq.dialog({
                    follow: document.getElementById("btncommentSubmit"),
                    title: false,
                    content: b.msg,
                    cancel: false,
                    time: 2
                });
            }
        })

}


function getnext(id) {

        jq.ajax({
            type: "GET",
            url: "/tools/GetNext.ashx",
            data: "downid=" + id,
            dataType: "html",
            success: function(b) {
	if ('NULL' == b) {
		jq(".nextreply").html('<a href="javascript:;">没有更多的评论了</a>');
		jq(".nextreply").slideDown('slow');
	} else {
		jq(".nextreply").last().after(b);
		jq(".nextreply:hidden").fadeIn();
		jq(".fys .one").hide();
	}
            }
        })

}


function showImg(i){
		jq("#idSlider").stop(true,false).animate({top : -159*i},800);
		 jq("#idNum li")
			.eq(i).addClass("on")
			.siblings().removeClass("on");
}





function AutoScroll(obj){
        jq(obj).find("ul:first").animate({
                marginTop:"-25px"
        },500,function(){
                jq(this).css({marginTop:"0px"}).find("li:first").appendTo(this);
        });
  marquee=setTimeout('AutoScroll("#scrollDiv")',3000);
}

jq(function () {
AutoScroll("#scrollDiv");
jq("#scrollDiv").hover(function(){
    clearTimeout(marquee);
  },function(){
   AutoScroll("#scrollDiv");
  });
});

//全选取消按钮函数，调用样式如：
function checkAll(chkobj){
	if(jq(chkobj).text()=="全选")
	{
		jq(chkobj).text("取消");
		jq(".checkall input").attr("checked", true);
	}else{
		jq(chkobj).text("全选");
		jq(".checkall input").attr("checked", false);
	}
}

FN_InitSidebar = function() {
    if (!jq("#toppanel").length) {
        jq(document.body).prepend('<div class="w ld" id="toppanel"></div>');
    }
    jq("#toppanel").append('<div id="sidepanel" class="hide"></div>');
    var a = jq("#sidepanel");
    this.scroll = function() {
        var b = this;
        jq(window).bind("scroll",
        function() {
          a.show();
        });
        b.initCss();
        jq(window).bind("resize",
        function() {
            b.initCss();
        });
    };
    this.initCss = function() {
        var b, c = false ? 1210 : 990;
        var b, c = false ? 980 : 980;
        if (screen.width >= 980) {
            if (jq.browser.msie && jq.browser.version <= 6) {
                b = {
                    right: (document.documentElement.clientWidth - c) / 2 - 30 + "px"
                };
            } else {
                b = {
                    right: (document.documentElement.clientWidth - c) / 2 - 26 + "px"
                };
            }
            a.css(b);
        }
    };
    this.addCss = function(b) {
        a.css(b);
    };
    this.addItem = function(b) {
        a.append(b);
    };
    this.setTop = function() {
        this.addItem("<a href='#' class='gotop' title='使用快捷键T也可返回顶部哦！'><b></b>返回顶部</a>");
    };
}

	function Showcomment() {
    jq.ajax({
        type: "GET",
        url: "/tools/comment.aspx",
        dataType: "html",
        cache: false,
        success: function(A) {
            jq("#comment").html(A)
        }
    });
    return false
}


function geterror(tt,id) {

var myDialog = art.dialog();
jQuery.ajax({
    url: '/error.aspx?id='+id+'&?anticache=' + Math.floor(Math.random()*1000),
    success: function (data) {
        myDialog.content(data);
    }
});

}
function dprate(value,entryid){
	sPostdata = 'SoftID='+entryid+'&RateValue='+value
        jq.ajax({
            type: "GET",
            url: "http://sc.chinaz.com/tools/rate.ashx",
            data: sPostdata,
            dataType: "jsonp",
            jsonp: "callbackparam",
            jsonpCallback:"success_jsonpCallback",
            success: function(b) {
				jq("#rate1num").text(b[0].num1);
				jq("#rate2num").text(b[0].num2);
                            ratecallback(b[0].type);
            }
        })

}
function dprateinfo(value,entryid){
	sPostdata = 'SoftID='+entryid+'&kid=3&RateValue='+value
        jq.ajax({
            type: "GET",
            url: "http://sc.chinaz.com/tools/rate.ashx",
            data: sPostdata,
            dataType: "jsonp",
            jsonp: "callbackparam",
            jsonpCallback:"success_jsonpCallback",
            success: function(b) {
				jq("#rate1num").text(b[0].num1);
				jq("#rate2num").text(b[0].num2);
                            ratecallback(b[0].type);
            }
        })

}
function ratecallback(value){
switch (value) {
case "true":
	alert("感谢您的评价!");
	break;
case "invalidvalue":
	alert("抱歉,出现错误,请刷新页面后再试!");
	break;
case "repeated" :
	alert("您已经评价过了,请不要重复提交!");
	break;
default:
	alert("网络错误!我们会尽快修复,抱歉!");
}


document.getElementById("rate1").onclick="";
document.getElementById("rate2").onclick="";
}


function shoSmile(id) {

	jq(".bq_buttons"+id).manhuaHtmlArea({
		Event : "click",
		Left : -22,
		Top : 23,			
		id : "comment_text"+id
	});

}

setTimeout("cz_showAuditInfo(1)",1000);
function cz_showAuditInfo(tag){
	var auditInfo ="注：所有评论通过审核后才会被公开。";
	var obj = document.getElementById("comment_text");
	if(obj){
		if(tag == 1){//显示
			if(obj.value == ""){obj.value = auditInfo;obj.style.color="#aaa";}
		}else{//不显示
			if(obj.value == auditInfo){obj.value = "";obj.style.color="#aaa";}
		}
	}
}

/* FIXED THD BOOK*/
jq(function(){
	
	jq(window).resize(function(){

		if(jq(window).scrollTop()>1179){
            jq('.book').css('position', 'fixed');
            jq('.book').css('top', 5);

		}
		})

	jq(window).scroll(function(e){
        if(jq(window).scrollTop()>1179){
            jq('.book').css('position', 'fixed');
           jq('.book').css('top', 5);
			
        } else {
            jq('.book').css('position', '');
            jq('.book').css('top', '');
			jq('.book').css('left', '');
        }
		if(0 < jq(window).scrollTop()){
	    	jq('.top').fadeIn();
		}else{
	   		jq('.top').fadeOut();
		}
		return false;
    });
//--------

	jq(window).resize(function(){

		if(jq(window).scrollTop()>1391){
            jq('.infobook').css('position', 'fixed');
            jq('.infobook').css('top', 5);

		}
		})

	jq(window).scroll(function(e){
        if(jq(window).scrollTop()>1391){
            jq('.infobook').css('position', 'fixed');
           jq('.infobook').css('top', 5);
			
        } else {
            jq('.infobook').css('position', '');
            jq('.infobook').css('top', '');
			jq('.infobook').css('left', '');
        }
		if(0 < jq(window).scrollTop()){
	    	jq('.top').fadeIn();
		}else{
	   		jq('.top').fadeOut();
		}
		return false;
    });

//------------------

	jq(window).resize(function(){

		if(jq(window).scrollTop()>1510){
            jq('.slbook').css('position', 'fixed');
            jq('.slbook').css('top', 5);

		}
		})

	jq(window).scroll(function(e){
        if(jq(window).scrollTop()>1510){
            jq('.slbook').css('position', 'fixed');
           jq('.slbook').css('top', 5);
			
        } else {
            jq('.slbook').css('position', '');
            jq('.slbook').css('top', '');
			jq('.slbook').css('left', '');
        }
		if(0 < jq(window).scrollTop()){
	    	jq('.top').fadeIn();
		}else{
	   		jq('.top').fadeOut();
		}
		return false;
    });
//------------------

	jq(window).resize(function(){

		if(jq(window).scrollTop()>1535){
            jq('.yxbook').css('position', 'fixed');
            jq('.yxbook').css('top', 5);

		}
		})

	jq(window).scroll(function(e){
        if(jq(window).scrollTop()>1535){
            jq('.yxbook').css('position', 'fixed');
           jq('.yxbook').css('top', 5);
			
        } else {
            jq('.yxbook').css('position', '');
            jq('.yxbook').css('top', '');
			jq('.yxbook').css('left', '');
        }
		if(0 < jq(window).scrollTop()){
	    	jq('.top').fadeIn();
		}else{
	   		jq('.top').fadeOut();
		}
		return false;
    });

	//------------------

	jq(window).resize(function(){

		if(jq(window).scrollTop()>1655){
            jq('.dhbook').css('position', 'fixed');
            jq('.dhbook').css('top', 5);

		}
		})

	jq(window).scroll(function(e){
        if(jq(window).scrollTop()>1655){
            jq('.dhbook').css('position', 'fixed');
           jq('.dhbook').css('top', 5);
			
        } else {
            jq('.dhbook').css('position', '');
            jq('.dhbook').css('top', '');
			jq('.dhbook').css('left', '');
        }
		if(0 < jq(window).scrollTop()){
	    	jq('.top').fadeIn();
		}else{
	   		jq('.top').fadeOut();
		}
		return false;
    });



    var allPt = jq(".list").find("div.pic_listblock");
    allPt.each(
		function () {
		    if (jq(this).find("li").length > 6) {
		        var isClose = jq(this).find("li:hidden").length > 0;
		        var toggleLink = jq("<a class=\"icobtn " + (isClose ? "ex" : "in") + " toggleValues\" href=\"javascript:void(0);\">" + (isClose ? "展开" : "收起") + "</a>");
		        jq(this).find("div.b").append(toggleLink);
		    }
		}
	);

    jq(".toggleValues").click(
			function () {
			    if (jq(this).hasClass("ex")) {
			        jq(this).removeClass('ex');
			        jq(this).addClass('in').text('收起');
			        jq(this).parent().parent().next().children('li:gt(5)').show();
			    }
			    else {
			       jq(this).removeClass('in')
			       jq(this).addClass('ex').text('展开');
			       jq(this).parent().parent().next().children('li:gt(5)').hide();
			    }
			}
		);

    jq(".downurl>li:first").addClass("active");
    jq(".downurl>li").mouseover(function () {
        jq(".downurl>li").removeClass("active");
        jq(this).addClass("active");
        jq(".downcon>.downbody").eq(jq('.downurl>li').index(this)).show().siblings().hide();
    });

	})