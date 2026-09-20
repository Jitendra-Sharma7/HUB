"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Database, Eye, CheckCircle2, AlertTriangle, TrendingUp, Users, Search, Plus } from "lucide-react";
import { Container } from "@/components/layout/Layout";
import { api } from "@/lib/data/store";
import type { ScholarshipData } from "@/lib/data/mock-scholarships";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [scholarships, setScholarships] = useState<ScholarshipData[]>([]);
  const [filter, setFilter] = useState<"all" | "needs-verification" | "expired">("all");
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    title: "",
    providerId: "",
    countryId: "us",
    description: "",
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString().slice(0, 10),
  });

  const loadScholarships = async () => {
    setLoading(true);
    try {
      const res = await api.getScholarships({ limit: 200, status: "all" });
      setScholarships(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScholarships();
  }, []);

  const handleAddScholarship = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!draft.title.trim() || !draft.providerId.trim()) return;

    setSubmitting(true);
    try {
      const created = await api.addScholarship({
        title: draft.title.trim(),
        providerId: draft.providerId.trim(),
        countryId: draft.countryId,
        description: draft.description.trim() || `Opportunity from ${draft.providerId.trim()}.`,
        deadline: new Date(`${draft.deadline}T23:59:59Z`).toISOString(),
        fundingType: "fully-funded",
        fields: ["All"],
        degreeLevels: ["Master's"],
        eligibleCountries: ["All"],
        languageReqs: ["English proficiency"],
        documentsRequired: ["Application form"],
        fundingAmount: 5000,
        livingStipend: 1200,
        status: "Open",
        verificationStatus: "Verification Needed",
        lastVerifiedAt: new Date().toISOString(),
      });

      setScholarships((prev) => [created, ...prev]);
      setShowAddForm(false);
      setDraft({
        title: "",
        providerId: "",
        countryId: "us",
        description: "",
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString().slice(0, 10),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveScholarship = async (id: string) => {
    setRemovingId(id);
    try {
      const success = await api.removeScholarship(id);
      if (success) {
        setScholarships((prev) => prev.filter((s) => s.id !== id));
      }
    } finally {
      setRemovingId(null);
    }
  };

  const needsVerification = scholarships.filter(
    (s) => s.verificationStatus === "Verification Needed" || s.verificationStatus === "Potentially Expired"
  );

  const filteredList =
    filter === "needs-verification"
      ? needsVerification
      : filter === "expired"
      ? scholarships.filter((s) => s.status === "Closed" || s.status === "Expired")
      : scholarships;

  return (
    <div className="bg-gray-50/50 min-h-screen py-8">
      <Container>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 mb-2">
              <Shield className="h-3.5 w-3.5" />
              <span>Admin Access Only</span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-950">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage scholarships, verify submissions, and monitor platform analytics.
            </p>
          </div>
          <Link
            href="/scholarships"
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            Back to Public Site
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Database, label: "Total Scholarships", value: scholarships.length, color: "bg-blue-50 text-blue-700" },
            { icon: AlertTriangle, label: "Needs Verification", value: needsVerification.length, color: "bg-amber-50 text-amber-700" },
            { icon: Eye, label: "Active & Open", value: scholarships.filter((s) => s.status === "Open").length, color: "bg-emerald-50 text-emerald-700" },
            { icon: Users, label: "User Submissions", value: 12, color: "bg-purple-50 text-purple-700" },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-xl border p-5 ${stat.color} border-current/20`}>
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="h-5 w-5" />
                <p className="text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
              </div>
              <p className="text-2xl font-extrabold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Scholarships" },
              { id: "needs-verification", label: `Verification Queue (${needsVerification.length})` },
              { id: "expired", label: "Expired / Closed" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                  filter === tab.id
                    ? "bg-primary-600 text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowAddForm((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700"
          >
            <Plus className="h-3.5 w-3.5" />
            {showAddForm ? "Close Form" : "Add Scholarship"}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddScholarship} className="mb-6 rounded-2xl border border-dashed border-primary-200 bg-white p-5 shadow-xs">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Create Scholarship Entry</h2>
                <p className="text-xs text-gray-600">Add a scholarship to the public global database.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-xs font-medium text-gray-700">
                Scholarship title
                <input
                  required
                  value={draft.title}
                  onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Global Excellence Award"
                />
              </label>
              <label className="text-xs font-medium text-gray-700">
                Provider name
                <input
                  required
                  value={draft.providerId}
                  onChange={(e) => setDraft((prev) => ({ ...prev, providerId: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Global Fund"
                />
              </label>
              <label className="text-xs font-medium text-gray-700">
                Country
                <select
                  value={draft.countryId}
                  onChange={(e) => setDraft((prev) => ({ ...prev, countryId: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="us">United States</option>
                  <option value="gb">United Kingdom</option>
                  <option value="de">Germany</option>
                  <option value="ca">Canada</option>
                  <option value="au">Australia</option>
                  <option value="ch">Switzerland</option>
                  <option value="sg">Singapore</option>
                  <option value="nl">Netherlands</option>
                </select>
              </label>
              <label className="text-xs font-medium text-gray-700">
                Deadline
                <input
                  type="date"
                  value={draft.deadline}
                  onChange={(e) => setDraft((prev) => ({ ...prev, deadline: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </label>
            </div>
            <label className="mt-4 block text-xs font-medium text-gray-700">
              Description
              <textarea
                rows={3}
                value={draft.description}
                onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Brief overview for the public scholarship listing"
              />
            </label>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Adding..." : "Save Scholarship"}
              </button>
            </div>
          </form>
        )}

        {/* Scholarship Management Table */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-gray-100 bg-gray-50/70">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase tracking-wider">Scholarship</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase tracking-wider">Deadline</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase tracking-wider">Verification</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase tracking-wider">Last Checked</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      Loading scholarships...
                    </td>
                  </tr>
                ) : filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No scholarships match the selected filter
                    </td>
                  </tr>
                ) : (
                  filteredList.map((s) => (
                    <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/scholarships/${s.id}`}
                          className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-1"
                        >
                          {s.title}
                        </Link>
                        <p className="text-[11px] text-gray-500 mt-0.5">{s.providerId}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            s.status === "Open"
                              ? "bg-emerald-100 text-emerald-700"
                              : s.status === "Closed"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{formatDate(s.deadline)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            s.verificationStatus === "Verified Recently"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {s.verificationStatus === "Verified Recently" ? "✓ Verified" : "⚠ Needs Check"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(s.lastVerifiedAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/scholarships/${s.id}`}
                            className="rounded-lg border border-gray-200 px-2 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            View
                          </Link>
                          <button className="rounded-lg border border-gray-200 px-2 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50">
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveScholarship(s.id)}
                            disabled={removingId === s.id}
                            className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {removingId === s.id ? "Removing..." : "Remove"}
                          </button>
                          <button className="rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100">
                            ✓ Verify
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Preview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
            <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary-600" />
              Recent Activity (Demo)
            </h3>
            <div className="space-y-2 text-xs text-gray-600">
              <p>• 42 scholarship views in the last 24 hours</p>
              <p>• 18 users saved scholarships to their dashboard</p>
              <p>• 7 new user registrations today</p>
              <p>• 3 scholarship submissions awaiting verification</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
            <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
              <Search className="h-4 w-4 text-indigo-600" />
              Top Search Queries (Demo)
            </h3>
            <div className="space-y-2 text-xs text-gray-600">
              <p>• "Fully funded master's scholarships" - 128 searches</p>
              <p>• "Computer science PhD Germany" - 94 searches</p>
              <p>• "Chevening scholarship" - 76 searches</p>
              <p>• "DAAD scholarship 2027" - 63 searches</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
