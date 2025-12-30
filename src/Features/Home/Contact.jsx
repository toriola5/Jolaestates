import Style from "./Contact.module.css";
import Map from "./Map";

function Contact() {
  return (
    <section className={Style.contact} id="contact">
      <div className={Style.contactMap}>
        <h2>Find Us</h2>
        <div className={Style.mapShell}>
          <Map />
        </div>
      </div>
      <div className={Style.contact2}>
        <h1>
          J.OLA TORIOLA <br />
          REAL ESTATE <br />
          AGENCY
        </h1>
        <h2>Adress</h2>
        <p>
          41, COMMERCIAL AVENUE <br />
          SABO YABA LAGOS
        </p>
      </div>
      <div className={Style.contact3}>
        <h2>Contacts</h2>
        <p>+2348023388329</p>
        <p>+2347064570479</p>

        <h2>Email</h2>
        <p>jolatoriolaestate4u@gmail.com</p>
      </div>
      <div className={Style.contact4}>
        <h2>Socials</h2>

        <p>
          <a
            href="https://www.instagram.com/jayeolatoriola/"
            className={Style.contactlink}
          >
            <img src="/instagram.svg" alt="instagram Logo" />
            Instagram
          </a>
        </p>

        <p>
          <a
            href="https://www.facebook.com/J.olatoriola/?locale=en_GB"
            className={Style.contactlink}
          >
            <img src="/facebook.svg" alt="facebook logo" />
            Facebook
          </a>
        </p>

        <p>
          <a
            href="https://www.tiktok.com/@jayeolatoriola?lang=en"
            className={Style.contactlink}
          >
            <img src="/tiktok.svg" alt="tiktok logo" /> Tiktok
          </a>
        </p>

        <p>
          <a className={Style.contactlink} href="https://x.com/jayetori">
            <img src="/twitter-x.svg" alt="X logo" /> X
          </a>
        </p>
      </div>
    </section>
  );
}

export default Contact;

//  <div class="contact" id="contact">
//       <div class="contact-map">
//         <h2>Find Us</h2>
//         <div class="map-shell" data-map-loaded="false">
//           <iframe
//             data-src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.1251100889585!2d3.3769655752301753!3d6.50584319348647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8cf582e584eb%3A0x9094912e97da1c09!2s41%20Commercial%20Ave%2C%20Sabo%20yaba%2C%20Lagos%20101245%2C%20Lagos%2C%20Nigeria!5e0!3m2!1sen!2suk!4v1763354431055!5m2!1sen!2suk"
//             width="90%"
//             height="250"
//             style="border: 0; border-radius: 0.5rem"
//             allowfullscreen=""
//             loading="lazy"
//             referrerpolicy="no-referrer-when-downgrade"
//           >
//           </iframe>
//           <button class="map-load-btn">Load Map</button>
//         </div>
//       </div>
//       <!-- <div class="contact1">
//         <h1>
//           J.OLA TOIRIOLA <br />
//           REAL ESTATE <br />AGENCY
//         </h1>
//       </div> -->
//       <div class="contact2">
//         <h1>
//           J.OLA TORIOLA <br />
//           REAL ESTATE <br />AGENCY
//         </h1>
//         <h2>Adress</h2>
//         <p>41, COMMERCIAL AVENUE <br />SABO YABA LAGOS</p>
//       </div>
//       <div class="contact3">
//         <h2>Contacts</h2>
//         <p>+2348023388329</p>
//         <p>+2347064570479</p>

//         <h2>Email</h2>
//         <p>jolatoriolaestate4u@gmail.com</p>
//       </div>
//       <div class="contact4">
//         <h2>Socials</h2>

//         <p>
//           <a
//             href="https://www.instagram.com/jayeolatoriola/"
//             class="contactlink"
//           >
//             <img src="./assets/images/instagram.svg" alt="instagram Logo" />
//             Instagram</a
//           >
//         </p>

//         <p>
//           <a
//             href="https://www.facebook.com/J.olatoriola/?locale=en_GB"
//             class="contactlink"
//           >
//             <img src="./assets/images/facebook.svg" alt="facebook logo" />
//             Facebook</a
//           >
//         </p>

//         <p>
//           <a
//             href="https://www.tiktok.com/@jayeolatoriola?lang=en"
//             class="contactlink"
//             ><img src="./assets/images/tiktok.svg" alt="tiktok logo" /> Tiktok
//           </a>
//         </p>

//         <p>
//           <a class="contactlink" href="https://x.com/jayetori">
//             <img src="./assets/images/twitter-x.svg" alt="X logo" /> X
//           </a>
//         </p>
//       </div>
//     </div>
