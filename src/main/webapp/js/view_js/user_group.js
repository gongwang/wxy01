//清空内容
function resetFileInput(){
    $('#Vfile').text('');
    $('#btn_file').val('');
    $("#filename").text('');
}
//上传点击事件
function openFile() {
    $('#Vfile').text('');
    $('#btn_file').click();

    $('#btn_file').change(function(){
        var file = $("#btn_file").val();
        var fileName = getFileName(file);
        function getFileName(o){
            var pos=o.lastIndexOf("\\");
            return o.substring(pos+1);
        }
        $("#filename").html(fileName);
    })
}

//清空内容
function resetC(){
    $('#edit_name').val('');
    $('#edit_desc').val('');
    $("#Vname").text('');
    $("#Vedit_desc").text('');
}
var regexp = {
    name:/^([A-Za-z0-9]|[\u4e00-\u9fa5]|@|_){0,64}$/,
    length:/^\S{0,128}$/,
    length_des:/^\S{0,128}$/,
}
//失去焦点，移出输入框
$('#edit_name').blur(function(){
    //组名的验证规则
    //获取输入的名字
    let username = $('#edit_name').val();
    //判断是否符合规则
    if (!regexp.name.test(username)){
        //不符合
        if (username==""){
            $('#Vname').text('请输入组名');
        }else{
            $('#Vname').text('组名格式不正确');
            if (!regexp.length.test(username)){
                $('#Vname').text("最长64个字符")
            }
        }
    }else {
        checkusername();
    }
});
// 检查重名
function checkusername(){
    console.log("abc");
    $.ajax({
        url:"../../group/checkname",
        type:"POST",
        data:{
            id:$('#id').val(),
            name:$('#edit_name').val(),
            type:0,
        },
        success:function(data){
            if(!data.success){
                $('#Vname').text('组名已存在');
            }else{
                $('#Vname').text('');
            }
        }
    })
}
// 获取焦点，重新输入
$('#edit_name').focus(function(){
    //将提示信息置空
    $('#Vname').text('');
})
$('#depart_name').focus(function () {
$('#VdepartName').text('');
})

$('#edit_desc').blur(function () {

    if(!regexp.length_des.test($('#edit_desc').val())){
        $('#Vedit_desc').text("超过限制长度");
    }else {
        $('#Vedit_desc').text("");
    }
})
// 获取焦点，重新输入
$('#edit_desc').focus(function(){
    //将提示信息置空
    $('#Vedit_desc').text('');
})

var userList = function(field,value,type,value1){
    $('#user_group_list').DataTable({
        'paging': true,
        'iDisplayLength': 10,
        'lengthChange': true,
        "lengthMenu": [
            [10, 25, 50, 100], ["10条/页", "25条/页", "50条/页", "100条/页"]
        ],
        'dom':'t<"bottom"lifp<"clear">>',
        'searching': false,
        'ordering': true,
        'info': true,
        'autoWidth': false,
        "serverSide": true,
        "destroy":true,
        'ajax': {
            "url": "../../group/listGroup",
            "data": function (d) {
                for(var key in d){
                    if(key.indexOf("columns")==0||key.indexOf("order")==0||key.indexOf("search")==0){ //以columns开头的参数删除
                        delete d[key];
                    }
                }
                //指定检索参数名称，后台参数名为extraSerach
                eval('d.'+field+'="'+value+'"');
                eval('d.'+type+'="'+0+'"');
            }
        },
        'columns': [
            {"data": "id", "render": function (data, type, row, meta) {
                    return '<input type="checkbox" name="chk[]" value=' + data + '>';
                }
            },
            {"data": "name",
                "render" : function(data, type,
                                    row, mata) {
                    return '<div style="display: inline-block;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;width:150px;" data-html="true" data-toggle="tooltip" title="'+data+'">'
                        +data
                        + '</div>';

                }},
            {"data": "depart_name",
                "render" : function(data, type,
                                    row, mata) {
                    return '<div style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap;width:150px;" data-html="true" data-toggle="tooltip" title="'+row.topName+'">'
                        +data
                        + '</div>';

                }},
            {"data": "desc",
                "render" : function(data, type,
                                    row, mata) {
                    return '<div style="text-overflow:ellipsis;overflow:hidden;white-space:nowrap;width:200px;" data-html="true" data-toggle="tooltip" title="'+data+'">'
                        +data
                        + '</div>';

                }},
            {"data": "count"},
            {
                "data": "id", "render": function (data, type, row, meta) {
                    return '<a data-toggle="modal" data-row="' + meta.row + '" data-target="#modal-editgroup" class="newcss1" style="cursor:pointer; " onclick="resetC()">编辑</a>' +
                        '<a data-toggle="modal" data-row="' + meta.row + '" data-target="#modal-default6" class="newcss1" style="margin-left: 25px;cursor:pointer;">关联用户</a>' +
                        '<a data-toggle="modal" data-row="' + meta.row + '" data-target="#modal-delgroup" class="newcss2" style="margin-left: 25px;cursor:pointer;">删除</a>'
                }
            }
        ],
        "fnDrawCallback": function( settings, json ) {
            $('#user_group_list div').tooltip();
        }
    });
};
/* 调用user_group_list */
userList('searchAll','','type',0);
/* 根据条件搜索 */
$('#search').click(function(){
    userList($('#Distinguish').val(),$('#searchId').val(),'type',0);
});

$('#modal-editgroup').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    if(button.data('row')!=undefined&&button.data('row')!=null){
        i = button.data('row');
        $("#modal-editgroup .modal-title").text("编辑用户组");
        $('#id').val($('#user_group_list').DataTable().row('#' + i).nodes(i).data()[i].id);
        $('#edit_name').val($('#user_group_list').DataTable().row('#' + i).nodes(i).data()[i].name);
        $('#edit_desc').val($('#user_group_list').DataTable().row('#' + i).nodes(i).data()[i].desc);
        $("#ValidatorName").text("");
    }else{
        $("#modal-editgroup .modal-title").text("新建用户组");
        $('#id').val('');
        $('#edit_name').val('');
        $("#ValidatorName").text("");
        $('#edit_desc').val('');
    }
});

//删除用户
$('#modal-delgroup').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    i = button.data('row');
    $('#del_id').val($('#user_group_list').DataTable().row('#' + i).nodes(i).data()[i].id);
});

$('#editButton').click(function(){
    let a =true;
    setTimeout(()=>{
        if ($('#edit_name').val()==""|| $('#Vname').text()!="") {
            if ($('#edit_name').val() == "") {
                $('#Vname').text('请输入组名');
            }
            a=false
        }
        if(!regexp.length_des.test($('#edit_desc').val())){
            $('#Vedit_desc').text("超过限制长度");
            a=false
        }
        if(a){
            $.ajax({
                url:"../../group/editGroup",
                type:"POST",
                data:{
                    id:$('#id').val(),
                    name:$('#edit_name').val(),
                    department:$('#depart_id').val(),
                    desc:$('#edit_desc').val(),
                    type:0,
                },
                success:function(data){
                    if(data.success) {
                        if ($('#id').val()== "") {
                            $('#modal-editgroup').modal('hide');
                            $("#modal-success .modal-title").text('成功');
                            $("#modal-success .modal-body").text('新建成功!');
                            $("#modal-success").modal();
                        } else {
                            $('#modal-editgroup').modal('hide');
                            $("#modal-success .modal-title").text('成功');
                            $("#modal-success .modal-body").text('编辑成功!');
                            $("#modal-success").modal();
                        }
                        loadAJAX('#user_group_list');
                    }
                    else{
                        if ($('#id').val() === "") {
                            $("#modal-danger .modal-title").text('失败');
                            $("#modal-danger .modal-body").text('新建失败!');
                            $("#modal-danger").modal();
                        } else {
                            $("#modal-danger .modal-title").text('失败');
                            $("#modal-danger .modal-body").text('编辑失败!');
                            $("#modal-danger").modal();
                        }
                        loadAJAX('#user_group_list');
                    }
                },
                error:function(){

                }
            })
        }
    },100)
})

//清空数据
$('#_export').click(function(){
    $('#queryPsw').val("");
    $('#PswRep').text("")
});
$('#queryPsw').focus(function () {
    $('#PswRep').text("");
});


//下载模版
$('#downTemplate').click(function(){
    $('#downClick')[0].click();
});

$("#upload").off().on("click", function () {
    var s = $('#btn_file')[0].files[0];
    var udepartment = $('#depart_id').val();
    if(!s){
        $('#Vfile').text('请上传文件');
        return;
    }
    var formData = new FormData();
    formData.append("file_data", s);
    formData.append("type", 0);
    formData.append("udepartment", udepartment);

    $("#modal-upload .modal-title").text('状态');
    $("#modal-upload .modal-body").text('正在导入...');
    $("#modal-upload").modal();
    $.ajax({
        url: "../../upload/group",
        type: 'POST',
        cache: false,
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            if (data.success){
                $("#modal-upload").modal('hide');
                $("#modal-success .modal-title").text('成功');
                $("#modal-success .modal-body").text(data.msg);
                $("#modal-success").modal();
                $('#modal-default').modal('hide');
            }else {
                $("#modal-upload").modal('hide');
                $("#modal-danger .modal-title").text('失败');
                $("#modal-danger .modal-body").text('导入失败!');
                $("#modal-danger").modal();
            }
            loadAJAX('#user_group_list');
            setTimeout(function () {
                if (data.errorInfo.length !== 0) {
                    $("#modal-uploadInfo").modal();
                    if (data.errorInfo.length !== 0) {
                        $("#modal-uploadInfo").modal();
                        for(let item of data.errorInfo) {
                            $('#uploadError').append(item+"<br/>");
                        }
                        $('#uploadError').append("----详细请看文档和日志");
                    }
                }
            },1500)
        },
        error: function () {

        }
    });
});

$('#export').click(function(){
    $.ajax({
        url:"../../export/checkPwd",
        type:"POST",
        data:{
            password: $('#queryPsw').val(),
        },
        success:function(data){
            if(data.success){
                $('#downFile')[0].click();
                $('#modal-default1').modal('hide');
            }
            else{
                if (data.msg==""){
                    $("#modal-danger .modal-title").text('失败');
                    $("#modal-danger .modal-body").text('导出失败!');
                    $("#modal-danger").modal();
                    loadAJAX('#user_group_list');
                }else {
                    $("#PswRep").text(data.msg)
                }
            }
        },
        error:function(){

        }
    })
});

$('#delButton').click(function(){
    $.ajax({
        url:"../../group/delGroup",
        type:"POST",
        data:{
            ids: new Array($('#del_id').val()),
            type:0,
        },
        success:function(data) {
            if (data.success) {
                $("#modal-success .modal-title").text('成功');
                $("#modal-success .modal-body").text('操作成功!');
                $("#modal-success").modal();
                loadAJAX('#user_group_list');
                $('#modal-delgroup').modal('hide');
            }
            else{
                $("#modal-danger .modal-title").text('失败');
                $("#modal-danger .modal-body").text(data.msg?data.msg:'操作失败!');
                $("#modal-danger").modal();
                loadAJAX('#user_group_list');
            }
        },
        error:function(){

        }
    })
});
$('#example2_paginate pagination li').click(function(){
    $('#checkAll').prop('checked',false);
});
$('#delAllButton').click(function(){
    var obj = document.getElementsByName('chk[]');
    console.log(obj);
    var ids= new Array();
    for (i in obj){
        if(obj[i].checked)
            ids.push(obj[i].value);
    }
    console.log(ids);
    if(ids.length==0){
        $("#modal-hint.modal-title").text('失败');
        $("#modal-hint .modal-body").text('请选择要删除的信息');
        $("#modal-hint").modal();
        loadAJAX('#user_group_list');
        return false;
    }
    $.ajax({
        url:"../../group/delGroup",
        type:"POST",
        data:{
            ids:ids,
            type:0
        },
        success:function(data){
            if(data.success){
                $("#modal-success .modal-title").text('成功');
                $("#modal-success .modal-body").text('操作成功!');
                $("#modal-success").modal();
                loadAJAX('#user_group_list');
                $("#delGroupAll").modal('hide');
            }
            else{
                $("#modal-danger .modal-title").text('失败');
                $("#modal-danger .modal-body").text(data.msg?data.msg:'操作失败!');
                $("#modal-danger").modal();
                loadAJAX('#user_group_list');
            }
        },
        error:function(){
            $("#modal-danger .modal-title").text('失败');
            $("#modal-danger .modal-body").text('操作失败!');
            $("#modal-danger").modal();
            loadAJAX('#user_group_list');
        }
    })
});

//user
const page_length = 500;
let ac_edit_user_list = null;
let ac_edit_user1_list = null;
$('#modal-default6').on('show.bs.modal', function (event) {
    let page_start1 =0;
    var button = $(event.relatedTarget);
    var i = button.data('row');
    $("#modal-default6 .modal-title").text("关联用户["+$('#user_group_list').DataTable().row('#' + i).nodes(i).data()[i].name+"]");
    $('#modal6_id').val($('#user_group_list').DataTable().row('#' + i).nodes(i).data()[i].id);
    $.ajax({
        url: "../../userGroupUser/findUserGroupUser",
        type: "POST",
        data: {
            group_id: $('#modal6_id').val(),
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
                        url: "../../userGroupUser/findUserGroupUser",
                        type: "POST",
                        data: {
                            group_id: $('#modal6_id').val(),
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
//usergroup
//edit relative
$("#relevance-user").click(function () {
    var selecteduser = [];
    $("#edit_user1 input").each(function () {
        selecteduser.push(this.value);
    });
    $.ajax({
        url: "../../userGroupUser/editUserGroupUser",
        type: "POST",
        data: {
            group_id: $('#modal6_id').val(),
            users: selecteduser,
        },
        success: function (data) {
            if (data.success) {
                $("#modal-success .modal-title").text('成功');
                $("#modal-success .modal-body").text('编辑成功!');
                $("#modal-success").modal();
                loadAJAX('#user_group_list');
            } else {
                $("#modal-danger .modal-title").text('失败');
                $("#modal-danger .modal-body").text('编辑失败!');
                $("#modal-danger").modal();
                loadAJAX('#user_group_list');
            }
        },
        error: function () {
        }
    })
});