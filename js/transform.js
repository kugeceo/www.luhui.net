;(function (W) {

	function importOldData() {
		var pageNum = 0;
		var maxNum = 108;
		var gridList = maxthon.browser.QuickAccessService.getList();
		var titleList = maxthon.browser.config.ConfigManager.get('maxthon.quickaccess', 'pageTitle').split(',');
		var isNewOpen = maxthon.browser.config.ConfigManager.get('maxthon.quickaccess', 'dialOpenMode');
		var lastIndex = 0;
		var layout = {
			version: 1, 
			page: [],
			option: {
				bgIndex: 0,
				isHideBlank: 0,
				isNewOpen: (isNewOpen == 1) ? 1 : 0, // 是否新页面打开
				thumbType: 2 //1抓图2色块
			}
		};
		var flushThumbList = [];
		var page;
		var grid;
		// 获取真实数据
		maxthon.browser.config.ConfigManager.set('maxthon.quickaccess', 'thumb.max', maxNum + '');
		lastIndex =  maxthon.browser.config.ConfigManager.get('maxthon.quickaccess', 'thumb.last.valid.index');
		lastIndex = parseInt(lastIndex);
		if (!isNaN(lastIndex)) {
			pageNum = Math.floor((lastIndex+1)/12) + ((lastIndex+1)%12 ? 1 : 0);
			maxNum = pageNum * 12;
			maxthon.browser.config.ConfigManager.set('maxthon.quickaccess', 'thumb.max', maxNum + '');
			gridList = maxthon.browser.QuickAccessService.getList();
		}
		// 是否导入内置数据
		if (pageNum == 0) {
			// 增加默认数据标示
			W.page_is_default = true;
			layout = importDefaultData(layout, pageNum);
		}
		else {
			// 转化用户第一页数据
			layout = transformFirstPageDate(layout, gridList.slice(0, 12), titleList[0]);
			// 进入刷新thumb队列
			gridList.slice(0, 12).forEach(function (grid) {
				flushThumbList.push(grid.url);
			});
			pageNum = Math.min(pageNum, W.PAGE_MAX_NUM);
			for (var i=1; i<pageNum; i++) {
				page = {
					title: titleList[i] || i+1+'',
					content: []
				};
				for (var j = i * 12; j < (i + 1) * 12; j++) {
					if (!gridList[j]) {
						continue;
					}
					grid = W.mxQA.api.newGridJson(1);
					grid.title = gridList[j].title || gridList[j].url;
					grid.url = gridList[j].url;
					grid.x = j % 4;
					grid.y = ((j % 12) / 4) >> 0;
					grid.guid = W.mxQA.api.getDefaultGridGuid(grid.url);
					if (grid.guid) {
						grid.thumbType = 0;
					}
					else {
						if (grid.url) {
							grid.thumbType = 2;
							flushThumbList.push(grid.url);
						}
						else {
							grid.thumbType = 0;
						}
					}
					page.content.push(grid);
				}
				if (page.content.length < W.page_size.w * W.page_size.h) {
					for (var m = 0; m < W.page_size.w; m++) {
						for (var n = 0; n < W.page_size.h; n++) {
							if (m < 4 && n < 3) {
								continue;
							}
							grid = W.mxQA.api.newGridJson(1);
							grid.x = m;
							grid.y = n;
							page.content.push(grid);
						}
					}
				}
				layout.page.splice(1 + i, 0, page);
			}
			if (flushThumbList.length) {
				W.flushThumbList = flushThumbList;
			}
			if (W.PAGE_MAX_NUM - pageNum) {
				layout = importWidgetData(layout, pageNum);
			}
		}
		return layout;
	}

	function importWidgetData(layout, pageNum) {
		var newsTemplateId = '014D851F-7275-4B8B-A14E-124387FFEFC7';
		var videoTemplateId = '574DE893-5737-4279-B28C-C060A44D7A38';
		var defaultData = W.page_template_data.defaultData;
		var news, video;

		defaultData.forEach(function(n) {
			var widget = n.content[0];
			if (widget.templateId == newsTemplateId) {
				news = W.mxQA.api.newGridJson(0);
				news.templateId = widget.templateId;
				news.templateDataId = widget.templateDataId;
				news.x = widget.x;
				news.y = widget.y;
				news.w = widget.w;
				news.h = widget.h;
				news = {
					title: n.title,
					content: [news]
				};
			} else if (widget.templateId == videoTemplateId) {
				video = W.mxQA.api.newGridJson(0);
				video.templateId = widget.templateId;
				video.templateDataId = widget.templateDataId;
				video.x = widget.x;
				video.y = widget.y;
				video.w = widget.w;
				video.h = widget.h;
				video = {
					title: n.title,
					content: [video]
				};
			}
		});

		if (news) {
			W.goToPage = pageNum;
			layout.page.push(news);
			if (W.PAGE_MAX_NUM - pageNum > 1 && video) {
				layout.page.push(video);
			}
		}

		return layout;
	}

	function transformFirstPageDate(layout, gridList, title) {
		var defaultData = W.page_template_data.defaultData;
		var page = {
			title: title || '1',
			content: []
		};
		var grid = W.mxQA.api.newGridJson(0);
		var tmp = defaultData[0].content[0];
		var saveData = function (gridList) {
			var arr = [];
			gridList.forEach(function (n) {
				arr.push({
					guid: W.mxQA.api.getDefaultGridGuid(n.url),
					//id: W.mxQA.api.newGuid(), 
					title: n.title,
					url: n.url,
					thumbType: typeof(n.thumbType)!='undefined' ?  n.thumbType : 2
				});
			});
			return arr;
		}
		// 预处理下用户数据，空的去掉
		for (var i=gridList.length-1; i>-1; i--) {
			if (!gridList[i].url) {
				gridList.splice(i, 1);
			}
		}

		// 导入搜索
		grid.templateId = tmp.templateId;
		grid.templateDataId = tmp.templateDataId;
		grid.x = tmp.x;
		grid.y = tmp.y;
		grid.w = tmp.w;
		grid.h = tmp.h;
		page.content.push(grid);
		// 导入第一个tmp widget
		if (gridList.length > 0) {
			grid = W.mxQA.api.newGridJson(0);
			grid.templateId = TMP_WIDGET_ID;
			// 存储数据
			tmp = W.mxQA.api.newGuid();
			W.mxQA.widgetAPI.setWidgetItem(tmp, saveData(gridList.slice(0, 6)));
			grid.templateDataId = tmp;
			grid.x = 0;
			grid.y = 1;
			grid.w = 2;
			grid.h = 2;
			page.content.push(grid);
		}
		// 补空grid
		else {
			for (var m=0; m<2; m++) {
				for (var n=1; n<3; n++) {
					grid = W.mxQA.api.newGridJson(1);
					grid.x = m;
					grid.y = n;
					page.content.push(grid);
				}
			}
		}
		// 导入第二个tmp widget
		if (gridList.length > 6) {
			grid = W.mxQA.api.newGridJson(0);
			grid.templateId = TMP_WIDGET_ID;
			// 存储数据
			tmp = W.mxQA.api.newGuid();
			W.mxQA.widgetAPI.setWidgetItem(tmp, saveData(gridList.slice(6, 12)));
			grid.templateDataId = tmp;
			grid.x = 2;
			grid.y = 1;
			grid.w = 2;
			grid.h = 2;
			page.content.push(grid);
		}
		// 补空grid
		else {
			for (var m=2; m<4; m++) {
				for (var n=1; n<3; n++) {
					grid = W.mxQA.api.newGridJson(1);
					grid.x = m;
					grid.y = n;
					page.content.push(grid);
				}
			}
		}
		layout.page.push(page);
		return layout;
	}

	function importDefaultData(layout, oldNum) {
		var defaultData = W.page_template_data.defaultData;
		var num = Math.min(defaultData.length, W.PAGE_MAX_NUM - oldNum);
		var page;
		var tmp;
		var grid;
		for (var i = 0; i < num; i++) {
			page = {
				title: defaultData[i].title,
				content: []
			};
			for (var j = 0; j < defaultData[i].content.length; j++) {
				tmp = defaultData[i].content[j];
				if (tmp.templateId) {
					grid = W.mxQA.api.newGridJson(0);
					grid.templateId = tmp.templateId;
					grid.templateDataId = tmp.templateDataId;
				}
				else {
					grid = W.mxQA.api.newGridJson(1);
					grid.title = tmp.title;
					grid.url = tmp.url;
					grid.guid = tmp.guid;
					grid.thumbType = 0;
				}
				grid.x = tmp.x;
				grid.y = tmp.y;
				grid.w = tmp.w;
				grid.h = tmp.h;
				page.content.push(grid);
			}
			if (page.content.length < W.page_size.w * W.page_size.h) {
				for (var m = 0; m < W.page_size.w; m++) {
					for (var n = 0; n < W.page_size.h; n++) {
						if (m < 4 && n < 3) {
							continue;
						}
						grid = W.mxQA.api.newGridJson(1);
						grid.x = m;
						grid.y = n;
						page.content.push(grid);
					}
				}
			}
			layout.page.push(page);
		}
		return layout;
	}

	W.mxQA = W.mxQA || {};
	W.mxQA.transform = {
		importOldData: importOldData
	};

})(window);