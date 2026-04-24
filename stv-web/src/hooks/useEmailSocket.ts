'use client';
import { useEffect, useCallback } from 'react';
import emailSocketService from '../services/emailSocket.service';

interface UseEmailSocketOptions {
  userId: string;
  onNewEmail?: (data: any) => void;
  onEmailSent?: (data: any) => void;
  onEmailError?: (error: string) => void;
}

export function useEmailSocket({
  userId,
  onNewEmail,
  onEmailSent,
  onEmailError,
}: UseEmailSocketOptions) {
  const handleNewEmail = useCallback((data: any) => onNewEmail?.(data), [onNewEmail]);
  const handleEmailSent = useCallback((data: any) => onEmailSent?.(data), [onEmailSent]);
  const handleEmailError = useCallback((data: any) => onEmailError?.(data.error), [onEmailError]);

  useEffect(() => {
    if (!userId) return;

    emailSocketService.connect(userId);

    emailSocketService.on('new_email', handleNewEmail);
    emailSocketService.on('email_sent', handleEmailSent);
    emailSocketService.on('email_error', handleEmailError);

    return () => {
      emailSocketService.off('new_email', handleNewEmail);
      emailSocketService.off('email_sent', handleEmailSent);
      emailSocketService.off('email_error', handleEmailError);
    };
  }, [userId, handleNewEmail, handleEmailSent, handleEmailError]);

  return { isConnected: emailSocketService.isConnected() };
}
