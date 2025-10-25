/*
 * 工具类
 */

;(function (W) {

	// 根据2个坐标生成范围内的单元格数组
	function buildUnitArr(x1, y1, x2, y2) {
		var unitArr = [];
		var minX = Math.min(x1, x2);
		var minY = Math.min(y1, y2);
		var maxX = Math.max(x1, x2);
		var maxY = Math.max(y1, y2);
		for (var j = minY; j <= maxY; j++) {
			for (var i = minX; i <= maxX; i++) {
				unitArr.push(i + ',' + j);
			}
		}
		return unitArr;
	}

	/*
	 * 验证gridArr与unitArr的关系
	 * return
	 *     0 unitArr与gridArr无交集
	 *     1 unitArr包含gridArr
	 *     2 unitArr与gridArr有交集
	 */
	function validateGrid(unitArr, gridArr) {
		var sign = -1;
		for (var i = 0; i < gridArr.length; i++) {
			if (unitArr.indexOf(gridArr[i]) > -1) {
				if (sign == 0) {
					return 2;
				}
				else {
					sign = 1;
				}
			}
			else {
				if (sign == 1) {
					return 2;
				}
				else {
					sign = 0;
				}
			}
		}
		return sign;
	}

	function buildGridHtml(grid) {
		var strArr = [];
		var gridType = W.mxQA.api.getGridTypeById(grid.id);
		var option = W.mxQA.api.getOption();
		strArr.push('<li id="' + grid.id + '" class="grid');
		if (option.isHideBlank == 1 && gridType == 0) {
			strArr.push(' hidden');
		}
		strArr.push('" ');
		strArr.push('grid-type="' + gridType + '" ');
		if (gridType == 2) {
			strArr.push('>');
			strArr.push(buildWidgetHtml(grid));
		}
		else {
			strArr.push('url="' + encodeHtml(grid.url) + '">');
			// 转码
			strArr.push(buildTabHtml(grid));
			// 空格子不需要title
			var title = encodeHtml(grid.title) || encodeHtml(grid.url);
			if (title) {
				strArr.push('<div class="grid-title">');
				strArr.push('<strong>' + title + '</strong>');
				strArr.push('<button class="delete">&nbsp;</button>');
				strArr.push('<button class="edit">&nbsp;</button>');
				strArr.push('</div>');
			}
		}
		strArr.push('</li>');
		return strArr.join('');
	}

	function buildWidgetHtml(grid) {
		var strArr = [];
		strArr.push('<div class="grid-bg loading" ');
		strArr.push('template-id="' + grid.templateId + '" ');
		strArr.push('template-data-id="' + grid.templateDataId + '" ');
		strArr.push('>');
		strArr.push('</div>');
		W.mxQA.logic.reloadTemplateFrame(grid.templateId);
		return strArr.join('');
	}

	function buildTabHtml(grid) {
		var url = grid.url;
		var strArr = [];
		strArr.push('<div ');
		switch (grid.thumbType) {
		// 空
		case 0:
			if (!url) {
				strArr.push('class="grid-empty">');
			}
			else {
				strArr.push('class="grid-bg loading">');
				strArr.push('<a href="' + grid.url + '"></a>');
			}
			break;
		// 截图
		case 1:
			strArr.push('class="grid-bg loading">');
			strArr.push('<a href="' + grid.url + '"></a>');
			break;
		// 色块
		case 2:
			strArr.push('class="grid-bg">');
			strArr.push('<a href="' + grid.url + '"></a>');
			break;
		// 自定义
		case 3:
			break;
		}
		strArr.push('</div>');
		return strArr.join('');
	}

	// color格式 #fff 或 rgb(255,255,255)
	function calculateColorBrightness(color) {
		var avg = 153;
		var reg = /rgb\((\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3})\)/i;
		var r, g, b;
		if (typeof(color) != "string") {
			return avg;
		}
		else if (color.length == 7) {
			r = parseInt(color.substr(1, 2), 16);
			g = parseInt(color.substr(3, 2), 16);
			b = parseInt(color.substr(4, 2), 16);
		}
		else if (reg.test(color)) {
			color = reg.exec(color)[1].split(',');
			r = parseInt(color[0]);
			g = parseInt(color[1]);
			b = parseInt(color[2]);
		}
		else {
			return avg;
		}
		if(isNaN(r) || isNaN(g) || isNaN(b))
			return avg;
		return Math.floor((r + g + b) / 3);
	}

	// 更新grid大小
	function resizeGrid(gridEl, grid) {
		var size = W.GRID_SIZE[W.grid_type];
		gridEl.style.left = grid.x * size.w + 'px';
		gridEl.style.top = grid.y * size.h + 'px';
		gridEl.style.width = grid.w * size.w - W.GRID_BORDER + 'px';
		gridEl.style.height = grid.h * size.h - W.GRID_BORDER + 'px';
		if (W.mxQA.api.getGridTypeById(grid.id) != 2) {
			flushTabStyle(gridEl, grid);
		}
	}

	function flushTabStyle(gridEl, grid, isFlush) {
		var gridJQ = $(gridEl);
		var divJQ = gridJQ.find('.grid-bg');
		isFlush && divJQ.html('<a href="' + grid.url + '"></a>').addClass('loading').removeAttr('style');
		grid.title && gridJQ.find('.grid-title strong').html(encodeHtml(grid.title));
		gridJQ.attr('url', encodeHtml(grid.url));

		// 刷图
		if (grid.thumbType == 1 || (grid.thumbType == 0 && grid.url)) {
			setGridThumb(gridEl, grid.url, isFlush);
		}
		// 刷色块值
		else if (grid.thumbType == 2) {
			if (isFlush) {
				W.mxQA.api.flushThumb(grid.url);

				// 一定时间内未返回抓取结果，用老数据替代
				setTimeout(function () {
					gridJQ.find('.loading').length && setGridFont(gridEl, grid);
				}, 2000);
			} else {
				setGridFont(gridEl, grid);
			}
		}
	}

	function setGridThumb(gridEl, url, isFlush) {
		var gridJQ = $(gridEl);
		var divJQ = gridJQ.find('.grid-bg');
		var isThumbExisted = W.mxQA.api.isThumbExisted(url);

		divJQ.addClass('loading').removeAttr('style').find('a').html('');

		if (isFlush || !isThumbExisted) {
			W.mxQA.api.flushThumb(url, 1);
		}
		
		if (isThumbExisted) {
			if (isFlush) {
				// 一定时间内未返回抓取结果，用老数据替代
				setTimeout(function () {
					gridJQ.find('.loading').length && setGridThumb(gridEl, url);
				}, 2000);
			} else {
				divJQ.css({
					'background-color': 'transparent',
					'background-size': 'cover',
					'background-image': 'url(\'' + W.mxQA.api.getThumbUrl(url) + '\')'
				}).removeClass('loading');
			}
		}
	}

	function setGridFont(gridEl, grid) {
		if (!grid || grid.thumbType != 2) return;

		var size = W.GRID_SIZE[W.grid_type];
		var font = gridEl.querySelector('.grid-bg');
		font.style.lineHeight = size.h - W.GRID_BORDER + 'px';
		font.style.fontSize = size.f + 'em';

		var divJQ = $('#' + grid.id + ' > div:first-child');
		// 还原
		divJQ.removeClass('loading');
		divJQ.html('<a href="' + grid.url + '">' + encodeHtml(grid.title || grid.url) + '</a>');
		divJQ.css({
			'background-size': 'auto',
			'background-image': 'none',
			'background-color': getTabColor(grid.url, grid.title)
		});
	}

	// 设置推荐列表里的图
	function setAddGridThumb(gridEl, url) {
		var divJQ = $(gridEl).find('> div:first-child');
		divJQ.html('');
		divJQ.css({
			'background-size': 'cover',
			'background-image': 'url(\'' + W.mxQA.api.getThumbUrl(url) + '\')'
		});
	}

	function buildPageHtml(data, idx) {
		var strArr = [];
		strArr.push('<div idx="' + idx + '" class="page">');
		strArr.push('<ul>');
		for (var i = 0; i < data.length; i++) {
			strArr.push(buildGridHtml(data[i]));
		}
		strArr.push('</ul></div>');
		return strArr.join('');
	}

	function buildNavHtml(title, idx) {
		var strArr = [];
		if (/^\s*$/.test(title)) {
			title = W.mxQA.api.getLang('BlankPage');
		}
		strArr.push('<a idx="' + idx + '" title="' + title + '"');
		strArr.push(' class="grid-nav');
		if (idx == W.page_idx) {
			strArr.push(' current');
		}
		strArr.push('"');
		strArr.push('>' + encodeHtml(title) + '</a>');
		return strArr.join('');
	}

	function encodeHtml(str) {
	    if (!str) {
	        return '';
	    }
	    return str
	        .replace(/\>/ig, '&gt;')
	        .replace(/\</ig, '&lt;')
	        .replace(/\'/ig, '&#39;')
	        .replace(/\"/ig, '&quot;');
	}

	function decodeHtml(str) {
	    return str
	        .replace('&gt;', '>')
	        .replace('&lt;', '<')
	        .replace('&#39;', '\'')
	        .replace('&quot;', '"');
	}

	function showPopBox(type, str, okFunc) {
		var popBox = $('#pop-box');
		var p = popBox.find('> p:first-child');
		p.removeClass();
		p.html(str);
		var okBtn = popBox.find('.ok');
		var cancelBtn = popBox.find('.cancel');
		if (type == 'alert') {
			okBtn[0].onclick = null;
			p.addClass('alert');
			cancelBtn.hide();
		}
		else if (type == 'confirm') {
			okBtn[0].onclick = function () {
				if (typeof(okFunc) == 'function') {
					okFunc();
				}
			}
			p.addClass('confirm');
			cancelBtn.show();
		}
		// 显示
		$('#mask').css({'z-index': 110, 'opacity': 1});
		popBox.show();
		var rect = popBox[0].getBoundingClientRect();
		popBox.css({'margin-left': -rect.width/2, 'margin-top': -rect.height/2});
	}

	// 根据坐标和widget大小, 获取可以替换的empty grid array
	function getValidEmptyGridArr(gridArr, x, y, w, h) {
		var validEmptyGridArr;
		var emptyGridArr = gridArr.filter(function (n) {
	        if (W.mxQA.api.getGridTypeById(n.id) == 0) {
	            return true;
	        }
	        return false;
	    });
	    // 右下
	    validEmptyGridArr = emptyGridArr.filter(function (n) {
	        if (n.x >= x && n.x <= x+w-1 && n.y >= y && n.y <= y+h-1) {
	            return true;
	        }
	        return false;
	    });
	    if (validEmptyGridArr.length == w*h) {
	        return validEmptyGridArr;
	    }
	    // 左下
	    if (w > 1) {
		    validEmptyGridArr = emptyGridArr.filter(function (n) {
		        if (n.x >= x-w+1 && n.x <= x && n.y >= y && n.y <= y+h-1) {
		            return true;
		        }
		        return false;
		    });
		    if (validEmptyGridArr.length == w*h) {
	        	validEmptyGridArr.x = x-w+1;
		        return validEmptyGridArr;
		    }
	    }
	    // 左上
	    validEmptyGridArr = emptyGridArr.filter(function (n) {
	        if (n.x >= x-w+1 && n.x <= x && n.y >= y-h+1 && n.y <= y) {
	            return true;
	        }
	        return false;
	    });
	    if (validEmptyGridArr.length == w*h) {
        	validEmptyGridArr.x = x-w+1;
        	validEmptyGridArr.y = y-h+1;
	        return validEmptyGridArr;
	    }
	    // 右上
	    if (h > 1) {
		    validEmptyGridArr = emptyGridArr.filter(function (n) {
		        if (n.x >= x && n.x <= x+w-1 && n.y >= y-h+1 && n.y <= y) {
		            return true;
		        }
		        return false;
		    });
		    if (validEmptyGridArr.length == w*h) {
	        	validEmptyGridArr.y = y-h+1;
		        return validEmptyGridArr;
		    }
	    }
	    // 全局
	    emptyGridArr.some(function (m) {
	        validEmptyGridArr = emptyGridArr.filter(function (n) {
	            if (n.x >= m.x && n.x <= m.x+w-1 && n.y >= m.y && n.y <= m.y+h-1) {
	                return true;
	            }
	            return false;
	        });
	        if (validEmptyGridArr.length == w*h) {
	        	validEmptyGridArr.x = m.x;
	        	validEmptyGridArr.y = m.y;
	            return true;
	        }
	        else {
	        	validEmptyGridArr = [];
	        	return false;
	        }
	    });
	    return validEmptyGridArr;
	}

	function getTabColor(url, title) {
		var colorAll = ['#a3a3a3', '#b27e00', '#8d01a2', '#9c030a', '#008bcc', '#084ba7', '#508503', '#3a3a3a'];
		var domain = /https?:\/\/([^\/]+)/.exec(url);
		domain = domain? domain[1]: url;
		
		return colorAll[domain.length % colorAll.length];
	}

	function addGridAnimation(el) {
		var rect = el.getBoundingClientRect();
		var elJQ = $('#grid-add');
		elJQ.css({
			'left': rect.left+rect.width/2>>0,
			'top': rect.top+rect.height/2>>0,
			'opacity': 0,
			'z-index': 111,
			'-webkit-transform': 'translate(-50%, -50%) scale(0)'
		});
		setTimeout(function () {
			elJQ.css({
				'opacity': 1,
				'left': '50%',
				'top': '50%',
				'-webkit-transform': 'translate(-50%, -50%) scale(1)',
				'-webkit-transition-property': 'all'
			});
		}, 50);
	}

	// Half-width characters
	function toHC(str) {
		var tmp = '';
		for(var i = 0; i < str.length; i++) {
			if(str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
				tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
			}
			else {
				tmp += String.fromCharCode(str.charCodeAt(i));
			}
		}
		return tmp;
	}

	function disposeUrl(url) {
		// 设置属性
		if (!/^[a-zA-Z]+:\/\//.test(url) && !/^about:/gi.test(url)) {
			return 'http://' + url;
		}
		return url;
	}

	function buildAddTabListItem(data) {
		var strArr = [];
		strArr.push('<div class="item" url="' + encodeHtml(data.url) + '">');
		strArr.push('<img src="mx://favicon/' + encodeHtml(data.url) + '" ');
		strArr.push('onerror=\'this.src="mx://res/_images/file_16.png";\' />');
		strArr.push(encodeHtml(data.title));
		strArr.push('</div>');
		return strArr.join('');
	}

	function buildAddTabList(list, warp) {
		var strArr = [];
		list.forEach(function (d) {
			strArr.push(buildAddTabListItem(d));
		});
		warp.html(strArr.join(''));
	}

	function buildAddFavList(list, warp) {
		var strArr = [];
		list.forEach(function (d) {
			if (d.isFolder_) {
				strArr.push('<div class="folder" request="" fav-id="' + d.id + '">');
				strArr.push('<div class="folder-name">' + encodeHtml(d.title) + '</div>');
				strArr.push('<div class="folder-list"></div>');
				strArr.push('</div>');
			} else {
				strArr.push(buildAddTabListItem(d));
			}
		});
		warp.html(strArr.join(''));
	}

	W.mxQA = W.mxQA || {};
	W.mxQA.tool = {
		buildUnitArr: buildUnitArr,
		validateGrid: validateGrid,
		buildGridHtml: buildGridHtml,
		calculateColorBrightness: calculateColorBrightness,
		resizeGrid: resizeGrid,
		flushTabStyle: flushTabStyle,
		setAddGridThumb: setAddGridThumb,
		setGridThumb: setGridThumb,
		buildPageHtml: buildPageHtml,
		buildNavHtml: buildNavHtml,
		encodeHtml: encodeHtml,
		decodeHtml: decodeHtml,
		showPopBox: showPopBox,
		getValidEmptyGridArr: getValidEmptyGridArr,
		addGridAnimation: addGridAnimation,
		toHC: toHC, 
		getTabColor: getTabColor, 
		disposeUrl: disposeUrl, 
		buildAddTabList: buildAddTabList, 
		buildAddFavList: buildAddFavList
	};

})(window);
