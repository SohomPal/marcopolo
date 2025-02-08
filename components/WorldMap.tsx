import dynamic from "next/dynamic"
import { useTheme } from "next-themes"

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

interface WorldMapProps {
  vantagePoints: string[]
  provider: "google" | "aws"
}

const googleCoordinates = {
  "africa-south1": {
    latitude: -26.2041,
    longitude: 28.0473,
  },
  "asia-east1": {
    latitude: 25.033,
    longitude: 121.5654,
  },
  "asia-east2": {
    latitude: 22.3193,
    longitude: 114.1694,
  },
  "asia-northeast1": {
    latitude: 35.6895,
    longitude: 139.6917,
  },
  "asia-northeast2": {
    latitude: 34.6937,
    longitude: 135.5023,
  },
  "asia-northeast3": {
    latitude: 37.5665,
    longitude: 126.978,
  },
  "asia-south1": {
    latitude: 19.076,
    longitude: 72.8777,
  },
  "asia-south2": {
    latitude: 28.7041,
    longitude: 77.1025,
  },
  "asia-southeast1": {
    latitude: 1.3521,
    longitude: 103.8198,
  },
  "asia-southeast2": {
    latitude: -6.2088,
    longitude: 106.8456,
  },
  "australia-southeast1": {
    latitude: -33.8688,
    longitude: 151.2093,
  },
  "australia-southeast2": {
    latitude: -37.8136,
    longitude: 144.9631,
  },
  "europe-central2": {
    latitude: 52.2297,
    longitude: 21.0122,
  },
  "europe-north1": {
    latitude: 59.3293,
    longitude: 18.0686,
  },
  "europe-southwest1": {
    latitude: 40.4168,
    longitude: -3.7038,
  },
  "europe-west1": {
    latitude: 50.8503,
    longitude: 4.3517,
  },
  "europe-west2": {
    latitude: 51.5074,
    longitude: -0.1278,
  },
  "europe-west3": {
    latitude: 50.1109,
    longitude: 8.6821,
  },
  "europe-west4": {
    latitude: 52.3676,
    longitude: 4.9041,
  },
  "europe-west6": {
    latitude: 47.3769,
    longitude: 8.5417,
  },
  "europe-west8": {
    latitude: 45.4642,
    longitude: 9.19,
  },
  "europe-west9": {
    latitude: 60.1699,
    longitude: 24.9384,
  },
  "europe-west10": {
    latitude: 53.3498,
    longitude: -6.2603,
  },
  "europe-west12": {
    latitude: 38.7223,
    longitude: -9.1393,
  },
  "me-central1": {
    latitude: 25.2048,
    longitude: 55.2708,
  },
  "me-west1": {
    latitude: 32.0853,
    longitude: 34.7818,
  },
  "northamerica-northeast1": {
    latitude: 45.5017,
    longitude: -73.5673,
  },
  "northamerica-northeast2": {
    latitude: 43.6532,
    longitude: -79.3832,
  },
  "northamerica-south1": {
    latitude: -23.5505,
    longitude: -46.6333,
  },
  "southamerica-east1": {
    latitude: -23.5505,
    longitude: -46.6333,
  },
  "southamerica-west1": {
    latitude: -33.4489,
    longitude: -70.6693,
  },
  "us-central1": {
    latitude: 41.2619,
    longitude: -95.8608,
  },
  "us-east1": {
    latitude: 34.0007,
    longitude: -81.0348,
  },
  "us-east4": {
    latitude: 39.0489,
    longitude: -77.4728,
  },
  "us-east5": {
    latitude: 40.7357,
    longitude: -74.1724,
  },
  "us-south1": {
    latitude: 29.4241,
    longitude: -98.4936,
  },
  "us-west1": {
    latitude: 45.6059,
    longitude: -121.2358,
  },
  "us-west2": {
    latitude: 34.0522,
    longitude: -118.2437,
  },
  "us-west3": {
    latitude: 40.7608,
    longitude: -111.891,
  },
  "us-west4": {
    latitude: 36.1699,
    longitude: -115.1398,
  },
}

const awsCoordinates = {
  "ap-northeast-2": {
    latitude: 37.5665,
    longitude: 126.978,
  },
  "ap-northeast-3": {
    latitude: 34.6937,
    longitude: 135.5023,
  },
  "ap-southeast-1": {
    latitude: 1.3521,
    longitude: 103.8198,
  },
  "ap-southeast-2": {
    latitude: -33.8688,
    longitude: 151.2093,
  },
  "ap-south-1": {
    latitude: 19.076,
    longitude: 72.8777,
  },
  "ca-central-1": {
    latitude: 45.5017,
    longitude: -73.5673,
  },
  "eu-central-1": {
    latitude: 50.1109,
    longitude: 8.6821,
  },
  "eu-north-1": {
    latitude: 59.3293,
    longitude: 18.0686,
  },
  "eu-west-1": {
    latitude: 53.3498,
    longitude: -6.2603,
  },
  "eu-west-3": {
    latitude: 48.8566,
    longitude: 2.3522,
  },
  "us-east-2": {
    latitude: 39.9612,
    longitude: -82.9988,
  },
  "us-west-1": {
    latitude: 37.7749,
    longitude: -122.4194,
  },
  "us-west-2": {
    latitude: 45.5122,
    longitude: -122.6587,
  },
}

export function WorldMap({ vantagePoints, provider }: WorldMapProps) {
  const { resolvedTheme } = useTheme()
  const coordinates = provider === "google" ? googleCoordinates : awsCoordinates

  const latitudes = vantagePoints.map((vp) => coordinates[vp]?.latitude ?? null)
  const longitudes = vantagePoints.map((vp) => coordinates[vp]?.longitude ?? null)

  if (latitudes.some((lat) => lat === null) || longitudes.some((lon) => lon === null)) {
    return <div>Error: Some vantage points are not found for the selected provider.</div>
  }

  const data = [
    {
      type: "scattergeo",
      mode: "markers",
      lon: longitudes,
      lat: latitudes,
      text: vantagePoints,
      hoverinfo: "text",
      marker: {
        size: 10,
        color: "#3b82f6", // blue color for both themes
        line: {
          width: 1,
          color: "black",
        },
      },
    },
  ]

  const layout = {
    geo: {
      scope: "world",
      showland: true,
      landcolor: resolvedTheme === "dark" ? "#1a202c" : "#f7fafc",
      showocean: true,
      oceancolor: resolvedTheme === "dark" ? "#2d3748" : "#e2e8f0",
      showlakes: true,
      lakecolor: resolvedTheme === "dark" ? "#2d3748" : "#e2e8f0",
      showcountries: true,
      countrycolor: resolvedTheme === "dark" ? "#4a5568" : "#cbd5e0",
      showcoastlines: true,
      coastlinecolor: resolvedTheme === "dark" ? "#4a5568" : "#cbd5e0",
      projection: {
        type: "equirectangular",
      },
      lonaxis: {
        range: [-180, 180],
      },
      lataxis: {
        range: [-90, 90],
      },
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    margin: { t: 0, b: 0, l: 0, r: 0 },
    width: 600,
    height: 300,
  }

  const config = {
    displayModeBar: false,
    scrollZoom: true,
    responsive: true,
  }

  return <Plot data={data} layout={layout} config={config} />
}

