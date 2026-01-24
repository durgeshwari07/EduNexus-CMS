import React, { useState } from 'react';

const Navbar = ({ onLoginClick, onLogoClick, onRegisterAdmin, onRegisterTeacher }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav style={{
      position: 'fixed', top: 0, width: '100%', height: '64px',
      background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)',
      zIndex: 1000, borderBottom: '1px solid #dadce0',
      display: 'flex', justifyContent: 'center'
    }}>
      <div style={{
        width: '100%', maxWidth: '1400px', padding: '0 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={onLogoClick}
          style={{display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700, fontSize: '22px', cursor: 'pointer'}}
        >
          <div style={{
            width: '36px', height: '36px', background: '#1a73e8',
            borderRadius: '10px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'white'
          }}>U</div>
          UniDesk
        </div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', position: 'relative' }}>
          
          {/* Register Dropdown Wrapper */}
          <div 
            onMouseEnter={() => setShowDropdown(true)} 
            onMouseLeave={() => setShowDropdown(false)}
            style={{ position: 'relative' }}
          >
            <button style={{
              background: '#f1f5f9', color: '#1a73e8', padding: '10px 20px',
              borderRadius: '100px', border: '1px solid #cbd5e1', cursor: 'pointer', 
              fontWeight: 600, fontSize: '14px'
            }}>
              Register ▼
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div style={{
                position: 'absolute', top: '45px', right: 0,
                background: 'white', border: '1px solid #dadce0',
                borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                padding: '8px', width: '190px', zIndex: 1001
              }}>
                <div 
                  onClick={onRegisterAdmin}
                  style={dropdownItemStyle}
                  onMouseOver={(e) => e.target.style.background = '#f1f5f9'}
                  onMouseOut={(e) => e.target.style.background = 'transparent'}
                >
                  Register as Admin
                </div>
                <div 
                  onClick={onRegisterTeacher}
                  style={dropdownItemStyle}
                  onMouseOver={(e) => e.target.style.background = '#f1f5f9'}
                  onMouseOut={(e) => e.target.style.background = 'transparent'}
                >
                  Register as Teacher
                </div>
              </div>
            )}
          </div>

          {/* Login Button */}
          <button 
            onClick={onLoginClick}
            style={{
              background: '#1f1f1f', color: 'white', padding: '10px 24px',
              borderRadius: '100px', border: 'none', cursor: 'pointer', fontWeight: 600
            }}
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

const dropdownItemStyle = {
  padding: '12px', 
  cursor: 'pointer', 
  borderRadius: '8px', 
  fontSize: '14px', 
  color: '#334155',
  transition: 'background 0.2s ease'
};

export default Navbar;