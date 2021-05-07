import authRoute from './auth';

import dbRoute from './db';
import adminRoute from './admin';
import teacherRoute from './teacher';
import studentRoute from './student';
import internUnitRoute from './internUnit';
import {
  setLocals
} from '../middleware/auth';

module.exports = (app) => {
  app.use("/db", dbRoute);
  app.use("/admin", setLocals, adminRoute);
  app.use("/teacher", setLocals, teacherRoute);
  app.use("/student", setLocals, studentRoute);
  app.use("/intern-unit", internUnitRoute)

  app.use("/", authRoute);
};