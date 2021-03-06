package com.longersec.blj.web;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.longersec.blj.domain.*;
import com.longersec.blj.service.DepartmentService;
import com.longersec.blj.utils.Validator;
import org.apache.commons.collections.CollectionUtils;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import com.longersec.blj.service.ApppubServerService;
import com.longersec.blj.service.OperatorLogService;
import com.longersec.blj.utils.Operator_log;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;


/**
 * 
 */
@Controller
@RequestMapping(value = "/apppubServer")
public class ApppubServerController {
	@Autowired
	private OperatorLogService operatorLogService;
	@Autowired
	private ApppubServerService apppubServerService;
	@Autowired
	private DepartmentService departmentService;

	@RequestMapping("/listApppubServer")
	@ResponseBody
	public JSONObject listApppubServer(ApppubServer apppubServer,
									   @RequestParam(value = "sname",required = false,defaultValue = "") String sname,
									   HttpServletRequest request, HttpSession session) {
		if (sname == null || "".equals(sname)) {
			sname = "";
		}
		int page_start = Integer.parseInt(request.getParameter("start"));
		int page_length = Integer.parseInt(request.getParameter("length"));
		User p_user = (User) SecurityUtils.getSubject().getPrincipal();
		List<Integer> depart_ids = new ArrayList<>();
		if (p_user.getRole_id().equals(5)){
			//获取所在的部门
			int depart_id = p_user.getDepartment();
			depart_ids = departmentService.selectById(depart_id);
			depart_ids.add(p_user.getDepartment());
		}
		ArrayList<Object> resultApppubServers = new ArrayList<Object>();
		ArrayList<ApppubServer> apppubServers = new ArrayList<ApppubServer>();
		long total = 0;
		int type =1;
		resultApppubServers = (ArrayList<Object>)apppubServerService.findAll(apppubServer,sname,type,page_start, page_length,depart_ids);
		if(CollectionUtils.isNotEmpty(resultApppubServers)) {
			apppubServers = (ArrayList<ApppubServer>)resultApppubServers.get(0);
			total = ((ArrayList<Long>) resultApppubServers.get(1)).get(0);
		}
		for (ApppubServer apppubServer1 : apppubServers) {
			List<String> allParentName = departmentService.findAllParentName(apppubServer1.getDepartment());
			StringBuilder stringBuilder = new StringBuilder();
			for (Object strings : allParentName) {
				stringBuilder.append(strings).append("/");
			}
			apppubServer1.setTopName1(stringBuilder.substring(0, stringBuilder.length() - 1));
		}
		JSONArray jsonArray = JSONArray.fromObject(apppubServers);
		JSONObject result = new JSONObject();
		result.accumulate("success", true);
		result.accumulate("recordsTotal", total);
		result.accumulate("recordsFiltered", total);
		result.accumulate("data", jsonArray);
		return result;
	}

	@RequestMapping("/addApppubServer")
	@ResponseBody
	public JSONObject addApppubServer(@Validated ApppubServer apppubServer, BindingResult errorResult, HttpServletRequest request, HttpSession session) {
		return this.editApppubServer(apppubServer,errorResult,request,session);
	}

	@RequestMapping("/editApppubServer")
	@ResponseBody
	public JSONObject editApppubServer(@Validated ApppubServer apppubServer, BindingResult errorResult, HttpServletRequest request, HttpSession session) {
		JSONObject result = new JSONObject();
		result.put("success", true);
		Boolean r = false;
		Map<String, Object> resultMap = Validator.fieldValidate(errorResult);
		//操作日志
		OperatorLog operatorLog =Operator_log.log(request, session);
		operatorLog.setModule("应用管理");

		if (apppubServer.getId()==null){
			operatorLog.setDetails("增加应用服务器["+apppubServer.getName()+"]");
			operatorLog.setContent("添加");
			ApppubServer apppubServer1 = apppubServerService.checkname(0,apppubServer.getName());
			ApppubServer apppubServer2 = apppubServerService.checkip(apppubServer.getIp(),apppubServer.getId());
			if(resultMap == null && apppubServer1==null && apppubServer2 ==null){
				r = apppubServerService.addApppubServer(apppubServer);
				if (r){
					operatorLog.setResult("成功");
					result.put("success", true);
				}else{
					operatorLog.setResult("失败");
					result.put("success", false);
				}
			}else{
				result.put("success", false);
				operatorLog.setResult("失败");
			}
		}else{
			operatorLog.setDetails("编辑应用服务器["+apppubServer.getName()+"]");
			operatorLog.setContent("编辑");
			ApppubServer apppubServer1 = apppubServerService.checkname(apppubServer.getId(),apppubServer.getName());
			ApppubServer apppubServer2 = apppubServerService.checkip(apppubServer.getIp(),apppubServer.getId());
			if (resultMap == null && apppubServer1==null && apppubServer2 ==null){
				r = apppubServerService.editApppubServer(apppubServer);
				if (r){
					operatorLog.setResult("成功");
					result.put("success", true);
				}else{
					operatorLog.setResult("失败");
					result.put("success", false);
				}
			}else{
				result.put("success", false);
				operatorLog.setResult("失败");
			}
		}
		operatorLogService.addOperatorLog(operatorLog);
		return result;
	}

	@RequestMapping("/delApppubServer")
	@ResponseBody
	public JSONObject delApppubServer(@RequestParam(value = "ids[]") Integer[] ids, HttpServletRequest request, HttpSession session) {
		JSONObject result = new JSONObject();
		List<Integer> _ids =  Arrays.asList(ids);
		result.accumulate("success", true);
		//操作日志
		OperatorLog operatorLog =Operator_log.log(request, session);
		operatorLog.setModule("应用管理");
		operatorLog.setDetails("删除应用服务器");
		operatorLog.setContent("删除");
		//是否操作成功
		if(_ids.isEmpty()) {
			result.accumulate("success", false);
			result.accumulate("msg", "id不能为空");
		}
		if(result.getBoolean("success")) {
			operatorLog.setResult("成功");
			Boolean r = apppubServerService.delApppubServer(_ids);
			result.accumulate("success", r);
		}else {
			operatorLog.setResult("失败");
		}
		operatorLogService.addOperatorLog(operatorLog);
		return result;
	}

	@RequestMapping("/checkName")
	@ResponseBody
	public JSONObject checkName(@RequestParam(value = "id",required = false) Integer id,@RequestParam(value = "name") String name) {
		JSONObject result = new JSONObject();
		result.put("success", true);
		if (id == null){
			result.put("success", false);
		}
		if (!result.getBoolean("success")){
			ApppubServer _name = apppubServerService.checkname(0,name);
			if (_name==null){
				result.put("success", true);
			}else {
				result.put("success", false);
			}
		}else{
			ApppubServer _name = apppubServerService.checkname(id,name);
			if (_name==null){
				result.put("success", true);
			}else {
				if (_name.getId().equals(id)){
					result.put("success", true);
				}else {
					result.put("success", false);
				}
			}
		}
		return result;
	}

	@RequestMapping("/checkIp")
	@ResponseBody
	public JSONObject checkIp(@RequestParam(value = "id",required = false) Integer id,@RequestParam(value = "ip") String ip) {
		JSONObject result = new JSONObject();
		ApppubServer _ip = apppubServerService.checkip(ip, id);
		if (_ip==null){
			result.put("success", true);
		}else{
			result.put("success", false);
		}
		return result;
	}
}
