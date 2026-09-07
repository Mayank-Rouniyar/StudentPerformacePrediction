import { Router } from "express";
import { User } from "../model/user.model.js";
import { Class } from "../model/class.model.js";

const router = Router();

// SIGN UP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // For now every student belongs to this class.
    // Later we can add class selection/join-code.
    let studentClass = await Class.findOne({ name: "CSE-A" });

    if (!studentClass) {
      studentClass = await Class.create({
        name: "CSE-A",
        students: [],
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      classId: studentClass._id,
    });

    studentClass.students.push(user._id);
    await studentClass.save();

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        classId: user.classId,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create account",
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        classId: user.classId,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
});

export default router;