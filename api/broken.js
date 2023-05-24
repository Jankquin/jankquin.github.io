// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
    fetch("https://doodapi.com/api/file/list?key=48974p0bfvpz0hg2fznyu")
        .then((doc) => doc.json())
        .then((doc) => res.status(200).json(doc.result.files))
}
