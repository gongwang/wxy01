package com.longersec.blj.dao;

import com.longersec.blj.domain.DTO.DepartDTO;
import com.longersec.blj.domain.Department;
import org.apache.ibatis.annotations.Param;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public interface DepartmentDao {

	boolean editDepartment(Department department);

	boolean addDepartment(Department department);

	boolean delDepartment(List<Integer> ids);

	List<Department> selectAll();

	List<Object> findAll(@Param("department")Department department, @Param("id")int id, @Param("page_start")int page_start, @Param("page_length")int page_length);

    ArrayList<DepartDTO> findIdName(int depart_id);

	/** 查询上级部门名称**/
	Department findParentName(@Param("parent_id")int parent_id);

	/** 用户新建编辑删除,部门编辑时相关部门用户数量加一**/
	boolean updateDepartmentCounts(@Param("department") int department,  @Param("num") int num);

	/** 设备新新建编辑删除,部门编辑时相关部门用户数量加一**/
	boolean updateDepartmentDeviceCount(@Param("department") int department,  @Param("num") int num);

	/**用户新建时查询相关部门用户数量需要加一的id **/
	Department selectParentId(@Param("parent_id") int parent_id);

	/**上级部门是否存在 **/
	int TopDepartmentIfExists(@Param("parent_name") String parent_name);

	/** 判断是否有无用的部门 **/
	int selectUselessDepartments();

	/** 删除无用的部门 **/
	boolean deleteUselessDepartments();

	/**查询所有用户 **/
	List<Integer> selectUserId();

	/** 查询用户所在部门**/
	Integer selectUserDepartment(@Param("id")int id);

	/** 更新部门用户数量**/
	boolean updateDepartmentUserCounts(List<Integer> ids);

	/**查询所有设备 **/
	List<Integer> selectDeviceId();

	/** 查询设备所在部门**/
	Integer selectDeviceDepartment(@Param("id")int id);

	/** 更新部门设备数量**/
	boolean updateDepartmentDeviceCounts(List<Integer> ids);

	int selectByParentId(Integer item);

    List<Integer> selectById(int depart_id);

	ArrayList<DepartDTO> findIdParent(int depart_id);

	String findName(int id);

	/** 查询部门所有上级部门名称**/
	List<String> findAllParentName(@Param("id") int id);

	/**查询登录角色所拥有的部门id **/
	List<Integer> selectTopId(@Param("id") int id);

    boolean insertMore(Department department);

	Department selectByname(@Param("name")String name);

	List<Department> findTopNodes(@Param("id") int id);

	List<Department> findSubNodes(@Param("id") int id);

	Department getById(@Param("id")Integer id);

	List<Integer> selectIdByname(@Param("name")String name);
}
