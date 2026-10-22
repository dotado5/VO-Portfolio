"use client";

import messageIcon from "@public/assets/message-notif.png";
import Image from "next/image";
import Form from "../Form";
import "./index.css";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer, defaultViewport } from "@/utils/motion";

const FormSection = () => {
  return (
    <motion.div
      id="contact"
      className="form-section"
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={staggerContainer}
    >
      <motion.div className="form-section-text" variants={fadeInUp}>
        <h2>
          <Image src={messageIcon} alt="" aria-hidden="true" className="w-5 h-5" />
          GET IN TOUCH
        </h2>

        <h1>
          Always looking for meaningful problems, fun teams, and ideas worth
          building.
        </h1>
        <p>
          If this sounds like you, let’s connect. You can also email me directly at{" "}
          <a
            href="mailto:fatokivictor2@gmail.com"
            className="text-black font-semibold underline underline-offset-4 hover:text-[#525252] transition-colors"
          >
            fatokivictor2@gmail.com
          </a>
          .
        </p>
      </motion.div>

      <motion.div className="form-section-form" variants={fadeInUp}>
        <Form />
      </motion.div>
    </motion.div>
  );
};

export default FormSection;
