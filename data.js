// All site content lives here so the team can edit text without touching the code.
// Every fact below is checked against a NASA / JPL source listed in SOURCES at the bottom.

// Set to true after running get-images.ps1 to serve the photos from assets/img/
// instead of NASA's servers.
const USE_LOCAL_IMAGES = false;

// Scratch project shown in the "Play" section.
const SCRATCH_PROJECT_ID = "1440222127";

// Builds a NASA Photojournal image address from its PIA number.
// width = optional resize (NASA's image server scales it for us).
function nasaImage(pia, width) {
  if (USE_LOCAL_IMAGES) return `assets/img/${pia}.jpg`;
  const group = pia.slice(3, 5);
  const lower = pia.toLowerCase();
  if (width) {
    return `https://assets.science.nasa.gov/dynamicimage/assets/science/psd/photojournal/pia/pia${group}/${lower}/${pia}.jpg?w=${width}`;
  }
  return `https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia${group}/${lower}/${pia}.jpg`;
}

const STATS = [
  { value: 3, suffix: " months", label: "how long the mission was planned to last" },
  { value: 6, suffix: "+ years", label: "how long Spirit actually worked" },
  { value: 7.73, suffix: " km", decimals: 2, label: "driven across Mars (4.8 miles)" },
  { value: 124000, suffix: "+", label: "pictures sent back to Earth" },
];

const TIMELINE = [
  {
    date: "June 10, 2003",
    title: "Launch",
    text: "Spirit leaves Earth from Cape Canaveral, Florida, folded up inside a spacecraft headed for Mars.",
  },
  {
    date: "January 4, 2004",
    title: "Landing in Gusev Crater",
    text: "Spirit bounces down inside airbags. Its job: look for clues that water once shaped Mars. The plan is 90 Martian days, about three months.",
  },
  {
    date: "February 6, 2004",
    title: "The first rock ever ground on Mars",
    text: "Spirit grinds a small circle into a rock named Adirondack to see the fresh rock inside. No machine had ever done that on another planet.",
  },
  {
    date: "March 2005",
    title: "A lucky gust",
    text: "Dust devils sweep dust off Spirit's solar panels. Its power jumps from about 60% to 93%, giving the mission a longer life.",
  },
  {
    date: "March 2006",
    title: "A wheel stops turning",
    text: "Spirit's right front wheel stops working. The team teaches Spirit to drive backward, dragging the broken wheel behind it.",
  },
  {
    date: "Mid 2006",
    title: "Halley's new mineral",
    text: "At a ridge called Low Ridge, Spirit studies bright material in a rock named Halley and finds signs of a calcium sulfate mineral, a new question about water.",
  },
  {
    date: "2007",
    title: "The broken wheel finds a clue",
    text: "The dragging wheel scrapes open bright white soil named Gertrude Weise. It turns out to be about 90% silica, a clue that hot water or steam was once there.",
    highlight: true,
  },
  {
    date: "May 2009",
    title: "Stuck at Troy",
    text: "Spirit's wheels break through a crust into soft soil at a spot called Troy. Engineers spend months trying to free it.",
  },
  {
    date: "January 2010",
    title: "A rover that stays put",
    text: "The team decides Spirit will keep doing science from where it sits, as a stationary research station.",
  },
  {
    date: "March 22, 2010",
    title: "The last message",
    text: "As the Martian winter brings less sunlight, Spirit sends its final signal to Earth.",
  },
  {
    date: "May 25, 2011",
    title: "Mission complete",
    text: "After more than 1,300 commands and no reply, NASA ends its efforts to contact Spirit. The rover is still sitting at Troy today.",
  },
];

const EVIDENCE = [
  {
    id: "adirondack",
    name: "Adirondack",
    when: "February 2004",
    pia: "PIA05223",
    instrument: "Rock Abrasion Tool",
    tools: ["rat"],
    imageCaption:
      "The round hole is the first rock ever ground on Mars. It is about 4.5 cm (1.8 in) across and less than 3 mm deep. Taken by Spirit's panoramic camera.",
    question: "Mars rocks are covered in dust and weathered on the outside. What did Spirit do so scientists could study the inside?",
    options: [
      { text: "Ground away the surface with its Rock Abrasion Tool", correct: true },
      { text: "Took a photo from far away" },
      { text: "Drove over the rock to crack it open" },
    ],
    explain:
      "Spirit's Rock Abrasion Tool works like a tiny grinder. Under the dust, the instruments found basalt, a dark rock that forms when lava cools.",
    conclusion: "Volcanic rock. Lava once flowed here.",
  },
  {
    id: "halley",
    name: "Halley",
    when: "2006, Low Ridge",
    pia: "PIA08567",
    instrument: "Arm instruments (APXS and Microscopic Imager)",
    tools: ["apxs", "mi"],
    imageCaption:
      "Spirit's wheel track runs along the left edge. Just to its right are bright patches of Halley, a rock Spirit's wheels broke open when the rover drove over it. The colors are exaggerated (false color) to make different materials stand out. Taken by Spirit's panoramic camera.",
    question: "Spirit found bright material in Halley that was different from bright soils it had seen before. What is the careful conclusion?",
    options: [
      { text: "All bright material on Mars is the same" },
      { text: "Bright means it must be ice" },
      { text: "Different chemistry means new questions to investigate", correct: true },
    ],
    explain:
      "The bluer material had the chemistry of a calcium sulfate mineral, while bright soils Spirit studied earlier held iron sulfate. Scientists asked whether water seeping through the rock layers had changed it.",
    conclusion: "A new mineral and a new question: did water change these rocks?",
  },
  {
    id: "gertrude",
    name: "Gertrude Weise",
    when: "2007",
    pia: "PIA09491",
    instrument: "Alpha Particle X-ray Spectrometer (APXS)",
    tools: ["apxs"],
    imageCaption:
      "The bright stripe is soil churned up by Spirit's broken wheel. The track is about 20 cm (8 in) wide. Taken by Spirit's panoramic camera, close to true color.",
    question: "Spirit's chemistry tool found the bright soil is about 90% silica. On Earth, where does silica this pure usually form?",
    options: [
      { text: "In sand dunes blown by wind" },
      { text: "In frozen lakes" },
      { text: "In hot springs or volcanic steam vents", correct: true },
    ],
    explain:
      "Scientists had two ideas: hot spring water, or acidic steam from volcanoes rising through the ground. Either way, water was involved. It is a clue about Mars's past, not proof of life.",
    conclusion: "Hot water or steam was once here. Found because a wheel broke.",
  },
];

// Where Spirit appears in PIA12205, as a fraction of the image width and height.
// Checked by eye against the full NASA image (the bright dot left of Home Plate).
const FIND_SPIRIT = {
  pia: "PIA12205",
  x: 0.265,
  y: 0.475,
  radius: 0.06, // how close a click must be (fraction of image width)
};

const SOURCES = [
  { label: "NASA Science: Spirit mission overview", url: "https://science.nasa.gov/mission/mer-spirit" },
  { label: "JPL: NASA's Spirit Rover Completes Mission on Mars (2011)", url: "https://www.jpl.nasa.gov/news/nasas-spirit-rover-completes-mission-on-mars" },
  { label: "PIA05223: First grinding of a rock on Mars (Adirondack)", url: "https://science.nasa.gov/photojournal/first-grinding-of-a-rock-on-mars/" },
  { label: "PIA08567: Spirit Examines Light-Toned 'Halley' (False Color)", url: "https://science.nasa.gov/photojournal/spirit-examines-light-toned-halley-false-color/" },
  { label: "PIA09491: Silica-Rich Soil Found by Spirit", url: "https://science.nasa.gov/photojournal/silica-rich-soil-found-by-spirit/" },
  { label: "PIA09403: Silica-Rich Soil in Gusev Crater", url: "https://science.nasa.gov/photojournal/silica-rich-soil-in-gusev-crater" },
  { label: "PIA12205: Orbital View of Spirit at 'Troy' (HiRISE)", url: "https://science.nasa.gov/photojournal/orbital-view-of-spirit-at-troy/" },
  { label: "PIA11757: Rover's Wheel Churns Up Bright Martian Soil", url: "https://science.nasa.gov/photojournal/rovers-wheel-churns-up-bright-martian-soil-vertical/" },
];

const IMAGE_CREDITS = {
  PIA05223: "NASA/JPL/Cornell",
  PIA08567: "NASA/JPL-Caltech/Cornell",
  PIA09491: "NASA/JPL/Cornell",
  PIA11757: "NASA/JPL-Caltech/Cornell",
  PIA12205: "NASA/JPL-Caltech/University of Arizona",
};

// Spirit's science tools. Photos are lab photos of the flight instruments or
// identical copies, from NASA/JPL and the instrument teams.
const TOOLS = [
  { id: "pancam", name: "Pancam", where: "On the mast",
    what: "Two color cameras at about the height of a person's eyes. Spirit used them to take the big panoramas, and color filters help show what rocks are made of.",
    credit: "NASA/JPL/Cornell" },
  { id: "minites", name: "Mini-TES", where: "Looks out through the mast",
    what: "Measures the heat that rocks and soil give off. Different minerals glow differently in infrared light, so scientists could pick targets from far away.",
    credit: "NASA/JPL/Arizona State University" },
  { id: "mi", name: "Microscopic Imager", where: "On the arm",
    what: "A close-up camera, like a geologist's magnifying glass. It shows tiny grains and textures in rocks and soil.",
    credit: "NASA/JPL/USGS" },
  { id: "apxs", name: "APXS", where: "On the arm",
    what: "The Alpha Particle X-ray Spectrometer tells which chemical elements are in a rock. It found that the soil at Gertrude Weise is about 90% silica.",
    credit: "NASA/JPL/Max Planck Institute for Chemistry" },
  { id: "mossbauer", name: "Moessbauer Spectrometer", where: "On the arm",
    what: "Small enough to hold in your hand. It finds minerals that contain iron, which can show whether water changed the rock.",
    credit: "NASA/JPL/University of Mainz" },
  { id: "rat", name: "Rock Abrasion Tool", where: "On the arm",
    what: "A tiny grinder that scrapes off a rock's dusty outer layer, making a hole about 4.5 cm (1.8 in) wide so the other tools can study the fresh rock inside.",
    credit: "NASA/JPL/Honeybee Robotics" },
  { id: "magnets", name: "Magnets", where: "On the rover deck",
    what: "Catch magnetic dust blowing in the Mars air. Cameras photograph the dust that sticks so scientists can learn what it is made of.",
    credit: "NASA/JPL/Niels Bohr Institute" },
  { id: "navcam", name: "Navcam", where: "On the mast",
    what: "Two black-and-white cameras that work like a pair of eyes, so they can see in 3D. Drivers on Earth used Navcam pictures to plan safe routes. In this picture, Navcam looked down at Spirit itself.",
    img: "https://assets.science.nasa.gov/dynamicimage/assets/science/psd/photojournal/pia/pia04/pia04983/PIA04983.jpg?w=560",
    credit: "NASA/JPL (PIA04983)" },
];
const toolById = (id) => TOOLS.find((t) => t.id === id);
