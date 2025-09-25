/**
 * Utility functions for QR scanner functionality
 * These functions are extracted for easier testing and reuse
 */

import { logger } from "./logger";

/**
 * Extracts the rate ID from a Harvest rate URL
 * Expected format: .../{team}/Rate/Details/{id}
 * @param url The URL from the QR code
 * @returns The rate ID or null if not found
 */
export const extractRateIdFromUrl = (url: string): string | null => {
  try {
    // Expected format: .../{team}/Rate/Details/{id}
    // We can use a regex to extract the rate ID from the URL
    const rateDetailPattern = /\/Rate\/Details\/([^\/\?]+)/i;
    const match = url.match(rateDetailPattern);
    return match ? match[1] : null;
  } catch (error) {
    logger.error("Failed to extract rate ID from URL", error, { url });
    return null;
  }
};

/**
 * Validates that the URL contains the expected team name
 * @param url The URL from the QR code
 * @param expectedTeam The team name to validate against
 * @returns True if the team matches, false otherwise
 */
export const validateTeamInUrl = (
  url: string,
  expectedTeam: string
): boolean => {
  try {
    // Check if the URL contains the expected team
    // Format: .../{team}/Rate/Details/{id}
    const teamPattern = new RegExp(`\/${expectedTeam}\/Rate\/Details\/`, "i");
    return teamPattern.test(url);
  } catch (error) {
    logger.error("Failed to validate team in URL", error, {
      url,
      expectedTeam,
    });
    return false;
  }
};

/**
 * Test cases for the URL parsing functions
 * These demonstrate the expected behavior
 */
export const testUrlParsing = () => {
  const testCases = [
    {
      name: "Valid URL with team 'harvest'",
      url: "https://harvest-test.azurewebsites.net/harvest/Rate/Details/rate-123",
      expectedTeam: "harvest",
      expectedId: "rate-123",
    },
    {
      name: "Valid URL with different team",
      url: "https://example.com/myteam/Rate/Details/labor-001",
      expectedTeam: "myteam",
      expectedId: "labor-001",
    },
    {
      name: "URL with query parameters",
      url: "https://harvest.com/team1/Rate/Details/equip-456?source=qr",
      expectedTeam: "team1",
      expectedId: "equip-456",
    },
    {
      name: "Case insensitive matching",
      url: "https://harvest.com/TEAM1/rate/details/test-789",
      expectedTeam: "team1",
      expectedId: "test-789",
    },
    {
      name: "Invalid URL - wrong format",
      url: "https://example.com/rate/123",
      expectedTeam: "team1",
      expectedId: null,
    },
    {
      name: "Invalid URL - missing rate details",
      url: "https://example.com/team1/Rate/123",
      expectedTeam: "team1",
      expectedId: null,
    },
  ];

  console.log("Running QR URL parsing tests...");

  testCases.forEach(({ name, url, expectedTeam, expectedId }) => {
    const extractedId = extractRateIdFromUrl(url);
    const teamMatches = validateTeamInUrl(url, expectedTeam);

    console.log(`\nTest: ${name}`);
    console.log(`URL: ${url}`);
    console.log(`Expected ID: ${expectedId}`);
    console.log(`Extracted ID: ${extractedId}`);
    console.log(`Team validates: ${teamMatches}`);
    console.log(`✅ ID Match: ${extractedId === expectedId ? "PASS" : "FAIL"}`);

    // For valid cases, team should match
    if (expectedId !== null) {
      console.log(`✅ Team Match: ${teamMatches ? "PASS" : "FAIL"}`);
    }
  });
};
