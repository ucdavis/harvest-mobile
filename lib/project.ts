export type Project = {
  id: string;
  name: string;
  piName: string;
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
];
