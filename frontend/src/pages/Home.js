import React from "react";
import { Link } from "react-router-dom"; // IMPORT THIS to connect to team's pages
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
    {/* NAV */}

          <nav className="flex items-center justify-between w-full">
      {/* --- LOGO CONTAINER --- */}
      <div className="h-14 w-auto shrink-0 flex items-center bg-white overflow-hidden">
        <img 
          src="https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/8c7338dc-8987-48b2-b26f-82ea8e223018.jpeg" 
          alt="UniDesk Logo" 
          className="h-full w-auto object-contain object-left" 
        />
      </div>

      {/* --- ACTION BUTTON --- */}
      <Link 
        to="/login" 
        className="login-btn px-6 py-2 bg-[#136dec] text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors"
      >
        Login Portal
      </Link>
    </nav>

      {/* HERO */}
      <section className="hero">
        <h1>
          Simplify College <br />
          <span>Administration</span>
        </h1>
        <p>
          A centralized, role-based system to manage student academic records securely from admission to graduation.
        </p>
        <div className="hero-actions">
          {/* Linked to the team's Teacher Registration page */}
          <Link to="/register/teacher" className="btn-large btn-blue">Register Teacher</Link>
          
          {/* Linked to the team's Login page */}
          <Link to="/login" className="btn-large btn-white">Login</Link>
        </div>
      </section>

      {/* CORE IDEA */}
      <section className="section-core">
        <div className="content-box">
          <span className="section-label">The Central Idea</span>
          <h2>Paperless. Organized. Secure.</h2>
          <p className="desc">
            UniDesk eliminates the need for manual file handling. We provide a single digital platform where Admins define the structure and Teachers manage the data.
          </p>
          <p className="desc">
            <strong>Privacy First:</strong> No student data is publicly visible on this home page. You must log in to access the secure dashboard.
          </p>
        </div>
      </section>

      {/* SYSTEM INTELLIGENCE */}
      <section className="section-features">
        <h2>System Intelligence</h2>
        <div className="feature-grid">
          <div className="feature-item">
            <h3>Auto-Profiles</h3>
            <p>
              The system automatically consolidates data from multiple teachers into one permanent digital profile for every student.
            </p>
          </div>

          <div className="feature-item">
            <h3>Subject Mapping</h3>
            <p>
              Teachers see only what they need. The system identifies the login and automatically fetches their specific assigned subjects.
            </p>
          </div>

          <div className="feature-item">
            <h3>No Overwrites</h3>
            <p>
              Backend logic ensures data integrity. Marks are stored with unique Subject IDs to prevent accidental data overwrites.
            </p>
          </div>
        </div>
      </section>

      {/* ACCESS CONTROL */}
      <section className="section-roles">
        <div className="role-text">
          <span className="section-label">Access Control</span>
          <h2>
            Designed for <br /> Your Role
          </h2>
          <p className="desc">
            A strictly role-based environment ensures that structural control remains with the Admin while academic freedom is given to Teachers.
          </p>
        </div>

        <div className="role-cards-wrapper">
          <div className="role-badge">
            <div className="role-icon">A</div>
            <div>
              <h4>College Admin</h4>
              <p>Adds Departments, Teachers, and controls the master data.</p>
            </div>
          </div>

          <div className="role-badge">
            <div className="role-icon">T</div>
            <div>
              <h4>Teacher / Faculty</h4>
              <p>Updates marks and views records for assigned subjects only.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>
          &copy; 2026 <strong>UniDesk</strong> Management System. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;