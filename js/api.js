/*
 * 数据接口
 */
;(function (W) {

	W.Language = maxthon.system.Language.load().locale;

	// 布局
	var layout = null;
	var tabService = new maxthon.browser.TabService();
	var noSyncData = JSON.parse(getItem('noSyncData') || '{}');

	// 新qa的同步存储
	function setItem(key, value) {
		if (value) {
			value = JSON.stringify(value);
		}
		try {
			maxthon.browser.QuickAccessService.setSyncValue(key, value);
		}
		catch (e) {
			console.error('setSyncValue', key, value, e);
		}
	}

	function getItem(key) {
		try {
			return maxthon.browser.QuickAccessService.getSyncValue(key);
		}
		catch (e) {
			console.error('getSyncValue', e);
			return '';
		}
	}

	// 新qa的不同步存储
	function setLocalItem(key, value) {
		noSyncData[key] = value;
		setItem('noSyncData', noSyncData);
	}

	function getLocalItem(key) {
		var value = noSyncData[key];
		return value === undefined? '': value;
	}

	// 老qa的同步存储 用这个存储是因为新qa的同步存储暂时有bug
    function getConfig(key) {
    	return maxthon.browser.config.ConfigManager.get('maxthon.quickaccess', 'qa_' + key);
    }

    function setConfig(key, value) {
    	maxthon.browser.config.ConfigManager.set('maxthon.quickaccess', 'qa_' + key, '' + value);
    }

	// LocalStorage存储 暂时不用因为有bug，在浏览器重启的时候有一定几率获取数据是空
    function getLocalStorage(key) {
    	var value = localStorage.getItem(key);
    	return value === null? '': value;
    }

    function setLocalStorage(key, value) {
    	localStorage.setItem(key, value);
    }

    function callbackFunc(callback, args) {
        if (callback && typeof(callback) == 'function') {
            callback.apply(this, args);
        }
    }

	/* 对内对外分割线 */
	function getWeather() {
		return layout.weather;
	}

	function setWeather(weather, sync) {
		layout.weather = weather;
    	sync && saveLayout();
	}

	function getOption() {
		var option = layout.option;
		option.isHideBlank = option.isHideBlank || 0;
		return option;
	}

	function getPageData() {
		var page = layout.page;
		// 处理脏数据
		for (var i = 0; i < page.length; i++) {
			if (!page[i]) {
				page.splice(i, 1);
			}
		}
		return page;
	}

	function getGridById(id) {
		var page = getPageData();
		var arr;
		for (var i = 0; i < page.length; i++) {
			arr = page[i]['content'];
			for (var j = 0; j < arr.length; j++) {
				if (arr[j].id == id) {
					return arr[j];
				}
			}
		}
		return null;
	}

	// return 0 空, 1 grid, 2 widget
	function getGridTypeById(id) {
		var grid = getGridById(id);
		if (!grid.templateId && !grid.templateDataId) {
			if (grid.url) {
				return 1;
			}
			return 0;
		}
		return 2;
	}

	function moveGrid(grid, fromIdx, toIdx) {
		var page = getPageData();
		for (var i = 0; i < grid.length; i++) {
			page[fromIdx]['content'].splice(page[fromIdx]['content'].indexOf(grid[i]), 1);
			page[toIdx]['content'].push(grid[i]);
		}
		saveLayout();
	}

	function editTab(id, gridData) {
		var grid = getGridById(id);
		var option = getOption();
		// 新格子需要设置thumbType
		if (!grid.url && grid.thumbType == 0) {
			grid.thumbType = option.thumbType;
		}
		// 设置属性
		if (!/^[a-zA-Z]+:\/\//.test(gridData.url) && !/^about:/gi.test(gridData.url)) {
			gridData.url = 'http://' + gridData.url;
		}
		gridData.url = W.mxQA.tool.disposeUrl(gridData.url);
		for (key in gridData) {
			if (gridData.hasOwnProperty(key)) {
				grid[key] = gridData[key];
			}
		}
		// 修改guid
		grid.guid = getDefaultGridGuid(grid.url);
		if (grid.guid) {
			grid.thumbType = 0;
		}
		saveLayout();
		// 刷图
		flushThumb(grid.url);
	}

	function newGuid() {
		var guid = W.maxthon.system.Utility.newGuid();
		guid = guid.substring(1, guid.length - 1);
		return guid;
	}

	// type: 1为grid, 0为widget
	function newGridJson(type) {
		var grid;
		grid = {
			id: newGuid(), // element id
			x: -1,
			y: -1,
			w: 1,
			h: 1
		};
		if (type == 1) {
			// 官方指定的guid, 修改或非官方的为null
			grid.guid = null;
			grid.url = '';
			grid.title = '';
			// 0预置1抓图2色块3自定义
			grid.thumbType = 0;
			// 预留
			grid.isEdit = 0;
		}
		else {
			grid.templateId = null;
			grid.templateDataId = null;
		}
		return grid;
	}

	function importOldData() {
		layout = W.mxQA.transform.importOldData();
		!page_is_default && saveLayout();
	}

	function initData(callback) {

		// 获取内置模板数据
		getTemplateData(W.PAGE_TEMPLATE_DATA_ID, function (data) {
			W.page_template_data = filterDataByPNAndProductTypeAndLang(data);

			layout = getItem(SYNC_KEY_QA);
			if (layout == '' || layout.toLocaleLowerCase() == 'null') {
				console.error(SYNC_KEY_QA, '"" || null');
				importOldData();
			} else {

				try {
					layout = JSON.parse(layout);
				} catch(e) {
					console.error(SYNC_KEY_QA, 'format error', e);
					try {
						layout = JSON.parse(getItem(SYNC_KEY_QA_OLD));
						saveLayout();
					} catch(e) {
						console.error(SYNC_KEY_QA_OLD, 'format error', e);
						importOldData();
					}
				}

				// 试探是否有用户数据
				maxthon.browser.config.ConfigManager.set('maxthon.quickaccess', 'thumb.max', '108');
				var validIdx = parseInt(maxthon.browser.config.ConfigManager.get('maxthon.quickaccess', 'thumb.last.valid.index'));

				if (!layout.page || !layout.page.length || (page_is_default && !isNaN(validIdx))) {
					ueip('ui', '', 'impordata', '', '', '', '');
					importOldData();
				}
			}

			!page_is_default && setItem(SYNC_KEY_QA_OLD, layout); // 每次都备份格式正确的数据
			callback && callback();
		});
	}

	function saveLayout() {
		// 避免账户信息未刷新
		if (W.current_user_id != getCurrentAccount().id) {
			return;
		}
		page_is_default = false;
		setItem(SYNC_KEY_QA, layout);
	}

	function getTemplateFrame(guid, cb) {
		$.ajax({
			url: buildTemplateUrl(guid, 'config.json', 'frame'),
			dataType: 'json'
		}).done(function (data) {
			callbackFunc(cb, [data]);
		}).fail(function (xhr, error) {
			console.error('getTemplateFrame', error, xhr.responseText);
			if (error != 'parsererror') {
				flushTemplateData(guid);
			}
		});
	}

	function getTemplateData(guid, cb) {
		$.ajax({
			url: buildTemplateUrl(guid, 'data.json', 'data'),
			dataType: 'json'
		}).done(function (data) {
			callbackFunc(cb, [data]);
		}).fail(function (xhr, error) {
			console.error('getTemplateData', error, xhr.responseText);
			if (error != 'parsererror') {
				flushTemplateData(guid);
			}
		});
	}

	function getTabList() {
		var list = tabService.getOpenedTabInfos();
		var tab = tabService.getActiveTabInfo();
		for (var i = 0; i < list.length; i++) {
			if (list[i].url == tab.url) {
				list.splice(i--, 1);
			}
		}
		return list;
	}

	function getTopVisitedList(callback, errorCallback) {
		try {
			maxthon.browser.history.HistoryManager.getTopVisitedList('cb', 10, callback);
		} catch (e) {
			errorCallback();
		}
	}

	// 判断是否是链接
	function isValidUrl(url) {
		if (!url || typeof(url) != 'string') {
			return false;
		}
		try {
			return maxthon.browser.QuickAccessService.isValidUrl(url);
		}
		catch (e) {
			console.error('isValidUrl', e);
			return false;
		}
	}

    function buildTemplateUrl(guid, file, type) {
    	var prefix = 'mx://res/quick-access/template/';
    	var url = prefix + file + '?guid=' + guid + '&type=' + type + '&stamp=' + Date.now();
    	return url;
    }

    function switchThumbType(to) {
    	var from = 3 - to;
    	var option = layout.option;
    	var page = getPageData();
    	layout.option.thumbType = to;
    	for (var i = 0; i < page.length; i++) {
    		var data = page[i].content;
    		for (var j = 0; j < data.length; j++) {
    			var tmp = data[j];
    			if (tmp.thumbType == from) {
	    			tmp.thumbType = to;
	    		}
    		}
    	}
    	saveLayout();
    }

    function switchOpen(type, value) {
    	var option = layout.option;
    	option[type] = value;
    	saveLayout();
    }

    function popGridMenu(x, y, isTab, isDisabled, templateId, templateDataId) {
        var listData = [];
        var result;
        if (isTab == undefined) {
        	isTab = true;
        }
        if (isTab) {
	        // listData.push({id: 'open-tab', label: getLang('Open'), disabled: !isTab});
	        // listData.push({type: 'separator'});
	        listData.push({id: 'edit-tab', label: getLang('Edit'), disabled: !isTab});
        }
        if (templateId == TMP_WIDGET_ID) {
			var widget = W.mxQA.widgetAPI.getWidgetItem(templateDataId);
			var isFull = W.mxQA.logic.isFullWidget(templateDataId);
			var isNull = !widget.length;
        	listData.push({id: 'add-url', label: getLang('addUrl'), disabled: isFull});
        	listData.push({id: 'sort-widget', label: getLang('Sort'), disabled: isNull});
        	listData.push({id: 'flush-widget', label: getLang('Flush'), disabled: isNull});
        	listData.push({id: 'delete-widget', label: getLang('DismissWidget'), disabled: false});
        }
        else {
	        listData.push({id: 'flush-grid', label: getLang('Flush'), disabled: isDisabled});
	        listData.push({id: 'delete-grid', label: (isTab ? getLang('Delete') : getLang('DeleteWidget'))});
        }
		result = maxthon.system.NativeMenu.popup(x, y, listData);
		return result;
    }

    function popNavMenu(x, y) {
        var listData = [];
        listData.push({id: 'rename-nav', label: getLang('Rename')});
        listData.push({id: 'delete-nav', label: getLang('Delete')});
		var result = maxthon.system.NativeMenu.popup(x, y, listData);
		return result;
    }

    function addNewPage(gridList, pageTitle) {
    	var page = getPageData();
    	var newPage = {
    		title: pageTitle || getLang('BlankPage'),
    		content: []
    	};
		var grid;
		var len = W.page_size.w * W.page_size.h;
		for (i = 0; i < len; i++) {
			grid = newGridJson(1);
			grid.x = i % W.page_size.w;
			grid.y = (i / W.page_size.w) >> 0;
			grid.thumbType = 0;
			// 如果gridList对应数据存在
			if (gridList && gridList[i] && gridList[i].url) {
				grid.guid = gridList[i].guid;
				grid.title = gridList[i].title;
				grid.url = gridList[i].url;
				grid.thumbType = gridList[i].thumbType;
			}
			newPage.content.push(grid);
		}
		if (page.length < W.PAGE_MAX_NUM) {
			page.push(newPage);
			saveLayout();
		}
		return page;
    }

    function deletePageByIdx(idx) {
    	var page = getPageData();
    	if (page.length > 1) {
	    	page.splice(idx, 1);
	    	saveLayout();
    	}
    	return page.length;
    }

    function modifyNavTitle(idx, title) {
    	var page = getPageData();
    	if (page[idx]) {
    		page[idx].title = title;
    	}
    	saveLayout();
    }

    function deleteGridById(id) {
    	var page = getPageData();
    	var grid = getGridById(id);
    	var type = getGridTypeById(id);
    	var result = [];
    	var curPageArr;
    	var emptyGrid;
    	switch (getGridTypeById(id)) {
    	case 1:
			grid.guid = null;
			grid.url = '';
			grid.title = '';
			grid.thumbType = 0;
			result.push(id);
    		break;
    	case 2:
			for (var i = 0; i < page.length; i++) {
				curPageArr = page[i].content;
				if (curPageArr.indexOf(grid) > -1) {
					for (var x = grid.x; x < grid.x + grid.w; x++) {
						for (var y = grid.y; y < grid.y + grid.h; y++) {
							emptyGrid = newGridJson(1);
							emptyGrid.x = x;
							emptyGrid.y = y;
							result.push(emptyGrid.id);
							curPageArr.push(emptyGrid);
						}
					}
					curPageArr.splice(curPageArr.indexOf(grid), 1);
					break;
				}
			}
    		break;
    	}
    	saveLayout();
    	return result;
    }

    function isThumbExisted(url) {
    	try {
    		return maxthon.browser.QuickAccessService.isThumbExisted(url);
    	}
    	catch (e) {
    		return false;
    	}
    }

	function getThumbUrl(url) {
		return 'mx://thumbs/?reflush=0&stamp=' + Date.now() + '&url=' + url;
	}

    function flushThumb(url, reflush) {
    	if (!url) return;
    	reflush = reflush || 0;
    	try {
    		url = url.trim();
console.log('flushThumb', url, reflush);
			maxthon.browser.QuickAccessService.flushThumb(url, reflush);
    	}
    	catch (e) {
    		console.error('flushThumb', url, e);
    	}
    }

    function getImgDialog() {
    	try {
	        var dialog = new maxthon.widgets.FileDialog('open');
	        dialog.setFilterExtensions(['*.jpg;*.gif;*.jpeg;*.png']);
	        dialog.setFilterNames(['PNG,JPG,GIF,JPEG']);
	        dialog.setFilterIndex(0);
	        return dialog;
    	}
    	catch (e) {
    		console.error('FileDialog', e);
    		return null;
    	}
    }

    function saveBackgroundImage(path, size) {
    	try {
    		return maxthon.browser.QuickAccessService.saveBackgroundImage(path, size);
    	}
    	catch (e) {
    		console.error('saveBackgroundImage', e);
    		return null;
    	}
    }

    function getAverageRGBColor(path) {
    	var colorObj;
    	var color;
    	try {
    		colorObj = maxthon.system.Utility.getAverageRGBColorOfImage(path);
    		color = 'rgb(' + colorObj.red +', ' + colorObj.green + ', ' + colorObj.blue + ')';
    	}
    	catch (e) {
    		console.error('getAverageRGBColor', path, e);
    		color = 'rgb(255, 255, 255)';
    	}
    	return color;
    }

    function getDefaultGridGuid(url) {
    	if (W.page_template_data) {
    		var objArr = W.page_template_data.grid;
    		for (var i = 0; i< objArr.length; i++) {
    			var gridArr = objArr[i].content;
    			for (var j = 0; j < gridArr.length; j++) {
    				if (gridArr[j].url.toLocaleLowerCase() == url.toLocaleLowerCase()) {
    					return gridArr[j].guid;
    				}
    			}
    		}
    		return null;
    	}
    	return null;
    }

    function flushTemplateData(templateDataId) {
    	try {
    		maxthon.browser.QuickAccessService.flushTemplateData(templateDataId);
    	}
    	catch (e) {
    		console.error('flushTemplateData', e);
    	}
    }

    function addGridForWidget(pageIdx, gridArr, gridData) {
    	var page = getPageData();
    	var curPage = page[pageIdx].content;
    	var grid = newGridJson(0);
		for (key in gridData) {
			if (gridData.hasOwnProperty(key)) {
				grid[key] = gridData[key];
			}
		}
		// 删除旧grid
    	gridArr.forEach(function (n) {
    		curPage.splice(curPage.indexOf(n), 1);
    	});
    	// 添加
    	curPage.push(grid);
    	saveLayout();
    	return grid;
    }

    function getLang(key) {
    	var val;
    	try {
    		val = W.mxQA.lang[key][Language];
    		if (val === undefined) {
    			val = key;
    		}
			return val;
    	}
    	catch (e) {
    		return key;
    	}
    }

    function getCustomBGPath() {
    	var email = getLocalItem(W.USER_EAMIL);
    	var suffix = getLocalItem(W.CUSTOM_BACKGROUND_SIGN);

    	try {
	    	var path = maxthon.system.Environment.getFolderPath('Mx3data');
	    	if (email) {
	    		path += 'Users/' + email + '/QuickAccess/background' + suffix;
	    	} else {
	    		// 兼容老版
	    		path += 'Public/QuickAccess/background' + suffix;
	    	}
    		return path.replace(/\\/g, '/') ;
    	}
    	catch (e) {
    		console.error('getFolderPath', e);
    		return '';
    	}
    }

    function ueip(dt, dr, m, n, o, p, data) {
    	var pt = 'quickaccess';
    	dt = dt || '';
    	dr = dr || '';
    	m = m || '';
    	n = n || '';
    	o = o || '';
    	p = p || '';
    	data = data || '';
    	maxthon.browser.UeipService.set2(pt, dt, dr, m, n, o, p, data);
    }

    function filterDataByPNAndProductTypeAndLang(data) {
    	var pn = external.GetPN();
    	var pType = external.mxProductType;
    	var guid = data.guid;

    	// 新数据兼容老数据
    	if (data.default) {
    		// 按渠道
    		if (data.pnList[pn]) {
	    		$.each(data.pnList[pn], function(lang, langData) {
	    			data.default[lang].defaultData = langData.defaultData;
	    		});
    		}
    		data = data.default;
    	}

    	if (pType == 'zh-cn') {
    		data = data['zh-cn'];
    	} else {
    		data = data[Language] || data['en'];
    	}

	  	data.guid = guid;
    	return data;
    }

    function getCurrentAccount() {
    	return maxthon.account.AccountService.getBrowserCurrentAccountInfo();
    }

    function getTabByAddress() {
    	try {
    		var arr = JSON.parse(getItem('address_add_qa') || '[]');
    		return arr;
    	}
    	catch (e) {
    		console.error('getTabByAddress', getItem('address_add_qa'), e);
    	}
    }

    function clearTabByAddress() {
    	try {
    		setItem('address_add_qa', []);
    	}
    	catch (e) {
    		console.error('clearTabByAddress', e);
    	}
    }

    function isBlankPage(index) {
    	var page = layout.page[index];
    	return page.content.every(function (n) {
    		if (n.url == '' && n.thumbType == 0) {
    			return true;
    		}
    	});
    }

    function replacePageContent(index, gridList, title) {
    	var page = getPageData();
    	if (!gridList || gridList.length == 0) {
    		return page;
    	}
    	var length = gridList.length;
    	var rPage = page[index];
    	rPage.title = title || rPage.title;
    	rPage.content = rPage.content.map(function (n, i) {
    		var uiIndex = n.y * page_size.w + n.x;
    		if (uiIndex < length) {
    			var grid = gridList[uiIndex];
    			n.guid = grid.guid;
    			n.title = grid.title;
    			n.url = grid.url;
    			n.thumbType = grid.thumbType;
    		}
    		return n;
    	});
    	saveLayout();
    	return page;
    }

	function getPageIdxById(id) {
		var page = getPageData();
		var arr;
		for (var i = 0; i < page.length; i++) {
			arr = page[i]['content'];
			for (var j = 0; j < arr.length; j++) {
				if (arr[j].id == id) {
					return i;
				}
			}
		}
		return -1;
	}

	function getPageIdxByTid(tid) {
		var page = getPageData();
		var arr;
		for (var i = 0; i < page.length; i++) {
			arr = page[i]['content'];
			for (var j = 0; j < arr.length; j++) {
				if (arr[j].templateId && arr[j].templateId == tid) {
					return i;
				}
			}
		}
		return -1;
	}

	function getKernelMode() {
		return maxthon.system.Utility.getKernelMode()
	}

	function isExistWidget(guid) {
		var page = getPageData();
		var arr;
		for (var i = 0; i < page.length; i++) {
			arr = page[i]['content'];
			for (var j = 0; j < arr.length; j++) {
				if (arr[j].templateId && arr[j].templateId == guid) {
					return true;
				}
			}
		}
		return false;
	}

	function getFavRootChilds() {
    	try {
			return maxthon.browser.favorites.FavManager.root.childNodes;
    	}
    	catch (e) {
    		console.error('getFavRootChilds', e);
    		return [];
    	}
	}

	function getFavItemChildsById(id) {
    	try {
			return maxthon.browser.favorites.FavManager.root.getNodeById(id).childNodes;
    	}
    	catch (e) {
    		console.error('getFavItemChildsById', e);
    		return [];
    	}
	}

	function isZhCn() {
    	return external.mxProductType == 'zh-cn' || Language == 'zh-cn';
	}

	W.mxQA = W.mxQA || {};
	W.mxQA.api = {
		setItem: setItem,
		getItem: getItem,
		setLocalItem: setLocalItem, 
		getLocalItem: getLocalItem, 
		getWeather: getWeather, 
		setWeather: setWeather, 
		getOption: getOption,
		getPageData: getPageData,
		getGridById: getGridById,
		getGridTypeById: getGridTypeById,
		moveGrid: moveGrid,
		editTab: editTab,
		newGuid: newGuid,
		newGridJson: newGridJson,
		initData: initData,
		saveLayout: saveLayout,
		getTemplateFrame: getTemplateFrame,
		getTemplateData: getTemplateData,
		getTabList: getTabList,
		isValidUrl: isValidUrl,
		buildTemplateUrl: buildTemplateUrl,
		getConfig: getConfig, 
		setConfig: setConfig, 
		getLocalStorage: getLocalStorage,
		setLocalStorage: setLocalStorage,
		switchThumbType: switchThumbType,
		switchOpen: switchOpen,
		popGridMenu: popGridMenu,
		popNavMenu: popNavMenu,
		addNewPage: addNewPage,
		deletePageByIdx: deletePageByIdx,
		modifyNavTitle: modifyNavTitle,
		deleteGridById: deleteGridById,
		isThumbExisted: isThumbExisted,
		getThumbUrl: getThumbUrl,
		flushThumb: flushThumb,
		getImgDialog: getImgDialog,
		saveBackgroundImage: saveBackgroundImage,
		getAverageRGBColor: getAverageRGBColor,
		getDefaultGridGuid: getDefaultGridGuid,
		flushTemplateData: flushTemplateData,
		addGridForWidget: addGridForWidget,
		getLang: getLang,
		getCustomBGPath: getCustomBGPath,
		ueip: ueip,
		filterDataByPNAndProductTypeAndLang: filterDataByPNAndProductTypeAndLang,
		getCurrentAccount: getCurrentAccount,
		getTabByAddress: getTabByAddress,
		clearTabByAddress: clearTabByAddress,
		isBlankPage: isBlankPage,
		replacePageContent: replacePageContent,
		getPageIdxById: getPageIdxById, 
		getPageIdxByTid: getPageIdxByTid, 
		getKernelMode: getKernelMode, 
		isExistWidget: isExistWidget, 
		getTopVisitedList: getTopVisitedList, 
		getFavRootChilds: getFavRootChilds, 
		getFavItemChildsById: getFavItemChildsById, 
		isZhCn: isZhCn
	};

})(window);