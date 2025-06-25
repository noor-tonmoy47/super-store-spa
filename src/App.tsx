// src/App.tsx
import React, { useState, useEffect, useRef, type JSX } from 'react'; // Import useRef
import Keycloak from 'keycloak-js';
import keycloak from './Setup/keycloak';
import { ProductManagement } from './components/Product/ProductManagement';
import { UserManagement } from './components/User/UserManagement';
import { Package, Users, LogOut } from 'lucide-react';

interface CustomKeycloakTokenParsed extends Keycloak.KeycloakTokenParsed {
  preferred_username?: string;
  email?: string;
  sub?: string;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'products' | 'users'>('products');

  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [keycloakInstance, setKeycloakInstance] = useState<Keycloak.KeycloakInstance | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Use a ref to track if Keycloak has been initialized
  const isKeycloakInitialized = useRef(false);

  useEffect(() => {
    // Only initialize Keycloak once
    if (isKeycloakInitialized.current) {
      return; // Keycloak has already been initialized, prevent re-initialization
    }

    isKeycloakInitialized.current = true; // Mark as initialized

    console.log('Attempting to initialize Keycloak...'); // Debugging log

    keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
    })
    .then((isAuthenticated: boolean) => {
      console.log('Keycloak init successful. Authenticated:', isAuthenticated); // Debugging log
      setAuthenticated(isAuthenticated);
      setKeycloakInstance(keycloak);
      setLoading(false);

      if (isAuthenticated && keycloak.tokenParsed) {
        const parsedToken = keycloak.tokenParsed as CustomKeycloakTokenParsed;
        console.log('User is authenticated:', parsedToken);
        console.log('Access Token:', keycloak.token);
        console.log('ID Token:', keycloak.idToken);
      }
    })
    .catch((error: any) => {
      console.error('Keycloak Init Error:', error);
      setLoading(false);
    });

    // Add Keycloak event listeners for better debugging
    keycloak.onReady = () => {
      console.log('Keycloak is ready.');
    };
    keycloak.onAuthSuccess = () => {
      console.log('Keycloak: Authentication successful!');
    };
    keycloak.onAuthError = (error) => {
      console.error('Keycloak: Authentication error!', error);
    };
    keycloak.onAuthRefreshSuccess = () => {
      console.log('Keycloak: Token successfully refreshed!');
    };
    keycloak.onAuthRefreshError = () => {
      console.error('Keycloak: Failed to refresh token. User might need to re-login.');
      // Optional: Force logout if silent refresh fails consistently
      // keycloak.logout();
    };
    keycloak.onAuthLogout = () => {
      console.log('Keycloak: User logged out.');
      setAuthenticated(false);
      setKeycloakInstance(null);
    };
    keycloak.onTokenExpired = () => {
      console.log('Keycloak: Token expired, attempting to refresh...');
      // The updateToken(30) call in the button handler already handles refresh,
      // but this listener indicates when a refresh is needed.
    };

    // Cleanup function to remove event listeners on component unmount
    return () => {
      // In Strict Mode, cleanup runs *before* the second render, then the effect runs again.
      // We only want to cleanup if the component is truly unmounting, but since we're using
      // a ref to prevent re-init, these listeners might not need aggressive cleanup in this context
      // if 'keycloak' instance persists across component lifecycles.
      // However, for completeness, it's good practice to cleanup if keycloak instance was local to useEffect.
      // Since `keycloak` is imported (a singleton), clearing listeners might affect other parts if used.
      // For this specific error, the `isKeycloakInitialized` ref is the primary fix.
    };

  }, []); // Empty dependency array ensures this runs only once on component mount for initialization

  const login = (): void => {
    keycloak.login();
  };

  const logout = (): void => {
    keycloak.logout();
  };

  const renderPage = (): JSX.Element => {
    switch (currentPage) {
      case 'products':
        return <ProductManagement />;
      case 'users':
        return <UserManagement />;
      default:
        return <ProductManagement />;
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-card">
          <p className="loading-text">Loading Keycloak...</p>
        </div>
      </div>
    );
  }

  if (!authenticated || !keycloakInstance) {
    return (
      <div className="app-container">
        <div className="login-card">
          <h1 className="login-title">SuperStore Admin</h1>
          <p className="login-message">You need to log in to access the admin panel.</p>
          <button
            onClick={login}
            className="login-button"
          >
            Login with Keycloak
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-main-container">
    
      <header className="app-header">
        <h1 className="header-title">SuperStore Admin</h1>
        <nav className="nav-buttons">
          <button
            onClick={() => setCurrentPage('products')}
            className={`nav-button products ${currentPage === 'products' ? 'active' : ''}`}
          >
            <Package size={20} /> Products
          </button>
          <button
            onClick={() => setCurrentPage('users')}
            className={`nav-button users ${currentPage === 'users' ? 'active' : ''}`}
          >
            <Users size={20} /> Users
          </button>
          {/* Logout button for authenticated users */}
          <button
            onClick={logout}
            className="nav-button logout"
          >
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </header>

      <main className="app-main-content">
        {/* Display welcome message and token info only if authenticated */}
        <div className="user-info-card">
          <p className="user-info-welcome">
            Welcome, <strong>{(keycloakInstance.tokenParsed as CustomKeycloakTokenParsed)?.preferred_username || 'User'}</strong>!
          </p>
          <p className="user-info-details">
            User ID: <span>{(keycloakInstance.tokenParsed as CustomKeycloakTokenParsed)?.sub}</span> |
            Email: <span>{(keycloakInstance.tokenParsed as CustomKeycloakTokenParsed)?.email}</span>
          </p>
          {/* Example of getting and using access token */}
          <button
            onClick={() => {
              keycloakInstance.updateToken(30)
                .then((refreshed: boolean) => {
                  if (refreshed) {
                    console.log('Token was successfully refreshed');
                  } else {
                    console.log('Token is still valid');
                  }
                  console.log('Current Access Token:', keycloakInstance.token);
                  // Now you can use `keycloakInstance.token` to make authenticated calls
                  // to your protected backend APIs.
                  // Example:
                  // fetch('your-protected-api-endpoint', {
                  //   headers: {
                  //     Authorization: `Bearer ${keycloakInstance.token}`
                  //   }
                  // })
                  // .then(res => res.json())
                  // .then(data => console.log('Protected API Response:', data))
                  // .catch(apiError => console.error('Error calling protected API:', apiError));
                })
                .catch((error: any) => {
                  console.error('Failed to refresh token:', error);
                  // Handle token refresh failure (e.g., redirect to login)
                });
            }}
            className="refresh-token-button"
          >
            Refresh Token & Log (Example)
          </button>
        </div>
        {renderPage()}
      </main>
    </div>
  );
};

export default App;