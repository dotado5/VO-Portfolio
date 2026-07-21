"use client";

import messageIcon from "@public/assets/message-notif.png";
import Image from "next/image";
import Form from "../Form";
import "./index.css";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/utils/motion";

const FormSection = () => {
  return (
    <motion.div
      className="form-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={staggerContainer}
    >
      <motion.div className="form-section-text" variants={fadeInUp}>
        <h2>
          <Image src={messageIcon} alt="Message Icon" className="w-5 h-5" />
          GET IN TOUCH
        </h2>

        <h1>
          Always looking for meaningful problems, fun teams, and ideas worth
          building.
        </h1>
        <p>If this sounds like you, let’s connect.</p>
      </motion.div>

      <motion.div className="form-section-form" variants={fadeInUp}>
        <Form />
      </motion.div>
    </motion.div>
  );
};

export default FormSection;
