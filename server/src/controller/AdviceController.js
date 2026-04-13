import StudentDataModel from '../model/StudentData.js';

/**
 * Generate personalized advice based on the student's latest data entry.
 * Returns dynamic advice cards with actionable recommendations.
 */
export const getAdvice = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required', success: false });
    }

    // Get the latest entry for the user
    const latestData = await StudentDataModel.findOne({ userId }).sort({ createdAt: -1 });

    // Default advice if no data found
    const adviceCards = [];
    let weeklyGoal = {
      target: '85%',
      metric: 'Target Attendance',
      message: 'Focus on attending all lectures this week. Attendance directly boosts performance.',
    };

    if (!latestData) {
      // Generic advice when no data exists
      adviceCards.push(
        {
          icon: 'Brain',
          title: 'Cognitive Optimization',
          advice: 'Sleep 7–8 hours daily to improve memory and retention.',
          type: 'success',
        },
        {
          icon: 'BookOpen',
          title: 'Study Technique',
          advice: 'Use Pomodoro: 25 min study + 5 min break for maximum focus.',
          type: 'info',
        },
        {
          icon: 'Coffee',
          title: 'Energy Management',
          advice: 'Do hard subjects in the morning, light work later in the day.',
          type: 'warning',
        }
      );
    } else {
      const { studyHours, attendance, previousGrades, extracurriculars, sleepHours } = latestData;

      // Study hours advice
      if (studyHours < 3) {
        adviceCards.push({
          icon: 'BookOpen',
          title: 'Increase Study Time',
          advice: `You're currently studying ${studyHours} hrs/day. Aim for at least 4-5 hours daily to improve your grades significantly.`,
          type: 'warning',
        });
      } else if (studyHours >= 3 && studyHours < 6) {
        adviceCards.push({
          icon: 'BookOpen',
          title: 'Good Study Habits',
          advice: `${studyHours} hrs/day is solid! Try active recall and spaced repetition to maximize retention.`,
          type: 'success',
        });
      } else {
        adviceCards.push({
          icon: 'BookOpen',
          title: 'Excellent Dedication',
          advice: `${studyHours} hrs/day shows great commitment. Make sure to take breaks to avoid burnout.`,
          type: 'success',
        });
      }

      // Sleep advice
      if (sleepHours < 6) {
        adviceCards.push({
          icon: 'Brain',
          title: 'Critical: More Sleep Needed',
          advice: `Only ${sleepHours} hrs of sleep is hurting your cognitive performance. Aim for 7-8 hours for better memory and focus.`,
          type: 'warning',
        });
      } else if (sleepHours >= 6 && sleepHours <= 8) {
        adviceCards.push({
          icon: 'Brain',
          title: 'Healthy Sleep Pattern',
          advice: `${sleepHours} hrs of sleep is in the healthy range. Maintain a consistent sleep schedule for best results.`,
          type: 'success',
        });
      } else {
        adviceCards.push({
          icon: 'Brain',
          title: 'Optimize Sleep Duration',
          advice: `${sleepHours} hrs is more than needed. Try waking up earlier and using the extra time for revision.`,
          type: 'info',
        });
      }

      // Attendance advice
      if (attendance < 75) {
        adviceCards.push({
          icon: 'Coffee',
          title: 'Attendance Alert',
          advice: `Your ${attendance}% attendance is below the recommended threshold. Each class missed impacts your understanding compoundingly.`,
          type: 'warning',
        });
        weeklyGoal = {
          target: '85%',
          metric: 'Target Attendance',
          message: `Your current attendance is ${attendance}%. Aim for at least 85% this month to see a significant improvement.`,
        };
      } else if (attendance >= 75 && attendance < 90) {
        adviceCards.push({
          icon: 'Coffee',
          title: 'Improve Consistency',
          advice: `${attendance}% attendance is decent. Push for 90%+ to gain the full benefit of classroom learning.`,
          type: 'info',
        });
        weeklyGoal = {
          target: '90%',
          metric: 'Target Attendance',
          message: `You're at ${attendance}%. A small push to 90%+ can meaningfully boost your performance.`,
        };
      } else {
        adviceCards.push({
          icon: 'Coffee',
          title: 'Great Attendance!',
          advice: `${attendance}% attendance is excellent. Keep it up — consistent presence is a proven success factor.`,
          type: 'success',
        });
        weeklyGoal = {
          target: `${Math.min(previousGrades + 5, 100)}%`,
          metric: 'Target Grade',
          message: `Your attendance is strong. Focus on pushing your grade from ${previousGrades}% to ${Math.min(previousGrades + 5, 100)}%.`,
        };
      }
    }

    res.status(200).json({
      success: true,
      adviceCards,
      weeklyGoal,
    });
  } catch (err) {
    console.error('Advice error:', err);
    res.status(500).json({
      message: 'Failed to generate advice',
      success: false,
    });
  }
};
