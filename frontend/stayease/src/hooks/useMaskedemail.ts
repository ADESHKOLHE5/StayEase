import { useMemo } from 'react';

export const useMaskedEmail = (email: string | undefined) => {
  return useMemo(() => {
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return email || '';
    }

    const [localPart] = email.split('@');
    
    // Shows first 3 characters, then 4 asterisks
    const visible = localPart.substring(0, 3);
    
    return `${visible}****@*****`;
  }, [email]);
};