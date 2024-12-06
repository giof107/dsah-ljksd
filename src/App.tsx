import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Containers from './pages/Containers';
import Databases from './pages/Databases';
import { AuthProvider } from './context/AuthContext';
import Traefik from "./pages/Traefik.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                <div className="container mx-auto px-6 py-8">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/containers" element={<Containers />} />
                    <Route path="/databases" element={<Databases />} />
                    <Route path="/traefik" element={<Traefik />} />
                  </Routes>
                </div>
              </main>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;