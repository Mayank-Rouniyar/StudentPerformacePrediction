import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    predictedCGPA: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    parameters: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    predictionDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Prediction = mongoose.model("Prediction", predictionSchema);