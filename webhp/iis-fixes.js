// 修改数据加载函数，适配IIS路径特性
async function loadWebsiteData(category, number) {
    try {
        // IIS下需要完整路径，避免使用相对路径
        const basePath = window.location.pathname.replace(/\/[^\/]*$/, '');
        const url = `${basePath}/data/${category.id}/${number}.json?cache=${config.cacheBuster}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                // 解决IIS的跨域问题
                'X-Requested-With': 'XMLHttpRequest'
            },
            // 确保使用同源请求模式
            mode: 'same-origin'
        });
        
        // 处理IIS特有的404和500错误
        if (!response.ok) {
            if (response.status === 404) {
                console.log(`数据文件不存在: ${url}`);
                return null; // 正常的文件不存在情况
            }
            throw new Error(`服务器错误: ${response.status} (${response.statusText})`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`IIS环境加载失败: ${error.message}`);
        // 提供更详细的错误信息
        if (error.message.includes('Failed to fetch')) {
            console.error('可能的原因: 1.文件路径错误 2.IIS权限问题 3.MIME类型未配置');
        }
        return null;
    }
}

// 修改统计计数逻辑，确保在IIS环境下正确计算
function updateCategoryStatistics() {
    // 强制重新计算所有分类的数量
    config.categories.forEach(category => {
        const count = allWebsites.filter(website => 
            website.categoryId === category.id
        ).length;
        categoryCounts[category.id] = count;
        
        // 直接更新DOM，避免缓存问题
        const countElement = document.querySelector(`.nav-item[data-category="${category.id}"] .count-badge`);
        if (countElement) {
            countElement.textContent = count;
        }
    });
    
    // 更新总计数
    document.getElementById('total-websites').textContent = allWebsites.length;
}

// 添加IIS环境检测和初始化函数
function initIISCompatibility() {
    // 检测是否在IIS环境
    const isIIS = navigator.userAgent.includes('IIS') || 
                 document.location.hostname.includes('.local') ||
                 document.location.pathname.includes('\\\\');
    
    if (isIIS) {
        console.log('检测到IIS环境，启用兼容模式');
        // 调整路径处理方式
        config.useFullPaths = true;
        // 延长超时时间（IIS有时响应较慢）
        config.fetchTimeout = 10000;
    }
}

// 在初始化时调用IIS兼容函数
document.addEventListener('DOMContentLoaded', () => {
    initIISCompatibility();
    init(); // 原来的初始化函数
});
