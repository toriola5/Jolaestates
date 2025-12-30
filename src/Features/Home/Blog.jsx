import styles from "./Blog.module.css";

function Blog() {
  const blogPosts = [
    {
      id: 1,
      image: "/award1.JPG",
      title: "We’re Proud to Announce a Significant Achievement",
      content:
        "We are thrilled to share that our CEO, Honorable Jayeola Toriola (EFA), has recently been selected for a major industry honor. Being recognized at this level motivates us even further to continue raising the standard of our services. It reflects the trust our clients place in us and reinforces our commitment to delivering exceptional results in everything we do",
      date: "December 5, 2025",
    },
    {
      id: 2,
      image: "/rent.jpg",
      title: "You Need to Know This Before Buying or Renting a Property",
      content:
        "Before buying or renting a property, it’s important to think beyond your immediate needs and consider how your lifestyle may change in the next few years, such as family growth, work requirements, or the need for more space and accessibility. Take time to research the neighborhood as well,look into safety, noise levels, nearby services, transportation options, and any future developments that may affect your comfort or the property’s long-term value. Finally, never rely on photos alone; always inspect the property carefully for structural issues, plumbing and electrical problems, ventilation, pests, or poor maintenance. A thorough inspection helps you avoid unexpected costs or complications, ensuring you make a confident and informed decision",
      date: "November 28, 2025",
    },
    {
      id: 3,
      image: "/mistake.jpg",
      title: "Common Mistake First-time Homebuyers Make",
      content:
        "One of the biggest mistakes new buyers make is failing to set a realistic budget. Many people focus only on the property’s listing price and forget about additional expenses such as legal fees, inspections, taxes, renovation costs, and ongoing maintenance. Without a clear budget, you might fall in love with a home you ultimately can’t afford. Another common error choosing a home based solely on emotions. It’s easy to be drawn in by a beautiful kitchen or a spacious living room, but you must also consider practical factors like location, neighborhood safety, commute times, access to schools and amenities, and the long-term resale value. A home isn’t just a place you love, it’s one of the biggest financial investments of your life.",
      date: "November 20, 2025",
    },
    // {
    //   id: 4,
    //   image: "/award1.JPG",
    //   title: "Top 10 Tips for First-Time Home Buyers",
    //   content:
    //     "Buying your first home is an exciting milestone. From understanding your budget to navigating the mortgage process, we've compiled essential tips to help you make informed decisions and find your dream home.",
    //   date: "December 5, 2025",
    // },
    // {
    //   id: 5,
    //   image: "/award1.JPG",
    //   title: "Top 10 Tips for First-Time Home Buyers",
    //   content:
    //     "Buying your first home is an exciting milestone. From understanding your budget to navigating the mortgage process, we've compiled essential tips to help you make informed decisions and find your dream home.",
    //   date: "December 5, 2025",
    // },
    // {
    //   id: 6,
    //   image: "/award1.JPG",
    //   title: "Top 10 Tips for First-Time Home Buyers",
    //   content:
    //     "Buying your first home is an exciting milestone. From understanding your budget to navigating the mortgage process, we've compiled essential tips to help you make informed decisions and find your dream home.",
    //   date: "December 5, 2025",
    // },
  ];

  return (
    <div className={styles.blogContainer} id="blog">
      <div className={styles.blogContent}>
        <h2 className={styles.title}>Latest from Our Blog</h2>
        <p className={styles.subtitle}>
          Stay updated with the latest Information about Jola Estate Agency
        </p>

        <div className={styles.blogGrid}>
          {blogPosts.map((post) => (
            <article key={post.id} className={styles.blogCard}>
              <div className={styles.imageWrapper}>
                <img
                  src={post.image}
                  alt={post.title}
                  className={styles.blogImage}
                />
              </div>
              <div className={styles.blogCardContent}>
                <span className={styles.date}>{post.date}</span>
                <h3 className={styles.blogTitle}>{post.title}</h3>
                <p className={styles.blogExcerpt}>{post.content}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Blog;
