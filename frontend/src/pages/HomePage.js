import React, { useEffect, useRef, useState } from 'react';

import marnley from '../assets/marnley.jpeg';
import barge from '../assets/barge.jpeg';
import kds1 from '../assets/kds1.jpeg';
import kds2 from '../assets/kds2.jpeg';
import m1 from '../assets/m1.jpeg';
import m2 from '../assets/m2.jpeg';
import m3 from '../assets/m3.jpeg';
import m4 from '../assets/m4.jpeg';
import m5 from '../assets/m5.jpeg';
import m6 from '../assets/m6.jpeg';
import m7 from '../assets/m7.jpeg';
import m8 from '../assets/m8.jpeg';
import m9 from '../assets/m9.jpeg';
import m10 from '../assets/m10.jpeg';
import m11 from '../assets/m11.jpeg';
import m12 from '../assets/m12.jpeg';

  import axios from "axios";

import {
    PayPalButtons,
    PayPalScriptProvider,
} from "@paypal/react-paypal-js";



/**
 * Renewal Hope Academy — one-page partnership / fundraising site
 * =========================================================================
 * Design concept: "Hope Bloom" — a recurring organic blob motif drawn in a
 * warm coral/marigold/navy palette (with a single teal accent used only in
 * small doses) ties every section together. Photography is presented as a
 * tilted collage / polaroid wall rather than flat grids, and color washes,
 * blob shapes and wave dividers replace plain white section backgrounds.
 *
 * Drop straight into a Create React App / Vite / Next.js project. Styles
 * are self-contained in the injected <style> tag, scoped with "rha-" so
 * they won't collide with anything else on the site.
 *
 * REPLACE BEFORE LAUNCH (search for "REPLACE"):
 *  - PayPal business email
 *  - M-Pesa Paybill + Account number
 *  - Bank details
 *  - Phone number + email in the footer
 *  - Unsplash placeholder photography — swap in real RHA photos
 * =========================================================================
 */

const HERO_MAIN = 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69799?auto=format&fit=crop&w=800&q=80';
const HERO_SIDE = 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=600&q=80';

const GALLERY = [
  { src: m7, alt: 'Teacher guiding students', rot: -4 },
  { src:m4, alt: 'Children reading together', rot: 3 },
  { src: m1, alt: 'School community gathering', rot: -2 },
  { src: m8, alt: 'Students during break time', rot: 5 },
  { src:m11, alt: 'Young learner smiling', rot: -3 },
  { src: m2, alt: 'Learning materials and books', rot: 2 },
];

const PROGRESS = [
  { title: 'Growing student body', text: 'Children from Witu and the surrounding areas are joining our classrooms.', img: m4, wash: 'coral' },
  { title: 'Dedicated teachers', text: 'Committed to academic excellence and discipleship, every single day.', img:m7, wash: 'marigold' },
  { title: 'Safe, loving environment', text: 'A place where every child is known and valued for who they are.', img: m3, wash: 'teal' },
  { title: 'Academics + Christian values', text: 'We teach the mind and nurture the heart, in equal measure.', img:m6, wash: 'coral' },
];

const NEEDS = [
  { tag: '01', title: 'Infrastructure', text: 'Classrooms, desks, learning materials, and play facilities.', img: m12, wash: 'coral' },
  { tag: '02', title: 'Teacher Welfare & Training', text: 'To retain and equip the staff who teach and disciple our children.', img: m10, wash: 'teal' },
  { tag: '03', title: 'Feeding Program', text: 'So that no child learns on an empty stomach.', img: m11, wash: 'marigold' },
  { tag: '04', title: 'Scholarships', text: 'To support vulnerable children who cannot afford fees.', img: m5, wash: 'navy' },
  { tag: '05', title: 'Learning Resources', text: 'Textbooks, stationery, and digital tools for every classroom.', img: m1, wash: 'coral' },
];

const WAYS_TO_GIVE = [
  { step: 'Prayer', title: 'Stand with us', text: 'For wisdom, provision, and favor over the school and every child in it.' },
  { step: 'Financial Support', title: 'Give toward the need', text: 'One-time or monthly giving toward classrooms, meals, and scholarships.' },
  { step: 'Material Donations', title: 'Give in kind', text: 'Desks, books, foodstuffs, and sports equipment.' },
  { step: 'Volunteering', title: 'Give your skills', text: 'Mentorship, teaching support, or professional expertise.' },
];

/* -------------------------------------------------------------------- */
/* Small decorative helpers                                             */
/* -------------------------------------------------------------------- */

function Blob({ color, style }) {
  return <div className={`rha-blob rha-blob--${color}`} style={style} aria-hidden="true" />;
}

function Wave({ fill, flip }) {
  return (
    <svg
      className={`rha-wave ${flip ? 'rha-wave--flip' : ''}`}
      viewBox="0 0 1440 110"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        style={{ fill }}
        d="M0,32 C240,90 480,0 720,24 C960,48 1200,96 1440,40 L1440,110 L0,110 Z"
      />
    </svg>
  );
}

function Squiggle() {
  return (
    <svg className="rha-squiggle" viewBox="0 0 220 24" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M2 18 C 30 2, 55 2, 80 14 C 105 26, 130 26, 155 12 C 175 1, 195 1, 218 10"
        stroke="var(--rha-coral)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}





/* -------------------------------------------------------------------- */



const API_BASE_URL = "https://renewalhope-backend.onrender.com";


export const HomePage=() =>{
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const rootRef = useRef(null);
  const [amount, setAmount] = useState("40");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    const nodes = rootRef.current ? rootRef.current.querySelectorAll('.rha-reveal') : [];
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);







const Donate = ({ amount }) => {

   return (

      <PayPalScriptProvider
         options={{
            clientId:"ATN0_iXTzYGpSr70pl_GNbRQl3VbTIdqh-GE1FqmW6zUx64756uvfJ7hoQhV9Dcci9lOEV1J5YHpL8zg"
         }}
      >

         <PayPalButtons

            style={{
               color:"gold",
               shape:"pill",
               label:"donate",
               layout:"vertical"
            }}

            createOrder={async()=>{

               const {data}=await axios.post(
                  `${API_BASE_URL}/api/paypal/create-order`,
                  {
                     amount
                  }
               );

               return data.id;

            }}

            onApprove={async(data)=>{

               await axios.post(
                  `${API_BASE_URL}/api/paypal/capture-order/${data.orderID}`
               );

               alert("Thank you for supporting Renewal Hope Academy ❤️");

            }}

         />

      </PayPalScriptProvider>

   );

}

  return (
    <div className="rha" ref={rootRef}>
      <style>{CSS}</style>

      {/* ================= NAV ================= 
      <header className={`rha-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="rha-container rha-nav-inner">
          <div className="rha-brand">
            <div className="rha-brand-mark">RHA</div>
            <div>
              <div className="rha-brand-name">Renewal Hope Academy</div>
              <div className="rha-brand-sub">Witu, Kenya</div>
            </div>
          </div>
          <nav className={`rha-nav-links ${menuOpen ? 'is-open' : ''}`}>
            <a href="#director" onClick={() => setMenuOpen(false)}>Our Story</a>
            <a href="#gallery" onClick={() => setMenuOpen(false)}>Gallery</a>
            <a href="#needs" onClick={() => setMenuOpen(false)}>Needs</a>
            <a href="#project" onClick={() => setMenuOpen(false)}>The Project</a>
            <a href="#give" className="rha-btn rha-btn--ink" onClick={() => setMenuOpen(false)}>Partner With Us</a>
          </nav>
          <button className="rha-menu-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>
*/}
      {/* ================= HERO — composed collage, not a photo banner ================= */}
      <section className="rha-hero">
        <Blob color="coral" style={{ width: 460, height: 460, top: '-8%', left: '-10%' }} />
        <Blob color="marigold" style={{ width: 320, height: 320, bottom: '-10%', left: '30%' }} />
        <Blob color="teal" style={{ width: 200, height: 200, top: '12%', right: '6%' }} />
        <div className="rha-dotfield" aria-hidden="true" />

        <div className="rha-container rha-hero-grid">
          <div className="rha-hero-copy rha-reveal">
            <span className="rha-badge">Introducing Renewal Hope Academy</span>
            <h1>
              Nurturing hearts, minds &amp; <span className="rha-underline-wrap">futures<Squiggle /></span> for Christ.
            </h1>
            <p>A Christ-centered school in Witu raising children who are grounded in God&apos;s Word, equipped academically, and prepared to lead our community and nation with integrity.</p>
            <div className="rha-hero-actions">
              <a href="#give" className="rha-btn rha-btn--coral">Partner With Us</a>
              <a href="#director" className="rha-btn rha-btn--outline-ink">Read Our Story</a>
            </div>
          </div>

          <div className="rha-hero-visual rha-reveal">
            <div className="rha-hero-blobmask">
              <img src={m8} alt="Students at Renewal Hope Academy" />
            </div>
            <div className="rha-hero-polaroid">
              <img src={barge} alt="Classroom life at RHA" />
            </div>
            <div className="rha-hero-stamp">
              <svg viewBox="0 0 100 100" className="rha-stamp-ring" aria-hidden="true">
                <defs>
                  <path id="stampCircle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                </defs>
                <text fontSize="9" letterSpacing="2" fill="#fff">
                  <textPath href="#stampCircle">CROSSROADS CHURCH WITU · KENYA ·</textPath>
                </text>
              </svg>
              <span className="rha-stamp-center">✦</span>
            </div>
          </div>
        </div>

        <Wave fill="var(--rha-coral)" />
      </section>

      {/* ================= MISSION STRIP ================= */}
      <section className="rha-mission">
        <span className="rha-quote-mark" aria-hidden="true">&ldquo;</span>
        <div className="rha-container rha-reveal">
          <p className="rha-mission-quote">
            We believe every child in Witu deserves a school where the mind is
            trained and the heart is nurtured &mdash; a place that restores hope
            and builds character.
          </p>
        </div>
        <Wave fill="var(--rha-cream)" flip />
      </section>

      {/* ================= DIRECTOR ================= */}
      <section className="rha-director" id="director">
        <Blob color="marigold" style={{ width: 380, height: 380, top: '-4%', right: '-8%' }} />
        <div className="rha-container rha-director-grid">
          <div className="rha-director-photo rha-reveal">
            <img src={marnley} alt="Pastor Robert Manley" />
          </div>
          <div className="rha-director-copy rha-reveal">
            <span className="rha-eyebrow">From the Director&apos;s Desk</span>
            <h2>Greetings &mdash; I&apos;m Pastor Robert Manley.</h2>
            <p>I am Director of Renewal Hope Academy and Lead Pastor of Crossroads Fellowship, Witu. My calling is to raise a generation that is grounded in God&apos;s Word, equipped academically, and prepared to be leaders of integrity in our community and nation.</p>
            <p>RHA was birthed from a burden to see children in Witu and beyond receive quality, Christ-centered education that restores hope and builds character.</p>
            <div className="rha-signature">
              <strong>Pastor Robert Manley</strong>
              <span>Director, Renewal Hope Academy &middot; Lead Pastor, Crossroads Fellowship, Witu</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= GALLERY — polaroid wall on navy ================= */}
      <section className="rha-gallery" id="gallery">
        <div className="rha-dotfield rha-dotfield--light" aria-hidden="true" />
        <Blob color="coral" style={{ width: 260, height: 260, top: '4%', left: '4%', opacity: 0.25 }} />
        <Blob color="teal" style={{ width: 200, height: 200, bottom: '6%', right: '8%', opacity: 0.22 }} />
        <div className="rha-container">
          <div className="rha-section-head rha-section-head--light rha-reveal">
            <span className="rha-eyebrow rha-eyebrow--light">Life At RHA</span>
            <h2>A school best seen through its everyday moments.</h2>
          </div>
          <div className="rha-polaroid-wall rha-reveal">
            {GALLERY.map((photo) => (
              <div className="rha-polaroid" key={photo.src} style={{ transform: `rotate(${photo.rot}deg)` }}>
                <img src={photo.src} alt={photo.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROGRESS ================= */}
      <section className="rha-progress">
        <div className="rha-container">
          <div className="rha-section-head rha-reveal">
            <span className="rha-eyebrow">Our School Progress</span>
            <h2>By God&apos;s grace, RHA is growing &mdash; and making an impact.</h2>
          </div>
          <div className="rha-progress-grid">
            {PROGRESS.map((item, i) => (
              <div
                className={`rha-progress-card rha-wash--${item.wash} rha-reveal`}
                key={item.title}
                style={{ transform: `rotate(${i % 2 === 0 ? -1.4 : 1.4}deg)` }}
              >
                <div className="rha-progress-photo">
                  <img src={item.img} alt={item.title} loading="lazy" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= NEEDS ================= */}
      <section className="rha-needs" id="needs">
        <div className="rha-container">
          <div className="rha-section-head rha-reveal">
            <span className="rha-eyebrow">Areas That Need Support</span>
            <h2>To serve more children with excellence, we need partners in five key areas.</h2>
          </div>
          <div className="rha-needs-grid">
            {NEEDS.map((need, i) => (
              <div
                className={`rha-need-card rha-wash--${need.wash} rha-reveal`}
                key={need.title}
                style={{ marginTop: i % 3 === 1 ? '2rem' : 0 }}
              >
                <div className="rha-need-photo">
                  <img src={need.img} alt={need.title} loading="lazy" />
                </div>
                <span className="rha-need-tag">{need.tag}</span>
                <h3>{need.title}</h3>
                <p>{need.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROJECT ================= */}
      <section className="rha-project" id="project">
        <Blob color="cream" style={{ width: 420, height: 420, top: '-14%', left: '-10%', opacity: 0.15 }} />
        <div className="rha-container rha-project-grid">
          <div className="rha-project-copy rha-reveal">
            <span className="rha-eyebrow rha-eyebrow--light">Ongoing Project</span>
            <h2>The RHA Classroom &amp; Feeding Project</h2>
            <p>We are currently working to expand our classrooms and establish a consistent school feeding program. This project will allow us to admit more learners and improve concentration and performance in class.</p>
            <p>Every meal served and every desk provided is an investment in a child&apos;s future.</p>
            <div className="rha-chips">
              <span className="rha-chip">More classrooms</span>
              <span className="rha-chip">Daily meals</span>
              <span className="rha-chip">Room for more learners</span>
            </div>
            <a href="#give" className="rha-btn rha-btn--ink">Support This Project</a>
          </div>
          <div className="rha-project-visual rha-reveal">
            <div className="rha-project-blobmask">
              <img src={m12} alt="Classroom at Renewal Hope Academy" />
            </div>
          </div>
        </div>
        <Wave fill="var(--rha-cream)" flip />
      </section>

      {/* ================= WAYS TO GIVE ================= */}
      <section className="rha-ways">
        <Blob color="teal" style={{ width: 220, height: 220, top: '10%', right: '4%', opacity: 0.18 }} />
        <div className="rha-container rha-ways-grid">
          <div className="rha-ways-visual rha-reveal">
            <div className="rha-hero-blobmask rha-ways-blobmask">
              <img src={m5} />
            </div>
            <div className="rha-hero-polaroid rha-ways-polaroid">
              <img src={m11} />
            </div>
          </div>
          <div className="rha-ways-copy rha-reveal">
            <span className="rha-eyebrow">Invitation To Partner</span>
            <h2>You can be part of what God is doing at RHA.</h2>
            <div className="rha-ways-list">
              {WAYS_TO_GIVE.map((way) => (
                <div className="rha-way-item" key={way.step}>
                  <span className="rha-way-step">{way.step}</span>
                  <div>
                    <h3>{way.title}</h3>
                    <p>{way.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= GIVE PANEL ================= */}
      <section className="rha-give" id="give">
        <div className="rha-container">
          <div className="rha-give-panel rha-reveal">
            <Blob color="coral" style={{ width: 220, height: 220, top: '-14%', right: '-6%', opacity: 0.5 }} />
            <div className="rha-give-copy">
              <span className="rha-eyebrow rha-eyebrow--light">Financial Partnership</span>
              <h3>Give toward classrooms, meals &amp; scholarships</h3>
              <p>Every gift &mdash; one-time or monthly &mdash; goes directly toward the Classroom &amp; Feeding Project and the ongoing needs of our students and teachers.</p>
              <div className="rha-verse">
                &ldquo;Whoever is kind to the poor lends to the Lord, and he will reward them for what they have done.&rdquo;
                <span>Proverbs 19:17</span>
              </div>
            </div>

            <div className="rha-give-details">
              <div className="rha-give-field">
                <small>M-Pesa Paybill</small>
                <strong>247247</strong>
              </div>
              <div className="rha-give-field">
                <small>Account Number</small>
                <strong>339030</strong>
              </div>
         
         

              {/* PayPal — classic hosted Donate form, works without a developer
                  account. Replace "business" with your PayPal email, or swap
                  for the hosted_button_id version from paypal.com/donate/buttons
                  once you have a PayPal Business / Confirmed Charity account. */}
            <div className="rha-paypal-section">

    <label style={{color:'#999',paddingBottom:20, fontSize:12}} >Donation Amount (USD)</label>

    <input
    placeholder="enter the amount"
        type="number"
        min="1"
        value={amount}
        onChange={(e)=>setAmount(e.target.value)}
        className="rha-amount-input"
    />

    <Donate amount={amount}/>

</div>
            </div>
          </div>
        </div>
      </section>




      <section className="rha-sponsor-storyy">

    <div className="rha-container">

        <div className="rha-section-head rha-reveal">
            <span className="rha-eyebrow">
                Sponsor A Child
            </span>

            <h2>
                One Child. One Opportunity. One Changed Future.
            </h2>

            <p>
                Every month we are trusting God to provide sponsors for children
                who would otherwise struggle to remain in school because of
                hunger or school fees.
            </p>
        </div>

        <div className="rha-sponsor-highlight rha-reveal">

            <h3>
                $40 per month changes everything.
            </h3>

            <p>
                With just <strong>$40 each month</strong>, one child receives
                full tuition together with daily meals — tea break, lunch,
                and evening snacks. Your support removes both the burden
                of school fees and the pain of learning on an empty stomach.
            </p>

        </div>

        <div className="rha-support-grid rha-reveal">

            <div className="rha-support-item">
                <span>01</span>
                <h4>Full Tuition</h4>
                <p>Every school fee is fully covered.</p>
            </div>

            <div className="rha-support-item">
                <span>02</span>
                <h4>Tea Break</h4>
                <p>A healthy morning refreshment.</p>
            </div>

            <div className="rha-support-item">
                <span>03</span>
                <h4>Lunch</h4>
                <p>A nutritious meal that keeps children focused.</p>
            </div>

            <div className="rha-support-item">
                <span>04</span>
                <h4>Evening Snacks</h4>
                <p>Extra nourishment before they return home.</p>
            </div>

        </div>

        <div className="rha-sponsor-footer rha-reveal">

            <p>
                This month our prayer is to find sponsors for
                <strong> 20 children.</strong> Together that means
                <strong> $800 each month</strong> to provide education,
                daily meals, hope, and a brighter future for an entire
                classroom. Whether someone sponsors one child or many,
                every act of generosity makes an eternal difference.
            </p>

        </div>

    </div>

</section>

      {/* ================= FOOTER ================= */}
      <footer className="rha-footer">
        <div className="rha-dotfield rha-dotfield--light" aria-hidden="true" />
        <div className="rha-container rha-footer-grid">
          <div>
            <div className="rha-footer-brand">
              <div className="rha-brand-mark">RHA</div>
              <div className="rha-footer-name">Renewal Hope Academy</div>
            </div>
            <p>A Christ-centered school in Witu, Kenya, raising a generation grounded in God&apos;s Word, equipped academically, and prepared to lead with integrity.</p>
          </div>
          <div className="rha-footer-col">
            <h4>Contact</h4>
            <div><strong>Pastor Robert Manley</strong>Director, Renewal Hope Academy</div>
            <div>Lead Pastor, Crossroads Fellowship, Witu</div>
            <div>Phone: 0720179551</div>
            <div>Email: renewalhopeacademy@gmail.com</div>
          </div>
          
        </div>
        <div className="rha-container rha-footer-bottom">
          <span>© 2026 Renewal Hope Academy, Witu.</span>
          <span className="rha-footer-tag">Together, let&apos;s raise a generation of hope.</span>
        </div>
        <div style={{textAlign:'center',marginTop:30,marginRight:20,marginLeft:20 ,fontSize:13,opacity:.7}}>Built with KWANG'A TECHNOLOGIES - TELL(+254798104979)</div>
      </footer>
      
    </div>
  );
}

const CSS = `
.rha{
  --rha-ink:#202B4B;
  --rha-ink-2:#141B33;
  --rha-coral:#FF7A59;
  --rha-coral-deep:#E85F3D;
  --rha-marigold:#FFB648;
  --rha-cream:#FFF6EA;
  --rha-cream-2:#FFEDD3;
  --rha-teal:#2FB6A3;
  --rha-white:#FFFFFF;
  --rha-muted:#5B6280;
  --radius:26px;
  --radius-sm:16px;
  --maxw:1180px;
  --shadow-sm:0 14px 34px rgba(32,43,75,0.1);
  --shadow-md:0 28px 60px rgba(32,43,75,0.18);

  font-family:'Plus Jakarta Sans', sans-serif;
  color:var(--rha-ink);
  background:var(--rha-cream);
  overflow-x:hidden;
}
.rha *{box-sizing:border-box;}
.rha h1,.rha h2,.rha h3{margin:0; font-family:'Fredoka', sans-serif; font-weight:600; letter-spacing:-0.01em; color:var(--rha-ink);}
.rha p{margin:0; color:var(--rha-muted); line-height:1.75;}
.rha a{color:inherit; text-decoration:none;}
.rha img{display:block; max-width:100%; width:100%;}
.rha-container{width:min(100% - 3rem, var(--maxw)); margin:0 auto; position:relative; z-index:3;}
.rha section{position:relative; padding:4rem 0; overflow:hidden;}

.rha-reveal{opacity:0; transform:translateY(24px); transition:opacity .8s ease, transform .8s ease;}
.rha-reveal.is-visible{opacity:1; transform:none;}

/* ---------- decorative blobs / texture ---------- */
.rha-blob{
  position:absolute; z-index:1; pointer-events:none;
  border-radius:62% 38% 55% 45% / 48% 55% 45% 52%;
  filter:blur(2px);
}
.rha-blob--coral{background:var(--rha-coral); opacity:.16;}
.rha-blob--marigold{background:var(--rha-marigold); opacity:.18;}
.rha-blob--teal{background:var(--rha-teal); opacity:.16;}
.rha-blob--cream{background:var(--rha-cream); opacity:.14;}

.rha-dotfield{
  position:absolute; inset:0; z-index:1; opacity:.5; pointer-events:none;
  background-image:radial-gradient(var(--rha-ink) 1.4px, transparent 1.6px);
  background-size:26px 26px;
  -webkit-mask-image:radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 90%);
  mask-image:radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 90%);
}
.rha-dotfield--light{
  background-image:radial-gradient(rgba(255,255,255,.5) 1.4px, transparent 1.6px);
}

.rha-wave{position:absolute; left:0; right:0; bottom:-1px; width:100%; height:70px; z-index:2;}
.rha-wave--flip{bottom:auto; top:-1px; transform:rotate(180deg);}

.rha-squiggle{width:120px; height:14px; display:block; margin-top:-6px;}
.rha-underline-wrap{position:relative; display:inline-block; color:var(--rha-coral-deep);}

/* ---------- buttons / labels ---------- */
.rha-btn{
  display:inline-flex; align-items:center; gap:.5rem;
  padding:1rem 1.8rem; border-radius:999px; border:2px solid transparent;
  font-weight:700; font-size:.96rem; cursor:pointer; font-family:'Plus Jakarta Sans', sans-serif;
  transition:transform .25s ease, box-shadow .25s ease, background .25s ease;
}
.rha-btn:hover{transform:translateY(-3px);}
.rha-btn--coral{background:var(--rha-coral); color:#fff; box-shadow:0 16px 32px rgba(255,122,89,.4);}
.rha-btn--coral:hover{background:var(--rha-coral-deep);}
.rha-btn--ink{background:var(--rha-ink); color:#fff;}
.rha-btn--ink:hover{background:var(--rha-ink-2);}
.rha-btn--outline-ink{background:transparent; border-color:var(--rha-ink); color:var(--rha-ink);}
.rha-btn--outline-ink:hover{background:var(--rha-ink); color:#fff;}

.rha-badge{
  display:inline-flex; align-items:center; gap:.5rem;
  background:var(--rha-white); border:1px solid rgba(32,43,75,.12);
  padding:.55rem 1.1rem; border-radius:999px; font-weight:700; font-size:.78rem;
  letter-spacing:.08em; text-transform:uppercase; color:var(--rha-coral-deep);
  box-shadow:var(--shadow-sm); margin-bottom:1.6rem;
}
.rha-eyebrow{
  display:inline-flex; align-items:center; gap:.5rem; font-weight:700; font-size:.78rem;
  letter-spacing:.16em; text-transform:uppercase; color:var(--rha-coral-deep); margin-bottom:1rem;
}
.rha-eyebrow--light{color:var(--rha-marigold);}
.rha-section-head{max-width:660px; margin-bottom:3rem;}
.rha-section-head--light h2{color:#fff;}
.rha-section-head h2{font-size:clamp(1.9rem,3.2vw,2.5rem); line-height:1.2;}

/* ---------- nav ---------- */
.rha-nav{position:fixed; top:0; left:0; right:0; z-index:100; padding:1.1rem 0; transition:background .3s ease, padding .3s ease, box-shadow .3s ease;}
.rha-nav.is-scrolled{background:rgba(255,246,234,.94); backdrop-filter:blur(12px); box-shadow:0 10px 26px rgba(32,43,75,.1); padding:.7rem 0;}
.rha-nav-inner{display:flex; align-items:center; justify-content:space-between;}
.rha-brand{display:flex; align-items:center; gap:.7rem;}
.rha-brand-mark{width:2.5rem; height:2.5rem; border-radius:12px; background:linear-gradient(135deg, var(--rha-coral), var(--rha-marigold)); color:#fff; display:grid; place-items:center; font-weight:700; font-size:.9rem; font-family:'Fredoka',sans-serif;}
.rha-brand-name{font-weight:600; color:var(--rha-ink); font-size:1rem; font-family:'Fredoka',sans-serif;}
.rha-brand-sub{font-size:.68rem; letter-spacing:.12em; text-transform:uppercase; color:var(--rha-muted);}
.rha-nav-links{display:flex; align-items:center; gap:2rem;}
.rha-nav-links a:not(.rha-btn){font-weight:600; font-size:.9rem; color:var(--rha-ink);}
.rha-menu-toggle{display:none; background:none; border:none; font-size:1.4rem; cursor:pointer; color:var(--rha-ink);}
@media (max-width:880px){
  .rha-nav-links{
    position:fixed; inset:64px 0 auto 0; background:var(--rha-white);
    flex-direction:column; align-items:flex-start; padding:1rem 1.5rem;
    max-height:0; overflow:hidden; transition:max-height .35s ease; box-shadow:0 16px 30px rgba(0,0,0,.12);
  }
  .rha-nav-links.is-open{max-height:420px;}
  .rha-nav-links a:not(.rha-btn){width:100%; padding:.9rem 0; border-bottom:1px solid rgba(32,43,75,.1);}
  .rha-nav-links .rha-btn{margin-top:1rem;}
  .rha-menu-toggle{display:block;}
}

/* ---------- hero ---------- */
.rha-hero{background:var(--rha-cream); padding-top:9rem; padding-bottom:8rem;}
.rha-hero-grid{display:grid; grid-template-columns:1.05fr .95fr; gap:3rem; align-items:center;}
.rha-hero-copy h1{font-size:clamp(2.5rem,4.6vw,3.9rem); line-height:1.1; margin-bottom:1.4rem;}
.rha-hero-copy p{font-size:1.1rem; max-width:520px; margin-bottom:2rem;}
.rha-hero-actions{display:flex; gap:1rem; flex-wrap:wrap;}
.rha-hero-visual{position:relative; height:460px;}
.rha-hero-blobmask{
  position:absolute; top:0; left:10%; width:75%; height:400px;
  border-radius:58% 42% 63% 37% / 45% 55% 45% 55%;
  overflow:hidden; box-shadow:var(--shadow-md); z-index:2;
}
.rha-hero-blobmask img{width:100%; height:100%; object-fit:cover;}
.rha-hero-polaroid{
  position:absolute; bottom:0; left:0; width:44%;
  background:#fff; padding:.6rem .6rem 1.4rem; border-radius:14px;
  box-shadow:var(--shadow-md); transform:rotate(-7deg); z-index:3;
}
.rha-hero-polaroid img{border-radius:8px; aspect-ratio:4/3.4; object-fit:cover;}
.rha-hero-stamp{
  position:absolute; top:6%; right:0; width:110px; height:110px; z-index:4;
  display:grid; place-items:center; background:var(--rha-ink); border-radius:50%;
  box-shadow:var(--shadow-md);
}
.rha-stamp-ring{width:100px; height:100px; position:absolute;}
.rha-stamp-center{color:var(--rha-marigold); font-size:1.3rem;}

@media (max-width:900px){
  .rha-hero-grid{grid-template-columns:1fr;}
  .rha-hero-visual{height:360px; margin-top:2rem;}
}

/* ---------- mission strip ---------- */
.rha-mission{background:linear-gradient(120deg, var(--rha-coral) 0%, var(--rha-marigold) 100%); padding:6rem 0 8rem;}
.rha-quote-mark{
  position:absolute; top:-1rem; left:50%; transform:translateX(-50%);
  font-family:'Fredoka',sans-serif; font-size:9rem; color:rgba(255,255,255,.18); line-height:1; z-index:1;
}
.rha-mission-quote{
  position:relative; z-index:2; max-width:780px; margin:0 auto; text-align:center;
  font-family:'Fredoka',sans-serif; font-weight:500;
  font-size:clamp(1.3rem,2.4vw,1.8rem); line-height:1.55; color:#fff;
}

/* ---------- director ---------- */
.rha-director{background:var(--rha-cream);}
.rha-director-grid{display:grid; grid-template-columns:.8fr 1.2fr; gap:3.5rem; align-items:center;}
.rha-director-photo{
  position:relative; z-index:2; border-radius:58% 42% 63% 37% / 45% 55% 45% 55%;
  overflow:hidden; box-shadow:var(--shadow-md); aspect-ratio:4/4.6;
}
.rha-director-photo img{width:100%; height:100%; object-fit:cover;}
.rha-director-copy{position:relative; z-index:2;}
.rha-director-copy h2{font-size:clamp(1.8rem,3vw,2.3rem); margin-bottom:1.2rem;}
.rha-director-copy p{font-size:1.04rem; margin-bottom:1.1rem;}
.rha-signature{margin-top:1.5rem;}
.rha-signature strong{display:block; color:var(--rha-ink); font-family:'Fredoka',sans-serif; font-size:1.05rem;}
.rha-signature span{color:var(--rha-muted); font-size:.86rem;}
@media (max-width:880px){ .rha-director-grid{grid-template-columns:1fr;} }

/* ---------- gallery ---------- */
.rha-gallery{background:linear-gradient(180deg, var(--rha-ink) 0%, var(--rha-ink-2) 100%); padding:8rem 0;}
.rha-polaroid-wall{display:flex; flex-wrap:wrap; gap:1.8rem 1.4rem; justify-content:center;}
.rha-polaroid{
  background:#fff; padding:.6rem .6rem 1.3rem; border-radius:12px; width:190px;
  box-shadow:0 20px 40px rgba(0,0,0,.35); transition:transform .3s ease;
}
.rha-polaroid:hover{transform:rotate(0deg) translateY(-6px) !important;}
.rha-polaroid img{border-radius:6px; aspect-ratio:1/1.05; object-fit:cover;}

/* ---------- progress ---------- */
.rha-progress{background:var(--rha-cream-2);}
.rha-progress-grid{display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:2.2rem; padding-top:.5rem;}
.rha-progress-card{border-radius:var(--radius-sm); padding:1.4rem; box-shadow:var(--shadow-sm); transition:transform .3s ease;}
.rha-progress-card:hover{transform:rotate(0deg) translateY(-6px) !important;}
.rha-progress-photo{border-radius:12px; overflow:hidden; height:150px; margin-bottom:1rem;}
.rha-progress-photo img{width:100%; height:100%; object-fit:cover;}
.rha-progress-card h3{font-size:1.05rem; margin-bottom:.4rem; color:#fff;}
.rha-progress-card p{font-size:.9rem; color:rgba(255,255,255,.85);}
.rha-wash--coral{background:linear-gradient(160deg, var(--rha-coral), var(--rha-coral-deep));}
.rha-wash--marigold{background:linear-gradient(160deg, var(--rha-marigold), var(--rha-coral));}
.rha-wash--teal{background:linear-gradient(160deg, var(--rha-teal), #1F8F80);}
.rha-wash--navy{background:linear-gradient(160deg, var(--rha-ink), var(--rha-ink-2));}

/* ---------- needs ---------- */
.rha-needs{background:var(--rha-cream);}
.rha-needs-grid{display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1.6rem;}
.rha-need-card{
  position:relative; border-radius:var(--radius-sm); padding:1.4rem 1.3rem 1.5rem;
  box-shadow:var(--shadow-sm); transition:transform .3s ease, box-shadow .3s ease;
}
.rha-need-card:hover{transform:translateY(-6px); box-shadow:var(--shadow-md);}
.rha-need-photo{border-radius:12px; overflow:hidden; height:140px; margin-bottom:2rem;}
.rha-need-photo img{width:100%; height:100%; object-fit:cover;}
.rha-need-tag{
  position:absolute; top:.9rem; left:.9rem;
  background:rgba(255,255,255,.92); color:var(--rha-ink);
  font-weight:800; font-size:.76rem; padding:.3rem .6rem; border-radius:8px;
  font-family:'Fredoka',sans-serif;
}
.rha-need-card h3{font-size:1.03rem; margin-bottom:.4rem; color:#fff;}
.rha-need-card p{font-size:.9rem; color:rgba(255,255,255,.85);}

/* ---------- project ---------- */
.rha-project{background:linear-gradient(135deg, var(--rha-marigold) 0%, var(--rha-coral) 100%); color:#fff; padding-bottom:9rem;}
.rha-project-grid{display:grid; grid-template-columns:1fr 1fr; gap:3.5rem; align-items:center;}
.rha-project-copy h2{color:#fff; font-size:clamp(1.9rem,3.2vw,2.5rem); margin-bottom:1.2rem;}
.rha-project-copy p{color:rgba(255,255,255,.9); margin-bottom:1rem;}
.rha-chips{display:flex; flex-wrap:wrap; gap:.8rem; margin:1.4rem 0 2rem;}
.rha-chip{padding:.5rem 1.05rem; color: #141B33; border-radius:999px; background:rgba(255,255,255,.2); border:1px solid rgba(255,255,255,.35); font-size:.84rem; font-weight:700;}
.rha-project-blobmask{
  border-radius:58% 42% 63% 37% / 45% 55% 45% 55%; overflow:hidden;
  box-shadow:var(--shadow-md); aspect-ratio:1/1;
}
.rha-project-blobmask img{width:100%; height:100%; object-fit:cover;}
@media (max-width:900px){ .rha-project-grid{grid-template-columns:1fr;} }

/* ---------- ways to give ---------- */
.rha-ways{background:var(--rha-cream);}
.rha-ways-grid{display:grid; grid-template-columns:.85fr 1.15fr; gap:4rem; align-items:center;}
.rha-ways-visual{position:relative; height:420px;}
.rha-ways-blobmask{left:0; width:85%;}
.rha-ways-polaroid{right:0; left:auto; width:48%; transform:rotate(6deg);}
.rha-ways-copy h2{font-size:clamp(1.8rem,3vw,2.3rem); margin-bottom:1.8rem;}
.rha-ways-list{display:grid; gap:1.3rem;}
.rha-way-item{display:grid; grid-template-columns:150px 1fr; gap:1.2rem; padding-bottom:1.2rem; border-bottom:1px solid rgba(32,43,75,.12);}
.rha-way-item:last-child{border-bottom:none; padding-bottom:0;}
.rha-way-step{font-weight:700; font-size:.85rem; color:var(--rha-coral-deep); font-family:'Fredoka',sans-serif;}
.rha-way-item h3{font-size:1.02rem; margin-bottom:.3rem;}
.rha-way-item p{font-size:.92rem;}
@media (max-width:900px){ .rha-ways-grid{grid-template-columns:1fr;} .rha-ways-visual{height:340px; margin-bottom:1rem;} .rha-way-item{grid-template-columns:1fr;} }

/* ---------- give panel ---------- */
.rha-give{background:var(--rha-cream);}
.rha-give-panel{position:relative; display:grid; grid-template-columns:1.1fr .9fr; background:var(--rha-ink); border-radius:var(--radius); overflow:hidden; box-shadow:var(--shadow-md);}
.rha-give-copy{position:relative; z-index:2; padding:3rem 2.6rem;}
.rha-give-copy h3{color:#fff; font-size:1.55rem; margin-bottom:1rem;}
.rha-give-copy p{color:rgba(255,255,255,.8); margin-bottom:1.6rem;}
.rha-verse{font-family:'Fredoka',sans-serif; font-weight:500; font-size:1.05rem; line-height:1.7; color:#fff; border-left:3px solid var(--rha-marigold); padding-left:1.1rem;}
.rha-verse span{display:block; margin-top:.5rem; font-size:.8rem; color:var(--rha-marigold); letter-spacing:.08em; text-transform:uppercase;}
.rha-give-details{position:relative; z-index:2; background:rgba(255,255,255,.06); border-left:1px solid rgba(255,255,255,.1); padding:3rem 2.4rem; display:flex; flex-direction:column; gap:1.1rem;}
.rha-give-field{background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.14); border-radius:14px; padding:1.05rem 1.25rem; text-align:left; width:100%; cursor:default;}
.rha-give-field small{display:block; color:var(--rha-marigold); letter-spacing:.1em; text-transform:uppercase; font-size:.68rem; margin-bottom:.4rem; font-weight:700;}
.rha-give-field strong{font-size:1.05rem; font-weight:600; color:#fff;}
.rha-paypal-form{margin:0;}
.rha-give-field--paypal{cursor:pointer; background:linear-gradient(120deg, rgba(255,122,89,.3), rgba(255,182,72,.3)); transition:transform .2s ease, background .2s ease;}
.rha-give-field--paypal:hover{transform:translateY(-2px); background:linear-gradient(120deg, rgba(255,122,89,.45), rgba(255,182,72,.45));}
@media (max-width:860px){ .rha-give-panel{grid-template-columns:1fr;} .rha-give-details{border-left:none; border-top:1px solid rgba(255,255,255,.1);} }
/*==============================
 Sponsor Story
===============================*/

.rha-sponsor-story{
    background:#fff;
    padding:6rem 0;
}

.rha-sponsor-highlight{
    max-width:760px;
    margin:3rem auto;
    text-align:center;
    background:var(--rha-cream);
    padding:3rem;
    border-radius:24px;
    position:relative;
}

.rha-sponsor-highlight::before{
    content:"";
    position:absolute;
    top:0;
    left:50%;
    transform:translateX(-50%);
    width:90px;
    height:5px;
    background:var(--rha-coral);
    border-radius:20px;
}

.rha-sponsor-highlight h3{
    font-size:2.3rem;
    margin-bottom:1rem;
    color:var(--rha-ink);
}

.rha-sponsor-highlight p{
    max-width:620px;
    margin:auto;
    line-height:1.9;
}

.rha-support-grid{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:1.5rem;
    margin-top:4rem;
}

.rha-support-item{
    text-align:center;
}

.rha-support-item span{
    display:inline-flex;
    width:52px;
    height:52px;
    border-radius:50%;
    background:var(--rha-marigold);
    color:var(--rha-ink);
    justify-content:center;
    align-items:center;
    font-weight:700;
    margin-bottom:1rem;
}

.rha-support-item h4{
    margin-bottom:.5rem;
}

.rha-support-item p{
    font-size:.95rem;
}

.rha-sponsor-footer{
    margin-top:4rem;
    text-align:center;
    max-width:820px;
    margin-left:auto;
    margin-right:auto;
}

.rha-sponsor-footer p{
    font-size:1.05rem;
    line-height:2;
}

@media(max-width:900px){

.rha-support-grid{
    grid-template-columns:repeat(2,1fr);
}

}

@media(max-width:600px){

.rha-support-grid{
    grid-template-columns:1fr;
}

.rha-sponsor-highlight{
    padding:2rem;
}

.rha-sponsor-highlight h3{
    font-size:1.8rem;
}

}

.rha-paypal-section{
    margin-top:20px;
}

.rha-amount-input{
    width:100%;
    padding:15px;
    border-radius:12px;
    border:none;
    font-size:18px;
    margin-bottom:20px;
}

/* ---------- footer ---------- */
.rha-footer{background:var(--rha-ink-2); color:rgba(255,255,255,.78); padding:4.5rem 0 2rem;}
.rha-footer-grid{position:relative; z-index:2; display:grid; grid-template-columns:1.3fr 1fr 1fr; gap:3rem; padding-bottom:3rem; border-bottom:1px solid rgba(255,255,255,.1);}
.rha-footer-brand{display:flex; align-items:center; gap:.8rem; margin-bottom:1.1rem;}
.rha-footer-name{font-weight:600; color:#fff; font-size:1.05rem; font-family:'Fredoka',sans-serif;}
.rha-footer-grid > div:first-child p{color:rgba(255,255,255,.55); font-size:.92rem; max-width:320px;}
.rha-footer-col h4{color:#fff; font-size:.92rem; margin-bottom:1.1rem; font-family:'Fredoka',sans-serif;}
.rha-footer-col div{color:rgba(255,255,255,.6); font-size:.89rem; margin-bottom:.6rem; line-height:1.6;}
.rha-footer-col strong{color:#fff; display:block; font-weight:600; margin-bottom:.15rem;}
.rha-footer-bottom{position:relative; z-index:2; display:flex; justify-content:space-between; align-items:center; padding-top:1.6rem; flex-wrap:wrap; gap:1rem; font-size:.84rem; color:rgba(255,255,255,.45);}
.rha-footer-tag{font-family:'Fredoka',sans-serif; color:var(--rha-marigold);}
@media (max-width:800px){ .rha-footer-grid{grid-template-columns:1fr; gap:2rem;} .rha-footer-bottom{flex-direction:column; align-items:flex-start;} }

@media (max-width:600px){
  .rha section{padding:4.5rem 0;}
  .rha-hero-actions .rha-btn{width:100%; justify-content:center;}
}

@font-face{font-family:'__rha-noop';src:local('Arial');}
`;

/* Load display + body webfonts once (Fredoka for headings, Plus Jakarta Sans for body). */
if (typeof document !== 'undefined' && !document.getElementById('rha-fonts')) {
  const link = document.createElement('link');
  link.id = 'rha-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
  document.head.appendChild(link);
}


export default HomePage;


