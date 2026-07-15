import { useEffect, useState } from "react";
import API from "./services/api";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    doctor_name: "",
    interaction_type: "Meeting",
    date: "",
    time: "",
    attendees: "",
    discussion: "",
    outcome: "",
    follow_up: "",
  });

  const [interactions, setInteractions] = useState([]);
  const [meetingNotes, setMeetingNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [aiResponse, setAiResponse] = useState("");

  const loadInteractions = async () => {
    try {
      const res = await API.get("/interactions");
      setInteractions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadInteractions();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const saveInteraction = async (e) => {
  e.preventDefault();

  try {

    if (editingId) {

      await API.put(
        `/interaction/${editingId}`,
        formData
      );

      setMessage("✅ Interaction Updated Successfully!");

setTimeout(() => {
  setMessage("");
}, 3000);

      setEditingId(null);

    } else {

      await API.post(
        "/interaction",
        formData
      );

setMessage("✅ Interaction Saved Successfully!");

setTimeout(() => {
  setMessage("");
}, 3000);
    }

    setFormData({
      doctor_name: "",
      interaction_type: "Meeting",
      date: "",
      time: "",
      attendees: "",
      discussion: "",
      outcome: "",
      follow_up: "",
    });

    loadInteractions();

  } catch (err) {

    console.log(err);

    setMessage("❌ Something went wrong!");

setTimeout(() => {
  setMessage("");
}, 3000);

  }
};
  const generateWithAI = async () => {
  if (!meetingNotes.trim()) {
    alert("Please enter meeting notes.");
    return;
  }

  try {
    setLoading(true);
    const res = await API.post("/ai/chat", {
      text: meetingNotes,
    });

    let aiText = res.data.response;
    setAiResponse(aiText);

    aiText = aiText.replace(/```json/g, "");
    aiText = aiText.replace(/```/g, "");

    const aiData = JSON.parse(aiText);

    setFormData((prev) => ({
      ...prev,
      doctor_name: aiData.doctor_name || "",
      interaction_type: aiData.interaction_type || "Meeting",
      discussion: aiData.discussion || "",
      outcome: aiData.outcome || "",
      follow_up: aiData.follow_up || "",
    }));

    alert("AI Generated Successfully!");
    setLoading(false);
  } catch (err) {
    console.log(err);
    setLoading(false); 
    alert("AI Generation Failed");
  }
};

  return (
    <div className="container">

      <div className="header">

  <div>
    <h1>🏥 AI CRM HCP Dashboard</h1>
    <p>Healthcare Professional Interaction Management System</p>
  </div>

  <div className="header-right">
    <h3>{new Date().toLocaleDateString()}</h3>
  </div>

</div>
      {message && (
  <div className="message">
    {message}
  </div>
)}
<p style={{ textAlign: "center", marginBottom: "30px", color: "#666" }}>
Healthcare Professional Interaction Management System
</p>
      <div className="ai-box">

<h2>🤖 AI Meeting Assistant</h2>

<textarea
rows="6"
placeholder="Paste meeting notes here..."
value={meetingNotes}
onChange={(e)=>setMeetingNotes(e.target.value)}
/>

<button
    onClick={generateWithAI}
    disabled={loading}
>
    {loading ? "Generating..." : "Generate with AI"}
</button>

{aiResponse && (
  <div className="ai-response">
    <h3>🤖 AI Summary</h3>
    <pre>{aiResponse}</pre>
  </div>
)}
</div>
{aiResponse && (
  <>
    <h3>🤖 AI Response</h3>

    <pre
      style={{
        background: "#f4f4f4",
        padding: "15px",
        borderRadius: "8px",
        whiteSpace: "pre-wrap",
      }}
    >
      {aiResponse}
    </pre>
  </>
)}
<hr />

      <form onSubmit={saveInteraction}>

        <label>Doctor Name</label>
        <input
          name="doctor_name"
          value={formData.doctor_name}
          onChange={handleChange}
          required
        />

        <label>Interaction Type</label>

        <select
          name="interaction_type"
          value={formData.interaction_type}
          onChange={handleChange}
        >
          <option>Meeting</option>
          <option>Call</option>
          <option>Email</option>
          <option>Video Call</option>
        </select>

        <label>Date</label>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />

        <label>Time</label>

        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
        />

        <label>Attendees</label>

        <input
          name="attendees"
          value={formData.attendees}
          onChange={handleChange}
        />

        <label>Discussion</label>

        <textarea
          rows="3"
          name="discussion"
          value={formData.discussion}
          onChange={handleChange}
        />

        <label>Outcome</label>

        <textarea
          rows="2"
          name="outcome"
          value={formData.outcome}
          onChange={handleChange}
        />

        <label>Follow Up</label>

        <textarea
          rows="2"
          name="follow_up"
          value={formData.follow_up}
          onChange={handleChange}
        />

        <button type="submit">
          Save Interaction
        </button>

      </form>

      <hr />
 

      <h2>📊 Interaction History</h2>
      <div className="stats-container">

  <div className="stat-card">
    <h3>{interactions.length}</h3>
    <p>Total Interactions</p>
  </div>

  <div className="stat-card">
    <h3>
      {interactions.filter(i => i.interaction_type === "Meeting").length}
    </h3>
    <p>Meetings</p>
  </div>

  <div className="stat-card">
    <h3>
      {interactions.filter(i => i.interaction_type === "Call").length}
    </h3>
    <p>Calls</p>
  </div>

  <div className="stat-card">
    <h3>
      {interactions.filter(i => i.interaction_type === "Email").length}
    </h3>
    <p>Emails</p>
  </div>

</div>

<input
  type="text"
  placeholder="🔍 Search Doctor..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="search-box"
/>


      <table>

        <thead>

          <tr>
            <th>ID</th>
            <th>Doctor</th>
            <th>Type</th>
            <th>Date</th>
            <th>Time</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {interactions
  .filter((item) =>
    item.doctor_name.toLowerCase().includes(search.toLowerCase())
  )
  .map((item) => (
            <tr key={item.id}>
  <td>{item.id}</td>
  <td>{item.doctor_name}</td>
  <td>{item.interaction_type}</td>
  <td>{item.date}</td>
  <td>{item.time}</td>

  <td>
  <div className="action-buttons">
    <button
      className="edit-btn"
      onClick={() => {
        setFormData(item);
        setEditingId(item.id);
      }}
    >
      Edit
    </button>

    <button
      onClick={async () => {
  if (window.confirm("Are you sure you want to delete this interaction?")) {
    await API.delete(`/interaction/${item.id}`);
    loadInteractions();
  }
}}
    >
      Delete
    </button>
  </div>
</td>
</tr>


           

          ))}

        </tbody>

    </table>

<hr />

<footer className="footer">
    AI CRM HCP © 2026 | Developed using React, FastAPI, MySQL, LangGraph & Groq AI
</footer>

</div>
  );
}

export default App;