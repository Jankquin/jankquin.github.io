// --------------------------------------------------
// INSPECT ELEMENT - GET DATA JSON
// --------------------------------------------------
const cupId = Date.now();
const cupSource = location.href;
const cupTitle = document.querySelector("h1.entry-title")?.textContent.trim();
const cupTags = document.querySelectorAll(".gridshow-tags-links a");

const cupArrayTags = Array.from(cupTags).map((tag) => tag.textContent.trim());

const ximages = [
  ...document.querySelectorAll(
    ".entry-content.gridshow-clearfix > div:first-child a"
  ),
].map((a) => a.href);

console.log(ximages);

console.log(`
    {
        "id"       : "${cupId}",
        "xtype"    : "images",
        "xsource"  : "${cupSource}",
        "xcover"   : "${cupId} (1).webp",
        "xtitle"   : "${cupTitle}",
        "xdesc"    : "${ximages.length}",
        "xmodel"   : [""],
        "xtags"    : ${JSON.stringify(cupArrayTags)},
        "xdownload": ""
    },
`);
