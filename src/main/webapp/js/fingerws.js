
var FingerCodes = '';
var finger1start = false;
var finger2start = false;
var finger3start = false;
var _download = true;

function FingerWebSocket(url,onmessage,param)
 {
	
	
    if ("WebSocket" in window)
    {
       // 打开一个 web socket
       var ws = new WebSocket(url);
       ws.onopen = function()
       {
          // Web Socket 已连接上，使用 send() 方法发送数据
          //ws.send("发送数据");
          //alert("数据发送中...");
       };
       ws.onmessage = function (evt) 
       { 
          var received_msg = evt.data;
          onmessage(ws,received_msg,param)
       };
       
       ws.onclose = function()
       { 
          // 关闭 websocket
          //onclose();
    	   	//alert('关闭连接');
       };
    }
    else
    {
    		layer.msg("浏览器不支持WebSocket",{icon:5});;
    }
 }

function jasjWebFinger(m, userid, fseq, version){
	var baseurl = 'wss://www.laotiemmb.com:9236/finger';
	var versionurl = baseurl+"/getversion";
	var loginurl  =  baseurl+"/getimage?fopt=find";
	var signupurl = baseurl+"/getmodule?fseq="+fseq+"&fopt=add&user="+userid;
	var delurl    = baseurl+"/delete?fseq="+fseq+"&fopt=del&user="+userid;
	
	if(m=='login'){
		FingerWebSocket(loginurl,wsonloginmessage,'');
	}else if(m=='version'){
		FingerWebSocket(versionurl,wsonversionmessage,version);
	}else{
		var fingerstatus = getfingerstatus(fseq);
		if(fingerstatus=='1'){
			reset();
			window.parent.parent.layer.open({
	            title: ['确定要删除该指纹？',"height:50px;line-height:50px;padding:0 20px;text-align:center;font-size:14px;border-bottom:none;background:#dedede url('template/admin/images/layer-title.png') repeat center 100%;color:#ffffff"],
	            btn:['确认','取消'],
	            btnAlign: 'c',
	            isOutAnim: 0,
	            closeBtn: 0,
	            skin:'frozen-layer',
	            content: '',
	            success: function(layero){
	            	layero.find('.layui-layer-btn').css('text-align', 'center'); 
	            },
	            yes:function(index,layero){
	            		$(window).unbind('mousedown');
	            		FingerWebSocket(delurl,wsondelmessage,'');
	            		window.parent.parent.layer.closeAll();
	            },
		        btn2:function(index, layero){
		        		reset();
		        }
	        })
		}else if(fingerstatus=='0'){
			$(".submit-btn").show();
			FingerWebSocket(signupurl,wsonsignupmessage,'');
		}
	}
}

function wsonloginmessage(ws,msg){
	   var msg = JSON.parse(msg);
	   if(msg.Code=='101'){
		   document.getElementById("downloadurl").href='#';
		   $(".login-install").addClass("login-input");
	   }else if(msg.Code=='200'){
		   $('#fpdata').val(msg.FData);
		   $(".login-install").addClass("login-success");
		   document.getElementById("doAmsForm").submit();
	   }else if(msg.Code=='300'){
		   $('.login-install').css("background",'url(./images/wjcd.png) no-repeat center center');
	   }else if(msg.Code=='301'){
		   $('.login-install').css("background",'url(./images/kqsb.png) no-repeat center center');
	   }else if(msg.Code=='302'){
		   $('.login-install').css("background",'url(./images/dqsb.png) no-repeat center center');
	   }else if(msg.Code=='303'){
		   $('.login-install').css("background",'url(./images/yzsb.png) no-repeat center center');
	   }else if(msg.Code=='304'){
		   window.location.reload();
	   }else if(msg.Code=='400'){
	   }else if(msg.Code=='401'){
		   $('.login-install').css("background",'url(./images/login-install3.png) no-repeat center center');
	   }else{
		   	layer.msg(msg.Msg,{icon:5},function(){});
	   }
}

function wsonsignupmessage(ws,msg){
	   var msg = JSON.parse(msg);
	   if(msg.Code=='101'){
		   	finger1start=true;
		   	layer.msg(msg.Msg,{icon:6});
	   }else if(msg.Code=='102'){
		   	finger2start=true;
		   	layer.msg(msg.Msg,{icon:6},function(){$(".step2 .steps-img-two").addClass('step2-right-2')});
	   }else if(msg.Code=='103'){
		   	finger3start=true;
		   	layer.msg(msg.Msg,{icon:6},function(){$(".step2-right-2").addClass('step2-right-3')});
	   }else if(msg.Code=='200'){
		   if(finger1start&&finger2start&&finger3start){
			   ws.onclose(1);
			  //window.parent.document.getElementById('fingerdata').value+="#"+msg.FData;
			  window.parent.document.getElementById('fingerdata').value=msg.FData;
			   window.parent.document.getElementById('fingerchange').value=1;
			   layer.msg(msg.Msg,{icon:6});
			   reset();
			   addfingercodes(msg.FSeq);
		   }
	   }else if(msg.Code=='100'){
		   layer.msg(msg.Msg,{icon:6});
	   }/*else if(msg.Code=='300'){
		   $('.login-install').css("background",'url(./template/admin/images/wjcd.png) no-repeat center center');
	   }else if(msg.Code=='301'){
		   $('.login-install').css("background",'url(./template/admin/images/kqsb.png) no-repeat center center');
	   }else if(msg.Code=='302'){
		   $('.login-install').css("background",'url(./template/admin/images/dqsb.png) no-repeat center center');
	   }else if(msg.Code=='303'){
		   $('.login-install').css("background",'url(./template/admin/images/yzsb.png) no-repeat center center');
	   }else if(msg.Code=='304'){
		   window.location.reload();
	   }else if(msg.Code=='401'){
		   $('.login-install').css("background",'url(./template/admin/images/login-install3.png) no-repeat center center');
	   }*/else if(msg.Code=='400'){
	   }else{
		   	layer.msg(msg.Msg,{icon:5},function(){reset()});
	   }
}

function wsondelmessage(ws,msg){
	var msg = JSON.parse(msg);
	if(msg.Code=='200'){
		window.parent.document.getElementById('fingerdata').value+="#"+msg.FData;
	    window.parent.document.getElementById('fingerchange').value=1;
	    layer.msg(msg.Msg,{icon:6});
		reset();
		delfingercodes(msg.FSeq);
   }else if(msg.Code=='401'){
	   //$('.login-install').css("background",'url(./template/admin/images/login-install3.png) no-repeat center center');
	  
   }
}

function wsonversionmessage(ws,msg,version){
	var msg = JSON.parse(msg);
	if(msg.Code=='200'&&parseFloat(msg.Msg)>=parseFloat(version)){
		jasjWebFinger("login");
		document.getElementById("downloadurl").href='#';
		$(".login-install").addClass("login-input");
		_download = false;
   }else if(msg.Code=='300'){
	   $('.login-install').css("background",'url(./images/wjcd.png) no-repeat center center');
   }else if(msg.Code=='301'){
	   $('.login-install').css("background",'url(./images/kqsb.png) no-repeat center center');
   }else if(msg.Code=='302'){
	   $('.login-install').css("background",'url(./images/dqsb.png) no-repeat center center');
   }else if(msg.Code=='303'){
	   $('.login-install').css("background",'url(./images/yzsb.png) no-repeat center center');
   }else if(msg.Code=='304'){
	   window.location.reload();
   }else if(msg.Code=='401'){
   	   //$('.login-install').css("background",'url(./template/admin/images/login-install3.png) no-repeat center center');
   }
}

function getfingerpos(index){
	return index<6?10-index:index-6;
}

function getfingerstatus(index){
	return FingerCodes[getfingerpos(index)];
}

function addfingercodes(index){
	if(index>-1){
		var pos = getfingerpos(index);
		FingerCodes= FingerCodes.substr(0,pos)+'1'+FingerCodes.substr(pos+1);
	}
	updatestatus();
}

function delfingercodes(index){
	if(index>-1){
		var pos = getfingerpos(index);
		FingerCodes= FingerCodes.substr(0,pos)+'0'+FingerCodes.substr(pos+1);
	}
	updatestatus();
}

function updatestatus(){
	for(var i=0; i<FingerCodes.length; i++){
		if(i<5){
			ii=(5-i)+5;
		}else{
			ii=i-4;
		}
		if(FingerCodes[i]=='1'){
			$('#finger_'+ii).css('display','none');
			$('#finger_'+ii+'a').css('display','');
		}else{
			$('#finger_'+ii).css('display','');
			$('#finger_'+ii+'a').css('display','none');
		}
	}
}

function reset(){
	$(".step2 .steps-img-one").removeClass("login-step2-0");
	$(".step2 .steps-img-one").removeClass("login-step2-1");
	$(".step2 .steps-img-one").removeClass("login-step2-2");
	$(".step2 .steps-img-one").removeClass("login-step2-3");
	$(".step2 .steps-img-one").removeClass("login-step2-4");
	$(".step2 .steps-img-one").removeClass("login-step2-5");
	$(".step2 .steps-img-one").removeClass("login-step2-6");
	$(".step2 .steps-img-one").removeClass("login-step2-7");
	$(".step2 .steps-img-one").removeClass("login-step2-8");
	$(".step2 .steps-img-one").removeClass("login-step2-9");
	$(".step2").hide();
	$(".step1").show();
	$(".submit-btn").hide();
	$(window).bind('mousedown',check);
}