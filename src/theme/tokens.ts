export const colors = {
  background: '#F6F7F9',
  surface: '#FFFFFF',
  primary: '#1F2A44', // deep indigo — admin/trust, used for primary actions & headers
  primaryPressed: '#16203572',
  accent: '#1F9C8B', // teal — used sparingly for the single active/focused state
  textPrimary: '#161B22',
  textSecondary: '#5B6472',
  border: '#DFE3E8',
  danger: '#C2452E',
  disabled: '#B7BDC6',
};

export const type = {
  title: { fontSize: 26, fontWeight: '700' as const, letterSpacing: -0.3 },
  subtitle: { fontSize: 15, fontWeight: '400' as const },
  label: { fontSize: 13, fontWeight: '600' as const, letterSpacing: 0.2 },
  body: { fontSize: 15, fontWeight: '400' as const },
  button: { fontSize: 16, fontWeight: '600' as const },
  error: { fontSize: 13, fontWeight: '500' as const },
};

export const spacing = (n: number) => n * 4;