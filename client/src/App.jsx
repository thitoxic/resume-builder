import React from "react";
import resume from "./resume.json";

export default function App() {
  const handleExport = async () => {
    const root = document.getElementById("resume-root");
    if (!root) return alert("Resume root not found");

    // Make a full HTML wrapper so Puppeteer can render head + body styles
    const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
<script src="https://cdn.tailwindcss.com"></script>
<style>
  * { font-family: 'Google Sans', sans-serif; }
</style>
</head>
<body>
<div class=\"w-[794px] mx-auto bg-white p-10\">${root.innerHTML}</div>
</body>
</html>
`;

    try {
      const res = await fetch("http://localhost:5000/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
      });

      const data = await res.json();
      if (res.ok) alert(`Uploaded: ${data.fileName}`);
      else alert(`Upload failed: ${data.error || JSON.stringify(data)}`);
    } catch (err) {
      alert("Export failed: " + err.message);
    }
  };

  return (
    <div className="p-5 bg-gray-100">
      <div
        id="resume-root"
        className="w-[794px] mx-auto bg-white p-10 shadow-lg"
      >
        {/* Header */}
        <div className="border-b-2 border-blue-600 pb-5 mb-3">
          <h1 className="text-2xl font-bold text-blue-800 mb-1">
            {resume.name}
          </h1>
          <h2 className="text-base text-slate-500 mb-4 font-normal">
            {resume.title}
          </h2>
          <div className="flex flex-wrap gap-4 text-xs text-slate-600">
            <span>📞 {resume.contact.phone}</span>
            <a
              href={`mailto:${resume.contact.email}`}
              className="text-blue-600 hover:underline"
            >
              ✉️ {resume.contact.email}
            </a>
            <a
              href={resume.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              🔗 GitHub
            </a>
            <a
              href={resume.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              💼 LinkedIn
            </a>
          </div>
        </div>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Summary */}
            <div>
              <h3 className="text-lg text-blue-800 border-b border-slate-200 pb-2 mb-1">
                Summary
              </h3>
              <p className="text-sm leading-relaxed text-slate-600 text-justify">
                {resume.summary}
              </p>
            </div>

            {/* Experience */}
            <div>
              <h3 className="text-lg text-blue-800 border-b border-slate-200 pb-2 mb-1">
                Experience
              </h3>
              <div className="space-y-6">
                {resume.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-2">
                      <div>
                        <div className="text-base font-semibold text-slate-800">
                          {exp.role}
                        </div>
                        <div className="text-sm text-slate-600">
                          {exp.company}
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 italic">
                        {exp.duration}
                      </div>
                    </div>
                    <ul className="mt-3 pl-5 space-y-1.5">
                      {exp.points.map((point, j) => (
                        <li
                          key={j}
                          className="text-slate-600 leading-relaxed text-xs"
                        >
                          • {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="text-lg text-blue-800 border-b border-slate-200 pb-2 mb-1">
                Education
              </h3>
              <div className="space-y-6">
                {resume.education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-2">
                      <div>
                        <div className="text-base font-medium text-slate-800">
                          {edu.degree}
                        </div>
                        <div className="text-sm text-slate-600">
                          {edu.institution}
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 italic">
                        {edu.duration}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Skills */}
            <div>
              <h3 className="text-lg text-blue-800 border-b border-slate-200 pb-2 mb-1">
                Skills
              </h3>
              <div className="space-y-5">
                <div>
                  <strong className="block mb-2 text-slate-800 text-sm">
                    Languages
                  </strong>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.languages.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <strong className="block mb-2 text-slate-800 text-sm">
                    Frontend
                  </strong>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.frontend.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <strong className="block mb-2 text-slate-800 text-sm">
                    Backend
                  </strong>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.backend.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <strong className="block mb-2 text-slate-800 text-sm">
                    DevOps & Tools
                  </strong>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.devops_tools.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <strong className="block mb-2 text-slate-800 text-sm">
                    Concepts
                  </strong>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.concepts.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Projects */}
            <div>
              <h3 className="text-lg text-blue-800 border-b border-slate-200 pb-2 mb-1">
                Projects
              </h3>
              <div className="space-y-6">
                {resume.projects.map((project, i) => (
                  <div key={i}>
                    <div className="text-base font-semibold text-slate-800 mb-1">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {project.name}
                      </a>
                    </div>
                    <div className="text-xs text-slate-600 mb-2">
                      {project.description}
                    </div>
                    <ul className="pl-5 space-y-1.5">
                      {project.highlights.map((highlight, j) => (
                        <li
                          key={j}
                          className="text-slate-600 leading-relaxed text-xs"
                        >
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="text-lg text-blue-800 border-b border-slate-200 pb-2 mb-1">
                Certifications
              </h3>
              <ul className="space-y-2">
                {resume.certifications.map((cert, i) => (
                  <li key={i} className="text-slate-600 text-xs pl-1">
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-5">
        <button
          onClick={handleExport}
          className="px-6 py-3 text-base bg-blue-600 text-white border-none rounded-md cursor-pointer font-semibold hover:bg-blue-700 transition-colors"
        >
          Export PDF → Drive
        </button>
      </div>
    </div>
  );
}
