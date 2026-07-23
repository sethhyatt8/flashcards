import fs from 'fs'

const monarchs = [
  { id: 'alfred', name: 'Alfred the Great', reign: '871–899', house: 'Wessex', wiki: 'Alfred_the_Great', highlights: ['Defended Wessex against the Danes', 'Promoted learning and law codes', 'Often called the first king of a united English people'] },
  { id: 'edward-elder', name: 'Edward the Elder', reign: '899–924', house: 'Wessex', wiki: 'Edward_the_Elder', highlights: ['Son of Alfred the Great', 'Expanded West Saxon control into the Danelaw', 'Father of Athelstan'] },
  { id: 'athelstan', name: 'Athelstan', reign: '924–939', house: 'Wessex', wiki: 'Athelstan', highlights: ['First king to rule all of England', 'Victory at Brunanburh (937)', 'Strong continental alliances'] },
  { id: 'edmund-i', name: 'Edmund I', reign: '939–946', house: 'Wessex', wiki: 'Edmund_I', highlights: ['Reconquered the northern Danelaw', 'Murdered at Pucklechurch', 'Nicknamed Edmund the Magnificent'] },
  { id: 'eadred', name: 'Eadred', reign: '946–955', house: 'Wessex', wiki: 'Eadred', highlights: ['Brought Northumbria under lasting English control', 'Brother of Edmund I', 'Left a wealthy treasury'] },
  { id: 'eadwig', name: 'Eadwig', reign: '955–959', house: 'Wessex', wiki: 'Eadwig', highlights: ['Short, contested reign', 'Kingdom briefly split with his brother Edgar', 'Also called Edwy'] },
  { id: 'edgar', name: 'Edgar', reign: '959–975', house: 'Wessex', wiki: 'Edgar,_King_of_England', highlights: ['Nicknamed Edgar the Peaceful', 'Reform of monasteries under Dunstan', 'Landmark coronation at Bath'] },
  { id: 'edward-martyr', name: 'Edward the Martyr', reign: '975–978', house: 'Wessex', wiki: 'Edward_the_Martyr', highlights: ['Became king as a teenager', 'Murdered at Corfe', 'Later venerated as a saint'] },
  { id: 'ethelred', name: 'Ethelred the Unready', reign: '978–1013; 1014–1016', house: 'Wessex', wiki: 'Ethelred_the_Unready', highlights: ['Unready means poorly advised', 'Paid Danegeld to Viking attackers', 'Father of Edward the Confessor'] },
  { id: 'sweyn', name: 'Sweyn Forkbeard', reign: '1013–1014', house: 'Denmark', wiki: 'Sweyn_Forkbeard', highlights: ['Danish conqueror of England', 'Father of Cnut', 'Died weeks after taking the throne'] },
  { id: 'edmund-ironside', name: 'Edmund Ironside', reign: '1016', house: 'Wessex', wiki: 'Edmund_Ironside', highlights: ['Fought Cnut to a hard-fought stalemate', 'Reigned only months', 'Agreement left Cnut as successor'] },
  { id: 'cnut', name: 'Cnut', reign: '1016–1035', house: 'Denmark', wiki: 'Cnut', highlights: ['Ruled a North Sea empire', 'England, Denmark, and later Norway', 'Famous tide legend is later folklore'] },
  { id: 'harold-harefoot', name: 'Harold Harefoot', reign: '1035–1040', house: 'Denmark', wiki: 'Harold_Harefoot', highlights: ['Son of Cnut', 'Took England while Harthacnut was abroad', 'Short, disputed succession'] },
  { id: 'harthacnut', name: 'Harthacnut', reign: '1040–1042', house: 'Denmark', wiki: 'Harthacnut', highlights: ['Last Danish king of England', 'Also king of Denmark', 'Death opened the way for Edward the Confessor'] },
  { id: 'edward-confessor', name: 'Edward the Confessor', reign: '1042–1066', house: 'Wessex', wiki: 'Edward_the_Confessor', highlights: ['Last king of the House of Wessex', 'Began Westminster Abbey', 'Childless death triggered the 1066 crisis'] },
  { id: 'harold-ii', name: 'Harold II (Godwinson)', reign: '1066', house: 'Godwin', wiki: 'Harold_Godwinson', highlights: ['Won at Stamford Bridge', 'Defeated and killed at Hastings', 'Last Anglo-Saxon king of England'] },
  { id: 'william-i', name: 'William I (the Conqueror)', reign: '1066–1087', house: 'Normandy', wiki: 'William_the_Conqueror', highlights: ['Won the Battle of Hastings', 'Commissioned the Domesday Book', 'Began Norman rule in England'] },
  { id: 'william-ii', name: 'William II (Rufus)', reign: '1087–1100', house: 'Normandy', wiki: 'William_II_of_England', highlights: ['Son of the Conqueror', 'Killed in a New Forest hunting accident', 'Clashed often with the Church'] },
  { id: 'henry-i', name: 'Henry I', reign: '1100–1135', house: 'Normandy', wiki: 'Henry_I_of_England', highlights: ['Issued the Charter of Liberties', 'White Ship crisis killed his heir', 'Named daughter Matilda as heir'] },
  { id: 'stephen', name: 'Stephen', reign: '1135–1154', house: 'Blois', wiki: 'Stephen,_King_of_England', highlights: ['Civil war with Empress Matilda (the Anarchy)', 'Nephew of Henry I', 'Settled succession on Henry II'] },
  { id: 'henry-ii', name: 'Henry II', reign: '1154–1189', house: 'Plantagenet', wiki: 'Henry_II_of_England', highlights: ['Founded the Plantagenet line', 'Becket controversy and murder', 'Ruled a vast Angevin empire'] },
  { id: 'richard-i', name: 'Richard I (the Lionheart)', reign: '1189–1199', house: 'Plantagenet', wiki: 'Richard_I_of_England', highlights: ['Spent little time in England', 'Leader on the Third Crusade', 'Ransomed after capture in Austria'] },
  { id: 'john', name: 'John', reign: '1199–1216', house: 'Plantagenet', wiki: 'John,_King_of_England', highlights: ['Sealed Magna Carta (1215)', 'Lost Normandy to France', 'Nicknamed Lackland'] },
  { id: 'henry-iii', name: 'Henry III', reign: '1216–1272', house: 'Plantagenet', wiki: 'Henry_III_of_England', highlights: ['Long minority and long reign', 'Rebuilt Westminster Abbey', 'Faced baronial reform under Simon de Montfort'] },
  { id: 'edward-i', name: 'Edward I', reign: '1272–1307', house: 'Plantagenet', wiki: 'Edward_I_of_England', highlights: ['Conquered Wales', 'Fought Scotland (Longshanks)', 'Model Parliament developments'] },
  { id: 'edward-ii', name: 'Edward II', reign: '1307–1327', house: 'Plantagenet', wiki: 'Edward_II_of_England', highlights: ['Defeat at Bannockburn (1314)', 'Overthrown by Isabella and Mortimer', 'Deposed in favour of Edward III'] },
  { id: 'edward-iii', name: 'Edward III', reign: '1327–1377', house: 'Plantagenet', wiki: 'Edward_III_of_England', highlights: ['Started the Hundred Years War', 'Order of the Garter founded', 'Black Death struck during his reign'] },
  { id: 'richard-ii', name: 'Richard II', reign: '1377–1399', house: 'Plantagenet', wiki: 'Richard_II_of_England', highlights: ['Became king as a child', 'Faced the Peasants Revolt (1381)', 'Deposed by Henry Bolingbroke'] },
  { id: 'henry-iv', name: 'Henry IV', reign: '1399–1413', house: 'Lancaster', wiki: 'Henry_IV_of_England', highlights: ['First Lancastrian king', 'Seized the crown from Richard II', 'Faced repeated rebellions'] },
  { id: 'henry-v', name: 'Henry V', reign: '1413–1422', house: 'Lancaster', wiki: 'Henry_V_of_England', highlights: ['Victory at Agincourt (1415)', 'Nearly won the French crown', 'Died young on campaign'] },
  { id: 'henry-vi', name: 'Henry VI', reign: '1422–1461; 1470–1471', house: 'Lancaster', wiki: 'Henry_VI_of_England', highlights: ['King in infancy', 'Wars of the Roses erupted', 'Twice deposed by the Yorkists'] },
  { id: 'edward-iv', name: 'Edward IV', reign: '1461–1470; 1471–1483', house: 'York', wiki: 'Edward_IV_of_England', highlights: ['Yorkist victor of Towton', 'Briefly exiled then restored', 'Father of the Princes in the Tower'] },
  { id: 'edward-v', name: 'Edward V', reign: '1483', house: 'York', wiki: 'Edward_V_of_England', highlights: ['One of the Princes in the Tower', 'Never crowned', 'Disappeared after uncle Richard took power'] },
  { id: 'richard-iii', name: 'Richard III', reign: '1483–1485', house: 'York', wiki: 'Richard_III_of_England', highlights: ['Last Yorkist king', 'Died at Bosworth Field', 'Remains rediscovered in Leicester (2012)'] },
  { id: 'henry-vii', name: 'Henry VII', reign: '1485–1509', house: 'Tudor', wiki: 'Henry_VII_of_England', highlights: ['Won Bosworth; founded the Tudors', 'Stabilised finances', 'Married Elizabeth of York'] },
  { id: 'henry-viii', name: 'Henry VIII', reign: '1509–1547', house: 'Tudor', wiki: 'Henry_VIII', highlights: ['Six marriages', 'English Reformation and break with Rome', 'Dissolution of the monasteries'] },
  { id: 'edward-vi', name: 'Edward VI', reign: '1547–1553', house: 'Tudor', wiki: 'Edward_VI', highlights: ['Protestant boy-king', 'Book of Common Prayer advanced', 'Died at 15'] },
  { id: 'mary-i', name: 'Mary I', reign: '1553–1558', house: 'Tudor', wiki: 'Mary_I_of_England', highlights: ['First queen regnant of England', 'Restored Catholicism', 'Nicknamed Bloody Mary'] },
  { id: 'elizabeth-i', name: 'Elizabeth I', reign: '1558–1603', house: 'Tudor', wiki: 'Elizabeth_I', highlights: ['Spanish Armada defeated (1588)', 'Elizabethan religious settlement', 'Last Tudor monarch'] },
  { id: 'james-i', name: 'James I', reign: '1603–1625', house: 'Stuart', wiki: 'James_VI_and_I', highlights: ['First to rule England and Scotland', 'King James Bible (1611)', 'Gunpowder Plot (1605)'] },
  { id: 'charles-i', name: 'Charles I', reign: '1625–1649', house: 'Stuart', wiki: 'Charles_I_of_England', highlights: ['Personal rule without Parliament', 'English Civil War', 'Executed after trial (1649)'] },
  { id: 'charles-ii', name: 'Charles II', reign: '1660–1685', house: 'Stuart', wiki: 'Charles_II_of_England', highlights: ['Restoration of the monarchy', 'Great Plague and Great Fire of London', 'Merry Monarch era'] },
  { id: 'james-ii', name: 'James II', reign: '1685–1688', house: 'Stuart', wiki: 'James_II_of_England', highlights: ['Catholic king in a Protestant realm', 'Deposed in the Glorious Revolution', 'Fled to France'] },
  { id: 'william-mary', name: 'William III & Mary II', reign: '1689–1702', house: 'Stuart / Orange', wiki: 'William_III_of_England', highlights: ['Joint monarchy after 1688', 'Bill of Rights (1689)', 'Mary died 1694; William ruled alone after'] },
  { id: 'anne', name: 'Anne', reign: '1702–1714', house: 'Stuart', wiki: 'Anne,_Queen_of_Great_Britain', highlights: ['Acts of Union (1707) created Great Britain', 'Last Stuart monarch', 'War of the Spanish Succession'] },
  { id: 'george-i', name: 'George I', reign: '1714–1727', house: 'Hanover', wiki: 'George_I_of_Great_Britain', highlights: ['First Hanoverian king', 'Spoke little English', 'Rise of Walpole and cabinet government'] },
  { id: 'george-ii', name: 'George II', reign: '1727–1760', house: 'Hanover', wiki: 'George_II_of_Great_Britain', highlights: ['Last British king to lead troops in battle', 'Jacobite rising of 1745', 'Growing parliamentary power'] },
  { id: 'george-iii', name: 'George III', reign: '1760–1820', house: 'Hanover', wiki: 'George_III', highlights: ['American Revolutionary War', 'Long reign with later illness', 'United Kingdom formed (1801)'] },
  { id: 'george-iv', name: 'George IV', reign: '1820–1830', house: 'Hanover', wiki: 'George_IV', highlights: ['Former Prince Regent', 'Lavish builder and patron', 'Unpopular marriage to Caroline'] },
  { id: 'william-iv', name: 'William IV', reign: '1830–1837', house: 'Hanover', wiki: 'William_IV', highlights: ['Sailor King', 'Reform Act 1832', 'Last Hanoverian king of Britain'] },
  { id: 'victoria', name: 'Victoria', reign: '1837–1901', house: 'Hanover / Saxe-Coburg', wiki: 'Queen_Victoria', highlights: ['Longest reign until Elizabeth II', 'Victorian age of empire and industry', 'Empress of India from 1876'] },
  { id: 'edward-vii', name: 'Edward VII', reign: '1901–1910', house: 'Saxe-Coburg and Gotha', wiki: 'Edward_VII', highlights: ['Edwardian era', 'Modernised the monarchy public style', 'Entente diplomacy with France'] },
  { id: 'george-v', name: 'George V', reign: '1910–1936', house: 'Windsor', wiki: 'George_V', highlights: ['Renamed the dynasty Windsor (1917)', 'World War I', 'Steered the crown through a new media age'] },
  { id: 'edward-viii', name: 'Edward VIII', reign: '1936', house: 'Windsor', wiki: 'Edward_VIII', highlights: ['Abdicated to marry Wallis Simpson', 'Never crowned', 'Became Duke of Windsor'] },
  { id: 'george-vi', name: 'George VI', reign: '1936–1952', house: 'Windsor', wiki: 'George_VI', highlights: ['King through World War II', 'Symbol of wartime resolve', 'Father of Elizabeth II'] },
  { id: 'elizabeth-ii', name: 'Elizabeth II', reign: '1952–2022', house: 'Windsor', wiki: 'Elizabeth_II', highlights: ['Longest-reigning British monarch', 'Modernised a global Commonwealth role', 'Platinum Jubilee in 2022'] },
  { id: 'charles-iii', name: 'Charles III', reign: '2022–', house: 'Windsor', wiki: 'Charles_III', highlights: ['Oldest person to accede', 'Formerly Prince of Wales', 'Current king of the United Kingdom'] },
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function thumb(wiki) {
  const url =
    'https://en.wikipedia.org/api/rest_v1/page/summary/' +
    encodeURIComponent(wiki)
  const res = await fetch(url, {
    headers: { 'Api-User-Agent': 'FlashcardsApp/1.0 (local; study app)' },
  })
  if (!res.ok) return null
  const j = await res.json()
  const src = j.thumbnail?.source || j.originalimage?.source || null
  return src ? src.replace(/\/(\d+)px-/, '/500px-') : null
}

const out = []
for (const m of monarchs) {
  let image = null
  for (let attempt = 0; attempt < 5; attempt++) {
    image = await thumb(m.wiki)
    if (image) break
    await sleep(900 * (attempt + 1))
  }
  out.push({
    id: m.id,
    name: m.name,
    reign: m.reign,
    house: m.house,
    highlights: m.highlights,
    image: image || '',
  })
  console.log(m.id, image ? 'ok' : 'NO IMAGE')
  await sleep(400)
}

fs.writeFileSync('src/data/uk-monarchs.json', JSON.stringify(out, null, 2))
console.log(
  'wrote',
  out.length,
  'missing',
  out.filter((x) => !x.image).length,
)
