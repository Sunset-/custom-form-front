function show(src) {
    $('#view-window').remove();
    var $preview = $("<div id='flash-preview' style='width:100%;height:100%;position:absolute;top:0px;z-index:1001;background: rgba(0,0,0,0.6)'><div id='view-window' style='background-color:#FFF;width:800px;height:90%;position:absolute;top:50px;left:50%;margin-left:-400px;'></div></div>");
    $('body').append($preview);
    $('#view-window').FlexPaperViewer({
        config: {
            SWFFile: src,
            Scale: 0.6,
            ZoomTransition: 'easeOut',
            ZoomTime: 0.5,
            ZoomInterval: 0.2,
            FitPageOnLoad: true,
            FitWidthOnLoad: false,
            FullScreenAsMaxWindow: false,
            ProgressiveLoading: false,
            MinZoomSize: 0.2,
            MaxZoomSize: 5,
            SearchMatchAll: false,
            InitViewMode: 'Portrait',
            RenderingOrder: 'flash',
            StartAtPage: '',

            ViewModeToolsVisible: true,
            ZoomToolsVisible: true,
            NavToolsVisible: true,
            CursorToolsVisible: true,
            SearchToolsVisible: true,
            WMode: 'window',
            localeChain: 'zh-CN'
        }
    });
    $preview.on('click', function (event) {
        if ($(event.target).closest('#view-window').length == 0) {
            $('#flash-preview').remove();
        }
    });
    $('#view-window').on('onDocumentLoadedError', function () {
        Sunset.tip('未找到文档', 'warning');
        $('#flash-preview').remove();
    })
}

$('body').on('click', function (ev) {
    var $file = $(ev.target).closest('.file-preview');
    if ($file.length) {
        show($file.attr('data-id'));
    }
});

function getIframeInstance() {
    var $iframeWrap = $('.document-viewer-iframe-wrap');
    if ($iframeWrap.length) {
        return $iframeWrap.show();
    } else {
        $iframeWrap = $('<div class="document-viewer-iframe-wrap"><div style="position: absolute;top: 100px;right: 100px;left: 100px;bottom: 100px;background: #FFF;"><iframe class="document-viewer-iframe" width="100%" height="100%"></iframe><div></div>').css({
            position: 'fixed',
            top: '0px',
            right: '0px',
            left: '0px',
            bottom: '0px',
            background: 'rgba(0,0,0,0.7)',
            'z-index': '999'
        });
        $iframeWrap.on('click', function (evt) {
            if (evt.target.className == 'document-viewer-iframe-wrap') {
                $iframeWrap.hide();
            }
        })
        $iframeWrap.appendTo($('body'));
        return $iframeWrap;
    }
}

GlobalService.openDocument = function (src, type) {
    if (src) {
        if (type == 'html') {
            var $iframe = getIframeInstance();
            $('iframe', $iframe).attr('src', src);
        } else {
            show(src);
        }
    }
};