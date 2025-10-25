/**
 * @fileOverview weather
 * @author hanghaining (hanghaining@maxthon.net)
 */

;(function (window) {

    var localCityData;
    var AIR_LEVEL = ['优', '良', '轻度污染', '中度污染', '重度污染', '严重污染'];

    // api url
    var locatingUrl = 'http://quickaccess-apiimg.maxthon.cn/weather/api/js_v5.php';
    var provinceUrl = 'http://quickaccess-dl.maxthon.cn/area/province.json';
    var cityUrl = 'http://quickaccess-dl.maxthon.cn/area/c.{$provinceId}.json';
    var areaUrl = 'http://quickaccess-dl.maxthon.cn/area/station.{$cityId}.json';
    var weatherDataUrl = 'http://quickaccess-apiimg.maxthon.cn/weather/api/data_v5.php';
    var iconPath = 'http://quickaccess-dl.maxthon.cn/weather/';

    var bgMap = {
    	qing: [31, 32, 33, 34, 36], 
    	bingbo: [5, 6, 7, 8, 10, 17, 18, 35], 
    	daxue: [16, 41, 42, 43, 46], 
    	dayu: [11, 12, 45], 
    	duoyun: [27, 28, 29, 30, 44], 
    	feng: [23, 24], 
    	leizhenyu: [0, 1, 2, 3, 4, 37, 38, 39, 40, 47], 
    	wumai: [19, 20, 21, 22], 
    	xiaoxue: [13, 14, 15, 25], 
    	xiaoyu: [9], 
    	yin: [26]
    };


    /**
     * 设置本地城市数据
     * 默认没有第二个参数，默认同步，禁止同步传入true
     */
    function setLocalCityData(value, sync) {
        sync = !sync;
        mxQA.api.setWeather(value, sync);
    }

    /**
     * 根据天气图标号获取应该显示的特效类型
     */
    function getBgType(nb) {
        nb = Number(nb);
        for (var i in bgMap) {
            if (bgMap[i].indexOf(nb) > -1) {
                return i;
            }
        }
        return '';
    }

    /**
     * 获取定位信息
     */
    function getlocatingData(cb) {
        $.ajax({
            url: locatingUrl,
            dataType: 'jsonp',
            success: function (res) {
                cb && cb(res);
            },
            error: function (err) {
                console.error('get weather locating data failed, status: ' + err.status);
            }
        });
    }

    /**
     * 获取省份数据，存localStorage
     */
    function getProvinceData(cb) {
        var str = mxQA.api.getLocalStorage('provinceData');
        var provinceData;
        try {
            provinceData = JSON.parse(str);
        } catch (e) {
            // no local provinceData or local provinceData is error
        }

        if (provinceData) {
            cb(provinceData);
        } else {
            $.ajax({
                url: provinceUrl,
                dataType: 'json',
                success: function (res) {
                    mxQA.api.setLocalStorage('provinceData', JSON.stringify(res));
                    cb && cb(res);
                },
                error: function (err) {
                    console.error('get weather province data failed, status: ' + err.status);
                }
            });        
        }
    }

    /**
     * 获取城市或地区数据
     * @param  {string}     type 城市信息，还是地区信息
     * @param  {Number}     id  省份或城市id
     */
    function getAreaData(type, id, cb) {
        var url = type == 'city'? cityUrl.replace('{$provinceId}', id): areaUrl.replace('{$cityId}', id);
        $.ajax({
            url: url,
            dataType: 'json',
            success: function (res) {
                cb && cb(res);
            },
            error: function (err) {
                console.error('get weather ' + type + ' data failed, status: ' + err.status);
            }
        });        
    }

    /**
     * 获取天气信息
     * @param  {Number}   areaId 地区id
     * @param  {Function} cb     callback
     */
    function getWeatherData(areaId, cb) {
        $.ajax({
            url: weatherDataUrl,
            dataType: 'jsonp',
            data: 'id=' + areaId,
            success: function (res) {
                cb && cb(res);
            },
            error: function (err) {
                console.error('get weather ' + areaId + ' info failed, status: ' + err.status);
            }
        });
    }

    /**
     * 更新本地城市列表数据
     * @param  {Number} areaId   地区id
     * @param  {String} cityName 城市名称
     */
    function updateLocalCityData(data, sync) {
        var areaId = data.cityid;
        var list = localCityData.list;
        if (!$.isArray(list)) {
            list = [];
        } else {
            // 删除已存在的城市
            for (var i = list.length - 1; i >= 0; i--) {
                if (list[i].id === areaId) {
                    list.splice(i, 1);
                }
            }

            while (list.length > 2) {    // 满3个，从顶部删除一个
                list.shift();
            }
        }
        list.push({"id": areaId, "name":data.city});
        localCityData.list = list;
        setLocalCityData(localCityData, sync);
    }

    /**
     * 创建主体html
     */
    function buildMainHtml() {
        var tpl = [
	        '<div id="weather">', 

			    '<div id="weather-today" class="hide loading"></div>', 

                '<div id="weather-info-layer" class="weather-layer"></div>',

			    '<div id="weather-address-layer" class="weather-layer">', 
			        '<div class="province flex-row">', 
			            '<span class="label">省</span>', 
			            '<div class="select">', 
			                '<span class="checked" mid="10101">北京</span>', 
			                '<div class="select-list">', 
			                    '<ul></ul>', 
			                '</div>', 
			            '</div>', 
			        '</div>', 
                    '<div class="city flex-row">', 
                        '<span class="label">市</span>', 
                        '<div class="select">', 
                            '<span class="checked" mid="00">北京</span>', 
                            '<div class="select-list">', 
                                '<ul><li mid="00">北京</li></ul>', 
                            '</div>', 
                        '</div>', 
                    '</div>', 
                    '<div class="area flex-row">', 
                        '<span class="label">区</span>', 
                        '<div class="select">', 
                            '<span class="checked" mid="00">北京</span>', 
                            '<div class="select-list">', 
                                '<ul><li mid="00">北京</li></ul>', 
                            '</div>', 
                        '</div>', 
                    '</div>', 
			        '<div class="btn-group">', 
			            '<button class="confirm">确定</button>', 
			            '<button class="cancel">取消</button>', 
			        '</div>', 
			    '</div>', 

			'</div>'
        ].join('');
        return tpl;
    }

    /**
     * 创建省/市列表
     * @param  {Object} ele province/city对象
     * @param  {Json} data 对应列表数据
     */
    function buildAreaView(ele, data) {
        var checked = ele.find('.checked');
        var ul = ele.find('ul');
        var firstLi;
        var res = '';
        var firstMid = '';
        var arr = [];

        // 下面两个循环是对数据从小到大排序
        // 因为直辖市是五位，海南地区的id是全值九位数，且差别在后三位，所以统一截取mid后三位
        for (var mid in data) {
            arr[Number(mid.substr(-3))] = {
                mid: mid, 
                name: data[mid]
            };
        }
        arr.forEach(function(n) {
            if (n) {
                res += '<li mid="' + n.mid + '">' + n.name + '</li>';
            }
        });

        ul.html(res);
        firstLi = $(ul.find('li').get(0));
        checked.html(firstLi.html()).attr('mid', firstLi.attr('mid'));
    }

    /**
     * 更新区列表
     * @param  {Object} ele city对象
     * @param  {Number} cityId 城市的id
     */
    function updateAreaView(ele, cityId) {
        var area = ele.find('.area');
        getAreaData('area', cityId, function (data) {
            buildAreaView(area, data);
        });
    }

    /**
     * 更新城市列表
     * @param  {Object} ele city对象
     * @param  {Number} provinceId 省份的id
     */
    function updateCityView(ele, provinceId) {
        var city = ele.find('.city');
        getAreaData('city', provinceId, function (data) {
            buildAreaView(city, data);
            updateAreaView(ele, provinceId + (data['00'] ? '00' : '01'));
        });
    }

    /**
     * 根据provinceId和cityId组合areaId
     * @return {String} 返回地区id
     */
    function stringAreaId(pId, cId, aId) {
        var id = '';

        // 海南地区数据会返回全值
        if (aId.length == 9) {
            id = aId;

        // 直辖市市级和地区级颠倒
        } else if (/^1010(1|2|3|4)$/.test(pId)) {
            id = pId + aId + cId;

        // 正常情况
        } else {
            id = pId + cId + aId;
        }
        return id;
    }

    /**
     * 重置city列表：进入添加城市页面时，显示默认列表
     * @param  {type} ele description
     */
    function resetCityView(ele) {
        var checked = ele.find('.city .checked');
        var ul = ele.find('.city ul');
        checked.text('北京').attr('mid', '00');
        ul.html('<li mid="00">北京</li>');
        ul.find('li').click();
    }

    /**
     * 创建今日天气view
     */
    function buildTodayView(data) {
    	var level_title = ['优', '良', '轻度污染', '中度污染', '重度污染', '严重污染'];
	    level_title = level_title[data.aqi.level];

        var html = data.city + ' ' +
            '<img class="img-gray" title="' + data.a_weather + '" src="' + iconPath + 'gray/' + data.a_icon + '.png" alt="">' + 
            '<img class="img-white" title="' + data.a_weather + '" src="' + iconPath + 'white/' + data.a_icon + '.png" alt=""> ' + 
		    data.sk.temp + '℃' + 
		    (data.aqi.aqi? (' <span class="level-' + data.aqi.level + '">' + level_title + '</span> '): '');
        $('#weather-today').html(html);

        html = '<div class="btn clearfix">' +
                	'<span id="weather-address">' + data.city + '</span>' +
                	'<span id="weather-more" data-href="http://i.maxthon.cn/weather?ref=pc&cityId=' + data.cityid + '">未来天气</span>' +
                '</div>' +
                '<div class="info">' +
                	'<img src="http://quickaccess-dl.maxthon.cn/weather/white/' + data.a_icon + '.png" />' +
                	data.a_weather +
                    '<p>' + data.a_temp + '</p>' + 
                    (data.a_speed && data.a_direction? (
                        data.a_speed == '0'? '无风': (data.a_direction + ' ' + data.a_speed + '级')
                    ): '') + 
                '</div>';
        if (data.aqi.aqi) {
            html += '<div class="pm">' +
                        '<div class="scale">' +
                            '<div style="width:' + Math.min(data.aqi.aqi / 5, 100) + '%"></div>' +
                        '</div>' +
                        '空气质量：' + data.aqi.aqi + '' +
                        '<span class="bg-' + data.aqi.level + '">' + level_title + '</span>' +
                    '</div>';
        }
        $('#weather-info-layer').html(html)[0].className = 'weather-layer ' + getBgType(data.a_icon);
    }

    function bindEvent(ele) {
        ele.off();

        // 滑过显示天气特效
        var timer;
        ele.on('mouseenter', '#weather-today', function (e) {
            if (ele.find('#weather-today.loading').length || !ele.find('#weather-address-layer').is(':hidden')) return;
            timer && clearTimeout(timer);
        	timer = setTimeout(function() {
	        	ele.addClass('show-layer');
        	}, 300);
        });
        ele.on('mouseleave', '#weather-today', function (e) {
            timer && clearTimeout(timer);
            timer = setTimeout(function() {
                ele.removeClass('show-layer');
            }, 300);
        });
        ele.on('mouseenter', '#weather-info-layer', function (e) {
            timer && clearTimeout(timer);
        });
        ele.on('mouseleave', '#weather-info-layer', function (e) {
            timer = setTimeout(function() {
                ele.removeClass('show-layer');
            }, 300);
        });

        // 显示城市列表
        ele.on('click', '#weather-address', function (e) {
            ele.removeClass('show-layer');
        	var layer = ele.find('#weather-address-layer');
        	if (layer.is(':hidden')) {
	        	setTimeout(function () {
		        	layer.show();
	        	}, 30);
        	}
        });

        // 打开更多天气页面
        ele.on('click', '#weather-more', function (e) {
            e.preventDefault();
            open($(this).attr('data-href'));
            mxQA.api.ueip('ui', '', 'webweather', 'clickmore');
        });

        // 点击关闭添加城市窗口
        ele.on('click', '.cancel, .confirm', function () {
            ele.find('#weather-address-layer').hide();
        });

        // 显示下拉列表
        ele.on('click', '.checked', function (e) {
            e.stopPropagation();
            var $this = $(this);
            var selectList = $this.next('.select-list');
            ele.find('.select-list').not(selectList).hide();
            selectList.toggle();
        });

        // 点击下拉列表
        ele.on('click', '.select-list li', function (e) {
            var $this = $(this);
            var selectList = $this.parents('.select-list');
            var checked = selectList.prev('.checked');
            checked.html($this.text()).attr('mid', $this.attr('mid'));

            if (selectList.parents('.province').length) {
                updateCityView(ele, $this.attr('mid'));
            }

            if (selectList.parents('.city').length) {
                updateAreaView(ele, ele.find('.province .checked').attr('mid') + $this.attr('mid'));
            }
        });

        // 添加城市
        ele.on('click', '.confirm', function () {
            var provinceChecked = ele.find('.province .checked');
            var cityChecked = ele.find('.city .checked');
            var areaChecked = ele.find('.area .checked');
            var areaId = stringAreaId(provinceChecked.attr('mid'), cityChecked.attr('mid'), areaChecked.attr('mid'));

            initWeatherPage(ele, areaId, updateLocalCityData);

            // ueip
            var name = [areaChecked.text(), cityChecked.text(), provinceChecked.text()].join();
            mxQA.api.ueip('ui', '', 'webweather', 'cityadd', '', '', '{"cityname": "' + name + '"}');
        });

        // 关闭下拉
        ele.on('click', '.weather-layer', function (e) {
            e.stopPropagation();
            $(this).find('.select-list').hide();
        });

        // 阻止滚动事件冒泡
        ele.on('mousewheel', '.weather-layer', function (e) {
            e.stopPropagation();
        });

        $(document).off('click', hideLayer).on('click', hideLayer);
        $(document).off('mousewheel', hideLayer).on('mousewheel', hideLayer);

        function hideLayer() {
            ele.find('.select-list, #weather-address-layer').hide();
        }
    }

    /**
     * 初始化天气信息
     * @param  {Object} ele    weather对象
     * @param  {Number} areaId 地区id
     * @param  {Function} cb callback(ueip/更新城市列表)
     */
    function initWeatherPage(ele, areaId, cb, sync) {
        if (!/^\d{9}$/g.test(areaId)) {
            console.warn('areaId is invalid, areaId:' + areaId);
        }

        var today = ele.find('#weather-today');
        today.html('').addClass('loading');
        getWeatherData(areaId, function (res) {
        	res = res.data;
            buildTodayView(res);
        	today.removeClass('loading hide');
            // 更新顶部当前城市
            localCityData.current = areaId;
            setLocalCityData(localCityData, sync);
            cb && cb(ele, res);
        });
    }

    /**
     * 初始化添加城市页面
     */
    function initAddCityPage(ele) {
        getlocatingData(function (res) {
            var areaId = '101010100';    // default
            if (res._weather_cityid) {
                areaId = res._weather_cityid;
            }
            resetCityView(ele);
            updateByAreaId(areaId);
        });

        function updateByAreaId(areaId) {
            var province = ele.find('.province');
            var provinceId = areaId.substring(0, 5);
            getProvinceData(function (data) {
                buildAreaView(province, data);
            });            
        }
    }

    function init(ele) {
        localCityData = mxQA.api.getWeather() || {};

        var weather = $(buildMainHtml());
        bindEvent(weather);

        // 本地数据类型有误，重置本地数据
        if (!$.isArray(localCityData.list)) {
            mxQA.api.setLocalStorage('localCityData', '');
            localCityData = {};
        }

        if (!localCityData.current) {
            getlocatingData(function (res) {
                var areaId = '101010100';
                if (res._weather_cityid) {
                    areaId = res._weather_cityid;
                }
                initWeatherPage(weather, areaId, function (ele, data) {
                    updateLocalCityData(data, page_is_default);
                    ueip('auto');
                }, page_is_default);
            });
        } else {
            initWeatherPage(weather, localCityData.current, function (ele, data) {
                ueip('manual');
            });
        }

        initAddCityPage(weather);

        $(ele).append(weather);

        setInterval(function() {
            if (!localCityData.current) return;
        	initWeatherPage(weather, localCityData.current, false, page_is_default);
        }, 1000 * 60 * 60);

        function ueip(type) {
            var cityName = weather.find('#weather-address').html();
            mxQA.api.ueip('ui', '', 'webweather', 'citylist', '1', type, '{"cityname": "' + cityName + '"}');
        }
    }

	window.mxQA = window.mxQA || {};
	window.mxQA.weather = {
		init: init
	};

})(window);