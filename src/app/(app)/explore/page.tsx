"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Sparkles, ArrowRight, Compass, Plus, Users, Clock, Zap } from "lucide-react";
import { templates, type Template } from "@/data/templates";
import { cn } from "@/lib/utils";

import { TemplatePreviewDialog } from "@/components/TemplatePreviewDialog";

const CATEGORIES = ["All", "Tech", "Fitness", "Language", "Creative", "Lifestyle", "Business"];

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

    const filteredTemplates = templates.filter((template) => {
        const matchesSearch =
            template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            selectedCategory === "All" || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen space-y-8 pb-20">
            {/* Header Section */}
            <div className="space-y-4 text-center md:text-left">
                <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white md:text-5xl">
                    Discover your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Achievement</span>
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl">
                    Browse curated roadmaps to start your journey instantly, or create a custom path from scratch.
                </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                    <Input
                        placeholder="Search for a goal..."
                        className="h-12 rounded-xl pl-10 bg-white/50 border-neutral-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    {CATEGORIES.map((cat) => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? "default" : "outline"}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "rounded-full px-6 transition-all",
                                selectedCategory === cat
                                    ? "bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20"
                                    : "border-neutral-200 text-neutral-600 hover:border-indigo-200 hover:text-indigo-600"
                            )}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Templates Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {/* 'Create from Scratch' Card - Always First */}
                <Link href="/goals/new" className="group h-full">
                    <Card className="h-full border-2 border-dashed border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50/80 hover:border-indigo-400 transition-all duration-300 rounded-2xl cursor-pointer overflow-hidden relative">
                        <div className="absolute inset-0 bg-grid-indigo-500/[0.05] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
                        <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
                            <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-indigo-100">
                                <Plus className="h-8 w-8 text-indigo-600" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-indigo-900">Create from Scratch</h3>
                                <p className="text-sm text-indigo-600/80 leading-relaxed">
                                    Have a specific ambitious goal? Let AI architect your custom roadmap.
                                </p>
                            </div>
                            <Button variant="ghost" className="text-indigo-600 group-hover:bg-indigo-100/50 rounded-xl mt-2">
                                Start Custom Goal <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>

                {/* Template Cards */}
                {filteredTemplates.map((template) => {
                    const Icon = template.icon;
                    return (
                        <div key={template.id} className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-[18px] opacity-0 group-hover:opacity-100 blur transition duration-300" />
                            <Card
                                onClick={() => setSelectedTemplate(template)}
                                className="relative h-full flex flex-col justify-between border-neutral-100 bg-white dark:bg-slate-900 transition-all rounded-2xl hover:-translate-y-1 overflow-hidden cursor-pointer"
                            >
                                <CardContent className="p-6 space-y-4 h-full flex flex-col">
                                    {/* Card Header */}
                                    <div className="flex items-start justify-between">
                                        <div className={cn(
                                            "h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-md",
                                            template.category === "Tech" ? "bg-blue-500" :
                                                template.category === "Fitness" ? "bg-emerald-500" :
                                                    template.category === "Creative" ? "bg-pink-500" :
                                                        template.category === "Language" ? "bg-orange-500" :
                                                            "bg-indigo-500"
                                        )}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <Badge variant="secondary" className="rounded-lg bg-neutral-100 text-neutral-600">
                                            {template.category}
                                        </Badge>
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-2 flex-grow">
                                        <h3 className="text-lg font-bold text-neutral-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                            {template.title}
                                        </h3>
                                        <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                                            {template.description}
                                        </p>
                                    </div>

                                    {/* Metadata Tags */}
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {template.tags.slice(0, 2).map(tag => (
                                            <span key={tag} className="text-[10px] font-medium px-2 py-1 rounded-md bg-neutral-50 text-neutral-500 border border-neutral-100">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Footer Stats */}
                                    <div className="pt-4 mt-auto border-t border-neutral-100 flex items-center justify-between text-xs font-medium text-neutral-500">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5" />
                                            {template.duration} Days
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Zap className="h-3.5 w-3.5 text-amber-500" />
                                            {template.difficulty}
                                        </div>
                                    </div>

                                    {/* Hover Action Overlay */}
                                    <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-black/90 flex flex-col items-center justify-center p-6 text-center backdrop-blur-[2px]">
                                        <p className="font-bold text-neutral-900 mb-2">{template.title}</p>
                                        <Button className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg text-white">
                                            View Roadmap
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}
            </div>

            {/* Preview Dialog */}
            <TemplatePreviewDialog
                template={selectedTemplate}
                open={!!selectedTemplate}
                onOpenChange={(open) => !open && setSelectedTemplate(null)}
            />
        </div>
    );
}
