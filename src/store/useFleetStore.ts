import { create } from 'zustand';

export interface Vehicle {
  id: string;
  driverName: string;
  speedKmh: number;
  location: { lat: number; lng: number };
  smoothRideScore: number;
  status: "online" | "offline" | "stopped";
  alertFlag: "none" | "Speeding" | "Harsh Braking";
  alertTimeoutId?: NodeJS.Timeout | null;
}

interface FleetStore {
  vehicles: Vehicle[];
  simulationActive: boolean;
  setVehicles: (vehicles: Vehicle[]) => void;
  updateVehicle: (id: string, data: Partial<Vehicle>) => void;
  startSimulation: () => void;
  stopSimulation: () => void;
}

const INDIAN_NAMES = [
  "Ravi Kumar", "Sunita Sharma", "Amit Patel", "Priya Singh", "Rajesh Gupta",
  "Anita Verma", "Suresh Rao", "Meena Reddy", "Ramesh Iyer", "Kavita Desai",
  "Mahesh Joshi", "Neha Jain", "Dinesh Saxena", "Pooja Agarwal", "Sunil Das",
  "Anjali Rathi", "Anil Tiwari", "Ritu Chawla", "Prakash Menon", "Nidhi Nambiar",
  "Vinod Khanna", "Rakesh Pande", "Deepak Pillai", "Sneha Nair", "Sanjay Dubey",
  "Ananya Chatterjee", "Kiran Kumar", "Manju Nath", "Vikas Bansal", "Sandeep Yadav"
];

const generateInitialFleet = (count: number): Vehicle[] => {
  return Array.from({ length: count }).map((_, i) => {
    const id = `TRVX-${String(i + 1).padStart(3, '0')}`;
    const driverName = INDIAN_NAMES[i % INDIAN_NAMES.length];
    const isStopped = Math.random() > 0.8;
    return {
      id,
      driverName,
      speedKmh: isStopped ? 0 : Math.floor(Math.random() * 110),
      location: { 
        // Bilaspur, Chhattisgarh offset distribution
        lat: 22.0797 + (Math.random() * 0.1 - 0.05), 
        lng: 82.1409 + (Math.random() * 0.1 - 0.05) 
      },
      smoothRideScore: Math.floor(Math.random() * 40) + 60, // 60-100
      status: isStopped ? "stopped" : "online",
      alertFlag: "none"
    };
  });
};

const INITIAL_VEHICLES: Vehicle[] = generateInitialFleet(30);

const fluctuate = (val: number, maxPercent: number) => {
  const change = val * (maxPercent / 100) * (Math.random() * 2 - 1);
  return val + change;
};

export const useFleetStore = create<FleetStore>((set, get) => {
  let intervalId: NodeJS.Timeout | null = null;

  return {
    vehicles: INITIAL_VEHICLES,
    simulationActive: false,
    
    setVehicles: (vehicles) => set({ vehicles }),
    
    updateVehicle: (id, data) => set((state) => ({
      vehicles: state.vehicles.map(v => v.id === id ? { ...v, ...data } : v)
    })),
    
    startSimulation: () => {
      const { simulationActive } = get();
      if (simulationActive) return;

      intervalId = setInterval(() => {
        set((state) => {
          let updatedVehicles = state.vehicles.map(v => {
            if (v.status === 'offline') return v;

            // Fluctuate metrics organically
            let newSpeed = v.status === 'stopped' ? 0 : Math.max(0, fluctuate(v.speedKmh, 5));
            let newLat = fluctuate(v.location.lat, 0.002);
            let newLng = fluctuate(v.location.lng, 0.002);
            let newScore = v.smoothRideScore;

            if (v.status !== 'stopped' && newScore < 100) {
                 newScore = Math.min(100, newScore + 0.5); // Natural slow recovery
            }

            return {
              ...v,
              location: { lat: newLat, lng: newLng },
              speedKmh: v.status === 'stopped' ? 0 : Math.round(newSpeed),
              smoothRideScore: Math.round(newScore),
              alertFlag: "none" as "none" | "Speeding" | "Harsh Braking" // Reset all
            };
          });

          // Guarantee 3 to 5 vehicles randomly have an alert flag
          const onlineVehicles = updatedVehicles.filter(v => v.status === 'online');
          if (onlineVehicles.length > 0) {
              const alertCount = Math.floor(Math.random() * 3) + 3; // 3 to 5
              // Shuffle array pseudo-randomly
              const shuffled = [...onlineVehicles].sort(() => 0.5 - Math.random());
              const selectedIds = new Set(shuffled.slice(0, alertCount).map(v => v.id));

              updatedVehicles = updatedVehicles.map(v => {
                  if (selectedIds.has(v.id)) {
                      const flagType = Math.random() > 0.5 ? "Speeding" : "Harsh Braking";
                      return {
                          ...v,
                          alertFlag: flagType,
                          smoothRideScore: Math.max(0, v.smoothRideScore - 10), // Penalty
                          speedKmh: flagType === "Harsh Braking" ? Math.max(0, v.speedKmh - 40) : v.speedKmh + 20
                      };
                  }
                  return v;
              });
          }

          return { vehicles: updatedVehicles };
        });
      }, 2000);

      set({ simulationActive: true });
    },
    
    stopSimulation: () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      set({ simulationActive: false });
    }
  };
});
