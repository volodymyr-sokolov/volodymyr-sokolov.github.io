/* =========================================================================
   catalog.js — the whole-project antenna catalogue, derived from
   antenna_atlas.md. Bilingual (EN default, UK). Each antenna carries an
   analysis-method complexity level:
     1 = analytical / closed-form   (I,  light green)
     2 = semi-analytical            (II, yellow)  — array factor, PO, GO, aperture
     3 = full-wave numerical        (III,orange)  — MoM/NEC, FEM, FDTD
   Tag arrays:  std = wireless standards, mod = modulations,
                mth = calculation method(s).
   `href` marks the antenna's interactive page; anchor id === antenna id.
   ========================================================================= */

const CATALOG = [
  {
    id:1, en:"Wire Antennas", uk:"Дротові антени",
    descEn:"Conductors carrying a standing or traveling current — the oldest and most intuitive antenna family.",
    descUk:"Провідники з нерухомою чи біжучою хвилею струму — найстаріша й найінтуїтивніша сім'я антен.",
    antennas:[
      {id:"dipole", lvl:2, href:"wire.html#dipole",
        en:"Dipole (half-wave)", uk:"Диполь (напівхвильовий)", alias:"dipole half-wave induced EMF NEC диполь",
        dEn:"Two collinear conductors fed at the centre; the fundamental reference antenna.",
        dUk:"Два колінеарні провідники, що живляться в центрі; фундаментальна еталонна антена.",
        std:["Wi-Fi 802.11","FM","Amateur","TETRA"], mod:["OFDM","DSSS/CCK","FM","π/4-DQPSK"],
        mth:["MoM","Induced-EMF"]},
      {id:"folded-dipole", lvl:2, href:"wire.html#folded-dipole",
        en:"Folded Dipole", uk:"Складений диполь", alias:"folded dipole transmission line складений",
        dEn:"Dipole with a parallel folded conductor for higher input impedance and bandwidth.",
        dUk:"Диполь із паралельним складеним провідником для вищого вхідного опору та смуги.",
        std:["FM","TV / Yagi feed"], mod:["FM","8-VSB","COFDM"], mth:["MoM","Transmission-line"]},
      {id:"monopole", lvl:2, href:"wire.html#monopole",
        en:"Monopole / Whip", uk:"Монополь / штир", alias:"monopole whip quarter-wave image монополь штир",
        dEn:"Quarter-wave conductor over a ground plane; the whip antenna.",
        dUk:"Чвертьхвильовий провідник над площиною землі; штирова антена.",
        std:["GSM","LTE","CB","LoRaWAN","Sigfox"], mod:["GMSK","QAM/OFDM","GFSK","CSS","DBPSK"],
        mth:["MoM","Induced-EMF + image"]},
      {id:"ifa", lvl:3, href:"wire.html#ifa",
        en:"Inverted-L / Inverted-F (ILA/IFA)", uk:"Обернена L/F-антена (ILA/IFA)", alias:"inverted L F IFA ILA обернена",
        dEn:"Monopole bent parallel to the ground plane to reduce height.",
        dUk:"Монополь, зігнутий паралельно площині землі для зменшення висоти.",
        std:["ISM 433/868/915","Bluetooth","Wi-Fi modules"], mod:["GFSK","FSK","OOK","DSSS"], mth:["MoM","FEM"]},
      {id:"pifa", lvl:3, href:"wire.html#pifa",
        en:"Planar Inverted-F (PIFA)", uk:"Планарна обернена F (PIFA)", alias:"PIFA planar inverted F handset планарна",
        dEn:"Compact IFA variant widely used inside mobile handsets.",
        dUk:"Компактний варіант IFA, широко застосований у мобільних телефонах.",
        std:["GSM","UMTS","LTE","5G NR","Wi-Fi","BT"], mod:["GMSK","QPSK","QAM/OFDM","GFSK"],
        mth:["FEM","Cavity model"]},
      {id:"loop", lvl:1, href:"wire.html#loop",
        en:"Loop Antenna (small / magnetic)", uk:"Рамкова (петльова) антена", alias:"loop magnetic small NFC Biot Savart рамкова петльова",
        dEn:"Closed conductor loop, magnetic-field coupled; efficient at LF in small form.",
        dUk:"Замкнутий провідний контур зі зв'язком за магнітним полем; ефективний на НЧ у малих розмірах.",
        std:["NFC (14443/18092)","LF RFID 125 kHz","AM rx"], mod:["ASK/OOK","Load mod.","AM"],
        mth:["Quasistatic (Biot–Savart)","MoM"]},
      {id:"helical", lvl:2, href:"wire.html#helical",
        en:"Helical Antenna", uk:"Гвинтова (спіральна) антена", alias:"helical helix axial normal Kraus гвинтова спіральна",
        dEn:"Wire wound in a helix — normal mode (small, omni) or axial mode (directional, circular pol).",
        dUk:"Провідник, намотаний спіраллю — нормальний режим (малий, всенаправлений) або осьовий (спрямований, кругова поляризація).",
        std:["GPS/GNSS","SATCOM","UHF RFID"], mod:["BPSK","QPSK","FM"], mth:["MoM","Traveling-wave (Kraus)"]},
      {id:"rubber-duck", lvl:3, href:"wire.html#rubber-duck",
        en:"Rubber Duck Antenna", uk:"Антена «гумова качечка»", alias:"rubber duck helical monopole гумова качечка",
        dEn:"Flexible dielectric-jacketed helical monopole — the ubiquitous handheld antenna.",
        dUk:"Гнучкий спіральний монополь у діелектричній оболонці — поширена ручна антена.",
        std:["Wi-Fi","BT","LTE CPE","LMR/PMR"], mod:["OFDM","GFSK","GMSK","FSK"], mth:["MoM (helical monopole)"]},
      {id:"yagi", lvl:3, href:"wire.html#yagi",
        en:"Yagi-Uda Antenna", uk:"Антена Уда-Яги", alias:"yagi uda director reflector parasitic NEC яги уда",
        dEn:"Driven dipole with parasitic reflector and directors for high directional gain.",
        dUk:"Активний диполь із пасивним рефлектором та директорами для високого спрямованого підсилення.",
        std:["ATSC","DVB-T","802.11 PtP","Amateur"], mod:["8-VSB","COFDM/OFDM","FM"], mth:["MoM (NEC)"]},
      {id:"lpda", lvl:3, href:"wire.html#lpda",
        en:"Log-Periodic Dipole Array (LPDA)", uk:"Логоперіодична дипольна решітка (LPDA)", alias:"log periodic LPDA frequency independent логоперіодична",
        dEn:"Array of graduated-length dipoles for wideband, frequency-independent performance.",
        dUk:"Масив диполів зростаючої довжини для широкосмугової, частотно-незалежної роботи.",
        std:["EMC/EMI","Broadband TV","SIGINT"], mod:["Broadband / agnostic"], mth:["MoM (NEC)"]},
      {id:"discone", lvl:3, href:"wire.html#discone",
        en:"Discone Antenna", uk:"Дискоконусна антена", alias:"discone disc cone wideband body of revolution дискоконусна",
        dEn:"Disc-over-cone wideband omnidirectional antenna.",
        dUk:"Широкосмугова всенаправлена антена «диск над конусом».",
        std:["Scanner rx","VHF/UHF LMR"], mod:["FM","FSK","AM"], mth:["MoM","Body-of-revolution MoM"]},
      {id:"rhombic", lvl:1, href:"wire.html#rhombic",
        en:"Rhombic Antenna", uk:"Ромбічна антена", alias:"rhombic diamond traveling wave terminated ромбічна",
        dEn:"Large diamond-shaped traveling-wave antenna, terminated to avoid reflections.",
        dUk:"Велика антена біжучої хвилі у формі ромба, з узгодженим навантаженням.",
        std:["Long-haul HF (legacy)"], mod:["AM","SSB","CW"], mth:["Traveling-wave theory"]},
      {id:"beverage", lvl:1, href:"wire.html#beverage",
        en:"Beverage Antenna", uk:"Антена Бевереджа", alias:"beverage long wire traveling wave receiving бевереджа",
        dEn:"Long horizontal-wire traveling-wave antenna for HF/LF reception.",
        dUk:"Довгий горизонтальний провід біжучої хвилі для прийому КХ/ДХ.",
        std:["Amateur HF DXing","LF/HF monitoring"], mod:["AM","SSB","CW"], mth:["Traveling-wave theory"]},
      {id:"tfan", lvl:3, href:"wire.html#tfan",
        en:"T- / Fan-Dipole Antennas", uk:"T- та віялоподібні диполі", alias:"T fan dipole top loaded multiband HF віялоподібні",
        dEn:"Top-loaded or multi-element wire antennas for multiband HF operation.",
        dUk:"Дротові антени з верхнім навантаженням або кількома елементами для багатодіапазонного КХ.",
        std:["Amateur multiband HF"], mod:["SSB","CW","FT8"], mth:["MoM","Induced-EMF (multi-wire)"]}
    ]
  },
  {
    id:2, en:"Aperture Antennas", uk:"Апертурні антени",
    descEn:"A physical opening radiates the guided wave into space; gain follows the aperture area in wavelengths.",
    descUk:"Фізичний розкрив випромінює напрямну хвилю у простір; підсилення визначає площа розкриву в довжинах хвиль.",
    antennas:[
      {id:"horn", lvl:2, href:"aperture.html#horn",
        en:"Horn Antenna", uk:"Рупорна антена", alias:"horn pyramidal conical sectoral Fresnel aperture рупор рупорна",
        dEn:"Flared waveguide aperture giving moderate-to-high gain over wide bandwidth.",
        dUk:"Розширена апертура хвилеводу, що дає середнє-високе підсилення в широкій смузі.",
        std:["SATCOM feed","Radar X/Ku/Ka","5G mmWave FR2"], mod:["QAM","OFDM","Pulse"],
        mth:["Aperture (Fourier)","Physical optics","Fresnel integrals"]},
      {id:"slot", lvl:2, href:"aperture.html#slot",
        en:"Slot Antenna", uk:"Щілинна антена", alias:"slot Babinet complementary waveguide щілинна",
        dEn:"A slot cut into a conductor, acting as the complementary dipole (Babinet).",
        dUk:"Щілина в провіднику, що діє як комплементарний диполь (принцип Бабіне).",
        std:["Radar arrays","Wi-Fi","BS panels"], mod:["OFDM","QAM","Pulse"],
        mth:["Babinet's principle","MoM","Cavity model"]},
      {id:"waveguide", lvl:2, href:"aperture.html#waveguide",
        en:"Open-Ended Waveguide", uk:"Хвилеводна антена (відкритий кінець)", alias:"open ended waveguide flange aperture хвилеводна",
        dEn:"Simple aperture formed by an open waveguide flange.",
        dUk:"Проста апертура, утворена відкритим фланцем хвилеводу.",
        std:["Microwave links","Radar feed","SATCOM feed"], mod:["QAM","FM/Pulse"], mth:["Aperture (Fourier)"]},
      {id:"biconical", lvl:1, href:"aperture.html#biconical",
        en:"Biconical Antenna", uk:"Біконічна антена", alias:"biconical cone Schelkunoff wideband EMC біконічна",
        dEn:"Two cones joined at their apexes; wideband, omnidirectional in the H-plane.",
        dUk:"Два конуси, з'єднані вершинами; широкосмугова, всенаправлена в H-площині.",
        std:["EMC/EMI testing","Spectrum monitoring"], mod:["Broadband / agnostic"],
        mth:["Schelkunoff transmission-line","MoM"]}
    ]
  },
  {
    id:3, en:"Reflector Antennas", uk:"Рефлекторні антени",
    descEn:"A shaped conducting surface focuses a feed's radiation into a narrow, high-gain beam.",
    descUk:"Профільована провідна поверхня фокусує випромінювання опромінювача у вузький високопідсилювальний промінь.",
    antennas:[
      {id:"parabolic", lvl:2, href:"reflector.html#parabolic",
        en:"Parabolic Dish (prime focus)", uk:"Параболічна тарілка (прямий фокус)", alias:"parabolic dish prime focus physical optics GTD параболічна тарілка",
        dEn:"Parabolic reflector illuminated by a focal-point feed; the classic high-gain antenna.",
        dUk:"Параболічний рефлектор, опромінюваний з фокуса; класична високопідсилювальна антена.",
        std:["DVB-S/S2","VSAT","Backhaul","Deep-space"], mod:["QPSK","8-PSK","QAM","OFDM"],
        mth:["Physical optics","GTD/UTD","Aperture efficiency"]},
      {id:"cassegrain", lvl:2, href:"reflector.html#cassegrain",
        en:"Cassegrain / Gregorian", uk:"Кассегрена / Грегорі", alias:"cassegrain gregorian dual reflector subreflector кассегрена грегорі",
        dEn:"Dual-reflector system (main parabola + subreflector) for compact high gain.",
        dUk:"Дворефлекторна система (головна парабола + субрефлектор) для компактного високого підсилення.",
        std:["SATCOM ground","Radio astronomy","NASA DSN"], mod:["BPSK","QPSK","QAM"],
        mth:["Physical optics (dual)","GTD/UTD"]},
      {id:"offset-dish", lvl:2, href:"reflector.html#offset-dish",
        en:"Offset-Fed Parabolic", uk:"Офсетна параболічна", alias:"offset fed parabolic cross polarization Ludwig офсетна",
        dEn:"Asymmetric dish avoiding feed blockage; the common consumer satellite shape.",
        dUk:"Асиметрична тарілка без затінення опромінювачем; типова побутова супутникова форма.",
        std:["DTH DVB-S2","Ku/Ka VSAT"], mod:["QPSK","8-PSK","16/32-APSK"],
        mth:["PO + GTD/UTD","Cross-pol (Ludwig-3)"]},
      {id:"corner", lvl:2, href:"reflector.html#corner",
        en:"Corner Reflector", uk:"Кутовий рефлектор", alias:"corner reflector 90 degree image theory кутовий",
        dEn:"Driven element in front of a 90° metal corner for directional gain.",
        dUk:"Активний елемент перед 90° металевим кутом для спрямованого підсилення.",
        std:["UHF/VHF TV rx","LMR PtP"], mod:["8-VSB","COFDM","FM"], mth:["Image theory","MoM"]},
      {id:"grid-dish", lvl:2, href:"reflector.html#grid-dish",
        en:"Grid / Mesh Parabolic", uk:"Сітчаста параболічна", alias:"grid mesh parabolic wire wind permeable сітчаста",
        dEn:"Lightweight wire-grid reflector, wind-permeable, for PtP microwave/Wi-Fi links.",
        dUk:"Легкий дротяно-сітчастий рефлектор, проникний для вітру, для ліній «точка-точка».",
        std:["Wi-Fi long-range","WISP backhaul","Amateur µW"], mod:["OFDM","DSSS"],
        mth:["PO (grid coefficient)","MoM"]}
    ]
  },
  {
    id:4, en:"Array Antennas", uk:"Антенні решітки",
    descEn:"Many radiating elements combined so their patterns multiply — steerable, high-gain, and reconfigurable.",
    descUk:"Багато випромінювальних елементів, чиї ДН перемножуються — кероване, високопідсилювальне й реконфігуроване випромінювання.",
    antennas:[
      {id:"phased-array", lvl:2, href:"array.html#phased-array",
        en:"Phased Array Antenna", uk:"Фазована антенна решітка", alias:"phased array beam steering AESA Starlink array factor фазована",
        dEn:"Radiating elements with electronically controlled phase for beam steering.",
        dUk:"Випромінювачі з електронно керованою фазою для сканування променя.",
        std:["5G NR","Radar (AESA)","Starlink","SATCOM"], mod:["QAM/OFDM","Pulse","APSK"],
        mth:["Array factor","MoM/FEM (mutual coupling)"]},
      {id:"massive-mimo", lvl:2, href:"array.html#massive-mimo",
        en:"Massive MIMO Array", uk:"Масив Massive MIMO", alias:"massive mimo beamforming spatial multiplexing 5G",
        dEn:"Dozens-to-hundreds of elements for spatial multiplexing and beamforming.",
        dUk:"Десятки-сотні елементів для просторового мультиплексування та формування променя.",
        std:["5G NR","LTE-Advanced Pro"], mod:["OFDMA","256-QAM"],
        mth:["Array factor","Statistical channel model"]},
      {id:"mimo", lvl:2, href:"array.html#mimo",
        en:"MIMO Array (2×2, 4×4, 8×8)", uk:"MIMO-решітка (2×2, 4×4, 8×8)", alias:"mimo array diversity multiplexing decorrelated",
        dEn:"Co-located decorrelated antennas for spatial diversity / multiplexing.",
        dUk:"Суміщені декорельовані антени для просторового різноманіття / мультиплексування.",
        std:["Wi-Fi 802.11n/ac/ax","LTE","5G NR"], mod:["OFDM/OFDMA","1024-QAM"],
        mth:["Array factor","MoM/FEM (coupling)"]},
      {id:"butler", lvl:2, href:"array.html#butler",
        en:"Butler Matrix / Beamforming", uk:"Матриця Батлера / формування променя", alias:"butler matrix beamforming network multi beam батлера",
        dEn:"Fixed-beam array fed through a beamforming network producing simultaneous beams.",
        dUk:"Решітка з фіксованими променями через мережу формування, що дає одночасні промені.",
        std:["Cellular sectors","5G beamforming","Multi-beam SATCOM"], mod:["QAM/OFDM","APSK"],
        mth:["Array factor","Network (S-parameter)"]},
      {id:"stacked-yagi", lvl:3, href:"array.html#stacked-yagi",
        en:"Yagi-Uda Array (stacked)", uk:"Решітка антен Уда-Яги (стекована)", alias:"stacked yagi array bay gain point to point стекована",
        dEn:"Multiple Yagi elements stacked/combined for higher-gain point-to-point links.",
        dUk:"Кілька елементів Yagi, складених/об'єднаних для вищого підсилення в лініях «точка-точка».",
        std:["802.11 long-range","TV rx","Amateur"], mod:["OFDM","8-VSB"],
        mth:["MoM (coupling)","Array factor"]}
    ]
  },
  {
    id:5, en:"Printed / Microstrip Antennas", uk:"Друковані/мікросмужкові антени",
    descEn:"Conductors etched on a dielectric substrate — flat, cheap, mass-producible, and integrable with circuitry.",
    descUk:"Провідники, витравлені на діелектричній підкладці — плоскі, дешеві, масові й інтегровані зі схемами.",
    antennas:[
      {id:"patch", lvl:2, href:"printed.html#patch",
        en:"Microstrip Patch Antenna", uk:"Мікросмужкова патч-антена", alias:"microstrip patch cavity transmission line FEM патч мікросмужкова",
        dEn:"Flat conductive patch over a ground plane separated by a dielectric substrate.",
        dUk:"Плоский провідний елемент над площиною землі, розділений діелектричною підкладкою.",
        std:["GPS/GNSS","Wi-Fi","5G mmWave","Auto radar 76–81 GHz"], mod:["BPSK","OFDM","QAM","FMCW"],
        mth:["Cavity model","Transmission-line","FEM"]},
      {id:"meander", lvl:3, href:"printed.html#meander",
        en:"Meander Line Antenna", uk:"Меандрова антена", alias:"meander line serpentine miniaturized IoT меандрова",
        dEn:"Miniaturized printed antenna using a serpentine trace to shorten physical length.",
        dUk:"Мініатюризована друкована антена зі звивистою доріжкою для зменшення довжини.",
        std:["ZigBee 802.15.4","BLE","RFID tags"], mod:["O-QPSK","GFSK","ASK/OOK"], mth:["FEM/MoM (full-wave)"]},
      {id:"chip", lvl:3, href:"printed.html#chip",
        en:"Chip / Ceramic Antenna", uk:"Чип/керамічна антена", alias:"chip ceramic SMD dielectric loaded embedded чип керамічна",
        dEn:"Surface-mount dielectric-loaded antenna for compact embedded designs.",
        dUk:"Поверхнево-монтована діелектрично навантажена антена для компактних конструкцій.",
        std:["BLE","Wi-Fi IoT","GPS","ZigBee/Thread"], mod:["GFSK","O-QPSK","BPSK"], mth:["FEM (full-wave)"]},
      {id:"fractal", lvl:3, href:"printed.html#fractal",
        en:"Fractal Antenna", uk:"Фрактальна антена", alias:"fractal self similar multiband Koch Sierpinski фрактальна",
        dEn:"Self-similar geometric patterns enabling multiband / compact operation.",
        dUk:"Самоподібні геометричні візерунки для багатодіапазонної / компактної роботи.",
        std:["Multiband handsets","Wi-Fi/BT combo"], mod:["GMSK","QAM/OFDM","GFSK"], mth:["FEM/MoM (full-wave)"]},
      {id:"vivaldi", lvl:3, href:"printed.html#vivaldi",
        en:"Vivaldi Antenna (tapered slot)", uk:"Антена Вівальді (звужена щілина)", alias:"vivaldi tapered slot exponential UWB вівальді",
        dEn:"Printed exponentially tapered slot antenna — wideband and directional.",
        dUk:"Друкована експоненційно звужена щілинна антена — широкосмугова та спрямована.",
        std:["UWB 802.15.4a/z","Radar imaging","EMC"], mod:["Impulse/PPM","FMCW"], mth:["FEM/FDTD (full-wave)"]}
    ]
  },
  {
    id:6, en:"Traveling-Wave & Leaky-Wave", uk:"Антени біжучої та витікаючої хвилі",
    descEn:"Energy travels along a guiding structure and radiates as it goes, producing frequency-scanned or endfire beams.",
    descUk:"Енергія рухається вздовж напрямної структури й випромінюється дорогою, даючи частотно-скановані чи осьові промені.",
    antennas:[
      {id:"leaky-wave", lvl:2, href:"travelingwave.html#leaky-wave",
        en:"Leaky-Wave Antenna", uk:"Антена витікаючої хвилі", alias:"leaky wave dispersion frequency scanning витікаючої",
        dEn:"A guiding structure that 'leaks' energy along its length; the beam scans with frequency.",
        dUk:"Напрямна структура, що «випромінює» енергію вздовж довжини; промінь сканується частотою.",
        std:["5G/mmWave scan","Auto radar","SATCOM feed"], mod:["OFDM","FMCW"],
        mth:["Transverse-resonance / dispersion","FEM eigenmode"]}
    ]
  },
  {
    id:7, en:"Lens Antennas", uk:"Лінзові антени",
    descEn:"A shaped or graded-index dielectric refracts the feed's wavefront into a focused, sometimes multi-beam, pattern.",
    descUk:"Профільований чи градієнтний діелектрик заломлює фронт опромінювача у сфокусований, іноді багатопроменевий, розподіл.",
    antennas:[
      {id:"dielectric-lens", lvl:2, href:"lens.html#dielectric-lens",
        en:"Dielectric Lens Antenna", uk:"Діелектрична лінзова антена", alias:"dielectric lens geometric optics ray tracing діелектрична лінза",
        dEn:"Shaped dielectric focusing radiated energy, similar in function to a reflector.",
        dUk:"Профільований діелектрик, що фокусує випромінювання, за функцією схожий на рефлектор.",
        std:["mmWave 5G FR2","SATCOM feed","Auto radar"], mod:["OFDM","FMCW"],
        mth:["Geometric optics (ray tracing)","Physical optics"]},
      {id:"luneburg", lvl:2, href:"lens.html#luneburg",
        en:"Luneburg Lens Antenna", uk:"Лінза Люнеберга", alias:"luneburg graded index sphere multi beam люнеберга",
        dEn:"Spherically graded-index dielectric lens producing multiple simultaneous beams.",
        dUk:"Сферична діелектрична лінза зі змінним показником заломлення, що дає кілька променів.",
        std:["Multi-beam radar/SATCOM","5G multi-sector"], mod:["QAM/OFDM","FMCW"],
        mth:["GO ray tracing (graded-index)","Physical optics"]},
      {id:"metal-plate", lvl:2, href:"lens.html#metal-plate",
        en:"Metal-Plate (Waveguide) Lens", uk:"Металопластинчаста (хвилевідна) лінза",
        alias:"metal plate lens waveguide E-plane Kock zoned accelerating металопластинчаста хвилевідна лінза кока зонована",
        dEn:"Stack of parallel metal plates whose waveguide phase velocity gives n < 1 — a light, concave 'accelerating' lens.",
        dUk:"Пакет паралельних металевих пластин, фазова швидкість у яких дає n < 1 — легка увігнута «прискорювальна» лінза.",
        std:["SATCOM feeds","mmWave radar","Radio relay"], mod:["QAM/OFDM","FMCW"],
        mth:["GO ray tracing (n<1)","Physical optics"]}
    ]
  },
  {
    id:8, en:"Sector & Panel Antennas", uk:"Секторні та панельні антени",
    descEn:"Vertically stacked element columns shape a wide-azimuth, narrow-elevation beam — the workhorse of cellular sites.",
    descUk:"Вертикально складені стовпці елементів формують широкий за азимутом, вузький за кутом місця промінь — основа стільникових сайтів.",
    antennas:[
      {id:"sector-panel", lvl:2, href:"sector.html#sector-panel",
        en:"Sector Panel Antenna", uk:"Секторна панельна антена", alias:"sector panel base station column downtilt секторна панельна",
        dEn:"Flat array giving a wide horizontal / narrow vertical beam; the cellular BS standard.",
        dUk:"Плоска решітка з широким горизонтальним / вузьким вертикальним променем; стандарт БС.",
        std:["GSM","UMTS","LTE","5G NR"], mod:["GMSK","QPSK","QAM/OFDM(A)"],
        mth:["Array factor (vertical stack)","FEM/MoM (element)"]},
      {id:"collinear", lvl:2, href:"sector.html#collinear",
        en:"Collinear / Omni Panel", uk:"Колінеарна / всенаправлена панель", alias:"collinear omni vertical dipole stack gateway колінеарна всенаправлена",
        dEn:"Vertically stacked dipoles for 360° coverage with higher gain than one dipole.",
        dUk:"Вертикально складені диполі для покриття 360° з вищим підсиленням, ніж один диполь.",
        std:["Wi-Fi hotspots","LMR base","LoRaWAN gateways"], mod:["OFDM/DSSS","FM","CSS"],
        mth:["Array factor (collinear stack)"]}
    ]
  },
  {
    id:9, en:"RFID / NFC / Short-Range", uk:"Антени RFID / NFC / малого радіусу",
    descEn:"Antennas optimised for near-field coupling or backscatter over centimetres to a few metres.",
    descUk:"Антени, оптимізовані для ближньопольового зв'язку або зворотного розсіювання на відстані від сантиметрів до кількох метрів.",
    antennas:[
      {id:"uhf-rfid", lvl:3, href:"rfid.html#uhf-rfid",
        en:"UHF RFID Antenna", uk:"UHF RFID-антена", alias:"UHF RFID EPC Gen2 backscatter dipole patch зворотне розсіювання",
        dEn:"Patch/dipole hybrid tag or reader antenna analysed for backscatter.",
        dUk:"Гібрид патч/диполь (мітка чи зчитувач), аналізований для зворотного розсіювання.",
        std:["EPC Gen2 (18000-63)"], mod:["ASK/PIE","Backscatter BPSK/FM0"], mth:["MoM (backscatter)"]},
      {id:"nfc-loop", lvl:1, href:"rfid.html#nfc-loop",
        en:"NFC Loop Antenna", uk:"NFC-рамкова антена", alias:"NFC loop near field 14443 18092 inductive coupling рамкова",
        dEn:"Near-field inductively coupled loop for contactless smartcards and tags.",
        dUk:"Ближньопольова індуктивно зв'язана рамка для безконтактних смарткарт і міток.",
        std:["ISO 14443","ISO 18092"], mod:["ASK","Load modulation"], mth:["Quasistatic (Biot–Savart)"]}
    ]
  }
];

/* =========================================================================
   I18N — interface strings.  Antenna-specific tag labels + method-level names.
   ========================================================================= */
const I18N = {
  en:{
    searchPlaceholder:"Search antennas…",
    noResults:"Nothing found",
    catalogLede:"Every antenna type from the atlas, grouped by structural family. Each card carries its standards, modulations and calculation-method tags; open a card for the live pattern calculator.",
    methodLegend:"Analysis-method complexity — click a level to toggle it:",
    methodLvl1:"analytical / closed-form", methodLvl2:"semi-analytical", methodLvl3:"full-wave numerical",
    tagLegend:"Filter by tag family:",
    tagStd:"STD", tagMod:"MOD", tagMth:"METHOD",
    filterStd:"standards", filterMod:"modulations", filterMth:"methods",
    types:"types", families:"families",
    viewTopic:"By family", viewAlpha:"A–Z",
    themeToLight:"Switch to light theme", themeToDark:"Switch to dark theme",
    openCalc:"calculator"
  },
  uk:{
    searchPlaceholder:"Пошук антен…",
    noResults:"Нічого не знайдено",
    catalogLede:"Усі типи антен з атласу, згруповані за конструктивними сім'ями. Кожна картка має мітки стандартів, модуляцій та методів розрахунку; відкрийте картку для живого калькулятора ДН.",
    methodLegend:"Складність методу аналізу — натисніть рівень, щоб перемкнути:",
    methodLvl1:"аналітичний / замкнена форма", methodLvl2:"напіваналітичний", methodLvl3:"повнохвильовий чисельний",
    tagLegend:"Фільтр за сім'єю міток:",
    tagStd:"СТД", tagMod:"МОД", tagMth:"МЕТОД",
    filterStd:"стандарти", filterMod:"модуляції", filterMth:"методи",
    types:"типів", families:"сімей",
    viewTopic:"За сім'ями", viewAlpha:"А–Я",
    themeToLight:"Світла тема", themeToDark:"Темна тема",
    openCalc:"калькулятор"
  }
};

/* =========================================================================
   HREFS — default page anchor per antenna id (anchor id === antenna id).
   ========================================================================= */
const HREFS = (function(){
  const map={};
  CATALOG.forEach(sec=>sec.antennas.forEach(a=>{ if(a.href) map[a.id]=a.href; }));
  return map;
})();

if(typeof window!=='undefined'){ window.CATALOG=CATALOG; window.I18N=I18N; window.CX=null; window.HREFS=HREFS; }
