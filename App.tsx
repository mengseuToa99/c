import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from './components/Loader';
import { Experience } from './components/Experience';
import { UI } from './components/UI';
import { useStore } from './store';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Basic Error Boundary
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ThreeJS Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white p-4 text-center">
          <div>
            <h2 className="text-xl mb-2">Something went wrong with the graphics engine.</h2>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 rounded">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  const setPhase = useStore((state) => state.setPhase);
  const [ready, setReady] = useState(false);

  const handleLoaded = () => {
    setReady(true);
    setPhase('OFFERING');
  };

  return (
    <div className="w-full h-full relative bg-[#050510]">
      <Loader onFinished={handleLoaded} />
      
      <ErrorBoundary>
        <Canvas
          shadows
          dpr={[1, 2]} // Optimize pixel ratio for performance
          gl={{ 
            antialias: false, // Postprocessing handles AA or bloom makes it less critical
            powerPreference: "high-performance",
            alpha: false
          }}
          camera={{ position: [0, 0, 8], fov: 45 }}
          className="touch-none" // Disable touch actions on canvas for custom controls
        >
            <color attach="background" args={['#050510']} />
            <Experience />
        </Canvas>
      </ErrorBoundary>

      {ready && <UI />}
    </div>
  );
};

export default App;