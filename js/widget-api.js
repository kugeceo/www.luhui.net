/*
 * 供widget调用的api
 */

;(function (W) {

	var qaWidget = {};

	function getWidgetData() {
		try {
			qaWidget = JSON.parse(W.mxQA.api.getItem(SYNC_KEY_WIDGET));
		} catch (e) {
			console.error(SYNC_KEY_WIDGET, 'format error', e);
			try {
				qaWidget = JSON.parse(W.mxQA.api.getItem(SYNC_KEY_WIDGET_OLD));
				W.mxQA.api.setItem(SYNC_KEY_WIDGET, qaWidget);
			} catch (e) {
				console.error(SYNC_KEY_WIDGET_OLD, 'format error', e);
				!page_is_default && W.mxQA.api.setItem(SYNC_KEY_WIDGET, qaWidget);
			}
		}
		!page_is_default && W.mxQA.api.setItem(SYNC_KEY_WIDGET_OLD, qaWidget); // 每次都备份格式正确的数据
	}

	function setWidgetItem(key, value) {
		if (value) {
			qaWidget[key] = value;
		}
		else {
			delete qaWidget[key];
		}
		page_is_default = false;
		W.mxQA.api.setItem(SYNC_KEY_WIDGET, qaWidget);
	}

	function getWidgetItem(key) {
		return qaWidget[key];
	}

	function addEventForWidget(evt) {
		var sign;
		var arr;
		var option = W.mxQA.api.getOption();
		for (key in qaWidget) {
			if (!qaWidget.hasOwnProperty(key)) {
				continue;
			}
			arr = qaWidget[key];
			arr.forEach(function (n) {
				if (evt.data == n.url) {
					// 不一样时修改并保存
					if (evt.thumbType == 0 && n.thumbType != evt.thumbType) {
						n.thumbType = evt.thumbType;
					}
					else if (evt.thumbType == 1 && n.thumbType != evt.thumbType) {
						n.thumbType = option.thumbType;
					}
					if (n.title == '') {
						n.title = evt.title;
					}
					W[TMP_WIDGET_ID] && W[TMP_WIDGET_ID].flushThumb && W[TMP_WIDGET_ID].flushThumb(key, {
						title: n.title,
						url: n.url,
						thumbType: n.thumbType
					});
				}
			});
			setWidgetItem(key, arr);
		}
	}

	function switchWidgetThumbType(to) {
		var sign;
		var from = 3 - to;
		for (key in qaWidget) {
			if (!qaWidget.hasOwnProperty(key)) {
				continue;
			}
			sign = false;
			arr = qaWidget[key];
			arr.forEach(function (n) {
				if (n.thumbType == from) {
					sign = true;
					n.thumbType = to;
					W[TMP_WIDGET_ID] && W[TMP_WIDGET_ID].flushThumb && W[TMP_WIDGET_ID].flushThumb(key, {
						title: n.title,
						url: n.url,
						thumbType: n.thumbType
					});
				}
			});
			if (sign) {
				setWidgetItem(key, arr);
			}
		}
	}

	function deleteWidget(guid) {
		var page = W.mxQA.api.getPageData();
		var idx = page.length - 1;
		var gridList = getWidgetItem(guid);
		if (gridList.length) {
			if (W.mxQA.api.isBlankPage(idx)) {
				page = W.mxQA.api.replacePageContent(idx, gridList);
				$('#page-area .page:last-child').remove();
				$('#page-nav .grid-nav:nth-child(' + (idx + 1) + ')').remove();
			}
			else {
				page = W.mxQA.api.addNewPage(gridList);
				idx++;
			}
			W.mxQA.logic.addNewPage(page[idx], idx);
			// 事件
			setTimeout(function () {
				$('#page-nav [idx="' + idx + '"]').click();
			}, 100);
		}
		setWidgetItem(guid, '');
	}

	function flushWidget(guid) {
		W[TMP_WIDGET_ID].setLoading(guid);
		qaWidget[guid].forEach(function (n) {
			W.mxQA.api.flushThumb(n.url, 1);
		});
	}

	function dragOut(widgetDataGuid, json, str) {

		// 更新移动拖拽个子数据
		var w = GRID_SIZE[grid_type].w - GRID_BORDER;
		var h = GRID_SIZE[grid_type].h - GRID_BORDER;
		var html = '<div class="grid drag-widget-out" style="width: ' + w + 'px; height: ' + h + 'px; ';
		if (json.thumbType == 2) {
			html += 'background: '+str+'">'+json.title+'</div>';
		}
		else {
			html += 'background-image: url('+str+')"></div>';
		}
		var drag_div = $('#drag');
		drag_div.html(html);
		var size = GRID_SIZE[grid_type];
		var font = drag_div[0].querySelector('.drag-widget-out');
		font.style.lineHeight = size.h - W.GRID_BORDER + 'px';
		font.style.fontSize = size.f + 'em';
		drag_div.removeClass('drop');
		drag_div.show();

		// 记录drag page idx
		var drag_page_idx = W.page_idx;
		// 原始点坐标
		var swap_timeout;
		var swap_unit = {};

		var dragGridMoveFunc = function (e) {
			// 去掉hidden
			var option = W.mxQA.api.getOption();
			if (option.isHideBlank) {
				$('.hidden[grid-type="0"]').removeClass('hidden');
			}

			var l = e.pageX - w / 2;
			var t = e.pageY - h / 2;
			drag_div[0].style.left = l + 'px';
			drag_div[0].style.top = t + 'px';

			var swap = $('.swap');
			var swapFunc = function (id, x, y) {
				var gridSize = W.GRID_SIZE[W.grid_type];
				// 体验更好
				x = x - W.page_left + gridSize.w / 2;
				y = y - W.page_top + gridSize.h / 2;

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
			if (swap.length) {
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
			}
			// 解除事件
			$(document).off('mousemove', dragGridMoveFunc).off('mouseup', dragGridMouseUpFunc);
			if (drag_div[0].style.display == 'block') {
				var canDragIn = $('.can-dragin');
				var swap = $('.swap');
				var gridSize = W.GRID_SIZE[W.grid_type];
				// 拖入优先
				if (canDragIn.length) {
					W[TMP_WIDGET_ID].pushData(canDragIn.attr('template-data-id'), W.mxQA.api.getGridById(drag_grid.id));
					drag_div.hide();
					drag_grid.style.visibility = 'visible';
					$('.can-dragin').removeClass('can-dragin');
					W.mxQA.logic.deleteGridByEl(drag_grid);
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
	}

	function addOrModify(el, json) {
		if (json) {
			W.mxQA.logic.modifyTab(el, 'widget', json);
		} else {
			W.mxQA.logic.addTab(el, 'widget');
		}
	}

	function pushWidgetSidebar(tid) {
		mxQA.api.ueip('ui', '', 'sidebar', 'redshow', tid);

		// 当前页是这个模板widget不加小红点儿
		var page = mxQA.api.getPageData();
		var grid = page[page_idx].content[0];
		if (grid && grid.templateId == tid) return;

		mxQA.api.setLocalItem('widget-sidebar-' + tid, '');
		$('#widget-sidebar li[tid="' + tid + '"]').addClass('mark');


	}

	W.mxQA = W.mxQA || {};
	W.mxQA.widgetAPI = {
		getWidgetData: getWidgetData,
		setWidgetItem: setWidgetItem,
		getWidgetItem: getWidgetItem,
		addEventForWidget: addEventForWidget,
		switchWidgetThumbType: switchWidgetThumbType,
		deleteWidget: deleteWidget,
		flushWidget: flushWidget, 
		dragOut: dragOut, 
		addOrModify: addOrModify, 
		pushWidgetSidebar: pushWidgetSidebar
	};

})(window);