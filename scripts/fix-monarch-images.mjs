import fs from 'fs'

const path = 'src/data/uk-monarchs.json'
const data = JSON.parse(fs.readFileSync(path, 'utf8'))

const alts = {
  sweyn: ['Sweyn_Forkbeard', 'Swein_Forkbeard'],
  john: ['John,_King_of_England', 'King_John'],
  'henry-iii': ['Henry_III_of_England'],
  'henry-vii': ['Henry_VII_of_England', 'Henry_VII'],
  'henry-viii': ['Henry_VIII', 'Henry_VIII_of_England'],
  'mary-i': ['Mary_I_of_England', 'Mary_I'],
  'elizabeth-i': ['Elizabeth_I', 'Elizabeth_I_of_England'],
  'william-iv': ['William_IV', 'William_IV_of_the_United_Kingdom'],
  victoria: ['Queen_Victoria', 'Victoria_of_the_United_Kingdom'],
  'edward-vii': ['Edward_VII', 'Edward_VII_of_the_United_Kingdom'],
  'george-v': ['George_V', 'George_V_of_the_United_Kingdom'],
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function enlarge(src) {
  // Wikimedia rejects some thumb widths (e.g. 640); 500 is widely available.
  return src.replace(/\/(\d+)px-/, '/500px-')
}

async function getThumb(title) {
  const summaryUrl =
    'https://en.wikipedia.org/api/rest_v1/page/summary/' +
    encodeURIComponent(title)
  let res = await fetch(summaryUrl, {
    headers: { 'Api-User-Agent': 'FlashcardsApp/1.0' },
  })
  if (res.ok) {
    const j = await res.json()
    const src = j.thumbnail?.source || j.originalimage?.source
    if (src) return enlarge(src)
  }

  const api =
    'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&piprop=thumbnail&pithumbsize=500&titles=' +
    encodeURIComponent(title)
  res = await fetch(api, {
    headers: { 'Api-User-Agent': 'FlashcardsApp/1.0' },
  })
  if (!res.ok) return null
  const j = await res.json()
  const pages = j.query?.pages || {}
  for (const p of Object.values(pages)) {
    if (p.thumbnail?.source) return p.thumbnail.source
  }
  return null
}

for (const card of data) {
  if (card.image) continue
  const titles = alts[card.id] || []
  let image = null
  for (const t of titles) {
    for (let i = 0; i < 4 && !image; i += 1) {
      image = await getThumb(t)
      if (!image) await sleep(1000 * (i + 1))
    }
    if (image) break
    await sleep(500)
  }
  card.image = image || ''
  console.log(card.id, image ? 'ok' : 'STILL MISSING')
  await sleep(500)
}

fs.writeFileSync(path, JSON.stringify(data, null, 2))
console.log(
  'missing',
  data.filter((x) => !x.image).map((x) => x.id).join(', ') || 'none',
)
