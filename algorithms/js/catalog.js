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
      {id:"des",   lvl:1, en:"DES / 3-DES", uk:"DES / 3-DES", alias:"Feistel",
        dEn:"Classic 56-bit Feistel cipher; 3-DES applies it three times for extra strength.",
        dUk:"Класичний 56-бітний шифр Фейстеля; 3-DES застосовує його тричі для посилення стійкості."},
      {id:"aes",   lvl:1, en:"AES (Rijndael)", uk:"AES (Rijndael)", alias:"Rijndael",
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
      {id:"gost",  lvl:2, en:"GOST 28147-89 / Kuznyechik", uk:"ГОСТ 28147-89 / «Кузнечик»", alias:"Кузнечик Kuznyechik",
        dEn:"Soviet/Russian standard — an example of a different crypto-design school.",
        dUk:"Радянський/російський стандарт, приклад іншої школи криптодизайну."},
      {id:"camellia", lvl:2, en:"Camellia", uk:"Camellia",
        dEn:"Japanese standard, comparable to AES.",
        dUk:"Японський стандарт, порівнюваний з AES."}
    ]
  },
  {
    id:2, en:"Stream ciphers", uk:"Потокові шифри",
    descEn:"Encrypt data as a keystream XORed with the plaintext.",
    descUk:"Шифрують дані як потік гами, що XOR-иться з відкритим текстом.",
    algos:[
      {id:"rc4", lvl:1, en:"RC4", uk:"RC4",
        dEn:"Simple, historically important (WEP, SSL); shows stream-cipher weaknesses.",
        dUk:"Простий, історично важливий (WEP, SSL), демонструє вразливості потокових шифрів."},
      {id:"a5", lvl:2, en:"A5/1, A5/2", uk:"A5/1, A5/2",
        dEn:"GSM ciphers, classic cryptanalysis targets.",
        dUk:"Шифри GSM, класичні об'єкти криптоаналізу."},
      {id:"chacha", lvl:1, en:"Salsa20 / ChaCha20", uk:"Salsa20 / ChaCha20",
        dEn:"Modern fast stream ciphers (TLS, Google).",
        dUk:"Сучасні швидкі потокові шифри (TLS, Google)."},
      {id:"trivium", lvl:3, en:"Grain, Trivium", uk:"Grain, Trivium",
        dEn:"Lightweight ciphers from the eSTREAM project.",
        dUk:"Легковагові шифри з проекту eSTREAM."}
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
      {id:"gcm", lvl:2, en:"GCM, CCM", uk:"GCM, CCM",
        dEn:"Authenticated encryption (AEAD).",
        dUk:"Автентифіковане шифрування (AEAD)."}
    ]
  },
  {
    id:4, en:"Cryptographic hash functions", uk:"Криптографічні хеш-функції",
    descEn:"One-way compression of arbitrary data into a fixed-size digest.",
    descUk:"Однобічне стиснення довільних даних у дайджест фіксованого розміру.",
    algos:[
      {id:"md5",  lvl:1, en:"MD5", uk:"MD5",
        dEn:"Obsolete; studied through its published collisions.",
        dUk:"Застарілий, вивчається через знайдені колізії."},
      {id:"sha1", lvl:1, en:"SHA-1", uk:"SHA-1", alias:"SHAttered",
        dEn:"Obsolete standard; example of a practical collision attack (SHAttered).",
        dUk:"Застарілий стандарт, приклад практичної атаки на колізії (SHAttered)."},
      {id:"sha2", lvl:1, en:"SHA-2 (SHA-256/512)", uk:"SHA-2 (SHA-256/512)",
        dEn:"The current standard.",
        dUk:"Поточний стандарт."},
      {id:"sha3", lvl:2, en:"SHA-3 (Keccak)", uk:"SHA-3 (Keccak)", alias:"Keccak sponge",
        dEn:"Based on the sponge construction.",
        dUk:"Заснований на губчастій конструкції (sponge construction)."},
      {id:"blake", lvl:2, en:"BLAKE2 / BLAKE3", uk:"BLAKE2 / BLAKE3",
        dEn:"Fast modern alternatives.",
        dUk:"Швидкі сучасні альтернативи."}
    ]
  },
  {
    id:5, en:"Message authentication codes (MAC)", uk:"Коди автентифікації повідомлень (MAC)",
    descEn:"Keyed tags that prove a message's integrity and origin.",
    descUk:"Ключові теги, що доводять цілісність і походження повідомлення.",
    algos:[
      {id:"hmac", lvl:1, en:"HMAC", uk:"HMAC",
        dEn:"Built on hash functions.",
        dUk:"На основі хеш-функцій."},
      {id:"cmac", lvl:2, en:"CMAC", uk:"CMAC",
        dEn:"Built on block ciphers.",
        dUk:"На основі блокових шифрів."},
      {id:"poly1305", lvl:2, en:"Poly1305", uk:"Poly1305",
        dEn:"Used together with ChaCha20.",
        dUk:"Використовується разом з ChaCha20."}
    ]
  },
  {
    id:6, en:"Asymmetric cryptography (encryption)", uk:"Асиметрична криптографія (шифрування)",
    descEn:"Public-key encryption: a public key locks, a private key unlocks.",
    descUk:"Шифрування з відкритим ключем: відкритий ключ шифрує, приватний — розшифровує.",
    algos:[
      {id:"rsa", lvl:1, en:"RSA", uk:"RSA", href:"asymmetric.html#rsa",
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
      {id:"kyber", lvl:3, en:"Kyber (ML-KEM)", uk:"Kyber (ML-KEM)", alias:"ML-KEM lattice решітки",
        dEn:"Post-quantum, based on lattice problems (module-LWE).",
        dUk:"Постквантова схема, на основі задач з решітками (module-LWE)."},
      {id:"ntru", lvl:3, en:"NTRU", uk:"NTRU",
        dEn:"One of the first lattice-based cryptosystems.",
        dUk:"Одна з перших решіткових криптосистем."},
      {id:"mceliece", lvl:3, en:"McEliece", uk:"McEliece",
        dEn:"Post-quantum, based on error-correcting codes.",
        dUk:"Постквантова схема, на основі кодів, що виправляють помилки."}
    ]
  },
  {
    id:7, en:"Digital signatures", uk:"Цифрові підписи",
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
      {id:"eddsa", lvl:2, en:"EdDSA (Ed25519)", uk:"EdDSA (Ed25519)", href:"signatures.html#eddsa", alias:"Edwards",
        dEn:"Deterministic signature based on Edwards curves.",
        dUk:"Детермінований підпис на основі кривих Едвардса."},
      {id:"dilithium", lvl:3, en:"Dilithium, Falcon", uk:"Dilithium, Falcon",
        dEn:"Post-quantum lattice signatures (NIST PQC).",
        dUk:"Постквантові підписи на решітках (NIST PQC)."},
      {id:"sphincs", lvl:3, en:"SPHINCS+", uk:"SPHINCS+",
        dEn:"Stateless hash-based signature.",
        dUk:"Підпис на основі хеш-функцій (stateless)."}
    ]
  },
  {
    id:8, en:"Key-agreement protocols", uk:"Протоколи узгодження ключів",
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
    id:9, en:"Discrete-log algorithms (cryptanalysis)", uk:"Алгоритми розв'язання дискретного логарифму",
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
    id:10, en:"Factorisation algorithms (RSA cryptanalysis)", uk:"Алгоритми факторизації (криптоаналіз RSA)",
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
    id:11, en:"Fields and quadratic residues", uk:"Робота з полями та квадратичними лишками",
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
    id:12, en:"Codes & linear recurrences", uk:"Коди та лінійні рекуренти",
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
    id:13, en:"Primality tests", uk:"Тести на простоту",
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
    id:14, en:"Lattice cryptography & cryptanalysis", uk:"Решіткова криптографія та криптоаналіз",
    descEn:"Lattice reduction, foundational for PQC and its attacks.",
    descUk:"Редукція решіток — основа постквантової криптографії та атак на неї.",
    algos:[
    /*
	  {id:"lll", lvl:3, en:"LLL (Lenstra–Lenstra–Lovász)", uk:"Алгоритм LLL (Ленстра–Ленстра–Ловаса)",
        dEn:"Lattice basis reduction, used in attacks and cryptosystems.",
        dUk:"Редукція базису решітки, використовується в атаках і криптосистемах."},
      {id:"bkz", lvl:3, en:"BKZ", uk:"BKZ-алгоритм",
        dEn:"Improved basis reduction for estimating lattice-scheme strength.",
        dUk:"Покращена редукція базису для оцінки стійкості решіткових схем."},
      {id:"coppersmith", lvl:3, en:"Coppersmith's attack", uk:"Атака Копперсміта",
        dEn:"Small roots of polynomial equations; attacks on low-exponent RSA.",
        dUk:"Знаходження малих коренів поліноміальних рівнянь, атаки на RSA з малими показниками."}
	*/
    ]
  },
  {
    id:15, en:"Secret sharing & MPC", uk:"Розділення секрету та багатосторонні обчислення",
    descEn:"Split a secret among parties; compute jointly without revealing inputs.",
    descUk:"Розділяють секрет між сторонами; обчислюють спільно, не розкриваючи входів.",
	algos:[
    /*
      {id:"shamir", lvl:2, en:"Shamir's Secret Sharing", uk:"Схема Шаміра",
        dEn:"Threshold scheme via polynomial interpolation.",
        dUk:"Порогова схема на поліноміальній інтерполяції."},
      {id:"blakley", lvl:2, en:"Blakley's scheme", uk:"Схема Блеклі",
        dEn:"A geometric approach to secret sharing.",
        dUk:"Геометричний підхід до розділення секрету."},
      {id:"mpc", lvl:3, en:"Secure MPC", uk:"Багатосторонні обчислення (MPC)", alias:"Yao GMW garbled",
        dEn:"Yao's Garbled Circuits, the GMW protocol.",
        dUk:"Yao's Garbled Circuits, GMW-протокол."}
	*/
    ]
  },
  {
    id:16, en:"Zero-knowledge proofs (ZKP)", uk:"Криптографія з нульовим розголошенням (ZKP)",
    descEn:"Prove a statement is true while revealing nothing else.",
    descUk:"Доводять істинність твердження, не розкриваючи нічого іншого.",
    algos:[
	/*
      {id:"ffs", lvl:2, en:"Feige–Fiat–Shamir", uk:"Протокол Фейге–Фіата–Шаміра",
        dEn:"An interactive ZKP.",
        dUk:"Інтерактивний ZKP."},
      {id:"schnorr-zk", lvl:2, en:"Schnorr protocol (ZKP)", uk:"Протокол Шнорра (ZKP-версія)",
        dEn:"Proof of knowledge of a discrete logarithm.",
        dUk:"Доведення знання дискретного логарифму."},
      {id:"snark", lvl:3, en:"zk-SNARKs, zk-STARKs", uk:"zk-SNARKs, zk-STARKs",
        dEn:"Modern non-interactive systems, important for blockchain courses.",
        dUk:"Сучасні неінтерактивні системи, важливі для блокчейн-курсів."}
	*/
    ]
  },
  {
    id:17, en:"Quantum algorithms", uk:"Квантові алгоритми",
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
    id:18, en:"Homomorphic encryption", uk:"Гомоморфне шифрування",
    descEn:"Compute directly on ciphertexts without decrypting.",
    descUk:"Обчислення безпосередньо над шифротекстами без розшифрування.",
	algos:[
    /*
      {id:"gentry", lvl:3, en:"Gentry's scheme", uk:"Схема Гентрі (Gentry)",
        dEn:"The first fully homomorphic (FHE) scheme, lattice-based.",
        dUk:"Перша повністю гомоморфна схема (FHE) на решітках."},
      {id:"bgv", lvl:3, en:"BGV, BFV, CKKS", uk:"BGV, BFV, CKKS",
        dEn:"Modern practical FHE schemes.",
        dUk:"Сучасні практичні FHE-схеми."}
	*/
    ]
  },
  {
    id:19, en:"Lightweight ciphers", uk:"Легковагові (lightweight) шифри",
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
    of:"of"
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
    of:"з"
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
  idea:['O(n)',1], gost:['O(n)',1], camellia:['O(n)',1],
  modes:['O(n)',1], gcm:['O(n)',1],
  // stream
  rc4:['O(n)',1], a5:['O(n)',1], chacha:['O(n)',1], trivium:['O(n)',1],
  // hashes + MAC
  md5:['O(n)',1], sha1:['O(n)',1], sha2:['O(n)',1], sha3:['O(n)',1], blake:['O(n)',1],
  hmac:['O(n)',1], cmac:['O(n)',1], poly1305:['O(n)',1],
  // asymmetric encryption
  rsa:['O(n³)',2], elgamal:['O(n³)',2], rabin:['O(n³)',2], ecc:['O(n³)',2],
  paillier:['O(n³)',2], kyber:['O(n log n)',1], ntru:['O(n log n)',1], mceliece:['O(n²)',2],
  // signatures
  dsa:['O(n³)',2], rsapss:['O(n³)',2], schnorr:['O(n³)',2], eddsa:['O(n³)',2],
  dilithium:['O(n log n)',2], sphincs:['O(n)',2],
  // key exchange
  dh:['O(n³)',2], ecdh:['O(n³)',2], mqv:['O(n³)',2], sts:['O(n³)',2],
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
  //////lll:['O(n⁵ log³B)',2], bkz:['2^O(β)',3], coppersmith:['poly(n)',2],
  // secret sharing & MPC
  //////shamir:['O(k²)',1], blakley:['O(k³)',1], mpc:['O(gates)',3],
  // ZKP
  //////ffs:['O(k·n²)',2], 'schnorr-zk':['O(n³)',2], snark:['O(C log C)',3],
  // quantum
  'shor-q':['O(n³) [q]',3], grover:['O(√N) [q]',3], bb84:['O(n)',1], e91:['O(n)',1],
  // homomorphic
  //////gentry:['poly(λ)',3], bgv:['Õ(λ)',3],
  // lightweight
  tea:['O(n)',1], xtea:['O(n)',1], xxtea:['O(n)',1], present:['O(n)',1],
  simon:['O(n)',1], clefia:['O(n)',1], prince:['O(n)',1], led:['O(n)',1],
  katan:['O(n)',1], gift:['O(n)',1], ascon:['O(n)',1], chaskey:['O(n)',1]
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
  put('advanced.html',    [/*'lll','bkz','coppersmith','shamir','blakley','mpc',
                           'ffs','schnorr-zk','snark','gentry','bgv'*/]);
  put('quantum.html',     ['shor-q','grover','bb84','e91']);
  put('lightweight.html', ['tea','xtea','xxtea','present','simon','clefia','prince',
                           'led','katan','gift','ascon','chaskey']);
  map.kyber='asymmetric.html#pqc'; map.ntru='asymmetric.html#pqc'; map.mceliece='asymmetric.html#pqc';
  return map;
})();

if(typeof window!=='undefined'){ window.CATALOG=CATALOG; window.I18N=I18N; window.CX=CX; window.HREFS=HREFS; }
