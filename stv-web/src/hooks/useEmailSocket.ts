'use client';
import { useEffect, useCallback } from 'react';
import emailSocketService from '../services/emailSocket.service';

type SocketEventData = Record<string, unknown>;

interface SocketErrorData {
  error: string;
  [key: string]: unknown;
}

interface UseEmailSocketOptions {
  userId: string;
  onNewEmail?: (data: SocketEventData) => void;
  onEmailSent?: (data: SocketEventData) => void;
  onEmailError?: (error: string) => void;
}

export function useEmailSocket({
  userId,
  onNewEmail,
  onEmailSent,
  onEmailError,
}: UseEmailSocketOptions) {
  const handleNewEmail = useCallback((data: SocketEventData) => onNewEmail?.(data), [onNewEmail]);
  const handleEmailSent = useCallback((data: SocketEventData) => onEmailSent?.(data), [onEmailSent]);
  const handleEmailError = useCallback((data: SocketErrorData) => onEmailError?.(data.error), [onEmailError]);

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
