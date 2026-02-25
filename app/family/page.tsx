import { familyData } from "@/lib/family-data";
import { PasswordGate } from "./password-gate";
import { FamilyTreeCanvas } from "./tree-canvas";

export const dynamic = "force-static";
export const revalidate = false;

export default function FamilyPage() {
  return (
    <PasswordGate expectedPassword={process.env.FAMILY_PASSWORD ?? ""}>
      <FamilyTreeCanvas data={familyData} />
    </PasswordGate>
  );
}