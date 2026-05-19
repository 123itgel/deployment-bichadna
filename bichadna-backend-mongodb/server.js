const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.set("json spaces", 2);

mongoose.connect("mongodb+srv://hiimfrosteinstein_db_user:JPQExvvUYH49jeDF@bichadna.lnahfbq.mongodb.net/bichadna?appName=Bichadna")
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// SCHEMAS

const ProfileSchema = new mongoose.Schema({
  id: Number,
  name: String,
  phone: String,
  email: { type: String, default: null },
  password: { type: String, default: null },
  rating: Number,
  jobsDone: Number,
  memberSince: String,
  social: { type: String, default: null },
});

const JobSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  location: String,
  authorId: Number,
  workerId: { type: Number, default: null },
  applicants: [Number],
  postedAt: String,
  completedAt: { type: String, default: null },
  hours: { type: Number, default: null },
  price: Number,
  status: { type: String, default: "Open" },
});

const ReviewSchema = new mongoose.Schema({
  jobId: String,
  reviewerId: Number,
  workerId: Number,
  stars: Number,
  description: String,
  createdAt: { type: String, default: () => new Date().toISOString() },
});

const Profile = mongoose.model("Profile", ProfileSchema);
const Job = mongoose.model("Job", JobSchema);
const Review = mongoose.model("Review", ReviewSchema);

// SEED DATA

async function seedData() {
  const profileCount = await Profile.countDocuments();
  if (profileCount === 0) {
    await Profile.insertMany([
      { id: 1, name: "А.Ану", phone: "99999991", email: "AAnu@gmail.com", password: "password123", rating: 4.8, jobsDone: 12, memberSince: "2025-01-15", social: "facebook.com" },
      { id: 2, name: "Б.Бат", phone: "99999992", email: "BBat@gmail.com", password: "password123", rating: 4.5, jobsDone: 30, memberSince: "2024-11-20", social: null },
      { id: 3, name: "Б.Ирмүүн", phone: "99999993", email: "BIrmun@gmail.com", password: "password123", rating: 4.9, jobsDone: 8, memberSince: "2025-03-01", social: "facebook.com" },
      { id: 4, name: "Б.Түмэн", phone: "99999994", email: "BTumen@gmail.com", password: "password123", rating: 4.7, jobsDone: 15, memberSince: "2025-02-10", social: null },
      { id: 5, name: "Г.Ганзориг", phone: "99999995", email: "GGanzorig@gmail.com", password: "password123", rating: 4.6, jobsDone: 20, memberSince: "2024-12-05", social: "facebook.com" },
      { id: 6, name: "А.Анужин", phone: "99999996", email: "AAnujin@gmail.com", password: "password123", rating: 4.9, jobsDone: 25, memberSince: "2024-10-01", social: null },
    ]);
    console.log("Profiles seeded!");
  }

  const jobCount = await Job.countDocuments();
  if (jobCount === 0) {
    await Job.insertMany([
      { title: "Цэвэрлэгээ", category: "Цэвэрлэгээ", description: "3 өрөө байрны гүн цэвэрлэгээ хийнэ. Бүх хэрэгсэл бэлэн.", location: "Баруун 4 зам, Намуун хотхон", authorId: 1, workerId: 5, applicants: [5, 3], postedAt: "2026-02-10T08:00:00", completedAt: "2026-02-10T00:00:00", hours: 4, price: 30000, status: "Done" },
      { title: "Тавилга зөөх", category: "Хүнд хүчний ажил", description: "Ор, ширээ, шкаф зөөх.", location: "Хан-Уул дүүрэг", authorId: 2, workerId: 5, applicants: [5, 4, 6], postedAt: "2026-02-20T05:00:00", completedAt: "2026-02-20T00:00:00", hours: 6, price: 50000, status: "Done" },
      { title: "Хүүхэд харах", category: "Асаргаа", description: "5 настай хүүхэд харах.", location: "Сүхбаатар дүүрэг", authorId: 3, workerId: 5, applicants: [5, 2], postedAt: "2026-03-05T09:00:00", completedAt: "2026-03-05T00:00:00", hours: 5, price: 40000, status: "Done" },
      { title: "Хана будах", category: "Засвар", description: "Өрөөний ханын будалт хийх. Материал бэлэн.", location: "Чингэлтэй дүүрэг", authorId: 6, workerId: 5, applicants: [5, 1], postedAt: "2026-03-18T10:00:00", completedAt: "2026-03-18T00:00:00", hours: 8, price: 70000, status: "Done" },
      { title: "Дэлгүүрээс юм авах", category: "Бусад", description: "Хүнсний дэлгүүрээс бараа авч гэрт хүргэж өгнө.", location: "Баянзүрх дүүрэг", authorId: 4, workerId: 5, applicants: [5, 1, 3], postedAt: "2026-04-08T09:30:00", completedAt: "2026-04-08T00:00:00", hours: 3, price: 20000, status: "Done" },
      { title: "Computer тоос цэвэрлэх", category: "Технологи", description: "Гэрийн компьютер, laptop-ын дотор тоос цэвэрлэж, thermal paste солих ажил.", location: "Сүхбаатар дүүрэг", authorId: 1, workerId: 5, applicants: [5, 3], postedAt: "2026-04-22T06:00:00", completedAt: "2026-04-22T00:00:00", hours: 4, price: 25000, status: "Done" },
      { title: "Нохой салхилуулах", category: "Асаргаа", description: "Нохойг 1 цаг салхилуулна.", location: "Баянгол дүүрэг", authorId: 3, workerId: 5, applicants: [5, 2], postedAt: "2026-04-29T08:00:00", completedAt: "2026-04-29T00:00:00", hours: 2, price: 15000, status: "Done" },
      { title: "Гэр цэвэрлэгээ", category: "Цэвэрлэгээ", description: "2 өрөө байр цэвэрлэнэ. Тоос сорогч бэлэн.", location: "Хан-Уул дүүрэг, 3-р хороо", authorId: 2, workerId: 5, applicants: [5, 6], postedAt: "2026-05-01T10:00:00", completedAt: "2026-05-01T00:00:00", hours: 5, price: 35000, status: "Done" },
      { title: "Ном зөөх", category: "Бусад", description: "Номын сангаас номуудыг зөөж өгнө.", location: "Сүхбаатар дүүрэг, их сургуулийн орчим", authorId: 4, workerId: 5, applicants: [5, 1], postedAt: "2026-05-03T07:00:00", completedAt: "2026-05-03T00:00:00", hours: 3, price: 18000, status: "Done" },
      { title: "Хүүхэд харах", category: "Асаргаа", description: "7 настай хүүхэд харах. Хариуцлагатай хүн хэрэгтэй.", location: "Баянзүрх дүүрэг", authorId: 6, workerId: 5, applicants: [5, 3], postedAt: "2026-05-04T09:00:00", completedAt: "2026-05-04T00:00:00", hours: 6, price: 40000, status: "Done" },
      { title: "Агуулах эмхэтгэх", category: "Хүнд хүчний ажил", description: "Налайх дахь агуулахад барааны тооллого хийж зохион байгуулах.", location: "Налайх дүүрэг, Аж үйлдвэрийн гудамж", authorId: 2, workerId: 5, applicants: [5, 4, 6], postedAt: "2026-05-05T05:00:00", completedAt: null, hours: null, price: 60000, status: "Taken" },
      { title: "Нохой салхилуулах", category: "Асаргаа", description: "Golden Retriever нохойг өдөрт 1 цаг паркаар салхилуулах хүн хэрэгтэй.", location: "Баянзүрх дүүрэг", authorId: 3, workerId: null, applicants: [1, 2, 4, 6], postedAt: "2026-05-05T08:30:00", completedAt: null, hours: null, price: 15000, status: "Open" },
      { title: "Хана будах", category: "Засвар", description: "Өрөөний ханын будалт хийх. Материал бэлэн байгаа.", location: "Чингэлтэй дүүрэг, 6-р хороо", authorId: 1, workerId: null, applicants: [3, 4], postedAt: "2026-05-05T06:00:00", completedAt: null, hours: null, price: 70000, status: "Open" },
      { title: "Дэлгүүрээс бараа авах", category: "Бусад", description: "Хүнсний дэлгүүрээс жагсаалтаар бараа авч гэрт хүргэнэ.", location: "Баянгол дүүрэг, 4-р хороо", authorId: 4, workerId: null, applicants: [2, 6], postedAt: "2026-05-05T09:00:00", completedAt: null, hours: null, price: 20000, status: "Open" },
      { title: "Гэр засвар", category: "Засвар", description: "Угаалгын өрөөний кафель буулгаж шинээр тавих. Материал бэлэн.", location: "Сүхбаатар дүүрэг, Номт хотхон", authorId: 6, workerId: null, applicants: [1, 3], postedAt: "2026-05-05T04:00:00", completedAt: null, hours: null, price: 80000, status: "Open" },
    ]);
    console.log("Jobs seeded!");
  }
}

// AUTH ROUTES

// register
app.post("/api/auth/register", async (req, res) => {
  const { name, phone, email, password } = req.body;
  if (!name || !phone || !email || !password)
    return res.status(400).json({ message: "Бүх талбарыг бөглөнө үү" });

  const existing = await Profile.findOne({ email });
  if (existing) return res.status(400).json({ message: "И-мэйл бүртгэлтэй байна" });

  const lastProfile = await Profile.findOne().sort({ id: -1 });
  const newId = (lastProfile?.id || 0) + 1;

  const newProfile = new Profile({
    id: newId, name, phone, email, password,
    rating: 0, jobsDone: 0,
    memberSince: new Date().toISOString().split("T")[0],
    social: null,
  });
  await newProfile.save();
  const { password: _, ...safeProfile } = newProfile.toObject();
  res.status(201).json(safeProfile);
});

// login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "И-мэйл болон нууц үг оруулна уу" });

  const profile = await Profile.findOne({ email });
  if (!profile) return res.status(404).json({ message: "И-мэйл олдсонгүй" });
  if (profile.password !== password)
    return res.status(401).json({ message: "Нууц үг буруу байна" });

  const { password: _, ...safeProfile } = profile.toObject();
  res.json(safeProfile);
});

// =====================
// PROFILE ROUTES
// =====================

app.get("/api/profiles", async (req, res) => {
  const profiles = await Profile.find();
  res.json(profiles);
});

app.get("/api/profiles/:id", async (req, res) => {
  const profile = await Profile.findById(req.params.id);
  if (!profile) return res.status(404).json({ message: "Profile not found" });
  res.json(profile);
});

// JOB ROUTES

app.get("/api/jobs", async (req, res) => {
  const { status, authorId, workerId } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (authorId) filter.authorId = parseInt(authorId);
  if (workerId) filter.workerId = parseInt(workerId);
  const jobs = await Job.find(filter);
  res.json(jobs);
});

app.get("/api/jobs/:id", async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json(job);
});

app.get("/api/jobs/:id/applicants", async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  const applicants = await Profile.find({ id: { $in: job.applicants } });
  res.json(applicants);
});

app.post("/api/jobs", async (req, res) => {
  const { title, category, description, location, authorId, price } = req.body;
  if (!title || !authorId || !price) return res.status(400).json({ message: "Title, authorId and price required" });
  const newJob = new Job({
    title, category, description, location, authorId,
    workerId: null, applicants: [],
    postedAt: new Date().toISOString(),
    completedAt: null, hours: null, price, status: "Open",
  });
  await newJob.save();
  res.status(201).json(newJob);
});

app.post("/api/jobs/:id/apply", async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  if (job.status !== "Open") return res.status(400).json({ message: "Job is not open" });
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: "userId required" });
  if (job.applicants.includes(userId)) return res.status(400).json({ message: "Already applied" });
  job.applicants.push(userId);
  await job.save();
  res.json({ message: "Applied successfully", job });
});

app.post("/api/jobs/:id/accept", async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  const { workerId } = req.body;
  if (!workerId) return res.status(400).json({ message: "workerId required" });
  job.workerId = workerId;
  job.status = "Taken";
  await job.save();
  res.json({ message: "Worker accepted", job });
});

app.post("/api/jobs/:id/complete", async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  const { hours } = req.body;
  job.status = "Done";
  job.completedAt = new Date().toISOString();
  job.hours = hours || null;
  await job.save();
  res.json({ message: "Job completed", job });
});

app.delete("/api/jobs/:id", async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: "Job deleted" });
});

// REVIEW ROUTES

app.post("/api/reviews", async (req, res) => {
  const { jobId, reviewerId, workerId, stars, description } = req.body;
  if (!jobId || !workerId || !stars) return res.status(400).json({ message: "jobId, workerId and stars required" });
  const review = new Review({ jobId, reviewerId, workerId, stars, description });
  await review.save();
  const allReviews = await Review.find({ workerId });
  const avgRating = allReviews.reduce((sum, r) => sum + r.stars, 0) / allReviews.length;
  await Profile.findOneAndUpdate({ id: workerId }, { rating: Math.round(avgRating * 10) / 10, jobsDone: allReviews.length });
  res.status(201).json(review);
});

app.get("/api/reviews/worker/:workerId", async (req, res) => {
  const reviews = await Review.find({ workerId: parseInt(req.params.workerId) });
  res.json(reviews);
});

app.get("/api/reviews/my/:userId", async (req, res) => {
  const reviews = await Review.find({ workerId: parseInt(req.params.userId) });
  res.json(reviews);
});

// START SERVER

app.listen(PORT, async () => {
  await seedData();
  console.log(`BiChadna server running on http://localhost:${PORT}`);
});
