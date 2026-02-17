import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { routes } from './routes';
import FloatingChat from './components/FloatingChat';
import { Toaster } from 'react-hot-toast';

function App() {
  console.log('[JalSanchaee] App component rendering...');

  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        {routes.map((route) => {
          console.log(`[JalSanchaee] Configuring Route: ${route.path}`);
          return <Route key={route.path} path={route.path} element={route.element} />;
        })}
      </Routes>
      <FloatingChat />
    </AuthProvider>
  );
}

export default App;
