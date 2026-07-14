import React from "react";
import "./prayerrequest.css";

export const PrayerRequest = () => {
  return (
    <div className="prayer-page">



 {/* HERO */}

      <section className="sermon-hero">

        <div className="containerr">

          <div className="sermon-hero-content">

            <span>
             WE ARE HERE FOR YOU
            </span>

            <h1>
               How Can We Pray For You?
            </h1>

            <p>
              Whatever you're facing, you don't have to carry it alone.
              Our prayer team is ready to stand with you in faith.
            </p>

          </div>

        </div>

      </section>

      {/* PRAYER FORM */}

      <section className="values-section">

        <div className="containerr">

          <div className="section-header">

            <span className="valuespan">
              SUBMIT REQUEST
            </span>

            <p>
              Prayer Request Form
            </p>

          </div>

          <form className="prayer-form">

            <div className="form-row">

              <input
                type="text"
                placeholder="Full Name"
              />

              <input
                type="email"
                placeholder="Email Address"
              />

            </div>

            <div className="form-row">

              <input
                type="tel"
                placeholder="Phone Number"
              />

              <select>

                <option>
                  Prayer Category
                </option>

                <option>
                  Healing
                </option>

                <option>
                  Family
                </option>

                <option>
                  Financial Breakthrough
                </option>

                <option>
                  Marriage
                </option>

                <option>
                  Deliverance
                </option>

                <option>
                  Salvation
                </option>

                <option>
                  Other
                </option>

              </select>

            </div>

            <textarea
              rows="8"
              placeholder="Share your prayer request..."
            ></textarea>

            <div className="checkbox-group">

              <label>

                <input type="checkbox" />

                Keep this request confidential

              </label>

            </div>

           <button className="btn-primary">
              Submit Prayer Request
            </button>

          </form>

        </div>

      </section>

     
      {/* ========================= */}
      {/* PRAYER TEAM PROMISE */}
      {/* ========================= */}

      <section className="values-section">

        <div className="containerr">

          <div className="section-header">

              <span className="valuespan">
              OUR COMMITMENT
            </span>

            <p>
              What Happens After You Submit?
            </p>

          </div>

          <div className="promise-grid">

            <div className="promise-card">

              <div className="promise-icon">
                🙏
              </div>

              <h3>
                We Pray
              </h3>

              <p>
                Your request is shared with our trusted prayer team.
              </p>

            </div>

            <div className="promise-card">

              <div className="promise-icon">
                🔒
              </div>

              <h3>
                We Protect Privacy
              </h3>

              <p>
                Confidential requests remain completely private.
              </p>

            </div>

            <div className="promise-card">

              <div className="promise-icon">
                ❤️
              </div>

              <h3>
                We Care
              </h3>

              <p>
                You're more than a request. You're a person loved by God.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ========================= */}
      {/* SCRIPTURES */}
      {/* ========================= */}

      <section className="values-section">

        <div className="containerr">

          <div className="section-header">

             <span className="valuespan">
              GOD'S PROMISES
            </span>

            <p>
              Encouragement From Scripture
            </p>

          </div>

          <div className="scripture-grid">

            <div className="scripture-card">

              <p>
                "Cast all your anxiety on Him because He cares for you."
              </p>

              <span>
                1 Peter 5:7
              </span>

            </div>

            <div className="scripture-card">

              <p>
                "Call unto me, and I will answer thee."
              </p>

              <span>
                Jeremiah 33:3
              </span>

            </div>

            <div className="scripture-card">

              <p>
                "The prayer of a righteous person is powerful and effective."
              </p>

              <span>
                James 5:16
              </span>

            </div>

          </div>

        </div>

      </section>

    
      {/* ========================= */}
      {/* COUNSELLING */}
      {/* ========================= */}

      <section className="values-section">

        <div className="containerr">

          <div className="counselling-card">

               <span className="valuespan">
              NEED TO TALK?
            </span>

            <h2>
              Speak With A Pastor Or Counsellor
            </h2>

            <p>
              Sometimes you need more than a prayer request.
              Our pastors and counsellors are available to support you.
            </p>

            <div className="counselling-buttons">

              <button className="btn-primary">
                Request A Call
              </button>

              <button className="btn-secondary">
                Book Appointment
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* ========================= */}
      {/* FINAL CTA */}
      {/* ========================= */}

      <section className="values-section">

        <div className="containerr">

          <div className="final-cta-content">

            <span>
              REMEMBER
            </span>

            <h2>
              God Is Still Working
            </h2>

            <p>
              No matter what you're facing today,
              God sees you, loves you and hears your prayers.
            </p>

            

          </div>

        </div>

      </section>

    </div>
  );
};

export default PrayerRequest;