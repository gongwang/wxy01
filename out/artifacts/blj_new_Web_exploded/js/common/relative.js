function DataRelative(dataleft,dataright,lc,rc,add,remove,rightinput,leftinput,spanleft,spanright){
	const that = this;
	that.dataleft = dataleft;
	that.dataright = dataright;
	that.lc = lc;
	that.rc = rc;
	that.add = add;
	that.remove = remove;
	that.rightinput = rightinput;
	that.leftinput = leftinput;
	that.spanleft = spanleft;
	that.spanright = spanright;
	//左边全选
	const leftAll = function () {
		for (let i = 0; i < that.leftinput.length; i++) {
			that.leftinput[i].checked = that.lc.checked;
			that.add.disabled = !that.lc.checked
		}
	};
	//右边全选
	const rightAll = function () {
		for (let i = 0; i < that.rightinput.length; i++) {
			that.rightinput[i].checked = that.rc.checked;
			that.remove.disabled = !that.rc.checked;
		}
	};
	//判断左边全选
	const left = function () {
		for (let i = 0; i < that.leftinput.length; i++) {
			that.leftinput[i].onclick = function (e) {
				e = e || window.event;
				if (e.stopPropagation) { //W3C阻止冒泡方法
					e.stopPropagation();
				} else {
					e.cancelBubble = true; //IE阻止冒泡方法
				}
				let count = 0;
				for (let j = 0; j < that.leftinput.length; j++) {
					if (that.leftinput[j].checked) {
						count++;
						that.add.disabled = false
					}
				}
				if (count === 0) {
					that.add.disabled = true;
				}
				that.lc.checked = (count === that.leftinput.length);
			};
		}
	};
	const left1 = function () {
		for (let i = 0; i < that.leftinput.length; i++) {
			that.spanleft[i].parentNode.onclick = function () {
				that.leftinput[i].checked = that.leftinput[i].checked != true;
				let count = 0;
				for (let j = 0; j < that.leftinput.length; j++) {
					if (that.leftinput[j].checked) {
						count++;
						that.add.disabled = false
					}
				}
				if (count === 0) {
					that.add.disabled = true;
				}
				that.lc.checked = (count === that.leftinput.length);
			};
		}
	};
	//判断右边全选
	const right = function () {
		for (let i = 0; i < that.rightinput.length; i++) {
			that.rightinput[i].onclick = function (e) {
				e = e || window.event;
				if (e.stopPropagation) { //W3C阻止冒泡方法
					e.stopPropagation();
				} else {
					e.cancelBubble = true; //IE阻止冒泡方法
				}
				let count = 0;
				for (let j = 0; j < that.rightinput.length; j++) {
					if (that.rightinput[j].checked) {
						count++;
						that.remove.disabled = false
					}
				}
				if (count === 0) {
					that.remove.disabled = true;
				}
				that.rc.checked = (count === that.rightinput.length);
			}
		}
	};
	const right1 = function () {
		for (let i = 0; i < that.rightinput.length; i++) {
			that.spanright[i].parentNode.onclick = function () {
				that.rightinput[i].checked = that.rightinput[i].checked !== true;
				let count = 0;
				for (let j = 0; j < that.rightinput.length; j++) {
					if (that.rightinput[j].checked) {
						count++;
						that.remove.disabled = false
					}
				}
				if (count === 0) {
					that.remove.disabled = true;
				}
				that.rc.checked = (count === that.rightinput.length);
			}
		}
	};
	//被调用方法
	const getChecked = function (inputs) {
		const checkedInputs = [];
		for (let i = 0; i < inputs.length; i++) {
			if (inputs[i].checked) {
				checkedInputs.push(inputs[i].parentNode);
			}
		}
		return checkedInputs
	};
	//左边到右边
	const moveTo = function () {
		if (that.add.disabled === false) {
			const checked = getChecked(that.leftinput);
			for (let i = 0; i < checked.length; i++) {
				that.dataright.appendChild(checked[i]);
			}
			that.lc.checked = false;
			that.add.disabled = true;
		}
	};
	//右边到左边
	const moveBack = function () {
		if (that.remove.disabled === false) {
			const checked = getChecked(that.rightinput);
			for (let i = 0; i < checked.length; i++) {
				that.dataleft.appendChild(checked[i]);
				// listSearchUser2.push(checked[i])
			}
			that.rc.checked = false;
			that.remove.disabled = true;
		}
	};
	//自动判断全选
	left();
	right();
	left1();
	right1();
//左边到右边
	add.onclick = function(){
		moveTo();
		left();
		right();
		left1();
		right1();
		leftAll();
		rightAll();
	};
//右边到左边
	remove.onclick = function(){
		moveBack();
		left();
		right();
		left1();
		right1();
		leftAll();
		rightAll();
	};
//左边全选
	lc.onclick = function(){
		leftAll();
	};
//右边全选
	rc.onclick = function(){
		rightAll();
	}
}
//把上面封装起来
function RelativeMethods(num){ 
	new DataRelative(document.getElementsByClassName("data-left"+num)[0],document.getElementsByClassName("data-right"+num)[0],document.getElementById("left-checked"+num),document.getElementById("right-checked"+num),document.getElementById("add"+num),document.getElementById('remove'+num),document.getElementsByClassName("data-right"+num)[0].getElementsByTagName("input"),document.getElementsByClassName("data-left"+num)[0].getElementsByTagName("input")
		,document.getElementsByClassName("data-left"+num)[0].getElementsByTagName("span"),document.getElementsByClassName("data-right"+num)[0].getElementsByTagName("span"));
}

//新建的搜索
function searchUser(left_user,add_user_span,add_user1_span,nums,lists,listUser,searchParams){
	$('#'+left_user).html(listUser);//先把原本数据显示出来 然后在进行搜索
	lists = [];
	//去重
	$('#'+add_user1_span).each(function(){
		let a = this.innerHTML;
		$('#'+add_user_span).each(function () {
			if (this.innerHTML===a){
				$(this.parentNode).html("")
			}
		})
	});
	$('#'+add_user_span).each(function(){
		if (this.innerHTML.match($('#'+searchParams).val())){
			lists.push(this.parentNode);
		}
	});
	$('#'+left_user).html(lists);
	if ($('#'+left_user).html()===""){
		$('#'+left_user).html("<span style='font-size: 12px;margin-left: 36%;color: #8391a5;'>无数据...</span>");
	}
	RelativeMethods(nums);
}

//用户的搜索
let listSearchUser = [];
$('#search_user').click(function(){
	searchUser('add_user','add_user span','add_user1 span','',listSearchUser,listAddUser,'list_user')
});
$('#list_user').bind("keypress",function () {
	searchUser('add_user','add_user span','add_user1 span','',listSearchUser,listAddUser,'list_user')
});
$('#list_user').bind("keyup",function () {
	searchUser('add_user','add_user span','add_user1 span','',listSearchUser,listAddUser,'list_user')
});

//用户组的搜索
let listSearchUserGroup = [];
$('#search_usergroup').click(function(){
	searchUser('add_group','add_group span','add_group1 span',1,listSearchUserGroup,listUserGroup,'list_usergroup')
});
$('#list_usergroup').bind("keypress",function () {
	searchUser('add_group','add_group span','add_group1 span',1,listSearchUserGroup,listUserGroup,'list_usergroup')
});
$('#list_usergroup').bind("keyup",function () {
	searchUser('add_group','add_group span','add_group1 span',1,	listSearchUserGroup,listUserGroup,'list_usergroup')
});

//新建设备账号的搜索
let listSearchDeviceAccount = [];
$('#search_deviceAccount').click(function(){
	searchUser('add_device','add_device span','add_device1 span',2,listSearchDeviceAccount,listDeviceAccount,'list_deviceAccount')
});
$('#list_deviceAccount').bind("keypress",function () {
	searchUser('add_device','add_device span','add_device1 span',2,listSearchDeviceAccount,listDeviceAccount,'list_deviceAccount')
});
$('#list_deviceAccount').bind("keyup",function () {
	searchUser('add_device','add_device span','add_device1 span',2,listSearchDeviceAccount,listDeviceAccount,'list_deviceAccount')
});

//新建设备组的搜索
let listSearchDeviceGroup = [];
$('#search_devicegroup').click(function(){
	searchUser('add_devicegroup','add_devicegroup span','add_devicegroup1 span',3,listSearchDeviceGroup,listDeviceGroup,'list_devicegroup')
});
$('#list_devicegroup').bind("keypress",function () {
	searchUser('add_devicegroup','add_devicegroup span','add_devicegroup1 span',3,listSearchDeviceGroup,listDeviceGroup,'list_devicegroup')
});
$('#list_devicegroup').bind("keyup",function () {
	searchUser('add_devicegroup','add_devicegroup span','add_devicegroup1 span',3,listSearchDeviceGroup,listDeviceGroup,'list_devicegroup')
});

//新建命令集搜索
//新建设备组的搜索
let listSearchCmdGroup = [];
$('#search_cmdgroup').click(function(){
	searchUser('add_cmdgroup','add_cmdgroup span','add_cmdgroup1 span',4,listSearchCmdGroup,listCmdGroup,'list_cmdgroup')
});
$('#list_cmdgroup').bind("keypress",function () {
	searchUser('add_cmdgroup','add_cmdgroup span','add_cmdgroup1 span',4,listSearchCmdGroup,listCmdGroup,'list_cmdgroup')
});
$('#list_cmdgroup').bind("keyup",function () {
	searchUser('add_cmdgroup','add_cmdgroup span','add_cmdgroup1 span',4,listSearchCmdGroup,listCmdGroup,'list_cmdgroup')
});

//编辑的搜索
//用户
let ac_listSearchUser = [];
$('#search_ac_edituser').click(function(){
	searchUser('edit_user', 'edit_user span', 'edit_user1 span', 5, ac_listSearchUser, ac_edit_user_list, 'list_ac_edituser')
});
$('#list_ac_edituser').bind("keypress",function () {
	searchUser('edit_user','edit_user span','edit_user1 span',5,ac_listSearchUser,ac_edit_user_list,'list_ac_edituser')
});
$('#list_ac_edituser').bind("keyup",function () {
	searchUser('edit_user','edit_user span','edit_user1 span',5,ac_listSearchUser,ac_edit_user_list,'list_ac_edituser')
});
/*let ac_listSearchUser1 = [];
$('#search_ac_edituser1').click(function(){
	searchUser('edit_user1', 'edit_user1 span', 'edit_user span', 5, ac_listSearchUser1, ac_edit_user1_list, 'list_ac_edituser1')
})
$('#list_ac_edituser1').bind("keypress",function () {
	searchUser('edit_user1','edit_user1 span','edit_user span',5,ac_listSearchUser1,ac_edit_user1_list,'list_ac_edituser1')
})
$('#list_ac_edituser1').bind("keyup",function () {
	searchUser('edit_user1','edit_user1 span','edit_user span',5,ac_listSearchUser1,ac_edit_user1_list,'list_ac_edituser1')
})*/
//用户组
let ac_listSearchUserGroup = [];
$('#search_ac_editusergroup').click(function(){
	searchUser('edit_usergroup','edit_usergroup span','edit_usergroup1 span',6,ac_listSearchUserGroup,ac_edit_usergroup_list,'list_ac_editusergroup')
});
$('#list_ac_editusergroup').bind("keypress",function () {
	searchUser('edit_usergroup','edit_usergroup span','edit_usergroup1 span',6,ac_listSearchUserGroup,ac_edit_usergroup_list,'list_ac_editusergroup')
});
$('#list_ac_editusergroup').bind("keyup",function () {
	searchUser('edit_usergroup','edit_usergroup span','edit_usergroup1 span',6,ac_listSearchUserGroup,ac_edit_usergroup_list,'list_ac_editusergroup')
});
/*let ac_listSearchUserGroup1 = [];
$('#search_ac_editusergroup1').click(function(){
	searchUser('edit_usergroup1','edit_usergroup1 span','edit_usergroup span',6,ac_listSearchUserGroup1,ac_edit_usergroup1_list,'list_ac_editusergroup1')
})
$('#list_ac_editusergroup1').bind("keypress",function () {
	searchUser('edit_usergroup1','edit_usergroup1 span','edit_usergroup span',6,ac_listSearchUserGroup1,ac_edit_usergroup1_list,'list_ac_editusergroup1')
})
$('#list_ac_editusergroup1').bind("keyup",function () {
	searchUser('edit_usergroup1','edit_usergroup1 span','edit_usergroup span',6,ac_listSearchUserGroup1,ac_edit_usergroup1_list,'list_ac_editusergroup1')
})*/
//设备账号
let ac_listSearchDeviceAccount = [];
$('#search_ac_editdeviceaccount').click(function(){
	searchUser('edit_device','edit_device span','edit_device1 span',7,ac_listSearchDeviceAccount,ac_edit_device_list,'list_ac_editdeviceaccount')
});
$('#list_ac_editdeviceaccount').bind("keypress",function () {
	searchUser('edit_device','edit_device span','edit_device1 span',7,ac_listSearchDeviceAccount,ac_edit_device_list,'list_ac_editdeviceaccount')
});
$('#list_ac_editdeviceaccount').bind("keyup",function () {
	searchUser('edit_device','edit_device span','edit_device1 span',7,ac_listSearchDeviceAccount,ac_edit_device_list,'list_ac_editdeviceaccount')
});
/*let ac_listSearchDeviceAccount1 = [];
$('#search_ac_editdeviceaccount1').click(function(){
	searchUser('edit_device1','edit_device1 span','edit_device span',7,ac_listSearchDeviceAccount1,ac_edit_device1_list,'list_ac_editdeviceaccount1')
})
$('#list_ac_editdeviceaccount1').bind("keypress",function () {
	searchUser('edit_device1','edit_device1 span','edit_device span',7,ac_listSearchDeviceAccount1,ac_edit_device1_list,'list_ac_editdeviceaccount1')
})
$('#list_ac_editdeviceaccount1').bind("keyup",function () {
	searchUser('edit_device1','edit_device1 span','edit_device span',7,ac_listSearchDeviceAccount1,ac_edit_device1_list,'list_ac_editdeviceaccount1')
})*/
//设备组
let ac_listSearchDeviceGroup = [];
$('#search_ac_editdevicegroup').click(function(){
	searchUser('edit_devicegroup','edit_devicegroup span','edit_devicegroup1 span',8,ac_listSearchDeviceGroup,ac_edit_devicegroup_list,'list_ac_editdevicegroup')
});
$('#list_ac_editdevicegroup').bind("keypress",function () {
	searchUser('edit_devicegroup','add_cmdgroup span','edit_devicegroup1 span',8,ac_listSearchDeviceGroup,ac_edit_devicegroup_list,'list_ac_editdevicegroup')
});
$('#list_ac_editdevicegroup').bind("keyup",function () {
	searchUser('edit_devicegroup','edit_devicegroup span','edit_devicegroup1 span',8,ac_listSearchDeviceGroup,ac_edit_devicegroup_list,'list_ac_editdevicegroup')
});
/*let ac_listSearchDeviceGroup1 = [];
$('#search_ac_editdevicegroup1').click(function(){
	searchUser('edit_devicegroup1','edit_devicegroup1 span','edit_devicegroup span',8,ac_listSearchDeviceGroup1,ac_edit_devicegroup1_list,'list_ac_editdevicegroup1')
})
$('#list_ac_editdevicegroup1').bind("keypress",function () {
	searchUser('edit_devicegroup1','add_cmdgroup1 span','edit_devicegroup span',8,ac_listSearchDeviceGroup1,ac_edit_devicegroup1_list,'list_ac_editdevicegroup1')
})
$('#list_ac_editdevicegroup1').bind("keyup",function () {
	searchUser('edit_devicegroup1','edit_devicegroup1 span','edit_devicegroup span',8,ac_listSearchDeviceGroup1,ac_edit_devicegroup1_list,'list_ac_editdevicegroup1')
})*/
//命令集
let ac_listSearchCmdGroup = [];
$('#search_ac_cmdgroup').click(function(){
	searchUser('edit_cmdgroup','edit_cmdgroup span','edit_cmdgroup1 span',9,ac_listSearchCmdGroup,ac_edit_cmdgroup_list,'list_ac_cmdgroup')
});
$('#list_ac_cmdgroup').bind("keypress",function () {
	searchUser('edit_cmdgroup','edit_cmdgroup span','edit_cmdgroup1 span',9,ac_listSearchCmdGroup,ac_edit_cmdgroup_list,'list_ac_cmdgroup')
});
$('#list_ac_cmdgroup').bind("keyup",function () {
	searchUser('edit_cmdgroup','edit_cmdgroup span','edit_cmdgroup1 span',9,ac_listSearchCmdGroup,ac_edit_cmdgroup_list,'list_ac_cmdgroup')
});
/*
let ac_listSearchCmdGroup1 = [];
$('#search_ac_cmdgroup1').click(function(){
	searchUser('edit_cmdgroup1','edit_cmdgroup1 span','edit_cmdgroup span',9,ac_listSearchCmdGroup1,ac_edit_devicegroup1_list,'list_ac_cmdgroup1')
})
$('#list_ac_cmdgroup1').bind("keypress",function () {
	searchUser('edit_cmdgroup1','edit_cmdgroup1 span','edit_cmdgroup span',9,ac_listSearchCmdGroup1,ac_edit_devicegroup1_list,'list_ac_cmdgroup1')
})
$('#list_ac_cmdgroup1').bind("keyup",function () {
	searchUser('edit_cmdgroup1','edit_cmdgroup1 span','edit_cmdgroup span',9,ac_listSearchCmdGroup1,ac_edit_devicegroup1_list,'list_ac_cmdgroup1')
})*/
