import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentPortal from './StudentPortal';
import FacultyPortal from './FacultyPortal';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentPortal />} />
        <Route path="/faculty" element={<FacultyPortal />} />
      </Routes>
    </Router>
  );
}

export default App;