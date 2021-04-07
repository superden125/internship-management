import moment from "moment"
import InternshipUnit from '../models/internshipUnit';
import Teacher from '../models/teacher';
import Student from '../models/student';
import Milestone from '../models/milestone';


module.exports.index = async (req, res) => {
  res.render('admin', {
    title: 'Internship Management System',
    roleName: 'Giáo vụ khoa',
    urlInfo: 'Quản lý đơn vị thực tập',
  });
  // const data = await InternshipUnit.find();
  // res.json(data);
}

module.exports.getAllInternshipUnit = async (req, res) => {
  // const internshipUnit = await InternshipUnit.find({});
  // res.json(internshipUnit);
  res.render('admin', {
    roleName: 'Giáo vụ khoa',
    urlInfo: 'Quản lý đơn vị thực tập',
  });
}

module.exports.getAllTeachers = async (req, res) => {
  // res.render('admin', {
  //   roleName: 'Giáo vụ khoa',
  //   urlInfo: 'Quản lý giáo viên'
  // });
  // const teachers = await Teacher.find();
  // res.json(teachers);
  res.render('admin', {
    roleName: 'Giáo vụ khoa',
    urlInfo: 'Quản lý giáo viên',
  });
}

module.exports.getAllStudents = async (req, res) => {
  // res.render('admin', {
  //   roleName: 'Giáo vụ khoa',
  //   urlInfo: 'Quản lý sinh viên',
  // });
  // const students = await Student.find();
  // res.json(students);
  res.render('admin', {
    roleName: 'Giáo vụ khoa',
    urlInfo: 'Quản lý sinh viên',
  });
}

module.exports.showAllApproveInternshipUnit = (req, res) => {
  res.render('admin/internship-approve-all', {
    roleName: 'Giáo vụ khoa',
    urlInfo: 'Xét duyệt điểm thực tập',
  });
}

module.exports.detailApproveInternshipUnit = (req, res) => {
  var id = req.params.id;
  res.render('admin/intership-approve-detail', {
    id,
    roleName: 'Giáo vụ khoa',
    urlInfo: 'Xét duyệt điểm thực tập / Chi tiết'
  });
}

module.exports.assignTeacher = (req, res) => {
  res.render('admin/assign-teacher', {
    roleName: 'Giáo vụ khoa',
    urlInfo: 'Phân công giáo viên thăm sinh viên',
  });
}

//Milestone
module.exports.milestoneGet = async (req,res)=>{
  let data = {
    roleName: 'Giáo vụ khoa',
    urlInfo: 'Thời gian thực tập',
  }
  const milestones = await Milestone.find().sort({endRegister: -1})
  let milestones1 = [];
  milestones.forEach((val)=>{
    const obj = {}
    obj._id = val._id
    obj.semester = val.semester
    obj.hk = val.hk
    obj.startIntern = moment(val.startIntern).format("DD-MM-YYYY")
    obj.endIntern = moment(val.endIntern).format("DD-MM-YYYY")
    obj.endRegister = moment(val.endRegister).format("DD-MM-YYYY")
    milestones1.push(obj)
  })
  data.milestones = milestones1
  res.render("admin/milestone", data)
}
module.exports.milestonePost = async (req,res)=>{
  try {
    const milestone = new Milestone(req.body)
    const result = await milestone.save()
    if(!result) return res.json({success: false})
    res.json({success: true, data: result})  
  } catch (error) {
    res.json({success: false})  
  }
  
}
module.exports.milestonePut = async (req,res)=>{
  const data = req.body;
  const milestone = await Milestone.findById(data._id);
  
  if(!milestone) return res.json({success: false})

  milestone.semester = data.semester
  milestone.hk = data.hk
  milestone.endRegister = data.endRegister
  milestone.startIntern = data.startIntern
  milestone.endIntern = data.endIntern

  const result = await milestone.save();
  if(!result) return res.json({success: false})
  return res.json({success: true, data: result})
  
}