import { HeroOrbit } from "./components/HeroOrbit";
import { Timeline } from "./components/Timeline";
import { WaterBackground } from "./components/WaterBackground";

export function App() {
  return (
    <div className="relative min-h-[100dvh] text-ink">
      <WaterBackground />
      <HeroOrbit />
      <Timeline />
    </div>
  );
}
