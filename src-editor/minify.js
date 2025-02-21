import fs from "fs"
import path from "path"

const file = path.resolve("dist", "index.min.html")
fs.readFile(file, "utf-8", (err, data) => {
    if (err) throw err
    const code = data
        .replace(/\\n(\s+)/g, '\\n')
        .replace(/,\\n/g, ',')
        .replace(/`\\n/g, '`')
        .replace(/\\n`/g, '`')
    fs.writeFile(file, code, "utf-8", process.exit)
})
