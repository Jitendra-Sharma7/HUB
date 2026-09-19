"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Layout";
import { mockFields } from "@/lib/data/mock-fields";

export default function FieldsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = ["all", "Technology", "STEM", "Health Sciences", "Business", "Social Sciences", "Natural Sciences"];

  const filtered = mockFields.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === "all" || f.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="bg-gray-50/50 min-h-screen py-10">
      <Container>
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 mb-3">
            <span>Academic Disciplines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950">
            Scholarships by Field of Study
          </h1>
          <p className="mt-2 text-sm text-gray-600 max-w-2xl">
            Browse specialized funding opportunities for Computer Science, Engineering, Medicine, Business, Humanities, and Sciences.
          </p>
        </div>

        {/* Search and Category filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search field of study..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-xs shadow-xs focus:border-primary-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                  category === cat
                    ? "bg-primary-600 text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((f) => (
            <div
              key={f.id}
              className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="rounded-full bg-primary-50 text-primary-700 font-bold px-2.5 py-1 text-xs border border-primary-100">
                    {f.scholarshipCount} Grants
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900">{f.name}</h3>
                <p className="text-xs font-semibold text-primary-600 mb-3">{f.category}</p>

                <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-3">
                  {f.description}
                </p>

                <div className="space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-600">
                  <div>
                    <span className="font-semibold text-gray-900">Career Paths: </span>
                    <span>{f.careerPaths.slice(0, 3).join(", ")}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Avg Salary: </span>
                    <span>{f.avgSalary}</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/scholarships?field=${encodeURIComponent(f.name)}`}
                className="mt-6 flex items-center justify-center gap-1.5 rounded-xl bg-gray-50 py-2.5 text-xs font-bold text-primary-700 border border-gray-200 hover:bg-primary-50 transition-colors"
              >
                <span>Browse {f.name} Scholarships →</span>
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
