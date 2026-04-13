import StudentDataModel from '../model/StudentData.js';

// Save student data
export const saveStudentData = async (req, res) => {
  try {
    const { userId, studyHours, attendance, previousGrades, extracurriculars, sleepHours } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required', success: false });
    }

    const newData = new StudentDataModel({
      userId,
      studyHours,
      attendance,
      previousGrades,
      extracurriculars,
      sleepHours,
    });

    await newData.save();

    res.status(201).json({
      message: 'Student data saved successfully',
      success: true,
      data: newData,
    });
  } catch (err) {
    console.error('Save student data error:', err);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};

// Get student data by userId
export const getStudentData = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'userId query param is required', success: false });
    }

    const data = await StudentDataModel.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(data);
  } catch (err) {
    console.error('Get student data error:', err);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
    });
  }
};
