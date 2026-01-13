'use client';

import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useMemo, useState } from 'react';

// --- Components ---

// Standardized Star Ratings Colors
const getStarColor = (rating: number) => {
    if (rating >= 4.5) return { bg: '#C9A227', border: '#B8911F', text: '#FFFFFF' };
    if (rating >= 4.0) return { bg: '#1B5E3A', border: '#154830', text: '#FFFFFF' };
    if (rating >= 3.5) return { bg: '#3B82F6', border: '#2563EB', text: '#FFFFFF' };
    return { bg: '#6B7280', border: '#4B5563', text: '#FFFFFF' };
};

// Landmark Icon (Holy Sites)
const createLandmarkIcon = (name: string, type: 'kaaba' | 'mosque') => {
    return L.divIcon({
        className: 'landmark-marker',
        html: `
            <div style="
                position: relative;
                transform: translateY(-50%);
                display: flex;
                flex-direction: column;
                align-items: center;
                z-index: 1000;
                filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
            ">
                <div style="
                    background: #000000;
                    border: 3px solid #D4AF37;
                    color: #D4AF37;
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.3);
                ">
                    ${type === 'kaaba' ? '🕋' : '🕌'}
                </div>
                <div style="
                    background: #000000;
                    color: #D4AF37;
                    padding: 4px 10px;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 800;
                    margin-top: 6px;
                    font-family: 'Cairo', sans-serif;
                    border: 1px solid #D4AF37;
                    white-space: nowrap;
                ">
                    ${name}
                </div>
                <div style="
                    width: 0; height: 0; 
                    border-left: 6px solid transparent; 
                    border-right: 6px solid transparent; 
                    border-top: 6px solid #000000;
                    position: absolute;
                    bottom: 27px;
                "></div>
            </div>
        `,
        iconSize: [100, 80],
        iconAnchor: [50, 40],
    });
};

const HOLY_SITES = [
    { id: 'kaaba', name: 'الكعبة المشرفة', coords: [21.422510, 39.826168] as [number, number], type: 'kaaba' as const },
    { id: 'nabawi', name: 'المسجد النبوي', coords: [24.467210, 39.610926] as [number, number], type: 'mosque' as const },
];

// Custom Marker Icon
const createCustomIcon = (name: string, price: number, rating: number, distance: string, timeInMinutes: number | undefined, isHovered: boolean) => {
    const shortName = name.length > 15 ? name.substring(0, 13) + '...' : name;
    const colors = getStarColor(rating);
    const stars = rating >= 4.5 ? 5 : rating >= 4.0 ? 4 : rating >= 3.5 ? 3 : 2;
    const starsHtml = '★'.repeat(stars);

    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                transform: scale(${isHovered ? 1.08 : 1}) translateY(${isHovered ? '-6px' : '0'});
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                position: relative;
                z-index: ${isHovered ? 100 : 10};
                cursor: pointer;
                filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));
            ">
                <div style="
                    background: ${isHovered ? colors.bg : '#FFFFFF'};
                    color: ${isHovered ? colors.text : '#1F2937'};
                    border: 2px solid ${isHovered ? colors.border : '#E5E7EB'};
                    padding: 10px 14px;
                    border-radius: 16px;
                    font-weight: 700;
                    font-size: 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    white-space: nowrap;
                    font-family: 'Cairo', sans-serif;
                    min-width: 90px;
                    text-align: center;
                ">
                    <span style="font-size: 11px; font-weight: 700; max-width: 110px; overflow: hidden; text-overflow: ellipsis;">${shortName}</span>
                    <span style="font-size: 10px; color: ${isHovered ? '#FFD700' : '#C9A227'}; letter-spacing: 1px;">${starsHtml}</span>
                    <div style="display: flex; align-items: center; gap: 3px;">
                        <span style="font-size: 15px; font-weight: 900;">${price}</span>
                        <span style="font-size: 9px; opacity: 0.8;">ر.س</span>
                    </div>
                    ${distance ? `
                    <div style="
                        background: ${isHovered ? 'rgba(255,255,255,0.2)' : '#F3F4F6'};
                        padding: 3px 8px;
                        border-radius: 8px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 1px;
                        margin-top: 2px;
                    ">
                        <div style="display: flex; align-items: center; gap: 4px;">
                            <span style="font-size: 10px;">📍</span>
                            <span style="font-size: 10px; font-weight: 600;">${distance}</span>
                        </div>
                        ${(timeInMinutes !== undefined && timeInMinutes !== null) ? `
                        <div style="display: flex; align-items: center; gap: 4px; opacity: 0.8;">
                            <span style="font-size: 10px;">🚶</span>
                            <span style="font-size: 9px; font-weight: 600;">${timeInMinutes} دقيقة</span>
                        </div>
                        ` : ''}
                    </div>
                    ` : ''}
                </div>
                <div style="
                    position: absolute; bottom: -7px; left: 50%; transform: translateX(-50%);
                    width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent;
                    border-top: 8px solid ${isHovered ? colors.bg : '#FFFFFF'};
                "></div>
                ${isHovered ? `
                <div style="position: absolute; inset: 0; border-radius: 16px; box-shadow: 0 0 0 0 ${colors.bg}80; animation: pulse-marker 1.5s infinite; z-index: -1;"></div>
                <style>@keyframes pulse-marker { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 ${colors.bg}80; } 70% { transform: scale(1.05); box-shadow: 0 0 0 12px ${colors.bg}00; } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 ${colors.bg}00; } }</style>
                ` : ''}
            </div>
        `,
        iconSize: [140, 100],
        iconAnchor: [70, 100],
    });
};

/* 
   AutoFitBounds:
   Smartly adjusts the map view to fit all available hotels.
   Prioritizes fitting the markers over any hardcoded center.
*/
function AutoFitBounds({ hotels, activeCenter }: { hotels: Hotel[], activeCenter?: [number, number] }) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        // If specific hotel is active (hovered), fly to it
        if (activeCenter && Array.isArray(activeCenter) && activeCenter.length === 2) {
            const [lat, lng] = activeCenter;

            // Strict Validation
            const isValid =
                typeof lat === 'number' &&
                typeof lng === 'number' &&
                Number.isFinite(lat) &&
                Number.isFinite(lng) &&
                Math.abs(lat) <= 90 &&
                Math.abs(lng) <= 180;

            if (isValid) {
                try {
                    map.flyTo([lat, lng], 17, { animate: true, duration: 1.5 });
                } catch (err) {
                    console.warn("Map FlyTo Error:", err);
                }
                return;
            }
        }

        // Otherwise, fit all hotels
        if (hotels.length > 0) {
            const coords = hotels
                .map(h => h.coordinates)
                .filter(c => c && Array.isArray(c) && c.length === 2 && !isNaN(c[0]) && !isNaN(c[1]));

            if (coords.length > 0) {
                const bounds = L.latLngBounds(coords);
                map.fitBounds(bounds, {
                    padding: [50, 50],
                    maxZoom: 17,
                    animate: true
                });
            }
        }
    }, [map, hotels, activeCenter]);

    return null;
}

interface Hotel {
    id: number;
    name: string;
    location: string;
    coordinates: [number, number];
    price: number;
    rating: number;
    images: string[];
    image?: string;
    distance?: string;
    timeInMinutes?: number;
}

interface HotelMapProps {
    hotels: Hotel[];
    hoveredHotelId: number | null;
    onMarkerClick?: (id: number) => void;
    isWidget?: boolean;
}

export default function HotelMap({ hotels, hoveredHotelId, onMarkerClick, isWidget = false }: HotelMapProps) {
    const [geocodedHotels, setGeocodedHotels] = useState<Hotel[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [progress, setProgress] = useState(0);

    const activeHotel = geocodedHotels.find(h => h.id === hoveredHotelId);
    const activeCenter = activeHotel ? activeHotel.coordinates : undefined;

    const CACHE_PREFIX = 'hotel_geo_v2_';

    useEffect(() => {
        let isMounted = true;

        const processHotels = async () => {
            if (!hotels || hotels.length === 0) {
                setGeocodedHotels([]);
                return;
            }

            setIsFetching(true);
            const initialResolved: Hotel[] = [];
            const toFetch: Hotel[] = [];

            // 1. Separate hotels into "Already Geo" and "Needs Geo"
            hotels.forEach(hotel => {
                // Priority 1: Check if already has valid coordinates from DB
                if (hotel.coordinates && hotel.coordinates[0] != null && hotel.coordinates[1] != null && !isNaN(hotel.coordinates[0])) {
                    initialResolved.push({ ...hotel, coordinates: [Number(hotel.coordinates[0]), Number(hotel.coordinates[1])] });
                    return;
                }

                // Priority 2: Check Session Cache
                const cached = typeof window !== 'undefined' ? sessionStorage.getItem(CACHE_PREFIX + hotel.id) : null;
                if (cached) {
                    try {
                        const parsed = JSON.parse(cached);
                        if (Array.isArray(parsed) && parsed.length === 2) {
                            initialResolved.push({ ...hotel, coordinates: parsed as [number, number] });
                            return;
                        }
                    } catch (e) { /* ignore invalid cache */ }
                }

                // Needs Fetch
                toFetch.push(hotel);
            });

            // Immediately show what we have (DB + Cache) -> Instant feeling
            if (isMounted) {
                setGeocodedHotels([...initialResolved]);
                setProgress(hotels.length - toFetch.length);
            }

            // 2. Fetch missing hotels sequentially in background
            if (toFetch.length > 0) {
                for (const hotel of toFetch) {
                    if (!isMounted) break;

                    try {
                        const query = `${hotel.name}, ${hotel.location}`;
                        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
                        const data = await response.json();

                        let coords: [number, number] | null = null;

                        if (data && data.length > 0) {
                            coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                        } else {
                            // Fallback 1: Name only
                            const resp2 = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(hotel.name)}&limit=1`);
                            const data2 = await resp2.json();
                            if (data2 && data2.length > 0) {
                                coords = [parseFloat(data2[0].lat), parseFloat(data2[0].lon)];
                            }
                        }

                        if (coords && isMounted) {
                            sessionStorage.setItem(CACHE_PREFIX + hotel.id, JSON.stringify(coords));
                            setGeocodedHotels(prev => {
                                if (prev.find(p => p.id === hotel.id)) return prev;
                                return [...prev, { ...hotel, coordinates: coords! }];
                            });
                        }
                    } catch (e) {
                        console.error(`Error geocoding ${hotel.name}:`, e);
                    }

                    setProgress(prev => prev + 1);
                    await new Promise(r => setTimeout(r, 1200)); // Rate limit
                }
            }

            if (isMounted) setIsFetching(false);
        };

        processHotels();
        return () => { isMounted = false; };
    }, [hotels]);

    // Calculate bounds from geocoded results
    const initialBounds = useMemo(() => {
        const coords = geocodedHotels
            .map(h => h.coordinates)
            .filter(c => c && Array.isArray(c) && c.length === 2 && !isNaN(c[0]) && !isNaN(c[1]));

        return coords.length > 0 ? L.latLngBounds(coords) : undefined;
    }, [geocodedHotels]);

    return (
        <div className={`h-full w-full relative isolate ${isWidget ? 'pointer-events-none' : ''}`}>
            {/* ... (existing loaders) */}

            <MapContainer
                bounds={initialBounds}
                style={{ height: '100%', width: '100%', minHeight: '400px' }}
                center={[21.4225, 39.8262]} // Default to Makkah
                zoom={14}
                scrollWheelZoom={false}
                dragging={!isWidget}
                doubleClickZoom={!isWidget}
                touchZoom={!isWidget}
                zoomControl={false}
                className="h-full w-full outline-none"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {!isWidget && <AutoFitBounds hotels={geocodedHotels} activeCenter={activeCenter} />}

                {/* Holy Sites Markers */}
                {HOLY_SITES.map(site => (
                    <Marker
                        key={site.id}
                        position={site.coords}
                        icon={createLandmarkIcon(site.name, site.type)}
                        zIndexOffset={1000} // Always on top
                    />
                ))}

                {/* Hotel Markers using geocodedHotels */}
                {geocodedHotels.map(hotel => {
                    return (
                        <Marker
                            key={hotel.id}
                            position={hotel.coordinates}
                            icon={createCustomIcon(
                                hotel.name,
                                hotel.price,
                                hotel.rating || 4.0,
                                hotel.distance || '',
                                hotel.timeInMinutes,
                                hoveredHotelId === hotel.id
                            )}
                            eventHandlers={{
                                click: () => !isWidget && onMarkerClick && onMarkerClick(hotel.id),
                                mouseover: () => !isWidget && onMarkerClick && onMarkerClick(hotel.id)
                            }}
                        />
                    );
                })}

                {!isWidget && <ZoomControl position="bottomright" />}
            </MapContainer>

            {/* Map Controls */}
            {!isWidget && (
                <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-1.5 flex gap-1">
                    <button className="px-3 py-1.5 text-xs font-bold bg-gray-900 text-white rounded-lg shadow-sm">خريطة</button>
                    <button className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">قمر صناعي</button>
                </div>
            )}
        </div>
    );
}
