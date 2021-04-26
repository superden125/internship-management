import moment from "moment"
import InternshipUnit from '../models/internshipUnit';
import mongoose from 'mongoose';
import Teacher from '../models/teacher';
import Student from '../models/student';
import Milestone from '../models/milestone';
import InternshipInfo from '../models/internshipInfo';
import {tinh} from "../lib/tinh";


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
  await Teacher.find({})
    .exec(function (err, teachers) {
      return res.json({
        data: teachers
      });
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

module.exports.loadAproveInternshipUnitPage = (req, res) => {
  res.render('admin/internship-approve-all', {
    roleName: 'Giáo vụ khoa',
    urlInfo: 'Xét duyệt điểm thực tập',
  });
}

module.exports.showAllApproveInternshipUnit = async (req, res) => {
  var page = 1;

  var sortType = {
    column: 'timestamp',
    type: -1,
  };

  var paginationObj = {
    page: 1,
    limit: 6,
    skip: 0
  };

  if (req.query.hasOwnProperty('_sort')) {
    Object.assign(sortType, {
      column: req.query.column,
      type: parseInt(req.query.type),
    });

    // sortType.icon = sortType.type == -1 ? 'fas fa-sort-down': 'fas fa-sort-up';
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

  const query = [{
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
    }
  ];

  query.push({
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
  });

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

      return res.json({
        status: 'success',
        data: {
          internInfos,
          type: -(sortType.type),
          totalDocs,
          current: page,
          totalPages: Math.ceil(totalDocs / paginationObj.limit),
          indexCount: paginationObj.skip,
        }
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
              console.log(item1);
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
          // console.log(internUnit);
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

//Milestone
module.exports.milestoneGet = async (req, res) => {
  let data = {
    roleName: 'Giáo vụ khoa',
    urlInfo: 'Thời gian thực tập',
  }
  const milestones = await Milestone.find().sort({
    endRegister: -1
  })
  let milestones1 = [];
  milestones.forEach((val) => {
    const obj = {}
    obj._id = val._id
    obj.semester = val.semester
    obj.hk = val.hk
    obj.startIntern = moment(val.startIntern).format("DD-MM-YYYY")
    obj.endIntern = moment(val.endIntern).format("DD-MM-YYYY")
    obj.endRegister = moment(val.endRegister).format("DD-MM-YYYY")
    obj.endCore = moment(val.endCore).format("DD-MM-YYYY")
    milestones1.push(obj)
  })
  data.milestones = milestones1
  res.render("admin/milestone", data)
}

module.exports.milestoneGets = async (req,res)=>{
  const {semester, hk} = req.query  
  const milestones = await Milestone.find({semester, hk: parseInt(hk)}).sort({
    endRegister: -1
  })
  
  if(milestones.length == 0) return res.json({success: false, msg: "Not found milestone"})
  let milestones1 = [];
  milestones.forEach((val) => {
    const obj = {}
    obj._id = val._id
    obj.semester = val.semester
    obj.hk = val.hk
    obj.startIntern = moment(val.startIntern).format("DD-MM-YYYY")
    obj.endIntern = moment(val.endIntern).format("DD-MM-YYYY")
    obj.endRegister = moment(val.endRegister).format("DD-MM-YYYY")
    obj.endCore = moment(val.endCore).format("DD-MM-YYYY")
    milestones1.push(obj)
  })
  
  res.json({success:true, data: {milestones: milestones1}})
}

module.exports.milestonePost = async (req, res) => {
  try {
    console.log(req.body)
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
  const milestone = await Milestone.findById(data._id);

  if (!milestone) return res.json({
    success: false
  })

  milestone.semester = data.semester
  milestone.hk = data.hk
  milestone.endRegister = data.endRegister
  milestone.startIntern = data.startIntern
  milestone.endIntern = data.endIntern
  milestone.endCore = data.endCore

  const result = await milestone.save();
  if (!result) return res.json({
    success: false
  })
  return res.json({
    success: true,
    data: result
  })

}