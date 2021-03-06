package com.longersec.blj.web;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import com.longersec.blj.domain.ChangePasswordPolicyApppubAccount;
import com.longersec.blj.service.ChangePasswordPolicyApppubAccountService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;


/**
 * 
 */
@Controller
@RequestMapping(value = "/changePasswordPolicyApppubAccount")
public class ChangePasswordPolicyApppubAccountController {

	@Autowired
	private ChangePasswordPolicyApppubAccountService changePasswordPolicyApppubAccountService;

	@RequestMapping("/listChangePasswordPolicyApppub")
	@ResponseBody
	public JSONObject listChangePasswordPolicyApppub(ChangePasswordPolicyApppubAccount changePasswordPolicyApppubAccount,HttpServletRequest request, HttpSession session) {
		int page_start = Integer.parseInt(request.getParameter("start"));
		int page_length = Integer.parseInt(request.getParameter("length"));
		ArrayList<Object> resultChangePasswordPolicyApppubs = new ArrayList<Object>();
		ArrayList<ChangePasswordPolicyApppubAccount> changePasswordPolicyApppubs = new ArrayList<ChangePasswordPolicyApppubAccount>();
		long total = 0;
		resultChangePasswordPolicyApppubs = (ArrayList<Object>)changePasswordPolicyApppubAccountService.findAll(changePasswordPolicyApppubAccount, page_start, page_length);
		if(CollectionUtils.isNotEmpty(resultChangePasswordPolicyApppubs)) {
			changePasswordPolicyApppubs = (ArrayList<ChangePasswordPolicyApppubAccount>)resultChangePasswordPolicyApppubs.get(0);
			total = ((ArrayList<Long>) resultChangePasswordPolicyApppubs.get(1)).get(0);
		}
		JSONArray jsonArray = JSONArray.fromObject(changePasswordPolicyApppubs);
		JSONObject result = new JSONObject();
		result.accumulate("success", true);
		result.accumulate("recordsTotal", total);
		result.accumulate("recordsFiltered", total);
		result.accumulate("data", jsonArray);
		return result;
	}

	@RequestMapping("/addChangePasswordPolicyApppubAccount")
	@ResponseBody
	public JSONObject addChangePasswordPolicyApppubAccount(ChangePasswordPolicyApppubAccount changePasswordPolicyApppubAccount, HttpServletRequest request, HttpSession session) {
		JSONObject result = new JSONObject();
		result.accumulate("success", true);
		if(result.getBoolean("success")) {
			Boolean r = changePasswordPolicyApppubAccountService.addChangePasswordPolicyApppubAccount(changePasswordPolicyApppubAccount);
			result.accumulate("success", r?true:false);
		}
		return result;
	}

	@RequestMapping("/editChangePasswordPolicyApppubAccount")
	@ResponseBody
	public JSONObject editChangePasswordPolicyApppubAccount(ChangePasswordPolicyApppubAccount changePasswordPolicyApppubAccount, HttpServletRequest request, HttpSession session) {
		JSONObject result = new JSONObject();
		result.accumulate("success", true);
		if(result.getBoolean("success")) {
			Boolean r = changePasswordPolicyApppubAccountService.editChangePasswordPolicyApppubAccount(changePasswordPolicyApppubAccount);
			result.accumulate("success", r?true:false);
		}
		return result;
	}

	@RequestMapping("/delChangePasswordPolicyApppub")
	@ResponseBody
	public JSONObject delChangePasswordPolicyApppub(@RequestParam(value = "ids[]") Integer[] ids, HttpServletRequest request, HttpSession session) {
		JSONObject result = new JSONObject();
		List<Integer> _ids =  Arrays.asList(ids);
		result.accumulate("success", true);
		if(_ids.isEmpty()) {
			result.accumulate("success", false);
			result.accumulate("msg", "id不能为空");
		}
		if(result.getBoolean("success")) {
			Boolean r = changePasswordPolicyApppubAccountService.delChangePasswordPolicyApppubAccount(_ids);
			result.accumulate("success", r);
		}
		return result;
	}
}
