import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './landingpage.css';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true);
  }, []);

  return (
    <>
      <div className="landing-page">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        
        <div className="landing-container">
          {/* Hero Section */}
          <div className="hero-section" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 1s ease-in-out' }}>
            <h1 className="hero-title">
              Where Stories <span style={{ color: '#3182ce' }}>Come Alive</span>
            </h1>
            <p className="hero-subtitle">
              Join a vibrant community of storytellers, editors, and readers. Create, collaborate, and discover stories that matter. 
              StoryMosaic is the platform where creativity knows no bounds.
            </p>
            <div className="hero-buttons">
              <Link to="/popular" className="primary-button">
                Explore Stories
              </Link>
              <Link to="/authentication" className="secondary-button">
                Start Writing
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="features-section">
            <div className="feature-card" style={{ animationDelay: '0.2s' }}>
              <div className="feature-icon">✍️</div>
              <h3 className="feature-title">For Writers</h3>
              <p className="feature-description">
                Craft your stories with powerful tools designed for creativity. Our clean, distraction-free editor helps you focus on what matters most—your words. Save drafts, publish when ready, and build your audience.
              </p>
            </div>

            <div className="feature-card" style={{ animationDelay: '0.4s' }}>
              <div className="feature-icon">👥</div>
              <h3 className="feature-title">For Editors</h3>
              <p className="feature-description">
                Shape the next bestseller by collaborating with talented writers. Suggest edits, provide feedback, and help polish stories to perfection. Our pull request system makes collaboration seamless.
              </p>
            </div>

            <div className="feature-card" style={{ animationDelay: '0.6s' }}>
              <div className="feature-icon">📖</div>
              <h3 className="feature-title">For Readers</h3>
              <p className="feature-description">
                Discover unique voices and stories from around the world. Follow your favorite authors, like stories that move you, and join a community that celebrates the written word in all its forms.
              </p>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="testimonials-section">
            <h2 className="section-title">How It Works</h2>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <p className="testimonial-text">
                  Create an account and start writing your story. Our intuitive editor makes it easy to organize your thoughts and bring your ideas to life.
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">1</div>
                  <div>
                    <div className="author-name">Create</div>
                    <div className="author-title">Begin your storytelling journey</div>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <p className="testimonial-text">
                  Invite editors to collaborate on your story, or contribute to others' works. Our pull request system makes collaboration seamless and efficient.
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">2</div>
                  <div>
                    <div className="author-name">Collaborate</div>
                    <div className="author-title">Work together to perfect your story</div>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <p className="testimonial-text">
                  Publish your story to share it with the world. Readers can discover your work, provide feedback, and even create fan fiction based on your universe.
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">3</div>
                  <div>
                    <div className="author-name">Share</div>
                    <div className="author-title">Let your story reach the world</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="cta-section">
            <h2 className="cta-title">Ready to Start Your Story?</h2>
            <p className="cta-description">
              Join thousands of writers who have found their voice on StoryMosaic. It's free, easy to use, and full of possibilities.
            </p>
            <Link to="/authentication" className="cta-button">
              Sign Up Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
