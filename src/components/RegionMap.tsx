import { geoMercator, geoPath } from 'd3-geo'
import { useEffect, useMemo, useState } from 'react'
import { feature } from 'topojson-client'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import type { FlagCard } from '../types'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

type RegionMapProps = {
  card: FlagCard
  width?: number
  height?: number
}

/** Tight subregion frames: [[west, south], [east, north]] */
const SUBREGION_FRAMES: Record<
  string,
  { bounds: [[number, number], [number, number]] }
> = {
  'North America': {
    bounds: [
      [-130, 24],
      [-52, 60],
    ],
  },
  'Central America': {
    bounds: [
      [-93, 6],
      [-76, 19],
    ],
  },
  Caribbean: {
    bounds: [
      [-86, 10],
      [-59, 28],
    ],
  },
  'South America': {
    bounds: [
      [-82, -56],
      [-34, 13],
    ],
  },
  'Western Europe': {
    bounds: [
      [-11, 36],
      [15, 60],
    ],
  },
  'Northern Europe': {
    bounds: [
      [-25, 54],
      [32, 72],
    ],
  },
  'Southern Europe': {
    bounds: [
      [-10, 35],
      [30, 47],
    ],
  },
  'Central Europe': {
    bounds: [
      [5, 45],
      [25, 56],
    ],
  },
  'Eastern Europe': {
    bounds: [
      [20, 44],
      [45, 62],
    ],
  },
  'Southeast Europe': {
    bounds: [
      [13, 34],
      [30, 49],
    ],
  },
  'Western Asia': {
    bounds: [
      [26, 12],
      [63, 43],
    ],
  },
  'Central Asia': {
    bounds: [
      [46, 35],
      [88, 56],
    ],
  },
  'Eastern Asia': {
    bounds: [
      [105, 20],
      [148, 52],
    ],
  },
  'Southern Asia': {
    bounds: [
      [60, 5],
      [98, 38],
    ],
  },
  'South-Eastern Asia': {
    bounds: [
      [92, -11],
      [141, 23],
    ],
  },
  'Northern Africa': {
    bounds: [
      [-18, 15],
      [38, 38],
    ],
  },
  'Western Africa': {
    bounds: [
      [-18, 3],
      [16, 28],
    ],
  },
  'Middle Africa': {
    bounds: [
      [8, -14],
      [35, 12],
    ],
  },
  'Eastern Africa': {
    bounds: [
      [28, -27],
      [52, 18],
    ],
  },
  'Southern Africa': {
    bounds: [
      [10, -36],
      [41, -15],
    ],
  },
  'Australia and New Zealand': {
    bounds: [
      [112, -48],
      [180, -10],
    ],
  },
  Melanesia: {
    bounds: [
      [140, -23],
      [180, 0],
    ],
  },
  Micronesia: {
    bounds: [
      [130, -1],
      [175, 22],
    ],
  },
  Polynesia: {
    bounds: [
      [-175, -25],
      [-135, -5],
    ],
  },
}

function padId(id: string | number | undefined): string {
  if (id === undefined || id === null) return ''
  return String(id).padStart(3, '0')
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

export function RegionMap({ card, width = 320, height = 160 }: RegionMapProps) {
  const [world, setWorld] = useState<FeatureCollection<Geometry> | null>(
    cachedCollection,
  )
  const [failed, setFailed] = useState(false)
  const frame =
    SUBREGION_FRAMES[card.subregion] ??
    SUBREGION_FRAMES[card.region] ??
    null

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
    if (!world || !frame) return null

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

  if (!frame) {
    return null
  }

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
      aria-label={`${card.subregion} map highlighting ${card.name}`}
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
