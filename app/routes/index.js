import authRoute from './auth.route';

import dbRoute from './db.route';
import adminRoute from './admin.route';
import teacherRoute from './teacher.route';
import studentRoute from './student.route';

module.exports = (app) => {
  app.use('/db', dbRoute);
  app.use('/admin', adminRoute);
  app.use('/teacher', teacherRoute);
  app.use('/student', studentRoute);
  
  app.use('/', authRoute);
}
