import React, { useEffect, useMemo, useState,useRef } from 'react';
import { io } from 'socket.io-client';
const API_BASE_URL = "https://church-backend-48tj.onrender.com";





const adminSections = [
  { key: 'overview', label: 'Overview' },
  { key: 'sermons', label: 'Sermons' },
  { key: 'events', label: 'Events' },
  { key: 'ministries', label: 'Ministries' },
  {key:'stories',label:'Stories'},

  {key:'milestones',label:'Milestones'},
  {key:'pastors', label:'pastoral'},
  {key:'culture',label:'Culture'},
  {key:'construction',label:'Construction'},
];









function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
 // const [content, setContent] = useState(initialData);


  const handleLogin = (event) => {
    event.preventDefault();
    if (authForm.email.includes('@') && authForm.password.length >= 4) {
      setIsAuthenticated(true);
      setActiveTab('overview');
    }
  };

 
  
  
    //DOING CRUD
  
      const [events, setEvents] = React.useState([]);
    const [stories, setStories] = React.useState([]);
     const [ministries, setMinistries] = React.useState([]);
       const [sermons, setSermons] = useState([]);
       const [pastors,setPastors] = useState([]);
       const [milestones,setMilestones]= useState([]);
  const [cultures,setCultures]=useState([]);
  const [constructions,setConstructions]=useState([]);
  
    
     useEffect(() => {
        // socket live adds
        const socket = io(API_BASE_URL, { transports: ['websocket'] });
        socket.on('connect', () => { /* connected */ });
        socket.on('getstory', (prod) => { if (prod) setStories(prev => [prod, ...prev]); });
          socket.on('getconstruction', (prod) => { if (prod) setConstructions(prev => [prod, ...prev]); });
         socket.on('getculture', (prod) => { if (prod) setCultures(prev => [prod, ...prev]); });
         socket.on('getsermon', (prod) => { if (prod) setSermons(prev => [prod, ...prev]); });
           socket.on('getministry', (prod) => { if (prod) setMinistries(prev => [prod, ...prev]); });
             socket.on('getevent', (prod) => { if (prod) setEvents(prev => [prod, ...prev]); });
               socket.on('getpastor', (prod) => { if (prod) setPastors(prev => [prod, ...prev]); });
               socket.on('getmilestone', (prod) => { if (prod) setMilestones(prev => [prod, ...prev]); });
                    socket.on('updatestory', (prod) => { if (prod) setStories(prev => [prod, ...prev]); });
          socket.on('updateconstruction', (prod) => { if (prod) setConstructions(prev => [prod, ...prev]); });
         socket.on('updateculture', (prod) => { if (prod) setCultures(prev => [prod, ...prev]); });
         socket.on('updatesermon', (prod) => { if (prod) setSermons(prev => [prod, ...prev]); });
           socket.on('updateministry', (prod) => { if (prod) setMinistries(prev => [prod, ...prev]); });
             socket.on('updateevent', (prod) => { if (prod) setEvents(prev => [prod, ...prev]); });
               socket.on('updatepastor', (prod) => { if (prod) setPastors(prev => [prod, ...prev]); });
               socket.on('updatemilestone', (prod) => { if (prod) setMilestones(prev => [prod, ...prev]); });
  socket.on('deletesermon', (id) => {
   setSermons(prev =>
      prev.filter(item => item._id !== id)
   );
});

socket.on('deleteevent', (id) => {
   setEvents(prev =>
      prev.filter(item => item._id !== id)
   );
});


socket.on('deleteconstruction', (id) => {
   setConstructions(prev =>
      prev.filter(item => item._id !== id)
   );
});

socket.on('deleteministry', (id) => {
   setMinistries(prev =>
      prev.filter(item => item._id !== id)
   );
});

socket.on('deletestory', (id) => {
   setStories(prev =>
      prev.filter(item => item._id !== id)
   );
});


socket.on('deleteculture', (id) => {
   setCultures(prev =>
      prev.filter(item => item._id !== id)
   );
});

socket.on('deletemilestone', (id) => {
   setMilestones(prev =>
      prev.filter(item => item._id !== id)
   );
});

socket.on('deletepastor', (id) => {
   setPastors(prev =>
      prev.filter(item => item._id !== id)
   );
});


socket.on("updatesermon",(updated)=>{setSermons(prev=>prev.map(item=>item._id===updated._id? updated: item));});
socket.on("updateevent",(updated)=>{setEvents(prev=>prev.map(item=>item._id===updated._id? updated: item));});
socket.on("updatemilestone",(updated)=>{setMilestones(prev=>prev.map(item=>item._id===updated._id? updated: item));});
socket.on("updatestory",(updated)=>{setStories(prev=>prev.map(item=>item._id===updated._id? updated: item));});
socket.on("updateculture",(updated)=>{setCultures(prev=>prev.map(item=>item._id===updated._id? updated: item));});
socket.on("updateministry",(updated)=>{setMinistries(prev=>prev.map(item=>item._id===updated._id? updated: item));});
socket.on("updatepastor",(updated)=>{setPastors(prev=>prev.map(item=>item._id===updated._id? updated: item));});
socket.on("updateconstruction",(updated)=>{setConstructions(prev=>prev.map(item=>item._id===updated._id? updated: item));});







        return () => socket.disconnect();
      }, []);
    
  
  
      
      const getStories = async () => {
          try {
              const response = await fetch(`${API_BASE_URL}/api/stories`);
      
              if (!response.ok) {
                  throw new Error("Failed to fetch stories");
              }
      
              const data = await response.json();
      
              setStories(data);
      
          } catch (err) {
              console.error(err);
          }
      };







      
      const getConstructions = async () => {
          try {
              const response = await fetch(`${API_BASE_URL}/api/constructions`);
      
              if (!response.ok) {
                  throw new Error("Failed to fetch constructions");
              }
      
              const data = await response.json();
      
              setConstructions(data);
      
          } catch (err) {
              console.error(err);
          }
      };






      
      
      const getCultures = async () => {
          try {
              const response = await fetch(`${API_BASE_URL}/api/cultures`);
      
              if (!response.ok) {
                  throw new Error("Failed to fetch cultures");
              }
      
              const data = await response.json();
      
              setCultures(data);
      
          } catch (err) {
              console.error(err);
          }
      };





        const getMilestones = async () => {
          try {
              const response = await fetch(`${API_BASE_URL}/api/milestones`);
      
              if (!response.ok) {
                  throw new Error("Failed to fetch stories");
              }
      
              const data = await response.json();
      
              setMilestones(data);
      
          } catch (err) {
              console.error(err);
          }
      };




        const getPastors = async () => {
          try {
              const response = await fetch(`${API_BASE_URL}/api/pastors`);
      
              if (!response.ok) {
                  throw new Error("Failed to fetch stories");
              }
      
              const data = await response.json();
      
              setPastors(data);
      
          } catch (err) {
              console.error(err);
          }
      };
  
  
        
     
      
        
          const getMinistries = async () => {
          try {
              const response = await fetch(`${API_BASE_URL}/api/ministries`);
      
              if (!response.ok) {
                  throw new Error("Failed to fetch ministries");
              }
      
              const data = await response.json();
      
              setMinistries(data);
      
          } catch (err) {
              console.error(err);
          }
      };
  
      
      
      
        const getEvents = async () => {
          try {
              const response = await fetch(`${API_BASE_URL}/api/events`);
      
              if (!response.ok) {
                  throw new Error("Failed to fetch events");
              }
      
              const data = await response.json();
      
              setEvents(data);
      
          } catch (err) {
              console.error(err);
          }
      };
      
  
  
  
  
  const getSermons = async () => {
      try {
          const response = await fetch(`${API_BASE_URL}/api/sermons`);
  
          if (!response.ok) {
              throw new Error("Failed to fetch sermons");
          }
  
          const data = await response.json();
  
          setSermons(data);
  
      } catch (err) {
          console.error(err);
      }
  };
  
      

  
      
      
      
      useEffect(() => {
          getStories();
          getMinistries();
  getEvents();
  getSermons();
  getMilestones();
  getPastors();
  getCultures();
  getConstructions();
      }, []);
  
  

  

    
  
  
  const stats =[
   { label: 'Sermons', value: sermons?.length },
    { label: 'Events', value: events?.length },
    { label: 'Stories', value : stories?.length },
    { label: 'Milestones', value:milestones?.length },
     { label: 'Ministries', value:ministries?.length },
      { label: 'Pastoral', value:pastors?.length },
      {label:'Church culture' , value:cultures?.length},
      {label:'Construction Gallery',value:constructions.length},
  ];

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
          ) :activeTab ==='culture' ?(
            <CultureEditor />
          ) : activeTab === 'milestones' ?(
 <MilestoneEditor />
          ):activeTab === 'construction' ?(
            <ConstructionEditor />
          ) : activeTab ==='pastors' ? (
            <PastorEditor />
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

const [prayer,setPrayer]=useState("");
const [sectionTitle,setSectionTitle]=useState("");
const [sectionContent,setSectionContent]=useState("");
const fileInputRef = useRef(null);
const [editingId, setEditingId] = useState(null);




 
  const getSermons = async () => {
      try {
          const response = await fetch(`${API_BASE_URL}/api/sermons`);
  
          if (!response.ok) {
              throw new Error("Failed to fetch sermons");
          }
  
          const data = await response.json();
  
          setSermons(data);
  
      } catch (err) {
          console.error(err);
      }
  };



  
    //DOING CRUD
     useEffect(() => {
        // socket live adds
        const socket = io(API_BASE_URL, { transports: ['websocket'] });
        socket.on('connect', () => { /* connected */ });
         socket.on('getsermon', (prod) => { if (prod) setSermons(prev => [prod, ...prev]); });
  socket.on('deletesermon', (id) => {
   setSermons(prev =>
      prev.filter(item => item._id !== id)
   );
});
socket.on("updatesermon",(updated)=>{setSermons(prev=>prev.map(item=>item._id===updated._id? updated: item));});
        return () => socket.disconnect();
      }, []);
    
      
      useEffect(() => {
  getSermons();
      }, []);
  
  



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


  const editSermon = (sermon) => {

    setEditingId(sermon._id);

    setSlug(sermon.slug);
    setTitle(sermon.title);
    setSpeaker(sermon.speaker);
    setDate(sermon.date?.split("T")[0]);
    setReadingTime(sermon.readingTime);
    setIntroduction(sermon.introduction);
    setScripture(sermon.scripture);
    setKeyVerse(sermon.keyVerse);
    setQuote(sermon.quote);
    setPrayer(sermon.prayer);

    setSections(sermon.sections || []);

};



  //send data to node server 
const sendSermonData = async (e) => {
    e.preventDefault();

    try {

        const formData = new FormData();

        formData.append("id", id);
        formData.append("slug", slug);
        formData.append("title", title);
        formData.append("speaker", speaker);
        formData.append("date", date);
        formData.append("readingTime", readingTime);
        formData.append("introduction", introduction);
        formData.append("scripture", scripture);
        formData.append("keyVerse", keyVerse);
        formData.append("quote", quote);
        formData.append("prayer", prayer);
formData.append("sections", JSON.stringify(sections));

        if(image){
            formData.append("image", image);
        }

       const url = editingId
    ? `${API_BASE_URL}/api/sermons/${editingId}`
    : `${API_BASE_URL}/api/sermons`;

const method = editingId ? "PUT" : "POST";

const response = await fetch(url,{
    method,
    body:formData
});

        const data = await response.json();

      const resetForm = () => {
    setid(Math.floor(Math.random() * 1000));
    setSlug("");
    setTitle("");
    setSpeaker("");
    setDate("");
    setReadingTime("");
    setIntroduction("");
    setScripture("");
    setKeyVerse("");
    setQuote("");
    setPrayer("");
    setSections([]);
    setSectionTitle("");
    setSectionContent("");
    setImage(null);

    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    setEditingId(null);
};

        alert("Sermon uploaded successfully");
resetForm();

    }
    catch(err){

        console.log(err);

    }
};





//function to delete sermon
const deleteSermon = async (id) => {
console.log(id)
   try {
  alert('deleated',id)
      await fetch(
         `${API_BASE_URL}/api/sermons/${id}`,
         {
            method: 'DELETE'
         }
      );

    

   } catch (err) {

      console.log(err);

   }

};




  return (
    <>
    <form className="admin-form" onSubmit={sendSermonData} >
      <h3>Site settings</h3>
      <label><span>Slug</span><input value={slug} onChange={(event) => setSlug(event.target.value)} /></label>
      <label><span>Title</span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
      <label><span>Speaker</span><input value={speaker} onChange={(event) => setSpeaker(event.target.value)} /></label>
      <label><span>Date</span><input  type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
   <label><span>Reading time</span><input value={readingTime} onChange={(event) => setReadingTime(event.target.value)} /></label>
   <label><span>Scripture</span><input value={scripture} onChange={(event) => setScripture(event.target.value)} /></label>
   <label><span>Introduction</span><input value={introduction} onChange={(event) => setIntroduction(event.target.value)} /></label>
   <label><span>Key verse</span><input value={keyVerse} onChange={(event) => setKeyVerse(event.target.value)} /></label>
   <label><span>Quote</span><input value={quote} onChange={(event) => setQuote(event.target.value)} /></label>
  
   <label><span>Prayer</span><input value={prayer} onChange={(event) => setPrayer(event.target.value)} /></label>
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
<label>
    <span>Upload Image</span>

    <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
    />

</label>
     <button
className="button button--primary"
type="submit"
>
{editingId ? "Update Sermon" : "Submit Sermon"}
</button>
    </form>




        <section className="section container">
        <div className="section-heading">
          
        </div>
        <div className="card-grid">
          {sermons.map((item) => (
            <article className="card" key={item._id}>
              {item?.image && <img src={item.image} alt={item.title} className="card-image" /> }
              <div className="card-body">
                <h3>{item?.title || item?.name}</h3>
                <p>{item?.text || item?.description || item?.introduction}</p>
              </div>
               <div className="row-actions">
         <button
className="button button--ghost"
onClick={()=>editSermon(item)}
>
Edit
</button>
             <button
   className="button button--secondary"
   onClick={()=>deleteSermon(item._id)}
>
   Remove
</button>
            </div>
            </article>
          ))}
</div>
</section>
          </>
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
const fileInputRef = useRef(null);
const [editingId, setEditingId] = useState(null);





      
      
        const getEvents = async () => {
          try {
              const response = await fetch(`${API_BASE_URL}/api/events`);
      
              if (!response.ok) {
                  throw new Error("Failed to fetch events");
              }
      
              const data = await response.json();
      
              setEvents(data);
      
          } catch (err) {
              console.error(err);
          }
      };





      
    //DOING CRUD
     useEffect(() => {
        // socket live adds
        const socket = io(API_BASE_URL, { transports: ['websocket'] });
        socket.on('connect', () => { /* connected */ });
         socket.on('getevent', (prod) => { if (prod) setEvents(prev => [prod, ...prev]); });
  socket.on('deleteevent', (id) => {
   setEvents(prev =>
      prev.filter(item => item._id !== id)
   );
});
socket.on("updateevent",(updated)=>{setEvents(prev=>prev.map(item=>item._id===updated._id? updated: item));});
        return () => socket.disconnect();
      }, []);
    
      
      useEffect(() => {
  getEvents();
      }, []);
  




const editEvent = (event) => {

    setEditingId(event._id);

    setTitle(event.title);
    setDate(event.date?.split("T")[0]);
    setTime(event.time);
    setDescription(event.description);

};



  //send data to node server 
const sendEventData = async (e) => {
    e.preventDefault();

    try {

        const formData = new FormData();

        formData.append("id", id);
        formData.append("title", title);
        formData.append("date", date);
        formData.append("time", time);
        formData.append("description", description);

        if (image) {
            formData.append("image", image);
        }

       const url = editingId
    ? `${API_BASE_URL}/api/events/${editingId}`
    : `${API_BASE_URL}/api/events`;

const method = editingId ? "PUT" : "POST";

const response = await fetch(url,{
    method,
    body:formData
});

        const data = await response.json();



const resetForm = () => {
    setid(Math.floor(Math.random() * 1000));
    setTitle("");
    setDate("");
    setTime("");
    setDescription("");
    setImage(null);

    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    setEditingId(null);
};


     alert("Events saved successfully");
resetForm();

    } catch (err) {
        console.error(err);
    }
};





//function to delete event
const deleteEvent = async (id) => {

   try {

      await fetch(
         `${API_BASE_URL}/api/events/${id}`,
         {
            method: 'DELETE'
         }
      );

   } catch (err) {

      console.log(err);

   }

};





  return (
    <>
    <form className="admin-form" onSubmit={sendEventData} >
      <h3>Events</h3>
      <label><span>Title</span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
      <label><span>Date</span><input  type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
 <label><span>Time</span><input value={time} onChange={(event) => setTime(event.target.value)} /></label>
 <label><span>Description</span><input value={description} onChange={(event) => setDescription(event.target.value)} /></label>
 
<label>
    <span>Upload Image</span>

    <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
    />

</label>
    <button className="button button--primary" type="submit">
    {editingId ? "Update Event" : "Submit Event"}
</button>
    </form>



 { events.map((item) => (
            <article className="card" key={item._id}>
              {item?.image && <img src={item.image} alt={item.title} className="card-image" /> }
              <div className="card-body">
                <h3>{item?.title || item?.name}</h3>
                <p>{item?.text || item?.description || item?.introduction}</p>
              </div>
               <div className="row-actions">
             <button
className="button button--ghost"
onClick={()=>editEvent(item)}
>
Edit
</button>
            <button
   className="button button--secondary"
   onClick={()=>deleteEvent(item._id)}
>
   Remove
</button>
            </div>
            </article>
          ))
        
}
    </>
  );
}




//STORIES EDITOR

const StoryEditor=()=> {
  
const [stories, setStories] = useState([]);
const [id,setid]=useState(Math.floor(Math.random()*1000));
const [title,setTitle]=useState("");
const [text,setText]=useState("");
const [image,setImage]=useState("");
const fileInputRef = useRef(null);
const [editingId, setEditingId] = useState(null);





      const getStories = async () => {
          try {
              const response = await fetch(`${API_BASE_URL}/api/stories`);
      
              if (!response.ok) {
                  throw new Error("Failed to fetch stories");
              }
      
              const data = await response.json();
      
              setStories(data);
      
          } catch (err) {
              console.error(err);
          }
      };





      
    //DOING CRUD
     useEffect(() => {
        // socket live adds
        const socket = io(API_BASE_URL, { transports: ['websocket'] });
        socket.on('connect', () => { /* connected */ });
         socket.on('getstory', (prod) => { if (prod) setStories(prev => [prod, ...prev]); });
  socket.on('deletestory', (id) => {
   setStories(prev =>
      prev.filter(item => item._id !== id)
   );
});
socket.on("updatestory",(updated)=>{setStories(prev=>prev.map(item=>item._id===updated._id? updated: item));});
        return () => socket.disconnect();
      }, []);
    
      
      useEffect(() => {
  getStories();
      }, []);
  







const editStory=(story)=>{

setEditingId(story._id);

setTitle(story.title);

setText(story.text);

}



  //send data to node server 
const sendStoryData = async (e) => {
    e.preventDefault();

    try {

        const formData = new FormData();

        formData.append("id", id);
        formData.append("title", title);
        formData.append("text", text);

        if (image) {
            formData.append("image", image);
        }

         const url = editingId
    ? `${API_BASE_URL}/api/stories/${editingId}`
    : `${API_BASE_URL}/api/stories`;

const method = editingId ? "PUT" : "POST";

const response = await fetch(url,{
    method,
    body:formData
});


        const data = await response.json();
const resetForm = () => {
    setid(Math.floor(Math.random() * 1000));
    setTitle("");
    setText("");
    setImage(null);

    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    setEditingId(null);
};
        alert("Stories saved successfully");
resetForm();

    } catch (err) {
        console.error(err);
    }
};




//function to delete story
const deleteStory = async (id) => {

   try {

      await fetch(
         `${API_BASE_URL}/api/stories/${id}`,
         {
            method: 'DELETE'
         }
      );

   } catch (err) {

      console.log(err);

   }

};


  return (
    <>
    <form className="admin-form" onSubmit={sendStoryData} >
      <h3>Stories</h3>
      <label><span>Title</span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
      <label><span>Text</span><input value={text} onChange={(event) => setText(event.target.value)} /></label>
 
<label>
    <span>Upload Image</span>

    <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
    />

</label>
      <button  className="button button--primary" type="submit">{editingId ? "Update Story" : "Submit Story"}</button>
    </form>


     {stories.map((item) => (
            <article className="card" key={item._id}>
              {item?.image && <img src={item.image} alt={item.title} className="card-image" /> }
              <div className="card-body">
                <h3>{item?.title || item?.name}</h3>
                <p>{item?.text || item?.description || item?.introduction}</p>
              </div>
               <div className="row-actions">
              <button
className="button button--ghost"
onClick={()=>editStory(item)}
>
Edit
</button>
          <button
   className="button button--secondary"
   onClick={()=>deleteStory(item._id)}
>
   Remove
</button>
            </div>
            </article>
          ))}

    </>
  );
}




//CONSTRUCTION GALLERY

const ConstructionEditor=()=> {
  
const [constructions, setConstructions] = useState([]);
const [id,setid]=useState(Math.floor(Math.random()*1000));
const [title,setTitle]=useState("");
const [image,setImage]=useState("");
const fileInputRef = useRef(null);
const [editingId, setEditingId] = useState(null);





      
      const getConstructions = async () => {
          try {
              const response = await fetch(`${API_BASE_URL}/api/constructions`);
      
              if (!response.ok) {
                  throw new Error("Failed to fetch constructions");
              }
      
              const data = await response.json();
      
              setConstructions(data);
      
          } catch (err) {
              console.error(err);
          }
      };





    //DOING CRUD
     useEffect(() => {
        // socket live adds
        const socket = io(API_BASE_URL, { transports: ['websocket'] });
        socket.on('connect', () => { /* connected */ });
         socket.on('getconstruction', (prod) => { if (prod) setConstructions(prev => [prod, ...prev]); });
  socket.on('deleteconstruction', (id) => {
   setConstructions(prev =>
      prev.filter(item => item._id !== id)
   );
});
socket.on("updateconstruction",(updated)=>{setConstructions(prev=>prev.map(item=>item._id===updated._id? updated: item));});
        return () => socket.disconnect();
      }, []);
    
      
      useEffect(() => {
  getConstructions();
      }, []);
  



      const editConstruction=(item)=>{

setEditingId(item._id);

setTitle(item.title);

}





  //send data to node server 
const sendConstructionData = async (e) => {
    e.preventDefault();

    try {

        const formData = new FormData();

        formData.append("id", id);
        formData.append("title", title);

        if (image) {
            formData.append("image", image);
        }

       const url = editingId
    ? `${API_BASE_URL}/api/constructions/${editingId}`
    : `${API_BASE_URL}/api/constructions`;

const method = editingId ? "PUT" : "POST";

const response = await fetch(url,{
    method,
    body:formData
});


       const text = await response.text();
console.log(text);
const resetForm = () => {
    setid(Math.floor(Math.random() * 1000));
    setTitle("");
    setImage(null);

    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    setEditingId(null);
};


      alert("Construction saved successfully");
resetForm();

    } catch (err) {
        console.error(err);
    }
};






//function to delete construction
const deleteConstruction = async (id) => {

   try {

      await fetch(
         `${API_BASE_URL}/api/constructions/${id}`,
         {
            method: 'DELETE'
         }
      );

   } catch (err) {

      console.log(err);

   }

};


  return (
    <>
    <form className="admin-form" onSubmit={sendConstructionData} >
      <h3>Construction Gallery</h3>
      <label><span>Title</span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
     
<label>
    <span>Upload Image</span>

    <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
    />

</label>
      <button  className="button button--primary" type="submit">
           {editingId ? "Update Construction" : "Submit Construction"}
      </button>
    </form>


     { constructions.map((item) => (
            <article className="card" key={item._id}>
              {item?.image && <img src={item.image} alt={item.title} className="card-image" /> }
              <div className="card-body">
                <h3>{item?.title || item?.name}</h3>
                <p>{item?.text || item?.description || item?.introduction}</p>
              </div>
               <div className="row-actions">
              <button
className="button button--ghost"
onClick={()=>editConstruction(item)}
>
Edit
</button>
          <button
   className="button button--secondary"
   onClick={()=>deleteConstruction(item._id)}
>
   Remove
</button>
            </div>
            </article>
          ))}


    </>
  );
}







//CULTURE EDITOR

const CultureEditor=()=> {
  
const [cultures, setCultures] = useState([]);
const [id,setid]=useState(Math.floor(Math.random()*1000));
const [title,setTitle]=useState("");
const [text,setText]=useState("");
const [image,setImage]=useState("");
const fileInputRef = useRef(null);
const [editingId, setEditingId] = useState(null);




      
      
      const getCultures = async () => {
          try {
              const response = await fetch(`${API_BASE_URL}/api/cultures`);
      
              if (!response.ok) {
                  throw new Error("Failed to fetch cultures");
              }
      
              const data = await response.json();
      
              setCultures(data);
      
          } catch (err) {
              console.error(err);
          }
      };





      
    //DOING CRUD
     useEffect(() => {
        // socket live adds
        const socket = io(API_BASE_URL, { transports: ['websocket'] });
        socket.on('connect', () => { /* connected */ });
         socket.on('getculture', (prod) => { if (prod) setCultures(prev => [prod, ...prev]); });
  socket.on('deleteculture', (id) => {
   setCultures(prev =>
      prev.filter(item => item._id !== id)
   );
});
socket.on("updateculture",(updated)=>{setCultures(prev=>prev.map(item=>item._id===updated._id? updated: item));});
        return () => socket.disconnect();
      }, []);
    
      
      useEffect(() => {
  getCultures();
      }, []);
  




const editCulture=(item)=>{

setEditingId(item._id);

setTitle(item.title);

setText(item.text);

}



  //send data to node server 
const sendCultureData = async (e) => {
    e.preventDefault();

    try {

        const formData = new FormData();

        formData.append("id", id);
        formData.append("title", title);
        formData.append("text", text);

        if (image) {
            formData.append("image", image);
        }

          const url = editingId
    ? `${API_BASE_URL}/api/cultures/${editingId}`
    : `${API_BASE_URL}/api/cultures`;

const method = editingId ? "PUT" : "POST";

const response = await fetch(url,{
    method,
    body:formData
});


        const data = await response.json();

const resetForm = () => {
    setid(Math.floor(Math.random() * 1000));
    setTitle("");
    setText("");
    setImage(null);

    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    setEditingId(null);
};



      alert("Culture saved successfully");
resetForm();

    } catch (err) {
        console.error(err);
    }
};




//function to delete culture
const deleteCulture = async (id) => {

   try {

      await fetch(
         `${API_BASE_URL}/api/cultures/${id}`,
         {
            method: 'DELETE'
         }
      );

   } catch (err) {

      console.log(err);

   }

};



  return (
    <>
    <form className="admin-form" onSubmit={sendCultureData} >
      <h3>Cultures</h3>
      <label><span>Title</span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
      <label><span>Text</span><input value={text} onChange={(event) => setText(event.target.value)} /></label>
 
<label>
    <span>Upload Image</span>

    <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
    />

</label>
      <button  className="button button--primary" type="submit">
           {editingId ? "Update Culture" : "Submit Culture"}
      </button>
    </form>





     {cultures.map((item) => (
            <article className="card" key={item._id}>
              {item?.image && <img src={item.image} alt={item.title} className="card-image" /> }
              <div className="card-body">
                <h3>{item?.title || item?.name}</h3>
                <p>{item?.text || item?.description || item?.introduction}</p>
              </div>
               <div className="row-actions">
              <button
className="button button--ghost"
onClick={()=>editCulture(item)}
>
Edit
</button>
          <button
   className="button button--secondary"
   onClick={()=>deleteCulture(item._id)}
>
   Remove
</button>
            </div>
            </article>
          ))}




    </>
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
const fileInputRef = useRef(null);
const [editingId, setEditingId] = useState(null);






        
          const getMinistries = async () => {
          try {
              const response = await fetch(`${API_BASE_URL}/api/ministries`);
      
              if (!response.ok) {
                  throw new Error("Failed to fetch ministries");
              }
      
              const data = await response.json();
      
              setMinistries(data);
      
          } catch (err) {
              console.error(err);
          }
      };
  
      

      
      
    //DOING CRUD
     useEffect(() => {
        // socket live adds
        const socket = io(API_BASE_URL, { transports: ['websocket'] });
        socket.on('connect', () => { /* connected */ });
         socket.on('getministry', (prod) => { if (prod) setMinistries(prev => [prod, ...prev]); });
  socket.on('deleteministry', (id) => {
   setMinistries(prev =>
      prev.filter(item => item._id !== id)
   );
});
socket.on("updateministry",(updated)=>{setMinistries(prev=>prev.map(item=>item._id===updated._id? updated: item));});
        return () => socket.disconnect();
      }, []);
    
      
      useEffect(() => {
  getMinistries();
      }, []);
  






const editMinistry=(item)=>{

setEditingId(item._id);

setTitle(item.title);

setSubtitle(item.subtitle);

setDescription(item.description);

}



  //send data to node server 
 const sendMinistryData = async (e) => {
    e.preventDefault();

    try {

        const formData = new FormData();

        formData.append("id", id);
        formData.append("title", title);
        formData.append("subtitle", subtitle);
        formData.append("description", description);

        if (image) {
            formData.append("image", image);
        }

        const url = editingId
    ? `${API_BASE_URL}/api/ministries/${editingId}`
    : `${API_BASE_URL}/api/ministries`;

const method = editingId ? "PUT" : "POST";

const response = await fetch(url,{
    method,
    body:formData
});


        const data = await response.json();
const resetForm = () => {
    setid(Math.floor(Math.random() * 1000));
    setTitle("");
    setSubtitle("");
    setDescription("");
    setImage(null);

    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    setEditingId(null);
};


    alert("Ministries saved successfully");
resetForm();

    } catch (err) {
        console.error(err);
    }
};




//function to delete ministry
const deleteMinistry = async (id) => {

   try {

      await fetch(
         `${API_BASE_URL}/api/ministries/${id}`,
         {
            method: 'DELETE'
         }
      );

   } catch (err) {

      console.log(err);

   }

};



  return (
    <>
    <form className="admin-form" onSubmit={sendMinistryData} >
      <h3>Ministries</h3>
      <label><span>Title</span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
      <label><span>Subtitle</span><input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} /></label>
       <label><span>Description</span><input value={description} onChange={(event) => setDescription(event.target.value)} /></label>
 
<label>
    <span>Upload Image</span>

    <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
    />

</label>
      <button  className="button button--primary" type="submit">{editingId ? "Update Ministry" : "Submit Ministry"}</button>
    </form>




  {ministries.map((item) => (
            <article className="card" key={item._id}>
              {item?.image && <img src={item.image} alt={item.title} className="card-image" /> }
              <div className="card-body">
                <h3>{item?.title || item?.name}</h3>
                <p>{item?.text || item?.description || item?.introduction}</p>
              </div>
               <div className="row-actions">
           <button
className="button button--ghost"
onClick={()=>editMinistry(item)}
>
Edit
</button>
           <button
   className="button button--secondary"
   onClick={()=>deleteMinistry(item._id)}
>
   Remove
</button>
            </div>
            </article>
          ))}


    </>
  );
}






//MILESTONES EDITOR

const MilestoneEditor=()=> {
  
const [milestones, setMilestones] = useState([]);
const [id,setid]=useState(Math.floor(Math.random()*1000));
const [title,setTitle]=useState("");
const [description,setDescription]=useState("");
const [year,setYear]=useState('');
const [image,setImage]=useState("");
const fileInputRef = useRef(null);
const [editingId, setEditingId] = useState(null);






        const getMilestones = async () => {
          try {
              const response = await fetch(`${API_BASE_URL}/api/milestones`);
      
              if (!response.ok) {
                  throw new Error("Failed to fetch stories");
              }
      
              const data = await response.json();
      
              setMilestones(data);
      
          } catch (err) {
              console.error(err);
          }
      };




      
    //DOING CRUD
     useEffect(() => {
        // socket live adds
        const socket = io(API_BASE_URL, { transports: ['websocket'] });
        socket.on('connect', () => { /* connected */ });
         socket.on('getmilestone', (prod) => { if (prod) setMilestones(prev => [prod, ...prev]); });
  socket.on('deletemilestone', (id) => {
   setMilestones(prev =>
      prev.filter(item => item._id !== id)
   );
});
socket.on("updatemilestone",(updated)=>{setMilestones(prev=>prev.map(item=>item._id===updated._id? updated: item));});
        return () => socket.disconnect();
      }, []);
    
      
      useEffect(() => {
  getMilestones();
      }, []);
  




const editMilestone=(item)=>{

setEditingId(item._id);

setTitle(item.title);

setDescription(item.description);

setYear(item.year);

}





  //send data to node server 
const sendMilestoneData = async (e) => {
    e.preventDefault();

    try {

        const formData = new FormData();

        formData.append("id", id);
        formData.append("title", title);
         formData.append("description", description);
         formData.append("year",year);

        if (image) {
            formData.append("image", image);
        }

         const url = editingId
    ? `${API_BASE_URL}/api/milestones/${editingId}`
    : `${API_BASE_URL}/api/milestones`;

const method = editingId ? "PUT" : "POST";

const response = await fetch(url,{
    method,
    body:formData
});


        const data = await response.json();
const resetForm = () => {
    setid(Math.floor(Math.random() * 1000));
    setTitle("");
    setDescription("");
    setYear("");
    setImage(null);

    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    setEditingId(null);
};


      alert("Milestone saved successfully");
resetForm();

    } catch (err) {
        console.error(err);
    }
};





//function to delete milestone 
const deleteMilestone = async (id) => {

   try {

      await fetch(
         `${API_BASE_URL}/api/milestones/${id}`,
         {
            method: 'DELETE'
         }
      );

   } catch (err) {

      console.log(err);

   }

};


  return (
    <>
    <form className="admin-form" onSubmit={sendMilestoneData} >
      <h3>Milestones</h3>
      <label><span>Title</span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
      <label><span>Description</span><input value={description} onChange={(event) => setDescription(event.target.value)} /></label>
  <label><span>Year</span><input  value={year} onChange={(event) => setYear(event.target.value)} /></label>
<label>
    <span>Upload Image</span>

    <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
    />

</label>
      <button  className="button button--primary" type="submit">
           {editingId ? "Update Milestone" : "Submit Milestone"}
      </button>
    </form>



     { milestones.map((item) => (
            <article className="card" key={item._id}>
              {item?.image && <img src={item.image} alt={item.title} className="card-image" /> }
              <div className="card-body">
                <h3>{item?.title || item?.name}</h3>
                <p>{item?.text || item?.description || item?.introduction}</p>
              </div>
               <div className="row-actions">
            <button
className="button button--ghost"
onClick={()=>editMilestone(item)}
>
Edit
</button>
          <button
   className="button button--secondary"
   onClick={()=>deleteMilestone(item._id)}
>
   Remove
</button>
            </div>
            </article>
          ))}
    </>
  );
}



//PASTORS EDITOR

const PastorEditor=()=> {
  
const [pastors, setPastors] = useState([]);
const [id,setid]=useState(Math.floor(Math.random()*1000));
const [name,setName]=useState("");
const [role,setRole]=useState("");
const [message,setMessage]=useState('');
const [image,setImage]=useState("");
const fileInputRef = useRef(null);
const [editingId, setEditingId] = useState(null);





        const getPastors = async () => {
          try {
              const response = await fetch(`${API_BASE_URL}/api/pastors`);
      
              if (!response.ok) {
                  throw new Error("Failed to fetch stories");
              }
      
              const data = await response.json();
      
              setPastors(data);
      
          } catch (err) {
              console.error(err);
          }
      };
  
  
        
     
  
    //DOING CRUD
     useEffect(() => {
        // socket live adds
        const socket = io(API_BASE_URL, { transports: ['websocket'] });
        socket.on('connect', () => { /* connected */ });
         socket.on('getpastor', (prod) => { if (prod) setPastors(prev => [prod, ...prev]); });
  socket.on('deletepastor', (id) => {
   setPastors(prev =>
      prev.filter(item => item._id !== id)
   );
});
socket.on("updatepastor",(updated)=>{setPastors(prev=>prev.map(item=>item._id===updated._id? updated: item));});
        return () => socket.disconnect();
      }, []);
    
      
      useEffect(() => {
  getPastors();
      }, []);
  


      
      const editPastor=(item)=>{

setEditingId(item._id);

setName(item.name);

setRole(item.role);

setMessage(item.message);

}



  
  
  //send data to node server 
const sendPastorData = async (e) => {
    e.preventDefault();

    try {

        const formData = new FormData();

        formData.append("id", id);
        formData.append("name", name);
         formData.append("role", role);
         formData.append("message",message);

        if (image) {
            formData.append("image", image);
        }

         const url = editingId
    ? `${API_BASE_URL}/api/pastors/${editingId}`
    : `${API_BASE_URL}/api/pastors`;

const method = editingId ? "PUT" : "POST";

const response = await fetch(url,{
    method,
    body:formData
});


        const data = await response.json();
const resetForm = () => {
    setid(Math.floor(Math.random() * 1000));
    setName("");
    setRole("");
    setMessage("");
    setImage(null);

    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    setEditingId(null);
};


      alert("Pastor saved successfully");
resetForm();

    } catch (err) {
        console.error(err);
    }
};



//function to delete pastors
const deletePastor = async (id) => {

   try {

      await fetch(
         `${API_BASE_URL}/api/pastors/${id}`,
         {
            method: 'DELETE'
         }
      );

   } catch (err) {

      console.log(err);

   }

};

  return (
    <>
    <form className="admin-form" onSubmit={sendPastorData} >
      <h3>Pastoral</h3>
      <label><span>Name</span><input value={name} onChange={(event) => setName(event.target.value)} /></label>
      <label><span>Role</span><input value={role} onChange={(event) => setRole(event.target.value)} /></label>
  <label><span>Message</span><input   value={message} onChange={(event) => setMessage(event.target.value)} /></label>
<label>
    <span>Upload Image</span>

    <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
    />

</label>
      <button  className="button button--primary" type="submit">
           {editingId ? "Update Pastor" : "Submit Pastor"}
      </button>
    </form>




      {pastors.map((item) => (
            <article className="card" key={item._id}>
              {item?.image && <img src={item.image} alt={item.title} className="card-image" /> }
              <div className="card-body">
                <h3>{item?.title || item?.name}</h3>
                <p>{item?.text || item?.description || item?.introduction}</p>
              </div>
               <div className="row-actions">
              <button
className="button button--ghost"
onClick={()=>editPastor(item)}
>
Edit
</button>
            <button
   className="button button--secondary"
   onClick={()=>deletePastor(item._id)}
>
   Remove
</button>
            </div>
            </article>
          ))}



    </>
  );
}


//MINISTRIES EDITOR

//BLOG EDITOR

//GALLERY EDITOR

//TESTIMONIES EDITOR

//ANNOUNCEMENTS EDITOR

//LEADERSHIP EDITOR

//MESSAGES EDITOR

//USERS EDITOR

//MEDIA EDITOR



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
       
          <label >
            <span>fgdyrty</span>
          
             {/* <textarea value={formData[field.key] || ''} onChange={(event) => setFormData({ ...formData, [field.key]: event.target.value })} />
         
              <input value={formData[field.key] || ''} onChange={(event) => setFormData({ ...formData, [field.key]: event.target.value })} />*/}
          
          </label>
     
        <button className="button button--primary" type="submit">{editingId ? 'Update item' : 'Add item'}</button>
      </form>

      <div className="list-card">
    
          <div className="list-row">
            <div>
              <strong>fgdf</strong>
              <p>dffgdgd</p>
              {/*item.image ? <img src={item.image} alt={item.title || item.name} className="preview-image" /> : null*/}
            </div>
            <div className="row-actions">
              <button className="button button--ghost">Edit</button>
              <button className="button button--secondary" >Remove</button>
            </div>
          </div>
      
      </div>
    </div>
  );
}

export default AdminPage;
