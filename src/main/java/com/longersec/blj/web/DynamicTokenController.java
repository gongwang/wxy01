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
import com.longersec.blj.domain.DynamicToken;
import com.longersec.blj.service.DynamicTokenService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;


/**
 * 
 */
@Controller
@RequestMapping(value = "/dynamicToken")
public class DynamicTokenController {

	@Autowired
	private DynamicTokenService dynamicTokenService;

	@RequestMapping("/listDynamicToken")
	@ResponseBody
	public JSONObject listDynamicToken(DynamicToken dynamicToken,HttpServletRequest request, HttpSession session) {
		int page_start = Integer.parseInt(request.getParameter("start"));
		int page_length = Integer.parseInt(request.getParameter("length"));
		ArrayList<Object> resultDynamicTokens = new ArrayList<Object>();
		ArrayList<DynamicToken> dynamicTokens = new ArrayList<DynamicToken>();
		long total = 0;
		resultDynamicTokens = (ArrayList<Object>)dynamicTokenService.findAll(dynamicToken, page_start, page_length);
		if(CollectionUtils.isNotEmpty(resultDynamicTokens)) {
			dynamicTokens = (ArrayList<DynamicToken>)resultDynamicTokens.get(0);
			total = ((ArrayList<Long>) resultDynamicTokens.get(1)).get(0);
		}
		JSONArray jsonArray = JSONArray.fromObject(dynamicTokens);
		JSONObject result = new JSONObject();
		result.accumulate("success", true);
		result.accumulate("recordsTotal", total);
		result.accumulate("recordsFiltered", total);
		result.accumulate("data", jsonArray);
		return result;
	}

	@RequestMapping("/addDynamicToken")
	@ResponseBody
	public JSONObject addDynamicToken(DynamicToken dynamicToken, HttpServletRequest request, HttpSession session) {
		JSONObject result = new JSONObject();
		result.accumulate("success", true);
		if(result.getBoolean("success")) {
			Boolean r = dynamicTokenService.addDynamicToken(dynamicToken);
			result.accumulate("success", r?true:false);
		}
		return result;
	}

	@RequestMapping("/editDynamicToken")
	@ResponseBody
	public JSONObject editDynamicToken(DynamicToken dynamicToken, HttpServletRequest request, HttpSession session) {
		JSONObject result = new JSONObject();
		result.accumulate("success", true);
		if(result.getBoolean("success")) {
			Boolean r = dynamicTokenService.editDynamicToken(dynamicToken);
			result.accumulate("success", r?true:false);
		}
		return result;
	}

	@RequestMapping("/delDynamicToken")
	@ResponseBody
	public JSONObject delDynamicToken(@RequestParam(value = "ids[]") Integer[] ids, HttpServletRequest request, HttpSession session) {
		JSONObject result = new JSONObject();
		List<Integer> _ids =  Arrays.asList(ids);
		result.accumulate("success", true);
		if(_ids.isEmpty()) {
			result.accumulate("success", false);
			result.accumulate("msg", "id不能为空");
		}
		if(result.getBoolean("success")) {
			Boolean r = dynamicTokenService.delDynamicToken(_ids);
			result.accumulate("success", r);
		}
		return result;
	}
}
