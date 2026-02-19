import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import * as yaml from "yaml";
import { getOpenApiDocument } from "./registry";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.resolve(__dirname, "../../openapi.yaml");

const document = getOpenApiDocument();
const yamlContent = yaml.stringify(document);

fs.writeFileSync(
  outputPath,
  `# GENERATED FILE. DO NOT EDIT DIRECTLY.\n# Regenerate via: npm run generate:openapi -w findbuyers-backend\n\n${yamlContent}`,
  { encoding: "utf8" }
);

console.log(`Wrote OpenAPI spec to ${outputPath}`);
