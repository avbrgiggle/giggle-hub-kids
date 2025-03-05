
// This file now serves as a gateway to the other more specific service files
// By re-exporting everything, we maintain backward compatibility

export {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent
} from './studentService';

export {
  getStudentActivities,
  addStudentActivity,
  updateStudentActivity,
  deleteStudentActivity,
  getExtracurricularActivities
} from './activityService';

export {
  getAttendanceRecords,
  addAttendanceRecord,
  updateAttendanceRecord
} from './attendanceService';

export {
  getPayments,
  addPayment,
  updatePayment
} from './paymentService';
