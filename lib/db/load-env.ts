import { config } from "dotenv";

export function loadProjectEnv() {
  config({ path: ".env.local" });
  config({ path: ".env" });
}
