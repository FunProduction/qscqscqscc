import Papa from 'papaparse';
import { Challenge, CONFIG } from '../types';

export const fetchChallenges = async (): Promise<Challenge[]> => {
  try {
    const response = await fetch(CONFIG.CHALLENGES_CSV_URL);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data as Challenge[]);
        },
        error: (error: Error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return [];
  }
};

export const checkPartnerApproval = async (partnerEmail: string): Promise<boolean> => {
  // In a real app, we would fetch the responses CSV and check if the email exists
  // For this demo, we'll simulate a check.
  // If the email contains "test", we assume they exist.
  
  console.log("Checking partner email:", partnerEmail);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  
  // Mock logic:
  if (partnerEmail.toLowerCase().includes('error')) return false;
  return true;
};

export const submitManChoices = async (name: string, email: string, approvedTitles: string[]) => {
  // In a real app, this would POST to a Google Form
  // Since we can't easily do a cross-origin POST to Google Forms without CORS issues in a pure client-side app sometimes,
  // we often use a 'no-cors' mode or a proxy.
  
  console.log("Submitting Man Choices:", { name, email, approvedTitles });
  
  // Construct the form data
  const formData = new FormData();
  formData.append(CONFIG.FORM_FIELD_NAME, name);
  formData.append(CONFIG.FORM_FIELD_EMAIL, email);
  formData.append(CONFIG.FORM_FIELD_APPROVED_TITLES, approvedTitles.join(', '));

  try {
    await fetch(CONFIG.GOOGLE_FORM_ACTION_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });
    return true;
  } catch (error) {
    console.error("Error submitting form:", error);
    return false;
  }
};
