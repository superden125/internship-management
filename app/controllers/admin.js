import bcrypt, { hashSync } from "bcryptjs";
import moment from "moment"
import InternshipUnit from '../models/internshipUnit';
import mongoose, { model } from 'mongoose';
import Teacher from '../models/teacher';
import Student from '../models/student';
import User from '../models/user';
import Milestone from '../models/milestone';
import InternshipInfo from '../models/internshipInfo';
import {tinh} from "../lib/tinh";
import * as password from "../lib/password";
import Major from '../models/major';


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

  let data = {
    roleName: 'Giáo vụ khoa',
    urlInfo: 'Đơn vị thực tập',
    error: {
      err: false
    },
  }
  const internshipunits = await InternshipUnit.find({});
  // internshipunits.cityName = tinh.find((tinh) => tinh.id == internshipunits.city).name;
    internshipunits.forEach(internshipunit => {
    internshipunit.cityName1 = tinh.find((tinh) => tinh.id == internshipunit.city).name;
  });
  //data.tinh = tinh.sort((a, b) => a.name - b.name);
  data.internshipunits = internshipunits;
  res.render("admin/show-internship-unit",data);
}

module.exports.getAllTeachers = async (req, res) => {

   const teachers = await User.aggregate([
     {
        $match:{
          role:'teacher'
        },
     },
     {
      $lookup: {
        from: 'majors',
        localField: 'idMajor',
        foreignField: '_id',
        as: 'major'
      }
     },
     {
        $unwind: '$major'
      },
    ])
    .exec(function (err, teachers) {
      return res.render("admin/show-teacher", {
       teachers: teachers,
       roleName: 'Giáo vụ khoa',
      urlInfo: 'Giáo viên',
      });
   });
}

module.exports.getAllStudents = async (req, res) => {

  const students = await User.aggregate([
    {
       $match:{
         role:'student'
       },
    },
    {
     $lookup: {
       from: 'majors',
       localField: 'idMajor',
       foreignField: '_id',
       as: 'major'
     }
    },
    {
       $unwind: '$major'
     },
   ])
   .exec(function (err, students) {
     return res.render("admin/show-student", {
      students: students,
      roleName: 'Giáo vụ khoa',
     urlInfo: 'Sinh viên',
     });
  });
}

module.exports.loadAproveInternshipUnitPage =  async (req, res) => {
  res.render('admin/internship-approve-all', {
    roleName: 'Giáo vụ khoa',
    urlInfo: 'Xét duyệt điểm thực tập',
  });

  // res.render('admin', {
  //   roleName: 'Giáo vụ khoa',
  //   urlInfo: 'Quản lý sinh viên',
  // });
  // const students = await Student.find();
  // res.json(students);
  await User.find({
      role: 'student'
    })
    .exec((err, students) => {
      return res.json({
        data: students
      });
    });
}

module.exports.getAproveInternshipUnitInfo = async (req, res) => {
  var page = 1;
  var sortType = {
    column: 'timestamp',
    type: -1,
  };

  var paginationObj = {
    page: 1,
    limit: 10,
    skip: 0
  };

  var schoolYear = req.query.schoolYear || '';
  var semester = req.query.semester || '';

  var milestone = null;

  if (req.query.hasOwnProperty('_sort')) {
    Object.assign(sortType, {
      column: req.query.column,
      type: parseInt(req.query.type),
    });
  }

  if (req.query.hasOwnProperty('page') || req.query.hasOwnProperty('limit')) {
    page = parseInt(req.query.page) || paginationObj.page;
    var reqLimit = parseInt(req.query.limit) || paginationObj.limit;

    Object.assign(paginationObj, {
      skip: (page - 1) * reqLimit,
      limit: reqLimit
    });
  }

  var limitField = {
    $limit: paginationObj.limit
  };

  var skipField = {
    $skip: paginationObj.skip
  }

  var sortField = {
    $sort: {}
  };

  var sort = sortType.column;
  sortField['$sort'][sort] = sortType.type;

  const query = [
    {
      $lookup: {
        from: 'users',
        localField: 'idSv',
        foreignField: '_id',
        as: 'student'
      }
    },
    {
      $unwind: '$student'
    },
    {
      $lookup: {
        from: 'internshipunits',
        localField: 'idIntern',
        foreignField: '_id',
        as: 'internshipUnit'
      }
    },
    {
      $unwind: '$internshipUnit'
    },
    {
      $facet: {
        metadata: [{
          $group: {
            _id: null,
            total: {
              $sum: 1
            }
          }
        }],
        data: [
          sortField,
          skipField,
          limitField,
        ]
      }
    }, {
      $project: {
        data: 1,
        total: {
          $arrayElemAt: ['$metadata.total', 0]
        }
      }
    }
  ];

  if (req.query.hasOwnProperty('schoolYear')) {
    var idArr = [];
    var milestones = await Milestone.find({ schoolYear: req.query.schoolYear });
    
    milestones.forEach(item => {
      idArr.push(mongoose.Types.ObjectId(item._id));
    });

    var matchQuery = {
      $match: {
        idMilestone: {
          $in: idArr
        }
      }
    }
    
    query.splice(0, 0, matchQuery);
  }

  if (req.query.hasOwnProperty('semester')) {
    var idArr = [];
    var milestones = await Milestone.find({ semester: parseInt(req.query.semester) });
    
    milestones.forEach(item => {
      idArr.push(mongoose.Types.ObjectId(item._id));
    });

    var matchQuery = {
      $match: {
        idMilestone: {
          $in: idArr
        }
      }
    }
    
    query.splice(0, 0, matchQuery);
  }

  milestone = await Milestone.find();

  await InternshipInfo
    .aggregate(query)
    .exec(function (err, objData) {
      var internInfos = objData[0].data;
      var totalDocs = objData[0].total;
      // return res.json(internInfos[0].data);
      internInfos.forEach(obj => {
        obj.statusString = obj.status == 0 ? 'Chờ xét duyệt' : 'Đã xét duyệt';
        obj.styleClass = obj.status == 0 ? 'font-weight-bold' : '';
        obj.city = tinh.find((tinh) => tinh.id == obj.internshipUnit.city).name;
      });

      return res.render('admin/internship-approve-all', {
        roleName: 'Giáo vụ khoa',
        urlInfo: 'Xét duyệt điểm thực tập',
        milestone,
        internInfos,
        type: -(sortType.type),
        totalDocs,
        current: page,
        totalPages: Math.ceil(totalDocs / paginationObj.limit),
        indexCount: paginationObj.skip,
        schoolYear
      });
    });
}

module.exports.detailApproveInternshipUnit = async (req, res) => {
  if (req.method == 'GET') {
    var matchField = {
      $match: {}
    };

    matchField['$match']['shortId'] = req.params.id;

    await InternshipInfo
      .aggregate([
        matchField,
        {
          $lookup: {
            from: 'users',
            localField: 'idSv',
            foreignField: '_id',
            as: 'student'
          }
        },
        {
          $unwind: '$student'
        },
        {
          $lookup: {
            from: 'majors',
            localField: 'student.idMajor',
            foreignField: '_id',
            as: 'major'
          }
        },
        {
          $lookup: {
            from: 'internshipunits',
            localField: 'idIntern',
            foreignField: '_id',
            as: 'internshipUnit'
          }
        }
      ])
      .exec(function (err, internInfos) {
        var internInfo = internInfos[0];
        internInfo.haveRoomString = !internInfo.haveRoom ? 'Không' : 'Có';
        internInfo.havePCString = !internInfo.havePC ? 'Không' : 'Có';
        internInfo.city = tinh.find((tinh) => tinh.id == internInfo.internshipUnit[0].city).name;

        if (internInfo.status == 0) {
          internInfo.statusString = 'Chờ xét duyệt';
          internInfo.disabledApproveButton = '';
          internInfo.disabledCancelButton = 'disabled';
        } else {
          internInfo.statusString = 'Đã xét duyệt';
          internInfo.disabledApproveButton = 'disabled';
          internInfo.disabledCancelButton = '';
        }

        res.render('admin/intership-approve-detail', {
          roleName: 'Giáo vụ khoa',
          urlInfo: 'Xét duyệt điểm thực tập / Chi tiết',
          internInfo
        });
      });
  } else if (req.method == 'POST') {
    var idInternInfo = req.body.idInternInfo;
    var refuseType = req.body.refuse;

    if (!refuseType) {
      InternshipInfo
        .findOneAndUpdate({
          shortId: idInternInfo
        }, {
          $set: {
            status: 1
          }
        }, {
          new: true
        })
        .exec(function (err, item) {
          InternshipUnit
            .findOneAndUpdate({
              _id: item.idIntern
            }, {
              $inc: {
                currentSv: 1
              }
            }, {
              new: true
            })
            .exec(function (err, item1) {
              res.redirect('/admin/internship/approve');
            })
        });
    } else {
      InternshipInfo
        .findOneAndUpdate({
          shortId: idInternInfo
        }, {
          $set: {
            status: 0
          }
        }, {
          new: true
        })
        .exec(function (err, item) {
          InternshipUnit
            .findOneAndUpdate({
              _id: item.idIntern
            }, {
              $inc: {
                currentSv: -1
              }
            }, {
              new: true
            })
            .exec(function (err, item1) {
              res.redirect('/admin/internship/approve');
            })
        });
    }
  }
}

module.exports.loadAssignTeacherPage = (req, res) => {
  res.render('admin/assign-teacher', {
    roleName: 'Giáo vụ khoa',
    urlInfo: 'Phân công giáo viên thăm sinh viên',
  });
}

module.exports.assignTeacher = async (req, res) => {
  if (req.method == 'GET') {
    const query = [{
        $lookup: {
          from: 'internshipinfos',
          localField: '_id',
          foreignField: 'idIntern',
          as: 'internInfo'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'internInfo.idGv',
          foreignField: '_id',
          as: 'teacher'
        }
      },
      {
        $unwind: {
          path: '$teacher',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          city: 1,
          currentSv: 1,
          teacherName: '$teacher.name'
        }
      }
    ];

    await InternshipUnit
      .aggregate(query)
      .exec(function (err, internshipUnits) {
        internshipUnits.forEach(internUnit => {
          internUnit.cityName = tinh.find((tinh) => tinh.id == internUnit.city).name;
        });

        return res.json({
          data: internshipUnits
        });
      });
  } else if (req.method == 'PUT') {
    if (req.body.type == 'each') {
      var teacherId = (req.body.teacherId != 'null') ? req.body.teacherId : null;

      InternshipInfo
        .findOneAndUpdate({
          idIntern: req.body.internUnitId
        }, {
          $set: {
            idGv: teacherId
          }
        }, {
          new: true
        })
        .exec(function (err, internInfo) {
          res.json({
            success: true,
            data: internInfo
          });
        });
    }

  }
}

module.exports.getStudentsOfInternUnit = async (req, res) => {
  var query = [{
      $match: {
        _id: mongoose.Types.ObjectId(req.params.id)
      }
    },
    {
      $lookup: {
        from: 'internshipinfos',
        localField: '_id',
        foreignField: 'idIntern',
        as: 'internInfos'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'internInfos.idSv',
        foreignField: '_id',
        as: 'student'
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        city: 1,
        studentList: {
          $map: {
            input: '$student',
            as: 'student',
            in: {
              _id: '$$student._id',
              ms: '$$student.ms',
              name: '$$student.name',
              email: '$$student.email',
            }
          }
        }
      }
    }
  ]

  await InternshipUnit
    .aggregate(query)
    .exec((err, students) => {
      if (err) {
        res.json({
          err: true
        });
      } else {
        res.json({
          err: false,
          data: students
        });
      }
    });
}

//Milestone
module.exports.milestoneGet = async (req, res) => {
  let data = {
    roleName: 'Giáo vụ khoa',
    urlInfo: 'Thời gian thực tập',
  }
  const milestones = await Milestone.find().sort({
    endRegister: -1
  })
  let milestones1 = []
  let semesters = []
  milestones.forEach((val) => {
    const obj = {}
    obj._id = val._id
    obj.schoolYear = val.schoolYear
    obj.semester = val.semester
    obj.startIntern = moment(val.startIntern).format("DD-MM-YYYY")
    obj.endIntern = moment(val.endIntern).format("DD-MM-YYYY")
    obj.endRegister = moment(val.endRegister).format("DD-MM-YYYY")
    obj.endCore = moment(val.endCore).format("DD-MM-YYYY")
    obj.endRegister2 = moment(val.endRegister).format("MM-DD-YYYY")
    milestones1.push(obj)
    semesters.push(val.semester)
  })
  data.milestones = milestones1
  data.semesters = semesters.filter((val,i,a)=>a.indexOf(val)===i)
  res.render("admin/milestone", data)
}

module.exports.milestoneGets = async (req,res)=>{
  const {semester, schoolYear} = req.query  
  const milestones = await Milestone.find({schoolYear, semester: parseInt(semester)}).sort({
    endRegister: -1
  })
  
  if(milestones.length == 0) return res.json({success: false, msg: "Not found milestone"})
  let milestones1 = [];
  milestones.forEach((val) => {
    const obj = {}
    obj._id = val._id
    obj.schoolYear = val.schoolYear
    obj.semester = val.semester
    obj.startIntern = moment(val.startIntern).format("DD-MM-YYYY")
    obj.endIntern = moment(val.endIntern).format("DD-MM-YYYY")
    obj.endRegister = moment(val.endRegister).format("DD-MM-YYYY")
    obj.endCore = moment(val.endCore).format("DD-MM-YYYY")
    obj.endRegister2 = moment(val.endRegister).format("MM-DD-YYYY")
    milestones1.push(obj)
  })
  
  res.json({success:true, data: {milestones: milestones1}})
}

module.exports.milestonePost = async (req, res) => {
  try {
    console.log(req.body)
    const existMilestone = await Milestone.findOne({semester: req.body.semester, schoolYear: req.body.schoolYear})
    if(existMilestone) return res.json({success: false, msg: "Thời gian thực tập đã tồn tại"})
    const milestone = new Milestone(req.body)
    const result = await milestone.save()
    if (!result) return res.json({
      success: false
    })
    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    res.json({
      success: false
    })
  }
}

module.exports.milestonePut = async (req, res) => {
  const data = req.body;

  const existMilestone = await Milestone.findOne({semester: data.semester, schoolYear: data.schoolYear})
  
  if(existMilestone && data._id != existMilestone._id) return res.json({success: false, msg: "Thời gian thực tập đã tồn tại"})
  
  const milestone = await Milestone.findById(data._id);

  if (!milestone) return res.json({
    success: false
  })

  milestone.semester = data.semester
  milestone.schoolYear = data.schoolYear
  milestone.endRegister = data.endRegister
  milestone.startIntern = data.startIntern
  milestone.endIntern = data.endIntern
  milestone.endCore = data.endCore

  const result = await milestone.save()
  if(!result) return res.json({success: false})
  return res.json({success: true, data: result})
  
}

//Internship Unit
module.exports.addInternshipUnit = async (req, res) => {

  let data = {
    roleName: 'Giáo vụ khoa',
    urlInfo: 'Đơn vị thực tập / Thêm mới',
    error: {
      err: false
    },
  }
  const internshipunits = await InternshipUnit.find({})
  data.internshipunits = internshipunits
  data.tinh = tinh.sort((a, b) => a.name - b.name);
  res.render("admin/add_internship-unit",data)
}

//create and save new internship-unit
exports.createInternshipUnit = (req, res) => {
  if(!req.body){
    res.status(400).send({message: "Content can not be emtpy!"});
    return;
  }
  
  //new internship-unit
  const internshipunit = new InternshipUnit({
    name: req.body.name,
    address:  req.body.address,
    email: req.body.email,
    city: req.body.city,
    phone: req.body.phone,
    website: req.body.website,
    mentor: {name: req.body.mentorName,
     phone: req.body.mentorPhone,
     email: req.body.mentorEmail},
    workEnv: req.body.workEnv,
    workContent: req.body.workContent,
    reqTime: req.body.reqTime,
    reqInfo: req.body.reqInfo,
    maxSv: req.body.maxSv,
    currentSv: req.body.currentSv,
    benefit: req.body.benefit,
    note: req.body.note,
    introBy: req.body.introBy
  }) 

  // save intership-unit in the database
  internshipunit
    .save(internshipunit)
    .then(data => {
      res.redirect('/admin/manage/internship-unit');
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "some error occurred while creating a create operation"
      });
    });
}

export async function getUpdateInternshipUnit(req, res){
  // const internshipUnit = await InternshipUnit.find({});
  //  res.json(internshipUnit);

  // return res.json(req.body);
    
  let data = {
    roleName: 'Giáo vụ khoa',
    urlInfo: 'Đơn vị thực tập / Thêm mới',  
    error: {
      err: false
    },
  }
  const internshipunits = await InternshipUnit.findOne({_id:req.params.id});
  //internshipunits.cityName = tinh.find((tinh) => tinh.id == internshipunits.city).name;
  data.tinh = tinh.sort((a, b) => a.name - b.name);
  data.internshipunits = internshipunits;
  res.render("admin/update_internship-unit",data)
}

//Update a new idetified internship-unit by internship-unit id
exports.updateInternshipUnit = (req, res) =>{
  if(!req.body){
    return res
      .status(400)
      .send({message: "Data to update cannot be empty"})
  }

  const id = req.params.id;

  // return res.json(req.body)
  InternshipUnit.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
    .then(data => {
      if(!data){
        res.status(404).send({message: `Cannot Update internship-unit with ${id}. Maybe internship-unit not found!`})
      }else{
        res.redirect('/admin/manage/internship-unit')
      }
    })
    .catch(err => {
        res.status(500).send({ message: "Error Update internship-unit information"})
    })
}

// Delete a user with specified user id in the request
exports.deleteInternshipUnit = (req, res)=>{
  const id = req.params.id;

  InternshipUnit.findByIdAndDelete(id)
      .then(data => {
          if(!data){
              res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
          }else{
              res.send({
                  message : "User was deleted successfully!"
              })
          }
      })
      .catch(err =>{
          res.status(500).send({
              message: "Could not delete User with id=" + id
          });
      });
}

exports.addTeacher = async (req, res) => {
  let data = {
    roleName: 'Giáo vụ khoa',
    urlInfo: 'Giáo viên / Thêm mới',
    error: {
      err: false
    },
  }
  const teachers = await User.find({})
  const majors = await Major.find({})
  data.majors = majors
  data.teachers = teachers
 
  res.render("admin/add_teacher",data)
  
}

exports.createTeacher = async (req, res) => {
  if(!req.body){
    res.status(400).send({message: "Content can not be emtpy!"});
    return;
  }
  
  var pwd = password.genRandomString(9);
  
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(pwd, salt);

  //new teacher
  const teacher = new User({
    ms: req.body.ms,
    name: req.body.name,
    idMajor: mongoose.Types.ObjectId(req.body.major),
    email: req.body.email,
    password: hashPass,
    phone: req.body.phone,
    role: "teacher"
  }) 

  // save intership-unit in the database
  teacher
    .save(teacher)
    .then(data => {
      res.redirect('/admin/manage/teachers');
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "some error occurred while creating a create operation"
      });
    });
}

export async function getUpdateTeacher(req, res){
  // const internshipUnit = await InternshipUnit.find({});
  //  res.json(internshipUnit);

  // return res.json(req.body);
    
  let data = {
    roleName: 'Giáo vụ khoa',
    urlInfo: 'Giáo viên / Cập nhật',  
    error: {
      err: false
    },
  }
  const teacher = await User.findOne({_id:req.params.id});
  const majors = await Major.find({})
  data.majors = majors
  data.teacher = teacher;
  res.render("admin/update_teacher",data)
}

exports.updateTeacher = (req, res) =>{
  if(!req.body){
    return res
      .status(400)
      .send({message: "Data to update cannot be empty"})
  }

  const id = req.params.id;

  // return res.json(req.body)
  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
    .then(data => {
      if(!data){
        res.status(404).send({message: `Cannot Update internship-unit with ${id}. Maybe internship-unit not found!`})
      }else{
        res.redirect('/admin/manage/teachers')
      }
    })
    .catch(err => {
        res.status(500).send({ message: "Error Update internship-unit information"})
    })
}

exports.deleteTeacher = (req, res)=>{
  const id = req.params.id;

  User.findByIdAndDelete(id)
      .then(data => {
          if(!data){
              res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
          }else{
              res.send({
                  message : "User was deleted successfully!"
              })
          }
      })
      .catch(err =>{
          res.status(500).send({
              message: "Could not delete User with id=" + id
          });
      });
}

//manage students
exports.addStudent = async (req, res) => {
  let data = {
    roleName: 'Giáo vụ khoa',
    urlInfo: 'Sinh viên / Thêm mới',
    error: {
      err: false
    },
  }
  const students = await User.find({})
  const majors = await Major.find({})
  data.majors = majors
  data.students = students
 
  res.render("admin/add_student",data)
  
}

exports.createStudent = async (req, res) => {
  if(!req.body){
    res.status(400).send({message: "Content can not be emtpy!"});
    return;
  }
  
  var pwd = password.genRandomString(9);
  
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(pwd, salt);

  //new student
  const student = new User({
    ms: req.body.ms,
    name: req.body.name,
    idClass: req.body.idClass,
    idMajor: mongoose.Types.ObjectId(req.body.major),
    email: req.body.email,
    password: hashPass,
    phone: req.body.phone,
    role: "student"
  }) 

  // save user in the database
  student
    .save(student)
    .then(data => {
      res.redirect('/admin/manage/students');
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "some error occurred while creating a create operation"
      });
    });
}

export async function getUpdateStudent(req, res){
  
  let data = {
    roleName: 'Giáo vụ khoa',
    urlInfo: 'Sinh viên / Cập nhật',  
    error: {
      err: false
    },
  }
  const student = await User.findOne({_id:req.params.id});
  const majors = await Major.find({});
  data.majors = majors;
  data.student = student;
  res.render("admin/update_student",data)
}

exports.updateStudent = (req, res) =>{
  if(!req.body){
    return res
      .status(400)
      .send({message: "Data to update cannot be empty"})
  }

  const id = req.params.id;

  // return res.json(req.body)
  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
    .then(data => {
      if(!data){
        res.status(404).send({message: `Cannot Update internship-unit with ${id}. Maybe internship-unit not found!`})
      }else{
        res.redirect('/admin/manage/students')
      }
    })
    .catch(err => {
        res.status(500).send({ message: "Error Update internship-unit information"})
    })
}

exports.deleteStudent = (req, res)=>{
  const id = req.params.id;
// return res.json(req.body)
  User.findByIdAndDelete(id)
      .then(data => {
          if(!data){
              res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
          }else{
              res.send({
                  message : "User was deleted successfully!"
              })
          }
      })
      .catch(err =>{
          res.status(500).send({
              message: "Could not delete User with id=" + id
          });
      });
}


