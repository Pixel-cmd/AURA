// Country-specific emergency numbers
// Maps device region/locale to emergency number

export const EMERGENCY_NUMBERS: Record<string, string> = {
  // Europe (mostly 112)
  NL: '112', // Netherlands
  BE: '112', // Belgium
  DE: '112', // Germany
  FR: '112', // France
  ES: '112', // Spain
  IT: '112', // Italy
  UK: '999', // United Kingdom
  IE: '112', // Ireland
  
  // North America
  US: '911', // United States
  CA: '911', // Canada
  MX: '911', // Mexico
  
  // Asia
  JP: '110', // Japan (police), 119 (fire/ambulance)
  CN: '110', // China
  IN: '112', // India
  AU: '000', // Australia
  NZ: '111', // New Zealand
  
  // Default
  DEFAULT: '112', // European standard
};

/**
 * Get emergency number for a country code
 */
export function getEmergencyNumber(countryCode?: string): string {
  if (!countryCode) {
    return EMERGENCY_NUMBERS.DEFAULT;
  }
  
  return EMERGENCY_NUMBERS[countryCode.toUpperCase()] || EMERGENCY_NUMBERS.DEFAULT;
}

/**
 * Get emergency number for device locale
 */
export async function getEmergencyNumberForLocale(): Promise<string> {
  try {
    const { getLocales } = await import('expo-localization');
    const locales = getLocales();
    const region = locales[0]?.regionCode;
    return getEmergencyNumber(region);
  } catch (error) {
    return EMERGENCY_NUMBERS.DEFAULT;
  }
}

