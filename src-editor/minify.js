import fs from "fs";
import path from "path";

const file = path.resolve("dist", "index.min.html");
var code = fs.readFileSync(file).toString();
while (code.includes("\\n ")) code = code.replace("\\n ", "\\n");
while (code.includes(",\\n")) code = code.replace(",\\n", ",");
while (code.includes("`\\n")) code = code.replace("`\\n", "`");
while (code.includes("\\n`")) code = code.replace("\\n`", "`");
fs.writeFileSync(file, code);
