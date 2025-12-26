import { useState, useCallback, memo } from "react";
import styles from "./Faqs.module.css";

// Move static data outside component to avoid recreation
const faqData = [
  {
    id: 1,
    question: "What services does Jola Real Estates Agency offer?",
    answer:
      "Jola Real Estates Agency provides comprehensive real estate services including property sales, rentals, property management, and real estate consulting to help you find your perfect home or investment property.",
  },
  {
    id: 2,
    question: "How do I schedule a property viewing?",
    answer:
      "You can schedule a property viewing by contacting us through our website, calling our office directly, or sending us an email. Our team will arrange a convenient time for you to view the property.",
  },
  {
    id: 3,
    question: "What areas do you cover?",
    answer:
      "We specialize in properties across major metropolitan areas and surrounding regions. Contact us to learn more about specific locations and available properties in your area of interest.",
  },
  {
    id: 4,
    question: "Do you offer property management services?",
    answer:
      "Yes, we offer full-service property management including tenant screening, rent collection, maintenance coordination, and regular property inspections to ensure your investment is well-maintained.",
  },
  {
    id: 5,
    question: "What is the buying process?",
    answer:
      "Our buying process includes initial consultation, property search, viewings, offer negotiation, legal documentation, and final closing. We guide you through every step to ensure a smooth transaction.",
  },
];

// Memoize individual FAQ item to prevent unnecessary re-renders
const FaqItem = memo(function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className={styles.faqItem}>
      <button className={styles.faqQuestion} onClick={onToggle}>
        <span>{faq.question}</span>
        <span className={`${styles.icon} ${isOpen ? styles.iconOpen : ""}`}>
          +
        </span>
      </button>
      <div
        className={`${styles.faqAnswer} ${isOpen ? styles.faqAnswerOpen : ""}`}
      >
        <p>{faq.answer}</p>
      </div>
    </div>
  );
});

function Faqs() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = useCallback(
    (index) => {
      setOpenIndex((prev) => (prev === index ? null : index));
    },
    [setOpenIndex]
  );

  return (
    <div className={styles.faqsContainer} id="faqs">
      <div className={styles.faqsContent}>
        <h2 className={styles.title}>Frequently Asked Questions</h2>
        <div className={styles.faqsList}>
          {faqData.map((faq, index) => (
            <FaqItem
              key={faq.id}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => toggleFaq(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Faqs;
