# AI Exam Evaluation System

![AI Exam Evaluation](public/logo192.png)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

The **AI Exam Evaluation System** is a comprehensive platform designed to streamline the process of creating, managing, and evaluating exam papers using artificial intelligence. Tailored for educational institutions, this system facilitates seamless interaction between students, faculty, and administrative staff, ensuring efficient exam management and analysis.

## Features

- **User Authentication**
  - Secure login for students and faculty members.
  - Role-based access control to different sections of the application.

- **Student Enrollment**
  - Upload and manage student enrollment data.
  - Support for PDF and Excel file formats.

- **Question Paper Settings**
  - Create and manage exam papers with detailed question prompts and answers.
  - Track total marks and organize questions systematically.

- **Faculty Dashboard**
  - View department details including the number of students, teachers, and courses.
  - Monitor overall performance and contribution metrics.
  - Visualize time spent using interactive heatmaps.

- **Course Mapping**
  - Assign courses to faculty members based on semester and department.
  - Manage course allocations efficiently.

- **Profile Management**
  - View and update user profiles.
  - Track personal contributions and time spent on the platform.

- **AI-Powered Scrutinizer**
  - Automated evaluation of exam papers.
  - Detailed reports on student performance and exam quality.

## Technology Stack

- **Frontend**
  - React.js
  - Tailwind CSS
  - React Router DOM
  - React Icons

- **Backend**
  - Supabase (PostgreSQL, Authentication, Storage)
  
- **Testing**
  - Jest
  - React Testing Library

- **Others**
  - JavaScript (ES6+)
  - HTML5 & CSS3

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/AiEvaluation12/AIEVAL.git
   cd AIEVAL
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env.local` file in the root directory and add your Supabase credentials:

   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Running the Application

Start the development server:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Project Structure

```plaintext
ai-exam-evaluation/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Qapaper.js
│   │   ├── Qasettings.js
│   │   ├── Scrutinizer.js
│   │   ├── Qpscrutinizer.js
│   │   ├── StudentEnrollment.js
│   │   ├── TopNavbar.js
│   │   └── Profile.js
│   ├── pages/
│   │   ├── StudentPage.js
│   │   ├── FacultyPage.js
│   │   ├── HODPage.js
│   │   ├── LoginPage.js
│   │   └── HodCourseMapping.js
│   ├── services/
│   │   └── dataService.js
│   ├── App.js
│   ├── index.js
│   ├── index.css
│   ├── App.css
│   ├── setupTests.js
│   └── tailwind.config.js
├── .gitignore
├── package.json
└── postcss.config.js
```

## Usage

### 1. **Login**

- **Students** and **Faculty** can log in using their registered email and password.
- Use the "Forgot Password" feature if you need to reset your credentials.

### 2. **Student Enrollment**

- Navigate to the "Student Enrollment" section to upload enrollment data.
- Supported file formats: PDF and Excel.
- Select the appropriate academic year before uploading.

### 3. **Question Paper Settings**

- Create and manage exam papers by adding questions, prompts, answers, and marks.
- Submit the compiled questions to the database for evaluation.

### 4. **Faculty Dashboard**

- Access detailed statistics about the department, including the number of students, teachers, and courses.
- View contribution metrics and overall performance using interactive visualizations.

### 5. **Course Mapping**

- Assign courses to faculty members based on the selected semester.
- Ensure that course allocations are correctly mapped to respective departments.

### 6. **Profile Management**

- View and update your profile information.
- Track your contributions and time spent on the platform.

### 7. **AI-Powered Scrutinizer**

- Utilize the scrutinizer to automatically evaluate exam papers.
- Generate detailed reports to assess student performance and exam quality.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the Repository**

2. **Create a New Branch**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Add some feature"
   ```

4. **Push to the Branch**

   ```bash
   git push origin feature/YourFeatureName
   ```

5. **Open a Pull Request**

## License

This project is licensed under the [MIT License](LICENSE).

---

© 2023 AI Exam Evaluation System. All rights reserved.
"# ECOSMART-AI-GRADING-SYSTEM" 
