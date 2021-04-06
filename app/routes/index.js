import authRoute from './auth';

import dbRoute from './db';
import adminRoute from './admin';
import teacherRoute from './teacher';
import studentRoute from './student';

module.exports = (app) => {
  app.use("/db", dbRoute);
  app.use("/admin", adminRoute);
  app.use("/teacher", teacherRoute);
  app.use("/student", studentRoute);

  app.use("/", authRoute);
};
