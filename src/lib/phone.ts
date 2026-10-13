// Algerian mobile numbers: 05 / 06 / 07 + 8 digits. Accepts +213 / 00213 / 213 prefixes,
// spaces, dots, dashes, and Arabic-Indic digits typed on Arabic keyboards.
// Returns the national form "0XXXXXXXXX", or null when invalid.
export function normalizePhone(input: string): string | null {
  let d = input
    .replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 0x06f0))
    .replace(/[\s.\-()/]/g, '');
  if (d.startsWith('+213')) d = d.slice(4);
  else if (d.startsWith('00213')) d = d.slice(5);
  else if (d.startsWith('213') && d.length >= 12) d = d.slice(3);
  else if (!d.startsWith('0')) return null;
  d = '0' + d.replace(/^0/, ''); // "+213 0770…" carries a redundant trunk 0
  return /^0[567]\d{8}$/.test(d) ? d : null;
}

// "0770786471" → "0770 78 64 71"
export const formatPhone = (national: string) => national.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})$/, '$1 $2 $3 $4');
