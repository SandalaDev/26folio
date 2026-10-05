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

export interface WishlistItem {
  name: string;
  /** Product shot under public/images/about/wishlist/. */
  image: string;
  /** Hover line: why the piece is on the wishlist, in the owner's voice.
   *  Audiophile and studio lines are the owner's final copy (2026-10-05,
   *  EPIC-027/TASK-121); watches and colognes carry his textcontent.md
   *  lines (2026-07-20). Remaining agent drafts are pending owner review
   *  (EPIC-018/TASK-070). */
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

/** Collections - the wishlist wing intro (owner copy, 2026-07-18; extended
 *  with the owner's ADHD and October 2026 wishlist-state sentences,
 *  2026-10-05). */
export const WISHLIST_INTRO =
  "These collections are a tour through the things I find interesting. I like products that solve problems well, look beautiful doing it, or represent exceptional engineering. Every item is here because I think there's something worth appreciating about it. One of the few positive symptoms of ADHD is having a mind that simply refuses to sit still, insisting on chasing every shiny interest it comes across; these are just a few of the ones that stuck, and trust me, there are others. This is the state of the wishlist as of October 2026. Some of these are serious future purchases, some are long-shot aspirations, and some are here simply because I want to know what it would be like to have them.";

/** The five wishlists, images from public/images/about/wishlist/. */
export const WISHLISTS: Wishlist[] = [
  {
    id: "audiophile",
    // Retitled and re-lined with the owner's final copy (2026-10-05,
    // EPIC-027/TASK-121): this is a wishlist, not an inventory.
    title: "Audiophile Gear Wishlist",
    description: [
      "I consider myself an aspiring audiophile. Here's the headphones, IEMs, DACs, amps and speakers that have caught my attention and I'd like to hear for myself. This collection changes constantly as I learn more and discover new gear.",
    ],
    items: [
      {
        name: "Sennheiser HD 800 S",
        image: "/images/about/wishlist/audiophile/Sennheiser HD 800 S.jpg",
        note: "I used to own the original HD 800, which these are based on. It was my reference point, and the HD 800 S is still the reference everything else will be measured against.",
      },
      {
        name: "Meze Arta",
        image: "/images/about/wishlist/audiophile/meze audio arta.webp",
        note: "The one I want as my flagship. I am probably more interested in the looks and build than I should be, but fortunately the reviews suggest the sound is worth having too.",
      },
      {
        name: "Sennheiser HDB 630",
        image: "/images/about/wishlist/audiophile/sennheiser hdb 630.webp",
        note: "Technically replaced by the LEWITT L6, but it stays on the list because this is the headphone I would actually travel with.",
      },
      {
        // Moved from the Studio Wishlist (owner brief, 2026-10-05); hover
        // line kept as-is per the brief.
        name: "Dan Clark Audio Noire X",
        image: "/images/about/wishlist/music-studio/Dan Clark Audio Noire X.webp",
        note: "Closed planar headphones for tracking without bleed.",
      },
      {
        name: "Status Pro X GoldenSound Edition",
        image: "/images/about/wishlist/audiophile/Status Pro X Goldensound Edition.png",
        note: "The most intriguing earbud release of the recent past. An already respected model tuned for audiophiles, and I am very curious to hear them.",
      },
      {
        name: "Lynx Hilo 2",
        image: "/images/about/wishlist/audiophile/LYNX-HILO2.jpg",
        note: "I have had the original Hilo for 14 years. It is the only surviving piece of my studio from 2012 that I could not bring myself to sell. Only when the Hilo 2 came along did I see an alternative I was interested in.",
      },
      {
        name: "Topping DX9",
        image: "/images/about/wishlist/audiophile/Topping DX9.jpg",
        note: "More headphone amp grunt and an alternative sound signature to the Hilo. There is a reason to have both.",
      },
      {
        name: "MOON 371",
        image: "/images/about/wishlist/audiophile/MOON 371.png",
        note: "The centrepiece of the dream 2.1 setup.",
      },
      {
        name: "Focal Sopra No.2",
        image: "/images/about/wishlist/audiophile/Focal Sopra No2.jpg",
        note: "The 2 of the dream 2.1 setup. These are the speakers I would build the system around.",
      },
      {
        name: "JL Audio Fathom F113v2",
        image: "/images/about/wishlist/audiophile/JL Audio Fathom F113v2.webp",
        note: "The .1 of the dream 2.1 setup. Cuz the windows won't shake themselves when I turn up Shook Ones Pt. II... check it out now",
      },
    ],
  },
  {
    id: "music-studio",
    // Retitled with the owner's introduction and hover lines (2026-10-05,
    // EPIC-027/TASK-121).
    title: "Studio Wishlist",
    description: [
      "I've wanted to make music since I knew what a producer was. Fear of being laughed at kept me from ever pursuing it seriously, although apparently it didn't stop me from building a $10k studio in 2012. I started with FruityLoops, gravitated toward Ableton Live once I discovered how the pros were working, and most of my setups since then have leaned heavily toward virtual instruments, samples and an unreasonable number of plugins. Lately I've been getting more interested in physical instruments, so this wishlist is my attempt to give that side of the obsession some room.",
    ],
    items: [
      {
        name: "Sequential Prophet-10",
        image: "/images/about/wishlist/music-studio/Sequential Prophet-10.jpg",
        note: "The synth I keep coming back to when I think about finally giving the hardware side of this obsession some room to breathe.",
      },
      {
        name: "Moog Muse",
        image: "/images/about/wishlist/music-studio/moog-muse.webp",
        note: "I have spent enough years making sounds inside a computer. This is one of the instruments making a very convincing argument for getting my hands dirty.",
      },
      {
        name: "UDO Super Gemini",
        image: "/images/about/wishlist/music-studio/udo-audio-super-gemini.webp",
        note: "Because apparently one enormous polyphonic synthesizer wasn't enough. I want the Super Gemini for the kind of sounds that make you forget you were supposed to be working on something else.",
      },
      {
        name: "Elektron Analog Rytm MKII",
        image: "/images/about/wishlist/music-studio/Elektron Analog Rytm MKII.webp",
        note: "The drum machine for when programming drums needs to become an entirely different kind of problem.",
      },
      {
        name: "Akai MPC X Special Edition",
        image: "/images/about/wishlist/music-studio/Akai MPC X Special Edition.webp",
        note: "Sampling has always been a big part of how I make things. The MPC is the hardware version of that rabbit hole.",
      },
      {
        name: "Ableton Push 3",
        image: "/images/about/wishlist/music-studio/Ableton Push 3.jpg",
        note: "Ableton is still home, and Push is probably the closest I can get to making the computer disappear while I am actually making music.",
      },
      {
        name: "Komplete Kontrol S88 MK3",
        image:
          "/images/about/wishlist/music-studio/native-instruments_komplete-kontrol-s88-mk3.jpg",
        note: "A proper keyboard for the ridiculous amount of virtual instruments I keep finding reasons to own.",
      },
      {
        name: "Neumann U 87 Ai",
        image: "/images/about/wishlist/music-studio/neumann U 87 ai.jpg",
        note: "The microphone that has been on the 'one day' list for far too long.",
      },
      {
        name: "Avalon VT-737sp",
        image: "/images/about/wishlist/music-studio/Avalon VT-737sp.jpg",
        note: "I wanted one of these badly enough in 2012 to know exactly why it is still on the list.",
      },
      {
        name: "Universal Audio Apollo x16 Gen 2",
        image: "/images/about/wishlist/music-studio/Universal Audio Apollo x16 Gen 2.webp",
        note: "The kind of interface you buy when the studio has stopped being a collection of toys and started demanding proper I/O.",
      },
      {
        name: "Apogee Symphony Studio",
        image: "/images/about/wishlist/music-studio/Apogee Symphony Studio.jpg",
        note: "Because apparently one very good interface is not enough when you start thinking about the studio you would build if you stopped pretending you were being sensible.",
      },
      {
        name: "Genelec 8351B",
        image: "/images/about/wishlist/music-studio/Genelec 8351B.jpg",
        note: "The main monitors for the studio I keep threatening to build.",
      },
      {
        name: "Genelec 7360A",
        image: "/images/about/wishlist/music-studio/Genelec 7360A.jpg",
        note: "The .1. Yes, I know where this is going.",
      },
      {
        name: "Sennheiser HD 490 PRO",
        image: "/images/about/wishlist/music-studio/SennheiserHD490.jpg",
        note: "The practical headphone choice for the studio. I want something I can actually put to work without treating it like a museum piece.",
      },
      {
        // Moved from the Audiophile Gear Wishlist (owner brief, 2026-10-05);
        // the image stays in the audiophile folder as supplied by the owner.
        name: "LEWITT L6",
        image: "/images/about/wishlist/audiophile/lewitt_lw6.jpg",
        note: "The closed-back I want for the studio. Mixing, tracking, late-night sessions, and generally keeping the rest of the world out.",
      },
      {
        name: "Ableton Live 12",
        image: "/images/about/wishlist/music-studio/ableton live 12.jpg",
        note: "Still my DAW. FruityLoops got me started, but Ableton is where I stayed.",
      },
      {
        name: "Komplete 15",
        image: "/images/about/wishlist/music-studio/Komplete-15.png",
        note: "I have had the Komplete ecosystem in my life for years. At this point it is less a software collection and more a permanent resident of the studio.",
      },
      {
        name: "Omnisphere 2",
        image: "/images/about/wishlist/music-studio/Omnisphere 2.jpg",
        note: "One of those instruments where you open it looking for one sound and three hours later you are still looking.",
      },
      {
        name: "FabFilter Total Bundle",
        image: "/images/about/wishlist/music-studio/FabFilter Total Bundle.webp",
        note: "The boring answer to the question of what plugins I actually want around when it is time to get serious.",
      },
      {
        name: "Valhalla DSP Bundle",
        image: "/images/about/wishlist/music-studio/Valhalla-dsp.webp",
        note: "Because apparently I still believe the correct amount of reverb is one more plugin.",
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
      "Let me get this out of the way: I'm not a horology buff. I know the basics of manual, automatic and quartz movements, and I can appreciate the engineering behind a tourbillon or Seiko's Spring Drive. But while I respect the craftsmanship, that's not what draws me to watches.",
      "What pulls me in is the same thing that pulls me toward a great pair of shoes or a well-built camera: the industrial design, the materials, the finishing, the proportions, the colours on the dial. A watch is a tiny object you wear every day, and every millimetre of it is the result of hundreds of design decisions. That's the part I find fascinating.",
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
        title: "Seveneves",
        cover: "/images/about/books/Seveneves- Neal Stephenson.jpg",
        author: "Neal Stephenson",
        review: [
          "If I hadn't read Ancillary Justice, this would be my favourite book of all time. The moon blows up in the first sentence, and what follows is spectacular, from the characters to the sheer scale and scope of the thing. This book moves so much and changes so much that it's more varied than some entire five-book series. You could divide it into six separate books and they would be so different from each other they'd belong to six different genres. And it does all of that before pulling off the most insane beat switch in the history of fiction, a Frank Ocean's Pyramids level pivot. I remember exactly where I was when I turned that page.",
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
 *  2026-07-21: intro, principles, inspiration, curiosity, creative
 *  pursuits, collections; music removed at the owner's direction
 *  2026-10-03). */
export const WAY_SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "principles", label: "Principles" },
  { id: "inspiration", label: "Inspiration" },
  { id: "curiosity", label: "Curiosity" },
  { id: "practice", label: "Creative Pursuits" },
  { id: "collections", label: "Collections" },
  { id: "build", label: "Let's Build" },
] as const;

export type WaySectionId = (typeof WAY_SECTIONS)[number]["id"];
