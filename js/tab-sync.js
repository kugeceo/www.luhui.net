



(function () {
    var iframeDiv;
    var iframe;
    var promptDiv;
    var promptBtn;
    var loadDiv;
    var fixedIframeFunc;
    var tabSyncButton = document.querySelector('#tab-sync');
    var syncManager = maxthon.account.SyncManager;

    if (maxthon.browser.config.ConfigManager.get('maxthon.config', 'browser.global.hidden_cloud_entry') == '1') {
        tabSyncButton.style.visibility = 'hidden';
        return;
    }

    if (maxthon.system.Utility.getKernelMode && maxthon.system.Utility.getKernelMode() != 0) {
        tabSyncButton.style.visibility = 'hidden';
    }


    function fixedIframeFunc() {
        var maxH = document.documentElement.clientHeight -
            tabSyncButton.getBoundingClientRect().bottom - 50;
        var h = iframe.contentDocument.body.clientHeight;
        if (iframe.contentDocument.querySelector('#unlogin')) {
            h = 285;
        }
        else if (iframe.contentDocument.querySelector('#info')) {
            h = 200;
        }
        else if (iframe.contentDocument.querySelector('#noDevice')) {
            h = 230;
            if (iframe.contentDocument.querySelector('.pc-1')) {
                h = 310;
            }
        }
        else {
            h = h > maxH ? maxH : h;
        }
        iframe.style.height = h + 'px';
        loadDiv.style.display = 'none';
        iframe.style.display = 'block';
    }

    function createIframeDiv() {
        iframeDiv = document.createElement('div');
        iframeDivWarp = document.createElement('div');
        promptDiv = document.createElement('div');
        promptBtn = document.createElement('button');
        loadDiv = document.createElement('div');
        iframe = document.createElement('iframe');
        loadDiv.className = "loading";
        iframeDiv.id = 'tab-sync-div';
        iframeDivWarp.id = 'tab-sync-div-warp';
        promptDiv.id = 'tab-sync-prompt-div';
        promptDiv.innerHTML = mxQA.api.getLang('CloudTabsNotOpen');
        promptBtn.innerHTML = mxQA.api.getLang('OpenNow');
        promptDiv.appendChild(promptBtn);
        iframeDivWarp.appendChild(promptDiv);
        iframeDivWarp.appendChild(loadDiv);
        iframeDivWarp.appendChild(iframe);
        iframeDiv.appendChild(iframeDivWarp);
        document.body.appendChild(iframeDiv);
        loadDiv.style.display = 'block';
    }

    function displayTabSync() {
        if (!iframeDiv) {
            createIframeDiv();
            syncManager.queryInfo('tabs');
            promptBtn.addEventListener('click', function (event) {
                event.stopPropagation();
                syncManager.enableSync('tabs', true);
            }, false);
            iframe.onload = function () {
                if (iframe.contentDocument.querySelector('#wrapper')) {
                    fixedIframeFunc();
                }
                else {
                    loadDiv.innerHTML = Data.getLang('quick-access!NoService');
                }
            };
        }

        loadDiv.innerHTML = '';
        loadDiv.style.display = 'block';
        iframe.style.display = 'none';
        iframeDiv.style.display = 'block';

        iframe.src = mx.config.getServer('browser_page_synced_tab_view') +
            '?userid=' +
            maxthon.account.AccountService.getBrowserCurrentAccountInfo().id +
            '&deviceid=' + maxthon.system.Environment.getDeviceID() +
            '&lang=' + ((maxthon.system.Language.load().locale.indexOf('zh-cn') > -1) ? 'cn' : 'en') +
            '&stamp=' + Date.now();
    }

    syncManager.addEventListener(function(data) {
        if (!promptDiv || (data.category && data.category != 'tabs')) return;
        promptDiv.style.display = data.syncEnabled? 'none': 'block';
    });

    tabSyncButton.addEventListener('click', function (event) {
        if (maxthon.browser.config.ConfigManager.currentUser != 'guest') {
          displayTabSync();
        } else {
          maxthon.account.AccountService.showLoginPromptDialog(5);
        }
        event.stopPropagation();
    }, false);

    document.addEventListener('click', function (event) {
        if (iframeDiv && iframeDiv.style.display != 'none') {
            iframeDiv.style.display = 'none';
        }
    }, false);

})();



