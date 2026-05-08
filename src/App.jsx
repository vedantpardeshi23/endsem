import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import ISSTracker from './pages/ISSTracker';
import NewsDashboard from './pages/NewsDashboard';
import Analytics from './pages/Analytics';

// Providers
import { ThemeProvider } from './context/ThemeContext';
import { ISSProvider } from './context/ISSContext';
import { NewsProvider } from './context/NewsContext';
import { ChatProvider } from './context/ChatContext';

function App() {
  return (
    <ThemeProvider>
      <ISSProvider>
        <NewsProvider>
          <ChatProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<RootLayout />}>
                  <Route index element={<ISSTracker />} />
                  <Route path="news" element={<NewsDashboard />} />
                  <Route path="analytics" element={<Analytics />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ChatProvider>
        </NewsProvider>
      </ISSProvider>
    </ThemeProvider>
  );
}

export default App;
