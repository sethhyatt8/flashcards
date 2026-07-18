import { geoMercator, geoPath } from 'd3-geo'
import { useEffect, useMemo, useState } from 'react'
import { feature } from 'topojson-client'
import type { FeatureCollection, Geometry, MultiPoint } from 'geojson'
import type { FlagCard } from '../types'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const ANTARCTICA_ID = '010'

type RegionMapProps = {
  card: FlagCard
  width?: number
  height?: number
}

/** Tight subregion frames: [[west, south], [east, north]] */
const SUBREGION_FRAMES: Record<string, [[number, number], [number, number]]> = {
  'North America': [
    [-130, 24],
    [-52, 60],
  ],
  'Central America': [
    [-93, 6],
    [-76, 19],
  ],
  Caribbean: [
    [-86, 10],
    [-59, 28],
  ],
  'South America': [
    [-82, -56],
    [-34, 13],
  ],
  'Western Europe': [
    [-11, 36],
    [15, 60],
  ],
  'Northern Europe': [
    [-25, 54],
    [32, 72],
  ],
  'Southern Europe': [
    [-10, 35],
    [30, 47],
  ],
  'Central Europe': [
    [5, 45],
    [25, 56],
  ],
  'Eastern Europe': [
    [20, 44],
    [45, 62],
  ],
  'Southeast Europe': [
    [13, 34],
    [30, 49],
  ],
  'Western Asia': [
    [26, 12],
    [63, 43],
  ],
  'Central Asia': [
    [46, 35],
    [88, 56],
  ],
  'Eastern Asia': [
    [105, 20],
    [148, 52],
  ],
  'Southern Asia': [
    [60, 5],
    [98, 38],
  ],
  'South-Eastern Asia': [
    [92, -11],
    [141, 23],
  ],
  'Northern Africa': [
    [-18, 15],
    [38, 38],
  ],
  'Western Africa': [
    [-18, 3],
    [16, 28],
  ],
  'Middle Africa': [
    [8, -14],
    [35, 12],
  ],
  'Eastern Africa': [
    [28, -27],
    [52, 18],
  ],
  'Southern Africa': [
    [10, -36],
    [41, -15],
  ],
  'Australia and New Zealand': [
    [112, -48],
    [180, -10],
  ],
  Melanesia: [
    [140, -23],
    [180, 0],
  ],
  Micronesia: [
    [130, -1],
    [175, 22],
  ],
  Polynesia: [
    [-175, -25],
    [-135, -5],
  ],
}

function padId(id: string | number | undefined): string {
  if (id === undefined || id === null) return ''
  return String(id).padStart(3, '0')
}

function boundsAsMultiPoint(
  bounds: [[number, number], [number, number]],
): MultiPoint {
  const [[west, south], [east, north]] = bounds
  return {
    type: 'MultiPoint',
    coordinates: [
      [west, south],
      [east, south],
      [east, north],
      [west, north],
    ],
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
  const bounds = SUBREGION_FRAMES[card.subregion] ?? null

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
    if (!world || !bounds) return null

    const projection = geoMercator()
    // MultiPoint fit is reliable; Polygon fit was leaving default world scale.
    projection.fitExtent(
      [
        [6, 6],
        [width - 6, height - 6],
      ],
      boundsAsMultiPoint(bounds),
    )
    projection.clipExtent([
      [0, 0],
      [width, height],
    ])

    const path = geoPath(projection)

    return world.features
      .map((f) => {
        const id = padId(f.id as string | number)
        if (id === ANTARCTICA_ID) return null
        const d = path(f)
        if (!d) return null

        // Drop shapes whose centroid falls well outside the frame.
        const centroid = path.centroid(f)
        if (
          !Number.isFinite(centroid[0]) ||
          centroid[0] < -20 ||
          centroid[0] > width + 20 ||
          centroid[1] < -20 ||
          centroid[1] > height + 20
        ) {
          return null
        }

        return {
          id,
          d,
          active: id === card.ccn3,
        }
      })
      .filter(Boolean) as { id: string; d: string; active: boolean }[]
  }, [world, card.ccn3, bounds, width, height])

  if (!bounds) {
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
      data-subregion={card.subregion}
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
