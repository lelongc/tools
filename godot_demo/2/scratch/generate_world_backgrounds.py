import os

output_dir = r"d:\folder\tools\godot_demo\2\assets\sprites\environment\worlds"
os.makedirs(output_dir, exist_ok=True)

# World 2: Stone Quarry
sky_w02 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 400" width="1080" height="400">
  <defs>
    <linearGradient id="skyGrad2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#bf502b"/>
      <stop offset="45%" stop-color="#ea7c3f"/>
      <stop offset="85%" stop-color="#f5b866"/>
      <stop offset="100%" stop-color="#fae39d"/>
    </linearGradient>
    <linearGradient id="mesaGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7a3422"/>
      <stop offset="100%" stop-color="#4a1c12"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="400" fill="url(#skyGrad2)"/>
  <circle cx="220" cy="180" r="55" fill="#fff4cc" opacity="0.9"/>
  <!-- Distant Desert Mesas -->
  <path d="M-20,330 L110,260 L240,260 L320,330 L450,240 L590,240 L690,340 L820,270 L960,270 L1100,340 L1100,400 L-20,400 Z" fill="url(#mesaGrad)" opacity="0.6"/>
  <!-- Closer Quarry Ridges -->
  <path d="M-10,350 L160,310 L260,310 L390,360 L520,290 L670,290 L780,360 L910,310 L1090,360 L1090,400 L-10,400 Z" fill="#3a160e" opacity="0.85"/>
  <!-- Sunset Dust Clouds -->
  <g fill="#d86e42" opacity="0.4">
    <ellipse cx="420" cy="120" rx="140" ry="24"/>
    <ellipse cx="780" cy="160" rx="180" ry="28"/>
    <ellipse cx="160" cy="80" rx="100" ry="20"/>
  </g>
</svg>"""

cav_w02 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 700" width="540" height="700">
  <defs>
    <linearGradient id="quarryCav" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#382218"/>
      <stop offset="100%" stop-color="#1e100a"/>
    </linearGradient>
    <linearGradient id="sandstone" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#6e4530"/>
      <stop offset="100%" stop-color="#422517"/>
    </linearGradient>
  </defs>
  <rect width="540" height="700" fill="url(#quarryCav)"/>
  <!-- Sandstone Strata Layers -->
  <g fill="url(#sandstone)" stroke="#1a0c06" stroke-width="2" opacity="0.75">
    <rect x="10" y="30" width="160" height="48" rx="3"/>
    <rect x="180" y="30" width="180" height="48" rx="3"/>
    <rect x="370" y="30" width="160" height="48" rx="3"/>
    <rect x="5" y="88" width="110" height="52" rx="3"/>
    <rect x="125" y="88" width="200" height="52" rx="3"/>
    <rect x="335" y="88" width="200" height="52" rx="3"/>
    <rect x="15" y="150" width="170" height="50" rx="3"/>
    <rect x="195" y="150" width="160" height="50" rx="3"/>
    <rect x="365" y="150" width="165" height="50" rx="3"/>
    <rect x="5" y="210" width="130" height="52" rx="3"/>
    <rect x="145" y="210" width="180" height="52" rx="3"/>
    <rect x="335" y="210" width="200" height="52" rx="3"/>
    <rect x="10" y="272" width="170" height="50" rx="3"/>
    <rect x="190" y="272" width="170" height="50" rx="3"/>
    <rect x="370" y="272" width="160" height="50" rx="3"/>
    <rect x="5" y="332" width="120" height="52" rx="3"/>
    <rect x="135" y="332" width="190" height="52" rx="3"/>
    <rect x="335" y="332" width="200" height="52" rx="3"/>
    <rect x="15" y="394" width="170" height="50" rx="3"/>
    <rect x="195" y="394" width="160" height="50" rx="3"/>
    <rect x="365" y="394" width="165" height="50" rx="3"/>
    <rect x="5" y="454" width="130" height="52" rx="3"/>
    <rect x="145" y="454" width="180" height="52" rx="3"/>
    <rect x="335" y="454" width="200" height="52" rx="3"/>
    <rect x="10" y="516" width="170" height="50" rx="3"/>
    <rect x="190" y="516" width="170" height="50" rx="3"/>
    <rect x="370" y="516" width="160" height="50" rx="3"/>
    <rect x="5" y="576" width="120" height="52" rx="3"/>
    <rect x="135" y="576" width="190" height="52" rx="3"/>
    <rect x="335" y="576" width="200" height="52" rx="3"/>
    <rect x="15" y="638" width="170" height="52" rx="3"/>
    <rect x="195" y="638" width="160" height="52" rx="3"/>
    <rect x="365" y="638" width="165" height="52" rx="3"/>
  </g>
  <!-- Mining Scaffolding & Beams -->
  <g stroke="#26140b" stroke-width="6" opacity="0.6">
    <line x1="80" y1="0" x2="80" y2="700"/>
    <line x1="460" y1="0" x2="460" y2="700"/>
    <line x1="40" y1="180" x2="120" y2="180"/>
    <line x1="420" y1="180" x2="500" y2="180"/>
    <line x1="40" y1="420" x2="120" y2="420"/>
    <line x1="420" y1="420" x2="500" y2="420"/>
  </g>
</svg>"""

cliff_w02 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60">
  <defs>
    <linearGradient id="sandCliff" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#e28c46"/>
      <stop offset="100%" stop-color="#8a441e"/>
    </linearGradient>
  </defs>
  <rect y="16" width="240" height="44" fill="#582a12"/>
  <path d="M0,0 L240,0 L240,16 L220,24 L190,14 L160,26 L130,16 L90,24 L50,15 L0,22 Z" fill="url(#sandCliff)"/>
</svg>"""

# World 3: Steampunk Industrial
sky_w03 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 400" width="1080" height="400">
  <defs>
    <linearGradient id="skyGrad3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3d3733"/>
      <stop offset="50%" stop-color="#735a42"/>
      <stop offset="100%" stop-color="#ad875e"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="400" fill="url(#skyGrad3)"/>
  <circle cx="850" cy="140" r="45" fill="#f0d39e" opacity="0.6"/>
  <!-- Factory Chimneys & Roof Silhouettes -->
  <path d="M-10,400 L-10,290 L40,290 L40,220 L75,220 L75,290 L140,290 L180,250 L220,290 L300,290 L300,180 L340,180 L340,290 L440,290 L480,240 L520,290 L620,290 L620,160 L665,160 L665,290 L780,290 L820,250 L860,290 L950,290 L950,190 L990,190 L990,290 L1090,290 L1090,400 Z" fill="#201a16" opacity="0.75"/>
  <!-- Smoke Plumes -->
  <g fill="#423a35" opacity="0.5">
    <ellipse cx="60" cy="180" rx="35" ry="50"/>
    <ellipse cx="75" cy="130" rx="55" ry="60"/>
    <ellipse cx="320" cy="140" rx="40" ry="55"/>
    <ellipse cx="335" cy="80" rx="65" ry="70"/>
    <ellipse cx="645" cy="110" rx="50" ry="65"/>
    <ellipse cx="660" cy="50" rx="80" ry="75"/>
    <ellipse cx="970" cy="150" rx="45" ry="50"/>
    <ellipse cx="985" cy="90" rx="70" ry="65"/>
  </g>
</svg>"""

cav_w03 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 700" width="540" height="700">
  <defs>
    <linearGradient id="steamCav" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#231e1a"/>
      <stop offset="100%" stop-color="#14110e"/>
    </linearGradient>
    <linearGradient id="copperPipe" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#8c5835"/>
      <stop offset="50%" stop-color="#d48a57"/>
      <stop offset="100%" stop-color="#5e351b"/>
    </linearGradient>
  </defs>
  <rect width="540" height="700" fill="url(#steamCav)"/>
  <!-- Giant Cog Gear Silhouettes -->
  <g fill="#181411" stroke="#33271f" stroke-width="3" opacity="0.5">
    <circle cx="120" cy="220" r="95"/>
    <circle cx="120" cy="220" r="45" fill="#231e1a"/>
    <circle cx="420" cy="450" r="130"/>
    <circle cx="420" cy="450" r="60" fill="#231e1a"/>
  </g>
  <!-- Copper Pipes Running Down & Across -->
  <g fill="none" stroke="url(#copperPipe)" stroke-linecap="square">
    <path d="M45,0 L45,340 L160,340 L160,700" stroke-width="16"/>
    <path d="M495,0 L495,260 L380,260 L380,700" stroke-width="14"/>
    <path d="M220,0 L220,700" stroke-width="10"/>
  </g>
  <!-- Pipe Joints & Rivets -->
  <circle cx="45" cy="340" r="14" fill="#a8683c"/>
  <circle cx="160" cy="340" r="14" fill="#a8683c"/>
  <circle cx="495" cy="260" r="12" fill="#a8683c"/>
  <circle cx="380" cy="260" r="12" fill="#a8683c"/>
</svg>"""

cliff_w03 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60">
  <rect y="16" width="240" height="44" fill="#261f1a"/>
  <!-- Cast Iron Grating with Rivets -->
  <rect y="0" width="240" height="18" fill="#54473e" stroke="#1c1612" stroke-width="2"/>
  <g fill="#caa072">
    <circle cx="20" cy="9" r="3"/>
    <circle cx="60" cy="9" r="3"/>
    <circle cx="100" cy="9" r="3"/>
    <circle cx="140" cy="9" r="3"/>
    <circle cx="180" cy="9" r="3"/>
    <circle cx="220" cy="9" r="3"/>
  </g>
</svg>"""

# World 4: Lava Core Imperial
sky_w04 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 400" width="1080" height="400">
  <defs>
    <linearGradient id="skyGrad4" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#140404"/>
      <stop offset="45%" stop-color="#4a0e0e"/>
      <stop offset="80%" stop-color="#991b1b"/>
      <stop offset="100%" stop-color="#f97316"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="400" fill="url(#skyGrad4)"/>
  <!-- Volcanic Ridge Silhouettes -->
  <path d="M-20,320 L150,230 L290,290 L420,180 L580,310 L740,210 L920,330 L1100,240 L1100,400 L-20,400 Z" fill="#260606" opacity="0.85"/>
  <!-- Lava Glow & Lightning Streaks -->
  <path d="M420,180 L440,230 L430,270 L460,330" stroke="#fef08a" stroke-width="4" fill="none" opacity="0.9"/>
  <path d="M740,210 L730,260 L755,300" stroke="#ffedd5" stroke-width="3" fill="none" opacity="0.8"/>
  <!-- Ash Clouds -->
  <g fill="#360a0a" opacity="0.6">
    <ellipse cx="280" cy="110" rx="140" ry="40"/>
    <ellipse cx="620" cy="90" rx="180" ry="45"/>
    <ellipse cx="940" cy="130" rx="130" ry="35"/>
  </g>
</svg>"""

cav_w04 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 700" width="540" height="700">
  <defs>
    <linearGradient id="lavaCav" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e0505"/>
      <stop offset="100%" stop-color="#0d0202"/>
    </linearGradient>
    <linearGradient id="magmaStream" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ea580c"/>
      <stop offset="50%" stop-color="#ef4444"/>
      <stop offset="100%" stop-color="#eab308"/>
    </linearGradient>
  </defs>
  <rect width="540" height="700" fill="url(#lavaCav)"/>
  <!-- Hexagonal Basalt Columns -->
  <g fill="#2d0a0a" stroke="#120202" stroke-width="3" opacity="0.75">
    <polygon points="50,60 90,80 90,200 50,220 10,200 10,80"/>
    <polygon points="140,40 180,60 180,240 140,260 100,240 100,60"/>
    <polygon points="400,80 440,100 440,260 400,280 360,260 360,100"/>
    <polygon points="490,50 530,70 530,220 490,240 450,220 450,70"/>
    <polygon points="60,340 100,360 100,520 60,540 20,520 20,360"/>
    <polygon points="150,380 190,400 190,580 150,600 110,580 110,400"/>
    <polygon points="380,360 420,380 420,540 380,560 340,540 340,380"/>
    <polygon points="470,390 510,410 510,590 470,610 430,590 430,410"/>
  </g>
  <!-- Molten Magma Streams running vertically -->
  <g fill="none" stroke="url(#magmaStream)" stroke-linecap="round" filter="drop-shadow(0 0 8px #f97316)">
    <path d="M260,0 C275,100 240,180 265,270 C280,360 250,450 270,550 C285,630 260,700 260,700" stroke-width="12"/>
    <path d="M265,270 C310,320 330,400 315,480" stroke-width="6"/>
  </g>
</svg>"""

cliff_w04 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60">
  <rect y="16" width="240" height="44" fill="#1c0505"/>
  <path d="M0,0 L240,0 L240,16 L210,24 L180,15 L150,26 L120,16 L90,25 L50,15 L0,22 Z" fill="#380a0a"/>
  <!-- Glowing Magma Vein on Edge -->
  <path d="M0,4 Q40,12 80,4 T160,5 T240,4" stroke="#f97316" stroke-width="4" fill="none"/>
</svg>"""

# World 5: Crystal Void Citadel
sky_w05 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 400" width="1080" height="400">
  <defs>
    <linearGradient id="skyGrad5" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#08020f"/>
      <stop offset="45%" stop-color="#21083d"/>
      <stop offset="85%" stop-color="#4a157a"/>
      <stop offset="100%" stop-color="#8023c7"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="400" fill="url(#skyGrad5)"/>
  <!-- Twin Crescent Moons -->
  <circle cx="820" cy="110" r="42" fill="#e9d5ff"/>
  <circle cx="835" cy="104" r="38" fill="#21083d"/>
  <circle cx="750" cy="150" r="22" fill="#c084fc" opacity="0.8"/>
  <circle cx="758" cy="146" r="20" fill="#21083d"/>
  <!-- Shimmering Void Stars -->
  <g fill="#ffffff" opacity="0.85">
    <circle cx="120" cy="60" r="2.5"/><circle cx="280" cy="140" r="3"/><circle cx="450" cy="50" r="2"/>
    <circle cx="610" cy="120" r="2.5"/><circle cx="940" cy="70" r="3"/><circle cx="1020" cy="160" r="2"/>
  </g>
  <!-- Spire Silhouettes -->
  <path d="M-10,400 L50,280 L90,400 L220,240 L250,400 L380,260 L410,400 L620,220 L660,400 L810,250 L840,400 L980,230 L1010,400 L1100,400 Z" fill="#140424" opacity="0.7"/>
</svg>"""

cav_w05 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 700" width="540" height="700">
  <defs>
    <linearGradient id="crysCav" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#140321"/>
      <stop offset="100%" stop-color="#09010f"/>
    </linearGradient>
    <linearGradient id="amethyst" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#d8b4fe"/>
      <stop offset="50%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#581c87"/>
    </linearGradient>
  </defs>
  <rect width="540" height="700" fill="url(#crysCav)"/>
  <!-- Giant Amethyst Geodes Jutting from Walls -->
  <polygon points="0,140 95,110 130,165 60,205 0,185" fill="url(#amethyst)" stroke="#3b0764" stroke-width="2"/>
  <polygon points="0,320 120,280 155,345 75,395 0,370" fill="url(#amethyst)" stroke="#3b0764" stroke-width="2"/>
  <polygon points="0,520 110,485 145,550 70,595 0,575" fill="url(#amethyst)" stroke="#3b0764" stroke-width="2"/>

  <polygon points="540,180 445,150 410,205 480,245 540,225" fill="url(#amethyst)" stroke="#3b0764" stroke-width="2"/>
  <polygon points="540,380 420,340 385,405 465,455 540,430" fill="url(#amethyst)" stroke="#3b0764" stroke-width="2"/>
  <polygon points="540,560 430,525 395,590 470,635 540,615" fill="url(#amethyst)" stroke="#3b0764" stroke-width="2"/>
  <!-- Soft Violet Glow Aura -->
  <circle cx="100" cy="160" r="70" fill="#a855f7" opacity="0.15"/>
  <circle cx="440" cy="380" r="85" fill="#a855f7" opacity="0.15"/>
</svg>"""

cliff_w05 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60">
  <rect y="16" width="240" height="44" fill="#180426"/>
  <path d="M0,0 L240,0 L240,16 L215,22 L185,15 L155,24 L125,16 L95,23 L55,15 L0,22 Z" fill="#3b0764"/>
  <!-- Crystal Crusted Trim -->
  <polygon points="30,16 40,4 50,16" fill="#d8b4fe"/>
  <polygon points="90,16 102,2 114,16" fill="#c084fc"/>
  <polygon points="170,16 180,5 190,16" fill="#e9d5ff"/>
</svg>"""

# World 6: Cyber Tech Bunker
sky_w06 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 400" width="1080" height="400">
  <defs>
    <linearGradient id="skyGrad6" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#020d18"/>
      <stop offset="50%" stop-color="#072238"/>
      <stop offset="100%" stop-color="#0d3d63"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="400" fill="url(#skyGrad6)"/>
  <!-- Cyan Grid Floor on horizon -->
  <g stroke="#06b6d4" stroke-width="1" opacity="0.25">
    <line x1="0" y1="280" x2="1080" y2="280"/>
    <line x1="0" y1="310" x2="1080" y2="310"/>
    <line x1="0" y1="350" x2="1080" y2="350"/>
    <line x1="540" y1="260" x2="0" y2="400"/>
    <line x1="540" y1="260" x2="270" y2="400"/>
    <line x1="540" y1="260" x2="810" y2="400"/>
    <line x1="540" y1="260" x2="1080" y2="400"/>
  </g>
  <!-- Cyberpunk Megastructure Silhouettes -->
  <path d="M-10,400 L-10,240 L80,240 L80,200 L140,200 L140,240 L220,240 L260,160 L320,160 L350,240 L480,240 L510,130 L570,130 L600,240 L720,240 L760,180 L820,180 L860,240 L980,240 L1020,150 L1070,150 L1090,240 L1090,400 Z" fill="#03111f" opacity="0.85"/>
  <!-- Neon Light Bars on towers -->
  <line x1="290" y1="165" x2="290" y2="230" stroke="#06b6d4" stroke-width="3"/>
  <line x1="540" y1="135" x2="540" y2="230" stroke="#ec4899" stroke-width="3"/>
  <line x1="790" y1="185" x2="790" y2="230" stroke="#06b6d4" stroke-width="3"/>
  <line x1="1045" y1="155" x2="1045" y2="230" stroke="#a855f7" stroke-width="3"/>
</svg>"""

cav_w06 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 700" width="540" height="700">
  <defs>
    <linearGradient id="cyberCav" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#05121e"/>
      <stop offset="100%" stop-color="#02090f"/>
    </linearGradient>
  </defs>
  <rect width="540" height="700" fill="url(#cyberCav)"/>
  <!-- Titanium Wall Panels -->
  <g fill="#0b1e2e" stroke="#040b12" stroke-width="3">
    <rect x="20" y="30" width="235" height="180" rx="6"/>
    <rect x="285" y="30" width="235" height="180" rx="6"/>
    <rect x="20" y="240" width="235" height="180" rx="6"/>
    <rect x="285" y="240" width="235" height="180" rx="6"/>
    <rect x="20" y="450" width="235" height="180" rx="6"/>
    <rect x="285" y="450" width="235" height="180" rx="6"/>
  </g>
  <!-- Glowing Circuit Traces -->
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M40,50 L120,50 L140,80 L200,80" stroke="#06b6d4" stroke-width="3"/>
    <circle cx="200" cy="80" r="4" fill="#06b6d4"/>
    <path d="M500,260 L420,260 L400,300 L340,300" stroke="#ec4899" stroke-width="3"/>
    <circle cx="340" cy="300" r="4" fill="#ec4899"/>
    <path d="M60,480 L140,480 L160,520 L220,520" stroke="#06b6d4" stroke-width="3"/>
    <circle cx="220" cy="520" r="4" fill="#06b6d4"/>
    <path d="M480,480 L400,480 L380,530 L320,530" stroke="#a855f7" stroke-width="3"/>
    <circle cx="320" cy="530" r="4" fill="#a855f7"/>
  </g>
</svg>"""

cliff_w06 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60">
  <rect y="16" width="240" height="44" fill="#081726"/>
  <rect y="0" width="240" height="18" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
  <line x1="0" y1="17" x2="240" y2="17" stroke="#06b6d4" stroke-width="3"/>
</svg>"""

# World 7: Toxic Jungle Cavern
sky_w07 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 400" width="1080" height="400">
  <defs>
    <linearGradient id="skyGrad7" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#041408"/>
      <stop offset="45%" stop-color="#0d3316"/>
      <stop offset="85%" stop-color="#1b5c29"/>
      <stop offset="100%" stop-color="#3eb057"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="400" fill="url(#skyGrad7)"/>
  <!-- Jungle Canopy Silhouettes -->
  <path d="M-20,400 Q120,220 280,310 T680,260 T1100,320 L1100,400 Z" fill="#051a0b" opacity="0.8"/>
  <path d="M-20,400 Q180,280 380,350 T880,300 T1100,370 L1100,400 Z" fill="#0b2912" opacity="0.6"/>
  <!-- Glowing Spores -->
  <g fill="#86efac" opacity="0.75">
    <circle cx="160" cy="180" r="4"/><circle cx="340" cy="120" r="5"/><circle cx="580" cy="200" r="4"/>
    <circle cx="780" cy="140" r="5"/><circle cx="960" cy="170" r="4"/>
  </g>
</svg>"""

cav_w07 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 700" width="540" height="700">
  <defs>
    <linearGradient id="toxicCav" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#081a0e"/>
      <stop offset="100%" stop-color="#030d07"/>
    </linearGradient>
  </defs>
  <rect width="540" height="700" fill="url(#toxicCav)"/>
  <!-- Tangled Vine Roots -->
  <g fill="none" stroke="#14381d" stroke-linecap="round" opacity="0.8">
    <path d="M40,0 C30,90 90,180 55,290 C30,380 80,480 60,600 L60,700" stroke-width="14"/>
    <path d="M500,0 C510,120 440,220 480,330 C510,430 460,540 480,700" stroke-width="16"/>
  </g>
  <!-- Bioluminescent Toxic Mushrooms -->
  <g fill="#22c55e">
    <path d="M35,260 Q65,220 95,260 Z"/>
    <path d="M465,400 Q500,350 535,400 Z"/>
    <path d="M30,520 Q55,480 80,520 Z"/>
  </g>
</svg>"""

cliff_w07 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60">
  <rect y="16" width="240" height="44" fill="#0b2413"/>
  <path d="M0,0 L240,0 L240,16 Q210,28 180,16 Q150,28 120,16 Q90,28 60,16 Q30,28 0,16 Z" fill="#15803d"/>
</svg>"""

# World 8: Sub-Zero Glacier Vault
sky_w08 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 400" width="1080" height="400">
  <defs>
    <linearGradient id="skyGrad8" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#020814"/>
      <stop offset="45%" stop-color="#061d36"/>
      <stop offset="85%" stop-color="#0e3d61"/>
      <stop offset="100%" stop-color="#1e6b9c"/>
    </linearGradient>
    <linearGradient id="aurora" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#2dd4bf" stop-opacity="0"/>
      <stop offset="35%" stop-color="#2dd4bf" stop-opacity="0.6"/>
      <stop offset="70%" stop-color="#a855f7" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#2dd4bf" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="400" fill="url(#skyGrad8)"/>
  <!-- Aurora Borealis Curtains -->
  <path d="M-20,80 Q260,20 540,90 T1100,50 L1100,240 Q780,180 480,220 T-20,190 Z" fill="url(#aurora)"/>
  <!-- Glacier Mountain Peaks -->
  <polygon points="120,400 280,240 440,400" fill="#0d2b45" opacity="0.85"/>
  <polygon points="280,240 320,280 440,400 280,400" fill="#153e61" opacity="0.85"/>
  <polygon points="560,400 740,210 920,400" fill="#0d2b45" opacity="0.85"/>
  <polygon points="740,210 790,260 920,400 740,400" fill="#153e61" opacity="0.85"/>
</svg>"""

cav_w08 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 700" width="540" height="700">
  <defs>
    <linearGradient id="glacierCav" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#072033"/>
      <stop offset="100%" stop-color="#03101c"/>
    </linearGradient>
    <linearGradient id="iceBlock" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
  </defs>
  <rect width="540" height="700" fill="url(#glacierCav)"/>
  <!-- Giant Hanging Icicles from ceiling -->
  <g fill="url(#iceBlock)" opacity="0.85">
    <polygon points="20,0 45,0 32,180"/>
    <polygon points="60,0 80,0 70,120"/>
    <polygon points="110,0 145,0 128,220"/>
    <polygon points="220,0 245,0 232,140"/>
    <polygon points="360,0 395,0 378,210"/>
    <polygon points="440,0 465,0 452,150"/>
    <polygon points="490,0 520,0 505,190"/>
  </g>
</svg>"""

cliff_w08 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60">
  <rect y="16" width="240" height="44" fill="#082338"/>
  <path d="M0,0 L240,0 L240,16 L220,24 L190,14 L160,26 L130,16 L90,25 L50,15 L0,22 Z" fill="#e0f2fe"/>
  <!-- Hanging Ice Fringe -->
  <polygon points="30,16 38,32 46,16" fill="#38bdf8"/>
  <polygon points="110,16 117,28 124,16" fill="#38bdf8"/>
  <polygon points="180,16 188,34 196,16" fill="#38bdf8"/>
</svg>"""

# World 9: Ancient Dragon Abyss
sky_w09 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 400" width="1080" height="400">
  <defs>
    <linearGradient id="skyGrad9" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#240202"/>
      <stop offset="45%" stop-color="#590707"/>
      <stop offset="85%" stop-color="#991b1b"/>
      <stop offset="100%" stop-color="#b91c1c"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="400" fill="url(#skyGrad9)"/>
  <circle cx="820" cy="120" r="50" fill="#fecaca" opacity="0.6"/>
  <!-- Jagged Dragon Peaks -->
  <polygon points="60,400 180,220 300,400" fill="#260404" opacity="0.85"/>
  <polygon points="380,400 520,180 660,400" fill="#260404" opacity="0.85"/>
  <polygon points="760,400 900,200 1040,400" fill="#260404" opacity="0.85"/>
  <!-- Flying Dragon Silhouettes -->
  <path d="M340,120 Q360,110 380,125 Q400,105 420,120 Q380,135 340,120 Z" fill="#140101"/>
  <path d="M720,80 Q735,70 750,85 Q765,65 780,80 Q750,95 720,80 Z" fill="#140101"/>
</svg>"""

cav_w09 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 700" width="540" height="700">
  <defs>
    <linearGradient id="dragonCav" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1f0303"/>
      <stop offset="100%" stop-color="#0a0101"/>
    </linearGradient>
  </defs>
  <rect width="540" height="700" fill="url(#dragonCav)"/>
  <!-- Giant Dragon Rib Cage Embedded in Wall -->
  <g fill="none" stroke="#e2d9d2" stroke-width="12" stroke-linecap="round" opacity="0.65">
    <path d="M40,140 C140,100 240,160 250,260"/>
    <path d="M40,240 C140,200 240,260 250,360"/>
    <path d="M40,340 C140,300 240,360 250,460"/>
    <path d="M40,440 C140,400 240,460 250,560"/>

    <path d="M500,160 C400,120 300,180 290,280"/>
    <path d="M500,260 C400,220 300,280 290,380"/>
    <path d="M500,360 C400,320 300,380 290,480"/>
  </g>
</svg>"""

cliff_w09 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60">
  <rect y="16" width="240" height="44" fill="#1c0303"/>
  <path d="M0,0 L240,0 L240,16 L210,24 L180,15 L150,25 L120,16 L90,25 L50,15 L0,22 Z" fill="#450a0a"/>
</svg>"""

# World 10: Celestial Singularity Nexus
sky_w10 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 400" width="1080" height="400">
  <defs>
    <linearGradient id="skyGrad10" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#020008"/>
      <stop offset="50%" stop-color="#0d041e"/>
      <stop offset="100%" stop-color="#1f093d"/>
    </linearGradient>
    <radialGradient id="singularityGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#000000"/>
      <stop offset="60%" stop-color="#000000"/>
      <stop offset="75%" stop-color="#f59e0b"/>
      <stop offset="90%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1080" height="400" fill="url(#skyGrad10)"/>
  <!-- Singularity Black Hole Vortex -->
  <circle cx="540" cy="180" r="140" fill="url(#singularityGlow)"/>
  <ellipse cx="540" cy="180" rx="220" ry="35" fill="none" stroke="#fbbf24" stroke-width="6" opacity="0.8" transform="rotate(-15, 540, 180)"/>
  <!-- Starlight Shimmer -->
  <g fill="#fef08a" opacity="0.9">
    <circle cx="120" cy="80" r="3"/><circle cx="260" cy="150" r="2.5"/><circle cx="390" cy="60" r="3"/>
    <circle cx="720" cy="70" r="3"/><circle cx="890" cy="140" r="2.5"/><circle cx="980" cy="60" r="3"/>
  </g>
</svg>"""

cav_w10 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 700" width="540" height="700">
  <defs>
    <linearGradient id="celestCav" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0d031c"/>
      <stop offset="100%" stop-color="#04010a"/>
    </linearGradient>
  </defs>
  <rect width="540" height="700" fill="url(#celestCav)"/>
  <!-- Floating Monolith Shards -->
  <g fill="#1b0833" stroke="#f59e0b" stroke-width="2" opacity="0.8">
    <polygon points="60,80 120,50 140,160 80,180"/>
    <polygon points="420,120 480,90 500,200 440,220"/>
    <polygon points="80,340 140,310 160,420 100,440"/>
    <polygon points="400,380 460,350 480,460 420,480"/>
    <polygon points="70,540 130,510 150,620 90,640"/>
    <polygon points="410,560 470,530 490,640 430,660"/>
  </g>
  <!-- Astral Rune Circles in Center -->
  <circle cx="270" cy="350" r="80" fill="none" stroke="#fbbf24" stroke-width="2" opacity="0.4"/>
  <circle cx="270" cy="350" r="50" fill="none" stroke="#c084fc" stroke-width="2" opacity="0.4"/>
</svg>"""

cliff_w10 = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60">
  <rect y="16" width="240" height="44" fill="#110324"/>
  <rect y="0" width="240" height="18" fill="#270a4a" stroke="#fbbf24" stroke-width="2"/>
  <line x1="0" y1="17" x2="240" y2="17" stroke="#fbbf24" stroke-width="3"/>
</svg>"""

files = {
    "sky_w02_quarry.svg": sky_w02, "cavern_w02_quarry.svg": cav_w02, "cliff_w02_quarry.svg": cliff_w02,
    "sky_w03_industrial.svg": sky_w03, "cavern_w03_industrial.svg": cav_w03, "cliff_w03_industrial.svg": cliff_w03,
    "sky_w04_lava.svg": sky_w04, "cavern_w04_lava.svg": cav_w04, "cliff_w04_lava.svg": cliff_w04,
    "sky_w05_crystal.svg": sky_w05, "cavern_w05_crystal.svg": cav_w05, "cliff_w05_crystal.svg": cliff_w05,
    "sky_w06_cyber.svg": sky_w06, "cavern_w06_cyber.svg": cav_w06, "cliff_w06_cyber.svg": cliff_w06,
    "sky_w07_toxic.svg": sky_w07, "cavern_w07_toxic.svg": cav_w07, "cliff_w07_toxic.svg": cliff_w07,
    "sky_w08_glacier.svg": sky_w08, "cavern_w08_glacier.svg": cav_w08, "cliff_w08_glacier.svg": cliff_w08,
    "sky_w09_dragon.svg": sky_w09, "cavern_w09_dragon.svg": cav_w09, "cliff_w09_dragon.svg": cliff_w09,
    "sky_w10_celestial.svg": sky_w10, "cavern_w10_celestial.svg": cav_w10, "cliff_w10_celestial.svg": cliff_w10,
}

for fname, content in files.items():
    fpath = os.path.join(output_dir, fname)
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print("Created:", fname)

print("All world assets generated successfully!")
