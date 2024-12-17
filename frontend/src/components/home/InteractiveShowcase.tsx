"use client";

import { motion } from "framer-motion";
import { BarChart3, MessageSquare, Users2, Zap } from "lucide-react";
import { FeatureCard } from "./feature-card";

export function InteractiveShowcase() {
  const features = [
    {
      icon: MessageSquare,
      title: "Smart Feedback Collection",
      description: "Collect feedback across multiple channels with intelligent routing and categorization.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Transform raw feedback into actionable insights with powerful analytics tools.",
    },
    {
      icon: Users2,
      title: "Team Collaboration",
      description: "Work together seamlessly with built-in collaboration features and workflows.",
    },
    {
      icon: Zap,
      title: "Automated Actions",
      description: "Set up automated responses and actions based on feedback patterns.",
    },
  ];

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 grid gap-6 sm:grid-cols-2"
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            delay={index * 0.1}
          />
        ))}
      </motion.div>

      {/* Decorative Elements */}
      {/* <div className="absolute -inset-x-4 -inset-y-4 z-0 bg-secondary/30 backdrop-blur-xl rounded-2xl" /> */}
      <div className="absolute top-0 right-0 -z-10 h-96 w-96 bg-primary/20 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 bg-secondary/30 blur-[100px] rounded-full" />
    </div>
  );
}
