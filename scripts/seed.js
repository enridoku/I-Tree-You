// Run once: node scripts/seed.js
// Writes the 6 curated trees to Firestore using their numeric string as the document ID.

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBAf2-j0OCaxSVuEl-5uAyM4Up1JhDUNko',
  authDomain: 'i-tree-you.firebaseapp.com',
  projectId: 'i-tree-you',
  storageBucket: 'i-tree-you.firebasestorage.app',
  messagingSenderId: '679005900460',
  appId: '1:679005900460:web:3df4c6eb97ac3ad6385909',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TREES = [
  {
    id: '1',
    name: 'Ancient Linden',
    location: 'Unter den Linden, Mitte',
    species: 'Tilia × europaea',
    type: 'Deciduous broadleaf',
    bloomMonth: 'June',
    bloomNote: 'Tiny cream-white flowers blanket the crown — bees come from kilometres around.',
    description: 'A magnificent 300-year-old linden tree whose canopy stretches nearly 20 meters wide. In June, the air around it fills with a sweet honey scent that stops passersby in their tracks.',
    facts: [
      { icon: '📏', label: 'Height', value: '~18 m' },
      { icon: '🎂', label: 'Estimated age', value: '300 yrs' },
      { icon: '🌡️', label: 'Best season', value: 'Summer' },
      { icon: '🐝', label: 'Wildlife', value: 'Major bee corridor' },
    ],
    tags: ['Scenic', 'Architectural', 'Seasonal'],
    votes: 512,
    hue: 148, sat: 0.12, lit: 0.38,
    gallery: [
      { litOffset: 0,     hueOffset: 0,   label: 'Morning light' },
      { litOffset: -0.06, hueOffset: 8,   label: 'Summer bloom' },
      { litOffset: -0.12, hueOffset: -15, label: 'Late evening' },
      { litOffset: 0.08,  hueOffset: 20,  label: 'Autumn haze' },
    ],
  },
  {
    id: '2',
    name: 'Twin Oaks of Treptow',
    location: 'Treptower Park, Treptow',
    species: 'Quercus robur',
    type: 'Deciduous broadleaf',
    bloomMonth: 'April',
    bloomNote: 'Catkins dangle like golden tassels before the leaves emerge — a brief, underrated spectacle.',
    description: 'Two enormous oaks that have grown together over centuries, their trunks merging at the base like old friends. They shelter a beloved bench where Berliners come to read.',
    facts: [
      { icon: '📏', label: 'Trunk girth', value: '4.2 m combined' },
      { icon: '🎂', label: 'Estimated age', value: '~450 yrs' },
      { icon: '🌡️', label: 'Best season', value: 'Autumn' },
      { icon: '🦉', label: 'Wildlife', value: 'Nesting tawny owls' },
    ],
    tags: ['Peaceful', 'Scenic', 'Unique'],
    votes: 342,
    hue: 130, sat: 0.14, lit: 0.32,
    gallery: [
      { litOffset: 0,     hueOffset: 0,  label: 'Dawn mist' },
      { litOffset: 0.06,  hueOffset: 12, label: 'Spring catkins' },
      { litOffset: -0.08, hueOffset: -8, label: 'Storm light' },
      { litOffset: -0.04, hueOffset: 25, label: 'October gold' },
    ],
  },
  {
    id: '3',
    name: 'Weeping Willow, Wannsee',
    location: 'Großer Wannsee, Steglitz-Zehlendorf',
    species: 'Salix babylonica',
    type: 'Deciduous, riparian',
    bloomMonth: 'March',
    bloomNote: "One of Berlin's earliest bloomers — soft yellow catkins appear while snow can still be on the ground.",
    description: 'Its curtain of golden-green tendrils sweeps the still water of the lake. At dusk, the reflections make it look like the tree is twice its size.',
    facts: [
      { icon: '📏', label: 'Canopy spread', value: '~14 m wide' },
      { icon: '🎂', label: 'Estimated age', value: '~120 yrs' },
      { icon: '🌡️', label: 'Best season', value: 'Spring & dusk' },
      { icon: '🦆', label: 'Wildlife', value: 'Heron nesting site' },
    ],
    tags: ['Photography', 'Scenic', 'Trail nearby'],
    votes: 289,
    hue: 100, sat: 0.11, lit: 0.36,
    gallery: [
      { litOffset: 0,     hueOffset: 0,   label: 'Lakeside view' },
      { litOffset: 0.1,   hueOffset: -10, label: 'Spring awakening' },
      { litOffset: -0.1,  hueOffset: 5,   label: 'Golden hour' },
      { litOffset: -0.15, hueOffset: -20, label: 'Moonlit reflection' },
    ],
  },
  {
    id: '4',
    name: 'The Grunewald Giant',
    location: 'Grunewald Forest, Charlottenburg-Wilmersdorf',
    species: 'Pinus sylvestris',
    type: 'Evergreen conifer',
    bloomMonth: 'May',
    bloomNote: 'Pollen season turns the air around it yellow-green — locals joke you can taste the forest.',
    description: 'A solitary pine standing some 40 meters above the forest floor. Locals call it the "lighthouse" — you can spot its crown from the Teufelsberg hill.',
    facts: [
      { icon: '📏', label: 'Height', value: '~40 m' },
      { icon: '🎂', label: 'Estimated age', value: '~200 yrs' },
      { icon: '🌡️', label: 'Best season', value: 'Year-round' },
      { icon: '🦅', label: 'Wildlife', value: 'Red kite viewpoint' },
    ],
    tags: ['Hiking', 'Trail nearby', 'Unique'],
    votes: 198,
    hue: 155, sat: 0.13, lit: 0.28,
    gallery: [
      { litOffset: 0,     hueOffset: 0,   label: 'Forest floor view' },
      { litOffset: 0.08,  hueOffset: -5,  label: 'Misty morning' },
      { litOffset: -0.05, hueOffset: 10,  label: 'Midday crown' },
      { litOffset: -0.12, hueOffset: -10, label: 'Winter silhouette' },
    ],
  },
  {
    id: '5',
    name: 'Copper Beech, Prenzlauer Berg',
    location: 'Kollwitzplatz, Prenzlauer Berg',
    species: 'Fagus sylvatica "Purpurea"',
    type: 'Deciduous broadleaf',
    bloomMonth: 'October',
    bloomNote: 'In autumn the burgundy deepens to near-black, backlit by low October sun — unmissable.',
    description: 'Its deep burgundy leaves glow like stained glass when autumn sun passes through them. Children and artists alike gather beneath it on weekends.',
    facts: [
      { icon: '📏', label: 'Height', value: '~22 m' },
      { icon: '🎂', label: 'Estimated age', value: '~80 yrs' },
      { icon: '🌡️', label: 'Best season', value: 'Autumn' },
      { icon: '🎨', label: 'Notable', value: 'Beloved by local painters' },
    ],
    tags: ['Urban', 'Seasonal', 'Photography'],
    votes: 175,
    hue: 25, sat: 0.10, lit: 0.38,
    gallery: [
      { litOffset: 0,     hueOffset: 0,  label: 'Summer burgundy' },
      { litOffset: 0.05,  hueOffset: 5,  label: 'Spring unfurling' },
      { litOffset: -0.06, hueOffset: 15, label: 'Backlit leaves' },
      { litOffset: -0.1,  hueOffset: -5, label: 'After rain' },
    ],
  },
  {
    id: '6',
    name: 'Silver Birch Cluster',
    location: 'Tempelhofer Feld, Tempelhof',
    species: 'Betula pendula',
    type: 'Deciduous, pioneer species',
    bloomMonth: 'April',
    bloomNote: 'Lime-green catkins flutter at the tips of every branch — the whole cluster seems to vibrate in April wind.',
    description: 'A circle of slender birches that somehow took root on the old airfield. Their white bark catches every passing cloud and wind, always in motion.',
    facts: [
      { icon: '📏', label: 'Tallest trunk', value: '~16 m' },
      { icon: '🎂', label: 'Estimated age', value: '~50 yrs' },
      { icon: '🌡️', label: 'Best season', value: 'Winter (bark)' },
      { icon: '✈️', label: 'History', value: 'Grew on old runway edge' },
    ],
    tags: ['Scenic', 'Peaceful', 'Urban'],
    votes: 143,
    hue: 85, sat: 0.07, lit: 0.55,
    gallery: [
      { litOffset: 0,     hueOffset: 0,  label: 'Open field view' },
      { litOffset: 0.07,  hueOffset: -8, label: 'White bark close-up' },
      { litOffset: -0.08, hueOffset: 10, label: 'Autumn yellow' },
      { litOffset: -0.14, hueOffset: -5, label: 'Bare winter grove' },
    ],
  },
];

for (const tree of TREES) {
  const { id, ...data } = tree;
  await setDoc(doc(db, 'trees', id), data);
  console.log(`✓ Seeded: ${tree.name}`);
}

console.log('\nDone. 6 trees written to Firestore /trees collection.');
process.exit(0);
