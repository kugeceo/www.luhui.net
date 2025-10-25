/*
 * 逻辑类, 共用的逻辑提取出来
 */

;(function (W) {

	var main_bg = $('#main-bg');
	var bg_left = 0;
	var grid_add = $('#grid-add');

	function slideBackground() {
		if (W.page_idx > Math.abs(W.SILDE_MAX / W.SILDE_VAL)) {
			return;
		}
		bg_left = - W.SILDE_VAL * W.page_idx;
		main_bg.css({'webkit-transform': 'translateX(' + bg_left + 'px)'});
	}

	function slidePage(val, isGoto) {
		// 防止频繁触发
		if (!W.slide_sign && !isGoto) {
			return;
		}
		W.slide_sign = false;
		// 防止字符串
		val = val - 0;
		var pages = $('.page');
		var len = pages.length;
		// prev page idx
		var prevIdx = W.page_idx;
		if (isGoto) {
			W.page_idx = val;
		} else {
			W.page_idx += val;
		}
		W.page_idx = (W.page_idx < 0) ? 0 : ((W.page_idx >= len) ? len - 1: W.page_idx);
		// 背景滚动
		//slideBackground();
		// 需要的页才加动画效果
		$('.page[idx="' + prevIdx + '"]').addClass('slide');
		$('.page[idx="' + W.page_idx + '"]').addClass('slide');
		// 防止故意调小浏览器尺寸
		var width = Math.max(W.window_width, W.page_size.w * W.GRID_SIZE[W.grid_type].w);
		pages.each(function (i, n) {
			n = $(n);
			if (n.attr('idx') < W.page_idx) {
				n.css({left: -width});
			} else if (n.attr('idx') == W.page_idx) {
				n.css({left: 0});
			} else {
				n.css({left: width});
			}
		});
		setTimeout(function () {
			W.slide_sign = true;
			$('.slide').removeClass('slide');
		}, 500);
		// 是否显示左右翻页按钮
		var sliderLeft = $('#slider-left');
		var sliderRight = $('#slider-right');
		if (W.page_idx == 0) {
			sliderLeft.hide();
		} else {
			sliderLeft.show();
		}
		if (W.page_idx == len - 1) {
			sliderRight.hide();
		} else {
			sliderRight.show();
		}
		// 变更nav样式
		$('.grid-nav[idx="' + W.page_idx + '"]').addClass('current').siblings().removeClass('current');

		// widget侧边栏去掉小红点儿
		var pageData = mxQA.api.getPageData();
		var grid = pageData[page_idx].content[0];
		if (grid && grid.templateId && grid.w == 4 && grid.h == 3) {
			$('#widget-sidebar li[tid=' + grid.templateId + ']').removeClass('mark');
			mxQA.api.setLocalItem('widget-sidebar-' + grid.templateId, '1');
		}
	}

	function initBase() {
		// 重置设置页面宽高
		W.window_width = $(W).width();
		W.window_height = $(W).height();
		// 判断grid的size
		if (W.window_width < W.WINDOW_STANDARD['S'].w ||
				W.window_height < W.WINDOW_STANDARD['S'].h) {
			W.grid_type = 'S';
		}
		else if (W.window_width > W.WINDOW_STANDARD['L'].w &&
				W.window_height > W.WINDOW_STANDARD['L'].h) {
			W.grid_type = 'L';
		}
		else {
			W.grid_type = 'M';
		}
		// 设置位移值
		var gridSize = W.GRID_SIZE[W.grid_type];
		W.page_left = (W.window_width - gridSize.w * W.page_size.w) / 2 >> 0;
		W.page_top = (W.window_height - gridSize.h * W.page_size.h - 30) / 2 >> 0;
	}

	function initPageDelay() {
		var str = '', idx = 1;
		var page = W.mxQA.api.getPageData();
		while (idx < page.length) {
			str += W.mxQA.tool.buildPageHtml(page[idx].content, idx);
			idx++;
		}
		$('#page-area').append(str);

		// 批量刷新thumb
		if (W.flushThumbList) {
			W.flushThumbList.forEach(function (n) {
				W.mxQA.api.flushThumb(n);
			});
		}
	}

	function initPage() {
		var page = W.mxQA.api.getPageData();
		$('#page-area').append(W.mxQA.tool.buildPageHtml(page[0].content, 0));

		// 导航
		var str = '';
		for (var i = 0; i < page.length; i++) {
			str += W.mxQA.tool.buildNavHtml(page[i].title, i);
		}
		str += '<a class="add-nav">&nbsp;</a>';

		// 推荐widget
		var widgetData = page_template_data.widget.recommendWidget;
		var oldWidgetGuid = mxQA.api.getConfig(RECOMMEND_WIDGET_ID);

		if (widgetData && widgetData.guid && widgetData.guid != oldWidgetGuid && !mxQA.api.isExistWidget(widgetData.guid)) {
			str += '<div id="recommend-widget">' + 
    			'<span></span>' + 
			    '<img src="' + W.mxQA.api.buildTemplateUrl(PAGE_TEMPLATE_DATA_ID, widgetData.thumb, 'data') + '" />' + 
			    '<p>' + widgetData.desc + '</p>' + 
			    '<a href="#">' + W.mxQA.api.getLang('TryNow') + '</a>' + 
			'</div>';
		}

		$('#page-nav').html(str);
	}

	function initPosition(noFirstPage) {
		// 格子页的左上角定位
		var ul = $('.page > ul');
		ul.css({left: W.page_left, top: W.page_top});

		// 格子重新布局
		ul.each(function (i, ul) {
			if (noFirstPage && i == 0) return;
			$(ul).find('> li').each(function (j, n) {
				W.mxQA.tool.resizeGrid(n, W.mxQA.api.getGridById(n.id));
			});
		});
		// 各页的隐藏显示
		var pages = $('.page');
		var width = Math.max(W.window_width, W.page_size.w * W.GRID_SIZE[W.grid_type].w);
		pages.each(function (m, n) {
			var i = $(n).attr('idx');
			if (i < W.page_idx) {
				$(n).css({left: -width});
			}
			else if (i == W.page_idx) {
				$(n).css({left: 0, opacity: 1});
			}
			else {
				$(n).css({left: width});
			}
		});

		//widget sidebar
		$('#widget-sidebar').css({left: W.page_left - 80});

		// nav
		initNavPosition();
	}

	function initNavPosition() {
		var pageNav = $('#page-nav');
		var navW = W.GRID_SIZE[W.grid_type].navW;
		pageNav.find('.grid-nav').css({width: navW});
		pageNav.css({left: (W.window_width - pageNav.width()) / 2 >> 0});
	}

	function initWidgetSidebar() {
    	if (!mxQA.api.isZhCn()) return;

		$('#widget-sidebar').append('<div><ul>' + 
	        '<li tid="014D851F-7275-4B8B-A14E-124387FFEFC7"><img src="img/widget-sidebar-xinwen.png" /><br />新闻</li>' + 
	        '<li tid="41EE49E9-7CF4-4622-822B-7F24DAAE3194"><img src="img/widget-sidebar-shipin.png" /><br />视频</li>' + 
	        '<li tid="574DE893-5737-4279-B28C-C060A44D7A38"><img src="img/widget-sidebar-weishi.png" /><br />微视</li>' + 
	        '<li tid="11C67C80-0319-4BD0-8E95-49EFEF5DE42D"><img src="img/widget-sidebar-gouwu.png" /><br />购物</li>' + 
	    '</ul><span>更多</span></div>');

	    $('#widget-sidebar li').each(function(i, node) {
	    	var that = $(node);
	    	if (mxQA.api.getLocalItem('widget-sidebar-' + that.attr('tid')) !== '1') {
	    		that.addClass('mark');
	    	}
	    });
	}

	function initWeather() {
    	mxQA.api.isZhCn() && mxQA.weather.init($('#lang-div'));
	}

	function initOther() {

		// 右翻页按钮显示
		var pages = $('.page');
		var len = pages.length;
		if (W.page_idx < len-1) {
			$('#slider-right').show();
		}

		// 重新定位option
		var rect = $('#tab-sync')[0].getBoundingClientRect();
		$('#option-btn').css('left', rect.left - 31).show();
		$('#option-div').css('left', rect.left - 323);

		// 跳到指定页面，导入用户数据时，跳到指定的页面
		if (W.goToPage) {
			$('#page-nav .grid-nav:eq(' + W.goToPage + ')').click();
		}

		// ueip
		var option = W.mxQA.api.getOption();
		var page = W.mxQA.api.getPageData();
		var o = W.mxQA.api.getLocalItem(W.CUSTOM_BACKGROUND_SIGN) ? '-1' : ''+option.bgIndex;
		var tickbox = '';
		var data = {};
		var tabNum;
		var wArr;
		var grid;

		$('#option-checkbox input[type=checkbox]').each(function (i, item) {
			if (item.checked) {
				tickbox += item.id.slice(7) + '/';
			}
		});

		for (var i = 0; i < page.length; i++) {
			tabNum = 0;
			wArr = [];
			for (var j = 0; j < page[i].content.length; j++) {
				grid = page[i].content[j];
				if (grid.templateId && grid.templateDataId) {
					wArr.push(grid.templateId);
				}
				else if (grid.url) {
					tabNum++;
				}
			}
			data[i] = {
				name: page[i].title,
				nonemptytiles: tabNum,
				widgets: wArr.join(',')
			};
		}
		W.mxQA.api.ueip('users', '', 'stats', ''+option.thumbType, o, tickbox, JSON.stringify(data));

		// address add
		W.mxQA.logic.addTabByAddress();

		// update
		W.mxQA.logic.tabUpdate();

		// 轮播
		(function() {
    		if (!mxQA.api.isZhCn() || !!W.mxQA.api.getOption().isHidWidgetSidebar) return;

			var list = [], map = {}, 
				nav = $('#page-nav a'), 
				node = $('#widget-sidebar li'), 
				page = W.mxQA.api.getPageData();

			node.each(function(i, n) {
				map[$(n).attr('tid')] = i;
			});

			page.forEach(function(obj, i) {
				obj = obj.content[0];
				if (obj.templateId && typeof map[obj.templateId] === 'number') {
					list.push({
						m: map[obj.templateId], 
						i: i
					});
					delete map[obj.templateId];
				}
			});

        	var length = list.length, time = 5000, timer;

        	if (length < 2) return;

	        function go(i) {
	            timer = setTimeout(function() {
	            	nav.eq(list[i].i).click()
	            	node.removeClass('hover').eq(list[i].m).addClass('hover');
	                //go(i >= length - 1? 0: ++i); 无限轮播

	                // 轮播一次后返回首页
	            	if (i >= length - 1) {
	            		timer = setTimeout(function() {
	            			stop();
			            	nav.eq(0).click();
	            		}, time);
	            	} else {
		                go(++i);
	            	}
	            }, time);
	        }

	        function stop() {
	        	node.removeClass('hover');
	        	clearTimeout(timer);
	        }

	        go(page[0].content[0].templateId && page[0].content[0].templateId == node.eq(0).attr('tid')? 1: 0);

	        $('#widget-sidebar, #slider-left, #slider-right').one('click', stop);

	        $('#option-hide-widget-sidebar').one('change', stop);

	        $('#page-nav, #page-area ul').one('mouseover', stop);

	        $(document).one('mousewheel', stop);

			W.mxQA.api.ueip('users', '', 'qsidebarroll', '1', '', '', '');

		})();

	}

	/*
	 * 返回可交换格子的信息
	 * id  : drag grid id
	 * x, y: drag gird类似左上角的坐标
	 * return {
	 *     swapArr: swap grid id数组
	 *     x, y   : grid list的相对坐标
	 * }
	 */
	function getSwapMessage(id, x, y) {
		var tmp;
		var swapArr = [];
		var gridSize = W.GRID_SIZE[W.grid_type];
		// 转化成页的grid下标
		x = (x > 0) ? (x / gridSize.w >> 0) : -1;
		y = (y > 0) ? (y / gridSize.h >> 0) : -1;
		// 拖拽的位置是否超边界
		if (x < 0 || y < 0 || x >= W.page_size.w || y >= W.page_size.h) {
			return null;
		}
		// 取当前page的grid
		var page = W.mxQA.api.getPageData()[W.page_idx];
		// drag grid
		var dg = W.mxQA.api.getGridById(id);
		/* 为了效率, 1*1走特殊判断流程 */
		if (dg.w == 1 && dg.h == 1) {
			for (var i = 0; i < page['content'].length; i++) {
				tmp = page['content'][i];
				if (tmp.x == x && tmp.y == y && tmp.w == 1 && tmp.h == 1 && tmp.id != dg.id) {
					return {arr: [tmp.id], x: x, y: y};
				}
			}
			return null;
		}
		/* 非1*1流程 */
		// 摆放的位置是否超边界
		var tmpX = x + 1 * dg.w - 1;
		var tmpY = y + 1 * dg.h - 1;
		if (tmpX < 0 || tmpY < 0 || tmpX >= W.page_size.w || tmpY >= W.page_size.h) {
			return null;
		}
		// 所涉及到的unit grid
		var dgArr = W.mxQA.tool.buildUnitArr(x, y, tmpX, tmpY);
		// 遍历该页grid判断是否可交换
		var sign;
		for (var i = 0; i < page['content'].length; i++) {
			tmp = page['content'][i];
			// 剔除自己
			if (tmp.id == dg.id) {
				continue;
			}
			sign = W.mxQA.tool.validateGrid(dgArr,
				W.mxQA.tool.buildUnitArr(tmp.x, tmp.y, tmp.x + tmp.w - 1, tmp.y + tmp.h - 1)
			);
			if (sign == 2) {
				return null;
			}
			else if (sign == 1) {
				swapArr.push(page['content'][i].id);
			}
		}
		return {arr: swapArr, x: x, y: y};
	}

	/*
	 * 交换格子
	 * dragId : drag grid id
	 * swapIds: swap grid ids
	 * x, y   : grid list的相对坐标
	 * dragIdx: 拖拽页的idx
	 * pageIdx: 当前页的idx
	 * return {
	 *     dg: drag grid
	 *     sg: swap grid数组
	 * }
	 */
	function swapGrid(dragId, swapIds, x, y, dragIdx, pageIdx) {
		// 可供交换的单元格数组(drag+swap)
		var unitArr = [];
		// swap grid
		var sg = [];
		// drag grid
		var dg = W.mxQA.api.getGridById(dragId);
		unitArr = unitArr.concat(
			W.mxQA.tool.buildUnitArr(dg.x, dg.y, dg.x + dg.w - 1, dg.y + dg.h - 1)
		);

		// swapIds按照UIindex从新排序
		var swapIdsCache = [];
		swapIds.forEach(function(n, i) {
			swapIds[i] = n = W.mxQA.api.getGridById(n);
			swapIdsCache[(n.y * page_size.w + n.x) >> 0] = n;
		});
		swapIds = [];
		swapIdsCache.forEach(function(n, i) {
			n && swapIds.push(n);
		});

		for (var i = 0; i < swapIds.length; i++) {
			unitArr = unitArr.concat(
				W.mxQA.tool.buildUnitArr(swapIds[i].x, swapIds[i].y, swapIds[i].x + swapIds[i].w - 1, swapIds[i].y + swapIds[i].h - 1)
			);
			// 高度大, 体积大的优先排
			if (sg.length) {
				if (swapIds[i].h > sg[0].h || swapIds[i].w * swapIds[i].h > sg[0].w * sg[0].h) {
					sg.unshift(swapIds[i]);
				}
				else {
					sg.push(swapIds[i]);
				}
			}
			else {
				sg.push(swapIds[i]);
			}
		}
		/* 开始交换处理 */
		var delArr;
		// 先删除drag grid的空间
		dg.x = x;
		dg.y = y;
		delArr = W.mxQA.tool.buildUnitArr(dg.x, dg.y, dg.x + dg.w - 1, dg.y + dg.h - 1);
		for (var i = 0; i < delArr.length; i++) {
			unitArr.splice(unitArr.indexOf(delArr[i]), 1);
		}
		// swap grid移到新位置
		var sign;
		var tmp;
		for (var i = 0; i < sg.length; i++) {
			sign = -1;
			for (var j = 0; j < unitArr.length; j++) {
				tmp = unitArr[j].split(',');
				tmp.x = tmp[0] - 0;
				tmp.y = tmp[1] - 0;
				delArr = W.mxQA.tool.buildUnitArr(tmp.x, tmp.y, tmp.x + sg[i].w - 1, tmp.y + sg[i].h - 1);
				sign = W.mxQA.tool.validateGrid(unitArr, delArr);
				if (sign == 1) {
					break;
				}
			}
			if (sign == 1) {
				sg[i].x = tmp.x;
				sg[i].y = tmp.y;
				for (var j = 0; j < delArr.length; j++) {
					unitArr.splice(unitArr.indexOf(delArr[j]), 1);
				}
			}
			else {
				console.error('交换格子逻辑需要修改', sg[i], unitArr);
				return null;
			}
		}
		// 跨页需要更新page数据
		if (dragId != pageIdx) {
			W.mxQA.api.moveGrid([dg], dragIdx, pageIdx);
			W.mxQA.api.moveGrid(sg, pageIdx, dragIdx);
		}
		return {
			dg: dg,
			sg: sg
		};
	}

	function swapPage(sIdx, tIdx) {
		var page = W.mxQA.api.getPageData();
		var tmp;
		// 数据交换
		tmp = page[sIdx];
		page[sIdx] = page[tIdx];
		page[tIdx] = tmp;
		// ui交换
		var sobj = $('.page[idx="' + sIdx + '"]');
		var tobj = $('.page[idx="' + tIdx + '"]');
		var nav = $('.grid-nav');
		sobj.attr('idx', tIdx);
		tobj.attr('idx', sIdx);
		nav[sIdx].setAttribute('idx', tIdx);
		nav[tIdx].setAttribute('idx', sIdx);
		tmp = nav[sIdx].outerHTML;
		nav[sIdx].outerHTML = nav[tIdx].outerHTML;
		nav[tIdx].outerHTML = tmp;
		// 是否需要翻页
		if (W.page_idx == sIdx) {
			W.page_idx = tIdx;
		}
		else if (W.page_idx == tIdx) {
			W.page_idx = sIdx;
		}
		slidePage(W.page_idx, true);
		W.mxQA.api.saveLayout();
	}

	function initGridAdd() {
		var tmp;
		// 生成左边菜单
		var strArr = [];
		var data = W.page_template_data;
		for (var i = 0; i < data.grid.length; i++) {
			tmp = data.grid[i];
			strArr.push('<li idx="' + i + '" class="' + tmp.className);
			if (i == 0) {
				strArr.push(' selected');
			}
			strArr.push('"><span></span>');
			strArr.push(tmp.title + '</li>');
		}
		grid_add.find('.side').html(strArr.join(''));
		// 右边列表
		buildGridList(data.grid[0].content);
		// 搜索框清空
		$('#grid-add-search').val('');
		// 生成widget列表
		buildWidgetList(data.widget.content, W.page_template_data.guid);

		// 生成经常打开列表
		W.mxQA.api.getTopVisitedList(function (data) {
			W.mxQA.tool.buildAddTabList(data.list, $('#custom-tab ul li:eq(1)'));
		}, function() { // 无此接口执行该方法
			$('#custom-tab ul li:eq(1)').html('<p>' + W.mxQA.api.getLang('MostVisitedPagesUpdateTip') + '</p>');
		});

		// 生成收藏列表
		W.mxQA.tool.buildAddFavList(W.mxQA.api.getFavRootChilds(), $('#custom-tab ul li:eq(2)'));


		// widget有更新提示new图片
		var widgetData = page_template_data.widget.recommendWidget;
		var oldWidgetGuid = mxQA.api.getConfig(RECOMMEND_WIDGET_ADDLIST_ID);
		if (widgetData && widgetData.guid && widgetData.guid != oldWidgetGuid) {
			$('.nav-widget').append('<img src="img/grid_add/new.gif" />');
		}
	}

	function buildGridList(gridArr) {
		var strArr = [];
		var tmp;
		var bgUrl;
		for (var i = 0; i < gridArr.length; i++) {
			tmp = gridArr[i];
			strArr.push('<div id="' + tmp.guid + '" class="new-grid" ');
			strArr.push('url="' + W.mxQA.tool.encodeHtml(tmp.url) + '">');
			if (W.mxQA.api.isThumbExisted(tmp.url)) {
				bgUrl = W.mxQA.api.getThumbUrl(tmp.url);
				strArr.push('<div style="background-image: url(\'' + bgUrl + '\');">');
				strArr.push('</div>');
			}
			else {
				W.mxQA.api.flushThumb(tmp.url, 0);
				strArr.push('<div style="background-color: rgba(240, 240, 240, 1);">');
				strArr.push(W.mxQA.tool.encodeHtml(tmp.title) + '</div>');
			}
			strArr.push('<div class="new-grid-mask">');
			strArr.push('<button>');
			strArr.push(W.mxQA.api.getLang('Add'));
			strArr.push('</button>');
			strArr.push('</div>');
			strArr.push('</div>');
		}
		grid_add.find('.search-list').html(strArr.join(''));
	}

	function buildWidgetList(widgetArr, guid) {
		if (!widgetArr.length) return;

		// 暂时只有一个，随后会是列表
		var recommendWidget = widgetArr.filter(function (item) {
			return item.bigThumb;
		})[0];

		// 顶部大图
		var str =   recommendWidget? ('<div class="widget-add-recommend" tid="' + recommendWidget.templateId + '">' + 
			            '<img src="' + W.mxQA.api.buildTemplateUrl(guid, recommendWidget.bigThumb, 'data') + '" />' + 
			        '</div>'): '';

		str +=  '<div class="widget-add-small">' + 
		            '<header>' + W.mxQA.api.getLang('WidgetList') + '</header>' + 
		            '<ul class="clearfix">';

		widgetArr.forEach(function (n, i) {
			if (!n.isShow) return;
			var areaHtml = '';
			for (var i = 0, length = page_size.w * page_size.h; i < length; i++) {
				areaHtml += '<span' + (n.layout.indexOf(i) > -1? ' class="l"' :'') + '></span>';
			}
			str += '<li tid="' + n.templateId + '">' + 
	                    '<div class="widget-add-small-img">' + 
	                        '<img src="' + W.mxQA.api.buildTemplateUrl(guid, n.thumb, 'data') + '" />' + 
	                    '</div>' + 
	                    '<div class="widget-add-small-title">' + 
	                        n.title + 
	                        '<div>' + 
	                            '<p>' + n.desc + '</p>' + 
	                        '</div>' + 
	                    '</div>' + 
	                    '<div class="widget-add-small-area">' + 
	                        W.mxQA.api.getLang('Area') + 
	                        '<div>' + areaHtml + '</div>' + 
	                    '</div>' + 
	                    '<button>' + W.mxQA.api.getLang('Add') + '</button>' + 
	                '</li>';
		});

		str +=  '<li class="widget-expect">' + 
					'<p>' + W.mxQA.api.getLang('PleaseStayTuned') + '</p>' + 
				'</li>' + 
            '</ul>' + 
        '</div>';

        if ((recommendWidget && widgetArr.length >= 2) || (!recommendWidget && widgetArr.length >= 4)) {
        	str += '<div class="widget-add-bottom"><div></div></div>';
        }

		grid_add.find('.widget-add-list').html(str);
	}

	function searchGridList(kw) {
		var data = W.page_template_data;
		var list = [];
		var tmp;
		kw = W.mxQA.tool.toHC(kw.toLowerCase());
		for (var i = 1; i < data.grid.length; i++) {
			tmp = data.grid[i].content;
			for (var j = 0; j < tmp.length; j++) {
				if (tmp[j].url.toLowerCase().indexOf(kw) > -1 || tmp[j].title.toLowerCase().indexOf(kw) > -1) {
					list.push(tmp[j]);
				}
			}
		}
		if (list.length) {
			buildGridList(list);
			$('#grid-add .search-list').show();
			$('#grid-add .no-result').hide();
		} else {
			$('#grid-add .search-list').hide();
			$('#grid-add .no-result').show();
		}
	}

	function flushTabHTML(id) {
		var grid = W.mxQA.api.getGridById(id);
		var gridJQ = $('#' + id);
		var ulJQ = $('.page[idx="' + W.mxQA.api.getPageIdxById(id) + '"] > ul');
		gridJQ.remove();
		ulJQ.append(W.mxQA.tool.buildGridHtml(grid));
		W.mxQA.tool.resizeGrid($('#' + id)[0], grid);
	}

	function initOption(initBG) {
		var strArr = [];
		var data = W.page_template_data;
		var pic = data.background.pic;
		var brightness;
		var option = W.mxQA.api.getOption();
		var bgUrl;
		var bgForceJQ;
		var img = new Image();
		var isCustomBG = W.mxQA.api.getLocalItem(W.CUSTOM_BACKGROUND_SIGN);

		// 是否隐藏快速拨号
		option.isHideQuickAccess && $('body').addClass('hide-quick-access');
		
		// 是否隐藏widget侧边栏
		$('#widget-sidebar')[option.isHidWidgetSidebar? 'hide': 'show']();

		if (option.isShowRecommendPic && data.background.recommendPic.length) {
			bgUrl = W.mxQA.api.buildTemplateUrl(data.guid, data.background.recommendPic[0], 'data');
			brightness = data.background.recommendPic[1];
		} else if (isCustomBG.length) {
			bgUrl = W.mxQA.api.getCustomBGPath();
		} else {
			bgUrl = W.mxQA.api.buildTemplateUrl(data.guid, pic[option.bgIndex], 'data');
		}

		img.onload = function () {
			switchDarkOrLight(brightness);
			main_bg[0].style.backgroundImage = 'url(\'' + bgUrl + '\')';
		}
		img.onerror = function () {
			W.mxQA.api.getOption().bgIndex = 0;
			!page_is_default && W.mxQA.api.saveLayout();
			W.mxQA.api.setLocalItem(W.CUSTOM_BACKGROUND_SIGN, '');
			initOption(true);
		}
		img.src = bgUrl;

		// 只初始化背景和隐藏快速拨号
		if (initBG) return;

		// 背景list
		for (var i = 0; i < pic.length; i++) {
			strArr.push('<img src="');
			strArr.push(W.mxQA.api.buildTemplateUrl(data.guid, pic[i], 'data'));
			strArr.push('" idx="' + i + '"/>');
		}
		strArr.push('<div title="' + W.mxQA.api.getLang('CustomPic') + '" class="custom-bg" >');
		strArr.push('</div>');
		$('#option-bg-list').html(strArr.join(''));
		// radio
		$('#option-thumb-' + option.thumbType)[0].checked = true;
		// checkbox
		$('#option-new')[0].checked = !!option.isNewOpen;
		$('#option-hide')[0].checked = !!option.isHideBlank;
		$('#option-hide-qa')[0].checked = !!option.isHideQuickAccess;
    	if (mxQA.api.isZhCn()) {
    		!$('#option-hide-widget-sidebar')[0] && $('#option-hide-qa').closest('div').after('<div><input id="option-hide-widget-sidebar" type="checkbox" value="1"/><label for="option-hide-widget-sidebar">' + mxQA.api.getLang('HideTheSidebar') + '</label></div>');
			$('#option-hide-widget-sidebar')[0].checked = !!option.isHidWidgetSidebar;
    	}
		bgForceJQ = $('#option-force');
		bgForceJQ[0].checked = !!option.isShowRecommendPic;
		if (data.background.recommendPic.length) {
			bgForceJQ[0].disabled = false;
			bgForceJQ.parent().removeClass('disabled');
		} else {
			bgForceJQ[0].disabled = true;
			bgForceJQ.parent().addClass('disabled');
		}
	}

	function showZoomBox(el){
	    var zoomBox = $("#zoom-box");
	    var rect = el.getBoundingClientRect();
	    zoomBox.css({
	    	left: rect.left + "px",
	    	top: rect.top + "px",
	    	right: rect.right + "px",
	    	bottom: rect.bottom + "px"
		});
	    zoomBox.addClass('in');

	    setTimeout(function(){
	        zoomBox[0].style.cssText = '';
	        zoomBox[0].style.opacity = 1;
	    }, 10);
	}

	function switchBackground(src) {
		var mask_bg_mask = $('#main-bg-mask');
		mask_bg_mask[0].style.backgroundImage = main_bg[0].style.backgroundImage;
		mask_bg_mask[0].style.webkitTransform = main_bg[0].style.webkitTransform;
		mask_bg_mask.show();
		main_bg[0].style.backgroundImage = 'url(\'' + src + '\')';
		setTimeout(function() {
			mask_bg_mask.addClass('scale-out');
			setTimeout(function () {
				mask_bg_mask.removeClass('scale-out');
				mask_bg_mask[0].style.backgroundImage = 'none';
				mask_bg_mask.hide();
				main_bg_sign = true;
			}, 1000);
		}, 50);
	}

	function switchDarkOrLight(brightness) {
		var isCustomBG = W.mxQA.api.getLocalItem(W.CUSTOM_BACKGROUND_SIGN);
		var option = W.mxQA.api.getOption();
		var bodyJQ = $('body');
		bodyJQ.removeClass('light-bg dark-bg');
		if (!brightness) {
			if (isCustomBG.length) {
				brightness = W.mxQA.api.getAverageRGBColor(W.mxQA.api.getCustomBGPath());
				if (W.mxQA.tool.calculateColorBrightness(brightness) >= 128) {
					brightness = 'light';
				}
				else {
					brightness = 'dark';
				}
			}
			else {
				brightness = W.page_template_data.background.brightness[option.bgIndex];
			}
		}
		bodyJQ.addClass(brightness + '-bg');
	}

	function deletePageByIdx(idx) {
		var gridList = W.mxQA.api.getPageData()[idx].content;
		gridList.forEach(function (n) {
			if (n.templateId && n.templateId == TMP_WIDGET_ID) {
				W.mxQA.widgetAPI.setWidgetItem(n.templateDataId);
			}
		});

		var len = W.mxQA.api.deletePageByIdx(idx);
		$('#page-area > [idx="' + idx + '"]').remove();
		$('#page-nav > [idx="' + idx + '"]').remove();
		if (W.page_idx >= idx) {
			W.page_idx -= 1;
		}
		// 修改idx值
		idx += 1;
		while (idx <= len) {
			$('#page-area > [idx="' + idx + '"]').attr('idx', idx - 1);
			$('#page-nav > [idx="' + idx + '"]').attr('idx', idx - 1);
			idx += 1;
		}
		initNavPosition();
		slidePage(W.page_idx, true);
	}

	var qa_grid_baidu_reg = /^(?:http\:\/\/)?((?:www\.)?baidu\.com\/?(?:[^\/]*\?.*|[^\/]*))$/;
	var qa_grid_baidu_replace = W.mxQA.api.getLocalStorage('qa_grid_baidu_replace');
	if (qa_grid_baidu_replace === '') {
        $.ajax({
            url: 'https://www.baidu.com/clientcon?from=myie2dg',
            dataType: 'text',
            success: function (data) {
				W.mxQA.api.setLocalStorage('qa_grid_baidu_replace', /0/.test(data));
            },
            error: function (err) {
                console.error('qa baidu https, status:' + err.status);
            }
        });
	}

	function openTab(el, isNewOpen) {
		var id = el.id;
		var grid = W.mxQA.api.getGridById(id);
		var option = W.mxQA.api.getOption();
		// ueip
		var data = {
			url: grid.url,
			title: grid.title,
			page: W.page_idx,
			coord: grid.x + ',' + grid.y
		};
		W.mxQA.api.ueip('content', '', 'tileclick', '', '', '', JSON.stringify(data));

		var href = qa_grid_baidu_replace === 'true'? grid.url.replace(qa_grid_baidu_reg, 'https://$1'): grid.url;
		if (option.isNewOpen || isNewOpen) {
			open(href);
		}
		else {
			showZoomBox(el);
			setTimeout(function () {
				var about = {
					'about:ms': 'mx://res/multi-search/index.htm',
					'about:history': 'mx://res/history/index.htm',
					'about:extensions': 'mx://res/extensions/index.htm',
					'about:favorites': 'mx://res/favorites/index.htm',
					'about:last': 'mx://res/last-visit/index.htm',
					'about:gpu': 'mx://res/gpu/index.htm',
					'about:config': 'mx://res/options/index.htm',
					'about:blank': 'mx://res/quick-access/index.htm',
					'about:reader': 'mx://res/app/%7B4F562E60-F24B-4728-AFDB-DA55CE1597FE%7D/reader.htm'
				};
				href = about[href] || href;
				location.href = href;
			}, 300);
		}
	}

	function addTab(el, type) {
		W.grid_modify_id = type? '': el.id;
		$('#grid-add .nav-widget')[type? 'hide': 'show']();
		$('#grid-add .nav-grid').click();
		$('#grid-add-search').focus();
		$('#grid-add .side li:first-child').addClass('selected').click().siblings().removeClass('selected');
		$('#mask').css({'z-index': 110, 'opacity': 1});
		W.mxQA.tool.addGridAnimation(el);
	}

	function modifyTab(el, type, json) {
		if (type) {
			var grid = json;
			W.grid_modify_id = '';
		} else {
			var id = el.id;
			var grid = W.mxQA.api.getGridById(id);
			W.grid_modify_id = id;
		}
		$('#grid-add .nav-widget')[type? 'hide': 'show']();
		$('#grid-add .nav-custom').click();
		$('#custom-url').val(grid.url);
		$('#custom-title').val(grid.title);
		$('#grid-add .custom').addClass('selected').siblings().removeClass('selected');
		$('#mask').css({'z-index': 110, 'opacity': 1});
		W.mxQA.tool.addGridAnimation(el);
	}

	function deleteGridByEl(el) {
		var gridIdArr = W.mxQA.api.deleteGridById(el.id);
		gridIdArr.length ? el.remove() : null;
		gridIdArr.forEach(function (gridId, i) {
			flushTabHTML(gridId);
		});

		// 满屏widget删除时修改nav名称
		var templateId = $(el).find('.grid-bg').attr('template-id');
		if (templateId) {
			var data = W.page_template_data, currentNav = $('#page-nav .current');
			for (var i = 0, length = data.widget.content.length; i < length; i++) {
				if (data.widget.content[i].templateId == templateId) {
					data = data.widget.content[i];
					break;
				}
			}
			if (data.width == page_size.w && data.height == page_size.h && data.title == mxQA.tool.decodeHtml(currentNav.html())) {
				var blankPage = W.mxQA.api.getLang('BlankPage');
				W.mxQA.api.modifyNavTitle(W.page_idx, blankPage);
				currentNav.attr('title', blankPage).html(blankPage);
			}
		}
	}

	function flushWidget(templateDataId) {
		var widgetJQ = $('[template-data-id="' + templateDataId + '"]');
		widgetJQ.html('').addClass('loading');
		W.mxQA.api.flushTemplateData(templateDataId);
	}

	function reloadTemplateFrame(guid) {
		var widgetArr = W.page_template_data.widget.content;
		var widget;
		var widgetJQ, widgetWarp;
		// tmp widget
		if (guid == TMP_WIDGET_ID) {
			widget = {
				templateId: guid
			};
		}
		else {
			for (var i = 0; i < widgetArr.length; i++) {
				if (widgetArr[i].templateId == guid) {
					widget = widgetArr[i];
					break;
				}
			}
		}
		if (!widget) {
			console.error('模板数据不匹配');
			return;
		}
		W.mxQA.api.getTemplateFrame(guid, function (config) {
			if (!config) {
				return;
			}

			function initWidget() {
				var el;
				if (config.css) {
					el = document.getElementById(config.guid + '-css');
					if (!el) {
						el = document.createElement('link');
						el.id = config.guid + '-css';
						el.type = 'text/css';
						el.rel = 'stylesheet';
						el.href = W.mxQA.api.buildTemplateUrl(config.guid, config.css, 'frame');
						document.head.appendChild(el);
					}
				}
				if (config.js) {
					el = document.getElementById(config.guid + '-js');
					if (!el) {
						el = document.createElement('script');
						el.id = config.guid + '-js';
						el.type = 'text/javascript';
						el.src = W.mxQA.api.buildTemplateUrl(config.guid, config.js, 'frame');
						document.body.appendChild(el);
						el.onload = function () {
							// tmp widget
							if (widget.templateId == TMP_WIDGET_ID) {
								var data;
								var divJQ = $('[template-id="' + widget.templateId + '"]');
								divJQ.removeClass('loading').attr('template-status', config.status);
								divJQ.each(function (i, n) {
									var elJQ = $(n);
									data = W.mxQA.widgetAPI.getWidgetItem(elJQ.attr('template-data-id'));
									W[elJQ.attr('template-id')].init(n, data);
								});
								return;
							}
							W.mxQA.api.getTemplateData(widget.templateDataId, function (data) {
								var divJQ = $('[template-data-id="' + data.guid + '"]');
								divJQ.removeClass('loading').attr('template-status', config.status);
								divJQ.each(function (i, n) {
									W[$(n).attr('template-id')].init(n, data);
								});
							});
						};
					}
					else {
						// tmp widget
						if (widget.templateId == TMP_WIDGET_ID) {
							var data;
							var divJQ = $('[template-id="' + widget.templateId + '"].loading');
							// 防止多个同一个widget加载报错
							if (!W[widget.templateId] || !W[widget.templateId].init) {
								return;
							}
							divJQ.removeClass('loading').attr('template-status', config.status);
							divJQ.each(function (i, n) {
								var elJQ = $(n);
								data = W.mxQA.widgetAPI.getWidgetItem(elJQ.attr('template-data-id'));
								W[elJQ.attr('template-id')].init(n, data);
							});
							return;
						}
						W.mxQA.api.getTemplateData(widget.templateDataId, function (data) {
							var divJQ;
							// 防止多个同一个widget加载报错
							if (!W[widget.templateId] || !W[widget.templateId].init) {
								return;
							}
							divJQ = $('[template-data-id="' + data.guid + '"].loading');
							divJQ.removeClass('loading').attr('template-status', config.status);
							divJQ.each(function (i, n) {
								W[$(n).attr('template-id')].init(n, data);
							});
						});
					}
				}
			}

			switch (config.status) {
			case 0:
				widgetJQ = $('[template-data-id="' + config.guid + '"]');
				widgetJQ.each(function (i, n) {
					$(n).removeClass('loading').attr('template-status', config.status).html('<p>' + W.mxQA.api.getLang('WidgetDisabled') + '</p><p><button>' + W.mxQA.api.getLang('Delete') + '</button></p>');
				});
				break;
			case 1:
				initWidget();
				break;
			case 2:
				initWidget();
				widgetWarp = $('[template-data-id="' + config.guid + '"]').parent();
				widgetWarp.each(function(i, n) {
					n = $(n);
					!n.find('.template-status-remind').length && n.append('<p class="template-status-remind">' + W.mxQA.api.getLang('WidgetSuggestDelete') + '</p>');
				});
				break;
			}
		});
	}

	function reloadTemplateData(guid) {
		W.mxQA.api.getTemplateData(guid, function (data) {
			var divJQ = $('[template-data-id="' + data.guid + '"]');
			divJQ.removeClass('loading');
			// 防止第一次加载异常后没有status
			if (!divJQ.attr('template-status')) {
				divJQ.attr('template-status', '1');
			}
			divJQ.each(function (i, n) {
				W[$(n).attr('template-id')].init(n, data);
			});
		});
	}

	function addWidget(id, x, y) {
		var data = W.page_template_data;
		var tmp;
		var gridData = {};
		var result;
		var page = W.mxQA.api.getPageData();
		var newGrid;
		for (var i = 0; i < data.widget.content.length; i++) {
			tmp = data.widget.content[i];
			if (tmp.templateId == id) {
				gridData.templateId = tmp.templateId;
				// tmp widget
				if (tmp.templateId == W.TMP_WIDGET_ID) {
					gridData.templateDataId = W.mxQA.api.newGuid();
					W.mxQA.widgetAPI.setWidgetItem(gridData.templateDataId, []);
				}
				else {
					gridData.templateDataId = tmp.templateDataId;
				}
				gridData.t = tmp.title;
				gridData.x = x;
				gridData.y = y;
				gridData.w = tmp.width;
				gridData.h = tmp.height;
				break;
			}
		}
		// 修正x, y坐标
	    gridData.x = (gridData.x + gridData.w <= W.page_size.w) ? gridData.x : W.page_size.w - gridData.w;
	    gridData.y  = (gridData.y + gridData.h <= W.page_size.h) ? gridData.y  : W.page_size.h - gridData.h;

		result = W.mxQA.tool.getValidEmptyGridArr(page[W.page_idx].content, gridData.x, gridData.y, gridData.w, gridData.h);
		if (result.length > 0) {
			if (result.x != undefined) {
				gridData.x = result.x;
			}
			if (result.y != undefined) {
				gridData.y = result.y;
			}
			newGrid = W.mxQA.api.addGridForWidget(W.page_idx, result, gridData);

			// 移除旧element
			result.forEach(function (n) {
				document.getElementById(n.id).remove();
			});
			// 新增element
			$('.page[idx="' + W.page_idx + '"] > ul').append(W.mxQA.tool.buildGridHtml(newGrid));
			W.mxQA.tool.resizeGrid($('#' + newGrid.id)[0], newGrid);

			// 满屏widget，nav名和widget名一致
			if (gridData.w == page_size.w && gridData.h == page_size.h) {
				W.mxQA.api.modifyNavTitle(W.page_idx, gridData.t);
				gridData.t = W.mxQA.tool.encodeHtml(gridData.t) || W.mxQA.api.getLang('BlankPage');
				$('#page-nav .current').attr('title', gridData.t).html(gridData.t);
			}

			$('#grid-add .close').click();
		}
		else {
			$('#grid-add .close').click();
			W.mxQA.tool.showPopBox('alert', W.mxQA.api.getLang('EditTabToWidgetError'));
		}
	}

	function tabUpdate() {
		W.mxQA.api.getTemplateData(W.UPDATE_TEMPLATE_DATA_ID, function (data) {
			var version = W.mxQA.api.getLocalStorage(W.UPDATE_TEMPLATE_DATA_ID) || 0;
			var updateArr;
			var page;
			var updateFunc;
			if (version) {
				version = parseFloat(version);
			}
			// 不需要更新
			if (version >= data.version) {
				return;
			}
			version = data.version;
			updateArr = data.content;
			page = W.mxQA.api.getPageData();
			// 更新函数
			updateFunc = function (grid) {
				updateArr.forEach(function (n) {
					var sign = false;
					if (n.type == 'guid') {
						if (n.key == grid.guid) {
							sign = true;
						}
					}
					else if (n.type == 'reg') {
						if (new RegExp(n.key).test(grid.url)) {
							sign = true;
						}
					}
					if (sign) {
						grid.title = n.title || grid.title;
						grid.url = n.url || grid.url;
					}
				});
			}
			page.forEach(function (n) {
				var arr = n.content;
				arr.forEach(function (n) {
					var type = W.mxQA.api.getGridTypeById(n.id);
					if (type == 1) {
						updateFunc(n);
					} else if (type == 2 && n.templateId == TMP_WIDGET_ID) {
						var widgetData = mxQA.widgetAPI.getWidgetItem(n.templateDataId);
						widgetData.forEach(function(n) {
							updateFunc(n);
						});
						mxQA.widgetAPI.setWidgetItem(n.templateDataId, widgetData);
					}
				});
			});
			!page_is_default && W.mxQA.api.saveLayout();
			W.mxQA.api.setLocalStorage(W.UPDATE_TEMPLATE_DATA_ID, '' + version);
			location.reload();
		});
	}

	function addNewPage(newPage, idx) {
		var pageAreaJQ = $('#page-area');
		var addNavJQ = $('#page-nav .add-nav');
		pageAreaJQ.append(W.mxQA.tool.buildPageHtml(newPage.content, idx));
		addNavJQ.before(W.mxQA.tool.buildNavHtml(newPage.title, idx));
		// 定位
		var width = Math.max(W.window_width, W.page_size.w * W.GRID_SIZE[W.grid_type].w);
		var pageJQ = $('.page[idx="' + idx + '"]');
		var ulJQ = pageJQ.find('> ul');
		var liJQ = ulJQ.find('> li');
		pageJQ.css({left: width});
		ulJQ.css({left: W.page_left, top: W.page_top});
		liJQ.each(function (i, n) {
			var grid = W.mxQA.api.getGridById(n.id);
			W.mxQA.tool.resizeGrid(n, grid);
		});
		initNavPosition();
		return liJQ[0];
	}

	function addTabByAddress() {
		var sign = false;
		var arr = W.mxQA.api.getTabByAddress();
		var page = W.mxQA.api.getPageData();
		var idx = page.length - 1;
		var cp = page[idx];
		var tmp;
		if (!arr.length) {
			return;
		}
		// 最后一页
		for (var i=0,l=cp.content.length; i<l; i++) {
			tmp = cp.content[i];
			if (tmp.thumbType == 0 && !tmp.url ) {
				W.mxQA.api.editTab(tmp.id, {title: arr[0].title, url: arr[0].url});
				slidePage(idx, true);
				flushTabHTML(tmp.id);
				W.mxQA.api.clearTabByAddress();
				return;
			}
		}
		// 新建一页
		if (idx < W.PAGE_MAX_NUM-1) {
			page = W.mxQA.api.addNewPage();
			tmp = page[++idx].content[0];
			W.mxQA.api.editTab(tmp.id, {title: arr[0].title, url: arr[0].url});
			addNewPage(page[idx], idx);
			slidePage(idx, true);
			W.mxQA.api.clearTabByAddress();
			return;
		}
		// 向前遍历
		for (idx--; idx > -1; idx--) {
			cp = page[idx];
    		for (var i=0,l=cp.content.length; i<l; i++) {
    			tmp = cp.content[i];
    			if (tmp.thumbType == 0 && !tmp.url ) {
    				W.mxQA.api.editTab(tmp.id, {title: arr[0].title, url: arr[0].url});
    				slidePage(idx, true);
    				flushTabHTML(tmp.id);
					W.mxQA.api.clearTabByAddress();
					return;
    			}
    		}
		}
		// 没空间
		W.mxQA.tool.showPopBox('alert', W.mxQA.api.getLang('AddressAddError'));
	}

	function isFullWidget(templateDataId) {
		var widget = W.mxQA.widgetAPI.getWidgetItem(templateDataId);
		if (widget && widget.length == 9 && widget[widget.length-1].url) {
			return true;
		}
		return false;
	}

	/*
	 * 返回可拖入的widget
	 * id  : drag grid id
	 * x, y: drag gird类似左上角的坐标
	 * return widget的数据id, 没有为null
	 */
	function getDragIntoWidget(id, x, y) {
		var tmp;
		var gridSize = W.GRID_SIZE[W.grid_type];
		var page;
		var widget;
		// 必须是grid
		if (W.mxQA.api.getGridTypeById(id) != 1) {
			return null;
		}
		// 转化成页的grid下标
		x = (x > 0) ? (x / gridSize.w >> 0) : -1;
		y = (y > 0) ? (y / gridSize.h >> 0) : -1;
		// 拖拽的位置是否超边界
		if (x < 0 || y < 0 || x >= W.page_size.w || y >= W.page_size.h) {
			return null;
		}
		// 取当前page的grid
		page = W.mxQA.api.getPageData()[W.page_idx];
		for (var i = 0; i < page['content'].length; i++) {
			tmp = page['content'][i];
			if (tmp.templateId==W.TMP_WIDGET_ID && tmp.x<=x && (tmp.x+tmp.w-1>=x) && tmp.y<=y && (tmp.y+tmp.h-1>=y)) {
				return tmp.templateDataId;
			}
		}
	}

	function addRecommendWidget() {
		var page = W.mxQA.api.getPageData();
		var idx = page.length - 1;
		if (!W.mxQA.api.isBlankPage(idx)) {
			page = W.mxQA.api.addNewPage();
			idx++;
			W.mxQA.logic.addNewPage(page[idx], idx);
		}
		// 事件
		$('#page-nav [idx="' + idx + '"]').click();

		W.mxQA.logic.addWidget(page_template_data.widget.recommendWidget.guid, 0, 0);
	}

	W.mxQA = W.mxQA || {};
	W.mxQA.logic = {
		slidePage: slidePage,
		initBase: initBase,
		initPage: initPage,
		initPageDelay: initPageDelay, 
		initPosition: initPosition,
		initNavPosition: initNavPosition,
		initWidgetSidebar: initWidgetSidebar, 
		initWeather: initWeather, 
		initOther: initOther,
		getSwapMessage: getSwapMessage,
		swapGrid: swapGrid,
		swapPage: swapPage,
		initGridAdd: initGridAdd,
		buildGridList: buildGridList,
		searchGridList: searchGridList,
		flushTabHTML: flushTabHTML,
		initOption: initOption,
		showZoomBox: showZoomBox,
		switchBackground: switchBackground,
		switchDarkOrLight: switchDarkOrLight,
		deletePageByIdx: deletePageByIdx,
		openTab: openTab,
		addTab: addTab,
		modifyTab: modifyTab,
		deleteGridByEl: deleteGridByEl,
		flushWidget: flushWidget,
		reloadTemplateFrame: reloadTemplateFrame,
		reloadTemplateData: reloadTemplateData,
		addWidget: addWidget,
		tabUpdate: tabUpdate,
		addNewPage: addNewPage,
		addTabByAddress: addTabByAddress,
		isFullWidget: isFullWidget, 
		getDragIntoWidget: getDragIntoWidget, 
		addRecommendWidget: addRecommendWidget
	};

})(window);