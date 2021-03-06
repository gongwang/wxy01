package com.longersec.blj.web;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.apache.commons.collections.CollectionUtils;
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
import com.longersec.blj.domain.ConfigDisksession;
import com.longersec.blj.service.ConfigDisksessionService;
import com.longersec.blj.service.ConfigPasswordEncryptKeyService;
import com.longersec.blj.service.ConfigService;
import com.longersec.blj.utils.Sm4Utils;
import com.longersec.blj.utils.SystemCommandUtil;
import com.longersec.blj.utils.SystemUsageUtil;
import com.longersec.blj.utils.Validator;

import cn.hutool.core.io.file.FileReader;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;


/**
 * 
 */
@Controller
@RequestMapping(value = "/configDisksession")
public class ConfigDisksessionController {

	@Autowired
	private ConfigDisksessionService configDisksessionService;
	@Autowired
	private ConfigService configService;
	
	@Autowired
	private ConfigPasswordEncryptKeyService configPasswordEncryptKeyService;

	@RequestMapping("/listConfigDisksession")
	@ResponseBody
	public JSONObject listConfigDisksession(ConfigDisksession configDisksession,HttpServletRequest request, HttpSession session) {
		int page_start = Integer.parseInt(request.getParameter("start"));
		int page_length = Integer.parseInt(request.getParameter("length"));
		ArrayList<Object> resultConfigDisksessions = new ArrayList<Object>();
		ArrayList<ConfigDisksession> configDisksessions = new ArrayList<ConfigDisksession>();
		long total = 0;
		resultConfigDisksessions = (ArrayList<Object>)configDisksessionService.findAll(configDisksession, page_start, page_length);
		if(CollectionUtils.isNotEmpty(resultConfigDisksessions)) {
			configDisksessions = (ArrayList<ConfigDisksession>)resultConfigDisksessions.get(0);
			total = ((ArrayList<Long>) resultConfigDisksessions.get(1)).get(0);
		}
		JSONArray jsonArray = JSONArray.fromObject(configDisksessions);
		JSONObject result = new JSONObject();
		result.accumulate("success", true);
		result.accumulate("recordsTotal", total);
		result.accumulate("recordsFiltered", total);
		result.accumulate("data", jsonArray);
		return result;
	}

	@RequestMapping("/addConfigDisksession")
	@ResponseBody
	public JSONObject addConfigDisksession(@Validated ConfigDisksession configDisksession,BindingResult errorResult, HttpServletRequest request, HttpSession session) {
		JSONObject result = new JSONObject();
		Map<String, Object> resultMap = Validator.fieldValidate(errorResult);
		if(resultMap!=null) {
			result.put("msg", resultMap);
			result.put("success",false);
			return result;
		}
		result.accumulate("success", true);
		if(result.getBoolean("success")) {
			Boolean r = configDisksessionService.addConfigDisksession(configDisksession);
			result.accumulate("success", r?true:false);
		}
		return result;
	}

	@RequestMapping("/editConfigDisksession")
	@ResponseBody
	public JSONObject editConfigDisksession(@Validated ConfigDisksession configDisksession,@RequestParam("type")Integer type,BindingResult errorResult, HttpServletRequest request, HttpSession session) {
		JSONObject result = new JSONObject();
		Map<String, Object> resultMap = Validator.fieldValidate(errorResult);
		if(resultMap!=null) {
			result.put("msg", resultMap);
			result.put("success",false);
			return result;
		}
		result.accumulate("success", true);
		if (type==1){
			if(result.getBoolean("success")) {
				Boolean r = configDisksessionService.editConfigDisksession(configDisksession);
				result.put("success", r?true:false);
			}
		}else {
			if(result.getBoolean("success")) {
				if(configDisksession.getSession_backup_password().equals("xxxxxx")){
					configDisksession.setSession_backup_password(null);
				}
				if(configDisksession.getSession_backup_password()!=null) {
					configDisksession.setSession_backup_password(Sm4Utils.encryptEcb(configPasswordEncryptKeyService.getKey(),configDisksession.getSession_backup_password()));
				}

				Boolean r = configDisksessionService.editConfigDisksession(configDisksession);
				String[] _timeStrings = configDisksession.getSession_backup_time().split(":");
				String fileString = (configDisksession.getSession_backup_enable()==1?"":"#")+Integer.valueOf(_timeStrings[1])+" "+Integer.valueOf(_timeStrings[0])+" * * * "+configService.getByName("lsbljBackupRecord").getValue()+" ";

				File backupfile = new File(configService.getByName("lsbljCronFile").getValue()); //

				try {
					if (!backupfile.getParentFile().exists())
						backupfile.getParentFile().mkdirs();
					if(!backupfile.exists())
						backupfile.createNewFile(); // 创建新文件
					if(backupfile.exists()) {
						FileInputStream inputStream = new FileInputStream(configService.getByName("lsbljCronFile").getValue());
						BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
						String str = null;
						String resultArray = "";
						Boolean found = false;
						while((str = bufferedReader.readLine()) != null)
						{
							if(str.indexOf(configService.getByName("lsbljBackupRecord").getValue())>0) {
								str = fileString+"\n";
								found = true;
							}
							resultArray += str;
						}
						if(!found) {
							resultArray += fileString + "\n";
						}
						//close
						inputStream.close();
						bufferedReader.close();
						BufferedWriter out;
						out = new BufferedWriter(new FileWriter(backupfile));
						out.write(resultArray+"\n"); //
						out.flush(); // 把缓存区内容压入文件
						out.close(); // 最后记得关闭文件
						SystemCommandUtil.execCmd("/usr/bin/crontab "+configService.getByName("lsbljCronFile").getValue());
					}
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				result.put("success", r?true:false);
			}
		}
		return result;
	}

	@RequestMapping("/delConfigDisksession")
	@ResponseBody
	public JSONObject delConfigDisksession(@RequestParam(value = "ids[]") Integer[] ids, HttpServletRequest request, HttpSession session) {
		JSONObject result = new JSONObject();
		List<Integer> _ids =  Arrays.asList(ids);
		result.accumulate("success", true);
		if(_ids.isEmpty()) {
			result.accumulate("success", false);
			result.accumulate("msg", "id不能为空");
		}
		if(result.getBoolean("success")) {
			Boolean r = configDisksessionService.delConfigDisksession(_ids);
			result.accumulate("success", r);
		}
		return result;
	}
}
