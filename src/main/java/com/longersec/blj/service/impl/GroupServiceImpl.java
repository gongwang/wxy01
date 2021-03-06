package com.longersec.blj.service.impl;

import java.util.ArrayList;
import java.util.List;
import com.longersec.blj.domain.DTO.DeviceGroup;
import com.longersec.blj.domain.DTO.UserGroup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.longersec.blj.dao.GroupDao;
import com.longersec.blj.domain.Group;
import com.longersec.blj.service.GroupService;


@Transactional
@Service
public class GroupServiceImpl implements GroupService{

	@Autowired
	private GroupDao GroupDao;

	@Override
	public boolean addGroup(Group group) {
		return this.GroupDao.addGroup(group);
	}
	
	@Override
	public boolean editGroup(Group group) {
		return this.GroupDao.editGroup(group);
	}

	@Override
	public boolean delGroup(List<Integer> ids) {
		return this.GroupDao.delGroup(ids);
	}

	@Override
	public List<Object> findAll(Group group, int page_start, int page_length, Integer id) {
		List<Object> groupList = GroupDao.findAll(group, page_start, page_length,id);
		return groupList;
	}

	
	@Override
	public List<UserGroup> selectNameAndId(Integer id,int page_start, int page_length) {
		return GroupDao.selectNameAndId(id,page_start,page_length);
	}

	@Override
	public List<UserGroup> selectNameAndIdTop() {
		return GroupDao.selectNameAndIdTop();
	}

	@Override
	public List<DeviceGroup> selectNameAndIdTop1() {
		return GroupDao.selectNameAndIdTop1();
	}

	@Override
	public List<DeviceGroup> selectNameAnddId(Integer id,int page_start, int page_length) {
		return GroupDao.selectNameAnddId(id, page_start,  page_length);
	}

	@Override
	public ArrayList<Group> listByType(Integer type,Integer id) {
		return GroupDao.listByType(type,id);
	}

	@Override
	public Group checkname(Group group) {
		return GroupDao.checkname(group);
	}

	@Override
	public boolean insertMore(Group group) {
		return GroupDao.insertMore(group);
	}

	@Override
	public Group selectByname(String s ,Integer type) {
		return GroupDao.selectByname(s,type);
	}

	@Override
	public boolean editGroupList(Group group) {
		return GroupDao.editGroupList(group);
	}

	@Override
	public String selectById(Integer groupid, int type) {
		return GroupDao.selectById(groupid, type);
	}

	@Override
	public boolean updateGroupCount(int count, int group_id) {
		return GroupDao.updateGroupCount(count,group_id);
	}
}
