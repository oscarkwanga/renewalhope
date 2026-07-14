import React, { useMemo, useState } from 'react';
const API_BASE_URL = process.env.REACT_APP_DOMAIN || "";






const adminSections = [
  { key: 'overview', label: 'Overview' },
  { key: 'settings', label: 'Settings' },
  { key: 'sermons', label: 'Sermons' },
  { key: 'events', label: 'Events' },
  { key: 'ministries', label: 'Ministries' },
  {key :'stories' , label:'Stories'}
  
];









function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
 // const [content, setContent] = useState(initialData);

 

const [testimonies, setTestimonies] = useState([{ id: 1, title: 'Community Outreach Day', date: 'July 18', location: 'North Garden Hall', summary: 'Join us for service, connection, and neighborhood care.', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1000&q=80' }]);
const [announcements, setAnnouncements] = useState([{ id: 1, title: 'Community Outreach Day', date: 'July 18', location: 'North Garden Hall', summary: 'Join us for service, connection, and neighborhood care.', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1000&q=80' }]);
const [leadership, setLeadership] = useState([{ id: 1, title: 'Community Outreach Day', date: 'July 18', location: 'North Garden Hall', summary: 'Join us for service, connection, and neighborhood care.', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1000&q=80' }]);
const [messages, setMessages] = useState([{ id: 1, title: 'Community Outreach Day', date: 'July 18', location: 'North Garden Hall', summary: 'Join us for service, connection, and neighborhood care.', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1000&q=80' }]);
const [users, setUsers] = useState([{ id: 1, title: 'Community Outreach Day', date: 'July 18', location: 'North Garden Hall', summary: 'Join us for service, connection, and neighborhood care.', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1000&q=80' }]);
const [media, setMedia] = useState([{ id: 1, title: 'Community Outreach Day', date: 'July 18', location: 'North Garden Hall', summary: 'Join us for service, connection, and neighborhood care.', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1000&q=80' }]);
const [settings, setSettings] = useState({
    siteName: "",
    tagline: "",
    email: "",
    address: ""
});

/*

async function createSermon(data){

    try{

        const response = await api.post("/sermons",data);

        setSermons(previous=>[
            ...previous,
            response.data
        ]);

    }catch(error){

        console.log(error);

    }

}

async function updateSermon(id,data){

    try{

        const response=await api.put(
            `/sermons/${id}`,
            data
        );

        setSermons(previous=>

            previous.map(item=>

                item.id===id

                ?response.data

                :item

            )

        );

    }catch(error){

        console.log(error);

    }

}

async function deleteSermon(id){

    try{

        await api.delete(`/sermons/${id}`);

        setSermons(previous=>

            previous.filter(item=>item.id!==id)

        );

    }

    catch(error){

        console.log(error);

    }

}


*/





 
 
 
 
 
  const stats = useMemo(() => [
   // { label: 'Sermons', value: content.sermons.length },
   // { label: 'Events', value: content.events.length },
   // { label: 'Messages', value: content.messages.length },
    //{ label: 'Users', value: content.users.length },
  ], []);

  const handleLogin = (event) => {
    event.preventDefault();
    if (authForm.email.includes('@') && authForm.password.length >= 4) {
      setIsAuthenticated(true);
      setActiveTab('overview');
    }
  };

  const addEntry = (section, entry) => {
    const image = entry.image || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80';
  //  setContent((current) => ({ ...current, [section]: [...current[section], { id: Date.now(), ...entry, image }] }));
  };

  const updateEntry = (section, id, entry) => {
   // setContent((current) => ({ ...current, [section]: current[section].map((item) => item.id === id ? { ...item, ...entry } : item) }));
  };

  const deleteEntry = (section, id) => {
  //  setContent((current) => ({ ...current, [section]: current[section].filter((item) => item.id !== id) }));
  };

  return (
    <div className="page-shell page-shell--admin">
      <div className="container admin-shell">
        <aside className="admin-sidebar">
          <div>
            <p className="eyebrow">Administration</p>
            <h2>Control center</h2>
            <p className="section-copy">Manage content, media, messages, and settings from one premium workspace.</p>
          </div>
          <div className="admin-nav">
            {adminSections.map((section) => (
              <button key={section.key} className={`admin-nav__button ${activeTab === section.key ? 'is-active' : ''}`} onClick={() => setActiveTab(section.key)}>{section.label}</button>
            ))}
          </div>
          <button className="button button--secondary" onClick={() => setIsAuthenticated(false)}>Log out</button>
        </aside>

        <section className="admin-main">
          {!isAuthenticated ? (
            <form className="auth-card" onSubmit={handleLogin}>
              <h3>Secure dashboard access</h3>
              <p className="section-copy">Sign in to edit sermons, events, ministries, and more.</p>
              <label>
                <span>Email</span>
                <input value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} placeholder="name@example.com" />
              </label>
              <label>
                <span>Password</span>
                <input type="password" value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} placeholder="••••••" />
              </label>
              <button type="submit" className="button button--primary">Sign in</button>
            </form>
          ) : activeTab === 'overview' ? (
            <div>
              <h2>Operational overview</h2>
              <div className="stats-grid">
                {stats.map((item) => (
                  <article className="stat-card" key={item.label}>
                    <h3>{item.value}</h3>
                    <p>{item.label}</p>
                  </article>
                ))}
              </div>
            </div>
          ) : activeTab === 'settings' ? (
            <SettingsEditor  />
          ) : activeTab === 'sermons' ? (
            <SermonsEditor  />
          ) : activeTab ==='ministries'? (
            <MinistryEditor  />
          ) : activeTab ==='events'? (
            <EventEditor  />
          ) : activeTab ==='stories' ? (
            <StoryEditor  />
          ) : (
            <div>
              <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
              </div>
          )}
        </section>
      </div>
    </div>
  );
}

function SettingsEditor() {
 // const [draft, setDraft] = useState([]);

  const save = (event) => {
    event.preventDefault();
   // setContent((current) => ({ ...current, settings: draft }));
  };

  return (
    <form className="admin-form" onSubmit={save}>
      <h3>Site settings</h3>
     {/*  <label><span>Site name</span><input value={draft?.siteName} onChange={(event) => setDraft({ ...draft, siteName: event.target.value })} /></label>
      <label><span>Tagline</span><input value={draft?.tagline} onChange={(event) => setDraft({ ...draft, tagline: event.target.value })} /></label>
      <label><span>Email</span><input value={draft?.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /></label>
      <label><span>Address</span><input value={draft?.address} onChange={(event) => setDraft({ ...draft, address: event.target.value })} /></label>
     */} <button className="button button--primary" type="submit">Save settings</button>
    </form>
  );
}


//SERMONS EDITOR


const SermonsEditor=()=> {
  
const [sermons, setSermons] = useState([]);
const [id,setid]=useState(Math.floor(Math.random()*1000));
const [slug,setSlug]=useState("");
const [title,setTitle]=useState("");
const [speaker,setSpeaker]=useState("");
const [date,setDate]=useState("");
const [readingTime,setReadingTime]=useState("");
const [image,setImage]=useState("");
const [introduction,setIntroduction]=useState("");
const [sections,setSections]=useState([]);
const [scripture,setScripture]=useState("");
const [keyVerse,setKeyVerse]=useState("");
const [quote,setQuote]=useState("");
const [reflection,setReflection]=useState([]);
const [prayer,setPrayer]=useState("");
const [sectionTitle,setSectionTitle]=useState("");
const [sectionContent,setSectionContent]=useState("");








  const addSection=(st,sc)=>{
    if (!st.trim() || !sc) {
      alert("Please fill in all section fields.");
      return;
    }
    setSections([...sections, { title: st, content: sc }]);
    setSectionTitle("");
    setSectionContent("");
    alert(sections.length)
  };



  //send data to node server 

 const sendSermonData = async (e) => {
  e.preventDefault();

  try {
    const sermonData = {
      id,
      slug,
      title,
      speaker,
      date,
      readingTime,
      image,
      introduction,
      sections,
      scripture,
      keyVerse,
      quote,
      reflection,
      prayer,
    };

    const response = await fetch(`${API_BASE_URL}/api/sermons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sermonData),
    });

    const data = await response.json();

    console.log(data);
    alert("Sermon saved successfully");
  } catch (err) {
    console.error(err);
  }
};

  return (
    <form className="admin-form" onSubmit={sendSermonData} >
      <h3>Sermons</h3>
      <label><span>Slug</span><input value={slug} onChange={(event) => setSlug(event.target.value)} /></label>
      <label><span>Title</span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
      <label><span>Speaker</span><input value={speaker} onChange={(event) => setSpeaker(event.target.value)} /></label>
      <label><span>Date</span><input value={date} onChange={(event) => setDate(event.target.value)} /></label>
   <label><span>Reading time</span><input value={readingTime} onChange={(event) => setReadingTime(event.target.value)} /></label>
   <label><span>Scripture</span><input value={scripture} onChange={(event) => setScripture(event.target.value)} /></label>
   <label><span>Introduction</span><input value={introduction} onChange={(event) => setIntroduction(event.target.value)} /></label>
   <label><span>Key verse</span><input value={keyVerse} onChange={(event) => setKeyVerse(event.target.value)} /></label>
   <label><span>Quote</span><input value={quote} onChange={(event) => setQuote(event.target.value)} /></label>
   <label><span>Reflection</span><input value={reflection} onChange={(event) => setReflection(event.target.value)} /></label>
   <label><span>Prayer</span><input value={prayer} onChange={(event) => setPrayer(event.target.value)} /></label>
     <label><span>Image</span><input value={image} onChange={(event) => setImage(event.target.value)} /></label>
   <h3 style={{ marginTop: '20px',color:'#f43e3e' }}>Sections</h3>
   <label><span>Section title</span><input value={sectionTitle} onChange={(event) => setSectionTitle(event.target.value)} /></label>
   <label><span>Section content</span><input value={sectionContent} onChange={(event) => setSectionContent(event.target.value)} /></label>
   <button
    type="button"
    className="button button--secondary"
    onClick={() => addSection(sectionTitle, sectionContent)}
>

    + Add Section

</button>
      <button  className="button button--primary" type="submit">Submit data</button>
    </form>
  );
}


//EVENTS EDITOR



const EventEditor=()=> {
  
const [events, setEvents] = useState([]);
const [id,setid]=useState(Math.floor(Math.random()*1000));
const [title,setTitle]=useState("");
const [date,setDate]=useState("");
const [time,setTime]=useState("");
const [description,setDescription]=useState("");
const [image,setImage]=useState("");

  //send data to node server 
 const sendEventData = async (e) => {
  e.preventDefault();

  try {
    const eventData = {
      id,
     title,
     date,
     time,
     description,
     image
    };

    const response = await fetch(`${API_BASE_URL}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    const data = await response.json();

    console.log(data);
    alert("Events saved successfully");
  } catch (err) {
    console.error(err);
  }
};

  return (
    <form className="admin-form" onSubmit={sendEventData} >
      <h3>Events</h3>
      <label><span>Title</span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
      <label><span>Date</span><input value={date} onChange={(event) => setDate(event.target.value)} /></label>
 <label><span>Time</span><input value={time} onChange={(event) => setTime(event.target.value)} /></label>
 <label><span>Description</span><input value={description} onChange={(event) => setDescription(event.target.value)} /></label>
 <label><span>Image</span><input value={image} onChange={(event) => setImage(event.target.value)} /></label>

      <button  className="button button--primary" type="submit">Submit data</button>
    </form>
  );
}




//STORIES EDITOR



const StoryEditor=()=> {
  
const [stories, setStories] = useState([]);
const [id,setid]=useState(Math.floor(Math.random()*1000));
const [title,setTitle]=useState("");
const [text,setText]=useState("");
const [image,setImage]=useState("");


  //send data to node server 
 const sendStoryData = async (e) => {
  e.preventDefault();

  try {
    const storyData = {
      id,
     title,
   text,
   image
    };

    const response = await fetch(`${API_BASE_URL}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(storyData),
    });

    const data = await response.json();

    console.log(data);
    alert("Stories saved successfully");
  } catch (err) {
    console.error(err);
  }
};

  return (
    <form className="admin-form" onSubmit={sendStoryData} >
      <h3>Stories</h3>
      <label><span>Title</span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
      <label><span>Text</span><input value={text} onChange={(event) => setText(event.target.value)} /></label>
 <label><span>Image</span><input value={image} onChange={(event) => setImage(event.target.value)} /></label>

      <button  className="button button--primary" type="submit">Submit data</button>
    </form>
  );
}


//MINISTRIES EDITOR



const MinistryEditor=()=> {
  
const [ministries, setMinistries] = useState([]);
const [id,setid]=useState(Math.floor(Math.random()*1000));
const [title,setTitle]=useState("");
const [subtitle,setSubtitle]=useState("");
const [description,setDescription]=useState("");
const [image,setImage]=useState("");


  //send data to node server 
 const sendMinistryData = async (e) => {
  e.preventDefault();

  try {
    const ministryData = {
      id,
     title,
   subtitle,
   descriiption,
   image,
    };

    const response = await fetch(`${API_BASE_URL}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ministryData),
    });

    const data = await response.json();

    console.log(data);
    alert("Ministries saved successfully");
  } catch (err) {
    console.error(err);
  }
};

  return (
    <form className="admin-form" onSubmit={sendStoryData} >
      <h3>Ministries</h3>
      <label><span>Title</span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
      <label><span>Subtitle</span><input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} /></label>
       <label><span>Description</span><input value={description} onChange={(event) => setDescription(event.target.value)} /></label>
 <label><span>Image</span><input value={image} onChange={(event) => setImage(event.target.value)} /></label>

      <button  className="button button--primary" type="submit">Submit data</button>
    </form>
  );
}


//GALLERY EDITOR

//TESTIMONIES EDITOR

//ANNOUNCEMENTS EDITOR

//LEADERSHIP EDITOR

//MESSAGES EDITOR

//USERS EDITOR

//MEDIA EDITOR


{/*
  
function CrudSection({ section, items, onAdd, onUpdate, onDelete }) {
  const fieldMap = {
    sermons: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'speaker', label: 'Speaker', type: 'text' },
      { key: 'date', label: 'Date', type: 'text' },
      { key: 'summary', label: 'Summary', type: 'textarea' },
      { key: 'image', label: 'Image URL', type: 'text' },
    ],
    events: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'date', label: 'Date', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'summary', label: 'Summary', type: 'textarea' },
      { key: 'image', label: 'Image URL', type: 'text' },
    ],
    ministries: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'focus', label: 'Focus', type: 'text' },
      { key: 'summary', label: 'Summary', type: 'textarea' },
      { key: 'image', label: 'Image URL', type: 'text' },
    ],
    blog: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'summary', label: 'Summary', type: 'textarea' },
      { key: 'image', label: 'Image URL', type: 'text' },
    ],
    gallery: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'caption', label: 'Caption', type: 'text' },
      { key: 'image', label: 'Image URL', type: 'text' },
    ],
    testimonies: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'quote', label: 'Quote', type: 'textarea' },
    ],
    announcements: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'body', label: 'Body', type: 'textarea' },
    ],
    leadership: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'bio', label: 'Bio', type: 'textarea' },
    ],
    messages: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'message', label: 'Message', type: 'textarea' },
    ],
    users: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'role', label: 'Role', type: 'text' },
    ],
    media: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'type', label: 'Type', type: 'text' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
      { key: 'image', label: 'Image URL', type: 'text' },
    ],
  };

  const fields = fieldMap[section] || [];
  const [formData, setFormData] = useState(() => fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {}));
  const [editingId, setEditingId] = useState(null);

  const reset = () => {
    setFormData(fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {}));
    setEditingId(null);
  };

  const submit = (event) => {
    event.preventDefault();
    if (editingId) {
      onUpdate(editingId, formData);
    } else {
      onAdd(formData);
    }
    reset();
  };

  return (
    <div className="admin-grid">
      <form className="admin-form" onSubmit={submit}>
        <h3>{section.charAt(0).toUpperCase() + section.slice(1)}</h3>
        {fields.map((field) => (
          <label key={field.key}>
            <span>{field.label}</span>
            {field.type === 'textarea' ? (
              <textarea value={formData[field.key] || ''} onChange={(event) => setFormData({ ...formData, [field.key]: event.target.value })} />
            ) : (
              <input value={formData[field.key] || ''} onChange={(event) => setFormData({ ...formData, [field.key]: event.target.value })} />
            )}
          </label>
        ))}
        <button className="button button--primary" type="submit">{editingId ? 'Update item' : 'Add item'}</button>
      </form>

      <div className="list-card">
        {items.map((item) => (
          <div className="list-row" key={item.id}>
            <div>
              <strong>{item.title || item.name || item.siteName || section}</strong>
              <p>{item.summary || item.body || item.quote || item.message || item.notes || item.bio || item.caption || item.role || item.type || item.location || item.category || item.focus || ''}</p>
              {item.image ? <img src={item.image} alt={item.title || item.name} className="preview-image" /> : null}
            </div>
            <div className="row-actions">
              <button className="button button--ghost" onClick={() => { setEditingId(item.id); setFormData(item); }}>Edit</button>
              <button className="button button--secondary" onClick={() => onDelete(item.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
  */
  }

export default AdminPage;
