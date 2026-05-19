import { profiles } from "../data/ProfileList";
import { getPostedTime } from "../data/jobsList";

export default function JobCard({ job }) {
  const author = profiles.find((p) => p.id === job.authorId);

  return (
    <div className="job-card">
      <div>
        <div className="title-row">
          <h3 className="title">
            {job.title}
            <span className="category-inline">[{job.category}]</span>
          </h3>
          <span className="status">{job.status === "Open" ? "Нээлттэй" : job.status === "Taken" ? "Авагдсан" : "Дууссан"}</span>
        </div>

        <p className="desc">{job.description}</p>

        <div className="meta">
          <p>Хаяг: {job.location}</p>
          <p>Ажил олгогч: {author ? author.name : "Тодорхойгүй"}</p>
          <p>Утас: {author ? author.phone : "-"}</p>
          <p>Байршуулсан: {getPostedTime(job.postedAt)}</p>
        </div>
      </div>

      <hr />

      <div className="bottom">
        <span className="price">{job.price.toLocaleString()}₮</span>
        <button className="btn">Хүсэлт илгээх</button>
      </div>
    </div>
  );
}
