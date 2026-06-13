const ctTags = document.querySelectorAll(
  "#thumb-list .col .card .position-relative a img"
);

// Ambil maksimal 6 gambar pertama dan ubah menjadi array berisi URL (src)
const allImages = Array.from(ctTags)
  .slice(0, 6)
  .map((tag) => tag.src);

// Memisahkan gambar pertama ke 'xcover', dan sisanya (maksimal 5 gambar) ke 'xtags'
const [xcover, ...xtags] = allImages;

console.log(`

          "xcover"   : "${xcover || ""}",
          "xtags"    : ${JSON.stringify(xtags)},

  `);
