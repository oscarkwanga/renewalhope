import React, { useState } from 'react';

const sermons = [
  {
    id: 1,
    slug: "amaizing God",

    title: "amaizing God",

    speaker: "Rev. John Doe",

    date: "Sunday, 6 July 2026",

    readingTime: "12 min read",

    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80",

    scripture: "Matthew 14:22–33",

    introduction: `There are moments in life when we feel surrounded by storms.
Sometimes the waves are financial.
Sometimes emotional.
Sometimes spiritual.

Yet Scripture reminds us that Jesus never abandons His people in the middle of the storm.`,

    sections: [
      {
        title: "Faith Before Feelings",

        content: `Faith is choosing to trust God even when emotions suggest otherwise.

Peter stepped onto the water because he trusted Christ's voice before he trusted his circumstances.`
      },

      {
        title: "Keep Your Eyes On Jesus",

        content: `The moment Peter focused on the wind,
fear became greater than faith.

Our focus determines our strength.`
      },

      {
        title: "Jesus Is Still In The Boat",

        content: `Whatever storm you are facing today,
remember that Christ remains present.

His presence changes everything.`
      }
    ],

    keyVerse:

`"Take courage! It is I. Don't be afraid."

Matthew 14:27`,

    quote:

`Faith grows strongest
when circumstances look weakest.`,

    reflection: [

      "Where have I allowed fear to replace faith?",

      "What storm am I facing today?",

      "How can I trust God more this week?"

    ],

    prayer:

`Father,

Thank You because You remain faithful through every season.

Teach us to trust You even when life becomes uncertain.

Strengthen our faith and help us keep our eyes fixed on Jesus.

Amen.`
  }
];



function SermonsPage() {

  const [selectedSermon, setSelectedSermon] = useState(null);





  return (
    <div className="page-shell">
      <section className="hero-banner hero-banner--compact" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1800&q=80)' }}>
        <div className="hero-overlay" />
        <div className="hero-content container">
          <p className="eyebrow">Recent sermons</p>
          <h1>Messages that encourage steady reflection and lasting hope.</h1>
          <p>Explore thoughtful teaching designed to guide daily life and deepen spiritual clarity.</p>
        </div>
      </section>


      <section className="featured-sermon-section">

  <div className="featured-sermon-card">

    <div className="featured-sermon-image">

      <img
        src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1800&q=80"
        alt="Featured Sermon"
      />

      <div className="featured-badge">

        FEATURED MESSAGE

      </div>

    </div>

    <div className="featured-sermon-content">

      <p className="featured-label">

        MATTHEW 14:22–33

      </p>

      <h2>

        The God
        Who Never
        Fails

      </h2>

      <p className="featured-description">

        Storms are inevitable, but fear doesn't have to be.
        Discover how faith grows stronger when we keep our eyes
        on Jesus instead of our circumstances.

      </p>

      <div className="featured-meta">

        <div>

          <strong>Speaker</strong>

          <span>Rev. John Doe</span>

        </div>

        <div>

          <strong>Date</strong>

          <span>Sunday • 6 July 2026</span>

        </div>

        <div>

          <strong>Reading Time</strong>

          <span>12 Minutes</span>

        </div>

      </div>

      <button
        className="button button--primary"
        onClick={() => setSelectedSermon(sermons[0])}
      >
        Read Today's Message
      </button>

    </div>

  </div>

</section>


<section className="section sermon-library-section">

  <div className="container">

    <div className="section-heading">
      <p className="eyebrow">Sermon Library</p>
      <h2>Discover messages that strengthen faith and transform everyday life.</h2>
      <p className="section-copy">
        Every message is prayerfully prepared to encourage, teach and lead you
        closer to Christ. Choose a sermon below and begin reading.
      </p>
    </div>

    <div className="sermon-library-grid">

      {sermons.map((item) => (

        <article
          key={item.id}
          className="sermon-library-card"
          onClick={() => setSelectedSermon(item)}
        >

          <div className="sermon-library-image">

            <img
              src={item.image}
              alt={item.title}
            />

            <div className="sermon-library-overlay">

              <span className="reading-time">
                {item.readingTime}
              </span>

            </div>

          </div>

          <div className="sermon-library-body">

            <span className="sermon-date">
              {item.date}
            </span>

            <h3>
              {item.title}
            </h3>

            <p>

              {item.introduction.substring(0,120)}...

            </p>

            <div className="sermon-footer">

              <div>

                <small>Speaker</small>

                <strong>{item.speaker}</strong>

              </div>

              <button>

                Read →

              </button>

            </div>

          </div>

        </article>

      ))}

    </div>

  </div>

</section>

    

      {selectedSermon && (

<div
className="reader-backdrop"
onClick={()=>setSelectedSermon(null)}
>

<div
className="reader-sheet"
onClick={(e)=>e.stopPropagation()}
>

<button
className="reader-close"
onClick={()=>setSelectedSermon(null)}
>

✕

</button>

<div
className="reader-cover"
style={{
backgroundImage:`url(${selectedSermon.image})`
}}
>

<div className="reader-cover-overlay"/>

<div className="reader-cover-content">

<span>

{selectedSermon.readingTime}

</span>

<h1>

{selectedSermon.title}

</h1>

<p>

{selectedSermon.scripture}

</p>

</div>

</div>

<div className="reader-body">

<div className="reader-author">

<div>

<h3>

{selectedSermon.speaker}

</h3>

<p>

{selectedSermon.date}

</p>

</div>

</div>

<div className="reader-scripture">

<h2>

Today's Scripture

</h2>

<p>

{selectedSermon.keyVerse}

</p>

</div>

<div className="reader-introduction">

<h2>

Introduction

</h2>

<p>

{selectedSermon.introduction}

</p>

</div>

{selectedSermon.sections.map(section=>(

<section
key={section.title}
className="reader-point"
>

<h2>

{section.title}

</h2>

<p>

{section.content}

</p>

</section>

))}

<div className="reader-quote">

<p>

❝

{selectedSermon.quote}

❞

</p>

</div>

<div className="reader-reflection">

<h2>

Reflect This Week

</h2>

<ul>

{selectedSermon.reflection.map((question,index)=>(

<li key={index}>

{question}

</li>

))}

</ul>

</div>

<div className="reader-prayer">

<h2>

Closing Prayer

</h2>

<p>

{selectedSermon.prayer}

</p>

</div>

</div>

</div>

</div>

)}

    </div>
  );
}

export default SermonsPage;
