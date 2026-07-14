import React from 'react';







const ministries = [

{
title:"Children's Ministry",
subtitle:"Growing young hearts in Christ",
description:"A joyful environment where children discover God's love through worship, Bible teaching, creativity and friendship in a safe and caring atmosphere.",
image:"https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1600&q=80"
},

{
title:"Youth Ministry",
subtitle:"Building tomorrow's leaders",
description:"Helping young people build strong faith, discover purpose and create lasting friendships through worship, mentorship and discipleship.",
image:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80"
},

{
title:"Women's Ministry",
subtitle:"Walking together in faith",
description:"Encouraging women of every generation through prayer, fellowship, leadership development and practical support.",
image:"https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=80"
},

{
title:"Men's Fellowship",
subtitle:"Strong men. Strong families.",
description:"Equipping men to become Christ-centered leaders in their homes, workplaces and communities.",
image:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1600&q=80"
},

{
title:"Worship Ministry",
subtitle:"Leading hearts into worship",
description:"Using music and creativity to lead people into God's presence through authentic worship and excellence.",
image:"https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1600&q=80"
}

];

function MinistriesPage() {
  return (
    <div className="page-shell">
      <section className="hero-banner hero-banner--compact" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1800&q=80)' }}>
        <div className="hero-overlay" />
        <div className="hero-content container">
          <p className="eyebrow">Ministries</p>
          <h1>Serving people through meaningful programs and lasting care.</h1>
          <p>Each ministry is designed to support growth, belonging, and practical service.</p>
        </div>
      </section>





<section className="ministries-showcase container">

    <div className="showcase-heading">

        <span>EXPLORE OUR MINISTRIES</span>

        <h2>

            There Is A Ministry
            For Every Season
            Of Life.

        </h2>

    </div>

    {ministries.map((item,index)=>(

        <section
            key={item.title}
            className={`ministry-feature ${index%2===0?"":"reverse"}`}
        >

            <div className="feature-image">

                <img
                    src={item.image}
                    alt={item.title}
                />

            </div>

            <div className="feature-copy">

                <span>{item.subtitle}</span>

                <h3>{item.title}</h3>

                <p>{item.description}</p>

                <button className="feature-button">

                    Discover More →

                </button>

            </div>

        </section>

    ))}

</section>



    </div>
  );
}

export default MinistriesPage;
