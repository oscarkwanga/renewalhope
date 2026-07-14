import React from 'react';

const stories = [
  {
    title: 'Summer schedule update',
    text: 'New service times and refreshed weekly rhythms begin this month for all weekend gatherings.',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Prayer room reopened',
    text: 'The sanctuary prayer lounge is open for quiet reflection, encouragement, and prayerful care.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Community outreach week',
    text: 'Volunteers are preparing thoughtful support for families across the neighborhood.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80',
  },
];

const events = [

{
date:"13 JUL",
title:"Sunday Worship Experience",
time:"8:00 AM & 10:30 AM",
description:"Join us for powerful worship, practical biblical teaching and genuine fellowship."
},

{
date:"16 JUL",
title:"Midweek Prayer Service",
time:"6:00 PM",
description:"A time of prayer, worship and seeking God's direction together."
},

{
date:"19 JUL",
title:"Youth Fellowship",
time:"2:00 PM",
description:"Games, worship, Bible discussion and building friendships in Christ."
},

{
date:"26 JUL",
title:"Community Outreach",
time:"9:00 AM",
description:"Serving families and sharing Christ's love within our neighbourhood."
}

];


function NewsPage() {
  return (
    <div className="page-shell">
      <section className="hero-banner hero-banner--compact" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1800&q=80)' }}>
        <div className="hero-overlay" />
        <div className="hero-content container">
          <p className="eyebrow">News & stories</p>
          <h1>Fresh updates, meaningful stories, and community announcements.</h1>
          <p>Everything is presented in a clear and elegant editorial layout that feels calm and current.</p>
        </div>
      </section>


   


<section className="news-feature ">

    <img
        src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1800&q=80"
        alt="Featured Worship"
    />

    <div className="news-overlay-card">

        <span>FEATURED STORY</span>

        <h2>

            A Weekend That
            Changed Lives.

        </h2>

        <p>

            Last Sunday's worship became a powerful moment
            of prayer, healing and renewed hope as families,
            young people and visitors gathered to experience
            God's presence together.

        </p>

        <button className="button button--primary">

            Read Story

        </button>

    </div>

</section>

<section className="timeline-section ">

<div className="container">

<div className="timeline-heading">

<span>UPCOMING AT WRC</span>

<h2>

Join Us In What's Coming Next

</h2>

<p>

Every gathering is an opportunity to worship,
grow and build meaningful relationships.

</p>

</div>

<div className="timeline">

{

events.map((item,index)=>(

<div
key={index}
className="timeline-item"
>

<div className="timeline-date">

{item.date}

</div>

<div className="timeline-dot"></div>

<div className="timeline-content">

<h3>{item.title}</h3>

<p>{item.description}</p>

<span>{item.time}</span>

</div>

</div>

))

}

</div>

</div>

</section>

      <section className="section container">
        <div className="card-grid">
          {stories.map((item) => (
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
    </div>
  );
}

export default NewsPage;
