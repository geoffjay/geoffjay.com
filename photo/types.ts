import React from "react";

export interface Photo {
  id: string;
  url: string;
  title: string;
  filename: string; // Added filename
  date: string; // ISO Date string
  location?: string;
  tags: string[];
  isFavorite: boolean;
  resolution?: string; // Added resolution e.g., "1920x1080"
  size?: string; // Added size e.g., "2.4 MB"
}

export interface Album {
  id: string;
  name: string;
  coverId?: string;
}

export enum ViewType {
  ALL_PHOTOS = "ALL_PHOTOS",
  FAVORITES = "FAVORITES",
  ALBUM = "ALBUM",
  YEAR = "YEAR",
  TAG = "TAG",
}

export enum PhotoViewMode {
  COMPACT = "COMPACT", // Grid without details
  COMFORTABLE = "COMFORTABLE", // Grid with details (Cards)
  LIST = "LIST", // List with details
}

export interface ViewState {
  type: ViewType;
  value?: string; // Album ID, Year string, or Tag name
}

export interface SidebarSection {
  title: string;
  items: {
    id: string;
    label: string;
    count?: number;
    icon?: React.ReactNode;
    type: ViewType;
    value: string;
  }[];
}
