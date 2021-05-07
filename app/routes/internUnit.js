import express from 'express';

import * as internUnitController from '../controllers/internshipUnit';

const router = express.Router();

router.get('/', internUnitController.getManyInternUnit)

module.exports = router