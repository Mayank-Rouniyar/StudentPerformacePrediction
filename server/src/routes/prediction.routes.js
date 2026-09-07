
import { Router } from "express";
import { Prediction } from "../model/prediction.model.js";
import { User } from "../model/user.model.js";

const router = Router();

/*
====================================================
1. SAVE PREDICTION
POST /api/predictions/save
====================================================
*/

router.post("/save", async (req, res) => {
  try {
    const { student, classId, predictedCGPA } = req.body;

    if (!student || !classId || predictedCGPA === undefined) {
      return res.status(400).json({
        success: false,
        message: "student, classId and predictedCGPA are required",
      });
    }

    const prediction = await Prediction.create({
      student,
      classId,
      predictedCGPA: Number(predictedCGPA),
    });

    return res.status(201).json({
      success: true,
      message: "Prediction saved successfully",
      prediction,
    });
  } catch (error) {
    console.error("Save Prediction Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save prediction",
    });
  }
});


/*
====================================================
2. GET CLASS PREDICTION HISTORY
GET /api/predictions/class/:classId
====================================================
*/

router.get("/class/:classId", async (req, res) => {
  try {
    const { classId } = req.params;

    const predictions = await Prediction.find({
      classId,
    })
      .populate("student", "name email")
      .sort({ predictionDate: 1 });

    return res.status(200).json({
      success: true,
      count: predictions.length,
      predictions,
    });
  } catch (error) {
    console.error("Get Class Predictions Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch class prediction history",
    });
  }
});


/*
====================================================
3. GET CLASS RANKING
GET /api/predictions/ranking/:classId
====================================================
*/

router.get("/ranking/:classId", async (req, res) => {
  try {
    const { classId } = req.params;

    /*
      Step 1:
      Get all students belonging to this class.
    */

    const students = await User.find({
      classId,
    }).select("_id name email");


    /*
      Step 2:
      Get all predictions for this class.
    */

    const predictions = await Prediction.find({
      classId,
    }).sort({
      predictionDate: -1,
    });


    /*
      Step 3:
      Keep only the latest prediction
      for each student.
    */

    const latestPredictions = new Map();

    for (const prediction of predictions) {
      const studentId = prediction.student.toString();

      if (!latestPredictions.has(studentId)) {
        latestPredictions.set(studentId, prediction);
      }
    }


    /*
      Step 4:
      Create ranking list.
    */

    const ranking = students
      .map((student) => {
        const prediction = latestPredictions.get(
          student._id.toString()
        );

        return {
          studentId: student._id,
          name: student.name,
          email: student.email,
          predictedCGPA: prediction
            ? prediction.predictedCGPA
            : null,
          predictionDate: prediction
            ? prediction.predictionDate
            : null,
        };
      })
      .filter((student) => student.predictedCGPA !== null)
      .sort(
        (a, b) =>
          b.predictedCGPA - a.predictedCGPA
      );


    /*
      Step 5:
      Assign ranks.
    */

    const rankedStudents = ranking.map(
      (student, index) => ({
        rank: index + 1,
        ...student,
      })
    );


    return res.status(200).json({
      success: true,
      count: rankedStudents.length,
      ranking: rankedStudents,
    });

  } catch (error) {
    console.error("Get Class Ranking Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch class ranking",
    });
  }
});


export default router;

