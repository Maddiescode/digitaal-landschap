import { FrameworkProvider } from './context/FrameworkContext';
import { Header } from './components/Header';
import { SegmentScale } from './components/SegmentScale';
import { SideDrawer } from './components/SideDrawer';
import { CompareMode } from './components/CompareMode';
import { EcosystemOverview } from './components/EcosystemOverview';
import { useFramework } from './context/FrameworkContext';

function AppContent() {
  const { state } = useFramework();

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <SegmentScale />
        {state.compareMode && <CompareMode />}
        {state.showEcosystem && <EcosystemOverview />}
      </main>
      {state.selectedSegmentId && !state.compareMode && <SideDrawer />}
    </div>
  );
}

function App() {
  return (
    <FrameworkProvider>
      <AppContent />
    </FrameworkProvider>
  );
}

export default App;
