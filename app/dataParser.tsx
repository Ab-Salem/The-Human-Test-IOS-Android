// app/dataParser.tsx

import React from 'react';

export interface HistoricalEvent {
  event: string;    // This will store the event URI
  label: string;    // This will store the event name to display
  date: Date;
  image: string;    // URL for the image
}

// Static imports for JSON files
const DATASET_FILES = {
  'dataset1': require('../assets/dataset/dataset1.json'),
  'dataset2': require('../assets/dataset/dataset2.json'),
  'dataset3': require('../assets/dataset/dataset3.json'),
  'dataset4': require('../assets/dataset/dataset4.json'),
  'dataset5': require('../assets/dataset/dataset5.json')
} as const;

type DatasetKey = keyof typeof DATASET_FILES;

// Fallback sample data
const SAMPLE_EVENTS = [
  {
    event: "sample1",
    label: "Battle of Marathon",
    date: new Date("-0490-09-07"),
    image: ""
  },
  {
    event: "sample2",
    label: "Founding of Rome",
    date: new Date("-0753-04-21"),
    image: ""
  }
];

// Get a random event from a dataset
function getRandomEvent(dataset: any[]): HistoricalEvent {
  const randomIndex = Math.floor(Math.random() * dataset.length);
  const event = dataset[randomIndex];
  
  return {
    event: event.event,
    label: event.label,
    date: new Date(event.date),
    image: event.image || ''
  };
}

// Initialize datasets
export async function initializeDatasets(): Promise<void> {
  try {
    // Verify that we can access all datasets
    Object.keys(DATASET_FILES).forEach(key => {
      const dataset = DATASET_FILES[key as DatasetKey];
      if (!Array.isArray(dataset)) {
        throw new Error(`Invalid dataset format for ${key}`);
      }
    });
    
    console.log('Initialized datasets:', 
      Object.entries(DATASET_FILES)
        .map(([name, data]) => `${name}: ${(data as any[]).length} events`)
    );
  } catch (error) {
    console.error('Failed to initialize datasets:', error);
  }
}

// Get a random event from a specific dataset
export async function getRandomHistoricalEvent(filename: string): Promise<HistoricalEvent> {
  try {
    const datasetKey = filename.replace('.json', '') as DatasetKey;
    
    if (!(datasetKey in DATASET_FILES)) {
      throw new Error(`Invalid dataset filename: ${filename}`);
    }

    const dataset = DATASET_FILES[datasetKey];
    if (!Array.isArray(dataset)) {
      throw new Error(`Invalid dataset format for ${filename}`);
    }

    return getRandomEvent(dataset);
  } catch (error) {
    console.warn(`Failed to read dataset ${filename}, using sample data:`, error);
    return SAMPLE_EVENTS[Math.floor(Math.random() * SAMPLE_EVENTS.length)];
  }
}

export function formatEventDate(date: Date): string {
  const year = Math.abs(date.getFullYear());
  const suffix = date.getFullYear() < 0 ? ' BC' : ' AD';
  return `${year}${suffix}`;
}

const DataParser: React.FC = () => null;
export default DataParser;