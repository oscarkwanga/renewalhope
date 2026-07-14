import React from 'react';

const storyCards = [
  {
    title: 'Our mission',
    text: 'We exist to create thoughtful spaces where people can grow in faith, serve generously, and feel deeply welcomed.',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Who we serve',
    text: 'Families, students, professionals, and visitors all find a place to belong in our community.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Our promise',
    text: 'Every experience is designed to be clear, caring, and beautiful from the first interaction to the last.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80',
  },
];

function AboutPage() {



  const milestones = [
  {
    year: "1998",
    title: "The Beginning",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
    description:
      "A small group of believers gathered with one vision—to see lives transformed through Jesus Christ.",
  },
  {
    year: "2006",
    title: "Growing In Faith",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    description:
      "As God continued to bless the ministry, more families found a place to worship, grow and belong.",
  },
  {
    year: "2015",
    title: "Serving Our Community",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    description:
      "Our passion extended beyond our walls through outreach, discipleship and practical acts of love.",
  },
  {
    year: "Today",
    title: "The Story Continues",
    image:
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80",
    description:
      "Every Sunday brings new stories of hope, healing and lives transformed by God's grace.",
  },
];


  return (
    <div className="page-shell">
      <section className="hero-banner hero-banner--compact" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80)' }}>
        <div className="hero-overlay" />
        <div className="hero-content container">
          <p className="eyebrow">About us</p>
          <h1>Built around grace, leadership, and meaningful community.</h1>
          <p>Our church and ministry experience is shaped by hospitality, strong vision, and thoughtful digital storytelling.</p>
        </div>
      </section>






      <section className="about-story">

    <div className="story-header">

        <span>OUR STORY</span>

        <h2>

            Every Great Journey
            Begins With A Calling.

        </h2>

    </div>

    <div className="story-layout">

        <div className="story-image">

            <img
                src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80"
                alt="Church Story"
            />

            <div className="story-floating">

                <h3>Since 1998</h3>

                <p>

                    Building lives,
                    strengthening families
                    and sharing the Gospel.

                </p>

            </div>

        </div>

        <div className="story-text">

            <p>

                WRC Deliverance Church Kona ya Musa was born
                from a passion to see lives transformed through
                the love of Jesus Christ.

            </p>

            <p>

                What began as a small gathering of believers has
                grown into a vibrant church family where worship,
                discipleship and genuine relationships flourish.

            </p>

            <p>

                Through every season God has remained faithful,
                guiding our church with grace, wisdom and purpose.
                Today we continue to build a community where
                everyone can know Christ, grow in faith and
                discover their calling.

            </p>

        </div>

    </div>

</section>


      <section className="section container">
        <div className="section-heading">
          <p className="eyebrow">Our story</p>
          <h2>We combine timeless values with a polished modern presence.</h2>
        </div>
        <div className="card-grid">
          {storyCards.map((item) => (
            <article className="card" key={item.title}>
              <img src={item.image} alt={item.title} className="card-image" />
              <div className="card-body">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>


<section className="journey-section-2026">

    <div className="journey-heading">

        <span>OUR JOURNEY</span>

        <h2>

            Milestones Of
            God's Faithfulness

        </h2>

        <p>

            Every season has been marked by God's goodness,
            guiding our church from humble beginnings to a
            growing family of believers.

        </p>

    </div>

    <div className="timeline">

        {milestones.map((item, index) => (

            <div
                key={item.year}
                className={`timeline-item ${index % 2 ? "right" : "left"}`}
            >

                <div className="timeline-content">

                    <span className="timeline-year">

                        {item.year}

                    </span>

                    <h3>{item.title}</h3>

                    <p>{item.description}</p>

                </div>

                <div className="timeline-image">

                    <img
                        src={item.image}
                        alt={item.title}
                    />

                </div>

            </div>

        ))}

        <div className="timeline-future">

            <div className="future-circle">

                ?

            </div>

            <h3>The Next Chapter</h3>

            <p>

                Perhaps God is calling you to become part
                of the next chapter in our story.

            </p>

        </div>

    </div>

</section>


    </div>
  );
}

export default AboutPage;
