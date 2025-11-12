// Project data configuration file
// Used to manage data for the project display page

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	category: "web" | "mobile" | "desktop" | "other";
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	liveDemo?: string;
	sourceCode?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
}

export const projectsData: Project[] = [
	{
		id: "music-cli",
		title: "Music CLI",
		description: "因为朋友影响做的一个命令行音乐播放器，支持逐字歌词",
		image: "",
		category: "desktop",
		techStack: ["Go", "beep", "tag"],
		status: "completed",
		liveDemo: "",
		sourceCode: "https://github.com/sokx6/music-cli",
		startDate: "2025-10-24",
		endDate: "2025-10-31",
		featured: false,
		tags: ["命令行", "音乐播放", "歌词显示", "Go"],
	},
	{
		id: "imperishable-gate",
		title: "Imperishable Gate | 不朽之门",
		description:
			"受东方Project启发的现代化命令行链接管理系统（好多是AI完成的），支持多用户、标签、别名、备注、自动元数据抓取、智能监控、JWT双令牌认证与系统Keyring安全存储。采用Go+Echo+GORM开发，支持SQLite/MySQL/PostgreSQL，跨平台CLI体验，标签系统极为灵活高效。",
		image: "/images/projects/imperishable-gate.jpg",
		category: "web",
		techStack: [
			"Go",
			"Echo",
			"GORM",
			"SQLite",
			"MySQL",
			"PostgreSQL",
			"Cobra",
			"JWT",
		],
		status: "completed",
		liveDemo: "",
		sourceCode: "https://github.com/sokx6/imperishable-gate",
		startDate: "2025-09-30",
		endDate: "2025-10-11",
		featured: false,
		tags: ["命令行", "链接管理", "标签系统", "Go"],
	},
];

// Get project statistics
export const getProjectStats = () => {
	const total = projectsData.length;
	const completed = projectsData.filter((p) => p.status === "completed").length;
	const inProgress = projectsData.filter(
		(p) => p.status === "in-progress",
	).length;
	const planned = projectsData.filter((p) => p.status === "planned").length;

	return {
		total,
		byStatus: {
			completed,
			inProgress,
			planned,
		},
	};
};

// Get projects by category
export const getProjectsByCategory = (category?: string) => {
	if (!category || category === "all") {
		return projectsData;
	}
	return projectsData.filter((p) => p.category === category);
};

// Get featured projects
export const getFeaturedProjects = () => {
	return projectsData.filter((p) => p.featured);
};

// Get all tech stacks
export const getAllTechStack = () => {
	const techSet = new Set<string>();
	projectsData.forEach((project) => {
		project.techStack.forEach((tech) => techSet.add(tech));
	});
	return Array.from(techSet).sort();
};
