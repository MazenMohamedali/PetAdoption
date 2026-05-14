import React, { useState } from "react";
import "./RatePage.css";

export default function RatePage() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const maxChars = 200;

  return (
    <div className="rate-page">

      <div className="rate-box glass-card">

        <h2 className="title center">Rate Your Squad Leader</h2>
        <p className="subtitle center">
          Help us maintain a positive community by sharing your experience.
        </p>

        <div className="profile">
          <img
            src="https://i.pravatar.cc/100?img=12"
            alt="profile"
            className="avatar"
          />
          <div>
            <h3 className="username">ViperStrike</h3>
            <p className="game">Played Valorant</p>
            <p className="details">
              “Looking for 2 more for Ranked Competitive, Gold+ players”
            </p>
          </div>
        </div>

        <h3 className="question center">How was your experience?</h3>

        <div className="stars center">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={(hover || rating) >= star ? "star filled" : "star"}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </span>
          ))}
        </div>

        <p className="feedback-label">
          Optional Feedback <span>({maxChars - text.length} left)</span>
        </p>

        <textarea
          className="feedback-input"
          placeholder="Tell us about your experience..."
          maxLength={maxChars}
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <button className="glow-btn">Submit Rating</button>
      </div>

    </div>
  );
}
