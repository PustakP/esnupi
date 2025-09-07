'use client';

import { useEffect, useRef, useState } from 'react';
import { Report } from '@/lib/definitions';

// leaflet imports - dynamic to avoid ssr issues
let L: any;
let MarkerClusterGroup: any;

interface LeafletMapProps {
  reports: Report[];
  height?: string;
  enableRealtime?: boolean;
  onReportClick?: (report: Report) => void;
}

export function LeafletMap({ 
  reports, 
  height = '400px', 
  enableRealtime = false,
  onReportClick 
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerLayerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // init leaflet libs on client
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        // dynamic import to avoid ssr
        const leaflet = await import('leaflet');
        const markerCluster = await import('leaflet.markercluster');
        
        L = leaflet.default;
        MarkerClusterGroup = L.markerClusterGroup;

        // fix default marker icons for webpack
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: '/leaflet/marker-icon-2x.png',
          iconUrl: '/leaflet/marker-icon.png',
          shadowUrl: '/leaflet/marker-shadow.png',
        });

        setIsLoaded(true);
      } catch (error) {
        console.error('failed to load leaflet:', error);
      }
    };

    loadLeaflet();
  }, []);

  // init map when leaflet is loaded
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    // init map centered on noida
    const map = L.map(mapRef.current).setView([28.6139, 77.2090], 13);
    
    // add osm tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // init marker cluster group
    const markerLayer = MarkerClusterGroup({
      chunkedLoading: true,
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    });
    
    map.addLayer(markerLayer);
    
    mapInstanceRef.current = map;
    markerLayerRef.current = markerLayer;

    // cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerLayerRef.current = null;
      }
    };
  }, [isLoaded]);

  // add markers for reports
  const addMarkerToMap = (report: Report) => {
    if (!L || !markerLayerRef.current) return;

    const marker = L.marker([report.location.lat, report.location.lng]);
    
    // create popup content similar to map.html
    const popupContent = `
      <div class="p-2">
        <b>${report.category}: ${report.title}</b><br/>
        Priority: ${report.priority}<br/>
        Status: ${report.status}<br/>
        Address: ${report.address}<br/>
        ${report.imageUrl ? `<img src="${report.imageUrl}" alt="${report.description}" style="width:100%; margin-top:5px; border-radius:4px;">` : ''}
      </div>
    `;
    
    marker.bindPopup(popupContent);
    
    // add click handler
    if (onReportClick) {
      marker.on('click', () => onReportClick(report));
    }
    
    markerLayerRef.current.addLayer(marker);
  };

  // update markers when reports change
  useEffect(() => {
    if (!markerLayerRef.current) return;

    // clear existing markers
    markerLayerRef.current.clearLayers();
    
    // add new markers
    reports.forEach(report => addMarkerToMap(report));
  }, [reports, isLoaded]);

  // websocket for real-time updates
  useEffect(() => {
    if (!enableRealtime || typeof window === 'undefined') return;

    let socket: any;
    
    const initSocket = async () => {
      try {
        const io = await import('socket.io-client');
        socket = io.io('http://localhost:3000');

        socket.on('connect', () => {
          console.log('connected to websocket server:', socket.id);
        });

        socket.on('new-report', (newReport: Report) => {
          console.log('received new report:', newReport);
          addMarkerToMap(newReport);
        });
      } catch (error) {
        console.error('failed to init socket:', error);
      }
    };

    initSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [enableRealtime]);

  if (!isLoaded) {
    return (
      <div 
        className="bg-gray-100 rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* leaflet css */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" />
      
      <div 
        ref={mapRef} 
        className="w-full rounded-lg overflow-hidden border"
        style={{ height }}
      />
    </>
  );
}
