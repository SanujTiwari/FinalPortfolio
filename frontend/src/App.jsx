import React, { useState, useEffect, useMemo } from 'react';
import Typewriter from 'typewriter-effect';
import ParticleField from './components/ParticleField';
import HeroScene from './components/HeroScene';
import { SkillsBackground, ProjectsBackground, AboutBackground } from './components/SectionBackgrounds';
import './index.css';

function App() {
  // Theme & Mode State
  const [theme, setTheme] = useState('midnight'); // midnight, arctic, gold, emerald

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-mode', 'dark');
  }, [theme]);

  // Map theme names to actual hex colors for 3D scenes
  const themeColors = {
    midnight: '#e58c56',
    arctic: '#38bdf8',
    gold: '#fbbf24',
    emerald: '#10b981',
  };
  const accentColor = themeColors[theme] || '#e58c56';

  // Navbar Scroll Logic
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 300);

      const sections = ['home', 'about', 'skills', 'projects', 'education', 'certificates', 'contact', 'resume'];
      let current = 'home';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initialize on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Contact Form Logic
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;
    
    // Construct email body
    const bodyText = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
    
    // Open default mail client
    window.location.href = `mailto:sanujvirat@gmail.com?subject=New Message from Portfolio Website&body=${bodyText}`;
    
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  // Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger');
    revealElements.forEach(el => observer.observe(el));
    return () => revealElements.forEach(el => observer.unobserve(el));
  }, []);

  // ─── Coding Profiles Real-Time Data ────────────────────
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [gfgData, setGfgData] = useState(null);
  const [codechefData, setCodechefData] = useState(null);
  const [profilesLoading, setProfilesLoading] = useState(true);

  useEffect(() => {
    const API_BASE = '/api/profiles';

    const fetchProfiles = async () => {
      setProfilesLoading(true);
      try {
        const [lcRes, gfgRes, ccRes] = await Promise.allSettled([
          fetch(`${API_BASE}/leetcode/sanujtiwari1`).then(r => r.json()),
          fetch(`${API_BASE}/gfg/sanujva4bg`).then(r => r.json()),
          fetch(`${API_BASE}/codechef/brisk_fame_71`).then(r => r.json()),
        ]);

        if (lcRes.status === 'fulfilled' && !lcRes.value.error) setLeetcodeData(lcRes.value);
        if (gfgRes.status === 'fulfilled' && !gfgRes.value.error) setGfgData(gfgRes.value);
        if (ccRes.status === 'fulfilled' && !ccRes.value.error) setCodechefData(ccRes.value);
      } catch (err) {
        console.error('Failed to fetch coding profiles:', err);
      } finally {
        setProfilesLoading(false);
      }
    };

    fetchProfiles();

    // Set up polling interval for real-time LeetCode updates every 15 seconds
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/leetcode/sanujtiwari1?nocache=true`);
        if (res.ok) {
          const data = await res.json();
          if (data && !data.error) {
            setLeetcodeData(data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch real-time LeetCode data:', err);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Helper: calculate SVG circle offset
  const calcOffset = (solved, total) => {
    const circumference = 2 * Math.PI * 45; // r=45
    if (!total || total === 0) return circumference;
    const progress = solved / total;
    return circumference - (progress * circumference);
  };


  return (
    <div className="app-container">
      {/* GLOWING AMBIENT BACKGROUND BLOBS */}
      <div className="glowing-blob blob-1"></div>
      <div className="glowing-blob blob-2"></div>
      <div className="glowing-blob blob-3"></div>

      {/* GLOBAL 3D PARTICLE BACKGROUND */}
      <ParticleField accentColor={accentColor} />
      {/* BACK TO TOP BUTTON */}
      <div
        className={`back-to-top ${showBackToTop ? 'show' : ''}`}
        id="backToTop"
        onClick={scrollToTop}
      >
        <i className="fas fa-arrow-up"></i>
      </div>

      {/* NAVBAR */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        
        {/* Left Side: Theme Palette */}
        <div className="nav-actions-left">
          <div className="theme-selector">
            <i className="fas fa-palette theme-icon-v3" title="Change Theme"></i>
            <div className="theme-dropdown-v3" style={{ left: 0, right: 'auto' }}>
              <button className="theme-btn-v3" onClick={() => setTheme('midnight')}>Midnight Blue</button>
              <button className="theme-btn-v3" onClick={() => setTheme('arctic')}>Arctic Blue</button>
              <button className="theme-btn-v3" onClick={() => setTheme('gold')}>Luxury Gold</button>
              <button className="theme-btn-v3" onClick={() => setTheme('emerald')}>Emerald Quest</button>
            </div>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <ul className="nav-links">
          <li><a href="#home" className={activeSection === 'home' ? 'active' : ''}>Home</a></li>
          <li><a href="#skills" className={activeSection === 'skills' ? 'active' : ''}>Skills</a></li>
          <li><a href="#projects" className={activeSection === 'projects' ? 'active' : ''}>Projects</a></li>
          <li><a href="#education" className={activeSection === 'education' ? 'active' : ''}>Education</a></li>
          <li><a href="#certificates" className={activeSection === 'certificates' ? 'active' : ''}>Certificates</a></li>
          <li><a href="#contact" className={activeSection === 'contact' ? 'active' : ''}>Contact</a></li>
          <li><a href="#resume" className={activeSection === 'resume' ? 'active' : ''}>Resume</a></li>
        </ul>

        {/* Right Side: Reserved for future actions */}
        <div className="nav-actions-right">
          {/* Light mode toggle removed */}
        </div>

      </nav>

      {/* HERO SECTION - v3 (Refined) */}
      <section id="home" className="hero-v3">
        <div className="hero-content-v3 reveal-left">
          <p className="hero-intro-v3">Hey, I'm Sanuj 👋</p>
          <h1 className="hero-title-v3">
            Full Stack <br />
            <span className="accent-text typing-container">
              <Typewriter
                options={{
                  strings: ['Programmer', 'Developer', 'Engineer'],
                  autoStart: true,
                  loop: true,
                  cursor: '|',
                  delay: 80,
                  deleteSpeed: 50,
                }}
              />
            </span>
          </h1>
          <p className="hero-bio-v3">
            I am a passionate full-stack developer committed to creating elegant, high-performance web applications and solving complex problems with modern technologies.
          </p>
          <div className="hero-buttons-v3">
            <a href="/Sanuj CV.pdf" download className="btn-primary-v3">Download Resume <i className="fas fa-arrow-down" style={{marginLeft: '8px'}}></i></a>
            <a href="#projects" className="btn-secondary-v3">View Projects</a>
          </div>

          <div className="hero-socials-v3">
            <a href="mailto:sanujvirat@gmail.com" title="Email"><i className="fas fa-envelope"></i></a>
            <a href="https://github.com/SanujTiwari" target="_blank" rel="noopener noreferrer" title="GitHub"><i className="fab fa-github"></i></a>
            <a href="https://leetcode.com/u/sanujtiwari1/" target="_blank" rel="noopener noreferrer" title="LeetCode"><i className="fas fa-code"></i></a>
            <a href="https://www.linkedin.com/in/sanuj-tiwari14/" target="_blank" rel="noopener noreferrer" title="LinkedIn"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>

        {/* 3D SCENE ON THE RIGHT SIDE */}
        <div className="hero-scene-wrapper reveal-right">
          <HeroScene accentColor={accentColor} />
        </div>
      </section>





      {/* ABOUT ME - v3 Structured */}
      <section id="about" className="about-v3 section-with-3d">
        <AboutBackground color={accentColor} />
        <div className="about-header-v3">
          <h2 className="reveal-left">About Me</h2>
          <p className="about-subtitle-v3 reveal-right">Building clean, fast, and user-friendly web applications.</p>
        </div>
        
        <div className="about-main-v3">
          {/* Profile Summary / Left Column */}
          <div className="about-content-v3 reveal-left">
            <div className="bio-card-v3">
              <p>
                I am a <strong>Full Stack Developer</strong> who enjoys building both the frontend and backend of web applications. Using the <strong>MERN stack</strong>, I create websites that look great and work smoothly.
              </p>
              <p>
                My goal is to write clean code and build practical software solutions that solve real problems.
              </p>

            </div>
            
            <div className="stats-grid-v3 reveal-stagger">
              <div className="stat-card-v3">
                <span className="stat-num-v3">{leetcodeData ? `${leetcodeData.totalSolved}+` : '140+'}</span>
                <span className="stat-label-v3">Problems Solved</span>
              </div>
              <div className="stat-card-v3">
                <span className="stat-num-v3">5+</span>
                <span className="stat-label-v3">Core Projects</span>
              </div>
              <div className="stat-card-v3">
                <span className="stat-num-v3">5★</span>
                <span className="stat-label-v3">HackerRank Java</span>
              </div>
            </div>
          </div>
          
          {/* Right Column / Highlights */}
          <div className="about-sidebar-v3 reveal-right">
            <div className="about-card-v3 highlight-card">
              <h3><i className="fas fa-microchip"></i> Core Strengths</h3>
              <ul>
                <li><strong>Backend:</strong> Building MERN & Spring Boot apps.</li>
                <li><strong>Testing:</strong> Automated testing with Selenium.</li>
                <li><strong>Logic:</strong> Solving algorithmic coding problems.</li>
                <li><strong>Features:</strong> Adding AI tools and integrations.</li>
              </ul>
            </div>
            
            <div className="about-card-v3 learning-card">
              <h3><i className="fas fa-compass"></i> Currently Learning</h3>

              <div className="learning-pills-v3">
                <span>Docker & K8s</span>
                <span>System Design</span>
                <span>AWS Advanced</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* TECHNICAL ARSENAL (Image 3) */}
      <section id="skills" className="skills-v2 section-with-3d">
        <SkillsBackground color={accentColor} />
        <div className="reveal-left">
          <h2>My Skills</h2>
          <p className="skills-subtitle-v2">Technologies I use to build applications.</p>

        </div>
        
        <div className="skills-grid-v2 reveal-stagger">
          <div className="skill-cat">
            <h3><i className="fas fa-code"></i> Languages</h3>
            <div className="skill-tags-v2">
              <span>Java</span><span>C++</span><span>PHP</span><span>JavaScript</span><span>HTML</span><span>CSS</span>
            </div>
          </div>
          <div className="skill-cat">
            <h3><i className="fas fa-layer-group"></i> Frameworks</h3>
            <div className="skill-tags-v2">
              <span>React</span><span>Next.js</span><span>Express.js</span><span>Spring Boot</span><span>FastAPI</span><span>Node.js</span>
            </div>
          </div>
          <div className="skill-cat">
            <h3><i className="fas fa-tools"></i> Tools/Platforms</h3>
            <div className="skill-tags-v2">
              <span>MySQL</span><span>AWS</span><span>Docker</span><span>Selenium</span><span>Jira</span><span>Git</span><span>GitHub</span><span>PostgreSQL</span>
            </div>
          </div>
          <div className="skill-cat">
            <h3><i className="fas fa-database"></i> Fundamentals</h3>
            <div className="skill-tags-v2">
              <span>Data Structures & Algorithms</span><span>Object-Oriented Programming</span><span>DBMS</span><span>Operating System</span><span>Computer Networks</span>
            </div>
          </div>
          <div className="skill-cat">
            <h3><i className="fas fa-users"></i> Soft Skills</h3>
            <div className="skill-tags-v2">
              <span>Leadership</span><span>Problem-Solving</span><span>Communication</span><span>Project Management</span><span>Adaptability</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS (Image 2) */}
      <section id="projects" className="projects-v2">
        <h2 className="reveal-left">Featured Projects</h2>
        <p className="projects-subtitle-v2 reveal" style={{ marginTop: '-45px', marginBottom: '40px' }}>Here are some of the main projects I've built recently.</p>

        
        <div className="projects-list-v2 reveal-stagger">
          {/* Project 1: Tooth Talk */}
          <div className="project-card-v2">
            <div className="project-header-v2">
              <h3>Tooth Talk – AI Dental Assistant</h3>
              <span className="project-date-v2">Since Jan 2026</span>
            </div>
            <p className="project-description-v2">
              Building a smart web application aimed at creating personalized dental assistance through AI-driven interactions.
            </p>
            <ul className="project-bullets-v2">
              <li>Built an AI dental assistant using modern web technologies.</li>
              <li>Added secure login, email alerts, and an AI voice feature.</li>
              <li>Created an admin dashboard to manage data and backend processes.</li>
            </ul>
            <div className="project-tech-tags-v2">
              <span>Next.js</span><span>TypeScript</span><span>PostgreSQL</span><span>AI Voice</span><span>OpenAI</span>
            </div>
            <a href="https://github.com/SanujTiwari" target="_blank" rel="noopener noreferrer" className="btn-source-code">
              <i className="fab fa-github"></i> Source Code
            </a>
          </div>

          {/* Project 2: Chatify */}
          <div className="project-card-v2">
            <div className="project-header-v2">
              <h3>Chatify – Real time chat application</h3>
              <span className="project-date-v2">May 2025</span>
            </div>
            <p className="project-description-v2">
              A real-time communication platform built with the MERN stack and Socket.IO for seamless messaging.
            </p>
            <ul className="project-bullets-v2">
              <li>Built a chat app with real-time messaging using Socket.IO.</li>
              <li>Added Google Login and email verification for security.</li>
              <li>Used the MERN stack to manage users and real-time data.</li>
            </ul>
            <div className="project-tech-tags-v2">
              <span>MERN Stack</span><span>Socket.IO</span><span>Google OAuth</span><span>JWT</span>
            </div>
            <a href="https://chatify-real-time-chat.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn-source-code">
              <i className="fas fa-external-link-alt"></i> Live Demo
            </a>
            <a href="https://github.com/SanujTiwari/ConvoHub" target="_blank" rel="noopener noreferrer" className="btn-source-code secondary" style={{ marginLeft: '10px' }}>
              <i className="fab fa-github"></i> Source Code
            </a>
          </div>

          {/* Project 3: Drop Basket */}
          <div className="project-card-v2">
            <div className="project-header-v2">
              <h3>Drop Basket – Grocery Delivery Website</h3>
              <span className="project-date-v2">Dec 2024</span>
            </div>
            <p className="project-description-v2">
              A grocery delivery website with online payments.
            </p>
            <ul className="project-bullets-v2">
              <li>Built a grocery delivery website with product browsing and order tracking.</li>
              <li>Added Stripe for secure online payments.</li>
              <li>Used Tailwind CSS for styling and Redux for managing app state.</li>
            </ul>
            <div className="project-tech-tags-v2">
              <span>MERN Stack</span><span>Tailwind CSS</span><span>Stripe</span><span>Redux</span>
            </div>
            <a href="https://drop-basket-groceries-delivery-webs.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn-source-code">
              <i className="fas fa-external-link-alt"></i> Live Demo
            </a>
            <a href="https://github.com/SanujTiwari/DropBasket" target="_blank" rel="noopener noreferrer" className="btn-source-code secondary" style={{ marginLeft: '10px' }}>
              <i className="fab fa-github"></i> Source Code
            </a>
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" className="education-v3">
        <h2 className="reveal-left">Education</h2>

        <div className="education-grid-v3 reveal-stagger">
          <div className="education-card-v2">
            <h3><i className="fas fa-graduation-cap"></i> Lovely Professional University</h3>
            <p className="edu-meta">Bachelor of Technology – Computer Science and Engineering | Since Aug 2023</p>
            
          </div>
          <div className="education-card-v2">
            <h3><i className="fas fa-school"></i> Annada College</h3>
            <p className="edu-meta">Intermediate – PCM | Apr 2021 – Mar 2023</p>
          </div>
        </div>
      </section>

      {/* CERTIFICATES */}
      <section id="certificates" className="certifications-v3">
        <h2 className="reveal-left">Certificates</h2>
        <div className="certifications-grid-v3 reveal-stagger">
          <div className="cert-card-v3">
            <div className="cert-icon-v3"><i className="fas fa-cloud"></i></div>
            <div className="cert-info-v3">
              <h4>Cloud Computing – NPTEL</h4>
              <p>Certified in April 2025</p>
            </div>
          </div>
          <div className="cert-card-v3">
            <div className="cert-icon-v3"><i className="fab fa-java"></i></div>
            <div className="cert-info-v3">
              <h4>Mastering Java Training</h4>
              <p>LPU Certificate | June 2025</p>
            </div>
          </div>
          <div className="cert-card-v3">
            <div className="cert-icon-v3"><i className="fas fa-trophy"></i></div>
            <div className="cert-info-v3">
              <h4>5-Star Java & Python</h4>
              <p>HackerRank Proficiency</p>
            </div>
          </div>
          <div className="cert-card-v3">
            <div className="cert-icon-v3"><i className="fas fa-code"></i></div>
            <div className="cert-info-v3">
              <h4>150+ DSA Problems</h4>
              <p>LeetCode & GFG Milestone</p>
            </div>
          </div>
        </div>
      </section>


      {/* CODING PROFILES - REAL-TIME */}
      <section id="extracurricular" className="profiles-v2">
        <div className="reveal-left">
          <h2>Coding Profiles</h2>
          <p className="profiles-subtitle-v2" style={{ marginTop: '-45px', marginBottom: '40px' }}>I solve coding challenges regularly to improve my logic and problem-solving skills.</p>
          {profilesLoading && <p className="profiles-loading-hint"><i className="fas fa-sync-alt fa-spin"></i> Fetching live stats...</p>}
        </div>
        
        <div className="profiles-grid-v2 reveal-stagger">
          {/* LeetCode Dashboard Card */}
          <div className="profile-card-v2 leetcode-dashboard">
            <div className="profile-header-v2">
              <h3><i className="fas fa-code"></i> LeetCode</h3>
              <a href="https://leetcode.com/u/sanujtiwari1/" target="_blank" rel="noopener noreferrer" className="btn-view-profile">View Profile</a>
            </div>
            
            <div className="leetcode-main">
              <div className="leetcode-progress-circle">
                <svg viewBox="0 0 100 100">
                  <circle className="circle-bg" cx="50" cy="50" r="45"></circle>
                  <circle
                    className="circle-progress"
                    cx="50" cy="50" r="45"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 45}`,
                      strokeDashoffset: leetcodeData
                        ? calcOffset(leetcodeData.totalSolved, leetcodeData.totalQuestions)
                        : 2 * Math.PI * 45,
                      transition: 'stroke-dashoffset 1.5s ease-out',
                    }}
                  ></circle>
                </svg>
                <div className="leetcode-stats-inner">
                  {profilesLoading ? (
                    <span className="solved-count skeleton-text">...</span>
                  ) : (
                    <>
                      <span className="solved-count">{leetcodeData?.totalSolved ?? '—'}</span>
                      <span className="solved-total">/{leetcodeData?.totalQuestions ?? '—'}</span>
                    </>
                  )}
                  <p><i className="fas fa-check"></i> Solved</p>
                </div>
              </div>
              
              <div className="leetcode-breakdown">
                <div className="breakdown-item easy">
                  <span className="label">Easy</span>
                  <div className="breakdown-bar">
                    <div className="breakdown-bar-fill easy-fill" style={{ width: leetcodeData ? `${(leetcodeData.easySolved / leetcodeData.totalEasy) * 100}%` : '0%' }}></div>
                  </div>
                  <span className="count">{profilesLoading ? '...' : `${leetcodeData?.easySolved ?? '—'}/${leetcodeData?.totalEasy ?? '—'}`}</span>
                </div>
                <div className="breakdown-item med">
                  <span className="label">Med.</span>
                  <div className="breakdown-bar">
                    <div className="breakdown-bar-fill med-fill" style={{ width: leetcodeData ? `${(leetcodeData.mediumSolved / leetcodeData.totalMedium) * 100}%` : '0%' }}></div>
                  </div>
                  <span className="count">{profilesLoading ? '...' : `${leetcodeData?.mediumSolved ?? '—'}/${leetcodeData?.totalMedium ?? '—'}`}</span>
                </div>
                <div className="breakdown-item hard">
                  <span className="label">Hard</span>
                  <div className="breakdown-bar">
                    <div className="breakdown-bar-fill hard-fill" style={{ width: leetcodeData ? `${(leetcodeData.hardSolved / leetcodeData.totalHard) * 100}%` : '0%' }}></div>
                  </div>
                  <span className="count">{profilesLoading ? '...' : `${leetcodeData?.hardSolved ?? '—'}/${leetcodeData?.totalHard ?? '—'}`}</span>
                </div>
              </div>
            </div>
          </div>

          {/* HackerRank */}
          <div className="profile-card-v2">
            <div className="profile-header-v2">
              <h3><i className="fab fa-hackerrank"></i> HackerRank</h3>
              <a href="https://www.hackerrank.com/profile/sanujvirat" target="_blank" rel="noopener noreferrer" className="btn-view-profile">View <i className="fas fa-external-link-alt"></i></a>
            </div>
            <p className="profile-desc-v2">Regular participant in algorithm and data structure tracks. Solving challenges to improve logic building.</p>
            <div className="profile-stats-v2">
              <div className="stat-badge">5-Star Java & Python</div>
            </div>
          </div>

          {/* GeeksforGeeks */}
          <div className="profile-card-v2">
            <div className="profile-header-v2">
              <h3><i className="fas fa-laptop-code"></i> GeeksForGeeks</h3>
              <a href="https://www.geeksforgeeks.org/profile/sanujva4bg" target="_blank" rel="noopener noreferrer" className="btn-view-profile">View <i className="fas fa-external-link-alt"></i></a>
            </div>
            <p className="profile-desc-v2">
              {gfgData ? (
                <>{gfgData.totalSolved > 0 ? `${gfgData.totalSolved} problems solved` : 'Practicing algorithms and data structures.'}{gfgData.score ? ` · Score: ${gfgData.score}` : ''}</>
              ) : (
                'Practicing algorithms and data structures.'
              )}
            </p>
            {gfgData && gfgData.totalSolved > 0 && (
              <div className="profile-stats-v2">
                <div className="stat-badge">{gfgData.totalSolved} Problems</div>
                {gfgData.score > 0 && <div className="stat-badge">Score: {gfgData.score}</div>}
              </div>
            )}
          </div>

          {/* CodeChef */}
          <div className="profile-card-v2">
            <div className="profile-header-v2">
              <h3><i className="fas fa-terminal"></i> CodeChef</h3>
              <a href="https://www.codechef.com/users/brisk_fame_71" target="_blank" rel="noopener noreferrer" className="btn-view-profile">View <i className="fas fa-external-link-alt"></i></a>
            </div>
            <p className="profile-desc-v2">
              {codechefData ? (
                <>Participating in coding contests.{codechefData.rating ? ` Rating: ${codechefData.rating}` : ''}</>
              ) : (
                'Participating in coding contests.'
              )}
            </p>
            {codechefData && (codechefData.rating || codechefData.totalSolved) && (
              <div className="profile-stats-v2">
                {codechefData.rating && <div className="stat-badge">Rating: {codechefData.rating}</div>}
                {codechefData.stars && <div className="stat-badge">{codechefData.stars}★</div>}
                {codechefData.totalSolved && <div className="stat-badge">{codechefData.totalSolved} Solved</div>}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact">
        <h2 className="reveal">Contact Me</h2>
        <p className="contact-subtitle reveal">Feel free to reach out for a project or just to say hi.</p>
        
        <div className="contact-wrapper reveal">
            <form id="contact-form" className="reveal" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <button type="submit" className="primary-btn">Send Message</button>
          </form>
        </div>
      </section>

      {/* RESUME DOWNLOAD CTA */}
      <section id="resume" className="resume-cta">
        <div className="cta-content">
          <h3>Want to know more?</h3>
          <p>Click here to download my resume.</p>
          <a href="/Sanuj CV.pdf" download className="secondary-btn">Download Resume (PDF)</a>
        </div>
      </section>

      <footer className="footer-v2">
        <p>© 2026 Sanuj Tiwari. Built with ❤️</p>

        <div className="footer-links">
          <a href="https://github.com/SanujTiwari" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
          <a href="https://www.linkedin.com/in/sanuj-tiwari14/" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
          <a href="mailto:sanujvirat@gmail.com"><i className="fas fa-envelope"></i></a>
        </div>
      </footer>
    </div>
  );
}

export default App;
