/*
 * 页面事件加载
 */

;(function (W) {

	// 开始拖拽的坐标
	var origin_x = 0;
	var origin_y = 0;
	// drag显示的元素
	var drag_div = $('#drag');
	// drag grid和drag page idx
	var drag_grid = null;
	var drag_page_idx;
	// 交换左上角的unit grid坐标
	var swap_unit = {};
	// 判断是否可交换的延时器
	var swap_timeout;
	// 拖拽时的翻页定时器
	var slide_timeout;
	var slide_interval;
	// 添加模块元素
	var grid_add = $('#grid-add');
	var mask_div = $('#mask');
	// 统计添加类型
	var customAddUeipData = {
		type: 'customadd', 
		url: ''
	};

	// 防止超级拖拽
	$(document).on('dragstart', function (e) {
		e.preventDefault();
		return false;
	});

	// 翻页
	document.addEventListener('mousewheel', function (e) {
		if ($('body').hasClass('hide-quick-access')) {
			return;
		}
		$('#option-div').hide();
		if (grid_add[0].style.zIndex > 0) {
			return;
		}
		W.mxQA.logic.slidePage(e.wheelDelta < 0 ? 1 : -1);
	}, false);
	
    // 鼠标手势
    window.onmxmousegesture = function (event) {
        if (event.type == "end") {
            if (event.gesture == "Left") {
                W.mxQA.logic.slidePage(-1);
                return false;
            }
            else if (event.gesture == "Right") {
                W.mxQA.logic.slidePage(1);
                return false;
            }
        }
        return true;
    };

	$('#slider-left').on('click', function () {
		W.mxQA.logic.slidePage(-1);
	});

	$('#slider-right').on('click', function () {
		W.mxQA.logic.slidePage(1);
	});

	// 拖拽时的翻页
	$('#slider-left, #slider-right').on('mouseover', function () {
		if (!drag_grid) {
			return;
		}
		$(this).addClass('slide-status');
		slide_timeout = clearTimeout(slide_timeout);
		slide_timeout = setTimeout(function (that) {
			$(that).click();
			slide_interval = clearInterval(slide_interval);
			slide_interval = setInterval(function (that) {
				$(that).click();
			}, 800, that);
		}, 300, this);
	});
	$('#slider-left, #slider-right').on('mouseout', function () {
		if (!drag_grid) {
			return;
		}
		$(this).removeClass('slide-status');
		slide_timeout = clearTimeout(slide_timeout);
		slide_interval = clearInterval(slide_interval);
	});
	$('#page-nav').delegate('.grid-nav', 'mouseover', function (e) {
		if (!drag_grid) {
			return;
		}
		$(this).click();
	});

	// nav翻页
	$('#page-nav').delegate('.grid-nav', 'click', function (e) {
		var that = $(this);
		var idx;
		// 本身在编辑状态不能翻页
		if (that.hasClass('edit')) {
			return;
		}
		idx = that.attr('idx');
		if (W.page_idx == idx) {
			return;
		}
		W.mxQA.logic.slidePage(idx, true);
	});

	// nav双击重命名
	$('#page-nav').delegate('.grid-nav', 'dblclick', function (e) {
		var that = $(this);
		if (that.find('input').length) return;
		var value = that.html();
		that.addClass('edit');
		that.html('<input type="text" value="' + W.mxQA.tool.encodeHtml(value) + '" maxlength="20"/>');
		that.find('input').focus();
	});

	// 新增一页
	$('#page-nav').delegate('.add-nav', 'click', function () {
		var page = W.mxQA.api.getPageData();
		var idx = page.length - 1;
		var gridJQ;

		if (W.mxQA.api.isBlankPage(idx)) {
			page = page[idx].content;
			gridJQ = page.filter(function(n) {
				return n.x == 0 && n.y == 0;
			})[0];
			gridJQ = document.getElementById(gridJQ.id);
			if (idx == page_idx) {
				W.mxQA.logic.addTab(gridJQ);
				return;
			}
		} else if (page.length == W.PAGE_MAX_NUM) {
			W.mxQA.tool.showPopBox('alert', W.mxQA.api.getLang('MaxPageNumTip'));
			return;
		} else {
			page = W.mxQA.api.addNewPage();
			idx = page.length - 1;
			gridJQ = W.mxQA.logic.addNewPage(page[idx], idx);
			W.mxQA.api.ueip('ui', '', 'newpage', '', '', '', '');
		}

		// 事件
		setTimeout(function () {
			$('#page-nav [idx="' + idx + '"]').click();
		}, 100);
		setTimeout(function (gridJQ) {
			W.mxQA.logic.addTab(gridJQ);
		}, 500, gridJQ);
	});

	// 推荐widget
	$('#page-nav').delegate('#recommend-widget span, #recommend-widget a', 'click', function () {
		mxQA.api.setConfig(RECOMMEND_WIDGET_ID, page_template_data.widget.recommendWidget.guid);
		$('#recommend-widget').remove();
	});
	$('#page-nav').delegate('#recommend-widget a', 'click', function (e) {
		e.preventDefault();
		var page = W.mxQA.api.getPageData();
		if (page.length == W.PAGE_MAX_NUM && !W.mxQA.api.isBlankPage(page.length-1)) {
			W.mxQA.tool.showPopBox('alert', W.mxQA.api.getLang('DismissWidgetErr'));
		} else {
			mxQA.logic.addRecommendWidget();
			W.mxQA.api.ueip('ui', '', 'widgetaddclick', 'popup', page_template_data.widget.recommendWidget.guid);
		}
	});

	// widget sidebar
	$('#widget-sidebar').delegate('li', 'click', function (e) {
		var that = $(this);
		var tid = that.attr('tid');
		var idx = mxQA.api.getPageIdxByTid(tid);
		that.removeClass('mark');
		mxQA.api.setLocalItem('widget-sidebar-' + tid, '1');

		if (idx == -1) {
			$('#page-nav .add-nav').click();
			setTimeout(function() {
				$('#grid-add .widget-add-small li[tid="' + tid + '"] button').click();
			}, mxQA.api.isBlankPage(page_idx)? 10: 500);

			mxQA.api.ueip('ui', '', 'widgetaddclick', 'sidebar', tid);
		} else {
			$('#page-nav .grid-nav:eq(' + idx + ')').click();

			mxQA.api.ueip('ui', '', 'sidebar', 'icoclick', tid);
		}

	});
	$('#widget-sidebar').delegate('span', 'click', function (e) {
		$('#page-nav .add-nav').click();
		setTimeout(function() {
			$('#grid-add .nav-widget').click();
		}, mxQA.api.isBlankPage(page_idx)? 10: 500);

		mxQA.api.ueip('ui', '', 'sidebar', 'icoclick', 'more');
	});

	// resize
	$(W).resize(function () {
		W.mxQA.logic.initBase();
		W.mxQA.logic.initPosition();

		// 重新定位option
		var rect = $('#tab-sync')[0].getBoundingClientRect();
		$('#option-btn').css('left', rect.left - 31);
		$('#option-div').css('left', rect.left - 323);
	});

	// start grid drag
	$('#page-area').delegate('.grid-bg, .grid-empty', 'mousedown', function (e) {
		if (e.button != 0 || e.target.nodeName == 'INPUT') {
			return true;
		}
		drag_grid = this.parentElement;
		// 记录drag page idx
		drag_page_idx = W.page_idx;
		// 原始点坐标
		origin_x = e.pageX;
		origin_y = e.pageY;

		var dragGridMoveFunc = function (e) {
			// 移动坐标大于4才生效
			if (drag_div[0].style.display != 'block' && (Math.abs(e.pageX - origin_x) > 4 || Math.abs(e.pageY - origin_y) > 4)) {
				// 显示drag div
				drag_grid.style.visibility = 'hidden';
				drag_div.html(drag_grid.outerHTML);
				drag_div.find('> li').removeAttr('id').css({left: 0, top: 0, visibility: 'visible'});
				drag_div.find('.grid-title').remove();
				drag_div[0].style.left = parseInt(drag_grid.style.left) + W.page_left + 'px';
				drag_div[0].style.top = parseInt(drag_grid.style.top) + W.page_top + 'px';
				drag_div.show();
			}
			if (drag_div[0].style.display != 'block') {
				return;
			}
			// 去掉hidden
			var option = W.mxQA.api.getOption();
			if (option.isHideBlank) {
				$('.hidden[grid-type="0"]').removeClass('hidden');
				W[TMP_WIDGET_ID] && W[TMP_WIDGET_ID].hideBlank && W[TMP_WIDGET_ID].hideBlank(false);
			}
			var id = drag_grid.id;
			var l = e.pageX - origin_x + W.page_left + parseInt(drag_grid.style.left);
			var t = e.pageY - origin_y + W.page_top + parseInt(drag_grid.style.top);
			drag_div[0].style.left = l + 'px';
			drag_div[0].style.top = t + 'px';

			var canDragIn = $('.can-dragin');
			var swap = $('.swap');
			var swapFunc = function (id, x, y) {
				var gridSize = W.GRID_SIZE[W.grid_type];
				// 体验更好
				x = x - W.page_left + gridSize.w / 2;
				y = y - W.page_top + gridSize.h / 2;
				// 可拖入的widget
				var widgetDataId = W.mxQA.logic.getDragIntoWidget(id, x, y);
				if (widgetDataId) {
					$('[template-data-id="'+widgetDataId+'"]').addClass('can-dragin');
					return;
				}

				// 可交换的grid id
				var swap = W.mxQA.logic.getSwapMessage(id, x, y);
				if (swap && swap.arr) {
					swap_unit.x = swap.x;
					swap_unit.y = swap.y;
					for (var i = 0; i < swap.arr.length; i++) {
						$('#' + swap.arr[i]).addClass('swap');
					}
				}
			};
			if (canDragIn.length || swap.length) {
				canDragIn.removeClass('can-dragin');
				swap.removeClass('swap');
				swapFunc(id, l, t);
			}
			else {
				swap_timeout = clearTimeout(swap_timeout);
				swap_timeout = setTimeout(swapFunc, 100, id, l, t);
			}
		};
		var dragGridMouseUpFunc = function (e) {
			// 恢复hidden
			var option = W.mxQA.api.getOption();
			if (option.isHideBlank) {
				$('.grid[grid-type="0"]').addClass('hidden');
				W[TMP_WIDGET_ID] && W[TMP_WIDGET_ID].hideBlank && W[TMP_WIDGET_ID].hideBlank(true);
			}
			// 解除事件
			$(document).off('mousemove', dragGridMoveFunc).off('mouseup', dragGridMouseUpFunc);
			if (drag_div[0].style.display == 'block') {
				var canDragIn = $('.can-dragin');
				var swap = $('.swap');
				var gridSize = W.GRID_SIZE[W.grid_type];

				function reposition() {
					// 本页
					if (drag_page_idx == W.page_idx) {
						drag_div.addClass('drop');
						drag_div[0].style.left = parseInt(drag_grid.style.left) + W.page_left + 'px';
						drag_div[0].style.top = parseInt(drag_grid.style.top) + W.page_top + 'px';
						setTimeout(function (dg) {
							drag_div.removeClass('drop').hide();
							dg.style.visibility = 'visible';
						}, 200, drag_grid);
					}
					else {
						drag_div.hide();
						drag_grid.style.visibility = 'visible';
						W.mxQA.logic.slidePage(drag_page_idx, true);
					}
				}
				// 拖入优先
				if (canDragIn.length) {
					if (W.mxQA.logic.isFullWidget(canDragIn.attr('template-data-id'))) {
						reposition();
						W.mxQA.tool.showPopBox('alert', W.mxQA.api.getLang('FullWidgetErr'));
					} else {
						W[TMP_WIDGET_ID].pushData(canDragIn.attr('template-data-id'), W.mxQA.api.getGridById(drag_grid.id));
						W.mxQA.logic.deleteGridByEl(drag_grid);
						drag_div.hide();
						drag_grid.style.visibility = 'visible';
					}
					$('.can-dragin').removeClass('can-dragin');
				}
				// 交换情况
				else if (swap.length) {
					drag_div.addClass('drop');
					drag_div[0].style.left = swap_unit.x * gridSize.w + W.page_left + 'px';
					drag_div[0].style.top = swap_unit.y * gridSize.h + W.page_top + 'px';
					var result = [];
					for (var i = 0; i < swap.length; i++) {
						result.push(swap[i].id);
					}
					result = W.mxQA.logic.swapGrid(drag_grid.id, result, swap_unit.x, swap_unit.y, drag_page_idx, W.page_idx);
					// 非法, 看错误信息
					if (!result) {
						return;
					}
					swap.removeClass('swap');
					drag_grid.style.left = result.dg.x * gridSize.w + 'px';
					drag_grid.style.top = result.dg.y * gridSize.h + 'px';
					swap.addClass('drop');
					for (var i = 0; i < result.sg.length; i++) {
						var tmp = $('#' + result.sg[i].id);
						tmp[0].style.left = result.sg[i].x * gridSize.w + 'px';
						tmp[0].style.top = result.sg[i].y * gridSize.h + 'px';
					}
					// 跨页
					if (drag_page_idx != W.page_idx) {
						var pages = $('.page');
						$('.page[idx="' + W.page_idx + '"] > ul').append(drag_grid);
						$('.page[idx="' + drag_page_idx + '"] > ul').append(swap);
					}
					setTimeout(function (dg) {
						drag_div.removeClass('drop').hide();
						dg.style.visibility = 'visible';
					}, 200, drag_grid);
				}
				// 不能交换
				else {
					reposition();
				}
			}
			// 清除各种定时延时
			swap_timeout = clearTimeout(swap_timeout);
			slide_timeout = clearTimeout(slide_timeout);
			slide_interval = clearInterval(slide_interval);
			drag_grid = null;
		};

		// grid draging
		$(document).on('mousemove', dragGridMoveFunc);

		// grid drop
		$(document).on('mouseup', dragGridMouseUpFunc);
	});

	// nav drag
	$('#page-nav').delegate('.grid-nav', 'mousedown', function (e) {
		if (e.button != 0) {
			return;
		}
		var that = $(this);
		// 本身在编辑状态不能拖
		if (that.hasClass('edit')) {
			return;
		}
		var idx = parseInt(that.attr('idx'));
		// 原始点坐标
		origin_x = e.pageX;
		origin_y = e.pageY;
		// 拖拽前的计算
		var rect = this.getBoundingClientRect();
		var len = $('#page-nav .grid-nav').length;
		var num;
		var sign;

		var dragNavMoveFunc = function (e) {
			// 移动坐标大于4才生效
			if (drag_div[0].style.display != 'block' && Math.abs(e.pageX - origin_x) > 4) {
				// 显示drag div
				that[0].style.visibility = 'hidden';
				drag_div.html(that[0].outerHTML);
				drag_div.find('> a').removeAttr('idx').css({visibility: 'visible'});
				drag_div[0].style.left = (rect.left + 1) + 'px';
				drag_div[0].style.top = rect.top + 'px';
				drag_div.show();
			}
			if (drag_div[0].style.display != 'block') {
				return;
			}
			var marginW = 0;
			drag_div[0].style.left = (e.pageX - origin_x + rect.left) + 'px';
			num = (e.pageX - rect.left + idx * (rect.width + marginW)) / (rect.width + marginW);
			sign = (num > 0) && (num < len) && (parseInt(num) != idx);
			$('.grid-nav').removeClass('nav-swap');
			if (sign) {
				num = num >> 0;
				$('.grid-nav[idx="' + num + '"]').addClass('nav-swap');
			}
			else {
				num = idx;
			}
		};
		var dragNavMouseUpFunc = function (e) {
			var numJQ = $('.grid-nav[idx="'+num+'"]');
			// 解除事件
			$(document).off('mousemove', dragNavMoveFunc).off('mouseup', dragNavMouseUpFunc);
			if (drag_div[0].style.display != 'block') {
				return;
			}
			drag_div.addClass('drop');
			if (sign) {
				$('.grid-nav').removeClass('nav-swap');
				drag_div[0].style.left = (rect.left+(num-idx)*(rect.width)) + 'px';
				numJQ.css(
					{'-webkit-transform': 'translateX('+(rect.width)*(idx-num)+'px)'}
				);
			}
			else {
				drag_div[0].style.left = rect.left + 'px';
			}
			setTimeout(function () {
				drag_div.removeClass('drop').hide();
				if (sign) {
					numJQ.removeAttr('style').css({'width': rect.width});
					W.mxQA.logic.swapPage(idx, num);
				}
				$('.grid-nav[idx="'+num+'"]').css({'visibility': 'visible'});
			}, 200);
		};

		// draging
		$(document).on('mousemove', dragNavMoveFunc);
		// drop
		$(document).on('mouseup', dragNavMouseUpFunc);
	});

	/* nav脱离编辑状态 */

	// 保存
	$('#page-nav').delegate('.edit input', 'keydown', function (e) {
		var thisJQ = $(this);
		if (e.keyCode == 13) {
			thisJQ.blur();
		}
		else if (e.keyCode == 27) {
			thisJQ.val(thisJQ.parent().attr('title'));
			thisJQ.blur();
		}
	});
	$('#page-nav').delegate('.edit input', 'blur', function () {
		var pJQ = $(this.parentElement);
		var value = this.value.trim();
		var idx = parseInt(pJQ.attr('idx'));
		W.mxQA.api.modifyNavTitle(idx, value);
		value = W.mxQA.tool.encodeHtml(value) || W.mxQA.api.getLang('BlankPage');
		pJQ.removeClass('edit').attr('title', value).html(value);
	});

	// 打开网址
	$('#page-area').delegate('.grid', 'click', function (e) {
		if (e.button != 0 || this.getAttribute('grid-type') == '2') {
			return;
		}
		W.mxQA.logic.openTab($(e.target).parents('.grid')[0], e.button);
	});
	// $('#page-area').delegate('.grid', 'mouseup', function (e) {
	// 	if (e.button != 1 || this.getAttribute('grid-type') == '2') {
	// 		return;
	// 	}
	// 	W.mxQA.logic.openTab(e.target.parentElement, e.button);
	// });
	$('#page-area').delegate('.grid-bg > a', 'click', function (e) {
		W.mxQA.logic.openTab($(e.target).parents('.grid')[0], e.button);
		e.preventDefault();
		e.stopPropagation();
	});

	/* 右键菜单 */

	// 格子
	$('#page-area').delegate('.grid-bg, .grid-title', 'contextmenu', function (e) {
		var that = $(this);
		var result;
		var gridId = that.parent().attr('id');
		var isTab = W.mxQA.api.getGridTypeById(gridId) == 2 ? false : true;
		var isDisabled = false;
		var isFull = false;
		if (!isTab && that.attr('template-status') == '0') {
			isDisabled = true;
		}
		if (!isTab && W.mxQA.logic.isFullWidget(W.mxQA.api.getGridById(gridId).templateDataId)) {
			isFull = true;
		}
		// 翻页时不响应
		if (!W.slide_sign) {
			return;
		}
		// 判断是否是widget
		if (isTab || (e.target.nodeName != 'INPUT')) {
			result = W.mxQA.api.popGridMenu(e.pageX, e.pageY, isTab, isDisabled, $(e.target).parents('[template-id]').attr('template-id'), $(e.target).parents('[template-data-id]').attr('template-data-id'));
			e.preventDefault();
		}
		switch (result) {
		// 打开
		// case 'open-tab':
		// 	W.mxQA.logic.openTab(that.parent('.grid')[0]);
		// 	break;
		// 编辑
		case 'edit-tab':
			W.mxQA.logic.modifyTab(that.parent('.grid')[0]);
			break;
		// 刷新
		case 'flush-grid':
			var pJQ = that.parent('.grid');
			var grid = W.mxQA.api.getGridById(pJQ.attr('id'));
			if (isTab) {
				W.mxQA.tool.flushTabStyle(pJQ[0], grid, true);
			}
			else {
				W.mxQA.logic.flushWidget(grid.templateDataId);
			}
			break;
		// 删除
		case 'delete-grid':
			W.mxQA.logic.deleteGridByEl(that.parent('.grid')[0]);
			break;
		case 'add-url': 
			W.mxQA.logic.addTab(that.parent()[0], 'widget');
			W.grid_modify_id = gridId;
			W.mxQA.api.ueip('ui', '', 'boxmenuadd', result);
			break;
		// 排序widget
		case 'sort-widget':
			W[TMP_WIDGET_ID].gridSort(that.attr('template-data-id'));
			break;
		// 刷新widget
		case 'flush-widget':
			W.mxQA.widgetAPI.flushWidget(that.attr('template-data-id'));
			break;
		// 撤销widget
		case 'delete-widget':
			var page = W.mxQA.api.getPageData();
			if (W.mxQA.widgetAPI.getWidgetItem(that.attr('template-data-id')).length === 0) {
				W.mxQA.logic.deleteGridByEl(that.parent('.grid')[0]);
			} else if (page.length == W.PAGE_MAX_NUM && !W.mxQA.api.isBlankPage(page.length-1)) {
				W.mxQA.tool.showPopBox('alert', W.mxQA.api.getLang('DismissWidgetErr'));
			} else {
				W.mxQA.tool.showPopBox('confirm', W.mxQA.api.getLang('ConfirmDismissWidget'), function () {
					W.mxQA.widgetAPI.deleteWidget(that.attr('template-data-id'));
					W.mxQA.logic.deleteGridByEl(that.parent('.grid')[0]);
				});
			}
			W.mxQA.api.ueip('ui', '', 'boxmenucancel', result);
			break;
		}
		// ueip
		W.mxQA.api.ueip('ui', '', 'contentrightmenu', result, isTab.toString(), '', '');
	});
	// title, 空格子不出菜单
	$('#page-area').delegate('.grid-empty', 'contextmenu', function (e) {
		e.preventDefault();
	});
	// nav
	$('#page-nav').delegate('.grid-nav:not(.edit)', 'contextmenu', function (e) {
		e.preventDefault();
		if (!W.slide_sign) {
			return;
		}
		var result = W.mxQA.api.popNavMenu(e.pageX, e.pageY);
		var that = $(this);
		var idx;
		if (result == 'rename-nav') {
			var value = that.html();
			that.addClass('edit');
			that.html('<input type="text" value="' + W.mxQA.tool.encodeHtml(value) + '" maxlength="20"/>');
			that.find('input').focus();
		}
		else if (result == 'delete-nav') {
			var page = W.mxQA.api.getPageData();
			if (page.length <= 1) {
				W.mxQA.tool.showPopBox('alert', W.mxQA.api.getLang('MinPageNumTip'));
			}
			else {
				idx = parseInt(that.attr('idx'));
				W.mxQA.tool.showPopBox('confirm', W.mxQA.api.getLang('ConfirmDel'), function () {
					W.mxQA.logic.deletePageByIdx(idx);
				});
			}
		}
		// ueip
		W.mxQA.api.ueip('ui', '', 'navrightmenu', result, '', '', '');
	});

	// 添加
	$('#page-area').delegate('.grid-empty', 'click', function (e) {
		if (e.button != 0 || !W.page_template_data) {
			return;
		}
		W.mxQA.logic.addTab(e.target.parentElement);
		e.stopPropagation();
	});

	// 删除
	$('#page-area').delegate('.grid-title button.delete', 'click', function (e) {
		W.mxQA.logic.deleteGridByEl(e.target.parentElement.parentElement);
		// ueip
		W.mxQA.api.ueip('ui', '', 'hoverdelete', '', '', '', '');
		e.stopPropagation();
	});

	// 修改
	$('#page-area').delegate('.grid-title button.edit', 'click', function (e) {
		W.mxQA.logic.modifyTab(e.target.parentElement.parentElement);
		// ueip
		W.mxQA.api.ueip('ui', '', 'hoveredit', '', '', '', '');
		e.stopPropagation();
	});

	// widget禁用删除
	$('#page-area').delegate('[template-status="0"] button', 'click', function (e) {
		W.mxQA.logic.deleteGridByEl($(this).parents('.grid')[0]);
	});

	/* grid-add 系列事件 */

	// 切换grid类型
	$('#grid-add header').delegate('span', 'click', function () {
		var thisJQ = $(this);
		thisJQ.addClass('selected').siblings().removeClass('selected');
		$('#grid-add article').hide();
		if (thisJQ.hasClass('nav-grid')) {
			$('#grid-add .grid-add-list').show();
		} else if (thisJQ.hasClass('nav-widget')) {
			$('#grid-add .widget-add-list').show().scrollTop(0);
			var img = thisJQ.find('img');
			if (img.length) {
				mxQA.api.setConfig(RECOMMEND_WIDGET_ADDLIST_ID, page_template_data.widget.recommendWidget.guid);
				img.remove();
			}
		} else {
			$('#grid-add .custom-add-list').show();
			$('#custom-tab ol li:eq(0)').click();
		}
	});
	// 关闭
	$(document).on('keydown', function (e) {
		var opacity = $('#grid-add')[0].style.opacity;
		var display = $('#pop-box')[0].style.display;
		if (e.keyCode == 27) {
			if (opacity == '1') {
				$('#grid-add .close').click();
			}
			if (display == 'block') {
				$('#pop-box button:last-child').click();
			}
		}
		else if (e.keyCode == 13) {
			if (display == 'block') {
				$('#pop-box button:first-child').click();
			}
		}
	});
	$('#grid-add .close').on('click', function (e) {
		grid_add.css({
			'z-index': -1,
			'opacity': 0,
			'-webkit-transition-property': 'none'
		});
		mask_div.css({'z-index': -1, 'opacity': 0});
		// 重置
		$('#grid-add .search-list').show();
		$('#grid-add .no-result').hide();
		$('#custom-url-error').css('visibility', 'hidden');
		$('#custom-url').val('');
		$('#custom-title').val('');
		$('#custom-tab-list').attr('is-show', '0').hide();

		customAddUeipData = {
			type: 'customadd', 
			url: ''
		};
	});
	// 右边列表的滚动时出阴影
	$('#grid-add .search-list').on('scroll', function (e) {
		var that = $(this);
		if (this.scrollTop > 0) {
			that.addClass('scroll-top');
		}
		else {
			that.removeClass('scroll-top');
		}
	});
	// 左边列表点击事件
	$('#grid-add .side').delegate('li', 'click', function (e) {
		var that = $(this);
		var idx = that.attr('idx');
		$('#grid-add-search').val('');
		if (!isNaN(idx)) {
			idx = parseInt(idx);
			$('#grid-add .search-list').show();
			$('#grid-add .no-result').hide();
			W.mxQA.logic.buildGridList(W.page_template_data.grid[idx].content);
			that.addClass('selected').siblings().removeClass('selected');
			$('#grid-add .search-list').scrollTop(0);
		}
	});
	// 没结果时自定义添加
	$('#grid-add-search').on('keydown', function (e) {
		if (e.keyCode == 13) {
			$('#grid-add .no-result button').click();
		}
	});
	$('#grid-add .no-result').delegate('button', 'click', function () {
		var value = $('#grid-add-search').val();
		$('#custom-url').val('');
		$('#custom-title').val('');
		if (W.mxQA.api.isValidUrl(value)) {
			$('#custom-url').val(value);
			setTimeout(function () {
				$('#custom-url').select();
			}, 200);
		} else {
			$('#custom-title').val(value);
			setTimeout(function () {
				$('#custom-title').select();
			}, 200);
		}
		$('#grid-add .nav-custom').click();
		// ueip
		W.mxQA.api.ueip('ui', '', 'quickadd', '', '', '', '');
	});
	// 匹配grid
	$('#grid-add-search').on('input', function (e) {
		var keyword = this.value.trim();
		var li = $('#grid-add .side li');
		li.removeClass('selected');
		if (keyword) {
			W.mxQA.logic.searchGridList(keyword);
		}
		else {
			$('#grid-add .search-list').show();
			$('#grid-add .no-result').hide();
			$(li[0]).addClass('selected');
			W.mxQA.logic.buildGridList(W.page_template_data.grid[0].content);
		}
	});

	// 自定义添加列表
	$('#custom-tab ol li').each(function (i, n) {
		n = $(n);
		var list = $('#custom-tab ul li:eq(' + i + ')');
		n.click(function() {
			$('#custom-tab ol li').removeClass('selected');
			n.addClass('selected');
			$('#custom-tab ul li').hide();
			list.show();
		});
		if (i == 0) {
			n.click(function () {
				W.mxQA.tool.buildAddTabList(W.mxQA.api.getTabList(), list);
			});
		}
	});
	// 验证url
	$('#custom-url').on('blur', function () {
		var el = $('#custom-url-error');
		var url = this.value.trim();
		var sign = W.mxQA.api.isValidUrl(url);
		if (sign || !url) {
			el.css('visibility', 'hidden');
		} else {
			el.css('visibility', 'visible');
		}
	});
	// 点击item
	$('#custom-tab ul').delegate('.item', 'click', function () {
		var that = $(this);
		var url = that.attr('url');
		$('#custom-url-error').css('visibility', 'hidden');
		$('#custom-url').val(url);
		$('#custom-title').val(that.text());
		customAddUeipData.url = url;
		customAddUeipData.type = that.closest('li').attr('data-type');
	});
	// 展开文件夹
	$('#custom-tab ul').delegate('.folder-name', 'click', function () {
		var that = $(this);
		var closest = that.closest('.folder');

		closest.toggleClass('folder-an');

		if (!closest.attr('request')) {
			closest.attr('request', '1');
			W.mxQA.tool.buildAddFavList(W.mxQA.api.getFavItemChildsById(closest.attr('fav-id')), that.siblings(".folder-list"));
		}
	});
	// 自定义添加按钮
	$('#custom-title').on('keydown', function (e) {
		if (e.keyCode == 13) {
			$('#custom-add-btn').click();
		}
	});
	$('#custom-url').on('keydown', function (e) {
		if (e.keyCode == 13) {
			$('#custom-add-btn').click();
		}
	});
	// 点击添加
	$('#grid-add').delegate('.new-grid-mask', 'click', function (e) {
		var guid = $(this).parents('.new-grid').attr('id');
		var gridData = null;
		var data = W.page_template_data;
		var tmp;
		for (var i = 0; i < data.grid.length; i++) {
			tmp = data.grid[i];
			for (var j = 0; j < tmp.content.length; j++) {
				if (tmp.content[j].guid == guid) {
					gridData = tmp.content[j];
					break;
				}
			}
		}
		if (W.grid_modify_id) {
			if (W.mxQA.api.getGridTypeById(W.grid_modify_id) === 2) {
				gridData.guid = W.mxQA.api.getDefaultGridGuid(gridData.url);
				gridData.thumbType = 0;
				//gridData.id = W.mxQA.api.newGuid();
				W[TMP_WIDGET_ID].pushData(W.mxQA.api.getGridById(W.grid_modify_id).templateDataId, gridData);
			} else {
				W.mxQA.api.editTab(W.grid_modify_id, gridData);
				W.mxQA.logic.flushTabHTML(W.grid_modify_id);
			}
		} else {
			gridData.thumbType = 0;
			W[TMP_WIDGET_ID].editData(gridData);
			W.mxQA.api.flushThumb(gridData.url);
		}
		$('#grid-add .close').click();
	});
	$('#custom-add-btn').on('click', function () {
		var url = $('#custom-url').val().trim();
		var title = $('#custom-title').val().trim();
		var sign = W.mxQA.api.isValidUrl(url);
		if (!sign) {
			$('#custom-url-error').css('visibility', 'visible');
			$('#custom-url').focus();
			return;
		}
		if (customAddUeipData.type != 'customadd' && customAddUeipData.url != url) {
			customAddUeipData.type = 'customadd';
		}
		url = W.mxQA.tool.disposeUrl(url);
		var gridData = {};
		gridData.url = url;
		gridData.title = title;
		if (W.grid_modify_id) {
			if (W.mxQA.api.getGridTypeById(W.grid_modify_id) === 2) {
				gridData.guid = W.mxQA.api.getDefaultGridGuid(gridData.url);
				gridData.thumbType = W.mxQA.api.getOption().thumbType;
				//gridData.id = W.mxQA.api.newGuid();
				W[TMP_WIDGET_ID].pushData(W.mxQA.api.getGridById(W.grid_modify_id).templateDataId, gridData);
			} else {
				W.mxQA.api.editTab(W.grid_modify_id, gridData);
				W.mxQA.logic.flushTabHTML(W.grid_modify_id);
			}
		} else {
			gridData.thumbType = W.mxQA.api.getOption().thumbType;
			W[TMP_WIDGET_ID].editData(gridData);
			W.mxQA.api.flushThumb(gridData.url);
		}
		// ueip 需要放在窗口关闭前，因为窗口关闭会重置customAddUeipData
		W.mxQA.api.ueip('ui', '', customAddUeipData.type, title, url, '', '');

		$('#grid-add .close').click();
	});
	$('#grid-add .widget-add-list').delegate('button, .widget-add-recommend img', 'click', function (e) {
		var templateId = $(this).parents('[tid]').attr('tid');
		var grid = W.mxQA.api.getGridById(W.grid_modify_id);
		W.mxQA.logic.addWidget(templateId, grid.x, grid.y);
		W.mxQA.api.ueip('ui', '', 'widgetaddclick', (this.nodeName == 'BUTTON'? 'addbutton': 'addhot'), templateId, '', '');

		var recommend = $('#recommend-widget');
		if (recommend.length && page_template_data.widget.recommendWidget.guid == templateId) {
			recommend.find('span').click();
		}
	});

	/* option 系列事件 */

	// 隐藏option层
	$(document).on('mousedown', function (e) {
		var pos = $('#option-div')[0].compareDocumentPosition(e.target);
		if (pos & 16 || pos == 0) {
			return;
		}
		$('#option-div').hide();
	});
	// option层切换
	$('#option-btn').on('mousedown', function (e) {
		$('#option-div').toggle();
		e.stopPropagation();
	});
	// 背景切换
	$('#option-bg-list').delegate('img', 'click', function (e) {
		var that = $(this);
		var idx = parseInt(that.attr('idx'));
		var src = that.attr('src');
		var option = W.mxQA.api.getOption();
		option.bgIndex = idx;
		W.mxQA.api.saveLayout();
		// 清自定义图
		W.mxQA.api.setLocalItem(W.CUSTOM_BACKGROUND_SIGN, '');
		$('#option-force')[0].checked = false;
		// 切换背景
		W.mxQA.logic.switchBackground(src);
		W.mxQA.logic.switchDarkOrLight();
	});
	// 自定义背景
	$('#option-bg-list').delegate('.custom-bg', 'click', function (e) {
		var imgDialog = W.mxQA.api.getImgDialog();
		if (!imgDialog) {
			return;
		}
		var filePath = imgDialog.open();
		if (!filePath) {
			return;
		}
		filePath = filePath.replace(/\\/g, '/');
		filePath = W.mxQA.api.saveBackgroundImage(filePath, W.IMAGE_MAX_SIZE);
		if (!filePath) {
			W.mxQA.tool.showPopBox('alert', W.mxQA.api.getLang('MaxPicTip'));
			return;
		}
		var emil = filePath.match(/Users\\(guest|[^\\]+@[^\\]+\.[^\\]+|\d+)\\QuickAccess/);
		// 设置用户email以便调用背景图时使用
		W.mxQA.api.setLocalItem(W.USER_EAMIL, emil? emil[1]: '');
		// 设置自定义背景标示
		console.log(filePath.match(/\.[a-zA-Z]+$/)[0]);
		W.mxQA.api.setLocalItem(W.CUSTOM_BACKGROUND_SIGN, filePath.match(/\.[a-zA-Z]+$/)[0]);
		// 切换背景
		filePath = W.mxQA.api.getCustomBGPath() + '?' + Date.now();
		W.mxQA.logic.switchBackground(filePath);
		W.mxQA.logic.switchDarkOrLight();
	});
	// 切换截图类型
	$('[name="option-thumb"]').on('click', function () {
		var page;
		var value = parseInt(this.value);
		W.mxQA.api.switchThumbType(value);
		// tmp widget
		W.mxQA.widgetAPI.switchWidgetThumbType(value);

		page = W.mxQA.api.getPageData();
		page.forEach(function (p, i) {
			var arr = p.content;
			arr.forEach(function (grid, j) {
				var el = document.getElementById(grid.id);
				W.mxQA.tool.flushTabStyle(el, grid);
			});
		});
	});
	// 总在新标签打开
	$('#option-new').on('click', function (e) {
		var value = this.checked ? parseInt(this.value) : 0;
		W.mxQA.api.switchOpen('isNewOpen', value);
	});
	// 隐藏空白格子
	$('#option-hide').on('click', function (e) {
		var value = this.checked ? parseInt(this.value) : 0;
		W.mxQA.api.switchOpen('isHideBlank', value);
		if (value) {
			$('.grid[grid-type="0"]').addClass('hidden');
		}
		else {
			$('.hidden[grid-type="0"]').removeClass('hidden');
		}

		W[TMP_WIDGET_ID] && W[TMP_WIDGET_ID].hideBlank && W[TMP_WIDGET_ID].hideBlank(value);
	});
	// 隐藏快速拨号
	$('#option-hide-qa').on('click', function (e) {
		var value = this.checked ? parseInt(this.value) : 0;
		W.mxQA.api.switchOpen('isHideQuickAccess', value);
		if (value) {
			$('body').addClass('hide-quick-access');
		} else {
			$('body').removeClass('hide-quick-access');
		}
	});
	// 隐藏widget侧边栏
	$('#option-checkbox').delegate('#option-hide-widget-sidebar', 'click', function (e) {
		var value = this.checked ? parseInt(this.value) : 0;
		W.mxQA.api.switchOpen('isHidWidgetSidebar', value);
		$('#widget-sidebar')[value? 'hide': 'show']();
	});
	// 显示节日背景
	$('#option-force').on('click', function (e) {
		var value = this.checked ? parseInt(this.value) : 0;
		var isCustomBG = W.mxQA.api.getLocalItem(W.CUSTOM_BACKGROUND_SIGN);
		var data = W.page_template_data;
		var bgUrl;
		W.mxQA.api.switchOpen('isShowRecommendPic', value);
		if (value) {
			bgUrl = W.mxQA.api.buildTemplateUrl(data.guid, data.background.recommendPic[0], 'data');
			W.mxQA.logic.switchDarkOrLight(data.background.recommendPic[1]);
		} else if (isCustomBG.length) {
			bgUrl = W.mxQA.api.getCustomBGPath();
		} else {
			bgUrl = W.mxQA.api.buildTemplateUrl(data.guid,  data.background.pic[W.mxQA.api.getOption().bgIndex], 'data');
		}
		W.mxQA.logic.switchBackground(bgUrl);
	});

	/* 弹出框关闭事件 */
	$('#pop-box').delegate('button', 'click', function () {
		mask_div.css({'z-index': -1, 'opacity': 0});
		$('#pop-box').hide();
	});

	// 关闭引导
	$('#guide button').click(function () {
		$('#guide').hide();
	});
	$('#guide').click(function () {
		$('#guide').hide();
	});

	// 底层接口事件
    maxthon.browser.QuickAccessService.addUpdateListener(function (evt) {

console.log('事件通知', evt.type, evt);

    	switch(evt.type) {
    	case 0:
    		location.reload();
    		break;
    	case 1:
    		if (!evt.status && !$('[template-id="' + evt.data + '"][template-status]').length) {
    			console.error('模板' + evt.data + '加载失败');
    			return;
    		}
			$('#' + evt.data + '-js').remove();
			$('#' + evt.data + '-css').remove();
			W.mxQA.logic.reloadTemplateFrame(evt.data);
    		break;
    	case 2:
    		if (!evt.status && !$('[template-data-id="' + evt.data + '"][template-status]').length) {
    			console.error('模板数据' + evt.data + '加载失败');
    			return;
    		}
    		switch (evt.data) {
    		// 内置数据
    		case W.PAGE_TEMPLATE_DATA_ID:
				W.mxQA.api.getTemplateData(W.PAGE_TEMPLATE_DATA_ID, function (data) {
					W.page_template_data = W.mxQA.api.filterDataByPNAndProductTypeAndLang(data);
					// 初始化添加界
					W.mxQA.logic.initGridAdd();
					// 初始化设置界面
					W.mxQA.logic.initOption();
				});
    			break;
    		// 更新
    		case W.UPDATE_TEMPLATE_DATA_ID:
    			W.mxQA.logic.tabUpdate();
    			break;
    		default:
    			W.mxQA.logic.reloadTemplateData(evt.data);
    			break;
    		}
    		break;
    	case 3:
    		if (evt.thumbType < 0) {
    			return;
    		}
    		var url = evt.data;
    		var arrJQ;
			// tmp widget
			W.mxQA.widgetAPI.addEventForWidget(evt);

    		arrJQ = $('[url="' + url + '"]');
console.log(evt.data, evt.thumbType, evt.title, arrJQ.length);
    		arrJQ.each(function (i, n) {
    			var id = n.id;
    			var grid = W.mxQA.api.getGridById(n.id);
    			var option = W.mxQA.api.getOption();
    			// 页面元素
				if (grid) {
					if (!grid.title && evt.title) {
						grid.title = evt.title;
						!page_is_default && W.mxQA.api.saveLayout();
					}
					if (evt.thumbType == 0 && grid.thumbType != evt.thumbType) {
						grid.thumbType = evt.thumbType;
						!page_is_default && W.mxQA.api.saveLayout();
					}
					else if (evt.thumbType == 1 && grid.thumbType != evt.thumbType) {
						grid.thumbType = option.thumbType;
						!page_is_default && W.mxQA.api.saveLayout();
					}
					W.mxQA.tool.flushTabStyle(n, grid);
				}
				// 推荐列表里的元素
				else {
					W.mxQA.tool.setAddGridThumb(n, url);
				}
    		});
    		break;
    	case 4:
    		W.mxQA.logic.addTabByAddress();
    		break;
    	}
    });

})(window);