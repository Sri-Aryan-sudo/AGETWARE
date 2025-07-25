// src/pages/Home.js
import React, { useState, useEffect } from "react";

const carouselItems = [
  {
    icon: (
      <svg width="80" height="80" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="18" width="36" height="18" rx="4" fill="#ffd700" stroke="#2d3e50" strokeWidth="2"/>
        <rect x="14" y="10" width="20" height="8" rx="3" fill="#fff" stroke="#2d3e50" strokeWidth="2"/>
        <circle cx="24" cy="27" r="4" fill="#2d3e50" />
      </svg>
    ),
    caption: "Empowering Your Financial Future"
  },
  {
    icon: (
      <svg width="80" height="80" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="14" width="36" height="20" rx="4" fill="#ffd700" stroke="#2d3e50" strokeWidth="2"/>
        <rect x="10" y="22" width="8" height="4" rx="1" fill="#fff" />
        <rect x="30" y="22" width="8" height="4" rx="1" fill="#fff" />
        <rect x="14" y="18" width="20" height="2" rx="1" fill="#2d3e50" />
      </svg>
    ),
    caption: "Simple, Transparent Lending Solutions"
  },
  {
    icon: (
      <svg width="80" height="80" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="18" r="8" fill="#ffd700" stroke="#2d3e50" strokeWidth="2"/>
        <rect x="10" y="30" width="28" height="10" rx="5" fill="#fff" stroke="#2d3e50" strokeWidth="2"/>
      </svg>
    ),
    caption: "Your Dreams, Our Support"
  }
];

export default function Home() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselItems.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container" style={{ textAlign: "center" }}>
      <h1 style={{ fontSize: "2.3em", marginBottom: "0.5em" }}>Welcome to Agetware Bank</h1>
      <p style={{ fontSize: "1.18em", color: "#3e5370", marginBottom: "2.2em", lineHeight: 1.7 }}>
        At <span style={{ color: "#ffd700", fontWeight: 700 }}>Agetware Bank</span>, we believe in making finance simple, accessible, and empowering for everyone.<br/>
        Whether you're looking to fund your dreams, grow your business, or manage your finances, our innovative lending solutions and customer-first approach are here to help you succeed.<br/>
        Experience banking that's modern, transparent, and built for you.
      </p>
      <div className="carousel" style={{ background: 'none', boxShadow: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 220, justifyContent: 'center' }}>
          {carouselItems[current].icon}
          <div className="carousel-caption" style={{ background: 'none', color: '#2d3e50', fontWeight: 700, fontSize: '1.15em', marginTop: 16, position: 'static', padding: 0 }}>
            {carouselItems[current].caption}
          </div>
        </div>
        <div className="carousel-dots">
          {carouselItems.map((_, idx) => (
            <span
              key={idx}
              className={"carousel-dot" + (idx === current ? " active" : "")}
            />
          ))}
        </div>
      </div>
      <div style={{ fontSize: "1.08em", color: "#2d3e50", marginTop: "1.5em", lineHeight: 1.7 }}>
        <strong>Why Choose Us?</strong>
        <ul style={{ margin: "1.2em auto 0 auto", maxWidth: 420, textAlign: "left", color: "#3e5370", fontSize: "1em", lineHeight: 1.7 }}>
          <li>✔️ Fast, paperless loan approvals</li>
          <li>✔️ Competitive interest rates</li>
          <li>✔️ Secure and transparent processes</li>
          <li>✔️ 24/7 customer support</li>
          <li>✔️ Trusted by thousands of happy customers</li>
        </ul>
      </div>
    </div>
  );
}