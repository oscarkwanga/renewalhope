import { Link } from 'lucide-react';
import React from 'react';

function ContactPage() {
  return (
    <div className="page-shell">
      <section className="hero-banner hero-banner--compact" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1800&q=80)' }}>
        <div className="hero-overlay" />
        <div className="hero-content container">
          <p className="eyebrow">Contact</p>
          <h1>We would love to welcome you in person or by message.</h1>
          <p>Whether you are joining an event, asking for prayer, or visiting for the first time, our team is ready to help.</p>
        </div>
      </section>
      


      <section className="find-wrc ">

    <div className="container">

        <div className="find-header">

            <span>VISIT WRC</span>

            <h2>

                Find Us In
                <br />
                Kona Ya Musa

            </h2>

            <p>

                Whether you're planning your first visit or returning to worship
                with us again, we'd love to welcome you.

            </p>

        </div>

        <div className="find-map">

            <img

                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1800&q=80"

                alt="Map"

            />

        </div>

        <div className="find-information">

            <div className="find-row">

                <span>LOCATION</span>

                <h3>

                    WRC Deliverance Church
                    <br />
                    Kona Ya Musa
                    <br />
                    Nairobi, Kenya

                </h3>

            </div>

            <div className="find-row">

                <span>SUNDAY WORSHIP</span>

                <h3>

                    First Service — 8:00 AM
                    <br />
                    Second Service — 10:30 AM

                </h3>

            </div>

            <div className="find-row">

                <span>MIDWEEK SERVICE</span>

                <h3>

                    Wednesday
                    <br />
                    6:00 PM

                </h3>

            </div>

            <div className="find-row">

                <span>PRAYER NIGHT</span>

                <h3>

                    Friday
                    <br />
                    6:00 PM

                </h3>

            </div>

        </div>

        <div className="find-button">

            <a

                href="https://maps.google.com"

                target="_blank"

                rel="noreferrer"

                className="button button--primary"

            >

                Get Directions

            </a>

        </div>

    </div>

</section>

      <section className="visit-invitation ">

    <div className="visit-image">

        <img
            src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1800&q=80"
            alt="Worship at WRC"
        />

    </div>

    <div className="visit-content">

        <span>YOU'RE INVITED</span>

        <h2>

            We'd Love
            <br />
            To Meet You.

        </h2>

        <p>

            Whether you're new to church,
            returning after many years,
            or searching for hope,
            you'll find genuine people,
            heartfelt worship and God's Word
            at WRC Deliverance Church Kona Ya Musa.

        </p>

        <Link
            to="/about"
            className="button button--primary"
        >

            Plan Your First Visit

        </Link>

    </div>

</section>

      <section className="section container">
        <div className="contact-panel">
          <div>
            <p className="eyebrow">Visit or connect</p>
            <h2>Let us know how we can support you.</h2>
            <p className="section-copy">We welcome visits, pastoral conversations, and thoughtful messages from our community.</p>
          </div>
          <div className="contact-card">
            <p><strong>Email</strong><br />hello@graceandlight.org</p>
            <p><strong>Address</strong><br />128 Harbor Avenue, Austin TX</p>
            <a className="button button--primary" href="mailto:hello@graceandlight.org">Send a message</a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
