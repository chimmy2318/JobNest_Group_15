import React, { useState } from "react";
import "../styles/faq.css";
import faq from "../Images/faq.png";

const data = [
  {
    question: "Can I only track job applications that I applied for through JobNest?",
    answer:
    "No, you are not limited to tracking only those jobs applied via JobNest. Our Application Tracker allows you to manually add any job application — even those you applied to externally."  },
  {
    question: "Is enabling email parsing secure?",
    answer:
    "Yes, email parsing on JobNest is completely secure and privacy-conscious. When you enable email parsing, our system accesses your inbox in a read-only mode."  },
  {
    question: "There are personal details on my resume. Is my data safe when I upload it?",
    answer:
    "Absolutely. Your privacy and data security are our top priority. When you upload your resume for optimization, it is processed securely by our AI model and never stored permanently"  },
  {
    question: "What does the Resume Optimiser do exactly?",
    answer:
    "Our AI-powered Resume Optimiser analyzes your resume for ATS (Applicant Tracking System) compatibility, readability, keyword alignment, and formatting."  },
  {
    question: "What happens when I click “Apply Now” on a job post?",
    answer: ["Clicking Apply Now redirects you to the external job posting page to complete the application. Once you return, a popup on JobNest asks:",
    "1.	Did you apply?",
    "2.	If yes, please enter the Company Name and Role.",
    "Once you fill this out, you’re redirected to the Track Applications page to record and manage your application status from there."]
      }
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="page-wrapper" id="faqs">
      {/* FAQ Section */}
      
      <div className="faq-section">
        {/* Heading aligned to the left and above */}
        <h1 className="faq-heading">FAQs</h1>

        {/* Content layout (Image + Questions) */}
        <div className="faq-layout">
          
        <div className="faq-image">
          <img src={faq} alt="faq" className="faq-image" />
          </div>
          <div className="faq-content">
            {data.map((item, idx) => (
              <div key={idx}>
                <div
                  className="faq-item"
                  onClick={() => setOpenIndex(idx === openIndex ? null : idx)}
                >
                  <span className="faq-question">{item.question}</span>
                  <span className="faq-icon">{openIndex === idx ? "-" : "+"}</span>
                </div>
                {openIndex === idx && (
  <div className="faq-answer">
    {Array.isArray(item.answer) ? (
      item.answer.map((point, index) => (
        <p key={index} className="faq-point">{point}</p>
      ))
    ) : (
      <p>{item.answer}</p>
    )}
  </div>
)}
              </div>
            ))}
          </div>
        </div>
      </div>
          
    </div>
  );
}

export default FAQ;
