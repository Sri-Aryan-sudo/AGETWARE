// src/pages/Home.js
import React, { useState, useEffect } from "react";

const carouselItems = [
  {
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    caption: "Empowering Your Financial Future"
  },
  {
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    caption: "Simple, Transparent Lending Solutions"
  },
  {
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
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
      <div className="carousel">
        <img
          src={carouselItems[current].img}
          alt={carouselItems[current].caption}
          className="carousel-img"
        />
        <div className="carousel-caption">
          {carouselItems[current].caption}
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