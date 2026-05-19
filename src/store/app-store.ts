import { create } from 'zustand';
import { Profile, Agent, Call } from '@/types';

interface AppState {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  agents: Agent[];
  setAgents: (agents: Agent[]) => void;
  calls: Call[];
  setCalls: (calls: Call[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  agents: [],
  setAgents: (agents) => set({ agents }),
  calls: [],
  setCalls: (calls) => set({ calls }),
}));
