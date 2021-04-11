import express from 'express';

import { isAdmin } from '../middleware/auth';

import * as adminController from '../controllers/admin';

const router = express.Router();

router.use(isAdmin);

// Manage
router.get('/manage/teachers', adminController.getAllTeachers);
router.get('/manage/students', adminController.getAllStudents);
router.get('/manage/internship-unit', adminController.getAllInternshipUnit);

// Manage
router.get('/manage/teachers', adminController.getAllTeachers);
router.get('/manage/students', adminController.getAllStudents);
router.get('/manage/internship-unit', adminController.getAllInternshipUnit);
router
   .get('/manage/milestone', adminController.milestoneGet)
   .post('/manage/milestone', adminController.milestonePost)
   .put('/manage/milestone', adminController.milestonePut)


// Internship
router.get('/internship/approve', adminController.showAllApproveInternshipUnit)
router.get('/internship/approve/:id', adminController.detailApproveInternshipUnit)
  .post('/internship/approve/:id', adminController.detailApproveInternshipUnit);

router.get('/internship/assign', adminController.assignTeacher);

router.get('/', adminController.index);

module.exports = router;
