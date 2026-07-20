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
  {
    title: "Back to Black",
    artist: "Amy Winehouse",
    cover: "/images/about/albums/amy winehouse - back to black.jpg",
  },
  {
    title: "Let Go",
    artist: "Avril Lavigne",
    cover: "/images/about/albums/Avril Lavigne - Let Go.png",
  },
  {
    title: "Under My Skin",
    artist: "Avril Lavigne",
    cover: "/images/about/albums/Avril Lavigne - under my skin.jpg",
  },
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
  /** Intro paragraphs; watches and colognes carry the owner's multi-
   *  paragraph textcontent.md intros (2026-07-20). */
  description: string[];
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
    description: [
      "I consider myself an aspiring audiophile. Here's the headphones, IEMs, DACs, amps and speakers that have caught my attention and I'd like to hear for myself. This collection changes constantly as I learn more and discover new gear.",
    ],
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
        // Agent draft from the folder add (2026-07-20); owner to confirm.
        name: "Status Pro X GoldenSound Edition",
        image: "/images/about/wishlist/audiophile/Status Pro X Goldensound Edition.png",
        note: "In-ears tuned by GoldenSound, the reviewer whose measurements I already trust.",
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
    description: [
      "The studio is coming back, and when it does, it'll look something like this. Instruments, studio monitors, recording gear and everything else I'd need to bring the ideas trapped in my head to life.",
    ],
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
    description: [
      "The camera kit I'm building toward. I'll be launching a YouTube channel later this year, and even though I'll be starting with my phone, this is where I want the studio to end up.",
    ],
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
    // Intro + per-watch lines are the owner's textcontent.md copy
    // (2026-07-20), grammar-cleaned only. Farer, Kurono and the Club Sport
    // have no textcontent entry; their lines stay agent drafts.
    description: [
      "Let me get this out of the way: I'm not a horology guy. I know the basics of manual, automatic and quartz, and I can appreciate the absurd cleverness of a tourbillon or Seiko's Spring Drive. But at the end of the day it's a watch movement. It tells time. Who cares.",
      "What actually pulls me in is the same thing that pulls me toward a good pair of shoes or a well-built camera: the industrial design, the materials, the finishing, the colours on the dial. A watch is a tiny object you wear every day that somebody had to make a hundred design decisions about. That's the part I find interesting. So no, I won't be discussing calibres. These are here because of how they look, what they're made of, and in a couple of cases, what they mean to me.",
    ],
    items: [
      {
        name: "Grand Seiko Shunbun SBGA413",
        image: "/images/about/wishlist/watches/Grand Seiko Shunbun SBGA413.jpg",
        note: "If this watch didn't exist my halo watch would still be a Grand Seiko; their reputation speaks for itself. I've never touched one in the flesh, but they're the brand I admire the most, and they just happen to make the prettiest pink dial ever. I call it the vitiligo dial. I don't want it. I need it.",
      },
      {
        name: "Jaeger-LeCoultre Reverso",
        image: "/images/about/wishlist/watches/Jaeger-LeCoultre Reverso Classic Medium.webp",
        note: "Ninety-something years old and it still looks modern. The Reverso is Art Deco architecture shrunk to wrist size. The case flips, the lines are exact, and it has never needed a redesign. That's about the highest compliment a piece of industrial design can earn.",
      },
      {
        name: "Nomos Tangente 38",
        image: "/images/about/wishlist/watches/nomos-tangente-38.webp",
        note: "Looks simple. Isn't. The Tangente is what happens when every decision is made deliberately and then everything unnecessary gets deleted. Remove one element and the whole thing collapses. The kind of design I am jealous of.",
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
        note: "Ming looks like it was designed for a future that hasn't happened yet, like something straight out of a sci-fi movie. And yes, I love a night sky on a watch dial.",
      },
      {
        name: "Maen Manhattan Graffiti",
        image: "/images/about/wishlist/watches/Maen Manhattan Graffiti.avif",
        note: "If there was a Royal Oak designed by Jean-Michel Basquiat, it would look like this. Possibly the coolest watch here.",
      },
      {
        name: "Baltic MR01",
        image: "/images/about/wishlist/watches/Baltic MR01.jpg",
        note: "I've never seen one in the flesh; my admiration is strictly via YouTube. Thin case, textured dial, a beautifully proportioned little thing. The salmon dial MR01 is my dream dress watch.",
      },
      {
        name: "Farer Lander GMT",
        image: "/images/about/wishlist/watches/Farer Lander GMT.jpg",
        note: "British color confidence on a proper traveller's complication.",
      },
      {
        name: "Zelos Aventurine",
        image: "/images/about/wishlist/watches/Zelos Aventurine.webp",
        note: "One of the few on this list I've actually seen in the flesh, and photos do not prepare you. Aventurine looks like a night sky poured into a dial.",
      },
      {
        name: "Studio Underd0g Watermel0n",
        image: "/images/about/wishlist/watches/Studio Underd0g Watermel0n Chronograph.jpg",
        note: "It's a chronograph that looks like a watermelon under the most luscious domed sapphire crystal. The quirkiness of it is very me.",
      },
      {
        name: "Brew Metric",
        image: "/images/about/wishlist/watches/Brew Metric.jpg",
        note: "A sapphire and titanium watch designed around espresso timing, shaped like a retro stopwatch, with a dial that looks like that? Yes. The answer is yes.",
      },
      {
        name: "Hamilton Khaki King",
        image: "/images/about/wishlist/watches/hamilton khaki king.jpg",
        note: "The simplest entry on this list. It was House's watch. Gregory House is the most influential fictional character in my life, and the moment I found out this was the watch he wore, I knew I wanted one.",
      },
      {
        name: "Seagull 1963",
        image: "/images/about/wishlist/watches/seagull 1963.jpg",
        note: "It looks like something from 1920s China. It's so full of character. I have a feeling I will wear this one a lot when I get it.",
      },
      {
        name: "Casio G-Shock MRG-B5000",
        image: "/images/about/wishlist/watches/Casio G-Shock MRG-B5000.jpg",
        note: "The G-Shock is the default engineer's watch. Owning one is basically law. So I might as well get the one made of titanium, am I right?",
      },
      {
        name: "M.A.D.2 World Tour",
        image: "/images/about/wishlist/watches/M.A.D Editions World Tour.webp",
        note: "Less a watch, more kinetic sculpture you can wear. I'm a sucker for a blue dial, and this is one of the prettiest blues I've seen on any object, watch or otherwise. It looks like something the designer built because they had to get the idea out of their head, not because a market asked for it.",
      },
      {
        name: "TAG Heuer Monaco",
        image: "/images/about/wishlist/watches/tag heuer monaco.webp",
        note: "My favourite famous watch. Square case, blue dial, racing history. It has the vibe of something an F1 driver would wear.",
      },
    ],
  },
  {
    id: "colognes",
    title: "Fragrances",
    // Intro + per-bottle lines are the owner's textcontent.md copy
    // (2026-07-20): the "smells like" sketch, then why it's on the list.
    description: [
      "Fragrance is comfortably my oddest hobby. I have spent thousands of hours on fragrance YouTube learning about scents I have never actually smelled, which means most of this list is built on reputation, reviews, and pure curiosity. A few of these I owned and lost, and those are the ones that hurt. The rest are bottles the internet has spent years convincing me I need to experience for myself.",
    ],
    items: [
      {
        name: "Ambre Précieux",
        image: "/images/about/wishlist/cologne/ambre_preciuex.webp",
        note: "Smells like warm sweet resin and vanilla, sitting by a fire wrapped in a blanket. The most lauded amber fragrance of all time. I want to find out why.",
      },
      {
        name: "A*Men Pure Havane",
        image: "/images/about/wishlist/cologne/Amen Pure Havane.jpg",
        note: "Smells like honeyed pipe tobacco, vanilla, and a whisper of cocoa. Sweet smoke. My favourite of the discontinued Mugler A*Men line. I wanted this one so much that I still want it now, despite the eye-watering prices.",
      },
      {
        name: "Amouage Interlude Man 53",
        image: "/images/about/wishlist/cologne/Amouage Interlude 53.jpg",
        note: "Smells like smoke, incense, and spice with every dial turned to maximum. A beast mode fragrance that can drown out beast mode fragrances.",
      },
      {
        name: "Amouage Reflection Man",
        image: "/images/about/wishlist/cologne/Amouage Reflection Man.jpg",
        note: "Smells like soft white flowers and clean air, polished and unhurried. The ultimate classy gentleman daytime scent.",
      },
      {
        name: "BDK Parfums Tabac Rose",
        image: "/images/about/wishlist/cologne/BDK Parfums Tabac Rose.jpg",
        note: "Smells like a dark rose dipped in sweet tobacco. Argued to be the best tobacco rose scent in existence, so naturally I want to find out.",
      },
      {
        name: "Bvlgari Man in Black",
        image: "/images/about/wishlist/cologne/Bvlgari Man In Black.webp",
        note: "Smells like boozy rum, spice, and leather over sweet amber. So many fond memories from wearing this. I want it back.",
      },
      {
        name: "Chris Collins Oud Galore",
        image: "/images/about/wishlist/cologne/Chris Collins Oud Galore.jpg",
        note: "Smells like rich oud smoothed out with rum and sweetness. Described as a high-end oud that is beginner friendly, meaning the barnyard side ouds are famous for is dialed way back. A gentle on-ramp.",
      },
      {
        name: "Creed Absolu Aventus",
        image: "/images/about/wishlist/cologne/creed  Absolu Aventus.jpg",
        note: "Smells like the famous pineapple and smoke of Aventus, greener and more refined. Described as classy Aventus, so it's a must.",
      },
      {
        name: "Dior Fahrenheit 32",
        image: "/images/about/wishlist/cologne/dior fahrenheit 32.jpg",
        note: "Smells like creamy orange blossom and vanilla, bright and white and clean. My first signature scent. I briefly moved on from it, and when I tried to go back I found it was discontinued. Probably the most sentimental bottle on this list.",
      },
      {
        name: "Frédéric Malle Portrait of a Lady",
        image: "/images/about/wishlist/cologne/Frederic Malle Portrait Of A Lady.jpg",
        note: "Smells like an enormous dark rose surrounded by incense and berries. Based on the thousands of hours of my life I have happily wasted on fragrance YouTube, this is in the top three of every all-time list ever made.",
      },
      {
        name: "Frédéric Malle Musc Ravageur",
        image: "/images/about/wishlist/cologne/frederic-malle-musc-ravageur.jpg",
        note: "Smells like warm spiced vanilla and musk, a skin scent gone decadent. Same larger-than-life reputation as Portrait of a Lady. The Malle fragrances seem to occupy a tier above niche, judging by the universal praise from reviewers.",
      },
      {
        name: "Goldfield & Banks Bohemian Lime",
        image: "/images/about/wishlist/cologne/goldfield & banks bohemian lime.jpg",
        note: "Smells like bright Australian lime over warm woods. Sunshine, bottled. This is my favourite genre of fragrance: the warm weather niche scent. Honestly, this list could have been full of them, from Neroli Portofino to Afternoon Swim to Gentle Fluidity.",
      },
      {
        name: "Hermès Eau des Merveilles",
        image: "/images/about/wishlist/cologne/hermes-eau-des-merveilles.jpg",
        note: "Smells like salty skin and orange peel over something woody. Genuinely hard to describe. I tried a decant from a friend who was selling perfumes and this one stayed with me. I can't wait to own a bottle.",
      },
      {
        name: "Initio Oud for Greatness",
        image: "/images/about/wishlist/cologne/Initio Oud for Greatness.jpg",
        note: "Smells like oud wrapped in saffron and lavender, powerful but smooth. Universally lauded as one of the best ouds ever made, if not the best. I have never tried oud, but I'm curious, so why not start at the top.",
      },
      {
        name: "JPG Le Male Elixir",
        image: "/images/about/wishlist/cologne/Jean Paul Gaultier Le Male Elixir.jpg",
        note: "Smells like dense honey, lavender, tobacco, and vanilla. Described as a higher-end Ultra Male, and that alone is enough to get you on this list, because Ultra Male is one of the goats.",
      },
      {
        name: "JPG Ultra Male",
        image: "/images/about/wishlist/cologne/Jean Paul Gaultier Ultra Male.jpg",
        note: "Smells like sweet pear, vanilla, and cool lavender. A nightclub in a bottle. I like this one so much I would wear it for an all-nighter coding session, audience of zero. It needs to return, with backups.",
      },
      {
        name: "YSL La Nuit de L'Homme",
        image: "/images/about/wishlist/cologne/La Nuit de L'Homme.jpg",
        note: "Smells like soft cardamom and woods, quiet and seductive. One of the most hyped fragrances of the modern era. It has been on my list forever and I'm still curious.",
      },
      {
        name: "Lalique Encre Noire À L'Extrême",
        image: "/images/about/wishlist/cologne/Lalique Encre Noire A L'Extreme.jpg",
        note: "Smells like deep inky vetiver, a dark forest floor after sunset. Universally lauded as one of the most unique compositions ever to come from a designer house. Super curious about this one.",
      },
      {
        name: "Le Labo Baie 19",
        image: "/images/about/wishlist/cologne/Le Labo Baie 19.jpg",
        note: "Smells like petrichor. Juniper, cool air, and wet earth after rain. My favourite smell in nature is easily petrichor, and this is the only fragrance I know of that has seriously tried to recreate it. Top of my niche list.",
      },
      {
        name: "Le Labo Santal 33",
        image: "/images/about/wishlist/cologne/LE LABO Santal 33.jpg",
        note: "Smells like smoky sandalwood and leather. The famous one. The consensus is that this is understated sexy. So basically me, right?",
      },
      {
        name: "M. Micallef DesirToxic",
        image: "/images/about/wishlist/cologne/m. micallef desirtoxic.jpg",
        note: "Smells like sweet spice, cinnamon, blackcurrant, and an actual cannabis note. If I had a penny for every person online describing this as seductive, I would be ri... okay, I would have several dozen dollars. But the point stands: everyone says the exact same thing about it.",
      },
      {
        name: "Marc-Antoine Barrois Ganymede",
        image: "/images/about/wishlist/cologne/Marc-Antoine Barrois Ganymede.jpg",
        note: "Smells like minerals, metal, and suede. The future. Said to smell like tech. Sold.",
      },
      {
        name: "Narciso Rodriguez Bleu Noir",
        image: "/images/about/wishlist/cologne/Narciso Rodriguez Bleu Noir.jpg",
        note: "Smells like warm musk and blue cedar, fresh but cozy. A warm weather blue fragrance with a twist. Possible signature scent.",
      },
      {
        name: "Narciso Rodriguez for Him",
        image: "/images/about/wishlist/cologne/Narciso Rodriguez for Him.jpg",
        note: "Smells like powdery musk that people swear resembles cement. People describe it as smelling like cement and still love it anyway. Naturally, I'm curious.",
      },
      {
        name: "Nishane Hacivat",
        image: "/images/about/wishlist/cologne/Nishane Hacivat.jpg",
        note: "Smells like crisp pineapple over dry woods. Described as the Aventus upgrade. Enough said.",
      },
      {
        name: "Rasasi Hawas",
        image: "/images/about/wishlist/cologne/RASASI Hawas.jpg",
        note: "Smells like juicy melon and citrus over a warm amber base. A Middle Eastern take on the blue fragrance. Another one I have been meaning to try forever and I'm still curious.",
      },
      {
        name: "Roja Parfums Elysium",
        image: "/images/about/wishlist/cologne/Roja Parfums Elysium.jpg",
        note: "Smells like sparkling grapefruit and vetiver over ambergris. Luxurious freshness. Another one universally beloved in the community, always described the same way: simple but deep.",
      },
      {
        name: "Tous Man Sport",
        image: "/images/about/wishlist/cologne/TOUS MAN SPORT.jpg",
        note: "Smells like lemon, ginger, and apple over soft clean woods. A high quality cheapie and a blue fragrance. Another possible signature.",
      },
      {
        name: "Van Cleef & Arpels Midnight in Paris",
        image: "/images/about/wishlist/cologne/Van Cleef & Arpels Midnight in Paris.jpg",
        note: "Smells like dark sweet incense and smooth leather at night. So much hype around this one. The community has been screaming for it to be brought back for years, and I have to know why.",
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
  /** The owner's mini review, in paragraphs. Opens on click (TASK-073). */
  review: string[];
  /** Favourite quote, where the owner named one. \n splits verse lines. */
  quote?: { text: string; source?: string };
  /** Cover artwork under public/images/about/books/. */
  cover: string;
}

/** Sources of inspiration - the shelf intro (owner copy, 2026-07-20). */
export const BOOKSHELF_INTRO =
  "The books that have had the biggest impact on the way I think.";

/** The bookshelf. Reviews are the owner's textcontent.md copy
 *  (2026-07-20), grammar-cleaned per his embedded instructions (Basic
 *  Economics untouched beyond grammar; Thinking, Fast and Slow rebuilt
 *  from his supplied draft into his voice). Hyperion and Seveneves have
 *  covers but no owner copy; their reviews are agent drafts pending
 *  owner review. */
export const BOOKSHELF: { label: string; books: Book[] }[] = [
  {
    label: "Fiction",
    books: [
      {
        title: "Dune",
        cover: "/images/about/books/Dune - Frank Herbert.jpg",
        author: "Frank Herbert",
        review: [
          "I'm not the biggest fan of the sci-fi classics, but this one exceeded my expectations. Herbert balances world building on a galactic scale while still zooming into fully formed individual human characters, lovable and deplorable alike. I finished it feeling the genre owes this book a lot. Now I just have to read the other three before the next movie comes out; the last one blindsided me.",
        ],
      },
      {
        title: "The Virtues of War",
        cover: "/images/about/books/the-virtues-of-war.jpg",
        author: "Steven Pressfield",
        review: [
          "So, 2,300 years ago, a man and his army wanted to worship some deity at a temple on an island roughly a kilometre off the Mediterranean coast. The folks who ruled the island refused to let him in, for good reason: the man wanted to take over their kingdom with a religious gesture. When the man, who was only 24 at the time, was refused entry to the island city, he got rather upset and told its rulers, and I quote: \"You think nothing of this land army, because of your confidence in its position, living as you do on an island, but I am soon going to show you that you are really on the mainland.\" And the man proceeded to build a massive causeway across the Mediterranean while being shot at with arrows and burning ships. He reached the island, basically ignoring geography, sacked the city, and didn't seem terribly surprised that he'd done it. Alexander the Great is by far the historical figure who fascinates me the most.",
          "What stayed with me from this book is how belief, audacity and confidence shape what a person will attempt. It seems to me Alexander pulled off absurdity after absurdity because he had no doubt he would succeed; he believed his plan would work. At Gaugamela he couldn't sleep from the anxiety of being outnumbered more than two to one. Parmenion begged him to attack at night to give them a fighting chance, but my man famously responded with the eternal line \"I will not steal my victory.\" Once he figured out how he was going to attack the Persians he went from too anxious to sleep to sleeping in past sunrise, which is insane considering his men were so worried about a surprise night attack that they stood in formation through the night, armour clanking. It took his general shaking him awake. He woke up with a smile and said something to the effect of: aren't you glad we got Darius here, where we can finish this, instead of chasing him across Asia?",
          "What's even crazier about Alexander is that the confidence wasn't just in his strategy. He fought at the literal front line with his Companion cavalry, wearing ostentatious, unmistakable armour so he could command his men, which also made him the enemy's number one target. He got close enough to throw a spear at Darius himself. This book left me exploring what belief is and what it isn't. The simplest example I can give of what belief is: you won't walk in front of a moving bus, because you know what happens if it hits you. You panic when you miss a deadline at work, because you know what the consequences of losing a client are. Nobody debates what happens if you jump off a building. That kind of certainty, about realities so obvious nobody questions them, seems to be how Alexander believed in himself, and the results speak for themselves. Pressfield wrote the book channeling Alexander himself, which is what makes it fiction, but most of what he did is verified historical fact. He turned an island into a peninsula two millennia ago.",
        ],
        quote: { text: "I will not steal my victory." },
      },
      {
        title: "A Song of Ice and Fire",
        cover: "/images/about/books/a-song-of-ice-and-fire.jpg",
        author: "George R. R. Martin",
        review: [
          "Easily the best, densest, most detailed world building I've ever come across. He sets the story in an alternate reality on an earthlike planet with its own deeply detailed geography and a history stretching twelve thousand years. The story is also incredibly realistic: there are no good guys and bad guys, just people, some worse than others, none of them perfect. The consequences of mistakes and bad luck are brutal and often cruel, just like real life. Nothing reflects that better than the randomness of the deaths of characters he's built up to seem like mainstays of the story. All of it is backed by an absolutely bonkers story that's delivered some of the most shocking scenes in fiction while still being a slow burn, purely because of the sheer size and scale of the thing. The best work of fiction I've ever read, despite it being unfinished at the time of this writing.",
        ],
        quote: {
          text: "Money buys a man's silence for a time. A bolt in the heart buys it forever.",
          source: "Lord Baelish",
        },
      },
      {
        title: "Snow Crash",
        cover: "/images/about/books/Snow Crash - Neal Stephenson.jpg",
        author: "Neal Stephenson",
        review: [
          "My life is being badgered by sci-fi purists to read the classics like Asimov and Philip K. Dick, and when I do I'm usually disappointed. Hhhhaaaweeevah! (in a gruff British accent) Snow Crash is a different kettle of fish altogether. Snow Crash predicted VR and the metaverse in freakin' 1992. I can say with full confidence that every sci-fi novel written after it has been influenced by it. Once you read it you start to see it everywhere. I believe it's more influential than Dune.",
        ],
        quote: {
          text: "See, the world is full of things more powerful than us. But if you know how to catch a ride, you can go places.",
          source: "Raven",
        },
      },
      {
        title: "The Expanse",
        cover: "/images/about/books/the-expanse.jpg",
        author: "James S. A. Corey",
        review: [
          "Somewhere in deep space between Ceres Station and Tycho Station, the crew of the Rocinante, a Martian frigate, find themselves cornered by three fast Martian cruisers: the Pella, flagship of the Free Navy, the Koto and the Shinsakuto, all three larger, faster, more advanced and carrying more firepower than the Roci. These are not children's books. People die, and for all you know at the time, this might be the last book in the series. You're thinking: oh sh*t, the Roci's gonna get blown up or boarded. There are no miracles; the books are well grounded in reality. But not quite. I won't spoil the story, but what followed is one of the best space battle scenes ever. If I were to recommend a series to anybody who wants to try space opera, this would be it.",
        ],
        quote: {
          text: "If life transcends death\nThen I will seek for you there\nIf not, then there too",
          source: "Chrisjen Avasarala, Caliban's War",
        },
      },
      {
        title: "Old Man's War",
        cover: "/images/about/books/John Scalzi - Old Man's War.jpg",
        author: "John Scalzi",
        review: [
          "You turn seventy-five, you join the army, and you get a brand new body. Earth's elderly find out the other side isn't quite what they expected. Reads like an action movie, fast paced and action packed. I couldn't predict what was coming next, which is a rarity for me.",
        ],
      },
      {
        title: "Great North Road",
        cover: "/images/about/books/peter f hamilton great north road.jpg",
        author: "Peter F. Hamilton",
        review: [
          "Over a thousand pages about a murder where the victim is one clone out of a dynasty of clones, set in a rain-soaked future Newcastle with a gateway to an alien jungle world. It should collapse under its own weight. It doesn't. Another world I enjoyed escaping into; all of Hamilton's worlds are better than our reality without being utopias.",
        ],
      },
      {
        title: "Ancillary Justice",
        cover: "/images/about/books/ancillary-justice.jpg",
        author: "Ann Leckie",
        review: [
          "Narrated by a person who used to be the AI mind of a giant troop-carrier spaceship, connected to a thousand human clones (ancillaries) and the ship's systems and sensors, but who finds herself down to one body and no ship. And she wants revenge. A unique take on a possible future of humanity, so far ahead that Earth doesn't even come up. Ann Leckie manages to describe a galaxy-spanning empire through the lens of one uniquely likeable character who is neither human nor AI. This is my favorite work of fiction. I've read the trilogy a bunch of times and will probably do it again.",
        ],
        quote: { text: "The flower of justice is peace." },
      },
      {
        title: "The Long Way to a Small, Angry Planet",
        cover: "/images/about/books/the long way to a small angry planet.jpg",
        author: "Becky Chambers",
        review: [
          "Nothing really happens, and it's great. A crew of misfits tunnels wormholes through space, drinks tea, and cares about each other. It's people living ordinary lives in a multi-sentient-species future.",
        ],
      },
      {
        title: "A Canticle for Leibowitz",
        cover: "/images/about/books/a-canticle-for-leibowitz.jpg",
        author: "Walter M. Miller Jr.",
        review: [
          "The first great piece of fiction I ever read. It blindsided me, because I still don't think I like dystopian fiction.",
        ],
      },
      {
        // Agent draft from the cover add (2026-07-20); owner to confirm.
        title: "Hyperion",
        cover: "/images/about/books/hyperion dan simmons.jpg",
        author: "Dan Simmons",
        review: [
          "Seven pilgrims walk toward a creature that grants one wish and kills everyone else, and each tells the story of why they came. The Canterbury Tales structure has no business working in a space opera. It works.",
        ],
      },
      {
        // Agent draft from the cover add (2026-07-20); owner to confirm.
        title: "Seveneves",
        cover: "/images/about/books/Seveneves- Neal Stephenson.jpg",
        author: "Neal Stephenson",
        review: [
          "The moon breaks apart on page one and humanity gets two years to get off the planet. Stephenson would rather walk you through the orbital mechanics than skip to the drama, and I mean that as a compliment.",
        ],
      },
    ],
  },
  {
    label: "Non-fiction",
    books: [
      {
        title: "Steve Jobs",
        cover: "/images/about/books/steve-jobs.jpg",
        author: "Walter Isaacson",
        review: [
          "Steve Jobs is the original cult-of-personality CEO, the one every tech CEO you see on MSNBC is trying to imitate. (Yes, I've read the other famous, more recent Isaacson biography, and the Ashlee Vance one too.) He invented turning a company into a religious movement: it's not more than a job, it's a mission; it's not just a product, it's a cultural movement, mostly to exploit workers and launch viral ad campaigns before viral was a thing. Unlike his imitators, who mimic him to gain enough clout to sway a stock price with what they say, Steve had substance to him. He deeply cared about the products he oversaw, he had a craftsman's pride, and it's his principles that took a company started in his parents' garage to the multi-trillion-dollar behemoth it is today. The best example of his impact is what happened when he got pushed out of the company, and what happened when he came back, unlike some companies today which would benefit from their loud founders being replaced with someone competent.",
        ],
      },
      {
        title: "Atomic Habits",
        cover: "/images/about/books/atomic-habits.jpg",
        author: "James Clear",
        review: [
          "Systems over goals. You do not rise to the level of your ambitions; you fall to the level of your systems. Considering I literally build operating systems for businesses and for my own life, this book is basically my professional thesis in self-help form.",
        ],
      },
      {
        title: "The Almanack of Naval Ravikant",
        cover: "/images/about/books/the-almanack-of-naval-ravikant.jpg",
        author: "Eric Jorgenson",
        review: [
          "The operating manual for the path I'm on. Specific knowledge, leverage, productize yourself, seek wealth not money. As a solo builder, no book maps more directly onto my actual daily decisions than this one. It's full of practical, smart anecdotes, a lot of which I've subconsciously come to live by.",
        ],
      },
      {
        title: "Deep Work",
        cover: "/images/about/books/deep-work.jpg",
        author: "Cal Newport",
        review: [
          "For a self-taught developer with ADHD, relying on motivation to get to work is a trap. Deep Work shifts the burden from internal willpower to external structure. By scheduling exactly when, where and what you will work on, you remove the executive-dysfunction hurdle of choosing to start. The idea: Newport proves that focus isn't an innate personality trait you either have or lack, it's an environment you engineer.",
        ],
      },
      {
        title: "Flow",
        cover: "/images/about/books/flow.jpg",
        author: "Mihaly Csikszentmihalyi",
        review: [
          "The science behind the best state I know: when the work absorbs you so completely that time disappears. Flow explained why I build the way I build, and why the right level of challenge matters more than comfort.",
        ],
      },
      {
        title: "Basic Economics",
        cover: "/images/about/books/basic-economics.jpg",
        author: "Thomas Sowell",
        review: [
          "I came across Thomas Sowell on my random travels on YouTube. It was an upload of a TV interview/debate from the 80s, and Sowell just calmly and eloquently laid down the most savage intellectual smackdown I had ever seen, and him being black made me even more curious about him. Sowell is one of the smartest people I've ever come across and easily the best communicator. He is the kind of guy who, instead of saying \"I read a book about this,\" would say something like \"when I was researching the book I wrote about this, the data showed...\". The only time I saw him shook by an argument was when he and Milton Friedman debated three British economists, and one of the Brits forcefully put the question to them of whether or not the neoliberal economic model results in massive inequality. Sowell was smart enough to swerve it and quietly watched Milton intellectually contort himself into origami trying to respond. I enjoyed listening to the guy so much that I read his most famous book, which birthed my fascination with macroeconomics.",
          "The brilliant thing about Basic Economics is that it strips away the jargon and forces you to look at the world through the cold, unyielding lens of scarcity and incentives. Sowell defines economics not as money or finance, but as the allocation of scarce resources which have alternative uses. This shift fundamentally changes how you look at everything from pricing to time management. The book is a masterclass in separating good intentions from disastrous empirical results. Sowell systematically demonstrates how policies meant to help the vulnerable (like rent control or price ceilings) frequently backfire by destroying supply, introducing black markets, and hurting the exact people they were designed to protect.",
          "However, Sowell treats concepts like utility maximization and absolute free trade not as debatable policy choices, but as immutable laws of nature. It's a fascinating read, but it functions as a time capsule of an era before behavioral economics exposed the flaws of the \"rational consumer,\" and before even the IMF began quietly backing away from the collateral damage of unbridled anti-protectionism. I value the book as a masterclass in clean, baseline logic, even if the modern world has proven that reality refuses to be neatly contained by its pristine formulas.",
          "That said, I still believe this is one of the most important books ever written, and it should be mandatory reading for every person old enough to vote.",
        ],
      },
      {
        title: "Thinking, Fast and Slow",
        cover: "/images/about/books/Thinking, Fast and Slow.jpg",
        author: "Daniel Kahneman",
        review: [
          "The antidote to the myth of the rational human. Classical economics assumes we're perfectly optimizing agents; Kahneman spent a career proving we're not, documenting the hardwired glitches that actually run our brains, like the planning fallacy and loss aversion. As a self-taught developer working in unstructured environments, I treat this book as a diagnostic manual for my own mind. It taught me to notice when my lazy, instinctual System 1 is lying to me about a deadline or a technical solution, and to deliberately spin up the slow, expensive System 2 thinking that genuinely complex problems require.",
        ],
      },
      {
        title: "Capital in the Twenty-First Century",
        cover: "/images/about/books/capital-in-the-twenty-first-century.jpg",
        author: "Thomas Piketty",
        review: [
          "I didn't read it; I listened to the audiobook (I should read it, it's been 10 years) on long walks in my home town, while taking a break from a WordPress/Elementor web project for the singular worst client I've ever had the pleasure to work with. This book was pretty much my introduction to Karl Marx, and I especially enjoyed meeting Honoré de Balzac's characters. Not something I would ever read otherwise, but fun nonetheless.",
          "Capital in the Twenty-First Century is the ultimate empirical reality check to classical market theories. By laying out centuries of historical tax data, Piketty strips away the romantic ideology of the free market to reveal a brutal mathematical reality: r > g. When the return on existing capital consistently outpaces economic and wage growth, wealth naturally and inevitably concentrates at the top, regardless of individual merit or innovation. I value this book because it replaces clean, theoretical textbook assumptions with unyielding historical data, forcing you to look at modern capitalism not as a flawless meritocracy, but as a system structurally tilted toward dynastic wealth.",
        ],
      },
      {
        title: "The New Human Rights Movement",
        cover: "/images/about/books/the-new-human-rights-movement.jpg",
        author: "Peter Joseph",
        review: [
          "We have all come across people on social media claiming a book they read is a \"dangerous\" book, and as tacky and performative as I find that behavior to be... this here is my \"dangerous\" book.",
          "It's a radical, system-design critique that reframes our entire global economy as an obsolete operating system. While other frameworks look for ways to regulate or optimize market capitalism, Joseph uses a public-health lens to argue that the market mechanism itself is structurally violent, inherently generating scarcity, inequality and ecological collapse by rewarding consumption over sustainability. As someone who looks at the world through the lens of architecture and building functional systems, I appreciate this book's refusal to accept current economic constraints as permanent laws of nature. It forces you to stop looking for patches to a broken framework and start asking what a truly human-centric, scientifically optimized system would look like from the ground up.",
          "My only issue with this book is at the end, where the alternatives he proposes come across as thin and, to be honest, somewhat unrealistic. But the systemic issues laid out in this book have forever changed how I see the world.",
        ],
      },
      {
        title: "How to Speak Money",
        cover: "/images/about/books/how-to-speak-money.jpg",
        author: "John Lanchester",
        review: [
          "A brilliant linguistic deconstruction of the financial system. Lanchester argues that modern finance uses jargon not for clarity but as a deliberate barrier to entry, a cloaking device designed to make the economy feel too complex for the average person to question. As someone who values clean architecture and building accessible things, I appreciate how this book strips away the technical smoke and mirrors. The language of money is engineered to detach numbers from human consequences, and the most powerful systems are often protected not by superior logic but by confusing vocabulary.",
        ],
      },
      {
        title: "I Am Dynamite!",
        cover: "/images/about/books/I Am Dynamite A Life of Nietzsche - Sue Prideaux.jpg",
        author: "Sue Prideaux",
        review: [
          "The only, and I mean the only, good thing that came out of the pandemic was free time to disappear into a good book. Fun unrelated fact: I moved to Solwezi just before the pandemic and had to move towns again within days of the lockdown restrictions being lifted. This is the one that hit the hardest from an odd time.",
          "A masterclass in stripping away historical myth to reveal the human reality behind radical ideas. Prideaux rescues Nietzsche from both his posthumous hijackers and his cartoonish reputation, portraying a chronically ill, deeply isolated thinker whose philosophy of self-overcoming was forged through immense personal suffering. For anyone walking an untraditional path, building independent systems, self-teaching, questioning dominant frameworks, this book is a profound lesson in intellectual courage. Genuine substance isn't found in adopting ready-made ideologies, but in having the resilience to think critically, endure the friction of creation, and construct your own values from scratch.",
        ],
      },
      {
        title: "The Talent Code",
        cover: "/images/about/books/The Talent Code - Daniel Coyle.jpg",
        author: "Daniel Coyle",
        review: [
          "A biological deconstruction of human mastery that completely strips the mysticism away from the concept of \"talent.\" Coyle demonstrates that high-level skill isn't a genetic lottery; it's a physical product of myelin, a neural insulation that thickens only when we engage in deep practice at the absolute edge of our capabilities. For a self-taught engineer navigating unstructured environments, this book is a massive psychological unlock. It reframes the frustrating, high-friction moments of debugging a complex system or learning a dry theoretical concept not as a sign of failure, but as the exact mechanical trigger required to physically upgrade the brain's processing speed.",
        ],
      },
    ],
  },
];

/** Floating table of contents + section anchors, in walk order (owner,
 *  2026-07-20: music, creative pursuits, inspiration, collections). */
export const WAY_SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "curiosity", label: "Curiosity" },
  { id: "music", label: "Music" },
  { id: "practice", label: "Creative Pursuits" },
  { id: "inspiration", label: "Inspiration" },
  { id: "collections", label: "Collections" },
  { id: "principles", label: "Principles" },
  { id: "build", label: "Let's Build" },
] as const;

export type WaySectionId = (typeof WAY_SECTIONS)[number]["id"];
