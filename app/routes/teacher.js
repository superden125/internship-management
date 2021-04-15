import express from 'express';

import * as teacherController from '../controllers/teacher';

const router = express.Router();

//router.use(auth.isTeacher)

router.get('/', teacherController.index)
router.get('/core', teacherController.index)
router.get('/get-many-interninfo', teacherController.getManyInternInfo)
router.get('/:id', teacherController.getInternshipInfo)

router.post('/save-many-core', teacherController.saveManyCore)
router.post('/save-core', teacherController.saveCore)
//router.get("/", (req,res)=>{req.})
module.exports = router;
