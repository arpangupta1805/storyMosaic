import React, { useEffect, useState } from 'react';
import './about.css';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true);
  }, []);

  return (
    <>
      <div className="about-page">
        <div className="about-container">
          <div className="about-header" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 1s ease-in-out' }}>
            <h1 className="about-title">About Story Mosaic</h1>
            <p className="about-subtitle">
              A collaborative platform where creativity flourishes and stories come to life
            </p>
          </div>

          <div className="about-content">
            <div className="about-section">
              <h2 className="section-title">Our Mission</h2>
              <p className="about-paragraph">
                Story Mosaic is a story-writing platform for creatives around the world. Using Story Mosaic, you can share your stories, work on other people's ideas, and collaborate with writers anywhere. Our mission is to create a space where storytellers can connect, create, and inspire each other.
              </p>
              <p className="about-paragraph">
                You can create theories and sub-plots about existing stories. You can also create your own stories and get people to write alongside you. Who knows, you may create the next <span className="highlight">Marvel</span>, or God forbid, <span className="highlight">DC</span>.
              </p>
            </div>

            <div className="about-section">
              <h2 className="section-title">What We Offer</h2>
              <p className="about-paragraph">
                Story Mosaic's clean design makes it frictionless for you to write more, and the robust performance of the site makes sure that your updates happen fast, and without hiccups. We've built a platform that puts the focus on what matters most—your stories.
              </p>
              
              <div className="feature-list">
                <div className="feature-item">
                  <div className="feature-icon">✍️</div>
                  <p className="feature-text">
                    <strong>Intuitive Editor</strong> - A distraction-free writing environment that helps you focus on your creativity.
                  </p>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">🔄</div>
                  <p className="feature-text">
                    <strong>Collaboration Tools</strong> - Invite editors, suggest changes, and work together seamlessly.
                  </p>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">📚</div>
                  <p className="feature-text">
                    <strong>Fan Fiction</strong> - Create and explore stories inspired by your favorite universes.
                  </p>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">❤️</div>
                  <p className="feature-text">
                    <strong>Community</strong> - Connect with other writers, share feedback, and grow together.
                  </p>
                </div>
              </div>
            </div>

            <div className="about-section">
              <h2 className="section-title">Our Values</h2>
              <p className="about-paragraph">
                Story Mosaic is made for writers who are passionate about the craft. Every piece written on Story Mosaic is licensed with MIT Open Source License, and a community good will badge. We believe in the power of open collaboration and shared creativity.
              </p>
              <p className="about-paragraph">
                We don't collect any personal data from the user, and we are committed to providing an open-source tool to motivate writing everywhere. Your privacy and creative freedom are our top priorities.
              </p>
            </div>
          </div>

          <div className="team-section">
            <h2 className="team-title">Our Team</h2>
            <p className="team-description">
              Story Mosaic was created by a passionate team of developers and writers who believe in the power of storytelling to connect people and change the world.
            </p>
            <div className="team-logo">
              Made by Notepad Coders from IIT Gandhinagar
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
