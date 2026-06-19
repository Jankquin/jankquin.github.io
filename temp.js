// ==UserScript==
// @name         Gallery
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Download gallery as ZIP
// @match        https://cosplaytele.com/*
// @grant        none
// ==/UserScript==

(async () => {
  "use strict";

  // LOAD JSZip
  if (typeof JSZip === "undefined") {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  const ctId = Date.now();

  // BUTTON JSON & ZIP
  const btn = document.createElement("button");
  btn.textContent = "📦 Download ZIP";

  const jsonBtn = document.createElement("button");
  jsonBtn.textContent = "📄 JSON";

  //STYLE BUTTON JSON & ZIP
  Object.assign(jsonBtn.style, {
    position: "fixed",
    bottom: "70px",
    right: "20px",
    zIndex: "999999",
    padding: "12px 16px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  });

  Object.assign(btn.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "999999",
    padding: "12px 16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    boxShadow: "0 2px 10px rgba(0,0,0,.3)",
  });

  document.body.appendChild(jsonBtn);
  document.body.appendChild(btn);

  btn.addEventListener("click", async () => {
    try {
      btn.disabled = true;
      btn.textContent = "Loading...";

      const zip = new JSZip();

      const links = [
        ...document.querySelectorAll("#gallery-1 .gallery-item a"),
      ];

      for (let i = 0; i < links.length; i++) {
        btn.textContent = `Download ${i + 1}/${links.length}`;

        const response = await fetch(links[i].href);
        const blob = await response.blob();

        let ext = "jpg";

        if (blob.type.includes("png")) ext = "png";
        else if (blob.type.includes("webp")) ext = "webp";
        else if (blob.type.includes("gif")) ext = "gif";

        zip.file(`image-${i + 1}.${ext}`, blob);
      }

      btn.textContent = "Creating ZIP...";

      const content = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 9,
        },
      });

      const url = URL.createObjectURL(content);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${ctId}.zip`;
      document.body.appendChild(a);

      a.click();

      a.remove();
      URL.revokeObjectURL(url);

      btn.textContent = "✅ Finished";

      setTimeout(() => {
        btn.textContent = "📦 Download ZIP";
        btn.disabled = false;
      }, 3000);
    } catch (err) {
      console.error(err);

      btn.textContent = "❌ Error";

      setTimeout(() => {
        btn.textContent = "📦 Download ZIP";
        btn.disabled = false;
      }, 3000);
    }
  });

  jsonBtn.addEventListener("click", async () => {
    try {
      const images = [
        ...document.querySelectorAll("#gallery-1 .gallery-item a"),
      ].map((a) => a.href);

      const ctCreator = document.querySelectorAll("blockquote p a");
      const ctTags = document.querySelectorAll(".entry-category a");

      const ctArrayCreator = Array.from(ctCreator).map((e) =>
        e.textContent.trim()
      );

      const ctArrayTags = Array.from(ctTags).map((tag) =>
        tag.textContent.trim()
      );

      const ctArrayPreview = Array.from(
        { length: 5 },
        (_, i) => `${ctId} (${i + 2}).webp`
      );

      const data = {
        id: `${ctId}`,
        xtype: "images",
        xsource: location.href,
        xcover: `${ctId} (1).webp`,
        xpreview: ctArrayPreview,
        xtitle: document.title,
        xdesc: `${images.length}`,
        xcreator: ctArrayCreator,
        xtags: ctArrayTags,
        xdownload: "",
      };

      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));

      jsonBtn.style.background = "#dc2626";
      jsonBtn.textContent = "✅ Copied";
    } catch (err) {
      console.error(err);

      jsonBtn.textContent = "❌ Error";
    }
  });
})();
