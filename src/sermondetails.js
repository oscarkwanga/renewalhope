import React from "react";
import "./sermondetails.css";

export const SermonDetails = () => {
  return (
    <div className="sermon-page">

      {/* HERO */}

      <section className="sermon-hero">

        <div className="containerr">

          <div className="sermon-hero-content">

            <span>
              SERMON MESSAGE
            </span>

            <h1>
              Walking By Faith And Not By Sight
            </h1>

            <p>
              Discover how faith enables believers to trust God
              even when circumstances seem uncertain.
            </p>

          </div>

        </div>

      </section>

      {/* SERMON META */}

      <section className="values-section">

        <div className="containerr">

          <div className="sermon-meta-grid">

            <div className="meta-card">

              <h4>
                Speaker
              </h4>

              <p>
                Pastor John Doe
              </p>

            </div>

            <div className="meta-card">

              <h4>
                Date
              </h4>

              <p>
                June 14, 2026
              </p>

            </div>

            

          

          </div>

        </div>

      </section>

      {/* FEATURED SCRIPTURE */}

      <section className="values-section">

        <div className="containerr">

          <div className="featured-scripture">

            <span>
              KEY SCRIPTURE
            </span>

            <h2>
              2 Corinthians 5:7
            </h2>

            <p>
              "For we walk by faith, not by sight."
            </p>

          </div>

        </div>

      </section>

      {/* SERMON CONTENT */}

      <section className="values-section">

        <div className="containerr">

          <article className="sermon-content">

            <h2>
              Introduction
            </h2>

            <p>
              Faith is one of the most important foundations
              of the Christian life. It allows believers to
              trust God's promises even when they cannot see
              immediate results.
            </p>

            <p>
              Throughout Scripture we see men and women who
              chose faith over fear and obedience over doubt.
            </p>

            <h2>
              Understanding Faith
            </h2>

            <p>
              Biblical faith is not wishful thinking.
              It is complete confidence in the character,
              promises and faithfulness of God.
            </p>

            <p>
              Faith grows through hearing and applying
              God's Word in everyday life.
            </p>

            <h2>
              Walking By Faith Daily
            </h2>

            <p>
              Every believer faces moments where circumstances
              challenge what God has spoken.
            </p>

            <p>
              Walking by faith means choosing God's truth
              above temporary feelings and situations.
            </p>

          </article>

        </div>

      </section>

    
      {/* ========================= */}
      {/* PRAYER RESPONSE */}
      {/* ========================= */}

      <section className="values-section">

        <div className="containerr">

          <div className="prayer-response-card">

            <span>
              RESPONSE PRAYER
            </span>

            <h2>
              A Prayer Of Faith
            </h2>

            <p>
              Heavenly Father, help me trust You even when I cannot
              see the whole picture. Strengthen my faith and teach me
              to rely on Your promises every day. In Jesus' name, Amen.
            </p>

          </div>

        </div>

      </section>


    </div>
  );
};

export default SermonDetails;