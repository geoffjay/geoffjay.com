import { CreatorType, Project, ProjectStatus } from "./types";

export const MOCK_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "agentd",
    description:
      "A set of services for creating and managing agentic workflows. The system builds itself — a human opens issues and the agents implement the solutions, using the project as its own build infrastructure.",
    imageUrl: "https://picsum.photos/id/20/800/600",
    githubUrl: "https://github.com/geoffjay/agentd",
    technologies: ["Go", "gRPC", "Docker", "LLM"],
    status: ProjectStatus.IN_PROGRESS,
    progress: 35,
    startDate: "2024-09-01T00:00:00Z",
    lastUpdated: "2025-04-15T00:00:00Z",
    featured: true,
    creator: CreatorType.CLANKER_DOMINANT,
  },
  {
    id: "p2",
    name: "nemo",
    description:
      "Cross-platform desktop application built with GPUI (Zed's UI framework) for creating dynamic, GPU-accelerated user interfaces in Rust.",
    imageUrl: "https://picsum.photos/id/40/800/600",
    githubUrl: "https://github.com/geoffjay/nemo",
    technologies: ["Rust", "GPUI"],
    status: ProjectStatus.IN_PROGRESS,
    progress: 30,
    startDate: "2025-01-01T00:00:00Z",
    lastUpdated: "2025-03-20T00:00:00Z",
    featured: false,
    creator: CreatorType.CLANKER_DOMINANT,
  },
  {
    id: "p3",
    name: "berry-rs",
    description:
      "Shared memory storage system for AI tooling using retrieval-augmented generation (RAG) methods. Provides a persistent knowledge layer across AI tool sessions.",
    imageUrl: "https://picsum.photos/id/160/800/600",
    githubUrl: "https://github.com/geoffjay/berry-rs",
    technologies: ["Rust", "SQLite", "RAG", "Embeddings"],
    status: ProjectStatus.IN_PROGRESS,
    progress: 25,
    startDate: "2024-11-01T00:00:00Z",
    lastUpdated: "2025-02-28T00:00:00Z",
    featured: false,
    creator: CreatorType.CLANKER_DOMINANT,
  },
  {
    id: "p4",
    name: "shook",
    description:
      "Lightweight webhook service that executes build commands on GitHub and GitLab push events, enabling local CI/CD workflows without relying on external services.",
    imageUrl: "https://picsum.photos/id/180/800/600",
    githubUrl: "https://github.com/geoffjay/shook",
    technologies: ["Go", "Webhooks", "GitHub", "GitLab"],
    status: ProjectStatus.COMPLETED,
    progress: 85,
    startDate: "2023-06-01T00:00:00Z",
    lastUpdated: "2024-03-01T00:00:00Z",
    featured: false,
    creator: CreatorType.HUMAN_IN_THE_LOOP,
  },
  {
    id: "p5",
    name: "otter",
    description:
      "Layer-based configuration management system that applies idempotent configurations. Primarily used for reproducible project environment setup.",
    imageUrl: "https://picsum.photos/id/200/800/600",
    githubUrl: "https://github.com/geoffjay/otter",
    technologies: ["Go", "YAML", "TOML"],
    status: ProjectStatus.IN_PROGRESS,
    progress: 45,
    startDate: "2024-07-01T00:00:00Z",
    lastUpdated: "2025-03-15T00:00:00Z",
    featured: false,
    creator: CreatorType.CLANKER_DOMINANT,
  },
  {
    id: "p6",
    name: "claude-plugins",
    description:
      "Personal and experimental Claude Code plugin marketplace created to better learn and understand Claude Code's extension system and plugin API.",
    imageUrl: "https://picsum.photos/id/220/800/600",
    githubUrl: "https://github.com/geoffjay/claude-plugins",
    technologies: ["TypeScript", "Claude Code", "MCP"],
    status: ProjectStatus.IN_PROGRESS,
    progress: 40,
    startDate: "2025-02-01T00:00:00Z",
    lastUpdated: "2025-04-25T00:00:00Z",
    featured: true,
    creator: CreatorType.HUMAN_IN_THE_LOOP,
  },
  {
    id: "p7",
    name: "c18n.nvim",
    description:
      "Neovim plugin that bridges Claude and Ollama as a bypass provider, bringing AI-powered code completion into the editor with local model support.",
    imageUrl: "https://picsum.photos/id/240/800/600",
    githubUrl: "https://github.com/geoffjay/c18n.nvim",
    technologies: ["Lua", "Neovim", "Ollama", "Claude API"],
    status: ProjectStatus.IN_PROGRESS,
    progress: 20,
    startDate: "2025-01-01T00:00:00Z",
    lastUpdated: "2025-02-15T00:00:00Z",
    featured: false,
    creator: CreatorType.CLANKER_DOMINANT,
  },
  {
    id: "p8",
    name: "signals",
    description:
      "Vibe-coded playground application for audio signal generation and visualization. Built entirely with AI guidance as an exploration of fully AI-driven development.",
    imageUrl: "https://picsum.photos/id/250/800/600",
    githubUrl: "https://github.com/geoffjay/signals",
    liveUrl: "https://signals.geoffjay.com",
    technologies: ["React", "TypeScript", "Web Audio API", "Vite"],
    status: ProjectStatus.IN_PROGRESS,
    progress: 65,
    startDate: "2024-06-01T00:00:00Z",
    lastUpdated: "2025-01-20T00:00:00Z",
    featured: true,
    creator: CreatorType.PURE_SLOP,
  },
  {
    id: "p9",
    name: "com.geoffjay.dots",
    description:
      "Mobile game created collaboratively with my 4-year-old daughter, inspired by the interactive elements in one of her picture books. Features colorful dot-based puzzles.",
    imageUrl: "https://picsum.photos/id/260/800/600",
    githubUrl: "https://github.com/geoffjay/com.geoffjay.dots",
    technologies: ["Flutter", "Dart"],
    status: ProjectStatus.COMPLETED,
    progress: 90,
    startDate: "2024-08-01T00:00:00Z",
    lastUpdated: "2024-12-01T00:00:00Z",
    featured: true,
    creator: CreatorType.CLANKER_DOMINANT,
  },
];

export const CREATOR_LABELS: Record<CreatorType, string> = {
  [CreatorType.MAN_MADE]: "Man Made",
  [CreatorType.HUMAN_IN_THE_LOOP]: "Human in the Loop",
  [CreatorType.CLANKER_DOMINANT]: "Clanker Dominant",
  [CreatorType.PURE_SLOP]: "Pure Slop",
};

export const CREATOR_COLORS: Record<CreatorType, string> = {
  [CreatorType.MAN_MADE]: "bg-green-100 text-green-700",
  [CreatorType.HUMAN_IN_THE_LOOP]: "bg-blue-100 text-blue-700",
  [CreatorType.CLANKER_DOMINANT]: "bg-purple-100 text-purple-700",
  [CreatorType.PURE_SLOP]: "bg-orange-100 text-orange-700",
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.PLANNING]: "Planning",
  [ProjectStatus.IN_PROGRESS]: "In Progress",
  [ProjectStatus.COMPLETED]: "Completed",
  [ProjectStatus.ON_HOLD]: "On Hold",
  [ProjectStatus.ARCHIVED]: "Archived",
};

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  [ProjectStatus.PLANNING]: "bg-purple-100 text-purple-700",
  [ProjectStatus.IN_PROGRESS]: "bg-blue-100 text-blue-700",
  [ProjectStatus.COMPLETED]: "bg-green-100 text-green-700",
  [ProjectStatus.ON_HOLD]: "bg-yellow-100 text-yellow-700",
  [ProjectStatus.ARCHIVED]: "bg-gray-100 text-gray-600",
};
