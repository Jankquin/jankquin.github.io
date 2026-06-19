// DOWNLOAD - https://cosplaytele.com
// jakankan step1-3
// node crop image
// cover upload ke imgpost
// upload zip mediafire

// step 1  get library & Download bulk image.zip
(async () => {
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

  const zip = new JSZip();

  const links = document.querySelectorAll("#gallery-1 .gallery-item a");

  for (let i = 0; i < links.length; i++) {
    try {
      const response = await fetch(links[i].href);
      const blob = await response.blob();

      zip.file(`image-${i + 1}.jpg`, blob);

      console.log(`Downloaded ${i + 1}/${links.length}`);
    } catch (err) {
      console.error(err);
    }
  }

  const content = await zip.generateAsync({ type: "blob" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(content);
  a.download = "gallery.zip";
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(a.href);
})();

// step 2 - get data json
const ctSource = window.location.href;
const ctId = Date.now();
const ctTitle =
  document.querySelector(".entry-title")?.textContent.trim() || "";
const ctCreator = document.querySelectorAll("blockquote p a");
const ctTags = document.querySelectorAll(".entry-category a");

const ctArrayCreator = Array.from(ctCreator).map((e) => e.textContent.trim());
const ctArrayTags = Array.from(ctTags).map((tag) => tag.textContent.trim());
const ctArrayPreview = Array.from(
  { length: 5 },
  (_, i) => `${ctId} (${i + 2}).webp`
);

const ctDesc = Number(ctTitle.match(/\d+/)?.[0] ?? 0);

console.log(`
    {
        "id"       : "${ctId}",
        "xtype"    : "images",
        "xsource"  : "${ctSource}",
        "xcover"   : "${ctId} (1).webp",
        "xpreview":  ${JSON.stringify(ctArrayPreview)},
        "xtitle"   : "${ctTitle}",
        "xdesc"    : "${ctDesc}",
        "xcreator" : ${JSON.stringify(ctArrayCreator)},
        "xtags"    : ${JSON.stringify(ctArrayTags)},
        "xdownload": ""
    },
`);
