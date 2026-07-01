import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { RateData, TaskData } from "@/Types/types";
import VerifyWasteModal from "./WasteVerificationModal";
import { updateTaskStatus } from "../../api/auth";
 
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;
 
type LatLng = [number, number];
 
function MapSizeObserver() {
  const map = useMap();
  useEffect(() => {
    const obs = new ResizeObserver(() => map.invalidateSize());
    obs.observe(map.getContainer());
    return () => obs.disconnect();
  }, [map]);
  return null;
}
 
function MapInvalidator({ onReady }: { onReady?: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => { if (onReady) onReady(map); }, [map, onReady]);
  return null;
}
 
const WorkerMapView = forwardRef(
  ({ task, rates, onClose }: { task: TaskData; rates: RateData[]; onClose: () => void }, ref) => {
    const [current,   setCurrent]   = useState<LatLng | null>(null);
    const [pickup]                  = useState<LatLng>([task.latitude, task.longitude]);
    const [route,     setRoute]     = useState<LatLng[] | null>(null);
    const [distance,  setDistance]  = useState<number | null>(null);
    const [atPickup,  setAtPickup]  = useState(false);
    const [wasteModal,setWasteModal]= useState(false);
    const [collecting,setCollecting]= useState(false);
    const mapRef = useRef<L.Map | null>(null);
 
    useImperativeHandle(ref, () => ({
      invalidateSize: () => mapRef.current?.invalidateSize(),
    }));

    console.log(task);
 
    useEffect(() => {
      const id = navigator.geolocation.watchPosition(
        (pos) => setCurrent([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.error("Geo error:", err),
        { enableHighAccuracy: true },
      );
      return () => navigator.geolocation.clearWatch(id);
    }, []);
 
    const fetchRoute = async (from: LatLng, to: LatLng): Promise<LatLng[]> => {
      const res  = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`,
      );
      const data = await res.json();
      if (!data.routes?.length) return [];
      return data.routes[0].geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng] as LatLng,
      );
    };
 
    useEffect(() => {
      if (current && pickup) {
        fetchRoute(current, pickup).then(setRoute);
        const d = L.latLng(current).distanceTo(L.latLng(pickup));
        setDistance(Math.round(d));
        setAtPickup(d < 50);
      }
    }, [current, pickup]);
 
    const handleCollect = async () => {
      setCollecting(true);
      try {
        await updateTaskStatus(Number(task.requestId), "COLLECTED");
        setWasteModal(true);
      } catch (e) {
        console.error(e);
      } finally {
        setCollecting(false);
      }
    };
 
    const handleModalClose = () => { onClose(); setWasteModal(false); };
 
    if (!current) {
      return (
        <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, background: "#f7f9f8" }}>
          <div style={{ position: "relative", width: 52, height: 52 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "4px solid #d1fae5" }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "4px solid transparent", borderTopColor: "#10b981", animation: "spin 0.9s linear infinite" }} />
          </div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: "#6a8174", textTransform: "uppercase" }}>
            Acquiring Location…
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      );
    }
 
    const distKm = distance != null ? (distance / 1000).toFixed(2) : "—";
 
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
          .wmv-root { font-family: 'DM Sans', sans-serif; }
          .wmv-mono  { font-family: 'JetBrains Mono', monospace; }
 
          .wmv-card {
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08);
            overflow: hidden;
          }
          .wmv-card-header {
            padding: 14px 18px;
            background: #0f1e18;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
          }
          .wmv-card-body { padding: 16px 18px; display: flex; flex-direction: column; gap: 12px; }
 
          .wmv-stat {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
          }
          .wmv-stat-val {
            font-family: 'JetBrains Mono', monospace;
            font-size: 18px;
            font-weight: 700;
            color: #fff;
            line-height: 1;
          }
          .wmv-stat-label {
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #a7f3d0;
          }
          .wmv-divider { width: 1px; height: 34px; background: rgba(255,255,255,0.12); }
 
          .wmv-row {
            display: flex;
            align-items: flex-start;
            gap: 10px;
          }
          .wmv-icon-box {
            width: 34px; height: 34px;
            border-radius: 8px;
            flex-shrink: 0;
            display: flex; align-items: center; justify-content: center;
          }
 
          .wmv-note-box {
            background: #fffbeb;
            border-left: 3px solid #f59e0b;
            border-radius: 0 8px 8px 0;
            padding: 10px 12px;
            font-size: 12px;
            color: #92400e;
            line-height: 1.5;
          }
 
          .wmv-collect-btn {
            width: 100%;
            height: 52px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: #fff;
            font-family: 'DM Sans', sans-serif;
            font-weight: 700;
            font-size: 14px;
            letter-spacing: 0.03em;
            border: none;
            border-radius: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.15s ease;
            box-shadow: 0 4px 16px rgba(16,185,129,0.35);
          }
          .wmv-collect-btn:hover:not(:disabled) {
            box-shadow: 0 6px 20px rgba(16,185,129,0.5);
            transform: translateY(-1px);
          }
          .wmv-collect-btn:disabled {
            opacity: 0.7; cursor: not-allowed;
          }
 
          .wmv-hint {
            font-size: 11px;
            color: #9ab0a6;
            text-align: center;
            line-height: 1.5;
          }
 
          .wmv-proximity-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            background: #ecfdf5;
            color: #059669;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            padding: 3px 10px;
            border-radius: 99px;
            border: 1px solid #a7f3d0;
          }
          .wmv-live-dot {
            width: 7px; height: 7px;
            border-radius: 50%;
            background: #10b981;
            animation: wmv-pulse 1.4s ease-in-out infinite;
          }
          @keyframes wmv-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50%       { opacity: 0.5; transform: scale(1.4); }
          }
        `}</style>
 
  \
        <MapContainer
          center={current}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          dragging
          touchZoom
          scrollWheelZoom
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <Marker position={current}>
            <Popup><strong>Your Location</strong></Popup>
          </Marker>
          <Marker position={pickup}>
            <Popup><strong>{task.address}</strong></Popup>
          </Marker>
          {route && route.length > 0 && (
            <Polyline
              positions={route}
              pathOptions={{ color: "#10b981", weight: 4, opacity: 0.85, dashArray: undefined }}
            />
          )}
          <MapInvalidator onReady={(m) => (mapRef.current = m)} />
          <MapSizeObserver />
        </MapContainer>
 
        <div
          className="wmv-root"
          style={{
            position: "absolute",
            bottom: 20,
            left: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <div className="wmv-card">
            <div className="wmv-card-header">
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a7f3d0" }}>
                  Active Task
                </p>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, fontWeight: 700, color: "#fff" }}>
                  #{task.requestId}
                </p>
              </div>
 
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginLeft: "auto" }}>
                <div className="wmv-stat">
                  <span className="wmv-stat-val">{distKm}</span>
                  <span className="wmv-stat-label">km away</span>
                </div>
                <div className="wmv-divider" />
                <div className="wmv-stat">
                  <span className="wmv-stat-val">{task.estimatedWeight}kg</span>
                  <span className="wmv-stat-label">estimated</span>
                </div>
                <div className="wmv-divider" />
                <div className="wmv-stat">
                  <span className="wmv-stat-val" style={{ fontSize: 13 }}>{task.wasteType}</span>
                  <span className="wmv-stat-label">type</span>
                </div>
              </div>
            </div>
 

            <div className="wmv-card-body">

              <div className="wmv-row">
                <div className="wmv-icon-box" style={{ background: "#ecfdf5" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#10b981" }}>location_on</span>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#0f1e18" }}>{task.address}</p>
                  <p style={{ fontSize: 11, color: "#6a8174", marginTop: 2 }}>{task.route?.name}</p>
                </div>
              </div>
 
              <div className="wmv-note-box">
                <span style={{ fontWeight: 700 }}>Note: </span>{task.notes}
              </div>
 
              {atPickup ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="wmv-proximity-badge">
                      <span className="wmv-live-dot" />
                      At pickup location
                    </span>
                  </div>
                  <button
                    className="wmv-collect-btn"
                    onClick={handleCollect}
                    disabled={collecting}
                  >
                    {collecting ? (
                      <>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", animation: "spin 0.8s linear infinite" }} />
                        Processing…
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>check_circle</span>
                        I've Collected the Waste
                      </>
                    )}
                  </button>
                  <p className="wmv-hint">
                    This will open the verification form to confirm weight & condition.
                  </p>
                </div>
              ) : (
                <p className="wmv-hint">
                  Follow the green route. The collection button will appear when you're within 50m of the pickup.
                </p>
              )}
            </div>
          </div>
        </div>
 
        {wasteModal && (
          <VerifyWasteModal
            isOpen
            onClose={handleModalClose}
            task={task}
            rates={rates}
          />
        )}
 
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </>
    );
  },
);
 
export default WorkerMapView;
