import { geoMercator, geoPath } from 'd3-geo'
import { useEffect, useMemo, useState } from 'react'
import { feature } from 'topojson-client'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import type { FlagCard } from '../types'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

type MapRegionId =
  | 'north-america'
  | 'south-america'
  | 'europe'
  | 'asia'
  | 'africa'
  | 'oceania'

type RegionMapProps = {
  card: FlagCard
  width?: number
  height?: number
}

/** Fixed continental frames — [[west, south], [east, north]] in degrees. */
const REGION_FRAMES: Record<
  MapRegionId,
  { label: string; bounds: [[number, number], [number, number]] }
> = {
  'north-america': {
    label: 'North America',
    bounds: [
      [-170, 5],
      [-50, 72],
    ],
  },
  'south-america': {
    label: 'South America',
    bounds: [
      [-85, -56],
      [-32, 14],
    ],
  },
  europe: {
    label: 'Europe',
    bounds: [
      [-25, 34],
      [42, 72],
    ],
  },
  asia: {
    label: 'Asia',
    bounds: [
      [25, -12],
      [150, 55],
    ],
  },
  africa: {
    label: 'Africa',
    bounds: [
      [-20, -36],
      [53, 38],
    ],
  },
  oceania: {
    label: 'Oceania',
    // Australia, New Zealand, and nearby Pacific
    bounds: [
      [110, -48],
      [180, 2],
    ],
  },
}

function padId(id: string | number | undefined): string {
  if (id === undefined || id === null) return ''
  return String(id).padStart(3, '0')
}

function mapRegionFor(card: FlagCard): MapRegionId {
  if (card.region === 'Europe') return 'europe'
  if (card.region === 'Asia') return 'asia'
  if (card.region === 'Africa') return 'africa'
  if (card.region === 'Oceania') return 'oceania'
  if (card.region === 'Americas') {
    if (card.subregion === 'South America') return 'south-america'
    return 'north-america'
  }
  return 'europe'
}

function frameFeature(
  bounds: [[number, number], [number, number]],
): Feature<Geometry> {
  const [[west, south], [east, north]] = bounds
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [west, south],
          [east, south],
          [east, north],
          [west, north],
          [west, south],
        ],
      ],
    },
  }
}

let cachedCollection: FeatureCollection<Geometry> | null = null
let loadPromise: Promise<FeatureCollection<Geometry>> | null = null

function loadWorld(): Promise<FeatureCollection<Geometry>> {
  if (cachedCollection) return Promise.resolve(cachedCollection)
  if (!loadPromise) {
    loadPromise = fetch(GEO_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load map data')
        return res.json()
      })
      .then((topology: unknown) => {
        const topo = topology as Parameters<typeof feature>[0]
        const object = (
          topology as { objects: { countries: Parameters<typeof feature>[1] } }
        ).objects.countries
        const collection = feature(
          topo,
          object,
        ) as unknown as FeatureCollection<Geometry>
        cachedCollection = collection
        return collection
      })
  }
  return loadPromise
}

export function RegionMap({ card, width = 320, height = 180 }: RegionMapProps) {
  const [world, setWorld] = useState<FeatureCollection<Geometry> | null>(
    cachedCollection,
  )
  const [failed, setFailed] = useState(false)
  const mapRegion = mapRegionFor(card)
  const frame = REGION_FRAMES[mapRegion]

  useEffect(() => {
    let alive = true
    loadWorld()
      .then((collection) => {
        if (alive) setWorld(collection)
      })
      .catch(() => {
        if (alive) setFailed(true)
      })
    return () => {
      alive = false
    }
  }, [])

  const paths = useMemo(() => {
    if (!world) return null

    const projection = geoMercator()
    projection.fitExtent(
      [
        [4, 4],
        [width - 4, height - 4],
      ],
      frameFeature(frame.bounds),
    )
    projection.clipExtent([
      [0, 0],
      [width, height],
    ])

    const path = geoPath(projection)

    return world.features
      .map((f) => {
        const id = padId(f.id as string | number)
        const d = path(f)
        if (!d) return null
        return {
          id,
          d,
          active: id === card.ccn3,
        }
      })
      .filter(Boolean) as { id: string; d: string; active: boolean }[]
  }, [world, card.ccn3, frame, width, height])

  if (failed) {
    return <div className="region-map is-empty">Map unavailable</div>
  }

  if (!paths) {
    return <div className="region-map is-empty">Loading map…</div>
  }

  return (
    <svg
      className="region-map"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${frame.label} map highlighting ${card.name}`}
    >
      <rect
        x="0"
        y="0"
        width={width}
        height={height}
        className="region-map-sea"
      />
      {paths.map((item) => (
        <path
          key={item.id}
          d={item.d}
          className={
            item.active ? 'region-map-land is-active' : 'region-map-land'
          }
        />
      ))}
    </svg>
  )
}
