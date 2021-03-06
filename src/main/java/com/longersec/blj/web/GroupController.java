package com.longersec.blj.web;

import com.longersec.blj.domain.Group;
import com.longersec.blj.domain.OperatorLog;
import com.longersec.blj.domain.User;
import com.longersec.blj.service.DepartmentService;
import com.longersec.blj.service.GroupService;
import com.longersec.blj.service.OperatorLogService;
import com.longersec.blj.utils.Operator_log;
import com.longersec.blj.utils.Validator;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.commons.collections.CollectionUtils;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;


/**
 * 
 */
@Controller
@RequestMapping(value = "/group")
public class GroupController {

	@Autowired
	private GroupService groupService;

	@Autowired
	private OperatorLogService operatorLogService;

	@Autowired
	private DepartmentService departmentService;

	
	@RequestMapping("/listGroup")
	@ResponseBody
	public JSONObject listGroup(Group group, HttpServletRequest request, HttpSession session) {
		int page_start = Integer.parseInt(request.getParameter("start"));
		int page_length = Integer.parseInt(request.getParameter("length"));
		User p_user = (User) SecurityUtils.getSubject().getPrincipal();
		Integer depart_id =1;
		if (p_user.getRole_id().equals(5)){
			//获取所在的部门
			depart_id = p_user.getDepartment();
		}
		ArrayList<Object> resultGroups = new ArrayList<Object>();
		ArrayList<Group> groups = new ArrayList<Group>();
		long total = 0;
		if(group.getSearchAll()!=null&&group.getSearchAll().equals("")) group.setSearchAll(null);
		resultGroups = (ArrayList<Object>)groupService.findAll(group, page_start, page_length,depart_id);

		if(CollectionUtils.isNotEmpty(resultGroups)) {
			groups = (ArrayList<Group>)resultGroups.get(0);
			total = ((ArrayList<Long>) resultGroups.get(1)).get(0);
		}
		if(group.getType()!=1) {
			for (Group group1 : groups) {
				List<String> allParentName = departmentService.findAllParentName(group1.getDepartment());
				StringBuilder stringBuilder = new StringBuilder();
				for (Object strings : allParentName) {
					stringBuilder.append(strings).append("/");
				}
				group1.setTopName(stringBuilder.substring(0, stringBuilder.length() - 1));
			}
		}else{
			for (Group group2 : groups) {
				List<String> allParentName = departmentService.findAllParentName(group2.getDepartment());
				StringBuilder stringBuilder = new StringBuilder();
				for (Object strings : allParentName) {
					stringBuilder.append(strings).append("/");
				}
				group2.setTopName1(stringBuilder.substring(0, stringBuilder.length() - 1));
			}
		}
		JSONArray jsonArray = JSONArray.fromObject(groups);
		JSONObject result = new JSONObject();
		result.accumulate("success", true);
		result.accumulate("recordsTotal", total);
		result.accumulate("recordsFiltered", total);
		result.accumulate("data", jsonArray);
		return result;
	}

	@RequestMapping("/listByType")
	@ResponseBody
	public JSONObject listByType(Group group){
		ArrayList<Group> groups = new ArrayList<Group>();
		groups = groupService.listByType(group.getType(),1);
		JSONArray jsonArray = JSONArray.fromObject(groups);
		JSONObject result = new JSONObject();
		result.accumulate("success", true);
		result.accumulate("data", jsonArray);
		return result;
	}

	@RequestMapping("/editGroup")
	@ResponseBody
	public JSONObject editGroup(@Validated Group group,BindingResult errorResult,
	                            @RequestParam(value = "id",required = false)Integer id,
	                            @RequestParam("type")Integer type,HttpServletRequest request, HttpSession session) {
		JSONObject result = new JSONObject();
		OperatorLog operatorLog = null;
		User user = (User) SecurityUtils.getSubject().getPrincipal();
		group.setCreate_time((int) System.currentTimeMillis());
		group.setCreator_id(user.getId());
		if (type==1) {
	        //操作日志
			operatorLog =Operator_log.log(request, session);
			operatorLog.setModule("设备组");		
		}else {	
	        //操作日志
			operatorLog =Operator_log.log(request, session);
			operatorLog.setModule("用户组");			
		}
		Boolean r = false;
		if (group.getId()!=null) {
			if (type==1) {
				operatorLog.setDetails("编辑设备组["+group.getName()+"]");
			}else {
				operatorLog.setDetails("编辑用户组["+group.getName()+"]");
			}
			operatorLog.setContent("编辑");
			Map<String, Object> resultMap = Validator.fieldValidate(errorResult);
			String name = group.getName();
			Group groupname = groupService.checkname(group);
			//数据错误
			if (groupname != null && !groupname.getId().equals(group.getId())) {
				result.accumulate("error", "组名重复");
			}else {
				groupname =null;
				result.accumulate("error", "");
			}
			if (resultMap != null) {
				result.accumulate("errorMessage", resultMap);
			}else {
				result.accumulate("errorMessage", "");
			}
			//数据正确
			if (resultMap==null && groupname==null) {
				r = groupService.editGroup(group);
				if (r) {
					result.accumulate("success", true);
					result.accumulate("win", "编辑成功");
					operatorLog.setResult("成功");
					operatorLogService.addOperatorLog(operatorLog);
				}else {
					result.put("success",false);
					result.put("false", "编辑失败");
					operatorLog.setResult("失败");
					operatorLogService.addOperatorLog(operatorLog);
				}
			}else {
				result.put("success", false);
				operatorLog.setResult("失败");
				operatorLogService.addOperatorLog(operatorLog);
			}
		}else {
//			group.setDepartment(user.getDepartment());
			if (type==1) {
				operatorLog.setDetails("增加设备组["+group.getName()+"]");
			}else {
				operatorLog.setDetails("增加用户组["+group.getName()+"]");
			}
			operatorLog.setContent("添加");
			Map<String, Object> resultMap = Validator.fieldValidate(errorResult);
			String name = group.getName();
			Group groupname = groupService.checkname(group);
			System.out.println(groupname);
			//数据错误
			if (groupname != null) {
				result.accumulate("error", "组名重复");
			}else {
				result.accumulate("error", "");
			}
			if (resultMap != null) {
				result.accumulate("errorMessage", resultMap);
			}else {
				result.accumulate("errorMessage", "");
			}
			//数据正确
			if (resultMap==null&&groupname==null) {
				group.setCount(0);
				r = groupService.addGroup(group);
				if (r) {
					result.accumulate("success", true);
					result.accumulate("win", "添加成功");
					operatorLog.setResult("成功");
					operatorLogService.addOperatorLog(operatorLog);
				}
			}else {
				result.accumulate("success", false);
				operatorLog.setResult("失败");
				operatorLogService.addOperatorLog(operatorLog);	
			}
		}
		return result;
	}

	@RequestMapping("/delGroup")
	@ResponseBody
	public JSONObject delGroup(@RequestParam(value = "ids[]") Integer[] ids,@RequestParam(value = "type") Integer type, HttpServletRequest request, HttpSession session) {
		JSONObject result = new JSONObject();
		List<Integer> _ids =  Arrays.asList(ids);
		result.accumulate("success", true);
		if(_ids.isEmpty()) {
			result.put("success", false);
			result.put("msg", "id不能为空");
		}
		
        //操作日志
		OperatorLog operatorLog =Operator_log.log(request, session);
		operatorLog.setContent("删除");
		String groups = "";
		if (type==0){
			operatorLog.setModule("用户组");
			for (Integer _id : ids){
				groups += groupService.selectById(_id, type)+",";
			}
			operatorLog.setDetails("删除用户组["+groups.substring(0,groups.length()-1)+"]");
		}else {
			operatorLog.setModule("设备组");
			for (Integer _id : ids){
				groups += groupService.selectById(_id, type)+",";
			}
			operatorLog.setDetails("删除设备组["+groups.substring(0,groups.length()-1)+"]");
		}
		//是否操作成功
		if(result.getBoolean("success")) {
			operatorLog.setResult("成功");
			operatorLogService.addOperatorLog(operatorLog);
			Boolean r = groupService.delGroup(_ids);
			result.put("success", r);
		}  else {
			operatorLog.setResult("失败");
			operatorLogService.addOperatorLog(operatorLog);
		}
		return result;
	}

	@RequestMapping("/checkname")
	@ResponseBody
	public JSONObject checkname(@RequestParam(value = "name") String name,@RequestParam(value = "type") Integer type,@RequestParam(value = "id" ,required = false)Integer id){
		JSONObject result = new JSONObject();
		Group group = new Group();
		group.setType(type);
		group.setName(name);
		result.put("success", true);
		if (id==null){
			result.put("success", false);
		}
		if (!result.getBoolean("success")){
			Group _group = groupService.checkname(group);
			if (_group==null){
				result.put("success", true);
			}else {
				result.put("success", false);
			}
		}else {
			Group _group = groupService.checkname(group);
			if (_group==null){
				result.put("success", true);
			}else {
				if (_group.getId().equals(id)){
					result.put("success", true);
				}else {
					result.put("success", false);
				}
			}
		}

		return result;
	}
}
