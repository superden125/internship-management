import InternshipUnit from '../models/internshipUnit';
import Teacher from '../models/teacher';
import Student from '../models/student';
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
  await InternshipInfo
    .aggregate([
      {
        $lookup: {
          from: 'students',
          localField: 'idSv',
          foreignField: '_id',
          as: 'student'
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
      internInfos.forEach(obj => {
        obj.statusString = obj.status == 0 ? 'Chờ xét duyệt' : 'Đã xét duyệt';
        obj.styleClass = obj.status == 0 ? 'font-weight-bold' : '';
        obj.city = tinh.find((tinh) => tinh.id == obj.internshipUnit[0].city).name;
      });

      return res.render('admin/internship-approve-all', {
        roleName: 'Giáo vụ khoa',
        urlInfo: 'Xét duyệt điểm thực tập',
        internInfos
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
    var approveType = req.body.approve;
    var refuseType = req.body.refuse;

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
    } else if (!approveType) {
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
