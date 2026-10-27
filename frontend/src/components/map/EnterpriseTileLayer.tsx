import React from 'react';
import { TileLayer } from 'react-leaflet';

interface EnterpriseTileLayerProps {
  className?: string;
}

/**
 * Enterprise TileLayer with zero API key requirement.
 * OpenStreetMap provider (free, public, no authentication required).
 */
export function EnterpriseTileLayer({ className = '' }: EnterpriseTileLayerProps) {
  return (
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap contributors"
      maxZoom={19}
      className={`osm-dark-filter ${className}`}
    />
  );
}
