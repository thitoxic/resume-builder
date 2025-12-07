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
<style>
body { font-family: Arial, Helvetica, sans-serif; padding: 32px; }
.container { width: 794px; margin: 0 auto; }
h1 { margin: 0; }
.section { margin-top: 16px; }
</style>
</head>
<body>
<div class=\"container\">${root.innerHTML}</div>
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
    <div style={{ padding: 20 }}>
      <div id="resume-root" style={{ width: 740, margin: "0 auto" }}>
        <h1>{resume.name}</h1>
        <h3>{resume.role}</h3>
        <p>{resume.summary}</p>

        <div className="section bg-blue-500">
          <h2>Experience</h2>
          {resume.experience.map((exp, i) => (
            <div key={i}>
              <strong>{exp.company}</strong>
              <div>
                {exp.role} · {exp.duration}
              </div>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button onClick={handleExport}>Export PDF → Drive</button>
      </div>
    </div>
  );
}
