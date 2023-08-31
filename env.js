import fs from 'fs';

const output = JSON.parse(fs.readFileSync("./terraform/terraform.tfstate", "utf8"))["outputs"];

fs.writeFileSync('./.env', Object.keys(output).map(key => Object.entries(output[key]["value"]).map(([k, v]) => `${k.toUpperCase()}=${v}`).join('\n')).join('\n'));