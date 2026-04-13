import mongoose from 'mongoose';

const StudentDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    studyHours: {
      type: Number,
      required: true,
      min: 0,
      max: 24,
    },
    attendance: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    previousGrades: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    extracurriculars: {
      type: Number,
      required: true,
      min: 0,
      max: 40,
    },
    sleepHours: {
      type: Number,
      required: true,
      min: 0,
      max: 24,
    },
  },
  { timestamps: true }
);

const StudentDataModel = mongoose.model('studentdata', StudentDataSchema);
export default StudentDataModel;
