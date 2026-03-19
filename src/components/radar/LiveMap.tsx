"use client";

import { useFleetStore } from "@/store/useFleetStore";
import { useEffect, useState, useMemo } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import 'maplibre-gl/dist/maplibre-gl.css';
import { CarFront, AlertOctagon } from "lucide-react";

// Use a free CartoDB Positron map style for a light ATC look
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

export default function LiveMap() {
  const { vehicles, startSimulation } = useFleetStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    startSimulation(); // Start the WebSocket mock feed
  }, [startSimulation]);

  const centerLat = useMemo(() => vehicles.reduce((sum, v) => sum + v.location.lat, 0) / vehicles.length, [vehicles]);
  const centerLng = useMemo(() => vehicles.reduce((sum, v) => sum + v.location.lng, 0) / vehicles.length, [vehicles]);

  if (!mounted) return <div className="h-full w-full bg-slate-100 animate-pulse" />;

  return (
    <div className="h-full w-full relative">
      <Map
        initialViewState={{
          longitude: centerLng,
          latitude: centerLat,
          zoom: 12
        }}
        mapStyle={MAP_STYLE}
      >
        <NavigationControl position="top-left" />
        
        {vehicles.filter(v => v.status !== 'offline').map((v) => {
           const hasAlert = v.alertFlag !== 'none';
           return (
             <Marker
                key={v.id}
                longitude={v.location.lng}
                latitude={v.location.lat}
                anchor="center"
             >
               {/* 
                  Using inline styles for transform interpolation makes the movement much smoother.
               */}
               <div style={{ transition: 'transform 2s linear' }} className={`relative ${hasAlert ? 'z-50' : 'z-10'}`}>
                 <div className={`relative flex items-center justify-center w-8 h-8 rounded-full shadow-md border-2 ${hasAlert ? 'bg-red-500 border-white animate-pulse' : 'bg-blue-600 border-white'} transition-colors duration-500`}>
                   {hasAlert ? <AlertOctagon size={16} className="text-white" /> : <CarFront size={16} className="text-white" />}
                   
                   {!hasAlert && v.status !== 'stopped' && (
                     <span className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-50 animate-ping" style={{ animationDuration: '3s' }}></span>
                   )}
                 </div>
                 
                 <div className="absolute top-9 left-1/2 -translate-x-1/2 bg-white text-slate-700 text-[10px] px-2 py-0.5 rounded border border-slate-200 shadow-sm whitespace-nowrap font-sans font-bold flex flex-col items-center">
                   <span>{v.driverName}</span>
                 </div>
               </div>
             </Marker>
           );
        })}
      </Map>
    </div>
  );
}
