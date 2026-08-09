import fs from 'fs'

const WIKI_API =
  'https://en.wikipedia.org/w/api.php?action=parse&page=List_of_countries_and_dependencies_by_population&prop=text&format=json&origin=*'

const ALIASES = {
  'DR Congo': 'Democratic Republic of the Congo',
  Congo: 'Republic of the Congo',
  Türkiye: 'Turkey',
  Czechia: 'Czech Republic',
  'East Timor': 'Timor-Leste',
  Swaziland: 'Eswatini',
  Vatican: 'Vatican City',
  'Holy See': 'Vatican City',
}

function cleanLocation(raw) {
  return raw
    .replace(/\[[^\]]*]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseFromHtml(html) {
  const pops = new Map()
  const rows = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || []
  for (const row of rows) {
    const cells = [...row.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(
      (m) => m[1],
    )
    if (cells.length < 2) continue
    const textName = cleanLocation(
      cells[0]
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&'),
    )
    const popMatch = cells[1].replace(/<[^>]+>/g, '').match(/[0-9][0-9,]*/)
    if (!textName || !popMatch) continue
    if (textName === 'World' || textName === 'Location') continue
    const pop = Number(popMatch[0].replace(/,/g, ''))
    if (!Number.isFinite(pop) || pop <= 0) continue
    pops.set(textName, pop)
  }
  return pops
}

function parseFromMarkdown(md) {
  const pops = new Map()
  for (const line of md.split(/\r?\n/)) {
    const m = line.match(/^\|\s*(.+?)\s*\|\s*([0-9][0-9,]*)\s*\|/)
    if (!m) continue
    const textName = cleanLocation(m[1])
    if (!textName || textName === 'World' || textName === 'Location') continue
    const pop = Number(m[2].replace(/,/g, ''))
    if (!Number.isFinite(pop) || pop <= 0) continue
    pops.set(textName, pop)
  }
  return pops
}

function lookup(pops, name) {
  const wikiName = ALIASES[name] || name
  if (pops.has(wikiName)) return pops.get(wikiName)
  const lower = wikiName.toLowerCase()
  for (const [k, v] of pops) {
    if (k.toLowerCase() === lower) return v
  }
  return null
}

async function loadPopulations() {
  const localPath = process.argv[2]
  if (localPath) {
    const text = fs.readFileSync(localPath, 'utf8')
    return text.includes('<tr') ? parseFromHtml(text) : parseFromMarkdown(text)
  }

  const res = await fetch(WIKI_API, {
    headers: {
      'Api-User-Agent':
        'FlashcardsApp/1.0 (local study app; population sync; contact via github.com/sethhyatt8/flashcards)',
    },
  })
  if (!res.ok) throw new Error(`Wikipedia API failed: ${res.status}`)
  const json = await res.json()
  const html = json?.parse?.text?.['*']
  if (!html) throw new Error('No HTML from Wikipedia parse API')
  return parseFromHtml(html)
}

const pops = await loadPopulations()
const flagsPath = 'src/data/world-flags.json'
const flags = JSON.parse(fs.readFileSync(flagsPath, 'utf8'))

let updated = 0
const missing = []
const biggest = []

for (const card of flags) {
  const pop = lookup(pops, card.name)
  if (pop == null) {
    missing.push(card.name)
    continue
  }
  if (card.population !== pop) {
    biggest.push({
      name: card.name,
      from: card.population,
      to: pop,
      delta: pop - card.population,
    })
    card.population = pop
    updated++
  }
}

fs.writeFileSync(flagsPath, JSON.stringify(flags, null, 2) + '\n')

biggest.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
console.log(`Wikipedia entries parsed: ${pops.size}`)
console.log(`Cards updated: ${updated}/${flags.length}`)
console.log(`Missing: ${missing.length ? missing.join(', ') : '(none)'}`)
console.log('Largest changes:')
for (const row of biggest.slice(0, 12)) {
  console.log(
    `  ${row.name}: ${row.from.toLocaleString()} → ${row.to.toLocaleString()}`,
  )
}
