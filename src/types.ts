export interface Challenge {
  title: string;
  uitdaging: string;
  beloning1: string;
  beloning2: string;
  tegenprestatie1: string;
  tegenprestatie2: string;
  'waneer beloning': string;
  'waneer tegenprestatie': string;
  'wat mag de man weten': string;
  random: string; // "TRUE" or "FALSE"
  week: string; // Parsed as string from CSV usually
}

export interface UserState {
  name: string;
  gender: 'Man' | 'Vrouw' | null;
  email: string;
  partnerEmail: string;
  step: number;
  selectedChallenges: Challenge[]; // The 2 final challenges
  tempSelectedChallenges: Challenge[]; // The 4 from memory game
  choices: {
    [challengeTitle: string]: {
      reward: string;
      consequence: string;
    };
  };
}

export const INITIAL_STATE: UserState = {
  name: '',
  gender: null,
  email: '',
  partnerEmail: '',
  step: 1,
  selectedChallenges: [],
  tempSelectedChallenges: [],
  choices: {},
};

// Configuration for Google Sheets/Forms
// In a real scenario, these would be environment variables or user inputs
export const CONFIG = {
  // URL to the published CSV of the challenges sheet
  // Converted from pubhtml to pub?output=csv for easier parsing
  CHALLENGES_CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTp29ABfsojVKFwez0dL5g0POwj2p17U3nmnfOgJMzbKgyvg70sNHkKQklsSNqWOn5RHZdZ73NdhBtG/pub?output=csv', 
  // URL to the published CSV of the responses (Man's approvals)
  RESPONSES_CSV_URL: 'responses_mock.csv', // Relative path for static deployment
  // Google Form Action URL for submission
  GOOGLE_FORM_ACTION_URL: 'https://docs.google.com/forms/d/e/1FAIpQLSfm_JB9SI1QEqTS6X7UhlwyFMV4stlsuXXJUaG6ThB46DzruA/formResponse',
  // Form Field IDs
  FORM_FIELD_NAME: 'entry.698583305',
  FORM_FIELD_EMAIL: 'entry.329491',
  FORM_FIELD_APPROVED_TITLES: 'entry.1735453588',
};
