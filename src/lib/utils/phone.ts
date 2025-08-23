/**
 * Utilitaires pour la gestion des numéros de téléphone camerounais
 */

/**
 * Formate un numéro de téléphone camerounais pour l'affichage
 * @param phone - Le numéro de téléphone à formater
 * @returns Le numéro formaté
 */
export function formatCameroonPhone(phone: string): string {
  if (!phone) return '';
  
  // Nettoyer le numéro (supprimer espaces, tirets, etc.)
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Si le numéro commence par 237, c'est un format international
  if (cleanPhone.startsWith('237')) {
    const number = cleanPhone.slice(3); // Enlever le 237
    if (number.length === 9) {
      return `+237 ${number.slice(0, 1)} ${number.slice(1, 3)} ${number.slice(3, 5)} ${number.slice(5, 7)} ${number.slice(7, 9)}`;
    }
  }
  
  // Format national (6XX XXX XXX ou 7XX XXX XXX)
  if (cleanPhone.length === 9 && (cleanPhone.startsWith('6') || cleanPhone.startsWith('7'))) {
    return `${cleanPhone.slice(0, 1)} ${cleanPhone.slice(1, 3)} ${cleanPhone.slice(3, 5)} ${cleanPhone.slice(5, 7)} ${cleanPhone.slice(7, 9)}`;
  }
  
  // Si le format n'est pas reconnu, retourner tel quel
  return phone;
}

/**
 * Valide un numéro de téléphone camerounais
 * @param phone - Le numéro de téléphone à valider
 * @returns true si valide, false sinon
 */
export function validateCameroonPhone(phone: string): boolean {
  if (!phone) return true; // Champ optionnel
  
  const cleanPhone = phone.replace(/\s/g, '');
  
  // Format international : +237 6XX XX XX XX ou +237 7XX XX XX XX
  const internationalPattern = /^\+237[67]\d{8}$/;
  
  // Format national : 6XX XX XX XX ou 7XX XX XX XX
  const nationalPattern = /^[67]\d{8}$/;
  
  return internationalPattern.test(cleanPhone) || nationalPattern.test(cleanPhone);
}

/**
 * Normalise un numéro de téléphone camerounais au format international
 * @param phone - Le numéro de téléphone à normaliser
 * @returns Le numéro au format international (+237...)
 */
export function normalizeCameroonPhone(phone: string): string {
  if (!phone) return '';
  
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Si déjà au format international
  if (cleanPhone.startsWith('237') && cleanPhone.length === 12) {
    return `+${cleanPhone}`;
  }
  
  // Si format national (9 chiffres commençant par 6 ou 7)
  if (cleanPhone.length === 9 && (cleanPhone.startsWith('6') || cleanPhone.startsWith('7'))) {
    return `+237${cleanPhone}`;
  }
  
  // Retourner tel quel si format non reconnu
  return phone;
}

/**
 * Détecte l'opérateur à partir du numéro de téléphone
 * @param phone - Le numéro de téléphone
 * @returns Le nom de l'opérateur ou 'Inconnu'
 */
export function getCameroonOperator(phone: string): string {
  if (!phone) return 'Inconnu';
  
  const cleanPhone = phone.replace(/\D/g, '');
  let number = cleanPhone;
  
  // Si format international, enlever le préfixe 237
  if (cleanPhone.startsWith('237')) {
    number = cleanPhone.slice(3);
  }
  
  if (number.length !== 9) return 'Inconnu';
  
  const prefix = number.slice(0, 3);
  
  // MTN Cameroon
  if (prefix.startsWith('67') || prefix.startsWith('68') || prefix.startsWith('65')) {
    return 'MTN';
  }
  
  // Orange Cameroon
  if (prefix.startsWith('69') || ['655', '656', '657', '658', '659'].includes(prefix)) {
    return 'Orange';
  }
  
  // Camtel
  if (['233', '242', '243'].includes(prefix)) {
    return 'Camtel';
  }
  
  return 'Autre';
}

/**
 * Exemples de numéros valides pour l'aide utilisateur
 */
export const CAMEROON_PHONE_EXAMPLES = [
  '+237 6 77 88 99 00',
  '+237 6 55 66 77 88',
  '6 77 88 99 00',
  '6 99 88 77 66',
  '7 11 22 33 44'
];
