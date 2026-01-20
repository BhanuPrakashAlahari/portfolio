import { useState } from "react";
import { FocusRail, FocusRailItem } from "../ui/focus-rail";
import { BGPattern } from "../ui/bg-pattern";
import { ProjectDetails } from "../ui/project-details";

import { FaReact, FaNodeJs, FaShieldAlt, FaUserLock, FaDatabase, FaCss3Alt, FaBootstrap } from "react-icons/fa";
import { SiJavascript, SiTypescript, SiTailwindcss, SiRecoil, SiPostgresql, SiPrisma, SiExpress, SiRedis, SiVite, SiReactrouter, SiJsonwebtokens } from "react-icons/si";
import { TbApi } from "react-icons/tb";

import synapstoreImg from "@/assets/projects/synapstore.png";
import jobbyImg from "@/assets/projects/jobby.png";
import nxtwatchImg from "@/assets/projects/nxtwatch.png";
import nxttrendzImg from "@/assets/projects/nxttrendz.png";

const commonTechTags = [
    "React JS", "JavaScript", "CSS", "Bootstrap", "Routing",
    "REST API Calls", "Local Storage", "JWT Token",
    "Authorization", "Authentication"
];

const commonTechIcons = [
    <FaReact key="react" className="text-blue-400" />,
    <SiJavascript key="js" className="text-yellow-400" />,
    <FaCss3Alt key="css" className="text-blue-500" />,
    <FaBootstrap key="bootstrap" className="text-purple-600" />,
    <SiReactrouter key="router" className="text-red-500" />,
    <TbApi key="api" className="text-green-500" />,
    <FaDatabase key="db" className="text-gray-400" />,
    <SiJsonwebtokens key="jwt" className="text-pink-500" />,
    <FaShieldAlt key="authz" className="text-emerald-400" />,
    <FaUserLock key="authn" className="text-orange-400" />
];

const synapStoreTags = [
    "React 18", "TypeScript", "TailwindCSS", "Node.js", "Express", "PostgreSQL", "Prisma", "Redis", "Recoil"
];

const synapStoreIcons = [
    <FaReact key="react" className="text-blue-400" />,
    <SiVite key="vite" className="text-purple-500" />,
    <SiTypescript key="ts" className="text-blue-600" />,
    <SiTailwindcss key="tailwind" className="text-cyan-400" />,
    <SiRecoil key="recoil" className="text-blue-500" />,
    <FaNodeJs key="node" className="text-green-500" />,
    <SiExpress key="express" className="text-white" />,
    <SiPostgresql key="pg" className="text-blue-400" />,
    <SiPrisma key="prisma" className="text-white" />,
    <SiRedis key="redis" className="text-red-500" />
];


const projects: FocusRailItem[] = [
    {
        id: 1,
        title: "SynapStore",
        description: "An smart pharmacy system with AI features",
        longDescription: "SynapStore is a revolutionary AI-powered pharmacy management system designed to streamline specific pharmaceutical workflows. It features predictive inventory analysis.",
        meta: "AI Pharmacy",
        tags: synapStoreTags,
        techIcons: synapStoreIcons,
        imageSrc: synapstoreImg,
        href: "https://www.synapstore.me",
    },
    {
        id: 2,
        title: "Jobby",
        description: "A full stack job searching platform",
        longDescription: "Jobby provides a comprehensive job search experience with advanced filtering, user authentication, and profile management capabilities.",
        meta: "Job Portal",
        tags: commonTechTags,
        techIcons: commonTechIcons,
        imageSrc: jobbyImg,
        href: "https://joby.ccbp.tech",
    },
    {
        id: 3,
        title: "Nxtwatch",
        description: "An YouTube clone with CRUD operations",
        longDescription: "A fully functional video streaming platform mimicking YouTube's core features including video playback, search, and theme toggling.",
        meta: "Streaming",
        tags: commonTechTags,
        techIcons: commonTechIcons,
        imageSrc: nxtwatchImg,
        href: "https://nxtwatch.ccbp.tech",
    },
    {
        id: 4,
        title: "NxtTrendz",
        description: "An ecommerce shopping platform",
        longDescription: "NxtTrendz is a modern e-commerce solution featuring product listings, cart management, and a seamless checkout process.",
        meta: "E-Commerce",
        tags: commonTechTags,
        techIcons: commonTechIcons,
        imageSrc: nxttrendzImg,
        href: "https://nxtz.ccbp.tech",
    },
];

const Projects = () => {
    const [selectedProject, setSelectedProject] = useState<FocusRailItem | null>(null);

    return (
        <section id="projects" className="min-h-screen w-full flex flex-col items-center justify-center py-20 relative overflow-hidden">
            <BGPattern variant="dots" mask="fade-y" size={20} fill="#444" className="opacity-20" />

            {/* Title */}
            <div className="mb-6 md:mb-12 text-center z-10 flex flex-col items-center gap-2 md:gap-4">
                <div className="flex items-center gap-2">
                    <div className="h-px w-8 bg-blue-500"></div>
                    <span className="text-sm font-bold text-blue-500 uppercase tracking-widest">
                        Selected Works
                    </span>
                    <div className="h-px w-8 bg-blue-500"></div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold font-display text-white leading-tight">
                    Explore My <span className="text-blue-500">Projects</span>
                </h1>
                <p className="text-neutral-400 max-w-lg">
                    Navigate the rail to view details of my recent work. Click on any project to see more information.
                </p>
            </div>

            {/* The Component */}
            <FocusRail
                items={projects}
                className="bg-transparent"
                autoPlay={false}
                loop={true}
                onProjectClick={(item) => setSelectedProject(item)}
            />

            {/* Project Details Modal */}
            <ProjectDetails
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </section>
    );
};

export default Projects;
