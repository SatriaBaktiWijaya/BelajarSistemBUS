export enum TabType {
  INTERACTION = "interaction",
  STRUCTURE = "structure",
  DESIGN = "design",
  PCI = "pci",
  SIM_READ = "sim_read",
  SIM_ARB = "sim_arb",
  QUIZ = "quiz"
}

export interface Step {
  title: string;
  content: string;
}

export interface ModuleContent {
  id: TabType;
  title: string;
  description: string;
  steps: Step[];
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}
