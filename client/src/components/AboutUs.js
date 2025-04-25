import React, { useEffect, useRef, useState } from "react";

function AboutUs() {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about" id="aboutus">
      <div className="about-bg"></div>
      <div
        ref={containerRef}
        className={`about-container ${isVisible ? "appear" : ""}`}
      >
        <h2 className="about-heading">About Us</h2>
        <p className="about-text">
          Welcome to JobNest, your all-in-one job management and career growth assistant. We’re here to simplify your job search, help you stay organized, and make sure your application stands out.
          Whether you're a recent graduate or a seasoned professional, JobNest is built to support every step of your career path.
        </p>
        <p className="about-text">
          Our goal is to become the go-to career companion for job seekers worldwide—empowering individuals to take charge of their professional journeys with clarity, confidence, and effective tools. We aim to simplify the job search process through intelligent job discovery with smart filters and personalized recommendations, an automatic application tracker to monitor interview progress, and AI-powered resume enhancement tips tailored to specific job descriptions.
        </p>
        <p className="about-center">
          We’re not just another job board—we're your personal career assistant.
        </p>
      </div>
    </div>
  );
}

export default AboutUs;