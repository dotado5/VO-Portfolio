"use client";

import "./index.css";
import exportIcon from "@public/assets/export-icon.png";
import Image from "next/image";
import { useState } from "react";
import { contactService } from "@/services/contact.service";

type Status = "idle" | "sending" | "success" | "error";

const Form = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setFeedback("");

    try {
      await contactService.sendMessage({ name, email, message });
      setStatus("success");
      setFeedback("Thanks! Your message has been sent.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error: any) {
      setStatus("error");
      setFeedback(
        error?.response?.data?.error ||
          "Something went wrong. Please try again later."
      );
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <input
            type="text"
            id="name"
            placeholder="Name"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            id="email"
            placeholder="Email Address"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="form-group">
        <textarea
          id="message"
          placeholder="Message"
          className="form-textarea"
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="submit-button"
        disabled={status === "sending"}
      >
        {status === "sending" ? "SENDING..." : "SEND MESSAGE"}
        <Image src={exportIcon} alt="Export Icon" />
      </button>
      {feedback && (
        <p
          className={`form-feedback ${
            status === "error" ? "is-error" : "is-success"
          }`}
        >
          {feedback}
        </p>
      )}
    </form>
  );
};

export default Form;
