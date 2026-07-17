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

export interface Album {
  title: string;
  artist: string;
  /** Sleeve artwork under public/images/about/albums/. */
  cover: string;
}

/** Music - the chips and the wall. */
export const MUSIC = {
  artists: [
    "Coldplay",
    "Radiohead",
    "Lana Del Rey",
    "Norah Jones",
    "Kanye West",
    "Jay-Z",
    "Pusha T",
    "Drake",
    "Charli xcx",
    "Rosalía",
    "Billie Eilish",
    "Future",
    "Frou Frou",
    "Janelle Monáe",
    "Run The Jewels",
    "P!nk",
    "The Notorious B.I.G.",
  ],
  /** Desert-island albums. The artwork folder is the list (owner,
   *  2026-07-17): every cover in public/images/about/albums/ gets a tile,
   *  and nothing renders without one. */
  albums: [
    { title: "A Rush of Blood to the Head", artist: "Coldplay", cover: "/images/about/albums/coldplay-a-rush-of-blood-to-the-head.jpg" },
    { title: "Viva la Vida", artist: "Coldplay", cover: "/images/about/albums/coldplay-viva-la-vida.png" },
    { title: "X&Y", artist: "Coldplay", cover: "/images/about/albums/coldplay-x-y.jpg" },
    { title: "Come Away With Me", artist: "Norah Jones", cover: "/images/about/albums/norah-jones-come-away-with-me.jpg" },
    { title: "The Fall", artist: "Norah Jones", cover: "/images/about/albums/norah-jones-the-fall.jpg" },
    { title: "Feels Like Home", artist: "Norah Jones", cover: "/images/about/albums/norah-jones-feels-like-home.jpg" },
    { title: "OK Computer", artist: "Radiohead", cover: "/images/about/albums/radiohead-ok-computer.jpg" },
    { title: "Kid A", artist: "Radiohead", cover: "/images/about/albums/radiohead-kid-a.jpg" },
    { title: "In Rainbows", artist: "Radiohead", cover: "/images/about/albums/radiohead-in-rainbows.jpg" },
    { title: "Daytona", artist: "Pusha T", cover: "/images/about/albums/pusha-t-daytona.jpg" },
    { title: "If You're Reading This It's Too Late", artist: "Drake", cover: "/images/about/albums/drake-if-you-re-reading-this-it-s-too-late.jpg" },
    { title: "4:44", artist: "Jay-Z", cover: "/images/about/albums/jay-z-4-44.jpg" },
    { title: "The Blueprint", artist: "Jay-Z", cover: "/images/about/albums/jay-z-the-blueprint.jpg" },
    { title: "The Black Album", artist: "Jay-Z", cover: "/images/about/albums/jay-z-the-black-album.jpg" },
    { title: "Ultraviolence", artist: "Lana Del Rey", cover: "/images/about/albums/lana-del-rey-ultraviolence.jpg" },
    { title: "Norman Fucking Rockwell!", artist: "Lana Del Rey", cover: "/images/about/albums/lana-del-rey-norman-fucking-rockwell.jpg" },
    { title: "Born To Die", artist: "Lana Del Rey", cover: "/images/about/albums/lana-del-rey-born-to-die.jpg" },
    { title: "Chemtrails Over the Country Club", artist: "Lana Del Rey", cover: "/images/about/albums/lana-del-rey-chemtrails-over-the-country-club.jpg" },
    { title: "Blue Banisters", artist: "Lana Del Rey", cover: "/images/about/albums/lana-del-rey-blue-banisters.jpg" },
    { title: "brat", artist: "Charli xcx", cover: "/images/about/albums/charli-xcx-brat.jpg" },
    { title: "How I'm Feeling Now", artist: "Charli xcx", cover: "/images/about/albums/charli-xcx-how-i-m-feeling-now.jpg" },
    { title: "Charli", artist: "Charli xcx", cover: "/images/about/albums/charli-xcx-charli.jpg" },
    { title: "Motomami", artist: "Rosalía", cover: "/images/about/albums/rosalia-motomami.jpg" },
    { title: "ANTI", artist: "Rihanna", cover: "/images/about/albums/rihanna-anti.jpg" },
    { title: "Dirty Computer", artist: "Janelle Monáe", cover: "/images/about/albums/janelle-monae-dirty-computer.jpg" },
    { title: "RTJ3", artist: "Run The Jewels", cover: "/images/about/albums/run-the-jewels-rtj3.jpg" },
    { title: "The Biggie Duets", artist: "The Notorious B.I.G.", cover: "/images/about/albums/the-notorious-b-i-g-the-biggie-duets.jpg" },
    { title: "Happier Than Ever", artist: "Billie Eilish", cover: "/images/about/albums/billie-eilish-happier-than-ever.jpg" },
    { title: "The WIZRD", artist: "Future", cover: "/images/about/albums/future-the-wizrd.jpg" },
    { title: "Details", artist: "Frou Frou", cover: "/images/about/albums/frou-frou-details.jpg" },
    { title: "Graduation", artist: "Kanye West", cover: "/images/about/albums/kanye-west-graduation.jpg" },
    { title: "808s & Heartbreak", artist: "Kanye West", cover: "/images/about/albums/kanye-west-808s-heartbreak.jpg" },
    { title: "The College Dropout", artist: "Kanye West", cover: "/images/about/albums/kanye-west-the-college-dropout.jpg" },
    { title: "Late Registration", artist: "Kanye West", cover: "/images/about/albums/kanye-west-late-registration.jpg" },
    { title: "Yeezus", artist: "Kanye West", cover: "/images/about/albums/kanye-west-yeezus.jpg" },
    { title: "My Beautiful Dark Twisted Fantasy", artist: "Kanye West", cover: "/images/about/albums/kanye-west-my-beautiful-dark-twisted-fantasy.jpg" },
    { title: "I'm Not Dead", artist: "P!nk", cover: "/images/about/albums/p-nk-i-m-not-dead.jpg" },
    { title: "Funhouse", artist: "P!nk", cover: "/images/about/albums/p-nk-funhouse.jpg" },
    { title: "The Money Store", artist: "Death Grips", cover: "/images/about/albums/death grips - the money store.jpg" },
    { title: "Fallen", artist: "Evanescence", cover: "/images/about/albums/evanescence-fallen.webp" },
    { title: "Blonde", artist: "Frank Ocean", cover: "/images/about/albums/frank ocean blonde.jpg" },
    { title: "Father, Son, Holy Ghost", artist: "Girls", cover: "/images/about/albums/girls-father son holy ghost.jpg" },
    { title: "Drastic Fantastic", artist: "KT Tunstall", cover: "/images/about/albums/kt tunstall - drastic fantastic.jpg" },
    { title: "The Miseducation of Lauryn Hill", artist: "Lauryn Hill", cover: "/images/about/albums/lauryn hill - the miseducation of lauryn hill.jpg" },
    { title: "Melodrama", artist: "Lorde", cover: "/images/about/albums/lorde melodrama.jpg" },
    { title: "Punisher", artist: "Phoebe Bridgers", cover: "/images/about/albums/phoebe bridgers - punisher.jpg" },
    { title: "11:11", artist: "Regina Spektor", cover: "/images/about/albums/regina spektor - 11-11.jpg" },
    { title: "Far", artist: "Regina Spektor", cover: "/images/about/albums/regina spektor - far.jpg" },
    { title: "What We Saw from the Cheap Seats", artist: "Regina Spektor", cover: "/images/about/albums/regina spektor - what we saw from the cheap seats.jpg" },
    { title: "Royal Blood", artist: "Royal Blood", cover: "/images/about/albums/royal blood-royal blood.jpg" },
    { title: "Prioritise Pleasure", artist: "Self Esteem", cover: "/images/about/albums/self esteem - prioritise pleasure.jpg" },
    { title: "Titanic Rising", artist: "Weyes Blood", cover: "/images/about/albums/WeyesBlood_TitanicRising.webp" },
    { title: "Fever to Tell", artist: "Yeah Yeah Yeahs", cover: "/images/about/albums/yeah yeah yeahs - fever to tell.png" },
  ] satisfies Album[],
};

/** Collections - display shelves, not lists. */
export const COLLECTIONS = {
  audiophile: ["Headphones", "DACs", "Amplifiers", "Microphones", "Speakers"],
  other: ["Watches", "Colognes", "Books"],
};

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
        takeaway:
          "Capital and labour create wealth in fundamentally different ways.",
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
