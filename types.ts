export type SpaceType = 'ROOM' | 'ISLAND' | 'SPACESHIP';
export type Gender = 'Erkek' | 'Kız';

export interface AvatarConfig {
  skinColor: string;
  hairColor: string;
  shirtColor: string;
  style: number;
}

export interface Item {
  id: string;
  name: string;
  emoji: string;
  description: string;
  x: number; // Position percentage 0-100
  y: number; // Position percentage 0-100
}

export interface UserProfile {
  name: string;
  gender: Gender;
  friends: string[];
  age: number;
  avatar: AvatarConfig;
  space: SpaceType;
  inventory: Item[];
  coins: number;
}

export interface Story {
  title: string;
  content: string;
  theme: string;
  imageUrl?: string;
}

export interface Question {
  text: string;
  options: string[];
  correctIndex: number;
}

export interface QuizData {
  questions: Question[];
}

export enum AppState {
  ONBOARDING,
  DASHBOARD,
  READING,
  QUIZ,
  REWARD_SELECTION,
}