import styles from "./Services.module.css";
const services = [
  {
    name: "Property Sales/Purchase",
    description:
      "With years of experience in identifying properties with strong growth potential, we specialise in acquiring real estate at the right price — before value surges. Whether you're looking to buy, sell, or evaluate a property, our team provides expert guidance, market insights, and end-to-end support to ensure every transaction is a smart one.",
    image: "property-sale.jpg",
  },
  {
    name: "Real Estate Consulting",
    description:
      "Our consultancy service is designed to provide you with expert guidance at every stage of your real estate journey. Whether you're buying, selling, investing, or developing property, we offer tailored advice based on in-depth market knowledge and years of experience. We help you make informed decisions, avoid costly mistakes, and maximise the value of your investment",
    image: "consultancy.jpg",
  },
  {
    name: "Property Development",
    description:
      "We understand how challenging it can be to determine the right type of development for a particular property. With our extensive experience, we offer tailored advice specific to each location and work alongside you to ensure the development aligns with your vision and goals. Whether it's planning, layout, property development, or renovation, we're here to guide and support you every step of the way.",
    image: "development.jpg",
  },
  {
    name: "Property Management",
    description:
      "Our Property Management service takes the stress out of owning property. Whether you're away or simply prefer not to deal with the day-to-day responsibilities, we handle everything — from tenant communication and rent collection to maintenance and inspections — so you can enjoy the benefits of ownership without the hassle.",
    image: "management.jpg",
  },
  {
    name: "Land Survey",
    description:
      "Our land surveying service ensures you get accurate, legally-recognized property measurements that are essential for buying, developing, or resolving property disputes. Our licensed surveyors use modern equipment to handle everything from boundary surveys and topographic mapping to construction layout and subdivision planning. We also help with title verification and cadastral surveys, making it easier for you to define property lines, meet zoning requirements, prepare construction sites, and obtain important legal documents like your Certificate of Occupancy (C of O).",
    image: "survey.jpg",
  },
  {
    name: "Lease Agreement & Documentation",
    description:
      "Lease agreements can be complex and overwhelming to navigate. At J.ola Real Estate, we simplify this process by providing expert lease negotiation and documentation services that protect your interests. Our experienced team carefully reviews, drafts, and negotiates lease terms to ensure they are clear, fair, and compliant with local regulations. From rent structures and maintenance responsibilities to renewal options and dispute resolution, we handle every detail to help you avoid costly misunderstandings and legal complications down the road.",
    image: "lease.jpg",
  },
];

function Services() {
  return (
    <section section id="services-head" className={styles.serviceHead}>
      <h2 className={styles.subheading}>
        Our <span>Services</span>
      </h2>
      {/* <h6 className={styles.subheading}>
        we offer a range of services to meet your needs.
      </h6> */}

      <div className={styles.services}>
        {services.map((service, index) => (
          <div key={service.name} className={styles.serviceContent}>
            <img src={service.image} alt={service.name} loading="lazy" />
            <h2 key={index}>{service.name}</h2>
            <p>{service.description}</p>
            <a href="https://wa.me/2348023388329">
              <button>Contact US</button>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;
