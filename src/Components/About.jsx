import styles from "./About.module.css";
function About() {
  return (
    <section className={styles.container} id="about">
      <h2>About Us</h2>
      <div className={styles.about}>
        <div className={styles.left}>
          <img src="/face1.jpeg" alt="CEO Image"></img>
          <h3>Hon. Jayeola Toriola (EFA)</h3>
        </div>
        <div className={styles.right}>
          <p>
            J.ola Toriola Real Estate Agency is a registered property firm in
            Nigeria (CRBN 332307), established in 2014. With over a decade of
            experience serving more than a hundred satisfied clients and
            completing numerous successful transactions, we have built a solid
            reputation for delivering trusted, transparent, and client-focused
            real estate services. While we primarily operate in Lagos State, our
            expertise extends nationwide to serve clients across Nigeria.
          </p>
          <p>
            Led by Hon. Jayeola Toriola, a two-time Chairman of Estate Rent And
            Commision Agents Association of Nigeria (ERCAAN) Mainland Zone,
            Lagos .Our firm is built on a foundation of professionalism,
            industry leadership, and a commitment to ethical real estate
            practice in Nigeria.
          </p>
          <p>
            Our team offers comprehensive expertise across all property types —
            including residential, commercial, industrial, and mixed-use
            developments. From land acquisition and property development to
            investment advisory and property management, we serve private
            individuals, investors, developers, and institutions with tailored
            real estate solutions that meet both immediate needs and long-term
            goals.
          </p>
          <p>
            While we do not provide financing, we offer dedicated legal advisory
            services to support safe, compliant, and well-documented real estate
            transactions — helping clients navigate land titles, ownership,
            zoning regulations, and contract agreements with confidence.
          </p>
          <p>
            At J.ola Real Estate, we are driven by core values of integrity,
            innovation, and excellence. Our mission is to make real estate
            accessible, secure, and rewarding for every client we serve. Whether
            you're buying your first plot, expanding your investment portfolio,
            or developing large-scale projects, we are here to guide you every
            step of the way.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
