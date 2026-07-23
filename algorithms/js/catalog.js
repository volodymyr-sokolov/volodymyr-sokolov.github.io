/* =========================================================================
   catalog.js — the whole-project algorithm catalogue, derived from konspekt.md
   Bilingual (EN default, UK). Each algorithm carries a difficulty level:
     1 = Bachelor (I, light green)  2 = Master (II, yellow)  3 = PhD (III, orange)
   `href` marks an algorithm that has an interactive page in this project.
   ========================================================================= */

const CATALOG = [
  {
    id:1, en:"Symmetric block ciphers", uk:"Симетричні блокові шифри",
    descEn:"Fixed-size block encryption built on Feistel or SP networks.",
    descUk:"Шифрування блоків фіксованого розміру на основі мереж Фейстеля або SP-мереж.",
    algos:[
      {id:"des",   lvl:1, status:'legacy', ref:'FIPS 46-3', en:"DES / 3-DES", uk:"DES / 3-DES", alias:"Feistel",
        dEn:"Classic 56-bit Feistel cipher; 3-DES applies it three times for extra strength.",
        dUk:"Класичний 56-бітний шифр Фейстеля; 3-DES застосовує його тричі для посилення стійкості."},
      {id:"aes",   lvl:1, ref:'FIPS 197', en:"AES (Rijndael)", uk:"AES (Rijndael)", alias:"Rijndael",
        dEn:"Modern standard (SP-network), keys of 128/192/256 bits.",
        dUk:"Сучасний стандарт (SP-мережа), ключі 128/192/256 біт."},
      {id:"blowfish", lvl:2, en:"Blowfish / Twofish", uk:"Blowfish / Twofish",
        dEn:"AES finalist/predecessor, studied to compare constructions.",
        dUk:"Фіналіст/попередник AES, вивчається для порівняння конструкцій."},
      {id:"serpent", lvl:2, en:"Serpent, RC6, MARS", uk:"Serpent, RC6, MARS",
        dEn:"Other AES finalists, useful for analysing design trade-offs.",
        dUk:"Інші фіналісти конкурсу AES, корисні для аналізу дизайнерських компромісів."},
      {id:"idea",  lvl:2, en:"IDEA", uk:"IDEA",
        dEn:"Used in PGP; notable for the algebraic structure of its operations.",
        dUk:"Використовувався в PGP, цікавий алгебраїчною структурою операцій."},
      {id:"gost",  lvl:2, status:'legacy', en:"DSTU GOST 28147:2009", uk:"ДСТУ ГОСТ 28147:2009", href:"symmetric.html#gost",
        alias:"GOST 28147-89 ГОСТ Магма Magma",
        dEn:"Ukraine's adoption of the Soviet GOST 28147-89 — a 64-bit, 32-round Feistel cipher.",
        dUk:"Українське прийняття радянського ГОСТ 28147-89 — 64-бітний 32-раундовий шифр Фейстеля."},
      {id:"kuznyechik", lvl:2, en:"Kuznyechik («Konyk»)", uk:"«Коник» (Kuznyechik)",
        alias:"Кузнечик Grasshopper GOST R 34.12-2015",
        dEn:"Modern Russian SP-network cipher (GOST R 34.12-2015, 2016), 128-bit block.",
        dUk:"Сучасний російський шифр — SP-мережа (ГОСТ Р 34.12-2015, 2016), блок 128 біт."},
      {id:"kalyna", lvl:2, en:"Kalyna (DSTU 7624:2014)", uk:"«Калина» (ДСТУ 7624:2014)",
        alias:"Kalyna Ukrainian standard AES",
        dEn:"Ukraine's national block-cipher standard — an AES-like SP-network with 128/256/512-bit blocks.",
        dUk:"Національний стандарт блокового шифрування України — AES-подібна SP-мережа з блоками 128/256/512 біт."},
      {id:"camellia", lvl:2, en:"Camellia", uk:"Camellia",
        dEn:"Japanese standard, comparable to AES.",
        dUk:"Японський стандарт, порівнюваний з AES."},
      {id:"magma", lvl:2, status:'legacy', ref:'GOST R 34.12-2015', en:"Magma (GOST)", uk:"«Магма» (ГОСТ)", alias:"ГОСТ Магма GOST 28147",
        dEn:"The 64-bit Feistel companion to Kuznyechik, formalising the old GOST 28147-89.",
        dUk:"64-бітний шифр Фейстеля — супутник «Коника», що формалізує старий ГОСТ 28147-89."},
      {id:"kasumi", lvl:2, status:'legacy', ref:'3GPP TS 35.202', en:"KASUMI (A5/3)", uk:"KASUMI (A5/3)", alias:"A5/3 GEA3 MISTY",
        dEn:"The 3G block cipher (from MISTY1); its related-key break pushed 3G to SNOW 3G.",
        dUk:"Блоковий шифр 3G (з MISTY1); злом на зв'язаних ключах підштовхнув 3G до SNOW 3G."},
      {id:"sm4", lvl:2, ref:'GM/T 0002', en:"SM4", uk:"SM4", alias:"Chinese standard SMS4",
        dEn:"China's national block cipher (formerly SMS4), used in WAPI Wi-Fi.",
        dUk:"Національний блоковий шифр Китаю (раніше SMS4), застосовується у WAPI Wi-Fi."},
      {id:"aria", lvl:2, ref:'RFC 5794', en:"ARIA", uk:"ARIA", alias:"Korean standard",
        dEn:"South Korea's national block cipher — an AES-like SP-network.",
        dUk:"Національний блоковий шифр Південної Кореї — AES-подібна SP-мережа."},
      {id:"seed", lvl:2, status:'legacy', ref:'RFC 4269', en:"SEED", uk:"SEED", alias:"Korean standard",
        dEn:"Older Korean standard, long mandated in Korean online banking.",
        dUk:"Старіший корейський стандарт, довго обов'язковий в онлайн-банкінгу Кореї."},
      {id:"lea", lvl:2, ref:'ISO/IEC 29192-2', en:"LEA", uk:"LEA", alias:"Korean lightweight",
        dEn:"Korea's fast software-oriented lightweight cipher.",
        dUk:"Швидкий програмно-орієнтований легковаговий шифр Кореї."}
    ]
  },
  {
    id:2, en:"Stream ciphers", uk:"Потокові шифри",
    descEn:"Encrypt data as a keystream XORed with the plaintext.",
    descUk:"Шифрують дані як потік гами, що XOR-иться з відкритим текстом.",
    algos:[
      {id:"rc4", lvl:1, status:'broken', broken:'2013', en:"RC4", uk:"RC4",
        dEn:"Simple, historically important (WEP, SSL); shows stream-cipher weaknesses.",
        dUk:"Простий, історично важливий (WEP, SSL), демонструє вразливості потокових шифрів."},
      {id:"a5", lvl:2, status:'broken', broken:'2000', en:"A5/1, A5/2", uk:"A5/1, A5/2",
        dEn:"GSM ciphers, classic cryptanalysis targets.",
        dUk:"Шифри GSM, класичні об'єкти криптоаналізу."},
      {id:"chacha", lvl:1, ref:'RFC 8439', usedBy:['poly1305'], en:"Salsa20 / ChaCha20", uk:"Salsa20 / ChaCha20",
        dEn:"Modern fast stream ciphers (TLS, Google).",
        dUk:"Сучасні швидкі потокові шифри (TLS, Google)."},
      {id:"snow2", lvl:2, en:"SNOW 2.0 / SNOW 3G", uk:"SNOW 2.0 / SNOW 3G", alias:"3GPP LTE",
        dEn:"Word-oriented LFSR + FSM stream cipher; SNOW 3G protects 3G/LTE mobile traffic.",
        dUk:"Слово-орієнтований потоковий шифр (LFSR + FSM); SNOW 3G захищає трафік 3G/LTE."},
      {id:"strumok", lvl:2, en:"Strumok (DSTU 8845:2019)", uk:"«Струмок» (ДСТУ 8845:2019)",
        alias:"Strumok Ukrainian standard SNOW",
        dEn:"Ukraine's national stream-cipher standard, a SNOW-2-like word-oriented design.",
        dUk:"Національний стандарт потокового шифрування України, слово-орієнтована конструкція типу SNOW-2."},
      {id:"trivium", lvl:3, en:"Grain, Trivium", uk:"Grain, Trivium",
        dEn:"Lightweight ciphers from the eSTREAM project.",
        dUk:"Легковагові шифри з проекту eSTREAM."},
      {id:"zuc", lvl:2, ref:'128-EEA3/EIA3', en:"ZUC", uk:"ZUC", alias:"3GPP 128-EEA3 5G",
        dEn:"Word-oriented LFSR cipher for 4G/5G confidentiality (128-EEA3) and integrity (128-EIA3).",
        dUk:"Слово-орієнтований LFSR-шифр для конфіденційності (128-EEA3) та цілісності (128-EIA3) 4G/5G."}
    ]
  },
  {
    id:3, en:"Block cipher modes", uk:"Режими роботи блокових шифрів",
    descEn:"How a block cipher is applied to messages longer than one block.",
    descUk:"Як блоковий шифр застосовується до повідомлень, довших за один блок.",
    algos:[
      {id:"modes", lvl:1, en:"ECB, CBC, CFB, OFB, CTR", uk:"ECB, CBC, CFB, OFB, CTR",
        dEn:"Basic modes, studied with their weaknesses (ECB patterns, CBC padding oracle).",
        dUk:"Базові режими, вивчаються з аналізом слабкостей (ECB-патерни, padding oracle в CBC)."},
      {id:"gcm", lvl:2, ref:'SP 800-38D', en:"GCM, CCM", uk:"GCM, CCM",
        dEn:"Authenticated encryption (AEAD).",
        dUk:"Автентифіковане шифрування (AEAD)."},
      {id:"xts", lvl:2, ref:'SP 800-38E', en:"XTS-AES", uk:"XTS-AES", alias:"disk encryption FDE",
        dEn:"Tweakable mode for disk/sector encryption (BitLocker, FileVault, LUKS).",
        dUk:"Режим з підлаштуванням для шифрування дисків/секторів (BitLocker, FileVault, LUKS)."},
      {id:"gcmsiv", lvl:2, ref:'RFC 8452', en:"GCM-SIV / SIV", uk:"GCM-SIV / SIV", alias:"nonce misuse resistant",
        dEn:"Nonce-misuse-resistant AEAD: reusing a nonce leaks only equality, never the key.",
        dUk:"AEAD, стійкий до повторення нонса: повтор розкриває лише рівність, ніколи не ключ."},
      {id:"ocb", lvl:2, ref:'RFC 7253', en:"OCB", uk:"OCB", alias:"authenticated encryption",
        dEn:"Single-pass AEAD, long patent-encumbered, now free and very fast.",
        dUk:"Однопрохідний AEAD, довго обмежений патентами, тепер вільний і дуже швидкий."},
      {id:"eax", lvl:2, en:"EAX", uk:"EAX", alias:"CTR CMAC AEAD",
        dEn:"Two-pass AEAD combining CTR and CMAC; simple and provably secure.",
        dUk:"Двопрохідний AEAD, що поєднує CTR і CMAC; простий і доказово стійкий."},
      {id:"kw", lvl:1, ref:'RFC 3394', en:"AES Key Wrap (KW)", uk:"AES Key Wrap (KW)", alias:"key wrapping",
        dEn:"Deterministic mode for encrypting (wrapping) other keys.",
        dUk:"Детермінований режим для шифрування (обгортання) інших ключів."},
      {id:"fpe", lvl:3, ref:'SP 800-38G', en:"FF1 / FF3 (format-preserving)", uk:"FF1 / FF3 (формозберігаюче)", alias:"format preserving encryption FPE",
        dEn:"Encrypts so ciphertext keeps the plaintext's format (a card number stays 16 digits).",
        dUk:"Шифрує так, що шифротекст зберігає формат відкритого тексту (номер картки лишається 16 цифр)."},
      {id:"etmmte", lvl:2, en:"Encrypt-then-MAC vs MAC-then-Encrypt", uk:"Encrypt-then-MAC та MAC-then-Encrypt", alias:"composition order authenticated",
        dEn:"Order matters: Encrypt-then-MAC is the safe composition; the others enabled padding oracles.",
        dUk:"Порядок має значення: Encrypt-then-MAC — безпечна композиція; інші уможливлювали padding-оракули."}
    ]
  },
  {
    id:4, en:"Pseudorandom generators (PRNG)", uk:"Генератори псевдовипадкових послідовностей",
    descEn:"Deterministic algorithms that stretch a short seed into a long pseudorandom sequence.",
    descUk:"Детерміновані алгоритми, що розгортають короткий сід у довгу псевдовипадкову послідовність.",
    algos:[
      {id:"lcg", lvl:1, en:"Linear congruential generator (LCG)", uk:"Лінійний конгруентний генератор (LCG)",
        dEn:"Xₙ₊₁ = (aXₙ + c) mod m — fast and simple, but predictable and not cryptographically secure.",
        dUk:"Xₙ₊₁ = (aXₙ + c) mod m — швидкий і простий, але передбачуваний і криптографічно нестійкий."},
      {id:"mt", lvl:1, en:"Mersenne Twister", uk:"Вихор Мерсенна (Mersenne Twister)",
        dEn:"Long-period general-purpose PRNG (2¹⁹⁹³⁷−1); excellent statistics, but not secure.",
        dUk:"Генератор загального призначення з великим періодом (2¹⁹⁹³⁷−1); чудова статистика, але не криптостійкий."},
      {id:"bbs", lvl:2, en:"Blum–Blum–Shub", uk:"Генератор Блюма–Блюма–Шуба",
        dEn:"xₙ₊₁ = xₙ² mod M — a CSPRNG whose security rests on quadratic residuosity / factoring.",
        dUk:"xₙ₊₁ = xₙ² mod M — криптостійкий генератор, стійкість спирається на квадратичну лишковість / факторизацію."},
      {id:"drbg", lvl:2, en:"NIST DRBG (Hash / HMAC / CTR)", uk:"NIST DRBG (Hash / HMAC / CTR)", alias:"SP 800-90A",
        dEn:"Standardised deterministic random-bit generators built from hashes or block ciphers (SP 800-90A).",
        dUk:"Стандартизовані детерміновані генератори випадкових бітів на основі хешів або блокових шифрів (SP 800-90A)."},
      {id:"fortuna", lvl:2, en:"Fortuna / Yarrow", uk:"Fortuna / Yarrow",
        dEn:"Entropy-accumulating CSPRNG designs used in operating-system randomness sources.",
        dUk:"Криптостійкі генератори з накопиченням ентропії, застосовуються у джерелах випадковості ОС."},
      {id:"niststs", lvl:2, ref:'SP 800-22', en:"NIST STS (SP 800-22)", uk:"NIST STS (SP 800-22)", alias:"statistical test suite randomness",
        dEn:"A battery of statistical tests probing a bit-stream for non-randomness.",
        dUk:"Набір статистичних тестів, що перевіряють потік бітів на невипадковість."},
      {id:"entropy", lvl:2, ref:'SP 800-90B', en:"Entropy estimation (SP 800-90B)", uk:"Оцінка ентропії (SP 800-90B)", alias:"min-entropy source",
        dEn:"Estimates the true entropy of a physical noise source feeding a DRBG.",
        dUk:"Оцінює справжню ентропію фізичного джерела шуму, що живить DRBG."},
      {id:"dieharder", lvl:2, en:"Dieharder / TestU01", uk:"Dieharder / TestU01", alias:"BigCrush randomness battery",
        dEn:"Stronger randomness test batteries (TestU01's BigCrush fails many classic PRNGs).",
        dUk:"Сильніші батареї тестів випадковості (BigCrush з TestU01 «завалює» багато класичних ГПВЧ)."},
      {id:"pcg", lvl:1, en:"PCG / xoshiro", uk:"PCG / xoshiro", alias:"modern non-cryptographic generator",
        dEn:"Modern fast non-cryptographic generators with excellent statistics.",
        dUk:"Сучасні швидкі некриптографічні генератори з чудовою статистикою."},
      {id:"hwrng", lvl:2, en:"Hardware RNG / QRNG", uk:"Апаратний RNG / QRNG", alias:"TRNG entropy source quantum RDRAND",
        dEn:"Physical entropy sources (thermal noise, RDRAND, quantum) that seed CSPRNGs.",
        dUk:"Фізичні джерела ентропії (тепловий шум, RDRAND, квантові), що сідують CSPRNG."}
    ]
  },
  {
    id:5, en:"Probabilistic encryption", uk:"Імовірнісне шифрування",
    descEn:"Schemes that randomise every encryption, so identical plaintexts yield different ciphertexts (ElGamal and Paillier are probabilistic too).",
    descUk:"Схеми, що вносять випадковість у кожне шифрування, тож однакові відкриті тексти дають різні шифротексти (Ель-Гамаля та Paillier також імовірнісні).",
    algos:[
      {id:"gm", lvl:2, en:"Goldwasser–Micali", uk:"Схема Голдвассер–Мікалі",
        dEn:"The first provably-secure probabilistic PKE, based on the quadratic-residuosity problem.",
        dUk:"Перша доказово стійка імовірнісна схема з відкритим ключем, на основі задачі квадратичної лишковості."},
      {id:"blum-goldwasser", lvl:2, en:"Blum–Goldwasser", uk:"Схема Блюма–Голдвассер",
        dEn:"Efficient probabilistic PKE using a Blum–Blum–Shub keystream; IND-CPA secure under factoring.",
        dUk:"Ефективна імовірнісна схема з гамою Блюма–Блюма–Шуба; IND-CPA стійка за припущення факторизації."}
    ]
  },
  {
    id:6, en:"Cryptographic hash functions", uk:"Криптографічні хеш-функції",
    descEn:"One-way compression of arbitrary data into a fixed-size digest.",
    descUk:"Однобічне стиснення довільних даних у дайджест фіксованого розміру.",
    algos:[
      {id:"md5",  lvl:1, status:'broken', broken:'2004', ref:'RFC 1321', en:"MD5", uk:"MD5",
        dEn:"Obsolete; studied through its published collisions.",
        dUk:"Застарілий, вивчається через знайдені колізії."},
      {id:"sha1", lvl:1, status:'broken', broken:'2017', ref:'RFC 3174', en:"SHA-1", uk:"SHA-1", alias:"SHAttered",
        dEn:"Obsolete standard; example of a practical collision attack (SHAttered).",
        dUk:"Застарілий стандарт, приклад практичної атаки на колізії (SHAttered)."},
      {id:"sha2", lvl:1, ref:'FIPS 180-4', en:"SHA-2 (SHA-256/512)", uk:"SHA-2 (SHA-256/512)",
        dEn:"The current standard.",
        dUk:"Поточний стандарт."},
      {id:"sha3", lvl:2, ref:'FIPS 202', usedBy:['sphincs'], en:"SHA-3 (Keccak)", uk:"SHA-3 (Keccak)", alias:"Keccak sponge",
        dEn:"Based on the sponge construction.",
        dUk:"Заснований на губчастій конструкції (sponge construction)."},
      {id:"blake", lvl:2, en:"BLAKE2 / BLAKE3", uk:"BLAKE2 / BLAKE3",
        dEn:"Fast modern alternatives.",
        dUk:"Швидкі сучасні альтернативи."},
      {id:"kupyna", lvl:2, en:"Kupyna (DSTU 7564:2014)", uk:"«Купина» (ДСТУ 7564:2014)",
        alias:"Kupyna Ukrainian standard hash",
        dEn:"Ukraine's national hash standard — a wide-pipe, Grøstl-like double-permutation design related to Kalyna.",
        dUk:"Національний стандарт гешування України — конструкція типу Grøstl (wide-pipe, дві перестановки), споріднена з «Калиною»."},
      {id:"streebog", lvl:2, ref:'RFC 6986', en:"Streebog (GOST R 34.11-2012)", uk:"«Стрибог» (ГОСТ Р 34.11-2012)", alias:"ГОСТ Стрибог Russian hash",
        dEn:"The Russian hash standard, the companion to Kuznyechik and Magma.",
        dUk:"Російський стандарт гешування — супутник «Коника» та «Магми»."},
      {id:"sm3", lvl:2, ref:'GM/T 0004', en:"SM3", uk:"SM3", alias:"Chinese hash",
        dEn:"China's national hash function, a Merkle-Damgard design like SHA-256.",
        dUk:"Національна геш-функція Китаю, конструкція Меркла-Дамґарда, як у SHA-256."}
    ]
  },
  {
    id:7, en:"Message authentication codes (MAC)", uk:"Коди автентифікації повідомлень (MAC)",
    descEn:"Keyed tags that prove a message's integrity and origin.",
    descUk:"Ключові теги, що доводять цілісність і походження повідомлення.",
    algos:[
      {id:"hmac", lvl:1, ref:'RFC 2104', usedBy:['hkdf'], en:"HMAC", uk:"HMAC",
        dEn:"Built on hash functions.",
        dUk:"На основі хеш-функцій."},
      {id:"descbcmac", lvl:1, en:"DES-CBC-MAC", uk:"DES-CBC-MAC", alias:"CBC-MAC block cipher",
        dEn:"The simplest block-cipher MAC: the last CBC ciphertext block of a DES encryption is the tag.",
        dUk:"Найпростіший MAC на основі блокового шифру: тегом є останній блок шифротексту DES у режимі CBC."},
      {id:"cmac", lvl:2, en:"CMAC", uk:"CMAC",
        dEn:"Built on block ciphers.",
        dUk:"На основі блокових шифрів."},
      {id:"poly1305", lvl:2, en:"Poly1305", uk:"Poly1305",
        dEn:"Used together with ChaCha20.",
        dUk:"Використовується разом з ChaCha20."}
    ]
  },
  {
    id:8, en:"Asymmetric cryptography (encryption)", uk:"Асиметрична криптографія (шифрування)",
    descEn:"Public-key encryption: a public key locks, a private key unlocks.",
    descUk:"Шифрування з відкритим ключем: відкритий ключ шифрує, приватний — розшифровує.",
    algos:[
      {id:"rsa", lvl:1, ref:'RFC 8017', en:"RSA", uk:"RSA", href:"asymmetric.html#rsa",
        dEn:"Security based on factoring large integers.",
        dUk:"Стійкість на основі факторизації великих чисел."},
      {id:"elgamal", lvl:2, en:"ElGamal", uk:"Ель-Гамаля", href:"asymmetric.html#elgamal", alias:"Ель Гамаля",
        dEn:"Based on the discrete logarithm problem.",
        dUk:"На основі задачі дискретного логарифму."},
      {id:"rabin", lvl:2, en:"Rabin", uk:"Рабіна", href:"asymmetric.html#rabin",
        dEn:"Security provably equivalent to factoring; illustrates problem reductions.",
        dUk:"Стійкість еквівалентна факторизації, ілюструє редукцію задач."},
      {id:"ecc", lvl:2, en:"Elliptic-curve crypto (ECC / ECIES)", uk:"Крипто на еліптичних кривих (ECC / ECIES)",
        href:"edwards.html", alias:"Edwards Edwards curves еліптичні криві",
        dEn:"Discrete logarithm on elliptic curves — includes Edwards and twisted Edwards curves.",
        dUk:"Дискретний логарифм на еліптичних кривих — включно з кривими Едвардса та скрученими кривими."},
      {id:"paillier", lvl:3, en:"Paillier", uk:"Paillier",  href:"asymmetric.html#paillier",
        dEn:"Additively homomorphic encryption — important for modern courses.",
        dUk:"Гомоморфне шифрування (адитивна гомоморфність), важливе для сучасних курсів."},
      {id:"kyber", lvl:3, status:'pq', ref:'FIPS 203', en:"Kyber (ML-KEM)", uk:"Kyber (ML-KEM)", alias:"ML-KEM lattice решітки",
        dEn:"Post-quantum, based on lattice problems (module-LWE).",
        dUk:"Постквантова схема, на основі задач з решітками (module-LWE)."},
      {id:"ntru", lvl:3, status:'pq', en:"NTRU", uk:"NTRU",
        dEn:"One of the first lattice-based cryptosystems.",
        dUk:"Одна з перших решіткових криптосистем."},
      {id:"mceliece", lvl:3, status:'pq', en:"McEliece", uk:"McEliece",
        dEn:"Post-quantum, based on error-correcting codes.",
        dUk:"Постквантова схема, на основі кодів, що виправляють помилки."},
      {id:"sm2", lvl:2, ref:'GM/T 0003', en:"SM2", uk:"SM2", alias:"Chinese ECC signature",
        dEn:"China's national elliptic-curve scheme (encryption, signature, key exchange).",
        dUk:"Національна схема Китаю на еліптичних кривих (шифрування, підпис, обмін ключами)."},
      {id:"hqc", lvl:3, status:'pq', ref:'NIST PQC', en:"HQC", uk:"HQC", alias:"code based KEM",
        dEn:"Code-based KEM NIST selected in 2025 as a backup to lattice-based Kyber.",
        dUk:"KEM на кодах, обраний NIST у 2025 як резерв до решіткового Kyber."},
      {id:"frodokem", lvl:3, status:'pq', en:"FrodoKEM", uk:"FrodoKEM", alias:"unstructured lattice plain LWE",
        dEn:"Conservative KEM on unstructured (plain-LWE) lattices — no ring structure to attack.",
        dUk:"Консервативний KEM на неструктурованих решітках (plain-LWE) — немає кільцевої структури для атаки."},
      {id:"hybrid", lvl:2, status:'pq', ref:'RFC 9370', en:"Hybrid X25519 + ML-KEM", uk:"Гібрид X25519 + ML-KEM", alias:"hybrid post-quantum TLS",
        dEn:"Combine a classical and a PQ KEM so the result is safe if either survives.",
        dUk:"Поєднання класичного та PQ-KEM: результат стійкий, якщо вистоїть хоч один."},
      {id:"skelya", lvl:3, status:'pq', en:"Skelya (KEM)", uk:"«Скеля» (KEM)", alias:"Скеля Ukrainian post-quantum",
        dEn:"Ukraine's post-quantum KEM initiative — rarely documented in English.",
        dUk:"Постквантова KEM-ініціатива України — рідко описана англійською."},
      {id:"sike", lvl:3, status:'broken', broken:'2022', en:"SIKE / SIDH", uk:"SIKE / SIDH", alias:"isogeny supersingular broken",
        dEn:"Isogeny-based KEM, a NIST round-4 candidate — broken outright in 2022 (Castryck-Decru).",
        dUk:"KEM на ізогеніях, кандидат 4-го раунду NIST — повністю зламаний у 2022 (Кастрик-Декру)."}
    ]
  },
  {
    id:9, en:"Digital signatures", uk:"Цифрові підписи",
    descEn:"Prove authorship of a message with a private key, verify with a public one.",
    descUk:"Доводять авторство повідомлення приватним ключем, перевіряються відкритим.",
    algos:[
      {id:"dsa", lvl:2, en:"DSA / ECDSA", uk:"DSA / ECDSA",
        dEn:"Based on the (ordinary and elliptic) discrete logarithm.",
        dUk:"На основі дискретного логарифму (звичайного та еліптичного)."},
      {id:"rsapss", lvl:2, en:"RSA signature (RSA-PSS)", uk:"RSA-підпис (RSA-PSS)",
        dEn:"Signature based on factoring.",
        dUk:"Підпис на основі факторизації."},
      {id:"schnorr", lvl:2, en:"Schnorr signature", uk:"Підпис Шнорра",
        dEn:"Simple, elegant, the basis of modern protocols (Bitcoin Taproot).",
        dUk:"Базовий, елегантний, основа для сучасних протоколів (Bitcoin Taproot)."},
      {id:"eddsa", lvl:2, ref:'RFC 8032', en:"EdDSA (Ed25519)", uk:"EdDSA (Ed25519)", href:"signatures.html#eddsa", alias:"Edwards",
        dEn:"Deterministic signature based on Edwards curves.",
        dUk:"Детермінований підпис на основі кривих Едвардса."},
      {id:"dstu4145", lvl:2, en:"DSTU 4145-2002", uk:"ДСТУ 4145-2002", alias:"Ukrainian standard elliptic GF(2m)",
        dEn:"Ukraine's national digital-signature standard, on elliptic curves over binary fields GF(2ᵐ).",
        dUk:"Національний стандарт цифрового підпису України на еліптичних кривих над двійковими полями GF(2ᵐ)."},
      {id:"dilithium", lvl:3, status:'pq', ref:'FIPS 204', en:"Dilithium, Falcon", uk:"Dilithium, Falcon",
        dEn:"Post-quantum lattice signatures (NIST PQC).",
        dUk:"Постквантові підписи на решітках (NIST PQC)."},
      {id:"sphincs", lvl:3, status:'pq', ref:'FIPS 205', en:"SPHINCS+", uk:"SPHINCS+",
        dEn:"Stateless hash-based signature.",
        dUk:"Підпис на основі хеш-функцій (stateless)."},
      {id:"vershyna", lvl:3, status:'pq', en:"Vershyna (signature)", uk:"«Вершина» (підпис)", alias:"Вершина Ukrainian post-quantum",
        dEn:"Ukraine's post-quantum digital-signature initiative — rarely documented in English.",
        dUk:"Постквантова ініціатива цифрового підпису України — рідко описана англійською."},
      {id:"rainbow", lvl:3, status:'broken', broken:'2022', en:"Rainbow", uk:"Rainbow", alias:"multivariate UOV broken",
        dEn:"Multivariate NIST finalist — broken over a weekend in 2022 (Beullens).",
        dUk:"Багатовимірний фіналіст NIST — зламаний за вихідні у 2022 (Бьоленс)."},
      {id:"lamport", lvl:2, en:"Lamport one-time signature", uk:"Одноразовий підпис Лампорта", alias:"OTS hash based",
        dEn:"The simplest hash-based signature — secure but usable only once per key.",
        dUk:"Найпростіший підпис на гешах — стійкий, але придатний лише раз на ключ."},
      {id:"wots", lvl:2, en:"Winternitz OTS (WOTS+)", uk:"Одноразовий підпис Вінтерніца (WOTS+)", alias:"hash chain OTS",
        dEn:"Compresses Lamport by signing several bits per hash chain.",
        dUk:"Стискає схему Лампорта, підписуючи кілька біт на один ланцюг гешів."},
      {id:"merkle", lvl:2, en:"Merkle signature tree", uk:"Підписне дерево Меркла", alias:"hash tree authentication blockchain",
        dEn:"A binary hash tree turns many one-time keys into one reusable public key.",
        dUk:"Двійкове геш-дерево перетворює багато одноразових ключів на один багаторазовий відкритий ключ."},
      {id:"xmss", lvl:3, status:'pq', ref:'RFC 8391', en:"XMSS / LMS", uk:"XMSS / LMS", alias:"stateful hash based signature",
        dEn:"Standardised stateful hash-based signatures (RFC 8391/8554) — the scaffolding under SPHINCS+.",
        dUk:"Стандартизовані стан-залежні підписи на гешах (RFC 8391/8554) — основа під SPHINCS+."}
    ]
  },
  {
    id:10, en:"Key-agreement protocols", uk:"Протоколи узгодження ключів",
    descEn:"Two parties derive a shared secret over a public channel.",
    descUk:"Дві сторони отримують спільний секрет через відкритий канал.",
    algos:[
      {id:"dh", lvl:1, en:"Diffie–Hellman (DH)", uk:"Діффі–Хеллмана (DH)",
        dEn:"The basic discrete-logarithm protocol.",
        dUk:"Базовий протокол на дискретному логарифмі."},
      {id:"ecdh", lvl:2, en:"ECDH", uk:"ECDH", href:"keyexchange.html#ecdh", alias:"Edwards",
        dEn:"The elliptic-curve version.",
        dUk:"Версія на еліптичних кривих."},
      {id:"mqv", lvl:3, en:"MQV, HMQV", uk:"MQV, HMQV",
        dEn:"Authenticated variants of DH.",
        dUk:"Автентифіковані варіанти DH."},
      {id:"sts", lvl:3, en:"STS (Station-to-Station)", uk:"STS (Station-to-Station)",
        dEn:"Authenticated protocol resistant to MITM attacks.",
        dUk:"Протокол з автентифікацією проти MITM-атак."}
    ]
  },
  {
    id:11, en:"Subscriber authentication protocols", uk:"Протоколи автентифікації абонентів ІС",
    descEn:"Protocols by which an information system verifies a subscriber's claimed identity.",
    descUk:"Протоколи, якими інформаційна система перевіряє заявлену особу абонента.",
    algos:[
      {id:"auth-rsa", lvl:2, en:"RSA-based authentication", uk:"Автентифікація на основі RSA",
        dEn:"Challenge–response identity proof using an RSA key pair (asymmetric cryptosystem).",
        dUk:"Доведення особи за схемою «виклик–відповідь» на парі ключів RSA (асиметрична криптосистема)."},
      {id:"auth-ecc", lvl:2, en:"ECC-based authentication", uk:"Автентифікація на основі ECC",
        dEn:"The same challenge–response idea on elliptic curves — shorter keys, faster operations.",
        dUk:"Та сама ідея «виклик–відповідь» на еліптичних кривих — коротші ключі, швидші операції."},
      {id:"auth-fs", lvl:2, en:"Fiat–Shamir identification", uk:"Протокол Фіата–Шаміра",
        dEn:"Zero-knowledge identification proving knowledge of a modular square root.",
        dUk:"Ідентифікація з нульовим розголошенням: доведення знання квадратного кореня за модулем."},
      {id:"auth-ffs", lvl:2, en:"Feige–Fiat–Shamir", uk:"Протокол Фейге–Фіата–Шаміра",
        dEn:"A parallel, multi-secret extension of Fiat–Shamir with a tunable soundness error.",
        dUk:"Паралельне багатосекретне розширення Фіата–Шаміра з керованою похибкою."},
      {id:"milenage", lvl:2, ref:'3GPP TS 35.206', en:"MILENAGE", uk:"MILENAGE", alias:"AKA 3G 4G Rijndael SIM",
        dEn:"The AES/Rijndael-based AKA functions that authenticate a SIM to a mobile network.",
        dUk:"Функції AKA на основі AES/Rijndael, що автентифікують SIM у мобільній мережі."},
      {id:"tuak", lvl:2, ref:'3GPP TS 35.231', en:"TUAK", uk:"TUAK", alias:"AKA Keccak SIM",
        dEn:"The Keccak-based alternative to MILENAGE for SIM authentication.",
        dUk:"Альтернатива MILENAGE на основі Keccak для автентифікації SIM."}
    ]
  },
  {
    id:12, en:"Discrete-log algorithms (cryptanalysis)", uk:"Алгоритми дискретного логарифмування",
    descEn:"Methods that attack the discrete-logarithm assumption.",
    descUk:"Методи, що атакують припущення про складність дискретного логарифму.",
    algos:[
      {id:"shanks", lvl:2, en:"Shanks (baby-step giant-step)", uk:"Алгоритм Шенкса (baby-step giant-step)",
        dEn:"Deterministic, O(√n) time complexity.",
        dUk:"Детермінований алгоритм із часовою складністю O(√n)."},
      {id:"rho-dl", lvl:2, en:"Pollard's rho (DL)", uk:"ρ-алгоритм Полларда (для ДЛ)",
        dEn:"Probabilistic, with smaller memory requirements.",
        dUk:"Імовірнісний алгоритм, менші вимоги до пам'яті."},
      {id:"kangaroo", lvl:3, en:"Pollard's lambda (kangaroo)", uk:"λ-алгоритм Полларда (kangaroo)",
        dEn:"Variant for a bounded exponent range.",
        dUk:"Варіант для обмеженого діапазону показника."},
      {id:"pohlig", lvl:3, en:"Pohlig–Hellman", uk:"Алгоритм Сільвера–Полліга–Геллмана",
        dEn:"Reduces DL for groups of smooth order.",
        dUk:"Редукція задачі ДЛ для груп гладкого порядку."},
      {id:"index", lvl:3, en:"Index Calculus", uk:"Index Calculus",
        dEn:"Sub-exponential algorithm for multiplicative groups of fields.",
        dUk:"Субекспоненційний алгоритм для мультиплікативних груп полів."},
      {id:"nfs-dl", lvl:3, en:"Number Field Sieve (DL)", uk:"Number Field Sieve (для ДЛ)",
        dEn:"Fastest classical algorithm for large fields.",
        dUk:"Найшвидший класичний алгоритм для великих полів."}
    ]
  },
  {
    id:13, en:"Factorisation algorithms (RSA cryptanalysis)", uk:"Алгоритми факторизації (криптоаналіз RSA)",
    descEn:"Methods that recover the prime factors behind an RSA modulus.",
    descUk:"Методи, що відновлюють прості множники модуля RSA.",
    algos:[
      {id:"fermat-f", lvl:1, en:"Fermat's method", uk:"Метод Ферма",
        dEn:"Simple method for numbers with close factors.",
        dUk:"Простий метод для чисел із близькими множниками."},
      {id:"rho-f", lvl:2, en:"Pollard's rho (factoring)", uk:"ρ-алгоритм Полларда (факторизація)",
        dEn:"Distinct from the DL version — the two are often confused.",
        dUk:"Окремий, часто плутають з версією для ДЛ."},
      {id:"p1", lvl:2, en:"Pollard's p−1", uk:"p−1 метод Полларда",
        dEn:"Exploits smoothness of p−1.",
        dUk:"Використовує гладкість p−1."},
      {id:"qs", lvl:3, en:"Quadratic Sieve (QS)", uk:"Метод квадратичного решета (QS)",
        dEn:"Fastest for numbers up to ~100 digits.",
        dUk:"Найшвидший для чисел до ~100 знаків."},
      {id:"gnfs", lvl:3, en:"General Number Field Sieve (GNFS)", uk:"Загальне решето числового поля (GNFS)",
        dEn:"Fastest classical factoring algorithm.",
        dUk:"Найшвидший класичний алгоритм факторизації."},
      {id:"shor-f", lvl:3, en:"Shor's algorithm (quantum)", uk:"Алгоритм Шора (квантовий)",
        dEn:"Polynomial-time quantum factoring — the main motivation for PQC.",
        dUk:"Поліноміальна факторизація на квантовому комп'ютері, головна мотивація постквантової криптографії."}
    ]
  },
  {
    id:14, en:"Fields and quadratic residues", uk:"Робота з полями та квадратичними лишками",
    descEn:"Tools for square roots and residues in finite fields.",
    descUk:"Інструменти для квадратних коренів та лишків у скінченних полях.",
    algos:[
      {id:"tonelli", lvl:2, en:"Tonelli–Shanks", uk:"Алгоритм Тонеллі–Шенкса",
        dEn:"Computes square roots modulo a prime.",
        dUk:"Обчислення квадратних коренів за модулем простого числа."},
      {id:"legendre", lvl:1, en:"Legendre / Jacobi symbol", uk:"Символ Лежандра / Якобі",
        dEn:"Tools for testing quadratic residues.",
        dUk:"Інструменти для перевірки квадратичних лишків."},
      {id:"cipolla", lvl:3, en:"Cipolla's algorithm", uk:"Алгоритм Cipolla",
        dEn:"An alternative method for computing square roots.",
        dUk:"Альтернативний метод обчислення квадратних коренів."}
    ]
  },
  {
    id:15, en:"Codes & linear recurrences", uk:"Коди та лінійні рекуренти",
    descEn:"Algorithms for error-correcting codes and LFSR analysis.",
    descUk:"Алгоритми для кодів, що виправляють помилки, та аналізу LFSR.",
    algos:[
      {id:"berlekamp-massey", lvl:3, en:"Berlekamp–Massey", uk:"Алгоритм Берлекемпа–Мессі",
        dEn:"Finds the minimal LFSR — critical for stream-cipher cryptanalysis.",
        dUk:"Знаходження мінімального LFSR, критичний для криптоаналізу потокових шифрів."},
      {id:"berlekamp-rs", lvl:3, en:"Berlekamp (Reed–Solomon decoding)", uk:"Алгоритм Берлекемпа (декодування Ріда–Соломона)",
        dEn:"Used in the McEliece cryptosystem.",
        dUk:"Застосовується в McEliece криптосистемі."}
    ]
  },
  {
    id:16, en:"Primality tests", uk:"Тести на простоту",
    descEn:"Decide whether a number is prime — the backbone of key generation.",
    descUk:"Визначають, чи число просте — основа генерації ключів.",
    algos:[
      {id:"fermat-p", lvl:1, en:"Fermat test", uk:"Тест Ферма",
        dEn:"Simple, but has exceptions (Carmichael numbers).",
        dUk:"Простий, але з винятками (числа Кармайкла)."},
      {id:"miller", lvl:1, en:"Miller–Rabin", uk:"Тест Міллера–Рабіна",
        dEn:"Probabilistic, the de-facto standard.",
        dUk:"Імовірнісний, стандарт де-факто."},
      {id:"solovay", lvl:2, en:"Solovay–Strassen", uk:"Тест Соловея–Штрассена",
        dEn:"Another probabilistic test.",
        dUk:"Інший імовірнісний тест."},
      {id:"aks", lvl:3, en:"AKS", uk:"AKS-алгоритм",
        dEn:"The first deterministic polynomial-time primality test.",
        dUk:"Перший детермінований поліноміальний тест на простоту."}
    ]
  },
  {
    id:17, en:"Lattice cryptography & cryptanalysis", uk:"Решіткова криптографія та криптоаналіз",
    descEn:"Lattice reduction, foundational for PQC and its attacks.",
    descUk:"Редукція решіток — основа постквантової криптографії та атак на неї.",
    algos:[
      {id:"lll", lvl:3, en:"LLL (Lenstra–Lenstra–Lovász)", uk:"Алгоритм LLL (Ленстра–Ленстра–Ловаса)",
        href:"advanced.html#lll",
        dEn:"Lattice basis reduction, used in attacks and cryptosystems.",
        dUk:"Редукція базису решітки, використовується в атаках і криптосистемах."},
      {id:"bkz", lvl:3, en:"BKZ", uk:"BKZ-алгоритм", href:"advanced.html#bkz",
        dEn:"Improved basis reduction for estimating lattice-scheme strength.",
        dUk:"Покращена редукція базису для оцінки стійкості решіткових схем."},
      {id:"coppersmith", lvl:3, en:"Coppersmith's attack", uk:"Атака Копперсміта", href:"advanced.html#coppersmith",
        dEn:"Small roots of polynomial equations; attacks on low-exponent RSA.",
        dUk:"Знаходження малих коренів поліноміальних рівнянь, атаки на RSA з малими показниками."}
    ]
  },
  {
    id:18, en:"Secret sharing & MPC", uk:"Розділення секрету та багатосторонні обчислення",
    descEn:"Split a secret among parties; compute jointly without revealing inputs.",
    descUk:"Розділяють секрет між сторонами; обчислюють спільно, не розкриваючи входів.",
    algos:[
      {id:"shamir", lvl:2, en:"Shamir's Secret Sharing", uk:"Схема Шаміра", href:"advanced.html#shamir",
        dEn:"Threshold scheme via polynomial interpolation.",
        dUk:"Порогова схема на поліноміальній інтерполяції."},
      {id:"blakley", lvl:2, en:"Blakley's scheme", uk:"Схема Блеклі", href:"advanced.html#blakley",
        dEn:"A geometric approach to secret sharing.",
        dUk:"Геометричний підхід до розділення секрету."},
      {id:"mpc", lvl:3, en:"Secure MPC", uk:"Багатосторонні обчислення (MPC)", href:"advanced.html#mpc",
        alias:"Yao GMW garbled",
        dEn:"Yao's Garbled Circuits, the GMW protocol.",
        dUk:"Yao's Garbled Circuits, GMW-протокол."},
      {id:"yao", lvl:3, en:"Yao's garbled circuits", uk:"Заплутані схеми Яо", alias:"garbled circuit 2PC",
        dEn:"Two-party computation by encrypting a Boolean circuit gate by gate.",
        dUk:"Двостороннє обчислення шляхом шифрування булевої схеми вентиль за вентилем."},
      {id:"ot", lvl:2, en:"Oblivious transfer (OT)", uk:"Забудькувата передача (OT)", alias:"Rabin 1-of-2 IKNP",
        dEn:"Receiver gets one of two messages; sender learns nothing — the root of MPC.",
        dUk:"Отримувач бере одне з двох повідомлень; відправник не дізнається нічого — корінь MPC."},
      {id:"beaver", lvl:3, en:"Beaver triples", uk:"Трійки Бівера", alias:"multiplication triples preprocessing",
        dEn:"Precomputed shared products that make secret-shared multiplication cheap online.",
        dUk:"Заздалегідь обчислені спільні добутки, що здешевлюють онлайн-множення розділених секретів."},
      {id:"psi", lvl:3, en:"Private set intersection (PSI)", uk:"Приватний перетин множин (PSI)", alias:"contact discovery",
        dEn:"Two parties learn only which elements they share (e.g. contact discovery).",
        dUk:"Дві сторони дізнаються лише спільні елементи (напр. виявлення контактів)."}
    ]
  },
  {
    id:19, en:"Zero-knowledge proofs (ZKP)", uk:"Криптографія з нульовим розголошенням (ZKP)",
    descEn:"Prove a statement is true while revealing nothing else.",
    descUk:"Доводять істинність твердження, не розкриваючи нічого іншого.",
    algos:[
      {id:"ffs", lvl:2, en:"Feige–Fiat–Shamir", uk:"Протокол Фейге–Фіата–Шаміра", href:"advanced.html#ffs",
        dEn:"An interactive ZKP.",
        dUk:"Інтерактивний ZKP."},
      {id:"schnorr-zk", lvl:2, en:"Schnorr protocol (ZKP)", uk:"Протокол Шнорра (ZKP-версія)",
        href:"advanced.html#schnorr-zk",
        dEn:"Proof of knowledge of a discrete logarithm.",
        dUk:"Доведення знання дискретного логарифму."},
      {id:"snark", lvl:3, en:"zk-SNARKs, zk-STARKs", uk:"zk-SNARKs, zk-STARKs", href:"advanced.html#snark",
        dEn:"Modern non-interactive systems, important for blockchain courses.",
        dUk:"Сучасні неінтерактивні системи, важливі для блокчейн-курсів."},
      {id:"pedersen", lvl:2, en:"Pedersen commitment", uk:"Зобов'язання Педерсена", alias:"commitment hiding binding",
        dEn:"A hiding, binding commitment c = g^x·h^r — the primitive Schnorr proofs assume.",
        dUk:"Приховуюче та зв'язуюче зобов'язання c = g^x·h^r — примітив, який припускають докази Шнорра."},
      {id:"vss", lvl:3, en:"Verifiable secret sharing (Feldman/Pedersen)", uk:"Верифіковане розділення секрету (Фелдман/Педерсен)", alias:"VSS DKG",
        dEn:"Shamir sharing plus commitments so parties can verify their shares — the base of DKG.",
        dUk:"Схема Шаміра плюс зобов'язання, щоб сторони перевіряли свої частки — основа DKG."}
    ]
  },
  {
    id:20, en:"Quantum algorithms", uk:"Квантові алгоритми",
    descEn:"Algorithms that reshape cryptographic hardness on a quantum computer.",
    descUk:"Алгоритми, що змінюють криптографічну складність на квантовому комп'ютері.",
    algos:[
      {id:"shor-q", lvl:3, en:"Shor's algorithm", uk:"Алгоритм Шора",
        dEn:"Factoring and discrete logarithm.",
        dUk:"Факторизація та дискретний логарифм."},
      {id:"grover", lvl:3, en:"Grover's algorithm", uk:"Алгоритм Гровера",
        dEn:"Quadratic search speed-up — forces symmetric keys to double in length.",
        dUk:"Квадратичне прискорення пошуку, впливає на симетричні ключі (потрібне подвоєння довжини ключа)."},
      {id:"bb84", lvl:2, en:"BB84", uk:"Протокол BB84",
        dEn:"Quantum key distribution (QKD).",
        dUk:"Квантовий розподіл ключів (QKD)."},
      {id:"e91", lvl:3, en:"E91 (Ekert)", uk:"Протокол E91 (Екерта)",
        dEn:"QKD based on quantum entanglement.",
        dUk:"QKD на основі квантової заплутаності."}
    ]
  },
  {
    id:21, en:"Homomorphic encryption", uk:"Гомоморфне шифрування",
    descEn:"Compute directly on ciphertexts without decrypting.",
    descUk:"Обчислення безпосередньо над шифротекстами без розшифрування.",
    algos:[
      {id:"gentry", lvl:3, en:"Gentry's scheme", uk:"Схема Гентрі (Gentry)", href:"advanced.html#gentry",
        dEn:"The first fully homomorphic (FHE) scheme, lattice-based.",
        dUk:"Перша повністю гомоморфна схема (FHE) на решітках."},
      {id:"bgv", lvl:3, en:"BGV, BFV, CKKS", uk:"BGV, BFV, CKKS", href:"advanced.html#bgv",
        dEn:"Modern practical FHE schemes.",
        dUk:"Сучасні практичні FHE-схеми."}
    ]
  },
  {
    id:22, en:"Lightweight ciphers", uk:"Легковагові (lightweight) шифри",
    descEn:"Ciphers for constrained devices (IoT, smart cards, RFID).",
    descUk:"Шифри для пристроїв з обмеженими ресурсами (IoT, смарт-карти, RFID).",
    algos:[
      {id:"tea", lvl:2, en:"TEA", uk:"TEA (Tiny Encryption Algorithm)",
        dEn:"Extremely simple Feistel cipher; famous for compact code, weak key schedule.",
        dUk:"Надзвичайно простий шифр Фейстеля; компактний код, але слабкий розклад ключів."},
      {id:"xtea", lvl:2, en:"XTEA", uk:"XTEA (eXtended TEA)",
        dEn:"Fixed version of TEA that removes equivalent keys.",
        dUk:"Виправлена версія TEA, усуває проблему еквівалентних ключів."},
      {id:"xxtea", lvl:2, en:"XXTEA", uk:"XXTEA (Corrected Block TEA)",
        dEn:"Operates on variable-length blocks with full rounds over the whole block.",
        dUk:"Працює з блоками змінної довжини, повні раунди по всьому блоку."},
      {id:"present", lvl:2, en:"PRESENT", uk:"PRESENT",
        dEn:"One of the first standardised (ISO/IEC 29192) lightweight ciphers.",
        dUk:"Один з перших стандартизованих (ISO/IEC 29192) легковагових шифрів."},
      {id:"simon", lvl:2, en:"SIMON & SPECK", uk:"SIMON та SPECK",
        dEn:"NSA families tuned for hardware (SIMON) and software (SPECK).",
        dUk:"Сімейства від NSA, оптимізовані під апаратну (SIMON) і програмну (SPECK) реалізацію."},
      {id:"clefia", lvl:3, en:"CLEFIA", uk:"CLEFIA",
        dEn:"Japanese lightweight cipher (Sony), generalised Feistel structure.",
        dUk:"Японський легковаговий шифр (Sony), узагальнена структура Фейстеля."},
      {id:"prince", lvl:3, en:"PRINCE", uk:"PRINCE",
        dEn:"Low-latency cipher with the α-reflection property.",
        dUk:"Орієнтований на низьку затримку, з властивістю α-reflection."},
      {id:"led", lvl:3, en:"LED", uk:"LED (Light Encryption Device)",
        dEn:"AES-inspired SP-network simplified for hardware.",
        dUk:"SP-мережа, натхненна AES, спрощена для апаратної ефективності."},
      {id:"katan", lvl:3, en:"KATAN / KTANTAN", uk:"KATAN / KTANTAN",
        dEn:"Ultra-compact shift-register ciphers for cheap RFID chips.",
        dUk:"Надкомпактні шифри на зсувних регістрах для дешевих RFID-чипів."},
      {id:"gift", lvl:3, en:"Skinny & GIFT", uk:"Skinny та GIFT",
        dEn:"Modern lightweight ciphers; GIFT underlies NIST finalist GIFT-COFB.",
        dUk:"Сучасні легковагові шифри; GIFT ліг в основу фіналіста NIST GIFT-COFB."},
      {id:"ascon", lvl:2, en:"ASCON", uk:"ASCON",
        dEn:"Winner of NIST Lightweight Cryptography (2023); permutation-based AEAD.",
        dUk:"Переможець NIST Lightweight Cryptography (2023), AEAD на основі перестановки."},
      {id:"chaskey", lvl:3, en:"Chaskey", uk:"Chaskey",
        dEn:"Lightweight ARX MAC tuned for microcontrollers.",
        dUk:"Легковагова MAC-функція (ARX), оптимізована під мікроконтролери."}
    ]
  },
  {
    id:23, en:"Number-theoretic algorithms", uk:"Теоретико-числові алгоритми",
    descEn:"The arithmetic building blocks under every public-key system — GCD, congruences, CRT, finite-field and elliptic-curve operations.",
    descUk:"Арифметичні будівельні блоки під кожною системою з відкритим ключем — НСД, конгруенції, КТЛ, операції у скінченних полях та на еліптичних кривих.",
    algos:[
      {id:"euclid", lvl:1, en:"Euclidean algorithm (classic & extended)", uk:"Алгоритм Евкліда (класичний та розширений)",
        alias:"gcd Bezout НСД Безу",
        dEn:"Computes gcd(a,b); the extended form also returns Bézout coefficients with a·s+b·t=gcd.",
        dUk:"Обчислює нсд(a,b); розширена форма також повертає коефіцієнти Безу, де a·s+b·t=нсд."},
      {id:"lincong", lvl:1, en:"Linear congruences", uk:"Лінійні конгруенції",
        alias:"ax b mod m",
        dEn:"Solves a·x ≡ b (mod m); solvable iff gcd(a,m) divides b, giving gcd(a,m) solutions.",
        dUk:"Розв'язує a·x ≡ b (mod m); розв'язне, коли нсд(a,m) ділить b, і дає нсд(a,m) розв'язків."},
      {id:"diophantine", lvl:1, en:"Linear Diophantine equations", uk:"Лінійні діофантові рівняння",
        alias:"ax by c integer",
        dEn:"Finds every integer solution of a·x + b·y = c from one particular solution.",
        dUk:"Знаходить усі цілі розв'язки рівняння a·x + b·y = c з одного часткового розв'язку."},
      {id:"crt", lvl:1, en:"Chinese Remainder Theorem", uk:"Китайська теорема про лишки",
        alias:"CRT КТЛ residues",
        dEn:"Reconstructs a unique value modulo the product from residues to pairwise-coprime moduli.",
        dUk:"Відновлює єдине значення за модулем добутку з лишків за попарно взаємно простими модулями."},
      {id:"gffield", lvl:1, en:"Finite-field arithmetic (GF(p))", uk:"Арифметика у скінченних полях (GF(p))",
        alias:"finite field Galois modular",
        dEn:"Addition, multiplication, inverses and the cyclic multiplicative group modulo a prime.",
        dUk:"Додавання, множення, обернені елементи та циклічна мультиплікативна група за простим модулем."},
      {id:"gfpoly", lvl:2, en:"Polynomials over finite fields (GF(pᵏ))", uk:"Многочлени над скінченними полями (GF(pᵏ))",
        alias:"polynomial irreducible extension field",
        dEn:"Polynomial arithmetic modulo an irreducible polynomial constructs extension fields.",
        dUk:"Арифметика многочленів за модулем незвідного многочлена будує розширені поля."},
      {id:"ecgroup", lvl:2, en:"Elliptic-curve group law", uk:"Груповий закон на еліптичній кривій",
        alias:"point addition doubling chord tangent",
        dEn:"Point addition and doubling by the chord-and-tangent construction — the operation crypto is built on.",
        dUk:"Додавання та подвоєння точок за побудовою хорди-дотичної — операція, на якій будується криптографія."},
      {id:"montgomery", lvl:2, en:"Montgomery reduction", uk:"Зведення Монтгомері", alias:"modular multiplication",
        dEn:"Modular reduction without trial division — the workhorse of fast modular multiplication.",
        dUk:"Модульне зведення без пробного ділення — робоча конячка швидкого модульного множення."},
      {id:"barrett", lvl:2, en:"Barrett reduction", uk:"Зведення Барретта", alias:"modular reduction precomputed",
        dEn:"Reduction by a precomputed reciprocal; common in lattice PQC.",
        dUk:"Зведення через заздалегідь обчислену обернену величину; поширене у решітковій PQC."},
      {id:"karatsuba", lvl:2, en:"Karatsuba / Toom-Cook", uk:"Карацуба / Тоом-Кук", alias:"fast multiplication",
        dEn:"Sub-quadratic big-integer multiplication by splitting the operands.",
        dUk:"Субквадратичне множення великих чисел розбиттям операндів."},
      {id:"ntt", lvl:3, usedBy:['kyber','dilithium'], en:"Number-theoretic transform (NTT)", uk:"Теоретико-числове перетворення (NTT)", alias:"FFT polynomial multiplication lattice",
        dEn:"An FFT over a finite field — the real reason Kyber and Dilithium are fast.",
        dUk:"FFT над скінченним полем — справжня причина, чому Kyber і Dilithium швидкі."},
      {id:"slidingwindow", lvl:2, en:"Sliding-window exponentiation", uk:"Піднесення ковзним вікном", alias:"square and multiply",
        dEn:"Speeds up modular exponentiation by processing several exponent bits at once.",
        dUk:"Пришвидшує модульне піднесення, обробляючи кілька біт показника за раз."},
      {id:"schoof", lvl:3, en:"Schoof / SEA point counting", uk:"Підрахунок точок Схоофа / SEA", alias:"elliptic curve order counting",
        dEn:"Counts the points on an elliptic curve in polynomial time — needed to build secure curves.",
        dUk:"Підраховує точки еліптичної кривої за поліноміальний час — потрібне для побудови стійких кривих."}
    ]
  },
  {
    id:24, en:"Key derivation & password hashing", uk:"Виведення ключів та гешування паролів",
    descEn:"Turn a shared secret or a low-entropy password into strong cryptographic keys — the step every §10 protocol ends on.",
    descUk:"Перетворюють спільний секрет або пароль з низькою ентропією на стійкі криптографічні ключі — крок, яким завершується кожен протокол §10.",
    algos:[
      {id:"hkdf", lvl:1, ref:'RFC 5869', usedBy:['tls13'], en:"HKDF", uk:"HKDF",
        alias:"extract expand key derivation",
        dEn:"Extract-then-expand KDF built on HMAC; derives many keys from one shared secret.",
        dUk:"KDF за схемою «extract-then-expand» на основі HMAC; виводить багато ключів з одного спільного секрету."},
      {id:"pbkdf2", lvl:1, ref:'RFC 8018', en:"PBKDF2", uk:"PBKDF2",
        alias:"password iterations salt",
        dEn:"Password hashing by iterated HMAC; only CPU-hard, so weak against GPUs/ASICs.",
        dUk:"Гешування паролів ітерованим HMAC; лише CPU-складне, тож слабке проти GPU/ASIC."},
      {id:"bcrypt", lvl:1, en:"bcrypt", uk:"bcrypt",
        dEn:"Blowfish-based adaptive password hash with a tunable cost factor.",
        dUk:"Адаптивний геш паролів на основі Blowfish із регульованим фактором вартості."},
      {id:"scrypt", lvl:2, ref:'RFC 7914', en:"scrypt", uk:"scrypt",
        alias:"memory hard",
        dEn:"Memory-hard password hash — raises the cost of parallel hardware attacks.",
        dUk:"Пам'ять-складний геш паролів — підвищує вартість атак на паралельному апараті."},
      {id:"argon2", lvl:2, ref:'RFC 9106', en:"Argon2", uk:"Argon2",
        alias:"memory hard PHC winner",
        dEn:"Winner of the Password Hashing Competition; tunable memory, time and parallelism.",
        dUk:"Переможець Password Hashing Competition; регульовані пам'ять, час і паралелізм."},
      {id:"balloon", lvl:3, en:"Balloon hashing", uk:"Balloon-гешування",
        dEn:"Memory-hard hashing with a proof of memory-hardness, built from any standard hash.",
        dUk:"Пам'ять-складне гешування з доказом пам'ять-складності на основі будь-якого стандартного гешу."}
    ]
  },
  {
    id:25, en:"Symmetric cryptanalysis", uk:"Симетричний криптоаналіз",
    descEn:"Why block ciphers, stream ciphers and hashes fall — the attacks behind DES, RC4 and SHA-1's retirement.",
    descUk:"Чому падають блокові, потокові шифри та геші — атаки, що стоять за виведенням з ужитку DES, RC4 і SHA-1.",
    algos:[
      {id:"differential", lvl:3, en:"Differential cryptanalysis", uk:"Диференціальний криптоаналіз",
        alias:"Biham Shamir characteristic",
        dEn:"Tracks how input differences propagate to output differences through the rounds.",
        dUk:"Відстежує, як різниці входу поширюються у різниці виходу крізь раунди."},
      {id:"linear", lvl:3, en:"Linear cryptanalysis", uk:"Лінійний криптоаналіз",
        alias:"Matsui approximation",
        dEn:"Approximates the cipher by linear relations biased away from 1/2.",
        dUk:"Наближає шифр лінійними співвідношеннями зі зсувом від 1/2."},
      {id:"mitm", lvl:3, en:"Meet-in-the-middle / biclique", uk:"Зустріч посередині / biclique",
        alias:"2DES double encryption",
        dEn:"Halves the effective key length of double encryption; bicliques broke full AES marginally.",
        dUk:"Удвічі зменшує ефективну довжину ключа подвійного шифрування; biclique незначно «зламав» повний AES."},
      {id:"slide", lvl:3, en:"Slide attacks", uk:"Slide-атаки",
        dEn:"Exploit self-similar round structure independent of the number of rounds.",
        dUk:"Використовують самоподібну структуру раундів незалежно від їх кількості."},
      {id:"boomerang", lvl:3, en:"Boomerang & related-key", uk:"Boomerang та зв'язані ключі",
        dEn:"Combine two short differentials; related-key attacks broke full AES-256's key schedule.",
        dUk:"Поєднують два короткі диференціали; атаки на зв'язаних ключах «зламали» розклад ключів AES-256."},
      {id:"birthday", lvl:2, en:"Birthday bound & collisions", uk:"Межа днів народжень і колізії",
        dEn:"Collisions appear after ~2^(n/2) outputs — why 128-bit hashes are unsafe against collisions.",
        dUk:"Колізії з'являються після ~2^(n/2) виходів — чому 128-бітні геші небезпечні щодо колізій."},
      {id:"tmto", lvl:3, en:"TMTO & rainbow tables", uk:"TMTO та райдужні таблиці",
        alias:"Hellman time memory tradeoff",
        dEn:"Hellman's time-memory trade-off precomputes tables to invert one-way functions.",
        dUk:"Компроміс «час-пам'ять» Геллмана заздалегідь обчислює таблиці для обернення однобічних функцій."},
      {id:"lenext", lvl:2, usedBy:['hmac','sha3'], en:"Length-extension attack", uk:"Атака подовженням",
        alias:"Merkle Damgard MAC",
        dEn:"Merkle–Damgård hashes leak H(m‖pad‖x) from H(m) — the reason HMAC and the sponge exist.",
        dUk:"Геші Меркла–Дамґарда розкривають H(m‖pad‖x) з H(m) — причина існування HMAC і губки."}
    ]
  },
  {
    id:26, en:"Implementation & physical attacks", uk:"Атаки на реалізацію та фізичні атаки",
    descEn:"Where almost every real-world break actually happens — timing, power, faults and padding oracles, plus the countermeasures.",
    descUk:"Де насправді трапляється майже кожен реальний злам — час, живлення, збої та padding-оракули, а також контрзаходи.",
    algos:[
      {id:"timing", lvl:2, en:"Timing attacks", uk:"Атаки за часом",
        alias:"Kocher constant time",
        dEn:"Recover secrets from data-dependent execution time (Kocher, 1996).",
        dUk:"Відновлюють секрети з часу виконання, залежного від даних (Кочер, 1996)."},
      {id:"cache", lvl:3, en:"Cache attacks", uk:"Кеш-атаки",
        alias:"Flush Reload Prime Probe",
        dEn:"Flush+Reload / Prime+Probe leak table-lookup indices via the CPU cache.",
        dUk:"Flush+Reload / Prime+Probe розкривають індекси табличних звернень через кеш процесора."},
      {id:"dpa", lvl:3, en:"Power analysis (SPA/DPA)", uk:"Аналіз живлення (SPA/DPA)",
        dEn:"Correlate power consumption with secret-dependent operations.",
        dUk:"Корелюють споживання живлення з операціями, залежними від секрету."},
      {id:"fault", lvl:3, en:"Fault attacks (Bellcore)", uk:"Атаки збоями (Bellcore)",
        alias:"RSA-CRT glitch",
        dEn:"A single fault in RSA-CRT signing reveals the private key by a gcd.",
        dUk:"Один збій у підписі RSA-CRT розкриває приватний ключ через нсд."},
      {id:"paddingoracle", lvl:2, en:"Padding oracles (Bleichenbacher)", uk:"Padding-оракули (Бляйхенбахер)",
        alias:"POODLE Lucky13 PKCS1",
        dEn:"Error/behaviour differences on bad padding decrypt ciphertexts (Bleichenbacher, POODLE).",
        dUk:"Різниця у поведінці на хибному доповненні розшифровує шифротексти (Бляйхенбахер, POODLE)."},
      {id:"roca", lvl:3, status:'broken', broken:'2017', en:"ROCA", uk:"ROCA",
        alias:"Infineon RSA key",
        dEn:"Structured primes in Infineon's library made millions of RSA keys factorable.",
        dUk:"Структуровані прості в бібліотеці Infineon зробили мільйони ключів RSA факторизовними."},
      {id:"ctmeasures", lvl:2, en:"Countermeasures", uk:"Контрзаходи",
        alias:"blinding masking Montgomery ladder constant time",
        dEn:"Constant-time code, blinding, masking and the Montgomery ladder close these channels.",
        dUk:"Код сталого часу, засліплення, маскування та драбина Монтгомері закривають ці канали."}
    ]
  },
  {
    id:27, en:"Applied protocols", uk:"Прикладні протоколи",
    descEn:"How primitives compose into real systems — and the downgrade, replay and forward-secrecy failures composition introduces.",
    descUk:"Як примітиви складаються у реальні системи — і які збої зниження версії, повторів і прямої секретності це вносить.",
    algos:[
      {id:"tls13", lvl:2, ref:'RFC 8446', en:"TLS 1.3 handshake", uk:"Рукостискання TLS 1.3",
        alias:"handshake forward secrecy",
        dEn:"1-RTT authenticated key exchange with forward secrecy and downgrade protection.",
        dUk:"Автентифікований обмін ключами за 1-RTT із прямою секретністю та захистом від зниження версії."},
      {id:"signal", lvl:2, en:"Signal (X3DH + Double Ratchet)", uk:"Signal (X3DH + Double Ratchet)",
        alias:"double ratchet forward secrecy messaging",
        dEn:"Asynchronous messaging with forward secrecy and post-compromise security.",
        dUk:"Асинхронний обмін повідомленнями з прямою секретністю та відновленням після компрометації."},
      {id:"noise", lvl:2, en:"Noise protocol framework", uk:"Каркас протоколів Noise",
        dEn:"A construction kit of DH-based handshakes (used by WireGuard).",
        dUk:"Конструктор рукостискань на основі DH (використовується у WireGuard)."},
      {id:"ipsec", lvl:2, ref:'RFC 7296', en:"IKEv2 / IPsec", uk:"IKEv2 / IPsec",
        dEn:"Network-layer VPN key exchange and encrypted tunnels.",
        dUk:"Обмін ключами та шифровані тунелі мережевого рівня (VPN)."},
      {id:"wireguard", lvl:2, en:"WireGuard", uk:"WireGuard",
        dEn:"Minimal modern VPN built on Noise, Curve25519 and ChaCha20-Poly1305.",
        dUk:"Мінімалістичний сучасний VPN на основі Noise, Curve25519 і ChaCha20-Poly1305."},
      {id:"kerberos", lvl:2, ref:'RFC 4120', en:"Kerberos", uk:"Kerberos",
        dEn:"Ticket-based symmetric authentication for networks (Active Directory).",
        dUk:"Автентифікація в мережах на основі квитків і симетричних ключів (Active Directory)."},
      {id:"pake", lvl:3, en:"PAKE (SRP, SPAKE2, OPAQUE)", uk:"PAKE (SRP, SPAKE2, OPAQUE)",
        alias:"password authenticated key exchange",
        dEn:"Turn a shared password into a session key with no offline-guessing exposure.",
        dUk:"Перетворюють спільний пароль на сеансовий ключ без вразливості до офлайн-добору."},
      {id:"fido2", lvl:2, en:"FIDO2 / WebAuthn", uk:"FIDO2 / WebAuthn",
        alias:"passkeys hardware authentication",
        dEn:"Phishing-resistant public-key authentication (passkeys, security keys).",
        dUk:"Стійка до фішингу автентифікація з відкритим ключем (passkeys, апаратні ключі)."},
      {id:"otp", lvl:1, ref:'RFC 6238', en:"HOTP / TOTP", uk:"HOTP / TOTP",
        alias:"one time password authenticator",
        dEn:"HMAC-based one-time passwords for two-factor authentication.",
        dUk:"Одноразові паролі на основі HMAC для двофакторної автентифікації."}
    ]
  },
  {
    id:28, en:"Pairings & pairing-based cryptography", uk:"Спарювання та криптографія на спарюваннях",
    descEn:"Bilinear maps on elliptic curves — the foundation under identity-based encryption, BLS signatures and zk-SNARKs.",
    descUk:"Білінійні відображення на еліптичних кривих — основа шифрування за ідентичністю, підписів BLS та zk-SNARK.",
    algos:[
      {id:"pairing", lvl:3, en:"Weil / Tate pairing", uk:"Спарювання Вейля / Тейта",
        alias:"bilinear map Miller",
        dEn:"A bilinear map e(aP, bQ) = e(P, Q)^{ab} computed by Miller's algorithm.",
        dUk:"Білінійне відображення e(aP, bQ) = e(P, Q)^{ab}, обчислюване алгоритмом Міллера."},
      {id:"bls", lvl:3, en:"BLS signatures", uk:"Підписи BLS",
        alias:"Boneh Lynn Shacham aggregate",
        dEn:"Short, aggregatable signatures verified by a single pairing check.",
        dUk:"Короткі агреговні підписи, що перевіряються одним спарюванням."},
      {id:"bls12381", lvl:3, en:"BLS12-381 curve", uk:"Крива BLS12-381",
        dEn:"The pairing-friendly curve behind Ethereum, Zcash and modern SNARKs.",
        dUk:"Дружня до спарювань крива в основі Ethereum, Zcash і сучасних SNARK."},
      {id:"bfibe", lvl:3, en:"Boneh–Franklin IBE", uk:"IBE Боне–Франкліна",
        alias:"identity based encryption",
        dEn:"Identity-based encryption: any string (an email) is a public key.",
        dUk:"Шифрування за ідентичністю: будь-який рядок (email) є відкритим ключем."},
      {id:"frost", lvl:3, en:"Aggregate & threshold signatures (FROST)", uk:"Агреговні та порогові підписи (FROST)",
        dEn:"Combine many signers into one signature; FROST is a threshold Schnorr scheme.",
        dUk:"Поєднують багатьох підписантів в один підпис; FROST — порогова схема Шнорра."}
    ]
  },
  {
    id:29, en:"Privacy & anonymity", uk:"Приватність та анонімність",
    descEn:"Cryptography for e-voting, e-cash and e-government: hide who did what, while still proving it was allowed.",
    descUk:"Криптографія для е-голосування, е-готівки та е-урядування: приховати, хто що зробив, водночас доводячи, що це було дозволено.",
    algos:[
      {id:"blindsig", lvl:2, en:"Chaum blind signatures", uk:"Сліпі підписи Чаума",
        alias:"e-cash ecash",
        dEn:"Sign a message without seeing it — the basis of untraceable e-cash and e-voting.",
        dUk:"Підписати повідомлення, не бачачи його — основа невідстежуваної е-готівки та е-голосування."},
      {id:"ringsig", lvl:3, en:"Ring & group signatures", uk:"Кільцеві та групові підписи",
        dEn:"Prove membership of a signing group without revealing which member signed.",
        dUk:"Довести належність до групи підписантів, не розкриваючи, хто саме підписав."},
      {id:"onion", lvl:2, en:"Onion routing (Tor)", uk:"Цибулева маршрутизація (Tor)",
        dEn:"Layered encryption through relays hides who is talking to whom.",
        dUk:"Багатошарове шифрування через вузли приховує, хто з ким спілкується."},
      {id:"mixnet", lvl:3, en:"Mix networks", uk:"Мережі-мікшери",
        dEn:"Shuffle and re-encrypt batches of messages to break sender–receiver links.",
        dUk:"Перемішують і перешифровують пакети повідомлень, розриваючи зв'язок відправник–отримувач."},
      {id:"pir", lvl:3, en:"Private information retrieval (PIR)", uk:"Приватне отримання інформації (PIR)",
        dEn:"Query a database without revealing which record was requested.",
        dUk:"Запитувати базу даних, не розкриваючи, який запис було запрошено."},
      {id:"anoncred", lvl:3, en:"Anonymous credentials", uk:"Анонімні посвідчення",
        dEn:"Prove you hold a valid credential (e.g. over 18) revealing nothing else.",
        dUk:"Довести, що ви маєте дійсне посвідчення (напр. «понад 18»), не розкриваючи нічого іншого."}
    ]
  }
];

/* UI chrome strings (page furniture, not algorithm content) */
const I18N = {
  en:{
    brand:"Crypto Atlas",
    tagline:"Cryptographic algorithms — visual field guide",
    navHome:"Catalogue", navAsym:"Asymmetric", navEdwards:"Edwards curves",
    searchPlaceholder:"Search algorithms…",
    noResults:"Nothing found",
    lvlLegend:["Bachelor","Master","PhD"],
    cxLegend:["light computation","moderate cost","resource-intensive"],
    catalogTitle:"Full algorithm catalogue",
    catalogLede:"Every algorithm from the course outline, grouped by topic. Each item is tagged with its study level; implemented interactive demos are linked.",
    implemented:"demo",
    showing:"showing",
    of:"of",
    algorithms:"algorithms", topics:"topics",
    viewTopic:"By topic", viewAlpha:"A–Z",
    filterNote:"Filter the catalogue — click a level or a cost to toggle it on/off:"
  },
  uk:{
    brand:"Крипто-Атлас",
    tagline:"Криптографічні алгоритми — візуальний путівник",
    navHome:"Каталог", navAsym:"Асиметричні", navEdwards:"Криві Едвардса",
    searchPlaceholder:"Пошук алгоритмів…",
    noResults:"Нічого не знайдено",
    lvlLegend:["Бакалаврат","Магістратура","PhD"],
    cxLegend:["легкі обчислення","помірна вартість","ресурсоємний"],
    catalogTitle:"Повний каталог алгоритмів",
    catalogLede:"Усі алгоритми з конспекту курсу, згруповані за темами. Кожен елемент позначено рівнем складності; реалізовані інтерактивні демо мають посилання.",
    implemented:"демо",
    showing:"показано",
    of:"з",
    algorithms:"алгоритмів", topics:"тем",
    viewTopic:"За темами", viewAlpha:"А–Я",
    filterNote:"Фільтр каталогу — натисніть рівень або вартість, щоб увімкнути/вимкнути:"
  }
};

/* =========================================================================
   CX — asymptotic complexity per algorithm: [label, colourClass]
   colour: 1 = light computation (green), 2 = moderate (yellow),
           3 = resource-intensive (orange). n = operand/key size in bits,
   L[x] = sub-exponential L-notation, [q] = requires a quantum computer.
   ========================================================================= */
const CX = {
  // symmetric block + modes
  des:['O(n)',1], aes:['O(n)',1], blowfish:['O(n)',1], serpent:['O(n)',1],
  idea:['O(n)',1], gost:['O(n)',1], kuznyechik:['O(n)',1], kalyna:['O(n)',1], camellia:['O(n)',1],
  modes:['O(n)',1], gcm:['O(n)',1],
  // stream
  rc4:['O(n)',1], a5:['O(n)',1], chacha:['O(n)',1], snow2:['O(n)',1], strumok:['O(n)',1], trivium:['O(n)',1],
  // prng
  lcg:['O(1)',1], mt:['O(n)',1], bbs:['O(n²)',2], drbg:['O(n)',1], fortuna:['O(n)',1],
  // probabilistic encryption
  gm:['O(n³)',2], 'blum-goldwasser':['O(n³)',2],
  // hashes + MAC
  md5:['O(n)',1], sha1:['O(n)',1], sha2:['O(n)',1], sha3:['O(n)',1], blake:['O(n)',1], kupyna:['O(n)',1],
  hmac:['O(n)',1], descbcmac:['O(n)',1], cmac:['O(n)',1], poly1305:['O(n)',1],
  // asymmetric encryption
  rsa:['O(n³)',2], elgamal:['O(n³)',2], rabin:['O(n³)',2], ecc:['O(n³)',2],
  paillier:['O(n³)',2], kyber:['O(n log n)',1], ntru:['O(n log n)',1], mceliece:['O(n²)',2],
  // signatures
  dsa:['O(n³)',2], rsapss:['O(n³)',2], schnorr:['O(n³)',2], eddsa:['O(n³)',2], dstu4145:['O(n³)',2],
  dilithium:['O(n log n)',2], sphincs:['O(n)',2],
  // key exchange
  dh:['O(n³)',2], ecdh:['O(n³)',2], mqv:['O(n³)',2], sts:['O(n³)',2],
  // subscriber authentication
  'auth-rsa':['O(n³)',2], 'auth-ecc':['O(n³)',2], 'auth-fs':['O(k·n²)',2], 'auth-ffs':['O(k·n²)',2],
  // discrete log cryptanalysis
  shanks:['O(√n)',3], 'rho-dl':['O(√n)',3], kangaroo:['O(√w)',3],
  pohlig:['O(Σ√pᵢ)',2], index:['L[1/2]',3], 'nfs-dl':['L[1/3]',3],
  // factoring
  'fermat-f':['O(|p−q|)',2], 'rho-f':['O(n^¼)',3], p1:['O(B log B)',2],
  qs:['L[1/2]',3], gnfs:['L[1/3]',3], 'shor-f':['O(n³) [q]',3],
  // fields & residues
  tonelli:['O(log²p)',1], legendre:['O(log p)',1], cipolla:['O(log p)',1],
  // codes & recurrences
  'berlekamp-massey':['O(n²)',1], 'berlekamp-rs':['O(n²)',2],
  // primality
  'fermat-p':['O(k·log³n)',1], miller:['O(k·log³n)',1], solovay:['O(k·log³n)',1],
  aks:['O(log⁶n)',2],
  // lattices
  lll:['O(n⁵ log³B)',2], bkz:['2^O(β)',3], coppersmith:['poly(n)',2],
  // secret sharing & MPC
  shamir:['O(k²)',1], blakley:['O(k³)',1], mpc:['O(gates)',3],
  // ZKP
  ffs:['O(k·n²)',2], 'schnorr-zk':['O(n³)',2], snark:['O(C log C)',3],
  // quantum
  'shor-q':['O(n³) [q]',3], grover:['O(√N) [q]',3], bb84:['O(n)',1], e91:['O(n)',1],
  // homomorphic
  gentry:['poly(λ)',3], bgv:['Õ(λ)',3],
  // lightweight
  tea:['O(n)',1], xtea:['O(n)',1], xxtea:['O(n)',1], present:['O(n)',1],
  simon:['O(n)',1], clefia:['O(n)',1], prince:['O(n)',1], led:['O(n)',1],
  katan:['O(n)',1], gift:['O(n)',1], ascon:['O(n)',1], chaskey:['O(n)',1],
  // number-theoretic algorithms
  euclid:['O(log n)',1], lincong:['O(log m)',1], diophantine:['O(log n)',1],
  crt:['O(k log n)',1], gffield:['O(log p)',1], gfpoly:['O(k²)',1], ecgroup:['O(log n)',2],
  // key derivation & password hashing
  hkdf:['O(n)',1], pbkdf2:['O(c·n)',1], bcrypt:['O(2^c)',2], scrypt:['O(N·r)',2],
  argon2:['O(m·t)',2], balloon:['O(s·t)',2],
  // symmetric cryptanalysis
  differential:['2^k CP',3], linear:['2^k KP',3], mitm:['O(2ᵏ)',3], slide:['O(2^{n/2})',2],
  boomerang:['2^k',3], birthday:['O(2^{n/2})',2], tmto:['T·M²=N²',3], lenext:['O(1)',1],
  // implementation & physical attacks
  timing:['O(queries)',2], cache:['O(traces)',3], dpa:['O(traces)',3], fault:['O(1)',3],
  paddingoracle:['O(256·n)',2], roca:['poly(n)',3], ctmeasures:['—',1],
  // applied protocols
  tls13:['1-RTT',2], signal:['O(n)',2], noise:['O(1)',2], ipsec:['O(1)',2], wireguard:['O(1)',1],
  kerberos:['O(1)',2], pake:['O(n³)',2], fido2:['O(n³)',2], otp:['O(1)',1],
  // pairings
  pairing:['O(log p)',3], bls:['O(n³)',2], bls12381:['O(n³)',2], bfibe:['O(n³)',3], frost:['O(k)',2],
  // privacy & anonymity
  blindsig:['O(n³)',2], ringsig:['O(n)',3], onion:['O(n)',2], mixnet:['O(n)',2], pir:['O(√n)',3], anoncred:['O(n³)',3],
  // §II fill-outs: modes
  xts:['O(n)',1], gcmsiv:['O(n)',1], ocb:['O(n)',1], eax:['O(n)',1], kw:['O(n)',1], fpe:['O(n)',2], etmmte:['—',1],
  // national/other block + stream + hash
  magma:['O(n)',1], kasumi:['O(n)',1], sm4:['O(n)',1], aria:['O(n)',1], seed:['O(n)',1], lea:['O(n)',1],
  zuc:['O(n)',1], streebog:['O(n)',1], sm3:['O(n)',1],
  // prng testing
  niststs:['—',1], entropy:['—',1], dieharder:['—',1], pcg:['O(1)',1], hwrng:['—',1],
  // asymmetric + PQC
  sm2:['O(n³)',2], hqc:['O(n²)',2], frodokem:['O(n²)',2], hybrid:['O(n)',1], skelya:['O(n)',1], sike:['O(n)',1],
  // signatures + hash-based ladder
  vershyna:['O(n)',2], rainbow:['O(n²)',2], lamport:['O(n)',1], wots:['O(w·n)',1], merkle:['O(log n)',1], xmss:['O(log n)',2],
  // subscriber auth
  milenage:['O(n)',1], tuak:['O(n)',1],
  // MPC + commitments
  yao:['O(gates)',3], ot:['O(n)',2], beaver:['O(gates)',2], psi:['O(n)',2], pedersen:['O(n³)',2], vss:['O(k·n)',2],
  // field engineering
  montgomery:['O(n²)',1], barrett:['O(n²)',1], karatsuba:['O(n^1.58)',1], ntt:['O(n log n)',2],
  slidingwindow:['O(n³)',1], schoof:['O(log⁵q)',3]
};

/* =========================================================================
   HREFS — default page anchor per algorithm id (used when the catalogue
   entry has no explicit href). Anchor id === algorithm id.
   ========================================================================= */
const HREFS = (function(){
  const map={}, put=(page,ids)=>ids.forEach(id=>map[id]=page+'#'+id);
  put('symmetric.html',   ['des','aes','blowfish','serpent','idea','gost','camellia','modes','gcm']);
  put('stream.html',      ['rc4','a5','chacha','trivium','berlekamp-massey','berlekamp-rs']);
  put('hash.html',        ['md5','sha1','sha2','sha3','blake','hmac','cmac','poly1305']);
  put('signatures.html',  ['dsa','rsapss','schnorr','dilithium','sphincs']);
  put('keyexchange.html', ['dh','mqv','sts']);
  put('cryptanalysis.html',['shanks','rho-dl','kangaroo','pohlig','index','nfs-dl',
                            'fermat-f','rho-f','p1','qs','gnfs','shor-f']);
  put('numbertheory.html',['tonelli','legendre','cipolla','fermat-p','miller','solovay','aks']);
  put('advanced.html',    ['lll','bkz','coppersmith','shamir','blakley','mpc',
                           'ffs','schnorr-zk','snark','gentry','bgv']);
  put('quantum.html',     ['shor-q','grover','bb84','e91']);
  put('lightweight.html', ['tea','xtea','xxtea','present','simon','clefia','prince',
                           'led','katan','gift','ascon','chaskey']);
  put('prng.html',        ['lcg','mt','bbs','drbg','fortuna','gm','blum-goldwasser']);
  put('authprotocols.html',['auth-rsa','auth-ecc','auth-fs','auth-ffs']);
  put('standards.html',   ['kuznyechik','kalyna','snow2','strumok','kupyna','descbcmac','dstu4145']);
  put('arithmetic.html',  ['euclid','lincong','diophantine','crt','gffield','gfpoly','ecgroup']);
  put('kdf.html',         ['hkdf','pbkdf2','bcrypt','scrypt','argon2','balloon']);
  put('symcrypt.html',    ['differential','linear','mitm','slide','boomerang','birthday','tmto','lenext']);
  put('implattacks.html', ['timing','cache','dpa','fault','paddingoracle','roca','ctmeasures']);
  put('protocols.html',   ['tls13','signal','noise','ipsec','wireguard','kerberos','pake','fido2','otp']);
  put('pairings.html',    ['pairing','bls','bls12381','bfibe','frost']);
  put('privacy.html',     ['blindsig','ringsig','onion','mixnet','pir','anoncred']);
  put('fieldeng.html',    ['montgomery','barrett','karatsuba','ntt','slidingwindow','schoof']);
  put('hashsig.html',     ['lamport','wots','merkle','xmss']);
  put('prngtest.html',    ['niststs','entropy','dieharder','pcg','hwrng']);
  put('mpc.html',         ['yao','ot','beaver','psi','pedersen','vss']);
  put('modes.html',       ['xts','gcmsiv','ocb','eax','kw','fpe','etmmte']);
  put('cellular.html',    ['kasumi','zuc','milenage','tuak']);
  put('worldciphers.html',['magma','sm4','aria','seed','lea','sm2','streebog','sm3']);
  map.kyber='asymmetric.html#pqc'; map.ntru='asymmetric.html#pqc'; map.mceliece='asymmetric.html#pqc';
  return map;
})();

if(typeof window!=='undefined'){ window.CATALOG=CATALOG; window.I18N=I18N; window.CX=CX; window.HREFS=HREFS; }
