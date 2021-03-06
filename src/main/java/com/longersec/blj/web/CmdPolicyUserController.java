package com.longersec.blj.web;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.longersec.blj.domain.User;
import org.apache.commons.collections.CollectionUtils;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import com.longersec.blj.domain.CmdPolicyUser;
import com.longersec.blj.domain.DTO.Users;
import com.longersec.blj.service.CmdPolicyUserService;
import com.longersec.blj.service.UserService;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;


/**
 * 
 */
@Controller
@RequestMapping(value = "/cmdPolicyUser")
public class CmdPolicyUserController {

	@Autowired
	private CmdPolicyUserService cmdPolicyUserService;

	@Autowired
	private UserService userService;
	
	@RequestMapping("/findCmdPolicyUserAndUser")
	@ResponseBody
	public JSONObject findCmdPolicyUserAndUser(@RequestParam("policy_id") Integer policy_id,
	                                           @RequestParam(value = "page_start",required = false)int page_start,
	                                           @RequestParam(value ="page_length",required = false)int page_length) {
		ArrayList<Users> resultCmdPolicyUsers = new ArrayList<Users>();
		ArrayList<Users> resultUsers = new ArrayList<Users>();
		User users = (User) SecurityUtils.getSubject().getPrincipal();
		resultCmdPolicyUsers = (ArrayList<Users>) cmdPolicyUserService.selectById(policy_id);
		resultUsers = (ArrayList<Users>) userService.selectNameAndId(users.getDepartment(),page_start,page_length);
		JSONObject result = new JSONObject();
		resultUsers.removeAll(resultCmdPolicyUsers);
		JSONArray jsonArray_p_users = JSONArray.fromObject(resultCmdPolicyUsers);
		JSONArray jsonArray_users = JSONArray.fromObject(resultUsers);
		result.accumulate("success", true);
		result.accumulate("data_users", jsonArray_users);
		result.accumulate("data_p_users", jsonArray_p_users);
		return result;
	}
	
	@RequestMapping("/listCmdPolicyUser")
	@ResponseBody
	public JSONObject listCmdPolicyUser(CmdPolicyUser cmdPolicyUser,HttpServletRequest request, HttpSession session) {
		int page_start = Integer.parseInt(request.getParameter("start"));
		int page_length = Integer.parseInt(request.getParameter("length"));
		ArrayList<Object> resultCmdPolicyUsers = new ArrayList<Object>();
		ArrayList<CmdPolicyUser> cmdPolicyUsers = new ArrayList<CmdPolicyUser>();
		long total = 0;
		resultCmdPolicyUsers = (ArrayList<Object>)cmdPolicyUserService.findAll(cmdPolicyUser, page_start, page_length);
		if(CollectionUtils.isNotEmpty(resultCmdPolicyUsers)) {
			cmdPolicyUsers = (ArrayList<CmdPolicyUser>)resultCmdPolicyUsers.get(0);
			total = ((ArrayList<Long>) resultCmdPolicyUsers.get(1)).get(0);
		}
		JSONArray jsonArray = JSONArray.fromObject(cmdPolicyUsers);
		JSONObject result = new JSONObject();
		result.accumulate("success", true);
		result.accumulate("recordsTotal", total);
		result.accumulate("recordsFiltered", total);
		result.accumulate("data", jsonArray);
		return result;
	}

	@RequestMapping("/addCmdPolicyUser")
	@ResponseBody
	public JSONObject addCmdPolicyUser(@RequestParam(value="user[]") Integer[] _user, HttpServletRequest request, HttpSession session) {
		JSONObject result = new JSONObject();
		List<Integer> user = Arrays.asList(_user);
		result.accumulate("success", true);
		if(result.getBoolean("success")) {
			Integer policy_id = null;
			Boolean r = cmdPolicyUserService.addCmdPolicyUser(policy_id,user);
			result.accumulate("success", r?true:false);
		}
		return result;
	}

	@RequestMapping("/editCmdPolicyUser")
	@ResponseBody
	public JSONObject editCmdPolicyUser(@RequestParam(value="policy_id") Integer policy_id,@RequestParam(value="user[]",required = false) Integer[] _user,HttpServletRequest request, HttpSession session) {
		JSONObject result = new JSONObject();
		boolean r = true;
		cmdPolicyUserService.deleteBypolicy_id(policy_id);
		if (_user != null) {
			r = cmdPolicyUserService.editCmdPolicyUser(policy_id, Arrays.asList(_user));
		}
		result.put("success", r);
		return result;
	}

	@RequestMapping("/delCmdPolicyUser")
	@ResponseBody
	public JSONObject delCmdPolicyUser(@RequestParam(value = "ids[]") String[] ids, HttpServletRequest request, HttpSession session) {
		JSONObject result = new JSONObject();
		List<String> _ids =  Arrays.asList(ids);
		result.accumulate("success", true);
		if(_ids.isEmpty()) {
			result.accumulate("success", false);
			result.accumulate("msg", "id不能为空");
		}
		if(result.getBoolean("success")) {
			Boolean r = cmdPolicyUserService.delCmdPolicyUser(_ids);
			result.accumulate("success", r);
		}
		return result;
	}
}
