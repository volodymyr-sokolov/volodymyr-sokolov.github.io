/* =========================================================================
   catalog.js — the whole-project technology catalogue, derived from wireless.md
   Bilingual (EN default, UK). Each entry carries a study level:
     1 = fundamental (I, mint)  2 = intermediate (II, yellow)  3 = advanced (III, orange)
   and a deployment status: current | legacy | niche | emerging.
   `href` marks a technology that has an interactive page in this project.
   ========================================================================= */

const CATALOG = [
  {
    id:1, en:"Analog Modulations", uk:"Аналогові модуляції",
    descEn:"Continuous carriers whose amplitude, frequency or phase tracks an analog message.",
    descUk:"Неперервні носії, чиї амплітуда, частота або фаза відстежують аналоговий сигнал.",
    algos:[
      {id:"am", lvl:1, status:'legacy', ref:'ITU', en:"AM — Amplitude Modulation", uk:"AM — амплітудна модуляція", alias:"amplitude broadcast LW MW SW ДХ СХ КХ",
        dEn:"Carrier amplitude follows the message; LW/MW/SW broadcasting and aviation radio.",
        dUk:"Амплітуда носія слідує за сигналом; радіомовлення ДХ/СХ/КХ та авіаційний зв'язок."},
      {id:"fm", lvl:1, status:'current', en:"FM — Frequency Modulation", uk:"FM — частотна модуляція", alias:"frequency broadcast VHF УКХ NMT AMPS",
        dEn:"Message shifts the instantaneous frequency; VHF radio, TV audio, 1G cellular.",
        dUk:"Сигнал зсуває миттєву частоту; УКХ-радіо, звук ТБ, стільникові 1-го покоління."},
      {id:"ssb", lvl:2, status:'niche', en:"SSB — Single Sideband", uk:"SSB — однобічна смуга", alias:"single sideband HF amateur КХ аматорське",
        dEn:"AM with the carrier and one sideband removed; efficient HF and amateur radio.",
        dUk:"AM із прибраним носієм та однією бічною смугою; ефективний КХ- та аматорський зв'язок."},
      {id:"pm", lvl:2, status:'current', en:"PM — Phase Modulation", uk:"PM — фазова модуляція", alias:"phase base digital",
        dEn:"Message varies the carrier phase; the analog parent of every PSK scheme.",
        dUk:"Сигнал змінює фазу носія; аналоговий предок усіх схем PSK."}
    ]
  },
  {
    id:2, en:"Amplitude & Frequency Keying", uk:"Амплітудна та частотна маніпуляція",
    descEn:"The simplest digital schemes: switch the carrier's amplitude or frequency per symbol.",
    descUk:"Найпростіші цифрові схеми: перемикання амплітуди чи частоти носія на символ.",
    algos:[
      {id:"ook", lvl:1, status:'current', en:"OOK — On-Off Keying", uk:"OOK — увімк./вимк. маніпуляція", alias:"on off keying RFID 433 315 remote IrDA",
        dEn:"Carrier simply present or absent; 433/315 MHz remotes, low-cost RFID, IrDA.",
        dUk:"Носій або є, або ні; пульти 433/315 МГц, дешеві RFID-мітки, IrDA."},
      {id:"ask", lvl:1, status:'niche', en:"ASK — Amplitude Shift Keying", uk:"ASK — амплітудна маніпуляція", alias:"amplitude EPC Gen2 RFID",
        dEn:"Bits map to two or more amplitude levels; EPC Gen2 RFID, some remotes.",
        dUk:"Біти відображаються на кілька рівнів амплітуди; RFID EPC Gen2, деякі пульти."},
      {id:"fsk", lvl:1, status:'current', en:"FSK — Frequency Shift Keying", uk:"FSK — частотна маніпуляція", alias:"POCSAG FLEX paging weather",
        dEn:"Two tones for 0/1; robust and cheap — paging (POCSAG, FLEX), weather stations.",
        dUk:"Два тони для 0/1; надійна й дешева — пейджинг (POCSAG, FLEX), метеостанції."},
      {id:"gfsk", lvl:2, status:'current', ref:'802.15.1', usedBy:['bluetooth'], en:"GFSK — Gaussian FSK", uk:"GFSK — гаусова FSK", alias:"gaussian bluetooth BLE Z-Wave nRF24 nordic",
        dEn:"FSK with a Gaussian-shaped pulse to narrow the spectrum; Bluetooth, BLE, Z-Wave.",
        dUk:"FSK із гаусовим імпульсом для звуження спектра; Bluetooth, BLE, Z-Wave."},
      {id:"mfsk", lvl:2, status:'legacy', en:"2-FSK / 4-FSK (M-ary FSK)", uk:"2-FSK / 4-FSK (M-ічна FSK)", alias:"multi level fsk DECT pagers 4-level",
        dEn:"Multi-level frequency keying carrying 2+ bits per symbol; DECT, legacy pagers.",
        dUk:"Багаторівнева частотна маніпуляція 2+ біт/символ; DECT, застарілі пейджери."},
      {id:"msk", lvl:2, status:'niche', en:"MSK — Minimum Shift Keying", uk:"MSK — маніпуляція мін. зсувом", alias:"minimum shift continuous phase CPM",
        dEn:"Continuous-phase FSK with the smallest tone spacing (h = 0.5); constant envelope.",
        dUk:"FSK із неперервною фазою й найменшим рознесенням тонів (h = 0,5); стала обвідна."},
      {id:"gmsk", lvl:2, status:'current', ref:'GSM', usedBy:['gsm'], en:"GMSK — Gaussian MSK", uk:"GMSK — гаусова MSK", alias:"gaussian gsm dect constant envelope",
        dEn:"MSK with a Gaussian pre-filter; the compact constant-envelope carrier of GSM & DECT.",
        dUk:"MSK із гаусовим передфільтром; компактний носій зі сталою обвідною GSM та DECT."}
    ]
  },
  {
    id:3, en:"Phase-Shift Keying (PSK)", uk:"Фазова маніпуляція (PSK)",
    descEn:"Data ride on the carrier's phase; the workhorse of digital satellite & cellular links.",
    descUk:"Дані переносяться фазою носія; робоча конячка цифрового супутникового й стільникового зв'язку.",
    algos:[
      {id:"bpsk", lvl:1, status:'current', usedBy:['gnss'], en:"BPSK — Binary PSK", uk:"BPSK — двійкова PSK", alias:"binary phase GPS 802.15.4 backscatter",
        dEn:"Two antipodal phases (0°/180°); the most robust PSK — GPS C/A code, RFID backscatter.",
        dUk:"Дві протилежні фази (0°/180°); найстійкіша PSK — код C/A GPS, зворотне розсіювання RFID."},
      {id:"qpsk", lvl:2, status:'current', usedBy:['umts'], en:"QPSK — Quadrature PSK", uk:"QPSK — квадратурна PSK", alias:"quadrature 3G WCDMA DVB-S GLONASS ГЛОНАСС",
        dEn:"Four phases carry 2 bits/symbol; UMTS/WCDMA, DVB-S/S2, satellite links, GLONASS.",
        dUk:"Чотири фази несуть 2 біти/символ; UMTS/WCDMA, DVB-S/S2, супутник, ГЛОНАСС."},
      {id:"oqpsk", lvl:2, status:'current', ref:'802.15.4', usedBy:['zigbee'], en:"O-QPSK — Offset QPSK", uk:"O-QPSK — QPSK зі зсувом", alias:"offset zigbee thread 802.15.4",
        dEn:"QPSK with a half-symbol I/Q offset to avoid 180° jumps; ZigBee & Thread at 2.4 GHz.",
        dUk:"QPSK із півсимвольним зсувом I/Q, щоб уникнути стрибків 180°; ZigBee і Thread на 2,4 ГГц."},
      {id:"pi4dqpsk", lvl:2, status:'niche', ref:'TETRA', usedBy:['tetra'], en:"π/4-DQPSK", uk:"π/4-DQPSK", alias:"pi/4 differential TETRA PDC",
        dEn:"Differential QPSK rotated ±π/4 each symbol; TETRA and Japanese PDC cellular.",
        dUk:"Диференціальна QPSK з обертом ±π/4 на символ; TETRA та японський PDC."},
      {id:"psk8", lvl:2, status:'current', ref:'EDGE', usedBy:['edge'], en:"8-PSK", uk:"8-PSK", alias:"eight phase EDGE bluetooth EDR",
        dEn:"Eight phases carry 3 bits/symbol; EDGE (GSM evolution), Bluetooth EDR 2/3 Mbps.",
        dUk:"Вісім фаз несуть 3 біти/символ; EDGE (еволюція GSM), Bluetooth EDR 2/3 Мбіт/с."},
      {id:"dpsk", lvl:1, status:'legacy', en:"DPSK — Differential PSK", uk:"DPSK — диференціальна PSK", alias:"DBPSK DQPSK differential 802.11 bluetooth",
        dEn:"Encodes bits in phase changes, so no absolute reference is needed; original Wi-Fi, BT.",
        dUk:"Кодує біти у змінах фази, тож не потребує абсолютної опори; перший Wi-Fi, BT."}
    ]
  },
  {
    id:4, en:"Quadrature Amplitude Modulation", uk:"Квадратурна амплітудна модуляція",
    descEn:"Amplitude and phase together pack many bits per symbol — the high-rate mainstream.",
    descUk:"Амплітуда й фаза разом пакують багато біт на символ — основа високих швидкостей.",
    algos:[
      {id:"qam", lvl:2, status:'current', usedBy:['wifi','lte','nr5g'], en:"QAM — 16 / 64 / 256 / 1024 / 4096", uk:"QAM — 16 / 64 / 256 / 1024 / 4096", alias:"quadrature amplitude 256-QAM 1024-QAM DOCSIS DVB-C",
        dEn:"A rectangular I/Q grid of 4–4096 points; Wi-Fi, LTE, 5G NR, DVB-C/T2, DOCSIS cable.",
        dUk:"Прямокутна сітка I/Q із 4–4096 точок; Wi-Fi, LTE, 5G NR, DVB-C/T2, кабель DOCSIS."}
    ]
  },
  {
    id:5, en:"Spread Spectrum & Wideband", uk:"Розширення спектра та широкосмугові",
    descEn:"Deliberately smear the signal across a wide band for robustness, sharing or ranging.",
    descUk:"Навмисне розмазування сигналу по широкій смузі заради стійкості, спільного доступу чи вимірювань.",
    algos:[
      {id:"dsss", lvl:2, status:'current', usedBy:['gnss'], en:"DSSS — Direct Sequence", uk:"DSSS — пряма послідовність", alias:"direct sequence 802.11b GPS CDMA chip",
        dEn:"Multiply data by a fast pseudo-noise chip code to spread it; Wi-Fi b, GPS, CDMA.",
        dUk:"Множення даних на швидкий псевдовипадковий чип-код для розширення; Wi-Fi b, GPS, CDMA."},
      {id:"fhss", lvl:2, status:'current', usedBy:['bluetooth'], en:"FHSS — Frequency Hopping", uk:"FHSS — стрибки частоти", alias:"frequency hopping bluetooth homerf 1600",
        dEn:"Carrier hops across many channels on a shared schedule; Bluetooth (1600 hops/s).",
        dUk:"Носій стрибає по багатьох каналах за спільним розкладом; Bluetooth (1600 стрибків/с)."},
      {id:"cdma", lvl:2, status:'legacy', en:"CDMA — Code Division Access", uk:"CDMA — кодовий поділ доступу", alias:"code division IS-95 cdmaOne CDMA2000 WCDMA",
        dEn:"Many users share a band via orthogonal spreading codes; IS-95, CDMA2000, WCDMA.",
        dUk:"Багато абонентів ділять смугу через ортогональні коди; IS-95, CDMA2000, WCDMA."},
      {id:"css", lvl:2, status:'current', usedBy:['lora'], en:"CSS — Chirp Spread Spectrum", uk:"CSS — розширення чирпами", alias:"chirp lora semtech linear",
        dEn:"Data ride on linearly sweeping chirps; LoRa's long-range low-power modulation.",
        dUk:"Дані переносяться лінійно розгортаними чирпами; далекобійна економна модуляція LoRa."},
      {id:"uwb", lvl:3, status:'emerging', ref:'802.15.4z', en:"UWB — Ultra-Wideband (impulse)", uk:"UWB — надширокосмугова (імпульсна)", alias:"ultra wideband impulse 802.15.4a 802.15.4z ranging apple",
        dEn:"Sub-nanosecond pulses over GHz of bandwidth for cm-accurate ranging; 802.15.4a/z.",
        dUk:"Субнаносекундні імпульси на смузі в ГГц для сантиметрового вимірювання; 802.15.4a/z."},
      {id:"ppm", lvl:2, status:'niche', en:"PPM — Pulse Position Modulation", uk:"PPM — позиційно-імпульсна модуляція", alias:"pulse position IrDA UWB optical",
        dEn:"Information is the timing of a pulse within a slot; IrDA and impulse-radio UWB.",
        dUk:"Інформація — це момент появи імпульсу в межах слоту; IrDA та імпульсна UWB."}
    ]
  },
  {
    id:6, en:"Multi-Carrier & Multiple Access", uk:"Багаточастотні та множинний доступ",
    descEn:"Split the data over hundreds of orthogonal subcarriers — the backbone of 4G/5G/Wi-Fi.",
    descUk:"Розподіл даних по сотнях ортогональних піднесучих — основа 4G/5G/Wi-Fi.",
    algos:[
      {id:"ofdm", lvl:3, status:'current', usedBy:['wifi','lte','nr5g','dvb'], en:"OFDM", uk:"OFDM", alias:"orthogonal frequency division multiplexing wifi lte 5g dvb-t dab fft cyclic prefix",
        dEn:"Hundreds of overlapping-yet-orthogonal subcarriers via an IFFT; Wi-Fi, LTE, 5G, DVB-T.",
        dUk:"Сотні перекривних, але ортогональних піднесучих через IFFT; Wi-Fi, LTE, 5G, DVB-T."},
      {id:"ofdma", lvl:3, status:'current', usedBy:['wifi','lte','nr5g'], en:"OFDMA", uk:"OFDMA", alias:"orthogonal frequency division multiple access 802.11ax lte downlink 5g",
        dEn:"OFDM where subcarrier groups are assigned to different users; Wi-Fi 6, LTE DL, 5G.",
        dUk:"OFDM, де групи піднесучих призначаються різним абонентам; Wi-Fi 6, LTE DL, 5G."},
      {id:"scfdma", lvl:3, status:'current', usedBy:['lte'], en:"SC-FDMA", uk:"SC-FDMA", alias:"single carrier fdma lte uplink low papr dft-spread",
        dEn:"DFT-precoded OFDMA with a low peak-to-average ratio; the LTE uplink, kind to phones.",
        dUk:"OFDMA із DFT-передкодуванням і низьким пік-фактором; висхідний канал LTE, щадний до телефонів."}
    ]
  },
  {
    id:7, en:"Error Detection", uk:"Виявлення помилок",
    descEn:"Cheap checks that flag a corrupted frame so it can be dropped or re-requested.",
    descUk:"Дешеві перевірки, що позначають пошкоджений кадр для відкидання чи повторного запиту.",
    algos:[
      {id:"parity", lvl:1, status:'legacy', en:"Parity bit", uk:"Біт парності", alias:"parity even odd serial",
        dEn:"One bit forcing even/odd 1-count; catches any single-bit error. Legacy serial links.",
        dUk:"Один біт, що робить кількість одиниць парною/непарною; ловить будь-яку одиничну помилку."},
      {id:"crc", lvl:1, status:'current', usedBy:['wifi','bluetooth','zigbee','gsm'], en:"CRC — Cyclic Redundancy Check", uk:"CRC — циклічний надлишковий код", alias:"cyclic redundancy check ethernet frame LFSR polynomial",
        dEn:"Polynomial remainder appended to a frame; the near-universal integrity check.",
        dUk:"Поліноміальний залишок, доданий до кадру; майже універсальна перевірка цілісності."},
      {id:"checksum", lvl:1, status:'legacy', en:"Checksum", uk:"Контрольна сума", alias:"checksum sum internet legacy",
        dEn:"A simple modular sum of the data words; weak but trivial; legacy protocols, IP/TCP.",
        dUk:"Проста модульна сума слів даних; слабка, але тривіальна; старі протоколи, IP/TCP."}
    ]
  },
  {
    id:8, en:"Block Codes", uk:"Блокові коди",
    descEn:"Add structured redundancy to fixed blocks so a receiver can repair errors, not just spot them.",
    descUk:"Додають структуровану надлишковість до блоків, щоб приймач виправляв помилки, а не лише бачив.",
    algos:[
      {id:"hamming", lvl:1, status:'current', en:"Hamming codes", uk:"Коди Хеммінга", alias:"hamming SECDED ECC memory syndrome",
        dEn:"Parity bits at power-of-two positions correct any single-bit error; ECC RAM, modems.",
        dUk:"Біти парності на позиціях-степенях двійки виправляють будь-яку одиничну помилку; ECC-пам'ять."},
      {id:"reedsolomon", lvl:2, status:'current', usedBy:['dvb'], en:"Reed–Solomon codes", uk:"Коди Ріда–Соломона", alias:"reed solomon RS DVB QR CD DVD symbol burst",
        dEn:"Symbol-level codes over GF(2^m) that shrug off bursts; DVB, QR codes, CD/DVD, DAB.",
        dUk:"Символьні коди над GF(2^m), стійкі до пакетів помилок; DVB, QR-коди, CD/DVD, DAB."},
      {id:"bch", lvl:2, status:'current', en:"BCH codes", uk:"БЧХ-коди", alias:"bose chaudhuri hocquenghem DVB-S2 flash NAND",
        dEn:"Cyclic codes correcting several random errors; DVB-S2 outer code, NAND flash, paging.",
        dUk:"Циклічні коди, що виправляють кілька випадкових помилок; зовнішній код DVB-S2, флеш NAND."},
      {id:"golay", lvl:2, status:'legacy', en:"Golay codes", uk:"Коди Голея", alias:"golay perfect voyager military 24 12",
        dEn:"The near-perfect (23,12) code correcting 3 errors; Voyager imaging, military links.",
        dUk:"Майже досконалий код (23,12), що виправляє 3 помилки; зображення Voyager, військовий зв'язок."}
    ]
  },
  {
    id:9, en:"Convolutional & Iterative Codes", uk:"Згорткові та ітеративні коди",
    descEn:"Stream-oriented and graph-based codes that approach the Shannon limit; the FEC of modern radios.",
    descUk:"Потокові та графові коди, що наближаються до межі Шеннона; FEC сучасних радіосистем.",
    algos:[
      {id:"convolutional", lvl:2, status:'current', usedBy:['gsm','gnss'], en:"Convolutional codes", uk:"Згорткові коди", alias:"convolutional shift register GSM GPS 802.11a viterbi",
        dEn:"A sliding shift-register mixes each bit into neighbours; GSM, GPS, early Wi-Fi.",
        dUk:"Ковзний регістр зсуву змішує кожен біт із сусідами; GSM, GPS, ранній Wi-Fi."},
      {id:"turbo", lvl:3, status:'legacy', usedBy:['umts','lte'], en:"Turbo codes", uk:"Турбо-коди", alias:"turbo parallel concatenated 3G UMTS LTE CDMA2000 BCJR",
        dEn:"Two convolutional codes plus an interleaver, decoded iteratively; 3G, LTE data.",
        dUk:"Два згорткові коди й перемежувач, декодовані ітеративно; дані 3G, LTE."},
      {id:"ldpc", lvl:3, status:'current', usedBy:['wifi','nr5g','dvb'], en:"LDPC codes", uk:"LDPC-коди", alias:"low density parity check gallager 5g wifi dvb-s2 tanner message passing 10gbase-t",
        dEn:"Sparse parity-check graphs decoded by message passing; Wi-Fi, 5G data, DVB-S2/T2.",
        dUk:"Розріджені графи перевірок, декодовані передаванням повідомлень; Wi-Fi, дані 5G, DVB-S2/T2."},
      {id:"polar", lvl:3, status:'current', usedBy:['nr5g'], en:"Polar codes", uk:"Полярні коди", alias:"polar arikan 5g control channel successive cancellation",
        dEn:"Channel-polarisation codes with provable capacity; the 5G NR control channels.",
        dUk:"Коди поляризації каналу з доведеною ємністю; канали керування 5G NR."}
    ]
  },
  {
    id:10, en:"Decoding & Combined Schemes", uk:"Декодування та комбіновані схеми",
    descEn:"The decoders and layering tricks that make the codes above actually work on fading channels.",
    descUk:"Декодери та прийоми шарування, що змушують коди вище працювати на каналах із завмираннями.",
    algos:[
      {id:"viterbi", lvl:2, status:'current', usedBy:['gsm','gnss'], en:"Viterbi decoding", uk:"Декодування Вітербі", alias:"viterbi maximum likelihood trellis convolutional GSM",
        dEn:"Maximum-likelihood trellis search for convolutional codes; GSM, GPS, satellite.",
        dUk:"Пошук максимальної правдоподібності по решітці для згорткових кодів; GSM, GPS, супутник."},
      {id:"concatenated", lvl:2, status:'legacy', en:"Concatenated codes", uk:"Каскадні коди", alias:"concatenated reed solomon convolutional DVB-S NASA outer inner",
        dEn:"An outer Reed–Solomon over an inner convolutional code; classic DVB-S, deep-space.",
        dUk:"Зовнішній Рід–Соломон над внутрішнім згортковим; класика DVB-S, далекий космос."},
      {id:"interleaving", lvl:1, status:'current', usedBy:['gsm','lte','wifi'], en:"Interleaving", uk:"Перемежування", alias:"interleaving burst fading spread turbo equalization",
        dEn:"Reorder bits so a fading burst becomes scattered single errors a code can fix; GSM, LTE.",
        dUk:"Переставляння бітів, щоб пакет завмирання став розсіяними помилками; GSM, LTE, Wi-Fi."}
    ]
  },
  {
    id:11, en:"Standards & Systems", uk:"Стандарти та системи",
    descEn:"How the modulations and codes above combine into the radios in your pocket, home and sky.",
    descUk:"Як модуляції та коди вище поєднуються у радіо у вашій кишені, домі й небі.",
    algos:[
      {id:"gsm",  lvl:1, status:'legacy',  ref:'2G', en:"GSM (2G)", uk:"GSM (2G)", alias:"2G GMSK convolutional",
        dEn:"2G voice/SMS: GMSK carrier with convolutional coding and interleaving.",
        dUk:"2G голос/SMS: носій GMSK зі згортковим кодуванням і перемежуванням."},
      {id:"edge", lvl:2, status:'legacy',  ref:'2.75G', en:"EDGE", uk:"EDGE", alias:"2.75G 8-PSK GSM evolution",
        dEn:"GSM data upgrade adding 8-PSK on top of the GMSK air interface.",
        dUk:"Апгрейд даних GSM, що додає 8-PSK поверх ефірного інтерфейсу GMSK."},
      {id:"umts", lvl:2, status:'legacy',  ref:'3G', en:"UMTS / WCDMA (3G)", uk:"UMTS / WCDMA (3G)", alias:"3G QPSK turbo wideband cdma",
        dEn:"3G: QPSK over wideband CDMA, with turbo-coded data channels.",
        dUk:"3G: QPSK поверх широкосмугової CDMA з турбо-кодованими каналами даних."},
      {id:"lte",  lvl:2, status:'current', ref:'4G', en:"LTE (4G)", uk:"LTE (4G)", alias:"4G OFDMA SC-FDMA turbo QAM",
        dEn:"4G: OFDMA down / SC-FDMA up, QPSK–256-QAM, turbo-coded (LDPC-like refinements).",
        dUk:"4G: OFDMA вниз / SC-FDMA вгору, QPSK–256-QAM, турбо-кодування."},
      {id:"nr5g", lvl:3, status:'current', ref:'5G', en:"5G NR", uk:"5G NR", alias:"5G new radio OFDM LDPC polar QAM millimeter",
        dEn:"5G: flexible OFDM up to 256-QAM, LDPC for data and polar codes for control.",
        dUk:"5G: гнучкий OFDM до 256-QAM, LDPC для даних та полярні коди для керування."},
      {id:"wifi", lvl:2, status:'current', ref:'802.11', en:"Wi-Fi (802.11a→ax)", uk:"Wi-Fi (802.11a→ax)", alias:"wifi 802.11 OFDM OFDMA QAM LDPC",
        dEn:"OFDM/OFDMA with BPSK–1024-QAM and convolutional or LDPC coding.",
        dUk:"OFDM/OFDMA із BPSK–1024-QAM та згортковим чи LDPC-кодуванням."},
      {id:"bluetooth", lvl:1, status:'current', ref:'802.15.1', en:"Bluetooth / BLE", uk:"Bluetooth / BLE", alias:"bluetooth classic LE GFSK 8-PSK EDR FHSS CRC",
        dEn:"GFSK (BLE & basic rate), 8-PSK/π-4-DQPSK for EDR, over frequency hopping, CRC-checked.",
        dUk:"GFSK (BLE та базова швидкість), 8-PSK/π/4-DQPSK для EDR, зі стрибками частоти, CRC."},
      {id:"zigbee", lvl:1, status:'current', ref:'802.15.4', en:"ZigBee / Thread", uk:"ZigBee / Thread", alias:"zigbee thread 802.15.4 O-QPSK BPSK",
        dEn:"IEEE 802.15.4 low-power mesh: O-QPSK at 2.4 GHz (BPSK on sub-GHz), CRC/Hamming.",
        dUk:"Малопотужна mesh IEEE 802.15.4: O-QPSK на 2,4 ГГц (BPSK на суб-ГГц), CRC/Хеммінг."},
      {id:"lora", lvl:2, status:'current', ref:'LoRaWAN', en:"LoRa / LoRaWAN", uk:"LoRa / LoRaWAN", alias:"lora lorawan CSS chirp semtech",
        dEn:"Long-range IoT: chirp spread spectrum (CSS) with a simple Hamming-style FEC.",
        dUk:"Далекобійний IoT: розширення чирпами (CSS) із простим FEC у стилі Хеммінга."},
      {id:"sigfox", lvl:2, status:'niche', en:"Sigfox", uk:"Sigfox", alias:"sigfox ultra narrowband DBPSK GFSK UNB",
        dEn:"Ultra-narrowband IoT: DBPSK/GFSK with triple repetition instead of complex FEC.",
        dUk:"Ультравузькосмуговий IoT: DBPSK/GFSK із потрійним повтором замість складного FEC."},
      {id:"dect", lvl:1, status:'current', en:"DECT", uk:"DECT", alias:"dect cordless phone GFSK CRC",
        dEn:"Cordless-phone standard: GFSK carrier with CRC integrity checks.",
        dUk:"Стандарт безпроводових телефонів: носій GFSK із перевірками цілісності CRC."},
      {id:"tetra", lvl:2, status:'niche', en:"TETRA", uk:"TETRA", alias:"tetra professional mobile radio pi/4 DQPSK convolutional",
        dEn:"Professional mobile radio for services: π/4-DQPSK with convolutional coding.",
        dUk:"Професійний рухомий радіозв'язок для служб: π/4-DQPSK зі згортковим кодуванням."},
      {id:"gnss", lvl:2, status:'current', en:"GPS / GLONASS (GNSS)", uk:"GPS / ГЛОНАСС (GNSS)", alias:"gnss gps glonass BPSK DSSS convolutional golay navigation",
        dEn:"Satellite navigation: BPSK over DSSS ranging codes, convolutional + Golay on the message.",
        dUk:"Супутникова навігація: BPSK поверх DSSS-кодів, згортковий + Голея на повідомленні."},
      {id:"dvb",  lvl:2, status:'current', en:"DVB-T/T2 / S/S2", uk:"DVB-T/T2 / S/S2", alias:"dvb digital video broadcast OFDM QAM reed solomon LDPC BCH",
        dEn:"Digital TV: OFDM (terrestrial) or QPSK/8-PSK (satellite); RS+conv or LDPC+BCH coding.",
        dUk:"Цифрове ТБ: OFDM (наземне) чи QPSK/8-PSK (супутник); коди RS+згортк. або LDPC+БЧХ."},
      {id:"wimax", lvl:2, status:'legacy', ref:'802.16', en:"WiMAX (802.16)", uk:"WiMAX (802.16)", alias:"wimax 802.16 OFDMA turbo",
        dEn:"Early broadband-wireless standard: OFDM/OFDMA with convolutional turbo coding.",
        dUk:"Ранній стандарт широкосмугового радіодоступу: OFDM/OFDMA із згортковим турбо-кодом."},
      {id:"paging", lvl:1, status:'legacy', en:"Paging (POCSAG/FLEX)", uk:"Пейджинг (POCSAG/FLEX)", alias:"paging POCSAG FLEX FSK BCH",
        dEn:"One-way messaging: simple FSK protected by a BCH code.",
        dUk:"Односторонній обмін повідомленнями: проста FSK, захищена кодом БЧХ."}
    ]
  }
];

/* =========================================================================
   I18N — interface strings (EN default, UK).
   ========================================================================= */
const I18N = {
  en:{
    brand:"Wireless Atlas",
    tagline:"Wireless modulations, codes & standards — a visual field guide",
    searchPlaceholder:"Search technologies…",
    noResults:"Nothing found",
    lvlLegend:["Fundamental","Intermediate","Advanced"],
    cxLegend:["simple receiver","moderate DSP","complex DSP"],
    catalogTitle:"Full technology catalogue",
    catalogLede:"Every modulation, channel code and standard from the source notes, grouped by topic. Each item is tagged with a study level and a deployment status; implemented interactive demos are linked.",
    implemented:"demo",
    showing:"showing",
    of:"of",
    algorithms:"technologies", topics:"topics",
    viewTopic:"By topic", viewAlpha:"A–Z",
    filterNote:"Filter the catalogue — click a level, a receiver cost or a status to toggle it:",
    themeToLight:"Switch to light theme", themeToDark:"Switch to dark theme"
  },
  uk:{
    brand:"Безпроводовий Атлас",
    tagline:"Безпроводові модуляції, коди та стандарти — візуальний путівник",
    searchPlaceholder:"Пошук технологій…",
    noResults:"Нічого не знайдено",
    lvlLegend:["Базовий","Середній","Поглиблений"],
    cxLegend:["простий приймач","помірний DSP","складний DSP"],
    catalogTitle:"Повний каталог технологій",
    catalogLede:"Усі модуляції, канальні коди та стандарти з конспекту, згруповані за темами. Кожен елемент позначено рівнем складності та статусом впровадження; реалізовані інтерактивні демо мають посилання.",
    implemented:"демо",
    showing:"показано",
    of:"з",
    algorithms:"технологій", topics:"тем",
    viewTopic:"За темами", viewAlpha:"А–Я",
    filterNote:"Фільтр каталогу — натисніть рівень, вартість приймача чи статус, щоб перемкнути:",
    themeToLight:"Світла тема", themeToDark:"Темна тема"
  }
};

/* =========================================================================
   CX — receiver / DSP complexity per technology: [label, colourClass]
   colour: 1 = simple receiver (green), 2 = moderate DSP (yellow),
           3 = complex DSP (orange).
   ========================================================================= */
const CX = {
  // analog
  am:['envelope',1], fm:['discrim.',1], ssb:['coherent',2], pm:['coherent',2],
  // ASK / FSK
  ook:['envelope',1], ask:['envelope',1],
  fsk:['discrim.',1], gfsk:['coherent',2], mfsk:['discrim.',1], msk:['coherent',2], gmsk:['coherent',2],
  // PSK
  bpsk:['coherent',2], qpsk:['coherent',2], oqpsk:['coherent',2],
  pi4dqpsk:['differ.',2], psk8:['coherent',3], dpsk:['non-coh.',1],
  // QAM
  qam:['EQ+coh',3],
  // spread
  dsss:['correlator',2], fhss:['synth-hop',2], cdma:['RAKE',3], css:['de-chirp',2],
  uwb:['sub-ns',3], ppm:['gating',1],
  // multicarrier
  ofdm:['FFT',3], ofdma:['FFT',3], scfdma:['DFT+FFT',3],
  // detection
  parity:['XOR',1], crc:['LFSR',1], checksum:['add',1],
  // block codes
  hamming:['syndrome',1], reedsolomon:['GF(2^m)',2], bch:['GF(2^m)',2], golay:['algebraic',2],
  // convolutional / iterative
  convolutional:['trellis',2], turbo:['iterative',3], ldpc:['msg-pass',3], polar:['SC-list',3],
  // combined
  viterbi:['trellis',2], concatenated:['2-stage',2], interleaving:['buffer',1],
  // standards
  gsm:['GMSK+Vit',2], edge:['8-PSK',2], umts:['RAKE',3], lte:['OFDM',3], nr5g:['OFDM',3],
  wifi:['OFDM',3], bluetooth:['GFSK',1], zigbee:['O-QPSK',2], lora:['CSS',2], sigfox:['UNB',1],
  dect:['GFSK',1], tetra:['π/4',2], gnss:['correlator',3], dvb:['OFDM/QAM',3], wimax:['OFDMA',3],
  paging:['FSK',1]
};

/* =========================================================================
   HREFS — default page anchor per technology id (used when the catalogue
   entry has no explicit href). Anchor id === technology id.
   ========================================================================= */
const HREFS = (function(){
  const map={}, put=(page,ids)=>ids.forEach(id=>map[id]=page+'#'+id);
  put('analog.html',       ['am','fm','ssb','pm']);
  put('keying.html',       ['ook','ask','fsk','gfsk','mfsk','msk','gmsk',
                            'bpsk','qpsk','oqpsk','pi4dqpsk','psk8','dpsk']);
  put('qam.html',          ['qam']);
  put('spread.html',       ['dsss','fhss','cdma','css','uwb','ppm']);
  put('multicarrier.html', ['ofdm','ofdma','scfdma']);
  put('codes.html',        ['parity','crc','checksum','hamming','reedsolomon','bch','golay']);
  put('iterative.html',    ['convolutional','turbo','ldpc','polar','viterbi','concatenated','interleaving']);
  put('standards.html',    ['gsm','edge','umts','lte','nr5g','wifi','bluetooth','zigbee','lora',
                            'sigfox','dect','tetra','gnss','dvb','wimax','paging']);
  return map;
})();

if(typeof window!=='undefined'){ window.CATALOG=CATALOG; window.I18N=I18N; window.CX=CX; window.HREFS=HREFS; }
