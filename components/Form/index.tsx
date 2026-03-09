import { ArrowUpRight } from "lucide-react";
import "./index.css";
import exportIcon from "@public/assets/export-icon.png";
import Image from "next/image";

const Form = () => {
  return (
    <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
      <div className="form-row">
        <div className="form-group">
          <input
            type="text"
            id="name"
            placeholder="Name"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            id="email"
            placeholder="Email Address"
            className="form-input"
          />
        </div>
      </div>
      <div className="form-group">
        <textarea
          id="message"
          placeholder="Message"
          className="form-textarea"
          rows={1}
        ></textarea>
      </div>
      <button type="submit" className="submit-button">
        SEND MESSAGE
        <Image src={exportIcon} alt="Export Icon" />
      </button>
    </form>
  );
};

export default Form;
