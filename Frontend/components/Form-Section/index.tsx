"use client";

import messageIcon from "@public/assets/message-notif.png";
import Image from "next/image";
import Form from "../Form";
import "./index.css";

const FormSection = () => {
  return (
    <div className="form-section">
      <div className="form-section-text">
        <h2>
          <Image src={messageIcon} alt="Message Icon" className="w-5 h-5" />
          GET IN TOUCH
        </h2>

        <h1>
          Always looking for meaningful problems, fun teams, and ideas worth
          building.
        </h1>
        <p>If this sounds like you, let’s connect.</p>
      </div>

      <div className="form-section-form">
        <Form />
      </div>
    </div>
  );
};

export default FormSection;
