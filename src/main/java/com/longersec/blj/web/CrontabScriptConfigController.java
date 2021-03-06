package com.longersec.blj.web;

import com.longersec.blj.domain.AccessPolicy;
import com.longersec.blj.domain.CrontabScriptConfig;
import com.longersec.blj.domain.OperatorLog;
import com.longersec.blj.domain.User;
import com.longersec.blj.service.*;
import com.longersec.blj.utils.Operator_log;
import com.longersec.blj.utils.SystemCommandUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.commons.collections.CollectionUtils;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


/**
 * 
 */
@Controller
@RequestMapping(value = "/crontabScriptConfig")
public class CrontabScriptConfigController {
	@Autowired
	private OperatorLogService operatorLogService;
	@Autowired
	private ConfigService configService;
	@Autowired
	private CrontabScriptConfigService crontabScriptConfigService;
	@Autowired
	private CrontabScriptConfigDeviceService crontabScriptConfigDeviceService;
	@Autowired
	private CrontabScriptConfigGroupService crontabScriptConfigGroupService;
	@Autowired
	private DepartmentService departmentService;
	@RequestMapping("/listCrontabScriptConfig")
	@ResponseBody
	public JSONObject listCrontabScriptConfig(CrontabScriptConfig crontabScriptConfig,HttpServletRequest request, HttpSession session) {
		int page_start = Integer.parseInt(request.getParameter("start"));
		int page_length = Integer.parseInt(request.getParameter("length"));
		ArrayList<Object> resultCrontabScriptConfigs = new ArrayList<Object>();
		ArrayList<CrontabScriptConfig> crontabScriptConfigs = new ArrayList<CrontabScriptConfig>();
		User principal =(User) SecurityUtils.getSubject().getPrincipal();
		List<Integer> depart_ids = new ArrayList<>();
		if (principal.getRole_id().equals(5)){
			//获取所在的部门
			int depart_id = principal.getDepartment();
			depart_ids = departmentService.selectById(depart_id);
			depart_ids.add(principal.getDepartment());
		}
		long total = 0;
		resultCrontabScriptConfigs = (ArrayList<Object>)crontabScriptConfigService.findAll(crontabScriptConfig, page_start, page_length,depart_ids);
		if(CollectionUtils.isNotEmpty(resultCrontabScriptConfigs)) {
			crontabScriptConfigs = (ArrayList<CrontabScriptConfig>)resultCrontabScriptConfigs.get(0);
			total = ((ArrayList<Long>) resultCrontabScriptConfigs.get(1)).get(0);
		}

		for (CrontabScriptConfig crontabScriptConfig1 : crontabScriptConfigs) {
			if(crontabScriptConfig1.getDepartment()!=0) {
				List<String> allParentName = departmentService.findAllParentName(crontabScriptConfig1.getDepartment());
				StringBuilder stringBuilder = new StringBuilder();
				for (Object strings : allParentName) {
					stringBuilder.append(strings).append("/");
				}
				crontabScriptConfig1.setTopName(stringBuilder.substring(0, stringBuilder.length() - 1));
			}
		}

		JSONArray jsonArray = JSONArray.fromObject(crontabScriptConfigs);
		JSONObject result = new JSONObject();
		result.accumulate("success", true);
		result.accumulate("recordsTotal", total);
		result.accumulate("recordsFiltered", total);
		result.accumulate("data", jsonArray);
		return result;
	}

	@RequestMapping("/addCrontabScriptConfig")
	@ResponseBody
	public JSONObject addCrontabScriptConfig(@RequestParam(value="devicegroup[]", required=false) Integer[] _devicegroup,
	                                         @RequestParam(value="devices[]", required=false) Integer[] _device, HttpServletRequest request, HttpSession session, CrontabScriptConfig crontabScriptConfig) {
		List<Integer> device 		=  	_device==null?null:Arrays.asList(_device);
		List<Integer> devicegroup 	= 	_devicegroup==null?null:Arrays.asList(_devicegroup);	
		JSONObject result = new JSONObject();

		User user = (User) SecurityUtils.getSubject().getPrincipal();
		crontabScriptConfig.setDepartment(user.getDepartment());

        //操作日志
		OperatorLog operatorLog =Operator_log.log(request, session);
		operatorLog.setModule("执行任务");
		operatorLog.setDetails("添加执行任务["+crontabScriptConfig.getName()+"]");
		operatorLog.setContent("添加");	
		String name = crontabScriptConfig.getName();
		String regex = "^([A-Za-z]|[\\u4e00-\\u9fa5]|\\-|[0-9]|[;%&'@!#$%*+,=_?$]){1,32}$";
		if (!name.matches(regex)) {
			result.accumulate("success", false);
			result.accumulate("name", "请输入正确的任务名称");
		}else {
			result.accumulate("success", true);
		}
		//是否操作成功
		if(result.getBoolean("success")) {
			operatorLog.setResult("成功");			
			crontabScriptConfigService.addCrontabScriptConfig(crontabScriptConfig);
			if(device != null) {
			crontabScriptConfigDeviceService.addCrontabScriptConfigDevice(crontabScriptConfig.getId(), device);
			}
			if(devicegroup!=null) {
			crontabScriptConfigGroupService.addCrontabScriptConfigDeviceGroup(crontabScriptConfig.getId(),devicegroup);
			}
			/* result.put("success", crontabScriptConfig.getId()>0?true:false); */
			result.put("success", true);
			operatorLogService.addOperatorLog(operatorLog);
		}else {
			operatorLog.setResult("失败");
			operatorLogService.addOperatorLog(operatorLog);
		}
		return result;
	}

	
	@RequestMapping("/editCrontabScriptConfig")
	@ResponseBody
	public JSONObject editCrontabScriptConfig(CrontabScriptConfig crontabScriptConfig, HttpServletRequest request, HttpSession session) {
		JSONObject result = new JSONObject();
		result.accumulate("success", true);
		if(result.getBoolean("success")) {
			Boolean r = crontabScriptConfigService.editCrontabScriptConfig(crontabScriptConfig);
			result.accumulate("success", r?true:false);
		}
		return result;
	}

	@RequestMapping("/delCrontabScriptConfig")
	@ResponseBody
	public JSONObject delCrontabScriptConfig(@RequestParam(value = "ids[]") Integer[] ids, HttpServletRequest request, HttpSession session) {
		JSONObject result = new JSONObject();
		List<Integer> _ids =  Arrays.asList(ids);
		if(_ids.isEmpty()) {
			result.put("success", false);
			result.accumulate("msg", "id不能为空");
		}
		boolean r = crontabScriptConfigService.delCrontabScriptConfig(_ids);
		result.put("success", r);
		return result;
	}
	

	@RequestMapping("/checkName")
	@ResponseBody
	public JSONObject checkName(@RequestParam(value = "id",required = false) Integer id,@RequestParam(value = "name") String name) {
		JSONObject result = new JSONObject();
	/*	if (id == null || "".equals(id)){
			id = 0;
		}
		String count = crontabScriptConfigService.selectName(id,name);
		if (count != null){
			result.put("success", false);
		}else{
			result.put("success", true);
		}
		return result;*/
		result.put("success", true);
		if (id==null){
			result.put("success", false);
		}
		if (!result.getBoolean("success")){
			CrontabScriptConfig _config = crontabScriptConfigService.checkname(name);
			if (_config==null){
				result.put("success", true);
			}else {
				result.put("success", false);
			}
		}else {
			CrontabScriptConfig _config = crontabScriptConfigService.checkname(name);
			if (_config==null){
				result.put("success", true);
			}else {
				if (_config.getId().equals(id)){
					result.put("success", true);
				}else {
					result.put("success", false);
				}
			}
		}

		return result;
	}

	@RequestMapping("/executeCommand")
	@ResponseBody
	public JSONObject executeCommand(@RequestParam(value = "id") Integer id, HttpServletRequest request, HttpSession session) {
		JSONObject result = new JSONObject();
		result.accumulate("success", true);
		if(result.getBoolean("success")) {
			SystemCommandUtil.execCmd(configService.getByName("lsbljCrontabCommand").getValue()+" "+id);
		}
		return result;
	}
}
