�?///////////////////////////////////////////////////////////////////////
// Search Search Engine List v1.0.1
// 2007-03-14 14:33:16
// www.KJJ.CC 匪徒�?服务器安全技术交流平�?
// 静花木木 QQ�?226211  纯属无聊 本程序送大家玩
////////////////////////////////////////////////////////////////////////

//**********************************************************************
// Default Values
//**********************************************************************
Search.defaults = {};

Search.defaults.langCode = "en-us";
Search.defaults.category = "prefered";
Search.defaults.saveHistory = true;
Search.defaults.loadAll = false;
Search.defaults.Keyword = 15;

Search.defaults.preferedList = {};

Search.defaults.preferedList["en-us"] = [
	{c: "web", n: "google"},
	{c: "web", n: "yahoo"},
	{c: "web", n: "ask"},
	{c: "forum", n: "google"},
	{c: "image", n: "google"}
]

Search.defaults.preferedList["zh-cn"] = [
	{c: "web", n: "google"},
	{c: "web", n: "baidu"},
	{c: "web", n: "yahoo"},
	{c: "image", n: "google"},
	{c: "image", n: "baidu"},
	{c: "music", n: "baidu"}
]

Search.defaults.preferedList["fr-fr"] = [
	{c: "web", n: "google"},
	{c: "web", n: "yahoo"},
	{c: "web", n: "ask"},
	{c: "forum", n: "google"},
	{c: "image", n: "google"}
]


//**********************************************************************
// Search Engine Lists
//**********************************************************************
Search.localeList = {};

//**********************************************************************
// English
//**********************************************************************
Search.localeList["en-us"] = {};

Search.localeList["en-us"]["web"] = {

	"title": "Web",

	"items": {
		"google": { title: "Google",
			url: "http://www.google.com/search?client=aff-&forid=1&ie=utf-8&oe=utf-8&hl=en&q={keyword}" },
		"yahoo": { title: "Yahoo!",
			url: "http://search.yahoo.com/search?fr=cb-&serveUrl=so..cn&ei=utf-8&p={keyword}" },
		"ask": { title: "Ask.com",
			url: "http://www.ask.com/web?q={keyword}" },
		"live": { title: "Live Search",
			url: "http://search.live.com/results.aspx?q={keyword}" },
		"looksmart": { title: "Looksmart",
			url: "http://search.looksmart.com/p/search?free=1&qta=1&qt={keyword}" },
		"gigablast": { title: "Gigablast",
			url: "http://www.gigablast.com/search?q={keyword}" }
	}

}


Search.localeList["en-us"]["image"] = {

	"title": "Images",

	"items": {
		"google": { title: "Google", subtitle: " Images",
			url: "http://images.google.com/images?hl=en&q={keyword}&gbv=2" },
		"yahoo": { title: "Yahoo!", subtitle: " Images",
			url: "http://images.search.yahoo.com/search/images?ei=UTF-8&fr=cb-&serveUrl=so..cn&p={keyword}" },
		"ask": { title: "Ask.com", subtitle: " Images",
			url: "http://images.ask.com/pictures?q={keyword}&qsrc=2072&tool=img" },
		"live": { title: "Live Search", subtitle: " Images",
			url: "http://search.live.com/images/results.aspx?q={keyword}&FORM=BIRE" },
		"flickr": { title: "Flickr",
			url: "http://www.flickr.com/search/?q={keyword}" },
		"picsearch": { title: "PicSearch",
			url: "http://www.picsearch.com/search.cgi?q={keyword}" }
	}
}


Search.localeList["en-us"]["news"] = {

	"title": "News",

	"items": {
		"google": { title: "Google", subtitle: " News",
			url: "http://news.google.com/news?hl=en&ned=us&q={keyword}" },
		"yahoo": { title: "Yahoo!", subtitle: " News",
			url: "http://news.search.yahoo.com/news/search?p={keyword}" },
		"live": { title: "Live Search", subtitle: " News",
			url: "http://search.live.com/news/results.aspx?q={keyword}&FORM=BNRE" },
		"daypop": { title: "Daypop", subtitle: " News",
			url: "http://www.daypop.com/search?q={keyword}&t=n" },
		"alltheweb": { title: "AllTheWeb", subtitle: " News",
			url: "http://www.alltheweb.com/search?cat=news&cs=utf8&q={keyword}&rys=0&itag=crv&_sb_lang=any" },
		"altavista": { title: "AltaVista", subtitle: " News",
			url: "http://www.altavista.com/news/results?q={keyword}&nc=0&nr=0&nd=2" }
	}

}


Search.localeList["en-us"]["blog"] = {

	"title": "Blog",

	"items": {
		"google": { title: "Google", subtitle: " Blogs",
			url: "http://blogsearch.google.com/blogsearch?ie=UTF8&oe=UTF-8&hl=en&q={keyword}&om=1&z=4&tab=lb" },
		"ask": { title: "Ask.com", subtitle: " Blogs",
			url: "http://www.ask.com/blogsearch?q={keyword}" },
		"technorati": { title: "Technorati",
			url: "http://technorati.com/search/{keyword}" },
		"feedster": { title: "Feedster",
			url: "http://www.feedster.com/search/{keyword}" }
	}

}


Search.localeList["en-us"]["reference"] = {

	"title": "Reference",

	"items": {
		"dictionary": { title: "Dictionary.com",
			url: "http://dictionary.reference.com/browse/{keyword}" },
		"webster": { title: "Merriam-Webster",
			url: "http://www.webster.com/dictionary/{keyword}" },
		"wikipedia": { title: "Wikipedia",
			url: "http://www.wikipedia.org/w/wiki.phtml?search={keyword}" },
		"encarta": { title: "Encarta",
			url: "http://encarta.msn.com/encnet/refpages/search.aspx?q={keyword}" },
		"britannica": { title: "Britannica",
			url: "http://www.britannica.com/search?query={keyword}" },
		"infomine": { title: "Infomine",
			url: "http://infomine.ucr.edu/cgi-bin/canned_search?query={keyword}" }
	}

}


Search.localeList["en-us"]["misc"] = {

	"title": "Misc.",

	"items": {
		"google_groups": { title: "Google Groups",
			url: "http://groups.google.com/groups/search?q={keyword}" },
		"google_maps": { title: "Google Maps",
			url: "http://maps.google.com/maps?ie=UTF-8&oe=UTF-8&hl=en&q={keyword}&z=4&om=1&um=1&sa=N&tab=wl" },
		"amazon": { title: "Amazon",
			url: "http://www.amazon.com/s/ref=nb_ss_gw/002-0555077-8828815?url=search-alias%3Daps&field-keywords={keyword}" },
		"ebay": { title: "eBay",
			url: "http://buy.ebay.com/{keyword}" },
		"youtube": { title: "YouTube",
			url: "http://www.youtube.com/results?search_query={keyword}" },
		"yahoo": { title: "Yahoo! Answers", subtitle: "",
			url: "http://answers.yahoo.com/search/search_result;_ylt=AlnxKjDWkwMepoT1FRXn2tgjzKIX?p={keyword}" }
	}

}


//**********************************************************************
// 简体中�?
//**********************************************************************
Search.localeList["zh-cn"] = {};

Search.localeList["zh-cn"]["web"] = {

	"title": "网页",

	"items": {
		"noaya": { title: "诺雅",
			url: "search.html?q={keyword}&type=1" },
		"luhui": { title: "鲁虺",
			url: "http://www.luhui.net/Spider.asp?wd={keyword}&cl=13&cat=" },
		"google": { title: "Google",
			url: "http://www.google.cn/search?client=aff-&forid=1&ie=utf-8&oe=utf-8&hl=zh-CN&q={keyword}" },
		"youdao": { title: "有道",
			url: "http://www.yodao.com/search?lq=%E8%AF%B7%E8%BE%93%E5%85%A5%E5%85%B3%E9%94%AE%E5%AD%97%EF%BC%8C%E6%B2%A1%E6%9C%89%E6%89%8D%E6%89%BE%E4%B8%8D%E5%88%B0&ue=utf8&keyfrom=web.top&q={keyword}" },
		"baidu": { title: "百度",
			url: "http://www.baidu.com/s?tn=luhuinet&ie=utf-8&wd={keyword}" },
		"yahoo": { title: "雅虎",
			url: "http://search.union.yahoo.com.cn/click/search.htm?m=419221&ei=utf-8&fw=union&st=0&p=1006&name={keyword}" },
		"iask": { title: "爱问",
			url: "http://search.iask.com/cgi-bin/search/search.cgi?_searchkey={keyword}&pid=33933&fromlianmeng=lianmeng" },
		"live": { title: "Live 搜索",
			url: "http://search.live.com/results.aspx?q={keyword}" },
		"sogou": { title: "搜狗",
			url: "http://www.sogou.com/web?query={keyword:gb2312}" },
		"zhongshou": { title: "中搜",
			url: "http://p.zhongsou.com/p?dt=1&pt=1&w={keyword:gb2312}"	}
	}

}


Search.localeList["zh-cn"]["image"] = {

	"title": "图像",

	"items": {
		"noaya": { title: "诺雅", subtitle: "图像",
			url: "search.html?q={keyword:gb2312}&type=3" },
		"baidu": { title: "百度", subtitle: "图像",
			url: "http://image.baidu.com/i?ct=201326592&lm=-1&word={keyword:gb2312}" },
		"google": { title: "Google", subtitle: " 图像",
			url: "http://images.google.cn/images?q={keyword}" },
		"yahoo": { title: "雅虎", subtitle: "图像",
			url: "http://image.cn.yahoo.com/search?p={keyword:gb2312}" },
		"bababian": { title: "巴巴�?,
			url: "http://www.bababian.com/seallphoto.sl?type=tag&all=0&search={keyword}" },
		"yupoo": { title: "又拍",
			url: "http://www.yupoo.com/search/?s=everyone&q={keyword}" },
		"iask": { title: "新浪爱问", subtitle: "图像",
			url: "http://p.iask.com/p?k={keyword:gb2312}" },
		"sogou": { title: "搜狗", subtitle: "图像",
			url: "http://pic.sogou.com/pics?query={keyword:gb2312}" },
		"zhongshou": { title: "中搜", subtitle: "图像",
			url: "http://img.zhongsou.com/i?w={keyword:gb2312}" },
		"live": { title: "Live 搜索", subtitle: " (图像)",
			url: "http://search.live.com/images/results.aspx?q={keyword}" }
	}
}


Search.localeList["zh-cn"]["news"] = {

	"title": "新闻",

	"items": {
		"noaya": { title: "诺雅", subtitle: "新闻",
			url: "search.html?q={keyword:gb2312}&type=2" },
		"baidu": { title: "百度", subtitle: "新闻",
			url: "http://news.baidu.com/ns?word={keyword:gb2312}" },
		"google": { title: "Google", subtitle: " 新闻",
			url: "http://news.google.cn/news?ie=utf-8&oe=utf-8&q={keyword}" },
		"yahoo": { title: "雅虎", subtitle: "新闻",
			url: "http://cn.news.yahoo.com/search1.html?ei=utf-8&p={keyword}" },
		"iask": { title: "新浪爱问", subtitle: "新闻",
			url: "http://www.iask.com/n?k={keyword:gb2312}" },
		"sogou": { title: "搜狗", subtitle: "新闻",
			url: "http://news.sogou.com/news?query={keyword:gb2312}" },
		"qihoo": { title: "奇虎", subtitle: "新闻",
			url: "http://so.news.qihoo.com/?kw={keyword:gb2312}" },
		"zhongshou": { title: "中搜", subtitle: "新闻",
			url: "http://z.zhongsou.com/n?w={keyword:gb2312}" }
	}

}


Search.localeList["zh-cn"]["music"] = {

	"title": "音乐",

	"items": {
		"baidu": { title: "百度", subtitle: " MP3",
			url: "http://mp3.baidu.com/m?f=ms&&ct=134217728&lm=-1&word={keyword:gb2312}" },
		"sogua": { title: "SoGua",
			url: "http://search.sogua.com/search.asp?key={keyword:gb2312}" },
		"yahoo": { title: "雅虎", subtitle: "音乐",
			url: "http://music.cn.yahoo.com/search.html?p={keyword:gb2312}" },
		"sogou": { title: "搜狗", subtitle: "音乐",
			url: "http://d.sogou.com/music?class=1&query={keyword:gb2312}" },
		"qihoo": { title: "奇虎", subtitle: " MP3",
			url: "http://so.mp3.qihoo.com/index.html?kw={keyword}" },
		"zhongshou": { title: "中搜", subtitle: " MP3",
			url: "http://mp3.zhongsou.com/m?w={keyword:gb2312}" }
	}

}

Search.localeList["zh-cn"]["movie"] = {

	"title": "电影",

	"items": {
	
		"baidu": { title: "百度视频",
			url: "http://video.baidu.com/v?ct=301989888&rn=20&pn=0&db=0&s=0&word={keyword:gb2312}" },
		"Google": { title: "Google Video",
			url: "http://video.google.com/videosearch?q={keyword:gb2312}&hl=zh-CN" },
		"luhui": { title: "鲁虺影视搜索",
			url: "http://www.luhui.net/cn/movie/list1.asp?tn=baidux&key{keyword:gb2312}.html" },
		"paiso": { title: "拍手电影�?,
			url: "http://www.paiso.net/class/search_{keyword:gb2312}.html" },
		"btpaiso": { title: "BT大全",
			url: "http://bt.paiso.net/Search.aspx?keywords={keyword:gb2312}" }
		
	}

}

Search.localeList["zh-cn"]["video"] = {

	"title": "视频",

	"items": {
		"youku": { title: "优酷",
			url: "http://www.youku.com/search_video/q_{keyword}" },
		"tudou": { title: "土豆",
			url: "http://www.tudou.com/search/programs/?posto=%2Fsearch%2Fprograms%2F&kw={keyword:gb2312}" },
		"5d6v": { title: "我的领域", subtitle: "视频",
		    url: "http://www.5d6v.com/Search/?Key={keyword:gb2312}" },
		"baidu": { title: "百度", subtitle: "视频",
			url: "http://video.baidu.com/v?word={keyword:gb2312}&ct=301989888&rn=20&pn=0&db=0&s=0" },
		"yahoo": { title: "雅虎", subtitle: "视频",
			url: "http://video.cn.yahoo.com/search.html?p={keyword:gb2312}" },
		"iask": { title: "新浪爱问", subtitle: "视频",
			url: "http://v.iask.com/v?k={keyword}" },
		"qihoo": { title: "奇虎", subtitle: "视频",
			url: "http://search.v.qihoo.com/index.html?kw={keyword:gb2312}" }
	}

}


Search.localeList["zh-cn"]["forum"] = {

	"title": "论坛",

	"items": {
		"google": { title: "Google", subtitle: " 论坛",
			url: "http://groups.google.com/groups?q={keyword}" },
		"qihoo": { title: "奇虎", subtitle: "论坛",
			url: "http://so.bbs.qihoo.com/?kw={keyword:gb2312}" },
		"daqi": { title: "大旗",
			url: "http://search.daqi.com/cgi-bin/search?keyword={keyword:gb2312}" },
		"yahoo": { title: "雅虎", subtitle: "酷帖",
			url: "http://misc.yahoo.com.cn/psearch.html?p={keyword:gb2312}" },
		"zhongshou": { title: "中搜", subtitle: "论坛",
			url: "http://bbs.zhongsou.com/b?w={keyword:gb2312}" }
	}

}


Search.localeList["zh-cn"]["blog"] = {

	"title": "博客",

	"items": {
		"baidu": { title: "百度", subtitle: "博客",
			url: "http://blogsearch.baidu.com/s?wd={keyword:gb2312}" },
		"souyo": { title: "SouYo",
			url: "http://www.souyo.com/search?q={keyword}" },
		"yodao": { title: "有道", subtitle: "博客",
			url: "http://blog.yodao.com/search?q={keyword}" },
		"qihoo": { title: "奇虎", subtitle: "博客",
			url: "http://so.blog.qihoo.com/index.html?kw={keyword:gb2312}" }
	}

}


Search.localeList["zh-cn"]["dict"] = {

	"title": "词典",

	"items": {
		"iciba": { title: "爱词�?,
			url: "http://www.iciba.com/search?s={keyword}" },
		"dictcn": { title: "Dict.cn",
			url: "http://www.dict.cn/search/?q={keyword:gb2312}" },
		"yodao": { title: "有道", subtitle: "海量词典",
			url: "http://dict.yodao.com/search?q={keyword}" },
		"zdic": { title: "汉典",
			url: "http://www.zdic.net/zd/search/?q={keyword}" }
	}

}


Search.localeList["zh-cn"]["misc"] = {

	"title": "其他",

	"items": {
		"baidu_zhidao": { title: "百度知道",
			url: "http://zhidao.baidu.com/q?ct=17&pn=0&tn=ikaslist&rn=10&word={keyword:gb2312}" },
		"iask_k": { title: "爱问知识�?,
			url: "http://iask.sina.com.cn/search_engine/search_knowledge_engine.php?key={keyword:gb2312}" },
		"paiso": { title: "拍手电影",
			url: "http://www.paiso.net/class/search_{keyword:gb2312}.html" },
		"taobao": { title: "淘宝",
			url: "http://search1.taobao.com/browse/search_auction.htm?q={keyword:gb2312}" },
		"btchina": { title: "BT China",
			url: "http://search.btchina.net/btsearch.php?query={keyword:gb2312}" }
	}

}


//**********************************************************************
// Français
//**********************************************************************
Search.localeList["fr-fr"] = {};

Search.localeList["fr-fr"]["prefered"] = {}; // place holder for user list

Search.localeList["fr-fr"]["web"] = {

	"title": "Web",

	"items": {
		"google": { title: "Google",
			url: "http://www.google.fr/search?client=aff-&forid=1&ie=utf-8&oe=utf-8&hl=fr&q={keyword}" },
		"yahoo": { title: "Yahoo!",
			url: "http://fr.search.yahoo.com/search?fr=ond__off&ei=utf-8&p={keyword}" },
		"ask": { title: "Ask.com",
			url: "http://fr.ask.com/web?q={keyword}" },
		"live": { title: "Live Search",
			url: "http://search.live.com/results.aspx?q={keyword}" },
		"exalead": { title: "Exalead",
			url: "http://www.exalead.fr/search/results?q={keyword}&%24mode=allweb" },
		"voila": { title: "Voila",
			url: "http://search.ke.voila.fr/S/voila?rtype=kw&rdata={keyword}&profil=voila" }
	}

}


Search.localeList["fr-fr"]["image"] = {

	"title": "Images",

	"items": {
		"google": { title: "Google", subtitle: " Images",
			url: "http://images.google.fr/images?hl=fr&q={keyword}&gbv=2" },
		"yahoo": { title: "Yahoo!", subtitle: " Images",
			url: "http://fr.search.yahoo.com/search/images?ei=UTF-8&fr=ond__off&p={keyword}" },
		"ask": { title: "Ask.com", subtitle: " Images",
			url: "http://fr.ask.com/pictures?q={keyword}&qsrc=2072&tool=img" },
		"live": { title: "Live Search", subtitle: " Images",
			url: "http://search.live.com/images/results.aspx?q={keyword}&FORM=BIRE" },
		"flickr": { title: "Flickr",
			url: "http://www.flickr.com/search/?q={keyword}" },
		"picsearch": { title: "PicSearch",
			url: "http://www.picsearch.fr/search.cgi?q={keyword}" }
	}
}


Search.localeList["fr-fr"]["news"] = {

	"title": "Actualités",

	"items": {
		"google": { title: "Google", subtitle: " News",
			url: "http://news.google.fr/news?hl=fr&ned=fr&q={keyword}" },
		"yahoo": { title: "Yahoo!", subtitle: " News",
			url: "http://fr.news.search.yahoo.com/news/search?p={keyword}" },
		"live": { title: "Live Search", subtitle: " News",
			url: "http://search.live.com/news/results.aspx?q={keyword}&FORM=BNRE" },
		"daypop": { title: "Daypop", subtitle: " News",
			url: "http://www.daypop.com/search?q={keyword}&t=n&ln=fr" },
		"alltheweb": { title: "AllTheWeb", subtitle: " News",
			url: "http://www.alltheweb.com/search?cat=news&cs=utf8&q={keyword}&rys=0&itag=crv&_sb_lang=fr" },
		"altavista": { title: "AltaVista", subtitle: " News",
			url: "http://www.altavista.com/news/results?q={keyword}&nc=0&nr=0&nd=2" }
	}

}


Search.localeList["fr-fr"]["blog"] = {

	"title": "Blogs",

	"items": {
		"google": { title: "Google", subtitle: " Blogs",
			url: "http://blogsearch.google.fr/blogsearch?ie=UTF8&oe=UTF-8&hl=fr&q={keyword}&om=1&z=4&tab=lb" },
		"ask": { title: "Ask.com", subtitle: " Blogs",
			url: "http://fr.ask.com/blogsearch?q={keyword}" },
		"technorati": { title: "Technorati",
			url: "http://technorati.com/search/{keyword}?language=fr&authority=n" },
		"feedster": { title: "Feedster",
			url: "http://www.feedster.com/search/{keyword}" }
	}

}


Search.localeList["fr-fr"]["reference"] = {

	"title": "Références",

	"items": {
		"dictionary": { title: "Dictionary.com",
			url: "http://dictionary.reference.com/browse/{keyword}" },
		"tv5": { title: "Dictionnaire TV5",
			url: "http://dictionnaire.tv5.org/dictionnaires.asp?Action=&param={keyword}&che=1" },
		"alexandria": { title: "Dictionnaire Alexandria",
			url: "http://www.tv5.org/TV5Site/alexandria/definition.php?sl=fr&tl=fr&ok.x=0&ok.y=0&ok=OK&terme={keyword}" },
		"wikipedia": { title: "Wikipédia",
			url: "http://fr.wikipedia.org/wiki/{keyword}" },
		"encarta": { title: "Encarta",
			url: "http://fr.encarta.msn.com/encnet/refpages/search.aspx?q={keyword}" },
		"britannica": { title: "Britannica",
			url: "http://www.britannica.com/search?query={keyword}" }
	}

}


Search.localeList["fr-fr"]["misc"] = {

	"title": "Divers",

	"items": {
		"google_groups": { title: "Google Groupes",
			url: "http://groups.google.fr/groups/search?q={keyword}" },
		"google_maps": { title: "Google Maps",
			url: "http://maps.google.fr/maps?ie=UTF-8&oe=UTF-8&hl=fr&q={keyword}&z=4&om=1&um=1&sa=N&tab=wl" },
		"amazon": { title: "Amazon",
			url: "http://www.amazon.fr/s/ref=nb_ss_gw/002-0555077-8828815?url=search-alias%3Daps&field-keywords={keyword}" },
		"ebay": { title: "eBay",
			url: "http://acheter.ebay.fr/{keyword}" },
		"youtube": { title: "YouTube",
			url: "http://www.youtube.com/results?search_query={keyword}" },
		"yahoo": { title: "Yahoo Questions Réponses", subtitle: "",
			url: "http://fr.answers.yahoo.com/search/search_result;_ylt=AlnxKjDWkwMepoT1FRXn2tgjzKIX?p={keyword}" }
	}

}
