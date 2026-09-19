"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, FileText, Video, HelpCircle, MessageSquare, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Layout";

export default function ResourcesPage() {
  const guides = [
    { title: "How to Find Fully Funded Scholarships", category: "Scholarship Guides", href: "#" },
    { title: "Writing a Winning Statement of Purpose", category: "Application Tips", href: "#" },
    { title: "IELTS vs TOEFL: Which Test Should You Take?", category: "Language Tests", href: "#" },
    { title: "Complete Guide to Recommendation Letters", category: "Application Tips", href: "#" },
    { title: "How to Prepare for Scholarship Interviews", category: "Interviews", href: "#" },
    { title: "Understanding Financial Aid vs Scholarships", category: "Financial Aid", href: "#" },
    { title: "Top 10 Mistakes in Scholarship Applications", category: "Common Mistakes", href: "#" },
    { title: "Student Visa Requirements by Country", category: "Visa Information", href: "#" },
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen py-12">
      <Container>
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 mb-3">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Student Knowledge Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950">
            Scholarship Application Resources
          </h1>
          <p className="mt-2 text-sm text-gray-600 max-w-2xl">
            Expert guides, application strategies, writing templates, and step-by-step tutorials to strengthen your scholarship applications.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: FileText, title: "Application Guides", count: "15+ Articles", color: "bg-blue-50 text-blue-700" },
            { icon: Video, title: "Video Tutorials", count: "Coming Soon", color: "bg-purple-50 text-purple-700" },
            { icon: HelpCircle, title: "FAQs", count: "50+ Answered", color: "bg-emerald-50 text-emerald-700" },
            { icon: MessageSquare, title: "Success Stories", count: "Student Experiences", color: "bg-amber-50 text-amber-700" },
          ].map((cat) => (
            <div key={cat.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs hover:shadow-md transition-shadow">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.color} mb-3`}>
                <cat.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">{cat.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{cat.count}</p>
            </div>
          ))}
        </div>

        {/* Guides List */}
        <h2 className="text-xl font-bold text-gray-900 mb-6">Popular Guides & Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guides.map((guide, idx) => (
            <Link
              key={idx}
              href={guide.href}
              className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-xs hover:shadow-md hover:border-primary-300 transition-all group"
            >
              <div>
                <span className="text-xs font-semibold text-primary-600">{guide.category}</span>
                <h3 className="font-bold text-sm text-gray-900 mt-1 group-hover:text-primary-700">{guide.title}</h3>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 shrink-0" />
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
