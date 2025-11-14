'use client';

/**
 * Paddle.js Provider Component
 * 
 * Loads and initializes Paddle.js for checkout functionality.
 * Based on: https://developer.paddle.com/paddlejs/overview
 */

import Script from 'next/script';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Paddle?: {
      Initialize: (config: {
        seller?: string | number; // Seller ID (vendor ID) - can be string or number
        vendor?: string | number; // Alternative name for seller ID (legacy)
        token?: string; // Client-side token (alternative to seller/vendor)
        environment?: 'sandbox' | 'production';
        eventCallback?: (data: any) => void;
      }) => void;
      Checkout: {
        open: (options: {
          transactionId?: string;
          items?: Array<{
            priceId: string;
            quantity: number;
          }>;
          customer?: {
            id?: string;
            email?: string;
          };
          customData?: Record<string, any>;
          settings?: {
            displayMode?: 'overlay' | 'inline';
            theme?: 'light' | 'dark';
            locale?: string;
            successUrl?: string;
            allowLogout?: boolean;
          };
        }) => void;
        close: () => void;
      };
      Environment: {
        set: (environment: 'sandbox' | 'production') => void;
      };
      Spinner: {
        show: () => void;
        hide: () => void;
      };
      Status: {
        libraryVersion: string;
      };
    };
  }
}

interface PaddleProviderProps {
  children: React.ReactNode;
}

export function PaddleProvider({ children }: PaddleProviderProps) {
  const [paddleLoaded, setPaddleLoaded] = useState(false);
  const [paddleInitialized, setPaddleInitialized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Get Paddle configuration from environment variables
  // Note: Next.js only exposes env vars prefixed with NEXT_PUBLIC_ to the browser
  // IMPORTANT: These are read at build time, so you must restart the dev server after changing .env
  // 
  // According to latest Paddle.js docs: https://developer.paddle.com/paddlejs/include-paddlejs
  // Only client-side tokens are supported. Vendor ID is no longer supported.
  // Get your client-side token from: Paddle Dashboard > Developer Tools > Authentication > Client-side tokens
  const paddleEnabled = process.env.NEXT_PUBLIC_PADDLE_ENABLED !== 'false'; // Default to true unless explicitly disabled
  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '';
  const vendorId = process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID || ''; // Kept for backward compatibility check only
  const environment = (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production';
  
  // Check if we're in development mode (never log sensitive data in production)
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Debug: Log environment variables (ONLY in development, and only first few chars for security)
  useEffect(() => {
    if (typeof window !== 'undefined' && isDevelopment) {
      console.log('🔍 Paddle Environment Check:');
      console.log('  - NEXT_PUBLIC_PADDLE_ENABLED:', paddleEnabled);
      console.log('  - NEXT_PUBLIC_PADDLE_CLIENT_TOKEN:', clientToken ? `${clientToken.substring(0, 12)}... (${clientToken.length} chars)` : 'NOT SET');
      console.log('  - NEXT_PUBLIC_PADDLE_VENDOR_ID:', vendorId ? `${vendorId.substring(0, 8)}... (${vendorId.length} chars)` : 'NOT SET');
      console.log('  - NEXT_PUBLIC_PADDLE_ENVIRONMENT:', environment);
      if (!paddleEnabled) {
        console.warn('⚠️ Paddle is DISABLED via NEXT_PUBLIC_PADDLE_ENABLED=false');
      }
    }
  }, [paddleEnabled, isDevelopment]);

  // Ensure we're on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only run on client side
    if (!isMounted || typeof window === 'undefined') {
      return;
    }

    // Log authentication method for debugging (ONLY in development)
    if (isDevelopment) {
      if (clientToken) {
        console.log(`🔑 Paddle Client Token loaded: ${clientToken.substring(0, 12)}...`);
      } else if (vendorId) {
        console.log(`🔑 Paddle Vendor ID loaded: ${vendorId.substring(0, 8)}... (using fallback method)`);
      } else {
        console.warn('⚠️ Paddle authentication not found. Please set NEXT_PUBLIC_PADDLE_CLIENT_TOKEN or NEXT_PUBLIC_PADDLE_VENDOR_ID in your .env file');
      }
    }

    // Initialize Paddle once the script is loaded
    if (paddleLoaded && !paddleInitialized && window.Paddle) {
      // Wait a bit for Paddle.js to fully initialize
      const initTimer = setTimeout(() => {
        try {
          // According to Paddle.js docs: https://developer.paddle.com/build/checkout/build-overlay-checkout
          // Use client-side token (preferred) or vendor ID (fallback)
          const trimmedToken = clientToken.trim();
          const trimmedVendorId = vendorId.trim();
          
          // Validate that at least one authentication method is provided
          if (!trimmedToken && !trimmedVendorId) {
            console.error('❌ Paddle authentication is missing. Cannot initialize Paddle.js');
            console.error('   Please set ONE of the following in your .env.local file:');
            console.error('   - NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=your_client_token (PREFERRED)');
            console.error('   - NEXT_PUBLIC_PADDLE_VENDOR_ID=your_vendor_id (FALLBACK)');
            console.error('   Then restart your Next.js dev server');
            console.error('   See: https://developer.paddle.com/build/checkout/build-overlay-checkout');
            return;
          }

          // Check if Initialize function exists
          if (typeof window.Paddle?.Initialize === 'function') {
            // According to latest Paddle.js docs: https://developer.paddle.com/paddlejs/include-paddlejs
            // Paddle.Initialize() should ONLY take { token: 'your_client_side_token' }
            // The environment is set separately using Paddle.Environment.set()
            
            // Debug: Log raw values before processing (ONLY in development, NEVER log full tokens)
            if (isDevelopment) {
              console.log('🔍 Debug - Raw values (development only):');
              console.log('  - clientToken (raw):', clientToken ? `"${clientToken.substring(0, 12)}..." (length: ${clientToken.length})` : 'EMPTY');
              console.log('  - vendorId (raw):', vendorId ? `"${vendorId.substring(0, 8)}..." (length: ${vendorId.length})` : 'EMPTY');
              console.log('  - trimmedToken:', trimmedToken ? `"${trimmedToken.substring(0, 12)}..." (length: ${trimmedToken.length})` : 'EMPTY');
              console.log('  - trimmedVendorId:', trimmedVendorId ? `"${trimmedVendorId.substring(0, 8)}..." (length: ${trimmedVendorId.length})` : 'EMPTY');
            }
            
            // Build initialization config - ONLY token, no environment parameter
            // Reference: https://developer.paddle.com/paddlejs/include-paddlejs
            const initConfig: {
              token?: string;
            } = {};
            
            let authMethod: 'client-side token' | 'vendor ID (unsupported)' = 'client-side token';
            
            // Validate token format
            if (trimmedToken) {
              // Check if it's actually an API key (starts with 'apikey_')
              if (trimmedToken.startsWith('apikey_')) {
                console.error('❌ ERROR: You are using a Paddle API key instead of a client-side token!');
                console.error('   API keys (starting with "apikey_") are for SERVER-SIDE use only.');
                console.error('   You need a CLIENT-SIDE TOKEN (starts with "test_" or "live_") for Paddle.js');
                console.error('');
                console.error('   To fix this:');
                console.error('   1. Go to: Paddle Dashboard > Developer Tools > Authentication > Client-side tokens');
                console.error('   2. Create a new client-side token (or use an existing one)');
                console.error('   3. Update your .env.local:');
                console.error('      NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=test_xxxxxxxxxxxxx  (for sandbox)');
                console.error('   4. Remove NEXT_PUBLIC_PADDLE_VENDOR_ID from your .env.local');
                console.error('   5. Restart your Next.js dev server');
                console.error('');
                console.error('   See: https://developer.paddle.com/paddlejs/client-side-tokens');
                return;
              }
              
              // Check if it's a valid client-side token format
              if (!trimmedToken.startsWith('test_') && !trimmedToken.startsWith('live_')) {
                console.warn('⚠️ WARNING: Client token does not start with "test_" or "live_"');
                console.warn('   Valid client-side tokens should start with:');
                console.warn('   - "test_" for sandbox environment');
                console.warn('   - "live_" for production environment');
                console.warn('   Your token starts with:', trimmedToken.substring(0, 5));
              }
              
              // REQUIRED: Use client-side token
              // According to latest docs, only token is supported in Initialize()
              // Reference: https://developer.paddle.com/paddlejs/include-paddlejs
              initConfig.token = trimmedToken;
              authMethod = 'client-side token';
              if (isDevelopment) {
                console.log(`🚀 Initializing Paddle.js with client-side token:`);
                console.log(`   - Token: ${trimmedToken.substring(0, 12)}... (${trimmedToken.length} chars)`);
                console.log(`   - Token starts with: ${trimmedToken.substring(0, 5)} (should be 'test_' for sandbox or 'live_' for production)`);
              }
            } else if (trimmedVendorId) {
              // Check if vendor ID is actually an API key
              if (trimmedVendorId.startsWith('apikey_')) {
                console.error('❌ ERROR: NEXT_PUBLIC_PADDLE_VENDOR_ID contains an API key!');
                console.error('   API keys (starting with "apikey_") are for SERVER-SIDE use only.');
                console.error('   Vendor ID is also no longer supported in Paddle.js.');
                console.error('');
                console.error('   To fix this:');
                console.error('   1. Remove NEXT_PUBLIC_PADDLE_VENDOR_ID from your .env.local');
                console.error('   2. Set NEXT_PUBLIC_PADDLE_CLIENT_TOKEN with a client-side token');
                console.error('   3. Get your client-side token from: Paddle Dashboard > Developer Tools > Authentication > Client-side tokens');
                console.error('   4. Restart your Next.js dev server');
                console.error('');
                console.error('   See: https://developer.paddle.com/paddlejs/client-side-tokens');
                return;
              }
              
              // Vendor ID is no longer supported in the latest Paddle.js
              // According to docs, only client-side tokens are supported
              console.error('❌ Vendor ID is no longer supported in Paddle.js');
              console.error('   Please use NEXT_PUBLIC_PADDLE_CLIENT_TOKEN instead');
              console.error('   Get your client-side token from: Paddle Dashboard > Developer Tools > Authentication > Client-side tokens');
              console.error('   See: https://developer.paddle.com/paddlejs/client-side-tokens');
              return;
            } else {
              // This should not happen due to validation above, but log it anyway
              console.error('❌ CRITICAL: Token is empty after trimming!');
              console.error('   This means NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not set correctly.');
              console.error('   Please check your .env.local file and ensure NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is set.');
              return;
            }
            
            // Validate that we have a token
            if (!initConfig.token) {
              console.error('❌ CRITICAL: initConfig has no token!');
              console.error('   initConfig:', initConfig);
              return;
            }
            
            // Initialize Paddle.js with ONLY the token
            // Reference: https://developer.paddle.com/paddlejs/include-paddlejs
            if (isDevelopment) {
              console.log('📞 Calling Paddle.Initialize() with config:', {
                hasToken: !!initConfig.token,
                tokenPreview: initConfig.token ? `${initConfig.token.substring(0, 12)}...` : undefined,
                tokenLength: initConfig.token?.length
              });
            }
            
            // Set up eventCallback to handle checkout events
            // This allows us to mark transactions as billed when ready to lock quantity
            // Reference: https://developer.paddle.com/build/checkout/pass-update-checkout-items
            const initConfigWithCallback: any = {
              ...initConfig,
              // Global event callback for Paddle initialization
              // Official Paddle method: Mark transaction as billed when checkout loads to lock quantity
              // Reference: https://developer.paddle.com/build/checkout/pass-update-checkout-items
              // Note: eventCallback with accept: false does NOT prevent quantity changes - it only monitors events
              // The proper way is to mark the transaction as billed when checkout becomes ready
              eventCallback: async (eventData: any) => {
                const eventName = eventData?.name || eventData?.event || (typeof eventData === 'string' ? eventData : null);
                
                // Log important events for debugging (ONLY in development)
                if (isDevelopment && eventName && (eventName.includes('checkout') || eventName.includes('transaction'))) {
                  console.log('[Paddle Global Event]', eventName, eventData);
                }
                
                // Official Paddle method: Mark transaction as billed immediately when checkout loads
                // Reference: https://developer.paddle.com/build/checkout/pass-update-checkout-items
                // We mark it immediately (even if still draft) to prevent race condition where user
                // changes quantity before transaction becomes ready. Backend will poll until ready.
                if (eventName === 'checkout.loaded') {
                  const transactionId = eventData?.data?.transaction_id;
                  
                  if (transactionId) {
                    if (isDevelopment) {
                      console.log('[Paddle] Checkout loaded - immediately marking transaction as billed to lock quantity:', transactionId);
                    }
                    
                    // Mark transaction as billed via API IMMEDIATELY
                    // This prevents race condition where user changes quantity before transaction becomes ready
                    // Backend will poll until transaction is ready, then mark it as billed
                    try {
                      const { markTransactionBilled } = await import('@/lib/api/payments');
                      
                      // Call immediately - backend will handle polling until ready
                      markTransactionBilled(transactionId)
                        .then((result) => {
                          if (isDevelopment) {
                            console.log('[Paddle] ✅ Transaction marked as billed - quantity is now locked', result);
                          }
                        })
                        .catch((error: any) => {
                          // Backend will retry if transaction not ready yet
                          const errorMessage = error?.data?.detail || error?.message || '';
                          if (isDevelopment) {
                            if (errorMessage.includes('ready status') || errorMessage.includes('draft')) {
                              console.log('[Paddle] Transaction not ready yet, backend will poll until ready...');
                            } else {
                              console.warn('[Paddle] ⚠️ Could not mark transaction as billed:', error);
                            }
                          }
                        });
                    } catch (error) {
                      if (isDevelopment) {
                        console.warn('[Paddle] ⚠️ Failed to import markTransactionBilled:', error);
                      }
                    }
                  }
                }
              },
            };
            
            window.Paddle.Initialize(initConfigWithCallback);
            
            // Set environment separately AFTER initialization
            // Reference: https://developer.paddle.com/paddlejs/overview
            // The environment should be set using Paddle.Environment.set() as a separate call
            if (window.Paddle?.Environment && typeof window.Paddle.Environment.set === 'function') {
              if (isDevelopment) {
                console.log(`🌍 Setting Paddle environment to: ${environment}`);
              }
              window.Paddle.Environment.set(environment);
            } else if (isDevelopment) {
              console.warn('⚠️ Paddle.Environment.set is not available - environment may be auto-detected from token');
            }
            
            // Note: You may see a report-only CSP warning about 'frame-ancestors http://localhost'
            // This is expected in development and comes from Paddle's server, not our CSP.
            // It's just a warning and doesn't block functionality.
          } else {
            console.error('❌ Paddle.Initialize is not a function');
          }
          
          // Wait a bit more for Checkout to be available
          setTimeout(() => {
            if (typeof window !== 'undefined' && window.Paddle?.Checkout) {
              setPaddleInitialized(true);
              if (isDevelopment) {
                console.log(`✅ Paddle.js initialized in ${environment} environment using client-side token`);
              }
            } else {
              if (isDevelopment) {
                console.warn('Paddle.js loaded but Checkout is not yet available');
              }
              // Try to set initialized anyway - it might become available later
              setPaddleInitialized(true);
            }
          }, 100);
        } catch (error) {
          console.error('Failed to initialize Paddle.js:', error);
        }
      }, 100);

      return () => clearTimeout(initTimer);
    }
  }, [isMounted, paddleLoaded, clientToken, environment, paddleInitialized]);

  // Don't render Script during SSR - only on client
  if (!isMounted) {
    return <>{children}</>;
  }

  // Don't load Paddle.js if explicitly disabled or client token is not set
  // According to latest docs, only client-side tokens are supported
  if (!paddleEnabled) {
    if (isDevelopment) {
      console.warn('⚠️ Paddle.js not loaded: NEXT_PUBLIC_PADDLE_ENABLED=false');
    }
    return <>{children}</>;
  }
  
  if (!clientToken) {
    if (isDevelopment) {
      console.warn('⚠️ Paddle.js not loaded: NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not set');
    }
    return <>{children}</>;
  }

  return (
    <>
      {/* Load Paddle.js script */}
      {/* Only render Script after component is mounted (client-side only) */}
      {/* Note: No data attributes needed - initialization happens via Paddle.Initialize() */}
      {isMounted && (
        <Script
          src="https://cdn.paddle.com/paddle/v2/paddle.js"
          strategy="afterInteractive"
          onLoad={() => {
            setPaddleLoaded(true);
            if (isDevelopment) {
              console.log('✅ Paddle.js script loaded');
            }
          }}
          onError={(e) => {
            console.error('Failed to load Paddle.js script:', e);
          }}
        />
      )}
      {children}
    </>
  );
}

/**
 * Hook to access Paddle.js functionality
 * 
 * NOTE: This hook should only be used in client components ('use client')
 */
export function usePaddle() {
  // Check if Paddle is fully loaded and Checkout is available
  // Always return false during SSR
  const isReady = typeof window !== 'undefined' && 
                  window?.Paddle && 
                  window.Paddle?.Checkout && 
                  typeof window.Paddle.Checkout.open === 'function';

  const openCheckout = (options: {
    transactionId?: string;
    items?: Array<{
      priceId: string;
      quantity: number;
    }>;
    customer?: {
      id?: string;
      email?: string;
    };
    customData?: Record<string, any>;
    settings?: {
      displayMode?: 'overlay' | 'inline';
      theme?: 'light' | 'dark';
      locale?: string;
      successUrl?: string;
      allowLogout?: boolean;
    };
    eventCallback?: (event: any) => any;
  }) => {
    if (typeof window === 'undefined') {
      throw new Error('Paddle.js can only be used in the browser');
    }

    if (!window.Paddle) {
      throw new Error('Paddle.js is not loaded. Please wait for it to load.');
    }

    if (!window.Paddle.Checkout) {
      throw new Error('Paddle.js Checkout is not available. Please wait for initialization to complete.');
    }

    if (typeof window.Paddle.Checkout.open !== 'function') {
      throw new Error('Paddle.js Checkout.open is not a function. Paddle.js may not be fully initialized.');
    }

    try {
      window.Paddle.Checkout.open(options);
    } catch (error) {
      console.error('Error opening Paddle checkout:', error);
      throw new Error(`Failed to open Paddle checkout: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const closeCheckout = () => {
    if (isReady && window.Paddle && window.Paddle.Checkout && typeof window.Paddle.Checkout.close === 'function') {
      try {
        window.Paddle.Checkout.close();
      } catch (error) {
        console.error('Error closing Paddle checkout:', error);
      }
    }
  };

  return {
    isReady,
    openCheckout,
    closeCheckout,
    paddle: typeof window !== 'undefined' ? window.Paddle : undefined,
  };
}

