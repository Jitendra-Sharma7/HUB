import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ScholarshipData } from '../data/mock-scholarships';

export interface ApplicationTrackerItem {
  id: string; // Scholarship ID
  scholarship: ScholarshipData;
  status: 'Interested' | 'Preparing' | 'Documents Needed' | 'Application Started' | 'Submitted' | 'Interview' | 'Accepted' | 'Rejected' | 'Waitlisted' | 'Withdrawn';
  notes: string;
  reminderDate?: string;
  addedAt: string;
}

interface UserProfile {
  name: string;
  email: string;
  degreeLevel: string;
  field: string;
  targetCountries: string[];
  gpa: number | null;
  needFullFunding: boolean;
  citizenship: string;
}

interface AppState {
  // User Session
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;

  // Saved / Tracked Data
  savedScholarshipIds: string[];
  toggleSaveScholarship: (id: string) => void;
  isSaved: (id: string) => boolean;

  compareIds: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;

  applications: ApplicationTrackerItem[];
  trackApplication: (scholarship: ScholarshipData, status?: ApplicationTrackerItem['status']) => void;
  updateApplicationStatus: (id: string, status: ApplicationTrackerItem['status']) => void;
  removeApplication: (id: string) => void;

  // Search State
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,

      login: (email, name) => set({
        isAuthenticated: true,
        user: {
          email,
          name,
          degreeLevel: '',
          field: '',
          targetCountries: [],
          gpa: null,
          needFullFunding: false,
          citizenship: ''
        }
      }),

      logout: () => set({ isAuthenticated: false, user: null }),

      updateProfile: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),

      savedScholarshipIds: [],
      toggleSaveScholarship: (id) => set((state) => {
        const exists = state.savedScholarshipIds.includes(id);
        if (exists) {
          return { savedScholarshipIds: state.savedScholarshipIds.filter(sId => sId !== id) };
        }
        return { savedScholarshipIds: [...state.savedScholarshipIds, id] };
      }),
      isSaved: (id) => get().savedScholarshipIds.includes(id),

      compareIds: [],
      toggleCompare: (id) => set((state) => {
        const exists = state.compareIds.includes(id);
        if (exists) {
          return { compareIds: state.compareIds.filter(cId => cId !== id) };
        }
        if (state.compareIds.length >= 4) {
          return state; // Max 4 items to compare
        }
        return { compareIds: [...state.compareIds, id] };
      }),
      clearCompare: () => set({ compareIds: [] }),

      applications: [],
      trackApplication: (scholarship, status = 'Interested') => set((state) => {
        const exists = state.applications.some(app => app.id === scholarship.id);
        if (exists) return state;

        return {
          applications: [...state.applications, {
            id: scholarship.id,
            scholarship,
            status,
            notes: '',
            addedAt: new Date().toISOString()
          }]
        };
      }),
      updateApplicationStatus: (id, status) => set((state) => ({
        applications: state.applications.map(app =>
          app.id === id ? { ...app, status } : app
        )
      })),
      removeApplication: (id) => set((state) => ({
        applications: state.applications.filter(app => app.id !== id)
      })),

      recentSearches: [],
      addRecentSearch: (query) => set((state) => {
        if (!query.trim()) return state;
        const filtered = state.recentSearches.filter(q => q.toLowerCase() !== query.toLowerCase());
        return {
          recentSearches: [query, ...filtered].slice(0, 5)
        };
      }),
      clearRecentSearches: () => set({ recentSearches: [] })
    }),
    {
      name: 'scholaratlas-storage', // key in local storage
      partialize: (state) => ({
        savedScholarshipIds: state.savedScholarshipIds,
        applications: state.applications,
        recentSearches: state.recentSearches,
        compareIds: state.compareIds
      }), // only persist these fields for anonymous users
    }
  )
);
