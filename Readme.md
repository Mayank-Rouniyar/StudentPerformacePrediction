# Student Performance Prediction System

## Overview

The **Student Performance Prediction System** is a web-based application that leverages Artificial Intelligence to analyze student behavior and predict academic outcomes. By utilizing a **Linear Regression** and **Random Forest** model, the system estimates a student's CGPA and provides actionable insights to improve performance.

The application is built with a modern frontend stack using **React** and **Tailwind CSS**, ensuring a responsive and user-friendly experience.

---

## Objectives

* Predict student CGPA based on lifestyle and study habits
* Analyze performance trends over time
* Provide personalized recommendations for improvement
* Help students make data-driven academic decisions

---

## Key Features

### 1. Landing Page

* Provides an overview of the system
* Offers navigation to all modules
* Includes entry point for user authentication

### 2. Authentication (Sign In Page)

* Collects user information:

  * Username
  * Email
  * Password
  * Class

### 3. Data Entry Module

Captures input parameters required for prediction:

* Study Hours
* Social Media Usage
* Attendance
* Expected CGPA
* Gaming Time
* Sleep Hours
* Entertainment (Netflix) Time

### 4. Prediction Module

* Displays predicted CGPA using the trained model
* Estimates class rank based on predicted performance

### 5. Analysis Module

* Compares past and current expected CGPA
* Visualizes performance trends using graphs
* Helps identify improvement or decline in performance

### 6. Advisory Module

* Generates personalized recommendations
* Suggests improvements in:

  * Study habits
  * Time management
  * Lifestyle balance

---

## System Architecture

```id="n3k2v8"
Frontend (React + Tailwind CSS)
        │
        ▼
User Input & UI Interaction
        │
        ▼
Machine Learning Model (Linear Regression)
        │
        ▼
Prediction Results & Insights
```

---

## Machine Learning Details

* **Model**: Linear Regression
* **Purpose**: Predict CGPA from behavioral and academic inputs

### Input Features:

* Study Hours
* Attendance
* Social Media Usage
* Gaming Time
* Sleep Hours
* Entertainment Time

### Output:

* Predicted CGPA
* Estimated Rank

---

## Technology Stack

| Layer       | Technology        |
| ----------- | ----------------- |
| Frontend    | React             |
| Styling     | Tailwind CSS      |
| Programming | JavaScript        |
| ML Model    | Linear Regression |

---

## Installation and Setup

### Prerequisites

* Node.js (v14 or higher)
* npm or yarn

### Steps

```bash id="r7h2lm"
# Clone the repository
git clone https://github.com/your-username/student-performance-prediction.git

# Navigate to project directory
cd student-performance-prediction

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## Usage

1. Open the application in your browser
2. Sign in using required credentials
3. Enter your academic and lifestyle data
4. View predicted CGPA and rank
5. Analyze trends and review personalized advice

---

## Future Enhancements

* Integration of advanced machine learning models (e.g., Random Forest, Neural Networks)
* Backend integration for persistent data storage
* User profile and historical tracking
* Enhanced data visualization dashboards
* Improved model accuracy with larger datasets

---

## Contribution Guidelines

Contributions are encouraged and appreciated.

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Submit a pull request

---

## License

This project is licensed under the MIT License.

---

## Acknowledgements

This project is developed as part of an academic initiative to explore the application of Artificial Intelligence in education and student performance analysis.

---

## 👨‍💻 Authors / Contributors

* **Mayank** 
* **Prakash**
* **Divyanshu**

---

## Contact

For queries or collaboration opportunities, please reach out via GitHub.

---

**Note:** This system is intended for educational and analytical purposes and should not be used as the sole metric for academic evaluation.
