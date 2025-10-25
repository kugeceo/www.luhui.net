/*
 * 页面的初始化
 */

;(function (W) {

	W.current_user_id = W.mxQA.api.getCurrentAccount().id;

	// 初始化数据
	W.mxQA.api.initData(function () {

		// 初始化页面背景
		W.mxQA.logic.initOption(true);
		// 初始化widget侧边栏
		W.mxQA.logic.initWidgetSidebar();
		// 获取widget数据
		W.mxQA.widgetAPI.getWidgetData();
		// 初始化首屏内容
		W.mxQA.logic.initPage();
		// 元素布局定位
		W.mxQA.logic.initPosition();

		// 延迟
		setTimeout(function() {

			// 加载延迟数据
			W.mxQA.logic.initPageDelay();
			// 元素布局定位
			W.mxQA.logic.initPosition(true);
			// 初始化天气
			W.mxQA.logic.initWeather();
			// 初始化添加界面
			W.mxQA.logic.initGridAdd();
			// 初始化设置界面
			W.mxQA.logic.initOption();
			// 其他
			W.mxQA.logic.initOther();

		}, 500);
	});

	// 初始化页面基本信息
	W.mxQA.logic.initBase();

	// 引导页
	(function () {
		var guide = $('#guide');
		var bgUrl = 'img/guide';
		var key = 'qa_guide';
		var suffix;

		if (W.mxQA.api.getConfig(key) == '1' || W.mxQA.api.getKernelMode() !== 0) return;
		W.mxQA.api.setConfig(key, '1');

    	if (external.mxProductType == 'zh-cn') {
    		suffix = '.jpg';
    	} else {
    		suffix = Language == 'zh-cn' ? '.jpg' : '_en.jpg';
    	}

		bgUrl += (W.current_user_id == 0? '_new': '') + suffix;

		guide.css({'background-image': 'url(' + bgUrl + ')'}).show();
	})();

})(window);