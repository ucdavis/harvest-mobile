import { getCurrentTeamAuthInfo } from "./auth";

export type Project = {
  id: string;
  name: string;
  piName: string;
};

export const getProjectLink = async (projectId: string) => {
  // need to grab current team and baseurl
  const authInfo = await getCurrentTeamAuthInfo();
  const projectInfoUrl = new URL(
    `${authInfo?.team}/project/details/${projectId}`,
    authInfo?.apiBaseUrl
  );
  if (!authInfo) return ""; // shouldn't happen but we don't want to crash
  return projectInfoUrl.toString();
};

export const fakeProjects: Project[] = [
  {
    id: "proj-001",
    name: "Mars Soil Microbiome Analysis",
    piName: "Dr. Elena Ramirez",
  },
  {
    id: "proj-002",
    name: "AI-Driven Crop Yield Prediction",
    piName: "Prof. Samuel Chen",
  },
  {
    id: "proj-003",
    name: "Sustainable Aquaponics Research",
    piName: "Dr. Priya Natarajan",
  },
  {
    id: "proj-004",
    name: "Climate Impact on Pollinators",
    piName: "Dr. Michael O’Neill",
  },
  {
    id: "proj-005",
    name: "Quantum Materials for Energy Storage",
    piName: "Dr. Amina Yusuf",
  },
  {
    id: "proj-006",
    name: "Next-Generation Biofuels Development",
    piName: "Dr. Carlos Mendoza",
  },
  {
    id: "proj-007",
    name: "Precision Irrigation with IoT Sensors",
    piName: "Dr. Sophia Li",
  },
  {
    id: "proj-008",
    name: "Genomics of Drought-Resistant Crops",
    piName: "Dr. Rajesh Kumar",
  },
  {
    id: "proj-009",
    name: "Marine Algae for Carbon Sequestration",
    piName: "Dr. Hannah Stein",
  },
  {
    id: "proj-010",
    name: "Smart Greenhouse Automation Systems",
    piName: "Prof. David Okafor",
  },
];
