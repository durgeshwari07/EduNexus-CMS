
import React, { useState, useEffect } from 'react';


const features = [
  {
    id: 'card1',
    icon: '📂',
    title: 'Centralized Digital Record Room',
    desc: 'Eliminate the inefficiency of physical registers and scattered digital folders. UniDesk provides a single centralized platform where every student has one definitive digital profile.',
    bullets: [
      'Admission to Graduation: Complete lifecycle tracking.',
      'Paperless Management: Reduces administrative workload.',
      'Data Integrity: Eliminates the risk of document loss.'
    ],
    img: '/images/dashboard.png' 
  },
  {
    id: 'card2',
    icon: '⏳',
    title: 'Real-Time Academic Tracking',
    desc: 'Searching old records is no longer a time-consuming task. Our system architecture allows for instantaneous retrieval of academic history.',
    bullets: [
      'Year-Wise Records: Store marks and teacher remarks.',
      'Fast Retrieval: Search by name or roll number in seconds.',
      'Attendance Management: Integrated tracking systems.'
    ],
    img: '/images/records.png' 
  },
  {
    id: 'card3',
    icon: '📜',
    title: 'Document & Report Automation',
    desc: 'A secure digital vault for certificates and automated tools for institutional reporting.',
    bullets: [
      'Secure Vault: Upload and store semester-wise certificates.',
      'One-Click Reports: Generate performance analysis instantly.',
      'Export Ready: Professional generation for PDF or Excel.'
    ],
    img: '/images/reports.png' 
  }
];

const FeatureShowcase = () => {
  const [activeImg, setActiveImg] = useState(features[0].img);
  const [activeId, setActiveId] = useState(features[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const feature = features.find(f => f.id === entry.target.id);
          if (feature) {
            setActiveImg(feature.img);
            setActiveId(feature.id);
          }
        }
      });
    }, { 
      threshold: 0.5, // Triggers when 50% of the text block is in view
      rootMargin: "-10% 0px -10% 0px" 
    });

    features.forEach(f => {
      const el = document.getElementById(f.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" style={{
      display: 'flex', 
      maxWidth: '1300px', 
      margin: '0 auto', 
      padding: '100px 40px', 
      gap: '80px',
      position: 'relative', // Necessary for sticky child reference
      overflow: 'visible'   // Crucial: hidden will break stickiness
    }}>
      {/* Left Column: Scrolling Text */}
      <div style={{ flex: 1 }}>
        {features.map((f) => (
          <div 
            key={f.id} 
            id={f.id} 
            style={{
              height: '80vh', // Gives enough scroll space for the image to stay stuck
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              opacity: activeId === f.id ? 1 : 0.15, 
              transition: 'all 0.6s ease',
              transform: activeId === f.id ? 'translateX(0)' : 'translateX(-20px)'
            }}
          >
            <div style={{fontSize: '48px', marginBottom: '24px'}}>{f.icon}</div>
            <h2 style={{fontSize: '42px', fontWeight: '800', marginBottom: '20px', color: '#000'}}>{f.title}</h2>
            <p style={{fontSize: '20px', color: '#5f6368', lineHeight: '1.6', marginBottom: '24px'}}>{f.desc}</p>
            
            <ul style={{listStyle: 'none', padding: 0}}>
              {f.bullets.map((bullet, index) => (
                <li key={index} style={{
                  display: 'flex', 
                  alignItems: 'start', 
                  gap: '12px', 
                  marginBottom: '12px',
                  fontSize: '16px',
                  color: '#1f1f1f',
                  fontWeight: '500'
                }}>
                  <span style={{color: '#1a73e8'}}>✓</span> {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Right Column: Sticky Image */}
      <div style={{
        flex: 1.2, 
        position: 'sticky', 
        top: '120px',        // Height from top when it stops
        height: '540px', 
        alignSelf: 'flex-start', // THE FIX: Prevents the div from stretching to full height
        zIndex: 10
      }}>
        <div style={{
          width: '100%', 
          height: '100%', 
          background: '#fff', 
          borderRadius: '32px', 
          border: '1px solid #ddd', 
          boxShadow: '0 40px 80px rgba(0,0,0,0.12)', 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Mac-style Window Header */}
          <div style={{height: '40px', background: '#f8f9fa', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', padding: '0 15px', gap: '8px'}}>
              <div style={{display: 'flex', gap: '6px'}}>
                <div style={{width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56'}}></div>
                <div style={{width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e'}}></div>
                <div style={{width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f'}}></div>
              </div>
          </div>
          <img 
            key={activeImg} // Tells React to treat it as a new element (triggers animation)
            src={activeImg} 
            alt="Feature Preview" 
            style={{
              width: '100%', 
              height: 'calc(100% - 40px)', 
              objectFit: 'cover',
              animation: 'imgFade 0.6s ease' // Animation name from CSS
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;





