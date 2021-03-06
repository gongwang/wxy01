package com.longersec.blj.web;

import com.longersec.blj.domain.Department;
import com.longersec.blj.domain.OperatorLog;
import com.longersec.blj.domain.User;
import com.longersec.blj.service.*;
import com.longersec.blj.utils.BljConstant;
import com.longersec.blj.utils.Operator_log;
import com.longersec.blj.utils.UpdateDepartmentCount;
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
import java.util.*;

@Controller
@RequestMapping(value = "/department")
public class DepartmentController {
	JSONObject result = null;

	@Autowired
	private UserService userService;

	@Autowired
	private GroupDeviceAccountService groupDeviceAccountService;

	@Autowired
	private UserGroupUserService userGroupUserService;

	@Autowired
	private GroupService groupService;

	@Autowired
	private DeviceService deviceService;

	@Autowired
	private OperatorLogService operatorLogService;

	@Autowired
	private DepartmentService departmentService;

	@Autowired
	private ApppubServerService apppubServerService;

	@RequestMapping("/findAll")
	@ResponseBody
	public JSONObject findAll() {
		return departmentService.getAllDepartmentsByParentId();
	}

	@RequestMapping("/findParentName")
	@ResponseBody
	public JSONObject findParentName(@RequestParam(value = "parent_id") int parent_id) {
		result = new JSONObject();
		Department department = departmentService.findParentName(parent_id);
		result.put("name","");
		if(department!=null)
			result.put("name",department.getParent_name());
		return result;
	}

	@RequestMapping("/listDepartment")
	@ResponseBody
	public JSONObject listDepartment(Department department,HttpServletRequest request) {
		ArrayList<Department> departmentTemp = new ArrayList<>();
		Integer thisId;
		//根据权限查询
		User p_user = (User) SecurityUtils.getSubject().getPrincipal();
		ArrayList<Department> resultDepartments = departmentService.findAll(department, p_user.getDepartment());
		List<Integer> selectTopId = departmentService.selectTopId(p_user.getDepartment());
		if(CollectionUtils.isNotEmpty(resultDepartments)) {
			//把根节点的父id赋值为0,不然前台没有数据
			for (Department department1:resultDepartments) {
				if (department1.getId().equals( p_user.getDepartment())) {
					department1.setParent_id(0);
				}
			}
		}
		//默认查询条件为空,不执行复杂的查询,提高效率
		boolean flag;
		flag = department.getSearchAll() != null && "".equals(department.getSearchAll()) || department.getName() != null && "".equals(department.getName()) ||
				department.getName() == null && department.getSearchAll() == null;
		if(flag) {
			departmentTemp.addAll(resultDepartments);
		} else {
			//遍历搜索出的结果
			for (Department value : resultDepartments) {
				thisId = value.getId();
				//查找上级和下级部门
				List<Department> subNodes = departmentService.findSubNodes(thisId);
				List<Department> selectShiroInfo = departmentService.findTopNodes(thisId);
				for (Department department1:selectShiroInfo) {
					if (selectTopId.contains(department1.getId())) {
						departmentTemp.add(department1);
					}
					if (department1.getId().equals( p_user.getDepartment())) {
						department1.setParent_id(0);
					}
				}
				departmentTemp.addAll(subNodes);
			}
		}
		//去重
		HashSet<Department> allDepartments = new HashSet<>(departmentTemp);
		//清空临时集合
		departmentTemp.clear();
		JSONArray jsonArray = JSONArray.fromObject(allDepartments);
		result = new JSONObject();
		result.put("data", jsonArray);
		return result;
	}

	@RequestMapping("/addDepartment")
	@ResponseBody
	public JSONObject addDepartment(@Validated Department department, BindingResult errorResult,
	                                @RequestParam(value = "parent_name") String parent_name,
	                                @RequestParam(value = "name") String name,
	                                @RequestParam(value = "parent_id") int parent_id,
	                                HttpServletRequest request, HttpSession session) {
		result = new JSONObject();
		//错误处理
		Map<String, Object> errorMap = new HashMap<>(16);
		Map<String, Object> resultMap = Validator.fieldValidate(errorResult);
		//判断上级是否存在
		int topDepartmentIfExists = departmentService.topDepartmentIfExists(parent_name);
		if (topDepartmentIfExists == 0) {
			errorMap.put("TopDeptNull","上级部门不存在");
		}
		//检查重名
		List<Department> subNodes = departmentService.findSubNodes(parent_id);
		for (Department department1: subNodes) {
			if (department1.getName().equals(name)) {
				errorMap.put("DuplicateName","部门名称重复");
			}
		}
		//判断
		if(resultMap != null || !errorMap.isEmpty()) {
			result.put("errorMsg", resultMap);
			result.put("errorMap", errorMap);
			result.put("success","error");
		}else {
			User user = (User) SecurityUtils.getSubject().getPrincipal();
			department.setCreate_id(user.getId());
			department.setCreate_time((int) System.currentTimeMillis());
			List<String> allParentName = departmentService.findAllParentName(parent_id);
			StringBuilder stringBuilder = new StringBuilder();
			for (String strings : allParentName) {
				stringBuilder.append(strings).append("/");
			}
			//操作日志
			OperatorLog operatorLog = Operator_log.log(request, session);
			operatorLog.setModule("部门管理");
			operatorLog.setDetails("增加部门"+"["+name+"],"+"上级部门为["+stringBuilder.substring(0,stringBuilder.length()>1?stringBuilder.length()-1:stringBuilder.length())+"]");
			operatorLog.setContent("添加");
			boolean addDepartment = departmentService.addDepartment(department);
			if (addDepartment) {
				operatorLog.setResult("成功");
				result.put("success","true");
			} else {
				operatorLog.setResult("失败");
				result.put("success","false");
			}
			operatorLogService.addOperatorLog(operatorLog);
		}
		//插入部门缓存表根据部门id
		departmentService.cacheDepartmentId();
		return result;
	}

	@RequestMapping("/editDepartment")
	@ResponseBody
	public JSONObject editDepartment(@Validated Department department, BindingResult errorResult,
	                                 @RequestParam(value = "parent_name") String parent_name,
	                                 @RequestParam(value = "name") String name,
	                                 @RequestParam(value = "id") Integer id,
	                                 @RequestParam(value = "parent_id") int parent_id,
	                                 HttpServletRequest request, HttpSession session) {
		result = new JSONObject();
		//错误处理
		Map<String, Object> errorMap = new HashMap<>(16);
		Map<String, Object> resultMap = Validator.fieldValidate(errorResult);
		//判断上级是否存在
		int topDepartmentIfExists = departmentService.topDepartmentIfExists(parent_name);
		if (topDepartmentIfExists == 0 && id != 1) {
			errorMap.put("TopDeptNull", "上级部门不存在");
		}
		//判断上级部门是否正确
		String idName = departmentService.findName(id);
		if (parent_name.equals(idName)) {
			errorMap.put("TopNameError", "上级部门名称不能为本次编辑部门");
		}
		//判断上级部门下级是否有相同的
		List<Department> department1 = departmentService.findSubNodes(parent_id);
		for (Department department2 : department1) {
			boolean flag = (department2.getName().equals(name) && !department2.getId().equals(id)) || parent_name.equals(name);
			if (flag) {
				errorMap.put("DuplicateName", "部门名称重复");
			}
		}
		if(resultMap != null || !errorMap.isEmpty()) {
			result.put("errorMsg", resultMap);
			result.put("errorMap", errorMap);
			result.put("success","error");
		}else {
			//查询父id和此部门的count
			Department department2 = departmentService.selectParentId(department.getId());
			//获取上级部门
			String name1 = departmentService.findName(parent_id);
			List<String> allParentName = departmentService.findAllParentName(parent_id);
			StringBuilder stringBuilder = new StringBuilder();
			for (String strings : allParentName) {
				stringBuilder.append(strings).append("/");
			}
			//操作日志
			OperatorLog operatorLog = Operator_log.log(request, session);
			operatorLog.setModule("部门管理");
			operatorLog.setDetails("编辑部门["+department2.getName()+"为"+name+"],"+"上级部门为["+stringBuilder.substring(0,stringBuilder.length()>1?stringBuilder.length()-1:stringBuilder.length())+"]");
			operatorLog.setContent("编辑");
			//编辑部门
			boolean editDepartment = departmentService.editDepartment(department);
			if (editDepartment) {
				//上级部门改变进行更新数量
				if (name1!=null&&!name1.equals(parent_name)) {
					//原来上级部门减少用户数量
					UpdateDepartmentCount.userUpdateDepartmentCount(departmentService, department2.getParent_id(), -department2.getCount());
					//编辑后的上级部门增加用户数量
					UpdateDepartmentCount.userUpdateDepartmentCount(departmentService, department.getParent_id(), department2.getCount());
					//原来上级部门减少设备数量
					UpdateDepartmentCount.deviceUpdateDepartmentCount(departmentService, department2.getParent_id(), -department2.getDevice_count());
					//编辑后的上级部门增加设备数量
					UpdateDepartmentCount.deviceUpdateDepartmentCount(departmentService, department.getParent_id(), department2.getDevice_count());
				}
				operatorLog.setResult("成功");
				result.put("success", true);
			} else {
				operatorLog.setResult("失败");
				result.put("success", false);
			}
			operatorLogService.addOperatorLog(operatorLog);
		}
		//插入部门缓存表根据部门id
		departmentService.cacheDepartmentId();
		return result;
	}

	@RequestMapping("/delDepartment")
	@ResponseBody
	public JSONObject delDepartment(@RequestParam(value = "ids[]") Integer[] ids, HttpServletRequest request, HttpSession session) {
		result = new JSONObject();
		List<Integer> _ids =  Arrays.asList(ids);
		//操作日志
		OperatorLog operatorLog = Operator_log.log(request, session);
		operatorLog.setModule("部门管理");
		operatorLog.setContent("删除");
		if(_ids.isEmpty()) {
			result.put("success", false);
			result.put("msg", "id不能为空");
			operatorLog.setResult("失败");
		} else {
			for (Integer id:_ids) {
				//不能删除id是北京久安世纪的
				if (id == 1) {
					result.put("success", false);
					operatorLog.setResult("失败");
					operatorLogService.addOperatorLog(operatorLog);
					return result;
				} else {
					result.put("success", true);
					operatorLog.setResult("成功");
				}
			}
			List<Object> objectList = UpdateDepartmentCount.deleteUserUpdateDepartmentCount(departmentService, userService, deviceService, groupService, userGroupUserService, groupDeviceAccountService, apppubServerService,_ids);
			StringBuilder stringBuilder = new StringBuilder();
			for (Object strings : objectList) {
				stringBuilder.append(strings).append(",");
			}
			operatorLog.setDetails("删除部门["+stringBuilder.substring(0,stringBuilder.length()>0?stringBuilder.length()-1:stringBuilder.length())+"]");
		}
		operatorLogService.addOperatorLog(operatorLog);
		//插入部门缓存表根据部门id
		departmentService.cacheDepartmentId();
		return result;
	}

	@RequestMapping("/checkDepartmentName")
	@ResponseBody
	public JSONObject checkDepartmentName(@RequestParam(value = "id",required = false) Integer id,
	                                      @RequestParam(value = "name") String name,
	                                      @RequestParam(value = "parent_id") int parent_id,
									      @RequestParam(value = "parent_name") String parent_name ){
		int idNull = 0;
		if (id == null) {
			id = idNull;
		}
		result = new JSONObject();
		//错误处理
		Map<String, Object> errorMap = new HashMap<>(16);
		//判断上级是否存在
		int topDepartmentIfExists = departmentService.topDepartmentIfExists(parent_name);
		if (topDepartmentIfExists == 0 && parent_id != 1) {
			errorMap.put("TopDeptNull","上级部门不存在");
		}
		//判断上级部门是否正确
		String idName = departmentService.findName(id);
		if (parent_name.equals(idName)) {
			errorMap.put("TopNameError", "上级部门名称不能为本次编辑部门");
		}
		//判断上级部门下级是否有相同的
		List<Department> department = departmentService.findSubNodes(parent_id);
		if (id == 0){
			for (Department department1:department) {
				boolean flag = (department1.getName().equals(name));
				if (flag) {
					errorMap.put("DuplicateName", "部门名称重复");
				}
			}
		} else {
			for (Department department1:department) {
				boolean flag = (department1.getName().equals(name) && !department1.getId().equals(id));
				if (flag) {
					errorMap.put("DuplicateName", "部门名称重复");
				}
			}
		}
		result.put("info",errorMap);
		return result;
	}

	/** 导入检查 **/
	public static Map<String, Object> checkExport(DepartmentService departmentService, String name, String desc, String parent_name){
		Map<String, Object> errorMap = new HashMap<>(16);
		//判断上级是否存在
		if (!"".equals(parent_name)) {
			int topDepartmentIfExists = departmentService.topDepartmentIfExists(parent_name);
			if (topDepartmentIfExists == 0) {
				errorMap.put("success", false);
				errorMap.put("info",parent_name+":上级部门不存在");
				return errorMap;
			}
		}
		//上级部门名称不能为本次编辑部门
		if (parent_name.equals(name)) {
			errorMap.put("info",name+":上级部门名称和部门名称重复");
			errorMap.put("success", false);
			return errorMap;
		}
		int num = 128;
		if (desc.length() > num) {
			errorMap.put("info",desc+":描述超长");
			errorMap.put("success", false);
			return errorMap;
		}
		errorMap.put("success", true);
		return errorMap;
	}

	/** 导入检查 **/
	public static Map<String, Object> checkDepartmentExport(DepartmentService departmentService, String name ,String parent_id){
		Map<String, Object> errorMap = new HashMap<>(16);
		List<String> list = new ArrayList<>(10);
		//判断部门是否存在
		List<Integer> integers = departmentService.selectIdByname(name);
		if (integers == null || integers.size() == 0){
			errorMap.put("info",name+":部门不存在");
			errorMap.put("success", false);
			return errorMap;
		}
		if ("".equals(parent_id) && integers.size()>1){
			errorMap.put("info",name+":部门名称重复,请按照格式添加id");
			errorMap.put("success", false);
			return errorMap;
		}
		errorMap.put("success", true);
		return errorMap;
	}

	/** 更新部门数量**/
	@RequestMapping("/update")
	@ResponseBody
	public JSONObject checkDepartmentName(){
		result = new JSONObject();
		//自动更新部门用户和设备数量
		UpdateDepartmentCount.AutoUpdateDepartmentDeviceCounts(departmentService);
		UpdateDepartmentCount.AutoUpdateDepartmentUserCounts(departmentService);
		result.put("success",true);
		return result;
	}

}
