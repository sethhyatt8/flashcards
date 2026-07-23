import fs from 'fs'

const presidents = [
  { id: 'washington', name: 'George Washington', terms: '1789–1797', vicePresidents: 'John Adams', party: 'Unaffiliated', wiki: 'George_Washington', highlights: ['First U.S. president', 'Set many early precedents for the office', 'Led the Continental Army in the Revolution'] },
  { id: 'adams', name: 'John Adams', terms: '1797–1801', vicePresidents: 'Thomas Jefferson', party: 'Federalist', wiki: 'John_Adams', highlights: ['First vice president, then second president', 'Signed the Alien and Sedition Acts', 'Father of John Quincy Adams'] },
  { id: 'jefferson', name: 'Thomas Jefferson', terms: '1801–1809', vicePresidents: 'Aaron Burr; George Clinton', party: 'Democratic-Republican', wiki: 'Thomas_Jefferson', highlights: ['Author of the Declaration of Independence', 'Louisiana Purchase (1803)', 'Founded the University of Virginia'] },
  { id: 'madison', name: 'James Madison', terms: '1809–1817', vicePresidents: 'George Clinton; Elbridge Gerry', party: 'Democratic-Republican', wiki: 'James_Madison', highlights: ['“Father of the Constitution”', 'President during the War of 1812', 'Co-author of The Federalist Papers'] },
  { id: 'monroe', name: 'James Monroe', terms: '1817–1825', vicePresidents: 'Daniel D. Tompkins', party: 'Democratic-Republican', wiki: 'James_Monroe', highlights: ['Era of Good Feelings', 'Monroe Doctrine (1823)', 'Missouri Compromise signed during his term'] },
  { id: 'jq-adams', name: 'John Quincy Adams', terms: '1825–1829', vicePresidents: 'John C. Calhoun', party: 'Democratic-Republican', wiki: 'John_Quincy_Adams', highlights: ['Son of John Adams', 'Won via House contingent election', 'Later fought slavery in Congress'] },
  { id: 'jackson', name: 'Andrew Jackson', terms: '1829–1837', vicePresidents: 'John C. Calhoun; Martin Van Buren', party: 'Democratic', wiki: 'Andrew_Jackson', highlights: ['“Old Hickory”', 'Fought the Bank of the United States', 'Indian Removal Act era'] },
  { id: 'van-buren', name: 'Martin Van Buren', terms: '1837–1841', vicePresidents: 'Richard Mentor Johnson', party: 'Democratic', wiki: 'Martin_Van_Buren', highlights: ['First president born a U.S. citizen', 'Panic of 1837 dominated his term', 'Key organizer of the Democratic Party'] },
  { id: 'harrison', name: 'William Henry Harrison', terms: '1841', vicePresidents: 'John Tyler', party: 'Whig', wiki: 'William_Henry_Harrison', highlights: ['Shortest presidency (31 days)', 'Died of illness after inauguration', '“Tippecanoe and Tyler Too”'] },
  { id: 'tyler', name: 'John Tyler', terms: '1841–1845', vicePresidents: 'None', party: 'Whig (expelled)', wiki: 'John_Tyler', highlights: ['First VP to succeed on a president’s death', 'Annexation of Texas advanced', 'Often at odds with Whig leaders'] },
  { id: 'polk', name: 'James K. Polk', terms: '1845–1849', vicePresidents: 'George M. Dallas', party: 'Democratic', wiki: 'James_K._Polk', highlights: ['Mexican–American War', 'Oregon boundary settlement', 'Achieved an ambitious one-term agenda'] },
  { id: 'taylor', name: 'Zachary Taylor', terms: '1849–1850', vicePresidents: 'Millard Fillmore', party: 'Whig', wiki: 'Zachary_Taylor', highlights: ['Mexican War hero (“Old Rough and Ready”)', 'Died in office after 16 months', 'Opposed some Compromise of 1850 terms'] },
  { id: 'fillmore', name: 'Millard Fillmore', terms: '1850–1853', vicePresidents: 'None', party: 'Whig', wiki: 'Millard_Fillmore', highlights: ['Signed the Compromise of 1850', 'Included the Fugitive Slave Act', 'Last Whig president'] },
  { id: 'pierce', name: 'Franklin Pierce', terms: '1853–1857', vicePresidents: 'William R. King', party: 'Democratic', wiki: 'Franklin_Pierce', highlights: ['Kansas–Nebraska Act turmoil', 'Gadsden Purchase', 'Deeply unpopular by term’s end'] },
  { id: 'buchanan', name: 'James Buchanan', terms: '1857–1861', vicePresidents: 'John C. Breckinridge', party: 'Democratic', wiki: 'James_Buchanan', highlights: ['President as secession crisis grew', 'Dred Scott decision era', 'Often ranked among least effective'] },
  { id: 'lincoln', name: 'Abraham Lincoln', terms: '1861–1865', vicePresidents: 'Hannibal Hamlin; Andrew Johnson', party: 'Republican', wiki: 'Abraham_Lincoln', highlights: ['Preserved the Union in the Civil War', 'Emancipation Proclamation', 'Assassinated by John Wilkes Booth'] },
  { id: 'johnson', name: 'Andrew Johnson', terms: '1865–1869', vicePresidents: 'None', party: 'National Union / Democratic', wiki: 'Andrew_Johnson', highlights: ['Succeeded Lincoln after assassination', 'First president impeached', 'Clashed with Radical Republicans'] },
  { id: 'grant', name: 'Ulysses S. Grant', terms: '1869–1877', vicePresidents: 'Schuyler Colfax; Henry Wilson', party: 'Republican', wiki: 'Ulysses_S._Grant', highlights: ['Union general in the Civil War', 'Enforced Reconstruction early on', 'Administration hit by scandals'] },
  { id: 'hayes', name: 'Rutherford B. Hayes', terms: '1877–1881', vicePresidents: 'William A. Wheeler', party: 'Republican', wiki: 'Rutherford_B._Hayes', highlights: ['Won after contested 1876 election', 'Ended Reconstruction', 'Civil service reform advocate'] },
  { id: 'garfield', name: 'James A. Garfield', terms: '1881', vicePresidents: 'Chester A. Arthur', party: 'Republican', wiki: 'James_A._Garfield', highlights: ['Assassinated months into office', 'Fought patronage appointments', 'Second president killed in office'] },
  { id: 'arthur', name: 'Chester A. Arthur', terms: '1881–1885', vicePresidents: 'None', party: 'Republican', wiki: 'Chester_A._Arthur', highlights: ['Signed the Pendleton Civil Service Act', 'Modernized the Navy', 'Surprised reformers by backing reform'] },
  { id: 'cleveland', name: 'Grover Cleveland', terms: '1885–1889; 1893–1897', vicePresidents: 'Thomas A. Hendricks; Adlai Stevenson I', party: 'Democratic', wiki: 'Grover_Cleveland', highlights: ['Only president with two non-consecutive terms (until Trump)', 'Vetoed many bills', 'Panic of 1893 in second term'] },
  { id: 'b-harrison', name: 'Benjamin Harrison', terms: '1889–1893', vicePresidents: 'Levi P. Morton', party: 'Republican', wiki: 'Benjamin_Harrison', highlights: ['Grandson of William Henry Harrison', 'Sherman Antitrust Act', 'McKinley Tariff era'] },
  { id: 'mckinley', name: 'William McKinley', terms: '1897–1901', vicePresidents: 'Garret Hobart; Theodore Roosevelt', party: 'Republican', wiki: 'William_McKinley', highlights: ['Spanish–American War', 'Assassinated in 1901', 'High protective tariffs'] },
  { id: 't-roosevelt', name: 'Theodore Roosevelt', terms: '1901–1909', vicePresidents: 'Charles W. Fairbanks', party: 'Republican', wiki: 'Theodore_Roosevelt', highlights: ['Youngest person to become president', 'Square Deal and trust-busting', 'Panama Canal diplomacy'] },
  { id: 'taft', name: 'William Howard Taft', terms: '1909–1913', vicePresidents: 'James S. Sherman', party: 'Republican', wiki: 'William_Howard_Taft', highlights: ['Later Chief Justice of the U.S.', 'Dollar Diplomacy', 'Heavier antitrust record than often remembered'] },
  { id: 'wilson', name: 'Woodrow Wilson', terms: '1913–1921', vicePresidents: 'Thomas R. Marshall', party: 'Democratic', wiki: 'Woodrow_Wilson', highlights: ['World War I leadership', 'Fourteen Points / League of Nations', 'Federal Reserve created (1913)'] },
  { id: 'harding', name: 'Warren G. Harding', terms: '1921–1923', vicePresidents: 'Calvin Coolidge', party: 'Republican', wiki: 'Warren_G._Harding', highlights: ['“Return to normalcy”', 'Teapot Dome scandal aftermath', 'Died in office in 1923'] },
  { id: 'coolidge', name: 'Calvin Coolidge', terms: '1923–1929', vicePresidents: 'Charles G. Dawes', party: 'Republican', wiki: 'Calvin_Coolidge', highlights: ['“Silent Cal”', 'Pro-business 1920s prosperity', 'Succeeded Harding after his death'] },
  { id: 'hoover', name: 'Herbert Hoover', terms: '1929–1933', vicePresidents: 'Charles Curtis', party: 'Republican', wiki: 'Herbert_Hoover', highlights: ['Stock market crash of 1929', 'Early Great Depression years', 'Former humanitarian and Commerce Secretary'] },
  { id: 'fdr', name: 'Franklin D. Roosevelt', terms: '1933–1945', vicePresidents: 'John Nance Garner; Henry A. Wallace; Harry S. Truman', party: 'Democratic', wiki: 'Franklin_D._Roosevelt', highlights: ['New Deal programs', 'World War II leadership', 'Only president elected four times'] },
  { id: 'truman', name: 'Harry S. Truman', terms: '1945–1953', vicePresidents: 'Alben W. Barkley', party: 'Democratic', wiki: 'Harry_S._Truman', highlights: ['Ordered atomic bombs on Japan', 'Marshall Plan and early Cold War', '“The buck stops here”'] },
  { id: 'eisenhower', name: 'Dwight D. Eisenhower', terms: '1953–1961', vicePresidents: 'Richard Nixon', party: 'Republican', wiki: 'Dwight_D._Eisenhower', highlights: ['Supreme Allied Commander in WWII', 'Interstate Highway System', 'Warned of the “military-industrial complex”'] },
  { id: 'kennedy', name: 'John F. Kennedy', terms: '1961–1963', vicePresidents: 'Lyndon B. Johnson', party: 'Democratic', wiki: 'John_F._Kennedy', highlights: ['Cuban Missile Crisis', 'Space race / Moon goal', 'Assassinated in Dallas'] },
  { id: 'lbj', name: 'Lyndon B. Johnson', terms: '1963–1969', vicePresidents: 'Hubert Humphrey', party: 'Democratic', wiki: 'Lyndon_B._Johnson', highlights: ['Great Society programs', 'Civil Rights Act of 1964', 'Vietnam War escalation'] },
  { id: 'nixon', name: 'Richard Nixon', terms: '1969–1974', vicePresidents: 'Spiro Agnew; Gerald Ford', party: 'Republican', wiki: 'Richard_Nixon', highlights: ['Opened relations with China', 'Watergate scandal', 'Only president to resign'] },
  { id: 'ford', name: 'Gerald Ford', terms: '1974–1977', vicePresidents: 'Nelson Rockefeller', party: 'Republican', wiki: 'Gerald_Ford', highlights: ['Only president never elected president or VP', 'Pardoned Nixon', 'Succeeded after Nixon’s resignation'] },
  { id: 'carter', name: 'Jimmy Carter', terms: '1977–1981', vicePresidents: 'Walter Mondale', party: 'Democratic', wiki: 'Jimmy_Carter', highlights: ['Camp David Accords', 'Iran hostage crisis', 'Later Nobel Peace Prize for post-presidency work'] },
  { id: 'reagan', name: 'Ronald Reagan', terms: '1981–1989', vicePresidents: 'George H. W. Bush', party: 'Republican', wiki: 'Ronald_Reagan', highlights: ['Conservative realignment of the 1980s', 'Survived an assassination attempt', 'Cold War endgame rhetoric'] },
  { id: 'hw-bush', name: 'George H. W. Bush', terms: '1989–1993', vicePresidents: 'Dan Quayle', party: 'Republican', wiki: 'George_H._W._Bush', highlights: ['Gulf War (1991)', 'Fall of the Soviet Union era', '“Read my lips” tax pledge fallout'] },
  { id: 'clinton', name: 'Bill Clinton', terms: '1993–2001', vicePresidents: 'Al Gore', party: 'Democratic', wiki: 'Bill_Clinton', highlights: ['1990s economic boom', 'Impeached over perjury/obstruction', 'NAFTA signed'] },
  { id: 'w-bush', name: 'George W. Bush', terms: '2001–2009', vicePresidents: 'Dick Cheney', party: 'Republican', wiki: 'George_W._Bush', highlights: ['September 11 attacks response', 'Wars in Afghanistan and Iraq', 'Son of George H. W. Bush'] },
  { id: 'obama', name: 'Barack Obama', terms: '2009–2017', vicePresidents: 'Joe Biden', party: 'Democratic', wiki: 'Barack_Obama', highlights: ['First African American president', 'Affordable Care Act', 'Osama bin Laden raid ordered'] },
  { id: 'trump', name: 'Donald Trump', terms: '2017–2021; 2025–', vicePresidents: 'Mike Pence; JD Vance', party: 'Republican', wiki: 'Donald_Trump', highlights: ['Businessman and TV personality before office', 'Two non-consecutive terms', 'Impeached twice in first term'] },
  { id: 'biden', name: 'Joe Biden', terms: '2021–2025', vicePresidents: 'Kamala Harris', party: 'Democratic', wiki: 'Joe_Biden', highlights: ['Longtime senator and Obama’s VP', 'Infrastructure and climate bills', 'Withdrew from 2024 reelection race'] },
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function enlarge(src) {
  // Wikimedia rejects some thumb widths (e.g. 640); 500 is widely available.
  return src.replace(/\/(\d+)px-/, '/500px-')
}

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
  return src ? enlarge(src) : null
}

const out = []
for (const p of presidents) {
  let image = null
  for (let attempt = 0; attempt < 5; attempt++) {
    image = await thumb(p.wiki)
    if (image) break
    await sleep(900 * (attempt + 1))
  }
  out.push({
    id: p.id,
    name: p.name,
    terms: p.terms,
    vicePresidents: p.vicePresidents,
    party: p.party,
    highlights: p.highlights,
    image: image || '',
  })
  console.log(p.id, image ? 'ok' : 'NO IMAGE')
  await sleep(400)
}

fs.writeFileSync('src/data/us-presidents.json', JSON.stringify(out, null, 2))
console.log(
  'wrote',
  out.length,
  'missing',
  out.filter((x) => !x.image).length,
)
