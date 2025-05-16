document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("download-form");
  const status = document.getElementById("status");
  const historyList = document.getElementById("history-list");

  const loadHistory = async () => {
    try {
      const res = await fetch("http://localhost:3000/history");
      const history = await res.json();
      historyList.innerHTML = "";
      history.reverse().forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.url} (${item.format}, ${item.resolution})`;
        historyList.appendChild(li);
      });
    } catch (err) {
      status.textContent = "❌ Failed to load history";
    }
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const url = document.getElementById("url").value.trim();
    const format = document.getElementById("format").value;
    const resolution = document.getElementById("resolution").value;

    if (!url) {
      status.textContent = "❗ Please enter a valid URL.";
      return;
    }

    status.textContent = "⏳ Downloading...";
    try {
      const res = await fetch("http://localhost:3000/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, format, resolution })
      });
      const data = await res.json();
      if (data.success) {
        status.textContent = "✅ Download completed!";
        loadHistory();
      } else {
        status.textContent = `❌ Download failed: ${data.error || "Unknown error"}`;
      }
    } catch (err) {
      status.textContent = "❌ Error connecting to server.";
    }
  });

  loadHistory();
});
