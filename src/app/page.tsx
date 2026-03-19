import LiveMap from "@/components/radar/LiveMap";
import FleetFeed from "@/components/radar/FleetFeed";

export default function Home() {
  return (
    <div className="flex h-full w-full bg-slate-100 border-t border-slate-200 shadow-inner">
      <div className="flex-1 h-full shadow-md z-10 bg-white">
        <LiveMap />
      </div>
      <div className="h-full z-20 shadow-[-4px_0_15px_rgba(0,0,0,0.05)] bg-white border-l border-slate-200">
        <FleetFeed />
      </div>
    </div>
  );
}
