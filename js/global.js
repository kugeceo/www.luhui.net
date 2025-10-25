/*
 * 涉及全局使用的变量统一写这里, 便于查找
 * 变量命名标准: 一般驼峰命名法, 带有全局性质(包括匿名函数里的伪全局)的用分隔法, 常量大写分隔法
 */

// 存储布局信息的key
const SYNC_KEY_QA = 'qa_layout';

// 存储上次解析正确的布局信息的key
const SYNC_KEY_QA_OLD = 'qa_layout_old';

// 存储widget信息的key
const SYNC_KEY_WIDGET = 'qa_widget';

// 存储上次解析正确的widget信息的key
const SYNC_KEY_WIDGET_OLD = 'qa_widget_old';

// 背景图滑动范围
const SILDE_MAX = -160;

// 每次滑动的大小
const SILDE_VAL = 20;

// grid的size
const GRID_SIZE = {
	S: {w: 188, h: 144, f: 1.625, navW: 85},
	M: {w: 219, h: 167, f: 2, navW: 100},
	L: {w: 292, h: 220, f: 2.625, navW: 120}
};

// grid的边距修正
const GRID_BORDER = 20;

// 判断标准
const WINDOW_STANDARD = {
	S: {w: 1200, h: 600},
	L: {w: 1600, h: 900}
};

// 官方数据id
const PAGE_TEMPLATE_DATA_ID = 'FEA5110B-C37A-4008-861D-44C2C862EB79';

// 官方更新id
const UPDATE_TEMPLATE_DATA_ID = 'B54DEF3D-C637-44B0-882E-6430D662901A';

// 临时特殊widgetid
const TMP_WIDGET_ID = 'DCC906A7-0CE1-47D0-A1D2-9DE4FB5B9261';

// 最大页数
const PAGE_MAX_NUM = 9;

// 图片大小限制 单位M
const IMAGE_MAX_SIZE = 5;

// 用户email
const USER_EAMIL = 'user_email';

// 自定义背景图保存标示
const CUSTOM_BACKGROUND_SIGN = 'custom_background_sign';

// 上次推荐的widget guid
const RECOMMEND_WIDGET_ID = 'recommend_widget_id';

// 上次推荐的widget add list使用 guid
const RECOMMEND_WIDGET_ADDLIST_ID = 'recommend_widget_addlist_id';

// grid的总数
var page_size;
try {
	page_size = JSON.parse(mxQA.api.getItem('qa_page_size'));
}
catch (e) {
	page_size = {w: 4, h: 3};
}

// 是否为预置数据，预置数据不入库同步
var page_is_default = false;

// 官方数据(预置数据, 推荐数据, 背景图)
var page_template_data = null;

// 当前page的idx
var page_idx = 0;

// 变更的grid id
var grid_modify_id = '';

// 滚动标示
var slide_sign = true;

// 当前账号的用户id
var current_user_id = 0;

/* 下面项目每次resize刷新值 */

// grid的类型, 大中小三类,
var grid_type;
// window宽高
var window_width;
var window_height;
// page > ul左上角相对屏幕的位移
var page_left;
var page_top;

