import { useState } from "react";
import styles from "./Faqs.module.css";

function Faqs() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "What services does Jola Real Estates Agency offer?",
      answer:
        "Jola Real Estates Agency provides comprehensive real estate services including property sales, rentals, property management, and real estate consulting to help you find your perfect home or investment property.",
    },
    {
      question: "How do I schedule a property viewing?",
      answer:
        "You can schedule a property viewing by contacting us through our website, calling our office directly, or sending us an email. Our team will arrange a convenient time for you to view the property.",
    },
    {
      question: "What areas do you cover?",
      answer:
        "We specialize in properties across major metropolitan areas and surrounding regions. Contact us to learn more about specific locations and available properties in your area of interest.",
    },
    {
      question: "Do you offer property management services?",
      answer:
        "Yes, we offer full-service property management including tenant screening, rent collection, maintenance coordination, and regular property inspections to ensure your investment is well-maintained.",
    },
    {
      question: "What is the buying process?",
      answer:
        "Our buying process includes initial consultation, property search, viewings, offer negotiation, legal documentation, and final closing. We guide you through every step to ensure a smooth transaction.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.faqsContainer} id="faqs">
      <div className={styles.faqsContent}>
        <h2 className={styles.title}>Frequently Asked Questions</h2>
        <div className={styles.faqsList}>
          {faqData.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <button
                className={styles.faqQuestion}
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.question}</span>
                <span
                  className={`${styles.icon} ${
                    openIndex === index ? styles.iconOpen : ""
                  }`}
                >
                  +
                </span>
              </button>
              <div
                className={`${styles.faqAnswer} ${
                  openIndex === index ? styles.faqAnswerOpen : ""
                }`}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Faqs;
