import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    course: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setStudents(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      age: form.age || null,
      course: form.course
    };

    if (editMode) {
      await fetch(`${API_URL}/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      showMessage("Student updated successfully!", "success");
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      showMessage("Student added successfully!", "success");
    }

    resetForm();
    loadStudents();
  };

  const editStudent = (s) => {
    setForm(s);
    setEditMode(true);
  };

  const deleteStudent = async (id) => {
    if (!confirm("Delete student?")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadStudents();
  };

  const resetForm = () => {
    setForm({
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      age: "",
      course: ""
    });
    setEditMode(false);
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🎓 Student Management System</h1>
        <p>Manage your student records efficiently</p>
      </div>

      <div className="content">
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form className="form-section" onSubmit={handleSubmit}>
          <h2>{editMode ? "Update Student" : "Add New Student"}</h2>

          <div className="form-row">
            <input id="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
            <input id="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <input id="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input id="age" placeholder="Age" value={form.age} onChange={handleChange} />
          </div>

          <input id="course" placeholder="Course" value={form.course} onChange={handleChange} />

          <button className="btn btn-primary">
            {editMode ? "Update Student" : "Add Student"}
          </button>
        </form>

        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Course</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {students.length === 0 ? (
    <tr>
      <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
        No students found
      </td>
    </tr>
  ) : (
    students.map((s) => (
      <tr key={s.id}>
        <td>{s.id}</td>
        <td>{s.firstName} {s.lastName}</td>
        <td>{s.email}</td>
        <td>{s.course || "-"}</td>
        <td className="actions">
          <button className="btn btn-warning" onClick={() => editStudent(s)}>
            Edit
          </button>
          <button className="btn btn-danger" onClick={() => deleteStudent(s.id)}>
            Delete
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>

        </table>
      </div>
    </div>
  );
}

export default App;
