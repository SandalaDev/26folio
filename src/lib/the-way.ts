/**
 * "The Way I Am" page content (EPIC-016/TASK-064). Transcribed from the
 * owner's blueprint (planning/content/page-copy/TheWay.md, 2026-07-15) and
 * de-slopped for the public surface. Single source for every section on
 * /about/the-way-i-am so copy edits never require touching layout code.
 */

export interface CuriosityRow {
  field: string;
  pull: string;
}

/** Curiosity - the knowledge table. Field + what keeps pulling him back. */
export const CURIOSITY: CuriosityRow[] = [
  {
    field: "Computer Systems",
    pull: "The deeper you go, the more beautiful they become. From transistors to distributed systems, it's abstraction all the way up.",
  },
  {
    field: "Electronics",
    pull: "We figured out how to manipulate invisible electrical signals into computers, satellites and smartphones. That's still insane to me.",
  },
  {
    field: "Mechanical Engineering",
    pull: "If you forced me to pick one engineering discipline outside software, this is it. Practical, elegant and useful almost everywhere.",
  },
  {
    field: "Electrical Engineering",
    pull: "Everything is electrical. Understanding that isn't optional.",
  },
  {
    field: "Materials Science",
    pull: "You can't build great things if you don't understand what they should be made of.",
  },
  {
    field: "Macroeconomics",
    pull: "The closest thing we have to an owner's manual for the modern world. Incentives explain far more than people realize.",
  },
  {
    field: "Psychology",
    pull: "Software is built for people. Understanding people is part of understanding software.",
  },
  {
    field: "Photography",
    pull: "Light is weird. Cameras are weird. Somehow all that physics turns into emotion. I love that.",
  },
  {
    field: "Woodworking & Metal Fabrication",
    pull: "There's a deep satisfaction in taking raw material and ending up with something useful that will outlive you.",
  },
  {
    field: "Automotive Engineering",
    pull: "The perfect intersection of engineering and emotion. Cars don't have to be loved, but somehow the good ones always are.",
  },
];

/** Creative pursuits - one flowing line of display words. */
export const PRACTICE = [
  "Logo Design",
  "Motion Graphics",
  "Photography",
  "Film & Video",
  "Music Production",
  "Writing",
  "Poetry",
] as const;

/** Music - the exhibit's opening line (owner copy, 2026-07-18). */
export const MUSIC_INTRO =
  "The biggest impact music streaming apps have had on me is exposing the massive delta between what I would tell you if you asked me what kind of music I like and what I actually listen to. I've recently had to make peace with the reality that I might have the taste of a 12-year-old American white girl. Alas, it is what it is. Look around and see if you agree.";

/** The 10s - kiosk intro paragraphs (owner copy, 2026-07-18). */
export const TENS_INTRO = [
  "I don't just listen to music; I am constantly imagining what I would change if I had made it. The timbre of the bass is wrong, that note should have been a whole step higher, there are too many holes in the flow, the rap should have a tighter subdivision, and my favorite is hating on drum breaks, which are almost always wrong except, of course, on Black Sabbath's Iron Man.",
  "This playlist is just songs that I enjoy. No notes.",
] as const;

/** Desert-island albums - wall intro paragraphs (owner copy, 2026-07-18). */
export const ALBUMS_INTRO = [
  "I'm not much of an album person in the traditional sense. I don't spend much time decoding themes or trying to figure out what an artist was really trying to say. Half the time, I can't even hear the lyrics unless they are particularly clever or funny.",
  "For me, a great album is much simpler than that: if I like almost every song on it, it's a great album.",
] as const;

export interface Album {
  title: string;
  artist: string;
  /** Sleeve artwork under public/images/about/albums/. */
  cover: string;
}

/** Desert-island albums. The artwork folder is the list (owner,
 *  2026-07-17): every cover in public/images/about/albums/ gets a tile,
 *  and nothing renders without one. */
export const ALBUMS = [
  {
    title: "A Rush of Blood to the Head",
    artist: "Coldplay",
    cover: "/images/about/albums/coldplay-a-rush-of-blood-to-the-head.jpg",
  },
  {
    title: "Viva la Vida",
    artist: "Coldplay",
    cover: "/images/about/albums/coldplay-viva-la-vida.png",
  },
  { title: "X&Y", artist: "Coldplay", cover: "/images/about/albums/coldplay-x-y.jpg" },
  {
    title: "Come Away With Me",
    artist: "Norah Jones",
    cover: "/images/about/albums/norah-jones-come-away-with-me.jpg",
  },
  {
    title: "The Fall",
    artist: "Norah Jones",
    cover: "/images/about/albums/norah-jones-the-fall.jpg",
  },
  {
    title: "Feels Like Home",
    artist: "Norah Jones",
    cover: "/images/about/albums/norah-jones-feels-like-home.jpg",
  },
  {
    title: "Not Too Late",
    artist: "Norah Jones",
    cover: "/images/about/albums/Norah Jones- Not too Late.jpg",
  },
  {
    title: "Little Broken Hearts",
    artist: "Norah Jones",
    cover: "/images/about/albums/norah jones- little broken hearts.jpg",
  },
  {
    title: "Day Breaks",
    artist: "Norah Jones",
    cover: "/images/about/albums/Norah Jones- Day Breaks.jpg",
  },
  {
    title: "Begin Again",
    artist: "Norah Jones",
    cover: "/images/about/albums/Norah-Jones-Begin-Again.webp",
  },
  {
    title: "OK Computer",
    artist: "Radiohead",
    cover: "/images/about/albums/radiohead-ok-computer.jpg",
  },
  { title: "Kid A", artist: "Radiohead", cover: "/images/about/albums/radiohead-kid-a.jpg" },
  {
    title: "In Rainbows",
    artist: "Radiohead",
    cover: "/images/about/albums/radiohead-in-rainbows.jpg",
  },
  { title: "Daytona", artist: "Pusha T", cover: "/images/about/albums/pusha-t-daytona.jpg" },
  {
    title: "If You're Reading This It's Too Late",
    artist: "Drake",
    cover: "/images/about/albums/drake-if-you-re-reading-this-it-s-too-late.jpg",
  },
  { title: "4:44", artist: "Jay-Z", cover: "/images/about/albums/jay-z-4-44.jpg" },
  {
    title: "The Blueprint",
    artist: "Jay-Z",
    cover: "/images/about/albums/jay-z-the-blueprint.jpg",
  },
  {
    title: "The Black Album",
    artist: "Jay-Z",
    cover: "/images/about/albums/jay-z-the-black-album.jpg",
  },
  {
    title: "Watch the Throne",
    artist: "Jay-Z & Kanye West",
    cover: "/images/about/albums/watch-the-throne.jpg",
  },
  {
    title: "Ultraviolence",
    artist: "Lana Del Rey",
    cover: "/images/about/albums/lana-del-rey-ultraviolence.jpg",
  },
  {
    title: "Norman Fucking Rockwell!",
    artist: "Lana Del Rey",
    cover: "/images/about/albums/lana-del-rey-norman-fucking-rockwell.jpg",
  },
  {
    title: "Born To Die",
    artist: "Lana Del Rey",
    cover: "/images/about/albums/lana-del-rey-born-to-die.jpg",
  },
  {
    title: "Chemtrails Over the Country Club",
    artist: "Lana Del Rey",
    cover: "/images/about/albums/lana-del-rey-chemtrails-over-the-country-club.jpg",
  },
  {
    title: "Blue Banisters",
    artist: "Lana Del Rey",
    cover: "/images/about/albums/lana-del-rey-blue-banisters.jpg",
  },
  { title: "brat", artist: "Charli xcx", cover: "/images/about/albums/charli-xcx-brat.jpg" },
  {
    title: "How I'm Feeling Now",
    artist: "Charli xcx",
    cover: "/images/about/albums/charli-xcx-how-i-m-feeling-now.jpg",
  },
  { title: "Charli", artist: "Charli xcx", cover: "/images/about/albums/charli-xcx-charli.jpg" },
  { title: "Motomami", artist: "Rosalía", cover: "/images/about/albums/rosalia-motomami.jpg" },
  { title: "ANTI", artist: "Rihanna", cover: "/images/about/albums/rihanna-anti.jpg" },
  {
    title: "Dirty Computer",
    artist: "Janelle Monáe",
    cover: "/images/about/albums/janelle-monae-dirty-computer.jpg",
  },
  {
    title: "RTJ3",
    artist: "Run The Jewels",
    cover: "/images/about/albums/run-the-jewels-rtj3.jpg",
  },
  {
    title: "The Biggie Duets",
    artist: "The Notorious B.I.G.",
    cover: "/images/about/albums/the-notorious-b-i-g-the-biggie-duets.jpg",
  },
  {
    title: "Happier Than Ever",
    artist: "Billie Eilish",
    cover: "/images/about/albums/billie-eilish-happier-than-ever.jpg",
  },
  { title: "The WIZRD", artist: "Future", cover: "/images/about/albums/future-the-wizrd.jpg" },
  { title: "Details", artist: "Frou Frou", cover: "/images/about/albums/frou-frou-details.jpg" },
  {
    title: "Graduation",
    artist: "Kanye West",
    cover: "/images/about/albums/kanye-west-graduation.jpg",
  },
  {
    title: "808s & Heartbreak",
    artist: "Kanye West",
    cover: "/images/about/albums/kanye-west-808s-heartbreak.jpg",
  },
  {
    title: "The College Dropout",
    artist: "Kanye West",
    cover: "/images/about/albums/kanye-west-the-college-dropout.jpg",
  },
  {
    title: "Late Registration",
    artist: "Kanye West",
    cover: "/images/about/albums/kanye-west-late-registration.jpg",
  },
  { title: "Yeezus", artist: "Kanye West", cover: "/images/about/albums/kanye-west-yeezus.jpg" },
  {
    title: "My Beautiful Dark Twisted Fantasy",
    artist: "Kanye West",
    cover: "/images/about/albums/kanye-west-my-beautiful-dark-twisted-fantasy.jpg",
  },
  { title: "I'm Not Dead", artist: "P!nk", cover: "/images/about/albums/p-nk-i-m-not-dead.jpg" },
  { title: "Funhouse", artist: "P!nk", cover: "/images/about/albums/p-nk-funhouse.jpg" },
  {
    title: "The Money Store",
    artist: "Death Grips",
    cover: "/images/about/albums/death grips - the money store.jpg",
  },
  { title: "Fallen", artist: "Evanescence", cover: "/images/about/albums/evanescence-fallen.webp" },
  { title: "Blonde", artist: "Frank Ocean", cover: "/images/about/albums/frank ocean blonde.jpg" },
  {
    title: "Father, Son, Holy Ghost",
    artist: "Girls",
    cover: "/images/about/albums/girls-father son holy ghost.jpg",
  },
  {
    title: "Drastic Fantastic",
    artist: "KT Tunstall",
    cover: "/images/about/albums/kt tunstall - drastic fantastic.jpg",
  },
  {
    title: "The Miseducation of Lauryn Hill",
    artist: "Lauryn Hill",
    cover: "/images/about/albums/lauryn hill - the miseducation of lauryn hill.jpg",
  },
  { title: "Melodrama", artist: "Lorde", cover: "/images/about/albums/lorde melodrama.jpg" },
  {
    title: "Punisher",
    artist: "Phoebe Bridgers",
    cover: "/images/about/albums/phoebe bridgers - punisher.jpg",
  },
  {
    title: "11:11",
    artist: "Regina Spektor",
    cover: "/images/about/albums/regina spektor - 11-11.jpg",
  },
  {
    title: "Far",
    artist: "Regina Spektor",
    cover: "/images/about/albums/regina spektor - far.jpg",
  },
  {
    title: "What We Saw from the Cheap Seats",
    artist: "Regina Spektor",
    cover: "/images/about/albums/regina spektor - what we saw from the cheap seats.jpg",
  },
  {
    title: "Royal Blood",
    artist: "Royal Blood",
    cover: "/images/about/albums/royal blood-royal blood.jpg",
  },
  {
    title: "Prioritise Pleasure",
    artist: "Self Esteem",
    cover: "/images/about/albums/self esteem - prioritise pleasure.jpg",
  },
  {
    title: "Titanic Rising",
    artist: "Weyes Blood",
    cover: "/images/about/albums/WeyesBlood_TitanicRising.webp",
  },
  {
    title: "Fever to Tell",
    artist: "Yeah Yeah Yeahs",
    cover: "/images/about/albums/yeah yeah yeahs - fever to tell.png",
  },
] satisfies Album[];

/** The wall's opening row, in the owner's exact order (2026-07-18). */
const WALL_FAVORITES = [
  "Not Too Late",
  "If You're Reading This It's Too Late",
  "What We Saw from the Cheap Seats",
  "Dirty Computer",
  "In Rainbows",
  "Blue Banisters",
  "4:44",
  "Charli",
];

/** One sleeve for each multi-album artist the favorites don't already
 *  cover, in descending order of how many albums they hold on the wall
 *  (Kanye 6, Coldplay 3, P!nk 2). Owner delegated these picks. */
const WALL_ARTIST_PICKS = [
  "My Beautiful Dark Twisted Fantasy",
  "A Rush of Blood to the Head",
  "Funhouse",
];

/** Wall order (owner, 2026-07-18): favorites first in their given order,
 *  then a pick per remaining multi-album artist by representation, then
 *  the rest dealt greedily: always the artist with the most sleeves left,
 *  never repeating the previous tile's artist. Heavily represented artists
 *  surface early and keep resurfacing without ever clustering. */
function buildWall(albums: Album[]): Album[] {
  const byTitle = new Map(albums.map((album) => [album.title, album]));
  const wall: Album[] = [];
  for (const title of [...WALL_FAVORITES, ...WALL_ARTIST_PICKS]) {
    const album = byTitle.get(title);
    if (album) wall.push(album);
  }

  const used = new Set(wall.map((album) => album.title));
  const remaining = new Map<string, Album[]>();
  for (const album of albums) {
    if (used.has(album.title)) continue;
    const list = remaining.get(album.artist) ?? [];
    list.push(album);
    remaining.set(album.artist, list);
  }

  while (remaining.size > 0) {
    const previous = wall[wall.length - 1]?.artist;
    let pick = "";
    for (const [artist, list] of remaining) {
      if (artist === previous && remaining.size > 1) continue;
      if (!pick || list.length > (remaining.get(pick)?.length ?? 0)) pick = artist;
    }
    const list = remaining.get(pick)!;
    wall.push(list.shift()!);
    if (list.length === 0) remaining.delete(pick);
  }
  return wall;
}

/** The album wall in display order. ALBUMS above stays grouped by artist so
 *  the data is maintainable; the wall renders this ordering instead. */
export const ALBUM_WALL: Album[] = buildWall(ALBUMS);

export interface WishlistItem {
  name: string;
  /** Product shot under public/images/about/wishlist/. */
  image: string;
  /** Hover line. Gear: what the piece is for. Watches: why he likes it.
   *  Colognes: why he wants it. Personal-voice lines are agent drafts
   *  pending owner review (EPIC-018/TASK-070). */
  note: string;
}

export interface Wishlist {
  id: string;
  title: string;
  description: string;
  items: WishlistItem[];
}

/** Collections - the wishlist wing intro (owner copy, 2026-07-18). */
export const WISHLIST_INTRO =
  "These collections are a tour through the things I find interesting. I like products that solve problems well, look beautiful doing it, or represent exceptional engineering. Every item is here because I think there's something worth appreciating about it.";

/** The five wishlists, images from public/images/about/wishlist/. */
export const WISHLISTS: Wishlist[] = [
  {
    id: "audiophile",
    title: "Audiophile gear",
    description:
      "I consider myself an aspiring audiophile. Here's the headphones, IEMs, DACs, amps and speakers that have caught my attention and I'd like to hear for myself. This collection changes constantly as I learn more and discover new gear.",
    items: [
      {
        name: "Sennheiser HD 800 S",
        image: "/images/about/wishlist/audiophile/Sennheiser HD 800 S.jpg",
        note: "The reference open-back. Soundstage first, everything else second.",
      },
      {
        name: "Focal Clear MG",
        image: "/images/about/wishlist/audiophile/Focal Clear MG.jpg",
        note: "Open-back headphones for relaxed, full-bodied home listening.",
      },
      {
        name: "Sennheiser HDB 630",
        image: "/images/about/wishlist/audiophile/sennheiser hdb 630.webp",
        note: "Closed wireless headphones that keep audiophile tuning on the go.",
      },
      {
        name: "64 Audio U4s",
        image: "/images/about/wishlist/audiophile/64 Audio U4s.webp",
        note: "Hybrid in-ears for detailed listening away from the desk.",
      },
      {
        name: "Thieaudio Hype 4",
        image: "/images/about/wishlist/audiophile/Thieaudio Hype 4.jpg",
        note: "In-ears with big dynamic-driver bass for the gym bag.",
      },
      {
        name: "RME ADI-2 DAC FS",
        image: "/images/about/wishlist/audiophile/RME ADI-2 DAC FS.webp",
        note: "Reference DAC and headphone amp for the desk.",
      },
      {
        name: "Topping DX9",
        image: "/images/about/wishlist/audiophile/Topping DX9.jpg",
        note: "A full DAC-amp stack in one box for the second setup.",
      },
      {
        name: "Eversolo DMP-A6",
        image: "/images/about/wishlist/audiophile/Eversolo DMP-A6.jpg",
        note: "Network streamer to front the whole digital chain.",
      },
      {
        name: "MOON 371",
        image: "/images/about/wishlist/audiophile/MOON 371.png",
        note: "Integrated amplifier with the current to drive real speakers.",
      },
      {
        name: "KEF R7 Meta",
        image: "/images/about/wishlist/audiophile/KEF R7 Meta.webp",
        note: "Floorstanders for the main living-room system.",
      },
      {
        name: "KEF KC92",
        image: "/images/about/wishlist/audiophile/KEF KC92.webp",
        note: "Compact dual-driver sub to fill in the bottom octave.",
      },
      {
        name: "SteelSeries Arctis Nova Elite",
        image: "/images/about/wishlist/audiophile/SteelSeries Nova Elite.jpg",
        note: "A gaming headset that doesn't insult the rest of the chain.",
      },
    ],
  },
  {
    id: "music-studio",
    title: "Dream home music studio",
    description:
      "The studio is coming back, and when it does, it'll look something like this. Instruments, studio monitors, recording gear and everything else I'd need to bring the ideas trapped in my head to life.",
    items: [
      {
        name: "Sequential Prophet-10",
        image: "/images/about/wishlist/music-studio/Sequential Prophet-10.jpg",
        note: "The classic analog poly. Pads and keys that arrive finished.",
      },
      {
        name: "Moog Muse",
        image: "/images/about/wishlist/music-studio/moog-muse.webp",
        note: "Eight Moog voices for basses and leads with real weight.",
      },
      {
        name: "UDO Super Gemini",
        image: "/images/about/wishlist/music-studio/udo-audio-super-gemini.webp",
        note: "Hybrid poly for the wide, strange textures nothing else makes.",
      },
      {
        name: "Elektron Analog Rytm MKII",
        image: "/images/about/wishlist/music-studio/Elektron Analog Rytm MKII.webp",
        note: "Analog drum machine, for drums that don't come from a sample pack.",
      },
      {
        name: "Akai MPC X Special Edition",
        image: "/images/about/wishlist/music-studio/Akai MPC X Special Edition.webp",
        note: "The standalone sampler for chopping and sequencing off-screen.",
      },
      {
        name: "Ableton Push 3",
        image: "/images/about/wishlist/music-studio/Ableton Push 3.jpg",
        note: "Standalone Ableton surface. Sketch beats without opening the laptop.",
      },
      {
        name: "Komplete Kontrol S88 MK3",
        image:
          "/images/about/wishlist/music-studio/native-instruments_komplete-kontrol-s88-mk3.jpg",
        note: "Weighted 88 keys for playing parts in, not programming them.",
      },
      {
        name: "Neumann U 87 Ai",
        image: "/images/about/wishlist/music-studio/neumann U 87 ai.jpg",
        note: "The vocal mic. Fifty years of records were cut on this capsule.",
      },
      {
        name: "Avalon VT-737sp",
        image: "/images/about/wishlist/music-studio/Avalon VT-737sp.jpg",
        note: "Tube channel strip between the mic and the converter: preamp, EQ and compression on the way in.",
      },
      {
        name: "Universal Audio Apollo x16 Gen 2",
        image: "/images/about/wishlist/music-studio/Universal Audio Apollo x16 Gen 2.webp",
        note: "Sixteen channels of conversion so the whole room patches in at once.",
      },
      {
        name: "Apogee Symphony Studio",
        image: "/images/about/wishlist/music-studio/Apogee Symphony Studio.jpg",
        note: "Conversion and monitor control at the mix position.",
      },
      {
        name: "Genelec 8351B",
        image: "/images/about/wishlist/music-studio/Genelec 8351B.jpg",
        note: "Coaxial mains with room correction. Monitoring that tells the truth.",
      },
      {
        name: "Genelec 7360A",
        image: "/images/about/wishlist/music-studio/Genelec 7360A.jpg",
        note: "The sub that extends that truth below 40 Hz.",
      },
      {
        name: "Sennheiser HD 490 PRO",
        image: "/images/about/wishlist/music-studio/SennheiserHD490.jpg",
        note: "Open reference headphones for late-night mix checks.",
      },
      {
        name: "Dan Clark Audio Noire X",
        image: "/images/about/wishlist/music-studio/Dan Clark Audio Noire X.webp",
        note: "Closed planar headphones for tracking without bleed.",
      },
      {
        name: "Ableton Live 12",
        image: "/images/about/wishlist/music-studio/ableton live 12.jpg",
        note: "The DAW. Every track starts and ends in a Live set.",
      },
      {
        name: "Komplete 15",
        image: "/images/about/wishlist/music-studio/Komplete-15.png",
        note: "The Native Instruments library: pianos, drums and a decade of sounds in one install.",
      },
      {
        name: "Omnisphere 2",
        image: "/images/about/wishlist/music-studio/Omnisphere 2.jpg",
        note: "The deep software synth, for pads and textures no hardware makes.",
      },
      {
        name: "FabFilter Total Bundle",
        image: "/images/about/wishlist/music-studio/FabFilter Total Bundle.webp",
        note: "The mixing plugins: surgical EQ, compression and limiting with interfaces that teach you.",
      },
      {
        name: "Valhalla DSP bundle",
        image: "/images/about/wishlist/music-studio/Valhalla-dsp.webp",
        note: "The reverbs and delays behind half of modern ambient. Fifty dollars each, absurdly.",
      },
    ],
  },
  {
    id: "video-studio",
    title: "Video studio",
    description:
      "The camera kit I'm building toward. I'll be launching a YouTube channel later this year, and even though I'll be starting with my phone, this is where I want the studio to end up.",
    items: [
      {
        name: "Panasonic Lumix S1 II",
        image: "/images/about/wishlist/video-studio/panasonic-lumix-s1-ii.jpg",
        note: "The full-frame body the whole list is built around.",
      },
      {
        name: "Sigma 14-24mm f/2.8 DG DN",
        image: "/images/about/wishlist/video-studio/sigma-14-24mm-f2-8-dg-dn.jpg",
        note: "Ultra-wide zoom for architecture and cramped rooms.",
      },
      {
        name: "Sigma 24-70mm f/2.8 DG DN II",
        image: "/images/about/wishlist/video-studio/sigma-24-70mm-f2-8-dg-dn-ii.png",
        note: "The standard zoom that lives on the camera.",
      },
      {
        name: "Panasonic Lumix 70-200mm f/2.8",
        image: "/images/about/wishlist/video-studio/panasonic-lumix-70-200mm-f2-8.jpg",
        note: "The telephoto end: compressed interviews and detail work.",
      },
      {
        name: "Sigma 35mm f/1.2 DG DN II",
        image: "/images/about/wishlist/video-studio/sigma-35mm-f1-2-dg-dn-ii.jpg",
        note: "Fast prime for the wide-open cinematic look.",
      },
      {
        name: "Sigma 50mm f/1.2 DG DN",
        image: "/images/about/wishlist/video-studio/sigma-50mm-f1-2-dg-dn.jpg",
        note: "The normal prime for shallow, honest portraits.",
      },
      {
        name: "Sigma 85mm f/1.4 DG DN",
        image: "/images/about/wishlist/video-studio/sigma-85mm-f1-4-dg-dn.jpg",
        note: "Portrait prime for faces against melted backgrounds.",
      },
      {
        name: "Aputure LS 600c Pro II",
        image: "/images/about/wishlist/video-studio/aputure-ls-600c-pro-ii.jpg",
        note: "Full-color key light with real punch through a softbox.",
      },
      {
        name: "Aputure Storm 1200x",
        image: "/images/about/wishlist/video-studio/aputure-storm-1200x.jpg",
        note: "The bi-color workhorse for lighting rooms, not just faces.",
      },
      {
        name: "Atomos Ninja Ultra",
        image: "/images/about/wishlist/video-studio/atomos-ninja-ultra.jpg",
        note: "On-camera monitor-recorder for ProRes RAW and honest exposure.",
      },
      {
        name: "Hollyland Pyro S",
        image: "/images/about/wishlist/video-studio/hollyland-pyro-s.jpg",
        note: "Wireless video so gimbal and crane shots can be watched live.",
      },
      {
        name: "DJI RS 4 Pro",
        image: "/images/about/wishlist/video-studio/dji-rs-4-pro.png",
        note: "Gimbal rated for a fully rigged full-frame camera.",
      },
      {
        name: "DJI Air 3S",
        image: "/images/about/wishlist/video-studio/dji-air-3s.jpg",
        note: "The drone for establishing shots.",
      },
      {
        name: "RODE Wireless PRO",
        image: "/images/about/wishlist/video-studio/rode-wireless-pro.png",
        note: "Wireless lavs with onboard backup recording.",
      },
      {
        name: "Sennheiser MKH 416",
        image: "/images/about/wishlist/video-studio/sennheiser-mkh-416.jpg",
        note: "The industry shotgun for dialogue and voice-over.",
      },
      {
        name: "Manfrotto 645 FAST Twin",
        image: "/images/about/wishlist/video-studio/manfrotto-645-fast-twin.jpg",
        note: "Video legs that go up and down fast between setups.",
      },
      {
        name: "Manfrotto Nitrotech 612",
        image: "/images/about/wishlist/video-studio/manfrotto-nitrotech-612-fluid-head.jpg",
        note: "Fluid head for smooth pans with a loaded camera.",
      },
      {
        name: "Peak Design Travel Tripod",
        image: "/images/about/wishlist/video-studio/peak-design-travel-tripod-carbon.jpg",
        note: "Carbon tripod for the days everything gets carried.",
      },
      {
        name: "Shimoda Action X70",
        image: "/images/about/wishlist/video-studio/shimoda-action-x70.jpg",
        note: "The bag that hauls the whole kit.",
      },
    ],
  },
  {
    id: "watches",
    title: "Watch wishlist",
    description:
      "I'm not a horology buff. I know the difference between quartz, automatic and manual movements, but the internal mechanics aren't where my interest lies. What draws me to a watch is its industrial design, choice of materials, proportions, brand, aesthetics, and the way the dial, case and bracelet come together.",
    items: [
      {
        name: "Grand Seiko Shunbun SBGA413",
        image: "/images/about/wishlist/watches/Grand Seiko Shunbun SBGA413.jpg",
        note: "Spring Drive's perfect sweep under a dial that catches cherry-blossom season. Nobody does dials like Grand Seiko.",
      },
      {
        name: "Jaeger-LeCoultre Reverso",
        image: "/images/about/wishlist/watches/Jaeger-LeCoultre Reverso Classic Medium.webp",
        note: "Art deco solved a polo problem a century ago and accidentally produced the most elegant case shape ever made.",
      },
      {
        name: "Nomos Tangente 38",
        image: "/images/about/wishlist/watches/nomos-tangente-38.webp",
        note: "The cleanest dial in watchmaking. Nothing to add, nothing to take away.",
      },
      {
        name: "Nomos Club Sport Neomatik",
        image: "/images/about/wishlist/watches/nomos-club-sport-neomatik.jpg",
        note: "Bauhaus discipline that can still take a swim.",
      },
      {
        name: "Kurono Tokyo Anniversary Green",
        image: "/images/about/wishlist/watches/Kurono Tokyo Anniversary Green.jpg",
        note: "Hajime Asaoka's design language at a price mortals can reach. That green dial glows.",
      },
      {
        name: "Ming 37.08",
        image: "/images/about/wishlist/watches/Ming 37.08.avif",
        note: "An independent that looks like nothing else on a wrist. The lume alone earns the spot.",
      },
      {
        name: "Baltic MR01",
        image: "/images/about/wishlist/watches/Baltic MR01.jpg",
        note: "A micro-rotor dress watch at a price that shouldn't be possible, and the sector dial is gorgeous.",
      },
      {
        name: "Farer Lander GMT",
        image: "/images/about/wishlist/watches/Farer Lander GMT.jpg",
        note: "British color confidence on a proper traveller's complication.",
      },
      {
        name: "Zelos Aventurine",
        image: "/images/about/wishlist/watches/Zelos Aventurine.webp",
        note: "A night sky sealed in a case, from a microbrand that punches way up.",
      },
      {
        name: "Studio Underd0g Watermel0n",
        image: "/images/about/wishlist/watches/Studio Underd0g Watermel0n Chronograph.jpg",
        note: "A watermelon chronograph. It makes people smile, which most watches forgot how to do.",
      },
      {
        name: "Brew Metric",
        image: "/images/about/wishlist/watches/Brew Metric.jpg",
        note: "A chronograph scaled around espresso extraction times. Watchmaking with a sense of humor and great proportions.",
      },
      {
        name: "Hamilton Khaki King",
        image: "/images/about/wishlist/watches/hamilton khaki king.jpg",
        note: "A field watch that just works, day-date and all. The one I'd never baby.",
      },
      {
        name: "Casio G-Shock MRG-B5000",
        image: "/images/about/wishlist/watches/Casio G-Shock MRG-B5000.jpg",
        note: "The G-Shock idea executed in titanium at its absolute ceiling. Indestructible and jewelry at the same time.",
      },
      {
        name: "M.A.D.2 World Tour",
        image: "/images/about/wishlist/watches/M.A.D Editions World Tour.webp",
        note: "Max Busser making high watchmaking playful at a price real people can chase. Spinning discs instead of hands, and the ice-blue dial grins at you.",
      },
      {
        name: "TAG Heuer Monaco",
        image: "/images/about/wishlist/watches/tag heuer monaco.webp",
        note: "The square case that made motorsport chic. McQueen wore it in 1971 and nothing else has looked like it since.",
      },
    ],
  },
  {
    id: "colognes",
    title: "Colognes",
    description:
      "Part nostalgia, part curiosity. Some are fragrances I've owned and want to wear again. Others are bottles I'm simply curious enough to experience at least once.",
    items: [
      {
        name: "YSL La Nuit de L'Homme",
        image: "/images/about/wishlist/cologne/La Nuit de L'Homme.jpg",
        note: "The 2010s date-night legend. Pure nostalgia.",
      },
      {
        name: "TOUS MAN SPORT",
        image: "/images/about/wishlist/cologne/TOUS MAN SPORT.jpg",
        note: "A bottle from years I'd like to revisit.",
      },
      {
        name: "JPG Le Male Elixir",
        image: "/images/about/wishlist/cologne/Jean Paul Gaultier Le Male Elixir.jpg",
        note: "Le Male grown up: honeyed, smoky, huge.",
      },
      {
        name: "Narciso Rodriguez for Him",
        image: "/images/about/wishlist/cologne/Narciso Rodriguez for Him.jpg",
        note: "The reference masculine musc, still at a mall price.",
      },
      {
        name: "Narciso Rodriguez Bleu Noir",
        image: "/images/about/wishlist/cologne/Narciso Rodriguez Bleu Noir.jpg",
        note: "Blue musk that reportedly outclasses every other designer blue.",
      },
      {
        name: "RASASI Hawas",
        image: "/images/about/wishlist/cologne/RASASI Hawas.jpg",
        note: "The aquatic that made everyone rethink budget houses. Summer staple candidate.",
      },
      {
        name: "Van Cleef & Arpels Midnight in Paris",
        image: "/images/about/wishlist/cologne/Van Cleef & Arpels Midnight in Paris.jpg",
        note: "Discontinued leather-incense. The one that got away.",
      },
      {
        name: "Dior Fahrenheit 32",
        image: "/images/about/wishlist/cologne/dior fahrenheit 32.jpg",
        note: "The strange white-flower flip of a classic, discontinued, which only makes it worse.",
      },
      {
        name: "Thierry Mugler A*Men Pure Havane",
        image: "/images/about/wishlist/cologne/Amen Pure Havane.jpg",
        note: "Honeyed tobacco most people call the best of the A*Men line.",
      },
      {
        name: "Frederic Malle Portrait of a Lady",
        image: "/images/about/wishlist/cologne/Frederic Malle Portrait Of A Lady.jpg",
        note: "The modern rose benchmark. Every list ends up here eventually.",
      },
      {
        name: "Frederic Malle Musc Ravageur",
        image: "/images/about/wishlist/cologne/frederic-malle-musc-ravageur.jpg",
        note: "The infamous musc. I want to see what the fuss is about.",
      },
      {
        name: "Marc-Antoine Barrois Ganymede",
        image: "/images/about/wishlist/cologne/Marc-Antoine Barrois Ganymede.jpg",
        note: "Mineral suede that half the internet calls the most futuristic scent of the decade.",
      },
      {
        name: "Nishane Hacivat",
        image: "/images/about/wishlist/cologne/Nishane Hacivat.jpg",
        note: "The pineapple that dethroned Aventus for a lot of people.",
      },
      {
        name: "Creed Absolu Aventus",
        image: "/images/about/wishlist/cologne/creed  Absolu Aventus.jpg",
        note: "Aventus with the volume and the materials turned up. Curiosity demands it.",
      },
      {
        name: "Initio Oud for Greatness",
        image: "/images/about/wishlist/cologne/Initio Oud for Greatness.jpg",
        note: "The club oud of the 2020s. Due diligence.",
      },
      {
        name: "Chris Collins Oud Galore",
        image: "/images/about/wishlist/cologne/Chris Collins Oud Galore.jpg",
        note: "An oud built like a velvet room.",
      },
      {
        name: "Amouage Interlude 53",
        image: "/images/about/wishlist/cologne/Amouage Interlude 53.jpg",
        note: "Interlude Man's smoke turned to eleven. I want to experience the chaos once.",
      },
      {
        name: "Amouage Reflection Man",
        image: "/images/about/wishlist/cologne/Amouage Reflection Man.jpg",
        note: "The polished one in the Amouage lineup. Effortless white florals.",
      },
      {
        name: "Roja Parfums Elysium",
        image: "/images/about/wishlist/cologne/Roja Parfums Elysium.jpg",
        note: "Citrus luxury with zero restraint on materials.",
      },
      {
        name: "Ambre Precieux",
        image: "/images/about/wishlist/cologne/ambre_preciuex.webp",
        note: "The reference amber. I want to know what the benchmark smells like.",
      },
      {
        name: "BDK Parfums Tabac Rose",
        image: "/images/about/wishlist/cologne/BDK Parfums Tabac Rose.jpg",
        note: "Rose and tobacco reads like a contradiction I need to smell.",
      },
      {
        name: "M. Micallef DesirToxic",
        image: "/images/about/wishlist/cologne/m. micallef desirtoxic.jpg",
        note: "Overripe fruit over dark woods, by all accounts unsubtle in the best way.",
      },
      {
        name: "Lalique Encre Noire A L'Extreme",
        image: "/images/about/wishlist/cologne/Lalique Encre Noire A L'Extreme.jpg",
        note: "Ink-dark vetiver, deeper cut.",
      },
      {
        name: "Le Labo Santal 33",
        image: "/images/about/wishlist/cologne/LE LABO Santal 33.jpg",
        note: "Yes, everyone wears it. I still want to understand why.",
      },
      {
        name: "Le Labo Baie 19",
        image: "/images/about/wishlist/cologne/Le Labo Baie 19.jpg",
        note: "Rain on hot pavement in a bottle, allegedly.",
      },
      {
        name: "Goldfield & Banks Bohemian Lime",
        image: "/images/about/wishlist/cologne/goldfield & banks bohemian lime.jpg",
        note: "Australian lime that supposedly smells like a holiday.",
      },
      {
        name: "Hermes Eau des Merveilles",
        image: "/images/about/wishlist/cologne/hermes-eau-des-merveilles.jpg",
        note: "Salty amber and orange, like skin after a beach day.",
      },
    ],
  },
];

export interface Principle {
  title: string;
  body: string;
}

/** Principles - each one carries its own editorial card. */
export const PRINCIPLES: Principle[] = [
  {
    title: "Curiosity Compounds",
    body: "Every new thing I learn makes something I already know more useful. The connections aren't obvious at first, but they show up eventually.",
  },
  {
    title: "Learn Systems, Not Recipes",
    body: "I don't like memorizing steps without understanding why they work. Once I understand the system, learning the tools becomes much easier.",
  },
  {
    title: "Fundamentals Age Slowly",
    body: "Tools come and go. Fundamentals stick around.",
  },
  {
    title: "Everything Teaches Something",
    body: "I don't separate my interests into useful and useless. Photography, economics, engineering and music all influence how I think and how I build software.",
  },
  {
    title: "Good Design Removes Effort",
    body: "The best design isn't the one that gets noticed. It's the one that makes things feel obvious.",
  },
  {
    title: "Complexity Should Be Earned",
    body: "If something is complicated there should be a very good reason for it.",
  },
  {
    title: "Ownership Matters",
    body: "People should own the software they depend on.",
  },
  {
    title: "Build For The Long Term",
    body: "I'd rather build something that still makes sense ten years from now than something impressive for five minutes.",
  },
  {
    title: "Taste Is A Skill",
    body: "Knowing what to leave out is just as important as knowing what to put in.",
  },
  {
    title: "Truth Is The Best Default",
    body: "If I don't know something I'd rather say I don't know than pretend I do.",
  },
  {
    title: "Fairness",
    body: "If I wouldn't accept it being done to me, I shouldn't do it to anyone else.",
  },
  {
    title: "Sleep Well",
    body: "Conscience and intuition exist for a reason. I'd rather lose and sleep well than win and have to justify something I knew wasn't right.",
  },
];

export interface Book {
  title: string;
  author: string;
  takeaway: string;
  /** Cover artwork under public/images/about/books/. */
  cover: string;
}

/** Sources of inspiration - the bookshelf. Takeaways only, no reviews. */
export const BOOKSHELF: { label: string; books: Book[] }[] = [
  {
    label: "Non-fiction",
    books: [
      {
        title: "How to Speak Money",
        cover: "/images/about/books/how-to-speak-money.jpg",
        author: "John Lanchester",
        takeaway:
          "Language is often the gatekeeper to a field. Learning the language of finance opened a new way of understanding the economy.",
      },
      {
        title: "Capital in the Twenty-First Century",
        cover: "/images/about/books/capital-in-the-twenty-first-century.jpg",
        author: "Thomas Piketty",
        takeaway: "Capital and labour create wealth in fundamentally different ways.",
      },
      {
        title: "Basic Economics",
        cover: "/images/about/books/basic-economics.jpg",
        author: "Thomas Sowell",
        takeaway: "Prices are signals. There are no solutions, only trade-offs.",
      },
      {
        title: "The New Human Rights Movement",
        cover: "/images/about/books/the-new-human-rights-movement.jpg",
        author: "Peter Joseph",
        takeaway:
          "A compelling argument that our economic system should be judged by how well it serves people.",
      },
      {
        title: "Flow",
        cover: "/images/about/books/flow.jpg",
        author: "Mihaly Csikszentmihalyi",
        takeaway: "Happiness isn't found. It's engineered.",
      },
      {
        title: "Atomic Habits",
        cover: "/images/about/books/atomic-habits.jpg",
        author: "James Clear",
        takeaway: "Life outcomes are habits compounded over time.",
      },
      {
        title: "Deep Work",
        cover: "/images/about/books/deep-work.jpg",
        author: "Cal Newport",
        takeaway: "Deep focus keeps getting rarer, and more valuable.",
      },
      {
        title: "Steve Jobs",
        cover: "/images/about/books/steve-jobs.jpg",
        author: "Walter Isaacson",
        takeaway:
          "Love him or hate him, Steve Jobs was the OG cult-of-personality tech CEO. Every Silicon Valley founder since has tried to copy the act. The difference is Steve wasn't acting. He was about that life. Today we get kabuki theatre on podcasts, conference stages and Twitter.",
      },
      {
        title: "The Almanack of Naval Ravikant",
        cover: "/images/about/books/the-almanack-of-naval-ravikant.jpg",
        author: "Eric Jorgenson",
        takeaway:
          "Happiness isn't a reward waiting at the finish line. You either know how to be happy now or you'll find a reason not to be happy later too.",
      },
      {
        title: "The Virtues of War",
        cover: "/images/about/books/the-virtues-of-war.jpg",
        author: "Steven Pressfield",
        takeaway:
          "When it's time to think, think. When it's time to decide, decide. But once it's go time... it's go time, baby.",
      },
    ],
  },
  {
    label: "Fiction",
    books: [
      {
        title: "A Canticle for Leibowitz",
        cover: "/images/about/books/a-canticle-for-leibowitz.jpg",
        author: "Walter M. Miller Jr.",
        takeaway:
          "The first great piece of fiction I ever read. It blindsided me, because I still don't think I like dystopian fiction.",
      },
      {
        title: "The Expanse",
        cover: "/images/about/books/the-expanse.jpg",
        author: "James S. A. Corey",
        takeaway:
          "I practically lived in this universe. Audiobooks during 1,200 km road trips. Kindle until I couldn't keep my eyes open. I've never been sadder finishing a series.",
      },
      {
        title: "A Song of Ice and Fire",
        cover: "/images/about/books/a-song-of-ice-and-fire.jpg",
        author: "George R. R. Martin",
        takeaway:
          "I only picked these up because of the TV show. Thank God I did. George's world-building is on another level. Despite the attention these books get, I still think they're underrated.",
      },
      {
        title: "Ancillary Justice",
        cover: "/images/about/books/ancillary-justice.jpg",
        author: "Ann Leckie",
        takeaway:
          "My favorite work of fiction. I've read it almost every year and still can't explain why I love it.",
      },
    ],
  },
];

/** Floating table of contents + section anchors, in walk order. */
export const WAY_SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "curiosity", label: "Curiosity" },
  { id: "music", label: "Music" },
  { id: "practice", label: "Creative Pursuits" },
  { id: "collections", label: "Collections" },
  { id: "principles", label: "Principles" },
  { id: "inspiration", label: "Inspiration" },
  { id: "build", label: "Let's Build" },
] as const;

export type WaySectionId = (typeof WAY_SECTIONS)[number]["id"];
