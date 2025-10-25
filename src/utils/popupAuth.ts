// utils/popupAuth.ts

export const openAuthPopup = (
    url: string,
    width: number = 500,
    height: number = 600
  ): Window | null => {
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
  
    const popup = window.open(
      url,
      'auth-popup',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  
    return popup;
  };
  
  export const pollAuthCompletion = (
    popup: Window,
    onSuccess: () => void,
    onError: (error: string) => void,
    timeout: number = 300000 // 5 minutes
  ): NodeJS.Timeout | null => {
    const startTime = Date.now();
  
    const interval = setInterval(() => {
      try {
        // Check if popup is closed
        if (popup.closed) {
          clearInterval(interval);
          onSuccess();
          return;
        }
  
        // Check timeout
        if (Date.now() - startTime > timeout) {
          clearInterval(interval);
          popup.close();
          onError('Authentication timeout');
          return;
        }
      } catch (e) {
        console.error('Polling error:', e);
        clearInterval(interval);
        onError('Polling error');
      }
    }, 500);
  
    return interval;
  };
  
  export const handleAuthCallback = (data: {
    success: boolean;
    user?: any;
    error?: string;
  }) => {
    if (data.success) {
      // Notify parent window
      if (window.opener) {
        window.opener.postMessage(
          { type: 'AUTH_SUCCESS', data },
          window.location.origin
        );
      }
      window.close();
    } else {
      if (window.opener) {
        window.opener.postMessage(
          { type: 'AUTH_ERROR', error: data.error },
          window.location.origin
        );
      }
      window.close();
    }
  };
  
  export const listenForAuthMessage = (
    onSuccess: () => void,
    onError: (error: string) => void
  ) => {
    const handleMessage = (event: MessageEvent) => {
      // Verify origin
      if (event.origin !== window.location.origin) return;
  
      if (event.data.type === 'AUTH_SUCCESS') {
        onSuccess();
      } else if (event.data.type === 'AUTH_ERROR') {
        onError(event.data.error);
      }
    };
  
    window.addEventListener('message', handleMessage);
  
    return () => window.removeEventListener('message', handleMessage);
  };