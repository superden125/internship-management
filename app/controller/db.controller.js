import bcrypt from 'bcryptjs';

import Major from '../models/major';
import User from '../models/user';
import Teacher from '../models/teacher';

// [GET] /db/major
module.exports.mockMajorDB = (req, res) => {
  const listMajor = [
    { name: 'CNTT' },
    { name: 'CNTT-CLC' },
    { name: 'HTTT' },
    { name: 'KHMT' },
    { name: 'KTPM' },
    { name: 'THUD' },
    { name: 'MMT&TTDL' }
  ];

  listMajor.forEach(async (item) => {
    const major = new Major(item);
    await major.save();
  });

  res.send('Mocking Major DB successfully !!!');
}

// [GET] /db/teacher
module.exports.mockTeacherDB = async (req, res) => {
  const major = await Major.findOne({ name: 'KTPM' });
  const pwd = 'ims123';
  console.log(major);
  const listTeacher = [
    {
      mscb: '0065001',
      name: 'Vo Huynh Tram',
      idMajor: major._id,
      email: 'vhtram@cit.ctu.edu.vn',
    },
    {
      mscb: '0065002',
      name: 'Truong Minh Thai',
      idMajor: major._id,
      email: 'tmthai@cit.ctu.edu.vn',
    },
    {
      mscb: '0065003',
      name: 'Huynh Xuan Hiep',
      idMajor: major._id,
      email: 'hxhiep@cit.ctu.edu.vn',
    },
    {
      mscb: '0065004',
      name: 'Truong Thi Thanh Tuyen',
      idMajor: major._id,
      email: 'ttttuyen@cit.ctu.edu.vn',
    },
    {
      mscb: '0065005',
      name: 'Lam Hoai Bao',
      idMajor: major._id,
      email: 'lhbao@cit.ctu.edu.vn',
    },
    {
      mscb: '0065006',
      name: 'Phan Huy Cuong',
      idMajor: major._id,
      email: 'phcuong@cit.ctu.edu.vn',
    },
    {
      mscb: '0065007',
      name: 'Huynh Quang Nghi',
      idMajor: major._id,
      email: 'hqnghi@cit.ctu.edu.vn',
    },
    {
      mscb: '0065008',
      name: 'Nguyen Cong Danh',
      idMajor: major._id,
      email: 'ncdanh@cit.ctu.edu.vn',
    },
  ];
  let count = 0;
  listTeacher.forEach(async (item) => {
    const teacher = new Teacher(item);

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(pwd, salt);
    const user = new User({
      username: item.mscb,
      password: hashPass,
      role: 1,
    });
    await teacher.save();
    await user.save();
  });
  return res.send('Mocking teacher DB successfully');
}