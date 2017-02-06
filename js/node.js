$().ready(function() {
    initDropdown('create'); //初始化下拉栏
});


function initDropdown(prefix){
    $('#'+prefix+'-belong').next('div').find('button').click(function(){
        var $elem = $(this);
        if($elem.next('ul.dropdown-menu').length) return;
        $.ajax({
            url: './json/category/0.json',
            type: 'GET',
            dataType: 'json',
            success: function(data){
                if (data) {
                    $elem = $('<ul class="dropdown-menu" role="menu"></ul>').insertAfter($elem);
                    $elem.append('<li class="dropdown-header">分类</li>');
                    //分类
                    $.each(data, function(i, obj){
                        $('<li ajax="false" myid="'+obj.id+'"><a href="javascript:void(0);">'+obj.title+'</a></li>').appendTo($elem)
                            .addClass('dropdown-submenu')
                            .click(function(e){
                                $(this).parents('.open').eq(0).removeClass('open');
                                $('#'+prefix+'-pid').val(0); //选择分类则pid为0
                                $('#'+prefix+'-belong').val($(this).children('a').text());
                                $('#'+prefix+'-cid').val($(this).attr('myid'));

                                $('#'+prefix+'-category').val($(this).children('a').text());
                                $('#'+prefix+'-parent').val('Root');
                            });
                    });
                    initSubmenu($elem, prefix);
                }
            }
        });
    });
}

function initSubmenu($elem, prefix) {
    //$elem是class为dropdown-menu的ul
    var clock;
    var timeout = 500;
    $elem.find('.dropdown-submenu').hover(function(){
        var $menu = $(this); //menu是当前的li
        //判断是否请求过
        if($menu.attr('ajax') == "true") return;
        clock = setTimeout(function(){
            //加载子分类
            var subCateAjax = $.ajax({
                url: "./json/category/"+$menu.attr('myid')+".json",
                type: 'GET',
                dataType: 'json',
                success: function(data){
                    if (data) {
                        if ($menu.children('ul').length == 0) {
                            $elem = $('<ul class="dropdown-menu" role="menu"></ul>').appendTo($menu);
                        }
                        //分类
                        $.each(data, function(i, obj){
                            var index = data.length - 1 - i;
                            $('<li ajax="false" myid="'+data[index].id+'"><a href="javascript:void(0);">'+data[index].title+'</a></li>').prependTo($elem)
                                .addClass('dropdown-submenu')
                                .click(function(e){
                                    //点击分类，则pid为0，cid为该分类id
                                    e.stopPropagation();
                                    $(this).parents('.open').eq(0).removeClass('open');
                                    $('#'+prefix+'-pid').val(0);
                                    $('#'+prefix+'-belong').val($(this).children('a').text());
                                    $('#'+prefix+'-cid').val($(this).parent().parent().attr('myid'));

                                    $('#'+prefix+'-category').val($(this).parent().parent().children('a').text());
                                    $('#'+prefix+'-parent').val('Root');
                                });
                        });
                        $elem.prepend('<li class="dropdown-header">分类</li>');
                    }    
                }
            });
            //加载章节
            var subNodeAjax = $.ajax({
                url: "./json/node/"+$menu.attr('myid')+".json",
                type: 'GET',
                dataType: 'json',
                success: function(data){
                    if (data) {
                        if ($menu.children('ul').length == 0) {
                            $elem = $('<ul class="dropdown-menu" role="menu"></ul>').appendTo($menu);
                        }

                        $elem.append('<li class="dropdown-header">章节</li>');
                        $.each(data, function(i, obj){
                            $('<li myid="'+obj.id+'"><a href="javascript:void(0);">'+obj.title+'</a></li>').appendTo($elem)
                                .click(function(e){
                                    //点击章节，则cid为该章节cid，pid为该章节id
                                    e.stopPropagation();
                                    $(this).parents('.open').eq(0).removeClass('open');
                                    $('#'+prefix+'-belong').val($(this).children('a').text());
                                    $('#'+prefix+'-pid').val($(this).attr('myid'));
                                    $('#'+prefix+'-cid').val($(this).parent().parent().attr('myid'));

                                    $('#'+prefix+'-category').val($(this).parent().parent().children('a').text());
                                    $('#'+prefix+'-parent').val($(this).children('a').text());
                                });
                        });
                    }
                }
            });
            //使用when,返回promise，全部执行完毕执行回调函数
            $.when(subCateAjax, subNodeAjax).then(function(){
                $menu.attr('ajax', 'true');
                if($menu.children('ul').length == 0) {
                    $menu.removeClass('dropdown-submenu');
                }
                initSubmenu($elem);
            });
        }, timeout);

    }, function(){
        //清除定时器
        clearTimeout(clock);
    });
}