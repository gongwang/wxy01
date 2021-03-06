//新建显示关联信息
let listAddUser = null;
let listUserGroup = null;
let listDeviceAccount = null;
let listDeviceGroup = null;
let listAppGroup = null;
const page_length = 200;
$('#modal-default3').on('show.bs.modal', function (event) {
    let page_start5 =0;
    let page_start6 =0;
    //新建显示关联用户
    $.ajax({
        url: "../../user/listUser",
        type: "POST",
        dataType: "json",
        data: {
            start: page_start5,
            length: page_length
        },
        success: function (data) {
            var data = data.data;
            for (let item of data) {
                $('#add_user').append( '<div><input value="' + item.id + '" type="checkbox"><span>' + item.username + "[" + item.realname + "]" + '</span></div>')
            }
            RelativeMethods('');//封装的穿梭框函数代码在/bower_components/dist/js/common/relative.js里面4
            listAddUser = $('#add_user').html();//保存显示出来的原本的数据
            //慢加载
            $('#add_user').on("scroll",function () {
                let viewH =$(this).height(),//可见高度
                    contentH =$(this).get(0).scrollHeight,//内容高度
                    scrollTop =$(this).scrollTop();//滚动高度
                if(contentH - viewH - scrollTop <= 60) {
                    page_start5 += 500;
                    $.ajax({
                        url: "../../user/listUser",
                        type: "POST",
                        data: {
                            start: page_start5,
                            length: page_length
                        },
                        success: function (data) {
                            var data = data.data;
                            for (let item of data) {
                                $('#add_user').append( '<div><input value="' + item.id + '" type="checkbox"><span>' + item.username + "[" + item.realname + "]" + '</span></div>')
                            }
                            RelativeMethods('');//封装的穿梭框函数代码在/bower_components/dist/js/common/relative.js里面4
                            listAddUser = $('#add_user').html();//保存显示出来的原本的数据
                        },
                    })
                }
            });
        },
        error: function () {
        }
    })
    //新建用户组显示
    $.ajax({
        url: "../../group/listGroup",
        type: "POST",
        dataType: "json",
        data: {
            "type": 0,
            start: page_start6,
            length: page_length,
        },
        success: function (data) {
            var data = data.data;
            for(let item of data) {
                $('#add_group').append('<div><input value="' + item.id + '" type="checkbox"><span>' + item.name + '</span></div>');
            }
            RelativeMethods(1);//封装的穿梭框函数代码在/bower_components/dist/js/common/relative.js里面
            listUserGroup = $('#add_group').html();//保存显示出来的原本的数据
            //慢加载
            $('#add_group').on("scroll",function () {
                let viewH =$(this).height(),//可见高度
                    contentH =$(this).get(0).scrollHeight,//内容高度
                    scrollTop =$(this).scrollTop();//滚动高度
                if(contentH - viewH - scrollTop <= 60) {
                    page_start6 += 500;
                    $.ajax({
                        url: "../../group/listGroup",
                        type: "POST",
                        data: {
                            "type": 0,
                            start: page_start6,
                            length: page_length,
                        },
                        success: function (data) {
                            var data = data.data;
                            for(let item of data) {
                                $('#add_group').append('<div><input value="' + item.id + '" type="checkbox"><span>' + item.name + '</span></div>');
                            }
                            RelativeMethods(1);//封装的穿梭框函数代码在/bower_components/dist/js/common/relative.js里面
                            listUserGroup = $('#add_group').html();//保存显示出来的原本的数据
                        },
                    })
                }
            });
        },
        error: function () {

        }
    });
});
$('#modal-primary3').on('show.bs.modal', function (event) {
    let page_start7 =0;
    let page_start8 =0;
    let page_start9 =0;
    //设备账号
    $.ajax({
        url: "../../deviceAccount/listDeviceAccountNameIp",
        type: "POST",
        dataType: "json",
        data: {
            start: page_start7,
            length: page_length
        },
        success: function (data) {
            var data = data.data;
            for(let item of data) {
                $('#add_device').append('<div><input value="' + item.device_account_id + '" type="checkbox"><span>' + item.device_name + "[" + item.username + "]" + "[" + item.protocol_name + "]" + '</span></div>');
            }
            RelativeMethods(2);//封装的穿梭框函数代码在/bower_components/dist/js/common/relative.js里面
            listDeviceAccount = $('#add_device').html();//保存显示出来的原本的数据
            //慢加载
            $('#add_device').on("scroll",function () {
                let viewH =$(this).height(),//可见高度
                    contentH =$(this).get(0).scrollHeight,//内容高度
                    scrollTop =$(this).scrollTop();//滚动高度
                if(contentH - viewH - scrollTop <= 60) {
                    page_start7 += 500;
                    $.ajax({
                        url: "../../deviceAccount/listDeviceAccountNameIp",
                        type: "POST",
                        data: {
                            start: page_start7,
                            length: page_length
                        },
                        success: function (data) {
                            var data = data.data;
                            for(let item of data) {
                                $('#add_device').append('<div><input value="' + item.device_account_id + '" type="checkbox"><span>' + item.device_name + "[" + item.username + "]" + "[" + item.protocol_name + "]" + '</span></div>');
                            }
                            RelativeMethods(2);//封装的穿梭框函数代码在/bower_components/dist/js/common/relative.js里面
                            listDeviceAccount = $('#add_device').html();//保存显示出来的原本的数据
                        },
                    })
                }
            })
        },
        error: function () {
        }
    });
    //设备组
    $.ajax({
        url: "../../group/listGroup",
        type: "POST",
        dataType: "json",
        data: {
            type: 1,
            start: page_start8,
            length: page_length,
            name: $('#searchIdG').val(),
        },
        success: function (data) {
            var data = data.data;
            for(let item of data){
                $('#add_devicegroup').append('<div><input value="' + item.id + '" type="checkbox"><span>' +item.name + '</span></div>');
            }
            RelativeMethods(3);//封装的穿梭框函数代码在/bower_components/dist/js/common/relative.js里面
            listDeviceGroup = $('#add_devicegroup').html();//保存显示出来的原本的数据
            //慢加载
            $('#add_devicegroup').on("scroll",function () {
                let viewH =$(this).height(),//可见高度
                    contentH =$(this).get(0).scrollHeight,//内容高度
                    scrollTop =$(this).scrollTop();//滚动高度
                if(contentH - viewH - scrollTop <= 60) {
                    page_start8 += 500;
                    $.ajax({
                        url: "../../group/listGroup",
                        type: "POST",
                        data: {
                            type: 1,
                            start: page_start8,
                            length: page_length,
                            name: $('#searchIdG').val(),
                        },
                        success: function (data) {
                            var data = data.data;
                            for(let item of data){
                                $('#add_devicegroup').append('<div><input value="' + item.id + '" type="checkbox"><span>' +item.name + '</span></div>');
                            }
                            RelativeMethods(3);//封装的穿梭框函数代码在/bower_components/dist/js/common/relative.js里面
                            listDeviceGroup = $('#add_devicegroup').html();//保存显示出来的原本的数据
                        },
                    })
                }
            })
        },
        error: function () {

        }
    })
    //应用
    $.ajax({
        url:"../../apppubAccount/listApppubAccount",
        type: "POST",
        dataType: "json",
        data: {
            start: page_start9,
            length: page_length
        },
        success: function (data) {
            var data = data.data;
            for(let item of data){
                $('#add_app').append('<div><input value="' + item.id + '" type="checkbox"><span>' + item.name + "[" + item.appservername + "]" + '</span></div>')
            }
            RelativeMethods(4);//封装的穿梭框函数代码在/bower_components/dist/js/common/relative.js里面
            listAppGroup =$("#add_app").html();
            //慢加载
            $('#add_app').on("scroll",function () {
                let viewH =$(this).height(),//可见高度
                    contentH =$(this).get(0).scrollHeight,//内容高度
                    scrollTop =$(this).scrollTop();//滚动高度
                if(contentH - viewH - scrollTop <= 60) {
                    page_start9 += 500;
                    $.ajax({
                        url:"../../apppubAccount/listApppubAccount",
                        type: "POST",
                        data: {
                            start: page_start9,
                            length: page_length
                        },
                        success: function (data) {
                            var data = data.data;
                            for(let item of data){
                                $('#add_app').append('<div><input value="' + item.id + '" type="checkbox"><span>' + item.name + "[" + item.appservername + "]" + '</span></div>')
                            }
                            RelativeMethods(4);//封装的穿梭框函数代码在/bower_components/dist/js/common/relative.js里面
                            listAppGroup =$("#add_app").html();
                        },
                    })
                }
            })
        },
        error: function () {

        }
    })
});
//时间初始化管理
let locale = {
    "format": 'YYYY-MM-DD',
    "applyLabel": "确定",
    "cancelLabel": "取消",
    "fromLabel": "起始时间",
    "toLabel": "结束时间'",
    "weekLabel": "W",
    "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
    "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    "firstDay": 1,
};
//初始化显示当前时间
let date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let minDate = year + "-" + month + "-" + day;
//动态获取截止日期的最小取值范围
function showEndTime() {
    $('#reservation2').daterangepicker(
        {
            'locale': locale,
            showDropdowns: true,
            autoApply: false,
            singleDatePicker: true,
            opens: "right",
            startDate: minDate,
            minDate: $('#reservation').val(),//动态获取截止日期的最小取值范围
        }
    );
}
function showEndTime1() {
    $('#reservation3').daterangepicker(
        {
            'locale': locale,
            showDropdowns: true,
            autoApply: false,
            singleDatePicker: true,
            opens: "right",
            startDate: minDate,
            minDate: $('#reservation1').val(),//动态获取截止日期的最小取值范围
        }
    );
}
//每次点击永久有效就判断 如果为空就显示时间
$('#add_long').click(() => {
    if ($('#add_long').prop('checked') == true) {
        $('#reservation').val('');
        $('#reservation2').val('');
        $('#reservation').prop('disabled', true);
        $('#reservation2').prop('disabled', true);
    } else {
        $('#reservation').prop('disabled', false);
        $('#reservation2').prop('disabled', false);
        $('#reservation').daterangepicker(
            {
                'locale': locale,
                showDropdowns: true,
                autoApply: false,
                singleDatePicker: true,
                opens: "left",
                startDate: minDate,
                minDate: minDate,
            }
        );
        $('#reservation2').daterangepicker(
            {
                'locale': locale,
                showDropdowns: true,
                autoApply: false,
                singleDatePicker: true,
                opens: "right",
                startDate: minDate,
                minDate: minDate,
            }
        );
    }
})
$('#can_long').click(() => {
    if ($('#can_long').prop('checked') == true) {
        $('#reservation3').val('');
        $('#reservation1').val('');
        $('#reservation1').prop('disabled', true);
        $('#reservation3').prop('disabled', true);
    } else {
        $('#reservation1').prop('disabled', false);
        $('#reservation3').prop('disabled', false);
        $('#reservation1').daterangepicker(
            {
                'locale': locale,
                showDropdowns: true,
                autoApply: false,
                singleDatePicker: true,
                opens: "left",
                startDate: minDate,
                minDate: minDate,
            }
        );
        $('#reservation3').daterangepicker(
            {
                'locale': locale,
                showDropdowns: true,
                autoApply: false,
                singleDatePicker: true,
                opens: "right",
                startDate: minDate,
                minDate: minDate,
            }
        );
    }
});
//每次选择改变起始日期就重新判断结束日期的可选范围
$('#reservation').blur(() => {
    showEndTime();
});
$('#reservation1').blur(() => {
    showEndTime1();
});

//修改状态
function editStatus(status, id) {
    $.ajax({
        url: "../../accessPolicy/editStatus",
        type: "POST",
        data: {
            id: id,
            status: status,
        },
        success: function () {
            loadAJAX('#example2');
        }
    })
}
//修改启用禁用并且调用编辑状态的ajax
function switchcase(o, id) {
    if (o.innerText === "启用") {
        o.innerText = "禁用";
        editStatus(1, id);
    } else {
        o.innerText = "启用";
        editStatus(0, id);
    }
}

//获取区域时间范围
$("#selectable").selectable({
    filter: ".blue-background",
    stop: function (event, ul) {
        if ($(".ui-selected").hasClass("gray-background")) {
            let a = document.getElementsByClassName("ui-selected");
            let g = $('.ui-selected.gray-background');
            let b = a.length - g.length;
            if (g.length == a.length || g.length < b) {
                $(".ui-selected").removeClass("gray-background");
            } else {
                $(".ui-selected").addClass("gray-background");
            }
        } else {
            $(".ui-selected").addClass("gray-background");
        }
    }
});
$("#selectable1").selectable({
    filter: ".blue-background",
    stop: function (event, ul) {
        if ($(".ui-selected").hasClass("gray-background")) {
            let a = document.getElementsByClassName("ui-selected");
            let g = $('.ui-selected.gray-background');
            let b = a.length - g.length;
            if (g.length == a.length || g.length < b) {
                $(".ui-selected").removeClass("gray-background");
            } else {
                $(".ui-selected").addClass("gray-background");
            }
        } else {
            $(".ui-selected").addClass("gray-background");
        }
    }
});
//ajax
function AutoSearch(){
    let status = null;
    if ($('#Distinguish').val()==4||$('#Distinguish').val()==1){
        if ($('#searchId').val().trim().match("启")){
            status=1;
        }else if($('#searchId').val().trim().match("禁")){
            status=0;
        }else if($('#searchId').val().trim()==''){
            status='';
        }else{
            status=$('#searchId').val().trim();
        }
    }
    $('#example2').DataTable({
        'paging': true,
        "iDisplayLength": 10,
        'lengthChange': true,
        "lengthMenu": [
            [10, 25, 50, 100], ["10条/页", "25条/页", "50条/页", "100条/页"]
        ],
        'dom': 't<"bottom"lifp><"clear">',
        'searching': false,
        'ordering': false,
        'info': true,
        'autoWidth': false,
        'serverSide': true,
        'destroy': true,
        "ajax": {
            url: "../../accessPolicy/listAccessPolicy",
            data:{
                type:$('#Distinguish').val(),
                sname:$('#searchId').val().trim(),
                stat:status,
            }
        },
        "columns": [
            {
                "data": "id", "render": function (data, type, row, meta) {
                    return '<input name="chk[]" type="checkbox" value=' + data + '>';
                }
            },
            {"data": "name","render":function (data,type, row, meta) {
                    return '<div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 150px;" data-html="true" data-placement="right" data-toggle="tooltip" title="'+data+'">'+data+'</div>'
                }},
            {"data": "depart_name","render":function (data,type, row, meta) {
                    return '<div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 150px;" data-html="true" data-placement="right" data-toggle="tooltip" title="'+row.topName+'">'+data+'</div>'
                }},
            {"data": "desc","render":function (data) {
                    return '<div style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 150px;" data-html="true" data-placement="right" data-toggle="tooltip" title="'+data+'">'+data+'</div>'
            }},
            {
                "data": "status", "render": function (data) {
                    if (data == 0) {
                        return '<span>已禁用</span>';
                    } else {
                        return '<span>已启用</span>';
                    }
                }
            },
            {
                "data": "id", "render": function (data, type, row, meta) {
                    return '<a data-toggle="modal" data-row="' + meta.row + '" class="newcss1" data-target="#modal-default5" style="cursor:pointer" onclick="clear()">编辑</a>' +
                        '<div class="dropdown btn-group" style="margin-left:20px;vertical-align: unset;">' +
                        '<a class="newcss1 dropdown-toggle"  data-toggle="dropdown" style="line-height: 1.5px;cursor:pointer">关联</a>' +
                        '<a class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false" style="line-height: 1.5px;cursor:pointer">' +
                        '<span style="margin-bottom:3px;font-size:14px;" class="caret"></span>' +
                        '<span class="sr-only">Toggle Dropdown</span>' +
                        '</a>' +
                        '<ul class="dropdown-menu" role="menu" style="font-size: 12px">' +
                        '<li><a data-toggle="modal" data-row="' + meta.row + '" data-target="#modal-default6">用户</a></li>' +
                        '<li><a data-toggle="modal" data-row="' + meta.row + '" data-target="#modal-primary7">用户组</a></li>' +
                        '<li><a  data-toggle="modal" data-row="' + meta.row + '"  data-target="#modal-primary8">设备</a></li>' +
                        '<li><a  data-toggle="modal" data-row="' + meta.row + '"  data-target="#modal-primary9">设备组</a></li>' +
                        '<li><a  data-toggle="modal" data-row="'+meta.row+'"  data-target="#modal-primary10">应用</a></li>'+
                        '</ul>' +
                        '</div>' +
                        '<a data-row="' + meta.row + '" class="newcss1" style="cursor:pointer;margin-left: 20px" onclick="switchcase(this,' + row.id + ')">' + (row.status == 0 ? '启用' : '禁用') + '</a>' +
                        '<a>' +
                        '<a data-toggle="modal" data-row="' + meta.row + '" class="newcss2" data-target="#modal-primary" style="cursor:pointer;margin-left: 20px">删除</a>' +
                        '</a>'
                }
            },
        ],
        "fnDrawCallback": function() {
            //全选删除的全选和反全选
            let os=document.getElementsByName('chk[]');
            let allSelects = document.getElementsByTagName('form')[0].getElementsByTagName('input')[0];
            for (let i = 0; i <os.length ; i++) {
                os[i].addEventListener("click",function () {
                    let count = 0;
                    for (let j = 0; j <os.length ; j++) {
                        if (os[j].checked===true){
                            count++
                        }
                    }
                    allSelects.checked=(count === os.length)
                })
            }
            //提示工具
            $('#example2 div').tooltip()
        }
    });
}
AutoSearch();
$('#search').click(function () {
    AutoSearch();
})
/*add look*/
$('#modal-default').on('show.bs.modal', function (event) {
});
// 编辑
$('#modal-default5').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    var i = button.data('row');
    $('#judge_editname').text('');
    $('#Vedit_black').text('');
    $('#edit_id').val($('#example2').DataTable().row('#' + i).nodes(i).data()[i].id);
    $('#edit_desc').html($('#example2').DataTable().row('#' + i).nodes(i).data()[i].desc);
    $('#edit_name').val($('#example2').DataTable().row('#' + i).nodes(i).data()[i].name);
    $('#edit_desc').val($('#example2').DataTable().row('#' + i).nodes(i).data()[i].desc);
    $('#edit_monday_time').val($('#example2').DataTable().row('#' + i).nodes(i).data()[i].timelimit_ban_monday);
    $('#edit_tuesday_time').val($('#example2').DataTable().row('#' + i).nodes(i).data()[i].timelimit_ban_tuesday);
    $('#edit_wednesday_time').val($('#example2').DataTable().row('#' + i).nodes(i).data()[i].timelimit_ban_wednesday);
    $('#edit_thursday_time').val($('#example2').DataTable().row('#' + i).nodes(i).data()[i].timelimit_ban_thursday);
    $('#edit_friday_time').val($('#example2').DataTable().row('#' + i).nodes(i).data()[i].timelimit_ban_friday);
    $('#edit_saturday_time').val($('#example2').DataTable().row('#' + i).nodes(i).data()[i].timelimit_ban_saturday);
    $('#edit_sunday_time').val($('#example2').DataTable().row('#' + i).nodes(i).data()[i].timelimit_ban_sunday);
    var upload = $('#example2').DataTable().row('#' + i).nodes(i).data()[i].file_upload;
    var download = $('#example2').DataTable().row('#' + i).nodes(i).data()[i].file_download;
    var valid_long = $('#example2').DataTable().row('#' + i).nodes(i).data()[i].valid_long;
    if (valid_long == 0) {
        $('#reservation1').val($('#example2').DataTable().row('#' + i).nodes(i).data()[i].valid_datetime_start);
        $('#reservation3').val($('#example2').DataTable().row('#' + i).nodes(i).data()[i].valid_datetime_end);
        $('#reservation1').prop('disabled', false);
        $('#reservation3').prop('disabled', false);
        $("#can_long").prop("checked", false);
    } else {
        $('#reservation1').val("");
        $('#reservation3').val("");
        $('#reservation1').prop('disabled', true);
        $('#reservation3').prop('disabled', true);
        $("#can_long").prop("checked", true);
    }
    if (upload == 0 && download == 0) {
        $('#e_upload').html('不可以' + $('#upload').html() + '&nbsp&nbsp&nbsp不可以' + $('#download').html());
        $('#can_upload').prop('checked', false);
        $('#can_download').prop('checked', false);
    }
    if (upload == 0 && download == 1) {
        $('#e_upload').html('不可以' + $('#upload').html() + '&nbsp&nbsp&nbsp可以' + $('#download').html());
        $('#can_upload').prop('checked', false);
        $('#can_download').prop('checked', true);
    }
    if (upload == 1 && download == 0) {
        $('#e_upload').html('可以' + $('#upload').html() + '&nbsp&nbsp&nbsp不可以' + $('#download').html());
        $('#can_upload').prop('checked', true);
        $('#can_download').prop('checked', false);
    }
    if (upload == 1 && download == 1) {
        $('#e_upload').html('可以' + $('#upload').html() + '&nbsp&nbsp&nbsp可以' + $('#download').html());
        $('#can_upload').prop('checked', true);
        $('#can_download').prop('checked', true);
    }
    let ip1 = $('#example2').DataTable().row('#' + i).nodes(i).data()[i].ban_ip;
    let ip2 = $('#example2').DataTable().row('#' + i).nodes(i).data()[i].allow_ip;
    if (ip1.trim() === '' && ip2.trim() === ''){
        $('#edit_ip').val('0');
        $('.edit_black').val('')
    }else if(ip1.trim() !== ''){
        $('#edit_ip').val('1');
        $('.edit_black').val(ip1)
    }else if(ip2.trim() !== ''){
        $('#edit_ip').val('0');
        $('.edit_black').val(ip2)
    }
    var edit_monday = document.getElementsByClassName("ban11");
    var edit_monday_time = $('#edit_monday_time').val().split(",");
    for (var i = 0; i < edit_monday.length; i++) {
        for (var j = 0; j < edit_monday_time.length; j++) {
            if (edit_monday[i].getAttribute("time") == edit_monday_time[j]) {
                edit_monday[i].classList.add("gray-background");
            }
        }
    }
    var edit_tuesday = document.getElementsByClassName("ban22");
    var edit_tuesday_time = $('#edit_tuesday_time').val().split(",");
    for (var i = 0; i < edit_tuesday.length; i++) {
        for (var j = 0; j < edit_tuesday_time.length; j++) {
            if (edit_tuesday[i].getAttribute("time") == edit_tuesday_time[j]) {
                edit_tuesday[i].classList.add("gray-background");
            }
        }
    }
    var edit_wednesday = document.getElementsByClassName("ban33");
    var edit_wednesday_time = $('#edit_wednesday_time').val().split(",");
    for (var i = 0; i < edit_wednesday.length; i++) {
        for (var j = 0; j < edit_wednesday_time.length; j++) {
            if (edit_wednesday[i].getAttribute("time") == edit_wednesday_time[j]) {
                edit_wednesday[i].classList.add("gray-background");
            }
        }
    }
    var edit_thursday = document.getElementsByClassName("ban44");
    var edit_thursday_time = $('#edit_thursday_time').val().split(",");
    for (var i = 0; i < edit_thursday.length; i++) {
        for (var j = 0; j < edit_thursday_time.length; j++) {
            if (edit_thursday[i].getAttribute("time") == edit_thursday_time[j]) {
                edit_thursday[i].classList.add("gray-background");
            }
        }
    }
    var edit_friday = document.getElementsByClassName("ban55");
    var edit_friday_time = $('#edit_friday_time').val().split(",");
    for (var i = 0; i < edit_friday.length; i++) {
        for (var j = 0; j < edit_friday_time.length; j++) {
            if (edit_friday[i].getAttribute("time") == edit_friday_time[j]) {
                edit_friday[i].classList.add("gray-background");
            }
        }
    }
    var edit_saturday = document.getElementsByClassName("ban66");
    var edit_saturday_time = $('#edit_saturday_time').val().split(",");
    for (var i = 0; i < edit_saturday.length; i++) {
        for (var j = 0; j < edit_saturday_time.length; j++) {
            if (edit_saturday[i].getAttribute("time") == edit_saturday_time[j]) {
                edit_saturday[i].classList.add("gray-background");
            }
        }
    }
    var edit_sunday = document.getElementsByClassName("ban77");
    var edit_sunday_time = $('#edit_sunday_time').val().split(",");
    for (var i = 0; i < edit_sunday.length; i++) {
        for (var j = 0; j < edit_sunday_time.length; j++) {
            if (edit_sunday[i].getAttribute("time") == edit_sunday_time[j]) {
                edit_sunday[i].classList.add("gray-background");
            }
        }
    }
});
//每次关闭编辑弹窗就让时间限制颜色统一,不然classList.add的样式会保留到下一次
$('#modal-default5').on('hide.bs.modal', function (event) {
    let edit_monday = document.getElementsByClassName("ban11");
    for (let i = 0; i < edit_monday.length; i++) {
        edit_monday[i].classList.remove("gray-background");
    }
    let edit_tuesday = document.getElementsByClassName("ban22");
    for (let i = 0; i < edit_tuesday.length; i++) {
        edit_tuesday[i].classList.remove("gray-background");
    }
    let edit_wednesday = document.getElementsByClassName("ban33");
    for (let i = 0; i < edit_wednesday.length; i++) {
        edit_wednesday[i].classList.remove("gray-background");
    }
    let edit_thursday = document.getElementsByClassName("ban44");
    for (let i = 0; i < edit_thursday.length; i++) {
        edit_thursday[i].classList.remove("gray-background");
    }
    let edit_friday = document.getElementsByClassName("ban55");
    for (let i = 0; i < edit_friday.length; i++) {
        edit_friday[i].classList.remove("gray-background");
    }
    let edit_saturday = document.getElementsByClassName("ban66");
    for (let i = 0; i < edit_saturday.length; i++) {
        edit_saturday[i].classList.remove("gray-background");
    }
    let edit_sunday = document.getElementsByClassName("ban77");
    for (let j = 0; j < edit_sunday.length; j++) {
        edit_sunday[j].classList.remove("gray-background");
    }
});
//add-policy
$('.add-policy').click(function () {
    if ($('#add_upload').prop('checked')) {
        var file_upload = 1
    } else {
        var file_upload = 0
    }
    if ($('#add_download').prop('checked')) {
        var file_download = 1
    } else {
        var file_download = 0
    }
    if ($('#add_long').prop('checked')) {
        var add_long = 1
        $('#reservation').val("")
        $('#reservation2').val("")
    } else {
        var add_long = 0
    }
    //判断是白名单还是黑名单
    let ips = '';
    let ips1 = '';
    if($('#add_ip').val()==='0'){
        ips = $('.black').val();
        ips1 = '';
    }else{
        ips = '';
        ips1 = $('.black').val();
    }
    //user
    let selecteduser = [];
    $('#add_user1 input').each(function () {
        selecteduser.push(this.value);
    })
    //group
    let selectedgroup = [];
    $('#add_group1 input').each(function () {
        selectedgroup.push(this.value)
    })
    //device
    let selecteddevice = [];
    $('#add_device1 input').each(function () {
        selecteddevice.push(this.value);
    })
    //devicegroup
    let selecteddevicegroup = [];
    $('#add_devicegroup1 input').each(function () {
        selecteddevicegroup.push(this.value)
    })
    //app
    let selectedapp = [];
    $('#add_app1 input').each(function () {
        selectedapp.push(this.value);
    })
    //ban_time
    let monday = document.getElementsByClassName('ban1');
    $('#monday_time').val("");
    for (let i = 0; i < monday.length; i++) {
        if (monday[i].classList.contains("gray-background") == true) {
            $('#monday_time').val($('#monday_time').val() + monday[i].getAttribute("time") + ',')
        }
    }
    let tuesday = document.getElementsByClassName('ban2');
    $('#tuesday_time').val("");
    for (let i = 0; i < tuesday.length; i++) {
        if (tuesday[i].classList.contains("gray-background") == true) {
            $('#tuesday_time').val($('#tuesday_time').val() + tuesday[i].getAttribute("time") + ',')
        }
    }
    let wednesday = document.getElementsByClassName('ban3');
    $('#wednesday_time').val("");
    for (let i = 0; i < wednesday.length; i++) {
        if (wednesday[i].classList.contains("gray-background") == true) {
            $('#wednesday_time').val($('#wednesday_time').val() + wednesday[i].getAttribute("time") + ',')
        }
    }
    let thursday = document.getElementsByClassName('ban4');
    $('#thursday_time').val("");
    for (let i = 0; i < thursday.length; i++) {
        if (thursday[i].classList.contains("gray-background") == true) {
            $('#thursday_time').val($('#thursday_time').val() + thursday[i].getAttribute("time") + ',')
        }
    }
    let friday = document.getElementsByClassName('ban5');
    $('#friday_time').val("");
    for (let i = 0; i < friday.length; i++) {
        if (friday[i].classList.contains("gray-background") == true) {
            $('#friday_time').val($('#friday_time').val() + friday[i].getAttribute("time") + ',')
        }
    }
    let saturday = document.getElementsByClassName('ban6');
    $('#saturday_time').val("");
    for (let i = 0; i < saturday.length; i++) {
        if (saturday[i].classList.contains("gray-background") == true) {
            $('#saturday_time').val($('#saturday_time').val() + saturday[i].getAttribute("time") + ',')
        }
    }
    let sunday = document.getElementsByClassName('ban7');
    $('#sunday_time').val("");
    for (let i = 0; i < sunday.length; i++) {
        if (sunday[i].classList.contains("gray-background") == true) {
            $('#sunday_time').val($('#sunday_time').val() + sunday[i].getAttribute("time") + ',')
        }
    }
    $.ajax({
        url: "../../accessPolicy/addAccessPolicy",
        type: "POST",
        data: {
            name: $('#add_name').val(),
            desc: $('#add_desc').val(),
            valid_datetime_start: $('#reservation').val(),
            valid_datetime_end: $('#reservation2').val(),
            valid_long: add_long,
            file_upload: file_upload,
            file_download: file_download,
            allow_ip: ips,
            ban_ip: ips1,
            timelimit_ban_monday: $('#monday_time').val(),
            timelimit_ban_tuesday: $('#tuesday_time').val(),
            timelimit_ban_wednesday: $('#wednesday_time').val(),
            timelimit_ban_thursday: $('#thursday_time').val(),
            timelimit_ban_friday: $('#friday_time').val(),
            timelimit_ban_saturday: $('#saturday_time').val(),
            timelimit_ban_sunday: $('#sunday_time').val(),
            users: selecteduser,
            groups: selectedgroup,
            devices: selecteddevice,
            devicegroup: selecteddevicegroup,
            app: selectedapp,
        },
        success: function (data) {
            if (data.success) {
                $("#modal-success .modal-title").text('成功');
                $("#modal-success .modal-body").text('新建成功!');
                $("#modal-success").modal();
                loadAJAX('#example2');
            } else {
                $("#modal-danger .modal-title").text('失败');
                $("#modal-danger .modal-body").text('新建失败!');
                $("#modal-danger").modal();
                loadAJAX('#example2');
            }
        },
        error: function () {

        }
    })
});
//ip地址输入限制(编辑)

$('.edit_black').blur(function(){
	var edit_black=$('.edit_black').val();
	var p2=/^((\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])|(\n|-|\/))+$/;
	if(edit_black !== "" && !p2.test(edit_black)){
		$("#Vedit_black").text("输入格式不正确");
	}
});
$('.edit_black').focus(function(){
	$("#Vedit_black").text("");
})
//新建的ip
$('.black').blur(function(){
	var black=$('.black').val();
	var p2=/^((\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])(|\n|\/|-))+$/;
	if(black !== "" && !p2.test(black)){
		$("#Vblack").text("输入格式不正确");
	}
})
$('.black').focus(function(){
	$("#Vblack").text("");
})
// edit
$('#default5-edit').click(function () {
    function blurStart() {
        return $('#judge_editname').text() === "" && $('#Vedit_black').text() === "";
    }
    //判断是白名单还是黑名单
    let eips = '';
    let eips1 = '';
    if($('#edit_ip').val()==='0'){
        eips = $('.edit_black').val();
        eips1 = '';
    }else{
        eips = '';
        eips1 = $('.edit_black').val();
    }
    if ($('#can_upload').prop('checked')) {
        var file_upload = 1
    } else {
        var file_upload = 0
    };
    if ($('#can_download').prop('checked')) {
        var file_download = 1
    } else {
        var file_download = 0
    }
    if ($('#can_long').prop('checked')) {
        var add_long = 1
        $('#reservation').val("")
        $('#reservation2').val("")
    } else {
        var add_long = 0
    }
    //ban_time
    var monday = document.getElementsByClassName('ban11')
    $('#monday_time').val("");
    for (var i = 0; i < monday.length; i++) {
        if (monday[i].classList.contains("gray-background") == true) {
            $('#monday_time').val($('#monday_time').val() + monday[i].getAttribute("time") + ',')
        }
    }
    var tuesday = document.getElementsByClassName('ban22')
    $('#tuesday_time').val("");
    for (var i = 0; i < tuesday.length; i++) {
        if (tuesday[i].classList.contains("gray-background") == true) {
            $('#tuesday_time').val($('#tuesday_time').val() + tuesday[i].getAttribute("time") + ',')
        }
    }
    var wednesday = document.getElementsByClassName('ban33')
    $('#wednesday_time').val("");
    for (var i = 0; i < wednesday.length; i++) {
        if (wednesday[i].classList.contains("gray-background") == true) {
            $('#wednesday_time').val($('#wednesday_time').val() + wednesday[i].getAttribute("time") + ',')
        }
    }
    var thursday = document.getElementsByClassName('ban44')
    $('#thursday_time').val("");
    for (var i = 0; i < thursday.length; i++) {
        if (thursday[i].classList.contains("gray-background") == true) {
            $('#thursday_time').val($('#thursday_time').val() + thursday[i].getAttribute("time") + ',')
        }
    }
    var friday = document.getElementsByClassName('ban55')
    $('#friday_time').val("");
    for (var i = 0; i < friday.length; i++) {
        if (friday[i].classList.contains("gray-background") == true) {
            $('#friday_time').val($('#friday_time').val() + friday[i].getAttribute("time") + ',')
        }
    }
    var saturday = document.getElementsByClassName('ban66')
    $('#saturday_time').val("");
    for (var i = 0; i < saturday.length; i++) {
        if (saturday[i].classList.contains("gray-background") == true) {
            $('#saturday_time').val($('#saturday_time').val() + saturday[i].getAttribute("time") + ',')
        }
    }
    var sunday = document.getElementsByClassName('ban77')
    $('#sunday_time').val("");
    for (var i = 0; i < sunday.length; i++) {
        if (sunday[i].classList.contains("gray-background") == true) {
            $('#sunday_time').val($('#sunday_time').val() + sunday[i].getAttribute("time") + ',')
        }
    }
    if (blurStart()) {
        $.ajax({
            url: "../../accessPolicy/editAccessPolicy",
            type: "POST",
            data: {
                id: $('#edit_id').val(),
                name: $('#edit_name').val(),
                desc: $('#edit_desc').val(),
                valid_datetime_start: $('#reservation1').val(),
                valid_datetime_end: $('#reservation3').val(),
                allow_ip: eips,
                ban_ip: eips1,
                valid_long: add_long,
                file_upload: file_upload,
                file_download: file_download,
                timelimit_ban_monday: $('#monday_time').val(),
                timelimit_ban_tuesday: $('#tuesday_time').val(),
                timelimit_ban_wednesday: $('#wednesday_time').val(),
                timelimit_ban_thursday: $('#thursday_time').val(),
                timelimit_ban_friday: $('#friday_time').val(),
                timelimit_ban_saturday: $('#saturday_time').val(),
                timelimit_ban_sunday: $('#sunday_time').val(),
            },
            success: function (data) {
                if (data.success) {
                    $("#modal-default5").modal('hide');
                    $("#modal-success .modal-title").text('成功');
                    $("#modal-success .modal-body").text('编辑成功!');
                    $("#modal-success").modal();
                    loadAJAX('#example2');
                } else {
                    $("#modal-danger .modal-title").text('失败');
                    $("#modal-danger .modal-body").text('编辑失败!');
                    $("#modal-danger").modal();
                    loadAJAX('#example2');
                }
            },
            error: function () {
            }
        })
    }

});
//关联编辑
//user
let ac_edit_user_list = null;
let ac_edit_user1_list = null;
$('#modal-default6').on('show.bs.modal', function (event) {
    let page_start1 =0;
    var button = $(event.relatedTarget) // Button that triggered the modal
    var i = button.data('row');
    $("#modal-default6 .modal-title").text("关联用户["+$('#example2').DataTable().row('#' + i).nodes(i).data()[i].name+"]");
    $('#modal6_id').val($('#example2').DataTable().row('#' + i).nodes(i).data()[i].id);
    $.ajax({
        url: "../../accessPolicyUser/findAccessPolicyUserAndUser",
        type: "POST",
        data: {
            pid: $('#modal6_id').val(),
            page_start:page_start1,
            page_length:page_length
        },
        success: function (data) {
            var arr = data.data_users;
            var arr1 = data.data_p_users;
            //show
            $('#edit_user').html('');
            $('#edit_user1').html('');
            for (let item of arr) {
                $('#edit_user').append( '<div><input value="' + item.user_id + '" type="checkbox"><span>' + item.username + "[" + item.realname + "]" + '</span></div>')
            }
            for (let item1 of arr1) {
                $('#edit_user1').append('<div><input value="' + item1.user_id + '" type="checkbox"><span>' + item1.username + "[" + item1.realname + "]" + '</span></div>')
            }
            RelativeMethods(5);//封装的穿梭框函数代码在/bower_components/dist/js/common/relative.js里面
            ac_edit_user_list = $('#edit_user').html();
            ac_edit_user1_list = $('#edit_user1').html();
            //慢加载
            $('#edit_user').on("scroll",function () {
                let viewH =$(this).height(),//可见高度
                    contentH =$(this).get(0).scrollHeight,//内容高度
                    scrollTop =$(this).scrollTop();//滚动高度
                if(contentH - viewH - scrollTop <= 60) {
                    page_start1 += 500;
                    $.ajax({
                        url: "../../accessPolicyUser/findAccessPolicyUserAndUser",
                        type: "POST",
                        data: {
                            pid: $('#modal6_id').val(),
                            page_start:page_start1,
                            page_length:page_length
                        },
                        success: function (data) {
                            var arr = data.data_users;
                            for (let item of arr) {
                                $('#edit_user').append( '<div><input value="' + item.user_id + '" type="checkbox"><span>' + item.username + "[" + item.realname + "]" + '</span></div>')
                            }
                            RelativeMethods(5);//封装的穿梭框函数代码在/bower_components/dist/js/common/relative.js里面
                            ac_edit_user_list = $('#edit_user').html();
                        },
                    })
                }
            });
        },
        error: function () {
        },
    })
});

//user-group
let ac_edit_usergroup_list = null;
let ac_edit_usergroup1_list = null;
$('#modal-primary7').on('show.bs.modal', function (event) {
    let page_start =0;
    var button = $(event.relatedTarget) // Button that triggered the modal
    var i = button.data('row');
    $("#modal-primary7 .modal-title").text("关联用户组["+$('#example2').DataTable().row('#' + i).nodes(i).data()[i].name+"]");
    $('#modal7_id').val($('#example2').DataTable().row('#' + i).nodes(i).data()[i].id);
    $.ajax({
        url: "../../accessPolicyGroup/findAccessPolicyGroupAndUser",
        type: "POST",
        data: {
            policy_id: $('#modal7_id').val(),
            page_start:page_start,
            page_length:page_length
        },
        success: function (data) {
            var arr = data.data_users;
            var arr1 = data.data_p_users;
            //show
            $('#edit_usergroup').html('');
            $('#edit_usergroup1').html('');
            for (let item of arr) {
                $('#edit_usergroup').append('<div><input value="' + item.group_id + '" type="checkbox"><span>' + item.group_name  + '</span></div>')
            }
            //已选择
            for (let item1 of arr1) {
                $('#edit_usergroup1').append('<div><input value="' + item1.group_id + '" type="checkbox"><span>' + item1.group_name + '</span></div>')
            }
            RelativeMethods(6);//封装的穿梭框函数代码在/bower_components/dist/js/common/relative.js里面
            ac_edit_usergroup_list = $('#edit_usergroup').html();
            ac_edit_usergroup1_list = $('#edit_usergroup1').html();
            //慢加载
            $('#edit_usergroup').on("scroll",function () {
                let viewH =$(this).height(),//可见高度
                    contentH =$(this).get(0).scrollHeight,//内容高度
                    scrollTop =$(this).scrollTop();//滚动高度
                if(contentH - viewH - scrollTop <= 60) {
                    page_start += 500;
                    $.ajax({
                        url: "../../accessPolicyGroup/findAccessPolicyGroupAndUser",
                        type: "POST",
                        data: {
                            policy_id: $('#modal7_id').val(),
                            page_start:page_start,
                            page_length:page_length
                        },
                        success: function (data) {
                            var arr = data.data_users;
                            for (let item of arr) {
                                $('#edit_usergroup').append('<div><input value="' + item.group_id + '" type="checkbox"><span>' + item.group_name + '</span></div>')
                            }
                            RelativeMethods(6);//封装的穿梭框函数代码在/bower_components/dist/js/common/relative.js里面
                            ac_edit_usergroup_list = $('#edit_usergroup').html();
                        },
                    })
                }
            });
        },
        error: function () {
        },
    })
});
//deviceAccount
let ac_edit_device_list = null;
let ac_edit_device1_list = null;
$('#modal-primary8').on('show.bs.modal', function (event) {
    let page_start2 =0;
    var button = $(event.relatedTarget) // Button that triggered the modal
    var i = button.data('row');
    $("#modal-primary8 .modal-title").text("关联设备["+$('#example2').DataTable().row('#' + i).nodes(i).data()[i].name+"]");
    $('#modal8_id').val($('#example2').DataTable().row('#' + i).nodes(i).data()[i].id);
    $.ajax({
        url: "../../accessPolicyDeviceAccount/findAccessPolicyDeviceAccountAndUser",
        type: "POST",
        data: {
            policy_id: $('#modal8_id').val(),
            page_start:page_start2,
            page_length:page_length
        },
        success: function (data) {
            var arr = data.data_device;
            var arr1 = data.data_p_device;
            //show
            $('#edit_device').html('');
            $('#edit_device1').html('');
            for (let item of arr) {
                $('#edit_device').append('<div><input value="' + item.device_account_id + '" type="checkbox"><span>' + item.device_name + "[" + item.username + "]" + "[" + item.protocol_name + "]" + '</span></div>')
            }
            //已选择数据
            for(let item1 of arr1){
                $('#edit_device1').append('<div><input value="' + item1.device_account_id + '" type="checkbox" ><span>' + item1.device_name + "[" + item1.username + "]" + "[" + item1.protocol_name + "]" + '</span></div>')
            }
            RelativeMethods(7);//封装的穿梭框函数代码在/bower_components/dist/js/common/relative.js里面
            ac_edit_device_list = $('#edit_device').html();
            ac_edit_device1_list = $('#edit_device1').html();
            //慢加载
            $('#edit_device').on("scroll",function () {
                let viewH =$(this).height(),//可见高度
                    contentH =$(this).get(0).scrollHeight,//内容高度
                    scrollTop =$(this).scrollTop();//滚动高度
                if(contentH - viewH - scrollTop <= 60) {
                    page_start2 += 500;
                    $.ajax({
                        url: "../../accessPolicyDeviceAccount/findAccessPolicyDeviceAccountAndUser",
                        type: "POST",
                        data: {
                            policy_id: $('#modal8_id').val(),
                            page_start:page_start2,
                            page_length:page_length
                        },
                        success: function (data) {
                            var arr = data.data_device;
                            for (let item of arr) {
                                $('#edit_device').append('<div><input value="' + item.device_account_id + '" type="checkbox"><span>' + item.device_name + "[" + item.username + "]" + "[" + item.protocol_name + "]" + '</span></div>')
                            }
                            RelativeMethods(7);//封装的穿梭框函数代码在/bower_components/dist/js/common/relative.js里面
                            ac_edit_device_list = $('#edit_device').html();
                        },
                    })
                }
            })
        },
        error: function () {
        },
    })
});
//device-group
let ac_edit_devicegroup_list = null;
let ac_edit_devicegroup1_list = null;
$('#modal-primary9').on('show.bs.modal', function (event) {
    let page_start3 =0;
    var button = $(event.relatedTarget);// Button that triggered the modal
    var i = button.data('row');
    $("#modal-primary9 .modal-title").text("关联设备组["+$('#example2').DataTable().row('#' + i).nodes(i).data()[i].name+"]");
    $('#modal9_id').val($('#example2').DataTable().row('#' + i).nodes(i).data()[i].id);
    $.ajax({
        url: "../../accessPolicyGroup/findAccessPolicyDeviceGroupAndUser",
        type: "POST",
        data: {
            policy_id: $('#modal9_id').val(),
            page_start:page_start3,
            page_length:page_length
        },
        success: function (data) {
            var arr = data.data_dgroups;
            var arr1 = data.data_p_dgroups;
            //show
            $('#edit_devicegroup').html('');
            $('#edit_devicegroup1').html('');
            for(let item of arr){
                $('#edit_devicegroup').append('<div><input value="' + item.dgroup_id + '" type="checkbox"><span>' + item.dgroup_name + '</span></div>')
            }
            for(let item1 of arr1){
                $('#edit_devicegroup1').append('<div><input value="' + item1.dgroup_id + '" type="checkbox"><span>' + item1.dgroup_name + '</span></div>')
            }
            RelativeMethods(8);//封装的穿梭框函数代码在/bower_components/dist/js/common/relative.js里面
            ac_edit_devicegroup_list = $('#edit_devicegroup').html();
            ac_edit_devicegroup1_list = $('#edit_devicegroup1').html();
            //慢加载
            $('#edit_devicegroup').on("scroll",function () {
                let viewH =$(this).height(),//可见高度
                    contentH =$(this).get(0).scrollHeight,//内容高度
                    scrollTop =$(this).scrollTop();//滚动高度
                if(contentH - viewH - scrollTop <= 60) {
                    page_start3 += 500;
                    $.ajax({
                        url: "../../accessPolicyGroup/findAccessPolicyDeviceGroupAndUser",
                        type: "POST",
                        data: {
                            policy_id: $('#modal9_id').val(),
                            page_start:page_start3,
                            page_length:page_length
                        },
                        success: function (data) {
                            var arr = data.data_dgroups;
                            for(let item of arr){
                                $('#edit_devicegroup').append('<div><input value="' + item.dgroup_id + '" type="checkbox"><span>' + item.dgroup_name + '</span></div>')
                            }
                            RelativeMethods(8);//封装的穿梭框函数代码在/bower_components/dist/js/common/relative.js里面
                            ac_edit_devicegroup_list = $('#edit_devicegroup').html();
                        },
                    })
                }
            })
        },
        error: function () {
        },
    })
});
//app
let ac_edit_app_list = null;
let ac_edit_app1_list = null;
$('#modal-primary10').on('show.bs.modal', function (event) {
    let page_start4 =0;
    var button = $(event.relatedTarget) // Button that triggered the modal
    var i = button.data('row');
    $("#modal-primary10 .modal-title").text("关联应用["+$('#example2').DataTable().row('#' + i).nodes(i).data()[i].name+"]");
    $('#modal10_id').val($('#example2').DataTable().row('#' + i).nodes(i).data()[i].id);
    $.ajax({
        url: "../../accessPolicyApppub/findAccessPolicyAppAndUser",
        type: "POST",
        data: {
            policy_id: $('#modal10_id').val(),
            page_start:page_start4,
            page_length:page_length
        },
        success: function (data) {
            var arr = data.data_app;
            var arr1 = data.data_p_app;
            //show
            $('#edit_app').html('');
            $('#edit_app1').html('');
            for(let item of arr){
                $('#edit_app').append( '<div><input value="' + item.apppub_account_id + '" type="checkbox"><span>' + item.name + "[" + item.apppubserver + "]" + '</span></div>')
            }
            for(let item1 of arr1){
                $('#edit_app1').append( '<div><input value="' + item1.apppub_account_id + '" type="checkbox"><span>' + item1.name + "[" + item1.apppubserver + "]" + '</span></div>')
            }
            RelativeMethods(9);//封装的穿梭框函数代码在/bower_components/dist/js/common/relative.js里面
            ac_edit_app_list = $('#edit_app').html();
            ac_edit_app1_list = $('#edit_app1').html();
            //慢加载
            $('#edit_app').on("scroll",function () {
                let viewH =$(this).height(),//可见高度
                    contentH =$(this).get(0).scrollHeight,//内容高度
                    scrollTop =$(this).scrollTop();//滚动高度
                if(contentH - viewH - scrollTop <= 60) {
                    page_start4 += 500;
                    $.ajax({
                        url: "../../accessPolicyApppub/findAccessPolicyAppAndUser",
                        type: "POST",
                        data: {
                            policy_id: $('#modal10_id').val(),
                            page_start:page_start4,
                            page_length:page_length
                        },
                        success: function (data) {
                            var arr = data.data_app;
                            for(let item of arr){
                                $('#edit_app').append( '<div><input value="' + item.apppub_account_id + '" type="checkbox"><span>' + item.name + "[" + item.apppubserver + "]" + '</span></div>')
                            }
                            RelativeMethods(9);//封装的穿梭框函数代码在/bower_components/dist/js/common/relative.js里面
                            ac_edit_app_list = $('#edit_app').html();
                        },
                    })
                }
            })
        },
        error: function () {
        },
    })
});
//edit relative
$("#relevance-user").click(function () {
    var selecteduser = [];
    $("#edit_user1 input").each(function () {
        selecteduser.push(this.value);
    })
    $.ajax({
        url: "../../accessPolicyUser/editAccessPolicyUser",
        type: "POST",
        data: {
            policy_id: $('#modal6_id').val(),
            users: selecteduser,
        },
        success: function (data) {
            if (data.success) {
                $("#modal-success .modal-title").text('成功');
                $("#modal-success .modal-body").text('编辑成功!');
                $("#modal-success").modal();
                loadAJAX('#example2');
            } else {
                $("#modal-danger .modal-title").text('失败');
                $("#modal-danger .modal-body").text('编辑失败!');
                $("#modal-danger").modal();
                loadAJAX('#example2');
            }
        },
        error: function () {
        }
    })
});
//app
$("#relevance-app").click(function () {
    var selectedapp = [];
    $("#edit_app1 input").each(function () {
        selectedapp.push(this.value);
    })
    $.ajax({
        url: "../../accessPolicyApppub/editAccessPolicyApppub",
        type: "POST",
        data: {
            policy_id: $('#modal10_id').val(),
            app: selectedapp,
        },
        success: function (data) {
            if (data.success) {
                $("#modal-success .modal-title").text('成功');
                $("#modal-success .modal-body").text('编辑成功!');
                $("#modal-success").modal();
                loadAJAX('#example2');
            } else {
                $("#modal-danger .modal-title").text('失败');
                $("#modal-danger .modal-body").text('编辑失败!');
                $("#modal-danger").modal();
                loadAJAX('#example2');
            }
        },
        error: function () {
        }
    })
});
//device
$("#relevance-device").click(function () {
    var selecteddevice = [];
    $("#edit_device1 input").each(function () {
        selecteddevice.push(this.value);
    })
    $.ajax({
        url: "../../accessPolicyDeviceAccount/editAccessPolicyDeviceAccount",
        type: "POST",
        data: {
            policy_id: $('#modal8_id').val(),
            devices: selecteddevice,
        },
        success: function (data) {
            if (data.success) {
                $("#modal-success .modal-title").text('成功');
                $("#modal-success .modal-body").text('编辑成功!');
                $("#modal-success").modal();
                loadAJAX('#example2');
            } else {
                $("#modal-danger .modal-title").text('失败');
                $("#modal-danger .modal-body").text('编辑失败!');
                $("#modal-danger").modal();
                loadAJAX('#example2');
            }
        },
        error: function () {
        }
    })
});
//usergroup
$("#relevance-usergroup").click(function () {
    var selectedgroup = [];
    $("#edit_usergroup1 input").each(function () {
        selectedgroup.push(this.value);
    })
    $.ajax({
        url: "../../accessPolicyGroup/editAccessPolicyGroup",
        type: "POST",
        data: {
            policy_id: $('#modal7_id').val(),
            groups: selectedgroup,
        },
        success: function (data) {
            if (data.success) {
                $("#modal-success .modal-title").text('成功');
                $("#modal-success .modal-body").text('编辑成功!');
                $("#modal-success").modal();
                loadAJAX('#example2');
            } else {
                $("#modal-danger .modal-title").text('失败');
                $("#modal-danger .modal-body").text('编辑失败!');
                $("#modal-danger").modal();
                loadAJAX('#example2');
            }
        },
        error: function () {
        }
    })
});
//devicegroup
$("#relevance-device-group").click(function () {
    var selecteddevicegroup = [];
    $("#edit_devicegroup1 input").each(function () {
        selecteddevicegroup.push(this.value);
    });
    $.ajax({
        url: "../../accessPolicyGroup/editAccessPolicyDeviceGroup",
        type: "POST",
        data: {
            policy_id: $('#modal9_id').val(),
            devicegroup: selecteddevicegroup,
        },
        success: function (data) {
            if (data.success) {
                $("#modal-success .modal-title").text('成功');
                $("#modal-success .modal-body").text('编辑成功!');
                $("#modal-success").modal();
                loadAJAX('#example2');
            } else {
                $("#modal-danger .modal-title").text('失败');
                $("#modal-danger .modal-body").text('编辑失败!');
                $("#modal-danger").modal();
                loadAJAX('#example2');
            }
        },
        error: function () {
        }
    })
});
//del look
$('#modal-primary').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget) // Button that triggered the modal
    let i = button.data('row');
    $('#del_id').val($('#example2').DataTable().row('#' + i).nodes(i).data()[i].id);
});
//清空数据
$('#_export').click(function () {
    $('#queryPsw').val("");
    $('#PswRep').text("")
});
$('#export').click(function () {
    $.ajax({
        url: "../../export/checkPwd",
        type: "POST",
        data: {
            password: $('#queryPsw').val(),
        },
        success: function (data) {
            if (data.success) {
                $('#downFile')[0].click();
                $('#modal-default1').modal('hide');
            } else {
                if (data.msg == "") {
                    $("#modal-danger .modal-title").text('失败');
                    $("#modal-danger .modal-body").text('导出失败!');
                    $("#modal-danger").modal();
                } else {
                    $("#PswRep").text(data.msg)
                }
                loadAJAX('#example2');
            }
        },
        error: function () {

        }
    })
});
//全選刪除
$('#delAllbutton').click(function () {
    let obj = document.getElementsByName('chk[]');
    let ids = new Array();
    for (let i in obj) {
        if (obj[i].checked)
            ids.push(obj[i].value);
    }
    if (ids.length == 0) {
        $("#modal-hint .modal-title").text('失败');
        $("#modal-hint.modal-body").text('请选择要删除的信息');
        $("#modal-hint").modal();
        loadAJAX('#example2');
        return false;
    }
    $.ajax({
        url: "../../accessPolicy/delAccessPolicy",
        type: "POST",
        data: {
            ids: ids
        },
        success: function (data) {
            if (data.success) {
                $("#modal-success .modal-title").text('成功');
                $("#modal-success .modal-body").text('操作成功!');
                $("#modal-success").modal();
                loadAJAX('#example2');
            } else {
                $("#modal-danger .modal-title").text('失败');
                $("#modal-danger .modal-body").text('操作失败!');
                $("#modal-danger").modal();
                loadAJAX('#example2');
            }
        },
        error: function () {
            $("#modal-danger .modal-title").text('失败');
            $("#modal-danger .modal-body").text('操作失败!');
            $("#modal-danger").modal();
            loadAJAX('#example2');
        }
    })
});
//table-del
$('#table-del').click(function () {
    $.ajax({
        url: "../../accessPolicy/delAccessPolicy",
        type: "POST",
        data: {
            ids: new Array($('#del_id').val())
        },
        success: function (data) {
            if (data.success) {
                $("#modal-success .modal-title").text('成功');
                $("#modal-success .modal-body").text('操作成功!');
                $("#modal-success").modal();
                loadAJAX('#example2');
            } else {
                $("#modal-danger .modal-title").text('失败');
                $("#modal-danger .modal-body").text('操作失败!');
                $("#modal-danger").modal();
                loadAJAX('#example2');
            }
        },
        error: function () {
            loadAJAX('#example2');
        },
    })
});

//正则表达式数据
let regexp = {
    name: /^([A-Za-z]|[\u4e00-\u9fa5]|\-|[0-9]){1,32}$/,
}
//新建judge_name
function StartBlur() {
	var black=$('.black').val();
	var p2=/^((\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4][0-9]|25[0-5])|(\n|\/|-))+$/;
    if ($("#add_name").val() === "" || $('#judge_name').text() !== "") {
        if ($("#add_name").val() === "") {
            $('#judge_name').text("请输入策略名称");
        }else if (!regexp.name.test($("#add_name").val())) {
            $('#judge_name').text("输入格式不正确")
        }else {
            checkusername();
        }
        if(black !=="" && !p2.test(black)){
    		$("#Vblack").text("输入格式不正确");
    	}
        return $("#add_name").val() != "" && $('#judge_name').text() == "" && $("#Vblack").text()=="";
    } else {
        return $("#add_name").val() != "" && $('#judge_name').text() == "" && $("#Vblack").text()=="";
    }
}
function judge_name() {
    if (StartBlur()) {
        $('#judge_one').attr("data-target", "#modal-default3");
        $('#judge_one').attr("data-dismiss", "modal");
    } else {
        $('#judge_one').attr("data-target", "modal-default");
        $('#judge_one').removeAttr("data-dismiss");
    }
}
// 获取焦点，重新输入
$('#add_name').focus(function () {
    if ($('#judge_name').text()!==""){
        $('#judge_name').text('');
    }
})
// 获取焦点，重新输入
$('#edit_name').focus(function () {
    if ($('#judge_editname').text()!==""){
        $('#judge_editname').text('');
    }
})
//失去焦点，移出输入框
$('#add_name').blur(function () {
	if($("#add_name").val()==""){
		$('#judge_name').text("请输入策略名称")
	}else if (!regexp.name.test($("#add_name").val())) {
        $('#judge_name').text("输入格式不正确")
    } else {
        checkusername();
    }
})
//失去焦点，移出输入框
$('#edit_name').blur(function () {
	if($("#edit_name").val()==""){
		$('#judge_editname').text("请输入策略名称")
	}else if (!regexp.name.test($("#edit_name").val())) {
        $('#judge_editname').text("输入格式不正确")
    } else {
        checkusername1();
    }
})
// 检查重名
function checkusername() {
    $.ajax({
        url: "../../accessPolicy/checkname",
        type: "POST",
        data: {
            name: $('#add_name').val(),
        },
        success: function (data) {
            if (!data.success) {
                $('#judge_name').text('策略名称重复');
            } else {
                $('#judge_name').text('');
            }
        }
    })
}
// 检查重名
function checkusername1() {
    $.ajax({
        url: "../../accessPolicy/checkname",
        type: "POST",
        data: {
            name: $('#edit_name').val(),
            id: $('#edit_id').val(),
        },
        success: function (data) {
            if (!data.success) {
                $('#judge_editname').text('策略名称重复');
            } else {
                $('#judge_editname').text('');
            }
        }
    })
}
//清楚新建的遗留
function clearT() {
    $('#add_name').val('');
    $('#judge_name').text('');
    $('#add_upload').prop("checked",false);
    $('#add_download').prop("checked",false);
    $('#reservation').prop('disabled', true);
    $('#reservation2').prop('disabled', true);
    $('#reservation').val('');
    $('#reservation2').val('');
    $('#add_ip option:first').prop('selected', 'selected');
    $('#add_long').prop('checked',true)
    $('.black').val('');
    $('#Vblack').text('');
    $('#add_desc').val('');
    $('#add_group').html('');
    $('#add_group1').html('');
    $('#add_user').html('');
    $('#add_user1').html('');
    $('#add_device').html('');
    $('#add_device1').html('');
    $('#add_devicegroup').html('');
    $('#add_devicegroup1').html('');
    $('#add_app').html('');
    $('#add_app1').html('');
    let edit_monday = document.getElementsByClassName("ban1");
    for (let i = 0; i < edit_monday.length; i++) {
        edit_monday[i].classList.remove("gray-background");
    }
    let edit_tuesday = document.getElementsByClassName("ban2");
    for (let i = 0; i < edit_tuesday.length; i++) {
        edit_tuesday[i].classList.remove("gray-background");
    }
    let edit_wednesday = document.getElementsByClassName("ban3");
    for (let i = 0; i < edit_wednesday.length; i++) {
        edit_wednesday[i].classList.remove("gray-background");
    }
    let edit_thursday = document.getElementsByClassName("ban4");
    for (let i = 0; i < edit_thursday.length; i++) {
        edit_thursday[i].classList.remove("gray-background");
    }
    let edit_friday = document.getElementsByClassName("ban5");
    for (let i = 0; i < edit_friday.length; i++) {
        edit_friday[i].classList.remove("gray-background");
    }
    let edit_saturday = document.getElementsByClassName("ban6");
    for (let i = 0; i < edit_saturday.length; i++) {
        edit_saturday[i].classList.remove("gray-background");
    }
    let edit_sunday = document.getElementsByClassName("ban7");
    for (let j = 0; j < edit_sunday.length; j++) {
        edit_sunday[j].classList.remove("gray-background");
    }
}