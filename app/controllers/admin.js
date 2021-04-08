import moment from "moment"
import InternshipUnit from '../models/internshipUnit';
import Teacher from '../models/teacher';
import Student from '../models/student';
import Milestone from '../models/milestone';
import InternshipInfo from '../models/internshipInfo';
import tinh from "../lib/tinh";


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

module.exports.showAllApproveInternshipUnit = async (req, res) => {
  var sortType = {
    column: 'timestamp',
    type: -1,
    icon: 'fas fa-sort'  
  }

  if (req.query.hasOwnProperty('_sort')) {
    Object.assign(sortType, {
      column: req.query.column,
      type: parseInt(req.query.type),
    });

    // sortType.icon = sortType.type == -1 ? 'fas fa-sort-down': 'fas fa-sort-up';
  }

  var lookupStudent = {
    $lookup: {
      from: 'students',
      localField: 'idSv',
      foreignField: '_id',
      as: 'student'
    }
  }, lookupInternshipUnit = {
    $lookup: {
      from: 'internshipunits',
      localField: 'idIntern',
      foreignField: '_id',
      as: 'internshipUnit'
    }
  }, sortOperator = {
    $sort: { }
  }, sort = sortType.column;

  sortOperator['$sort'][sort] = sortType.type;

  await InternshipInfo
    .aggregate([ lookupStudent, lookupInternshipUnit, sortOperator ])
    .exec(function (err, internInfos) {
      internInfos.forEach(obj => {
        obj.statusString = obj.status == 0 ? 'Chờ xét duyệt' : 'Đã xét duyệt';
        obj.styleClass = obj.status == 0 ? 'font-weight-bold' : '';
        obj.city = tinh.find((tinh) => tinh.id == obj.internshipUnit[0].city).name;
      });

      return res.render('admin/internship-approve-all', {
        roleName: 'Giáo vụ khoa',
        urlInfo: 'Xét duyệt điểm thực tập',
        internInfos,
        type: -(sortType.type),
        icon: sortType.icon
      });
    });
}

module.exports.detailApproveInternshipUnit = async (req, res) => {
  if (req.method == 'GET') {
    await InternshipInfo
      .findOne({
        shortId: req.params.id
      })
      .populate({
        path:'idSv',
        populate: {
          path: 'idMajor'
        }
      })
      .populate('idIntern')
      .exec(function (error, internInfo) {
        internInfo.haveRoomString = !internInfo.haveRoom ? 'Không' : 'Có';
        internInfo.havePCString = !internInfo.havePC ? 'Không' : 'Có';
        internInfo.city = tinh.find((tinh) => tinh.id == internInfo.idIntern.city).name;

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
        })
      });
  } else if (req.method == 'POST') {
    var idInternInfo = req.body.idInternInfo;
    var refuseType = req.body.refuse;

    // return res.json(!approveType);

    if (!refuseType) {
      await InternshipInfo
        .findOne({
          shortId: idInternInfo
        })
        .updateOne({
          status: 1
        })
        .then(() => {
          res.redirect('/admin/internship/approve');
        });
    } else {
        await InternshipInfo
          .findOne({
            shortId: idInternInfo
          })
          .updateOne({
            status: 0
          })
          .then(() => {
            res.redirect('/admin/internship/approve');
          });
    }
  }
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