
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github, Layers } from "lucide-react";
import { FocusRailItem } from "./focus-rail";

interface ProjectDetailsProps {
    project: FocusRailItem | null;
    onClose: () => void;
}

export function ProjectDetails({ project, onClose }: ProjectDetailsProps) {
    if (!project) return null;

    return (
        <AnimatePresence>
            {project && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/90 backdrop-blur-md p-4 md:p-8 overflow-y-auto"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ y: 50, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 50, opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
                        className="relative w-full max-w-5xl bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Image Section */}
                        <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-black">
                            <img
                                src={project.imageSrc}
                                alt={project.title}
                                className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent md:bg-gradient-to-r" />
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 p-8 md:p-12 flex flex-col items-start justify-center space-y-6">
                            <div className="space-y-2">
                                {project.meta && (
                                    <span className="text-emerald-400 font-medium tracking-wide uppercase text-sm">
                                        {project.meta}
                                    </span>
                                )}
                                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                                    {project.title}
                                </h2>
                            </div>

                            <div className="text-neutral-400 text-lg leading-relaxed">
                                {project.longDescription || project.description || "No description available."}
                            </div>

                            {/* Tags */}
                            {project.tags && project.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag, idx) => (
                                        <div
                                            key={idx}
                                            className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-neutral-300 flex items-center gap-1"
                                        >
                                            <Layers className="w-3 h-3 text-neutral-500" />
                                            {tag}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap gap-4 mt-4 pt-6 border-t border-white/5 w-full">
                                {project.href && (
                                    <a
                                        href={project.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-colors"
                                    >
                                        Live Demo
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}

                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
