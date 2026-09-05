import { 
  WebProject, 
  GraphicProject, 
  VideoProject, 
  Credential, 
  ExperienceItem, 
  ToolItem, 
  Testimonial 
} from '../types';

export const PERSONAL_INFO = {
  name: 'SAURABH',
  shortTitle: 'VIDEO EDITOR · WEB DEVELOPER · GRAPHIC DESIGNER',
  tagline: 'I EDIT. I DESIGN. I BUILD.',
  altTagline: 'VIDEO. DESIGN. WEB. ONE CREATIVE MIND.',
  intro: "Hi, I'm Saurabh — a Video Editor, Web Developer and Graphic Designer. I work across visual storytelling, digital design and interactive web experiences.",
  studio: {
    name: 'HAPPICORE',
    descriptor: 'INDEPENDENT CREATIVE STUDIO',
    description: 'A small creative workspace focused on video editing, graphic design and web experiences. Happicore is where I experiment, create and share independent digital projects.',
    handle: '@happicore',
    instagramUrl: 'https://instagram.com/happicore',
  },
  status: 'AVAILABLE FOR FREELANCE',
  email: 'saurabhcore31@gmail.com',
  linkedin: 'https://linkedin.com/in/saurabh-07328a372',
  linkedinDisplay: 'linkedin.com/in/saurabh-07328a372',
  phone: '+91 8127122102',
  location: 'Mau, Uttar Pradesh, India',
  education: {
    institution: 'INDIAN INSTITUTE OF TECHNOLOGY MADRAS',
    shortInstitution: 'IIT MADRAS',
    degree: 'BS IN DATA SCIENCE AND APPLICATIONS',
    period: '2023 – PRESENT',
    status: 'ONGOING',
    highlights: [
      'Technical Foundation & Algorithms',
      'Analytical Problem Solving',
      'Computational Thinking',
      'Data-Driven Design & Engineering'
    ]
  },
  resume: {
    filename: 'Saurabh_Creative_Portfolio_Resume.pdf',
    downloadAvailable: true,
  }
};

export const SKILLS_MATRIX = {
  video: [
    'Adobe Premiere Pro',
    'CapCut',
    'Alight Motion',
    'Color Grading & LUT Mastery',
    'Audio & Sound Design',
    'Kinetic Motion Pacing'
  ],
  web: [
    'HTML5 & Modern Web Standards',
    'CSS3 & Micro-Animations',
    'JavaScript (ES6+) & TypeScript',
    'Tailwind CSS & Responsive Layouts',
    'GPU-Accelerated Web Motion',
    'Performance & CDN Architecture'
  ],
  graphic: [
    'Adobe Photoshop',
    'Figma',
    'Canva',
    'Poster & Print Layouts',
    'Editorial Typography & Hierarchy',
    'Brand & Visual Identity Systems'
  ]
};

export const TOOLS_DATA: ToolItem[] = [
  {
    name: 'Figma',
    category: 'GRAPHIC',
    roleDescription: 'Design systems, responsive website wireframes, interactive prototypes, and typography architecture.',
    experienceLevel: 'UI/UX & Editorial Layouts',
    svgIcon: 'figma'
  },
  {
    name: 'Canva',
    category: 'GRAPHIC',
    roleDescription: 'Rapid social creative iterations, event banners, and streamlined society marketing collateral.',
    experienceLevel: 'Rapid Asset Prototyping',
    svgIcon: 'canva'
  },
  {
    name: 'Adobe Premiere Pro',
    category: 'VIDEO',
    roleDescription: 'Timeline pacing, multicam editing, dynamic color grading, audio synchronization, and high-impact aftermovies.',
    experienceLevel: 'Primary NLE Suite',
    svgIcon: 'pr'
  },
  {
    name: 'CapCut',
    category: 'VIDEO',
    roleDescription: 'High-retention vertical short-form editing, speed ramps, typographic overlays, and dynamic social media motion.',
    experienceLevel: 'Mobile & Desktop Shortform',
    svgIcon: 'capcut'
  },
  {
    name: 'Adobe Photoshop',
    category: 'GRAPHIC',
    roleDescription: 'Poster manipulation, visual composition, textural depth, monochrome grading, and editorial print layouts.',
    experienceLevel: 'Raster Art & Matte Composition',
    svgIcon: 'ps'
  },
  {
    name: 'Alight Motion',
    category: 'VIDEO',
    roleDescription: 'Keyframe motion graphics, custom shape animations, rhythmic shakes, and kinetic typography on mobile platforms.',
    experienceLevel: 'Kinetic Motion Design',
    svgIcon: 'alight'
  },
  {
    name: 'HTML5',
    category: 'WEB',
    roleDescription: 'Semantic document structure, accessible typography hierarchies, and SEO-conscious markup architecture.',
    experienceLevel: 'Semantic Architecture',
    svgIcon: 'html'
  },
  {
    name: 'CSS3',
    category: 'WEB',
    roleDescription: 'Custom utility layouts, perspective transforms, responsive grid mechanics, and micro-interactions.',
    experienceLevel: 'Editorial Styling & Layouts',
    svgIcon: 'css'
  },
  {
    name: 'JavaScript',
    category: 'WEB',
    roleDescription: 'Dynamic DOM state orchestration, custom scroll animations, interactive players, and performance optimization.',
    experienceLevel: 'Interactive Frontend Logic',
    svgIcon: 'js'
  }
];

export const VIDEO_PROJECTS: VideoProject[] = [
  {
    id: 'vid-1',
    slug: 'paradox-2026-aftermovie',
    title: 'PARADOX 2026 AFTERMOVIE',
    category: 'Fest Aftermovie & Cinematic Recap',
    year: '2026',
    role: 'Lead Video Editor & Pipeline Director',
    tools: ['Adobe Premiere Pro', 'CapCut', 'Photoshop'],
    duration: '03:42',
    description: 'The definitive cinematic aftermovie documenting Paradox 2026, the premier cultural and sports festival of IIT Madras BS Degree. Engineered with rhythmic beat cutting, dynamic speed ramps, and high-energy narrative pacing.',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1400&auto=format&fit=crop',
    videoSourceType: 'cloudflare-r2',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    theProject: 'Paradox 2026 brought together thousands of students for sports, cultural celebrations, and tech summits. The objective was to capture the pulse, sheer scale, and uninhibited adrenaline of the campus event into an unforgettable 3-minute visual statement.',
    theEdit: 'Constructed an aggressive sound design foundation using layered risers, crowd ambience, and custom impacts. Edited multi-angle camera footage with non-linear pacing, match cuts, and motion-tracked kinetic typography.',
    theResult: 'Premiered at the closing gala ceremony to widespread student and faculty acclaim, reaching thousands of organic views across student media channels and setting the visual benchmark for subsequent society productions.',
    stills: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop'
    ]
  },
  {
    id: 'vid-2',
    slug: 'sportify-annual-recap',
    title: 'SPORTIFY ANNUAL RECAP',
    category: 'Sports Society Annual Film',
    year: '2026',
    role: 'Director of Design & Media / Editor',
    tools: ['Adobe Premiere Pro', 'Alight Motion', 'Canva'],
    duration: '02:18',
    description: 'A tribute to the competitive spirit, tournaments, training camps, and community milestones of The Sportify (IIT Madras BS Degree Sports Society) throughout the 2025-2026 academic calendar.',
    thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1400&auto=format&fit=crop',
    videoSourceType: 'google-drive',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    theProject: 'The Sportify required a cohesive, emotionally resonant retrospective highlighting every sport wing—football, cricket, chess, athletics, and esports—demonstrating athletic excellence and collegiate camaraderie.',
    theEdit: 'Built a three-act structure transitioning from dawn training sessions to climactic tournament championship points. Synchronized dramatic low-frequency audio hits with slow-motion athletic impacts and sharp graphic stat overlays.',
    theResult: 'Adopted as the flagship promotional recap for society orientations, driving a 45% increase in member engagement and event participation.',
    stills: [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop'
    ]
  },
  {
    id: 'vid-3',
    slug: 'rkm-lucknow-chapter-aftermovie',
    title: 'RKM LUCKNOW CHAPTER AFTERMOVIE',
    category: 'Youth Convention Documentary Recap',
    year: '2025',
    role: 'Lead Video Editor & Sound Designer',
    tools: ['Adobe Premiere Pro', 'CapCut', 'Photoshop'],
    duration: '04:10',
    description: 'An inspirational, documentary-style aftermovie capturing the keynote addresses, service initiatives, and cultural symposiums of the Ramakrishna Mission Youth Convention Lucknow Chapter.',
    thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1400&auto=format&fit=crop',
    videoSourceType: 'cloudflare-r2',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    theProject: 'Documenting a high-profile multi-day convention requires balancing contemplative, philosophical themes with energetic youth participation and volunteer activities.',
    theEdit: 'Used ambient orchestral pacing alongside real sound recordings from the auditorium. Color-graded footage to preserve authentic skin tones and architectural warmth while retaining crisp, modern visual punch.',
    theResult: 'Officially published by the Lucknow Chapter organizing committee and archived as the institutional documentary for future regional conferences.',
    stills: [
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop'
    ]
  },
  {
    id: 'vid-4',
    slug: 'sportify-promo-shorts-campaign',
    title: 'SPORTIFY PROMO SHORTS CAMPAIGN',
    category: 'Social Media & Tournament Hype Shorts',
    year: '2026',
    role: 'Motion Designer & Short-Form Editor',
    tools: ['CapCut', 'Alight Motion', 'Figma'],
    duration: '00:58',
    description: 'A series of high-tempo 9:16 vertical reels created to promote inter-house matches, athlete spotlight profiles, and society registrations across Instagram.',
    thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1400&auto=format&fit=crop',
    videoSourceType: 'cloudflare-r2',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    theProject: 'With short attention spans on social feeds, each 15-second teaser needed an instant hook within the first 1.2 seconds, driven by rhythm and seamless typography.',
    theEdit: 'Mastered on mobile and desktop using custom zoom transitions, rhythmic shake presets, neon-rim mask overlays, and synchronized audio soundbites.',
    theResult: 'Generated over 20,000 organic views on student Instagram reels and accelerated ticket registrations for society tournaments.',
    stills: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=800&auto=format&fit=crop'
    ]
  }
];

export const WEB_PROJECTS: WebProject[] = [
  {
    id: 'web-1',
    slug: 'happicore-creative-studio',
    title: 'HAPPICORE DIGITAL WORKSPACE',
    subtitle: 'Independent Creative Studio & Media Interface',
    description: 'The interactive digital platform for Happicore — Saurabh’s independent creative studio. Featuring dark-mode aesthetics, custom audio/video players, and dynamic portfolio routing.',
    year: '2026',
    role: 'Lead Architect & Designer',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS', 'Motion'],
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1400&auto=format&fit=crop',
    liveUrl: 'https://happicore.studio',
    githubUrl: 'https://github.com/saurabh/happicore-studio',
    overview: 'Happicore is designed as an unconventional digital space that reflects the intersection of cinema, graphic design, and web technology. The interface minimizes unnecessary UI noise to let high-resolution media and typography command attention.',
    keyFeatures: [
      'Monochrome editorial design language with 3D perspective layers',
      'Unified media player supporting Cloudflare R2 and Google Drive sources',
      'Zero-dependency fluid typography scale and GPU-accelerated motion',
      'Integrated credentials matrix and interactive certificate lightbox'
    ],
    process: 'Prototyped directly in code after initial Figma wireframing. Focused on maintaining 60fps interaction during cursor transformations and 3D tilts across modern browsers.',
    previews: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'web-2',
    slug: 'the-sportify-society-portal',
    title: 'THE SPORTIFY PORTAL',
    subtitle: 'IIT Madras BS Degree Sports Society Platform',
    description: 'Centralized web destination for tournament fixtures, society member rosters, live score updates, and multimedia galleries for The Sportify society at IIT Madras.',
    year: '2026',
    role: 'Head – Tech & Digital Innovation / Full Stack Dev',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI'],
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop',
    liveUrl: 'https://sportify-iitm.web.app',
    githubUrl: 'https://github.com/saurabh/the-sportify-portal',
    overview: 'As Deputy Head of Design & Media and Tech Lead, Saurabh architected the official digital face of The Sportify to streamline event registrations and replace disjointed Google Forms with an authoritative brand portal.',
    keyFeatures: [
      'Live tournament scorecards and bracket tracking',
      'Society media gallery integrating aftermovies and match photography',
      'Digital certificate issuance and verification lookup system',
      'Optimized mobile navigation for field athletes and spectators'
    ],
    process: 'Synthesized feedback from athletes, coordinators, and council members to design high-contrast schedules that read clearly under outdoor stadium conditions.',
    previews: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'web-3',
    slug: 'paradox-event-hub',
    title: 'PARADOX EVENT SCHEDULER',
    subtitle: 'Interactive Cultural Fest Guide & Timetable',
    description: 'Dynamic event scheduler and venue map built to navigate multi-track competitions, speaker sessions, and cultural showcases during the Paradox annual fest.',
    year: '2026',
    role: 'Frontend Developer & UI Designer',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Figma'],
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1400&auto=format&fit=crop',
    liveUrl: 'https://paradox-hub.vercel.app',
    githubUrl: 'https://github.com/saurabh/paradox-event-hub',
    overview: 'Thousands of attendees needed real-time venue status, schedule shift alerts, and bookmarking capabilities. The interface was optimized for low-bandwidth cellular conditions during crowded campus hours.',
    keyFeatures: [
      'Instant search and filter by sports, cult, or tech track',
      'Local state bookmarking for personal fest agendas',
      'Asynchronous offline cache fallback for poor network spots',
      'Interactive venue floorplan and stage directory'
    ],
    process: 'Applied brutalist typography paired with instant filtering logic to ensure zero render lag when toggling through 50+ concurrent events.',
    previews: [
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'web-4',
    slug: 'cinematic-media-archive',
    title: 'CINEMATIC STREAM ARCHIVE',
    subtitle: 'Cloud-Connected Video & Asset Showcase',
    description: 'A modular video streaming frontend connecting external Cloudflare R2 object buckets with zero-buffering preview clips and metadata overlays.',
    year: '2025',
    role: 'Web Developer',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Cloudflare APIs'],
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop',
    liveUrl: 'https://archive.happicore.studio',
    githubUrl: 'https://github.com/saurabh/cinematic-archive',
    overview: 'Built to host raw 4K video exports without incurring massive hosting costs or third-party ad interruptions. Acts as the private preview screening room for clients and societies.',
    keyFeatures: [
      'Dual playback failover between R2 storage and Google Drive links',
      'Direct timecode jumping and frame scrubbing controls',
      'Adaptive bitrate preview generator',
      'Minimalist darkroom viewing mode'
    ],
    process: 'Engineered custom HTML5 video wrappers with keyboard shortcuts and responsive aspect-ratio containment.',
    previews: [
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop'
    ]
  }
];

export const GRAPHIC_PROJECTS: GraphicProject[] = [
  {
    id: 'grp-1',
    slug: 'paradox-2026-poster-series',
    title: 'PARADOX 2026 OFFICIAL POSTER SERIES',
    category: 'Posters & Events',
    year: '2026',
    role: 'Lead Visual Designer',
    tools: ['Adobe Photoshop', 'Canva', 'Figma'],
    description: 'A stark, high-contrast poster collection advertising the flagship events, sports showdowns, and music headliners of Paradox 2026 at IIT Madras.',
    heroImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop',
        caption: 'Paradox 2026 Master Keynote & Flagship Poster',
        aspect: 'portrait'
      },
      {
        url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop',
        caption: 'Championship Finals Poster — Night Sessions',
        aspect: 'portrait'
      },
      {
        url: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1200&auto=format&fit=crop',
        caption: 'Techno-Cultural Summit Promotional Broadside',
        aspect: 'landscape'
      }
    ]
  },
  {
    id: 'grp-2',
    slug: 'sportify-social-identity-banners',
    title: 'SPORTIFY BRAND ASSETS & SOCIAL CREATIVES',
    category: 'Social Creatives',
    year: '2026',
    role: 'Deputy Head of Design & Media',
    tools: ['Figma', 'Adobe Photoshop', 'Canva'],
    description: 'Complete visual identity kit for The Sportify society: Instagram carousel templates, tournament announcements, athlete badges, and matchday countdown graphics.',
    heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
        caption: 'Tournament Matchday Banner Template',
        aspect: 'landscape'
      },
      {
        url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop',
        caption: 'Player of the Tournament Carousel Slide',
        aspect: 'square'
      },
      {
        url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop',
        caption: 'League Standings & Statistics Infographic',
        aspect: 'portrait'
      }
    ]
  },
  {
    id: 'grp-3',
    slug: 'rkm-lucknow-event-branding',
    title: 'RKM LUCKNOW YOUTH CONVENTION BRANDING',
    category: 'Branding',
    year: '2025',
    role: 'Graphic Designer',
    tools: ['Photoshop', 'Canva'],
    description: 'Dignified, clean visual collateral for Ramakrishna Mission Lucknow Chapter youth convention, including stage backdrops, invitation cards, and volunteer identification badges.',
    heroImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop',
        caption: 'Main Auditorium Backdrop & Banner System',
        aspect: 'landscape'
      },
      {
        url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=1200&auto=format&fit=crop',
        caption: 'Delegate Pass & Program Handbook Cover',
        aspect: 'portrait'
      }
    ]
  },
  {
    id: 'grp-4',
    slug: 'iitm-bs-meetup-certificates-posters',
    title: 'IITM BS MEETUP POSTERS & CERTIFICATES',
    category: 'Certificates',
    year: '2026',
    role: 'Lead Coordinator & Designer',
    tools: ['Canva', 'Photoshop', 'Figma'],
    description: 'Official verified certificate designs, regional meetup posters, and participant appreciation awards created for IIT Madras BS Degree student gatherings.',
    heroImage: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=1200&auto=format&fit=crop',
        caption: 'Certificate of Excellence & Recognition Layout',
        aspect: 'landscape'
      },
      {
        url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=1200&auto=format&fit=crop',
        caption: 'Regional Meetup Promotional Broadside',
        aspect: 'portrait'
      }
    ]
  },
  {
    id: 'grp-5',
    slug: 'happicore-studio-identity',
    title: 'HAPPICORE STUDIO VISUAL SYSTEM',
    category: 'Visual Identity',
    year: '2026',
    role: 'Creative Director',
    tools: ['Figma', 'Photoshop'],
    description: 'The typographic brand identity, dark monochrome iconography, watermark guidelines, and social avatar matrix for Happicore creative studio.',
    heroImage: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop',
        caption: 'Happicore Core Monogram & Wordmark Matrix',
        aspect: 'landscape'
      },
      {
        url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200&auto=format&fit=crop',
        caption: 'Monochrome Stationery & Motion Graphic Slates',
        aspect: 'square'
      }
    ]
  }
];

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: 'exp-1',
    period: 'Nov 2025 – Jun 2026',
    role: 'Deputy Head – Design & Media Department',
    organization: 'THE SPORTIFY — IIT MADRAS BS DEGREE SPORTS SOCIETY',
    location: 'IIT Madras Community',
    description: [
      'Directed the end-to-end video editing pipeline for the Paradox 2026 official aftermovie and promotional short video campaigns.',
      'Led overall design and media strategy for high-stakes collegiate sports society tournaments and online events.',
      'Edited the RKM Lucknow Chapter aftermovie and the Sportify Annual Recap film.',
      'Created certificates, regional meetup posters, and multi-format social media creatives.',
      'Maintained brand consistency across video deliverables, typography rules, and digital assets.'
    ],
    skills: ['Video Editing', 'Premiere Pro', 'Motion Design', 'Creative Direction', 'Photoshop', 'Brand Systems']
  },
  {
    id: 'exp-2',
    period: 'Feb 2026 – Mar 2026',
    role: 'Lead – Creative & Design Team',
    organization: 'THE SPORTIFY — IIT MADRAS BS DEGREE SPORTS SOCIETY',
    location: 'IIT Madras Community',
    description: [
      'Managed a dedicated pod of graphic designers and video editors to produce event collateral under tight turnaround windows.',
      'Audited visual fidelity, export settings, and color grading across all outward-facing campaign content.',
      'Standardized Canva and Figma master asset libraries to streamline collaborative workflows.'
    ],
    skills: ['Team Leadership', 'Art Direction', 'Figma Systems', 'Quality Assurance']
  },
  {
    id: 'exp-3',
    period: 'Feb 2026',
    role: 'Lead Coordinator',
    organization: 'THE SPORTIFY — IIT MADRAS BS DEGREE SPORTS SOCIETY',
    location: 'IIT Madras Community',
    description: [
      'Coordinated multi-disciplinary operations between the event management, technical operations, and media broadcast teams.',
      'Ensured seamless on-ground media coverage and instant social storytelling during active tournament hours.'
    ],
    skills: ['Event Coordination', 'Live Media Operations', 'Cross-Functional Collaboration']
  },
  {
    id: 'exp-4',
    period: '2025 – Present',
    role: 'Head – Technology & Digital Innovation',
    organization: 'THE SPORTIFY — IIT MADRAS BS DEGREE SPORTS SOCIETY',
    location: 'IIT Madras Community',
    description: [
      'Spearheaded modern digital initiatives including the society web portal, automated fixture tables, and cloud media distribution.',
      'Integrated Cloudflare R2 and Google Drive storage workflows to optimize asset sharing and video archival.'
    ],
    skills: ['Web Development', 'Digital Innovation', 'Cloud Asset Infrastructure', 'JavaScript']
  }
];

export const CREDENTIALS_DATA: Credential[] = [
  {
    id: 'crd-1',
    number: '01',
    title: 'Deputy Head of Design & Media Appointment',
    issuedBy: 'The Sportify (IIT Madras BS Degree Sports Society)',
    year: '2025',
    category: 'LEADERSHIP',
    verificationUrl: 'https://iitm.ac.in',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=900&auto=format&fit=crop',
    description: 'Official executive appointment certificate recognizing leadership, creative execution, and stewardship of the design and media wing.'
  },
  {
    id: 'crd-2',
    number: '02',
    title: 'Lead Creative & Design Direction Citation',
    issuedBy: 'IIT Madras BS Degree Society Council',
    year: '2026',
    category: 'DESIGN',
    verificationUrl: 'https://iitm.ac.in',
    image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=900&auto=format&fit=crop',
    description: 'Award of distinction for exceptional art direction, festival branding, and creative team leadership during Paradox 2026.'
  },
  {
    id: 'crd-3',
    number: '03',
    title: 'Lead Video Editing & Pipeline Directorship',
    issuedBy: 'Paradox 2026 Executive Festival Committee',
    year: '2026',
    category: 'VIDEO',
    verificationUrl: 'https://iitm.ac.in',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=900&auto=format&fit=crop',
    description: 'Official citation for editing and directing the official festival aftermovie, broadcast across the student community.'
  },
  {
    id: 'crd-4',
    number: '04',
    title: 'BS in Data Science and Applications (Academic Matriculation)',
    issuedBy: 'Indian Institute of Technology Madras (IIT Madras)',
    year: '2024–Present',
    category: 'TECH',
    verificationUrl: 'https://study.iitm.ac.in/ds/',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=900&auto=format&fit=crop',
    description: 'Undergraduate collegiate program enrollment in Data Science, Computational Thinking, and Software Architecture.'
  },
  {
    id: 'crd-5',
    number: '05',
    title: 'Ramakrishna Mission Youth Convention Media Honors',
    issuedBy: 'RKM Lucknow Chapter Committee',
    year: '2025',
    category: 'VIDEO',
    verificationUrl: 'https://belurmath.org',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=900&auto=format&fit=crop',
    description: 'Commendation for documentary storytelling, archival cinematography, and aftermovie production for the annual youth assembly.'
  },
  {
    id: 'crd-6',
    number: '06',
    title: 'Interactive Web Systems & UI Architecture Credential',
    issuedBy: 'Happicore Creative Engineering Lab',
    year: '2025',
    category: 'TECH',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=900&auto=format&fit=crop',
    description: 'Demonstrated mastery in responsive DOM manipulation, 3D perspective shaders, and performance-tuned frontend interfaces.'
  },
  {
    id: 'crd-7',
    number: '07',
    title: 'National Collegiate Design & Media Hackathon',
    issuedBy: 'Tech & Design Society League',
    year: '2025',
    category: 'HACKATHONS',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=900&auto=format&fit=crop',
    description: 'Participation and design finalist ranking for high-speed brand identity and digital interface prototyping.'
  },
  {
    id: 'crd-8',
    number: '08',
    title: 'Lead Coordinator Operations Distinction',
    issuedBy: 'The Sportify Society Operations Wing',
    year: '2026',
    category: 'LEADERSHIP',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=900&auto=format&fit=crop',
    description: 'Recognition for exemplary logistics, cross-pod synchronization, and live event production.'
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 't-1',
    stars: 5,
    quote: "Saurabh brought an insane level of energy and cinematic finesse to the Paradox 2026 aftermovie. The rhythm, sound design, and pacing were on another level compared to anything we've seen.",
    author: "IIT Madras Festival Committee",
    role: "Executive Organizer · Paradox '26",
    project: "Paradox 2026 Aftermovie",
    isPlaceholder: true
  },
  {
    id: 't-2',
    stars: 5,
    quote: "Rarely do you find someone who can design a stunning visual identity, edit high-impact recap reels, and code the actual web platform. Saurabh delivers across every creative discipline.",
    author: "The Sportify Executive Council",
    role: "Society Leadership · IIT Madras",
    project: "Sportify Branding & Media Pipeline",
    isPlaceholder: true
  },
  {
    id: 't-3',
    stars: 5,
    quote: "The RKM Lucknow Chapter documentary aftermovie captured the soul of our convention with warmth and dignity. Every speaker and attendee was moved by the final cut.",
    author: "Youth Convention Directorate",
    role: "Organizing Coordinator",
    project: "RKM Lucknow Chapter Aftermovie",
    isPlaceholder: true
  },
  {
    id: 't-4',
    stars: 5,
    quote: "Working with Happicore on our digital presence was a breeze. Fast turnaround, pristine typography, and a clear understanding of contemporary aesthetics.",
    author: "Creative Collaborator",
    role: "Independent Producer",
    project: "Digital Media Interface",
    isPlaceholder: true
  }
];
