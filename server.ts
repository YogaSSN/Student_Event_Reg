import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Mock Data ---
  let students: any[] = [];
  let faculty: any[] = [];
  let events: any[] = [];
  let participations: any[] = []; // This will now act as registrations
  let registrations: any[] = [];

  // --- Student Service (8081) ---
  app.post("/api/student/register", (req, res) => {
    const { rollNo, name, email, password } = req.body;
    if (students.find(s => s.rollNo === rollNo)) return res.status(400).json({ message: "Student already exists" });
    const newStudent = { rollNo, name, email, password, role: 'student' };
    students.push(newStudent);
    res.json(newStudent);
  });

  app.post("/api/student/login", (req, res) => {
    const { rollNo, password } = req.body;
    const student = students.find(s => s.rollNo === rollNo && s.password === password);
    if (!student) return res.status(401).json({ message: "Invalid credentials" });
    res.json(student);
  });

  // --- Faculty Service (8083) ---
  app.post("/api/faculty/register", (req, res) => {
    const { facultyId, name, email, password, department } = req.body;
    if (faculty.find(f => f.facultyId === facultyId)) return res.status(400).json({ message: "Faculty already exists" });
    const newFaculty = { facultyId, name, email, password, department, role: 'faculty' };
    faculty.push(newFaculty);
    res.json(newFaculty);
  });

  app.post("/api/faculty/login", (req, res) => {
    const { facultyId, password } = req.body;
    const f = faculty.find(f => f.facultyId === facultyId && f.password === password);
    if (!f) return res.status(401).json({ message: "Invalid credentials" });
    res.json(f);
  });

  // --- Event Service (8082) & Faculty Event Management ---
  app.get("/api/events", (req, res) => {
    res.json(events);
  });

  app.post("/api/events/create", (req, res) => {
    const event = { ...req.body, id: Math.random().toString(36).substr(2, 9) };
    events.push(event);
    res.json(event);
  });

  app.put("/api/events/update/:id", (req, res) => {
    const { id } = req.params;
    const index = events.findIndex(e => e.id === id);
    if (index === -1) return res.status(404).json({ message: "Event not found" });
    events[index] = { ...events[index], ...req.body };
    res.json(events[index]);
  });

  app.delete("/api/events/delete/:id", (req, res) => {
    const { id } = req.params;
    events = events.filter(e => e.id !== id);
    participations = participations.filter(p => p.eventId !== id);
    res.json({ message: "Event deleted" });
  });

  app.get("/api/events/faculty/:facultyId", (req, res) => {
    const { facultyId } = req.params;
    res.json(events.filter(e => e.facultyId === facultyId));
  });

  // --- Participation & Approvals ---
  app.post("/api/participation/register", (req, res) => {
    const { studentRollNo, eventId, studentName } = req.body;
    const existing = participations.find(p => p.studentRollNo === studentRollNo && p.eventId === eventId);
    if (existing) return res.status(400).json({ message: "Already registered" });
    
    const participation = { 
      id: Math.random().toString(36).substr(2, 9),
      studentRollNo, 
      studentName,
      eventId, 
      status: 'PENDING' 
    };
    participations.push(participation);
    res.json(participation);
  });

  app.get("/api/participation/faculty/:facultyId", (req, res) => {
    const { facultyId } = req.params;
    const facultyEvents = events.filter(e => e.facultyId === facultyId).map(e => e.id);
    const facultyParticipations = participations.filter(p => facultyEvents.includes(p.eventId)).map(p => {
      const event = events.find(e => e.id === p.eventId);
      return { ...p, eventName: event?.title };
    });
    res.json(facultyParticipations);
  });

  app.get("/api/participation/student/:rollNo", (req, res) => {
    const { rollNo } = req.params;
    const studentParticipations = participations.filter(p => p.studentRollNo === rollNo).map(p => {
      const event = events.find(e => e.id === p.eventId);
      return { ...p, event: event };
    });
    res.json(studentParticipations);
  });

  app.post("/api/participation/approve", (req, res) => {
    const { participationId } = req.body;
    const p = participations.find(p => p.id === participationId);
    if (p) p.status = 'APPROVED';
    res.json(p);
  });

  app.post("/api/participation/reject", (req, res) => {
    const { participationId } = req.body;
    const p = participations.find(p => p.id === participationId);
    if (p) p.status = 'REJECTED';
    res.json(p);
  });

  // --- New Registration Service Endpoints ---
  app.post("/api/registrations/register", (req, res) => {
    const { studentId, eventId } = req.body;
    const existing = registrations.find(r => r.studentId === studentId && r.eventId === eventId);
    if (existing) {
      return res.status(400).json({ message: "You have already registered for this event" });
    }
    
    const registration = {
      ...req.body,
      id: Math.random().toString(36).substr(2, 9),
      status: 'PENDING'
    };
    registrations.push(registration);
    res.json(registration);
  });

  app.get("/api/registrations/student/:studentId", (req, res) => {
    const { studentId } = req.params;
    const studentRegs = registrations.filter(r => r.studentId === studentId).map(r => {
      const event = events.find(e => e.id === r.eventId);
      return { ...r, event };
    });
    res.json(studentRegs);
  });

  app.get("/api/registrations/event/:eventId", (req, res) => {
    const { eventId } = req.params;
    if (eventId === 'all') {
      return res.json(registrations.map(r => {
        const event = events.find(e => e.id === r.eventId);
        return { ...r, event };
      }));
    }
    res.json(registrations.filter(r => r.eventId === eventId));
  });

  app.put("/api/registrations/:id/approve", (req, res) => {
    const { id } = req.params;
    const reg = registrations.find(r => r.id === id);
    if (reg) reg.status = 'APPROVED';
    res.json(reg);
  });

  app.put("/api/registrations/:id/reject", (req, res) => {
    const { id } = req.params;
    const reg = registrations.find(r => r.id === id);
    if (reg) reg.status = 'REJECTED';
    res.json(reg);
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
