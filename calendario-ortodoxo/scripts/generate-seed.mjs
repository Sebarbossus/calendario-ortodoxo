/**
 * Generate seed JSON for civil year 2026 (BOR / New Calendar + Orthodox Pascha).
 * Titles are curated commemorations (public feast identity), not scraped Patriarhia prose.
 *
 * Usage: node scripts/generate-seed.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../src/data/seed/days-2026.json");
const REPORT = join(__dirname, "../src/data/seed/coverage-2026.json");

const PASCHA = "2026-04-12";
const YEAR = 2026;

/** @typedef {{ es: string, pt: string, en: string }} L */
/** @typedef {'red'|'blue'|'black'|'sunday'} Rank */
/** @typedef {'none'|'fast'|'dairy'|'fish'|'wine_oil'|'strict'} Fast */

/**
 * Fixed menaion: [day, en, es, pt, rank?, opts?]
 * opts: { civil?: boolean, ro?: boolean, major?: boolean, fasting?: Fast }
 */
const MENAION = {
  1: [
    [1, "Circumcision of the Lord; St Basil the Great", "Circuncisión del Señor; San Basilio Magno", "Circuncisão do Senhor; São Basílio Magno", "red", { major: true }],
    [2, "St Sylvester, Pope of Rome; St Seraphim of Sarov (repose)", "San Silvestre, papa de Roma; San Serafín de Sarov (tránsito)", "São Silvestre, papa de Roma; São Serafim de Sarov (trânsito)", "blue", { major: true }],
    [3, "Prophet Malachi; Martyr Gordius", "Profeta Malaquías; Mártir Gordio", "Profeta Malaquias; Mártir Górdio", "black"],
    [4, "Synaxis of the Seventy Apostles; St Theoctistus", "Sinaxis de los Setenta Apóstoles; San Teoctisto", "Sinaxe dos Setenta Apóstolos; São Teoctisto", "blue"],
    [5, "Hieromartyrs Theopemptus and Theonas; St Syncletica", "Hieromártires Teopempto y Teonas; Santa Sincletica", "Hieromártires Teopempto e Teonas; Santa Sincletica", "black"],
    [6, "Holy Theophany — Baptism of the Lord", "Santa Teofanía — Bautismo del Señor", "Santa Teofania — Batismo do Senhor", "red", { major: true }],
    [7, "Synaxis of St John the Baptist", "Sinaxis de San Juan Bautista", "Sinaxe de São João Batista", "blue", { major: true }],
    [8, "St George the Chozebite; St Domnica of Constantinople", "San Jorge el Cozebita; Santa Domnica de Constantinopla", "São Jorge, o Cozebita; Santa Domnica de Constantinopla", "black"],
    [9, "Martyr Polyeuctus of Melitene; St Philip, Metropolitan of Moscow", "Mártir Polieucto de Melitene; San Felipe, metropolita de Moscú", "Mártir Polieucto de Melitene; São Filipe, metropolita de Moscovo", "black"],
    [10, "St Gregory of Nyssa; St Dometian of Melitene", "San Gregorio de Nisa; San Dometiano de Melitene", "São Gregório de Nissa; São Dometiano de Melitene", "blue"],
    [11, "St Theodosius the Great, Cenobiarch", "San Teodosio el Grande, cenobiarca", "São Teodósio o Grande, cenobiarca", "blue"],
    [12, "Martyr Tatiana of Rome; St Sava, Archbishop of Serbia", "Mártir Tatiana de Roma; San Sava, arzobispo de Serbia", "Mártir Tatiana de Roma; São Sava, arcebispo da Sérvia", "blue"],
    [13, "Martyrs Hermylus and Stratonicus; St Hilary of Poitiers", "Mártires Hermilo y Estratónico; San Hilario de Poitiers", "Mártires Hermilo e Estratónico; Santo Hilário de Poitiers", "black"],
    [14, "St Nina, Equal-to-the-Apostles, Enlightener of Georgia", "Santa Nina, igual a los apóstoles, iluminadora de Georgia", "Santa Nina, igual aos apóstolos, iluminadora da Geórgia", "blue", { major: true }],
    [15, "St Paul of Thebes; St John the Hut-Dweller", "San Pablo de Tebas; San Juan el Calíbita", "São Paulo de Tebas; São João Calibita", "black"],
    [16, "Veneration of the Precious Chains of St Peter", "Veneración de las preciosas cadenas de San Pedro", "Veneração das preciosas cadeias de São Pedro", "blue"],
    [17, "St Anthony the Great", "San Antonio el Grande", "Santo António o Grande", "red", { major: true }],
    [18, "Sts Athanasius and Cyril of Alexandria", "Santos Atanasio y Cirilo de Alejandría", "Santos Atanásio e Cirilo de Alexandria", "blue", { major: true }],
    [19, "St Macarius the Great of Egypt; St Mark of Ephesus", "San Macario el Grande de Egipto; San Marcos de Éfeso", "São Macário o Grande do Egito; São Marcos de Éfeso", "blue"],
    [20, "St Euthymius the Great", "San Eutimio el Grande", "São Eutímio o Grande", "blue", { major: true }],
    [21, "St Maximus the Confessor; Martyr Neophytus", "San Máximo el Confesor; Mártir Neófito", "São Máximo o Confessor; Mártir Neófito", "blue"],
    [22, "Apostle Timothy; Martyr Anastasius the Persian", "Apóstol Timoteo; Mártir Anastasio el Persa", "Apóstolo Timóteo; Mártir Anastásio, o Persa", "blue"],
    [23, "Hieromartyr Clement of Ancyra; Martyr Agathangelus", "Hieromártir Clemente de Ancira; Mártir Agatángelo", "Hieromártir Clemente de Ancira; Mártir Agatângelo", "black"],
    [24, "St Xenia of Rome; Blessed Xenia of St Petersburg", "Santa Xenia de Roma; Beata Xenia de San Petersburgo", "Santa Xénia de Roma; Beata Xénia de São Petersburgo", "blue", { major: true }],
    [25, "St Gregory the Theologian, Archbishop of Constantinople", "San Gregorio el Teólogo, arzobispo de Constantinopla", "São Gregório o Teólogo, arcebispo de Constantinopla", "red", { major: true }],
    [26, "St Xenophon and his companions; Translation of St Theodore the Studite", "San Xenofonte y sus compañeros; Traslación de San Teodoro Estudita", "São Xenofonte e seus companheiros; Translação de São Teodoro Estudita", "black"],
    [27, "Translation of the relics of St John Chrysostom", "Traslación de las reliquias de San Juan Crisóstomo", "Translação das relíquias de São João Crisóstomo", "blue", { major: true }],
    [28, "St Ephrem the Syrian; St Isaac the Syrian", "San Efrén el Sirio; San Isaac el Sirio", "São Efrém, o Sírio; São Isaac, o Sírio", "blue", { major: true }],
    [29, "Translation of the relics of Hieromartyr Ignatius the God-Bearer", "Traslación de las reliquias del hieromártir Ignacio el Portador de Dios", "Translação das relíquias do hieromártir Inácio, o Portador de Deus", "blue"],
    [30, "The Three Hierarchs: Basil, Gregory, and John Chrysostom", "Los Tres Jerarcas: Basilio, Gregorio y Juan Crisóstomo", "Os Três Hierarcas: Basílio, Gregório e João Crisóstomo", "red", { major: true }],
    [31, "Unmercenaries Cyrus and John; St Nicetas of the Kiev Caves", "Anárgiros Ciro y Juan; San Nicetas de las Cuevas de Kiev", "Anárgiros Ciro e João; São Nicetas das Grutas de Kiev", "black"],
  ],
  2: [
    [1, "Martyr Tryphon; St Brigid of Kildare", "Mártir Trifón; Santa Brígida de Kildare", "Mártir Trifão; Santa Brígida de Kildare", "black"],
    [2, "Meeting (Presentation) of the Lord", "Encuentro (Presentación) del Señor", "Encontro (Apresentação) do Senhor", "red", { major: true }],
    [3, "Sts Simeon the God-Receiver and Anna the Prophetess", "Santos Simeón el Teodoco y Ana la Profetisa", "Santos Simeão o Teodoco e Ana a Profetisa", "blue"],
    [4, "St Isidore of Pelusium; St Nicholas the Confessor of Studion", "San Isidoro de Pelusio; San Nicolás Confesor de Studion", "Santo Isidoro de Pelúsio; São Nicolau Confessor de Studion", "black"],
    [5, "Martyr Agatha of Palermo", "Mártir Ágata de Palermo", "Mártir Ágata de Palermo", "blue"],
    [6, "St Bucolus of Smyrna; St Photius the Great", "San Búcolo de Esmirna; San Focio el Grande", "São Búcolo de Esmirna; São Fócio o Grande", "blue"],
    [7, "St Parthenius of Lampsacus; St Luke of Mount Steirion", "San Partenio de Lámpsaco; San Lucas del monte Steirion", "São Parténio de Lâmpsaco; São Lucas do monte Steirion", "black"],
    [8, "Great Martyr Theodore Stratelates; Prophet Zechariah", "Gran Mártir Teodoro Estratilates; Profeta Zacarías", "Grande Mártir Teodoro Estratilates; Profeta Zacarias", "blue"],
    [9, "Martyr Nicephorus of Antioch; Translation of St Innocent of Irkutsk", "Mártir Nicéforo de Antioquía; Traslación de San Inocencio de Irkutsk", "Mártir Nicéforo de Antioquia; Translação de São Inocêncio de Irkutsk", "black"],
    [10, "Hieromartyr Charalambos of Magnesia", "Hieromártir Caralampo de Magnesia", "Hieromártir Caralampo de Magnésia", "blue", { major: true }],
    [11, "Hieromartyr Blaise of Sebaste; St Theodora the Empress", "Hieromártir Blas de Sebaste; Santa Teodora la Emperatriz", "Hieromártir Brás de Sebaste; Santa Teodora a Imperatriz", "blue"],
    [12, "St Meletius of Antioch; St Alexis, Metropolitan of Moscow", "San Melecio de Antioquía; San Alexis, metropolita de Moscú", "São Melécio de Antioquia; Santo Alexis, metropolita de Moscovo", "black"],
    [13, "St Martinian; Apostles Aquila and Priscilla", "San Martiniano; Apóstoles Aquila y Priscila", "São Martiniano; Apóstolos Áquila e Priscila", "black"],
    [14, "St Cyril, Equal-to-the-Apostles, Teacher of the Slavs", "San Cirilo, igual a los apóstoles, maestro de los eslavos", "São Cirilo, igual aos apóstolos, mestre dos eslavos", "blue", { major: true }],
    [15, "Apostle Onesimus of the Seventy", "Apóstol Onésimo de los Setenta", "Apóstolo Onésimo dos Setenta", "black"],
    [16, "Martyrs Pamphilus and companions; St Flavian", "Mártires Pánfilo y compañeros; San Flaviano", "Mártires Pânfilo e companheiros; São Flaviano", "black"],
    [17, "Great Martyr Theodore the Tyro", "Gran Mártir Teodoro el Recluta (Tiro)", "Grande Mártir Teodoro, o Recruta (Tiro)", "blue", { major: true }],
    [18, "St Leo the Great, Pope of Rome", "San León Magno, papa de Roma", "São Leão Magno, papa de Roma", "blue"],
    [19, "Apostles Archippus, Philemon and Apphia", "Apóstoles Arquipo, Filemón y Afia", "Apóstolos Arquipo, Filémon e Áfia", "black"],
    [20, "St Leo, Bishop of Catania; St Agatho of Egypt", "San León, obispo de Catania; San Agatón de Egipto", "São Leão, bispo de Catânia; Santo Agatão do Egito", "black"],
    [21, "St Timothy of Symbola; St Eustathius of Antioch", "San Timoteo de Symbola; San Eustacio de Antioquía", "São Timóteo de Symbola; Santo Eustácio de Antioquia", "black"],
    [22, "Finding of the relics of the Martyrs at the Gate of Eugenius", "Hallazgo de las reliquias de los mártires en la Puerta de Eugenio", "Achado das relíquias dos mártires junto à Porta de Eugénio", "black"],
    [23, "Hieromartyr Polycarp of Smyrna", "Hieromártir Policarpo de Esmirna", "Hieromártir Policarpo de Esmirna", "blue", { major: true }],
    [24, "First and Second Finding of the Head of St John the Baptist", "Primer y segundo hallazgo de la cabeza de San Juan Bautista", "Primeiro e segundo achado da cabeça de São João Batista", "blue", { major: true }],
    [25, "St Tarasius of Constantinople", "San Tarasio de Constantinopla", "São Tarásio de Constantinopla", "black"],
    [26, "St Porphyrius of Gaza; St Photini the Samaritan Woman", "San Porfirio de Gaza; Santa Fotina la Samaritana", "São Porfírio de Gaza; Santa Fotina, a Samaritana", "blue"],
    [27, "St Procopius the Confessor of Decapolis", "San Procopio Confesor de Decápolis", "São Procópio Confessor de Decápolis", "black"],
    [28, "St Basil the Confessor; St John Cassian (non-leap)", "San Basilio Confesor; San Juan Casiano", "São Basílio Confessor; São João Cassiano", "black"],
  ],
  3: [
    [1, "St Eudocia the Samaritan; Martyr Antonina", "Santa Eudocia la Samaritana; Mártir Antonina", "Santa Eudócia, a Samaritana; Mártir Antonina", "black"],
    [2, "Hieromartyr Theodotus of Cyrenia; Martyr Hesychius", "Hieromártir Teódoto de Cirene; Mártir Hesiquio", "Hieromártir Teódoto de Cirene; Mártir Hesíquio", "black"],
    [3, "Martyrs Eutropius, Cleonicus and Basiliscus", "Mártires Eutropio, Cleónico y Basilisco", "Mártires Eutrópio, Cleónico e Basiliscos", "black"],
    [4, "St Gerasimus of the Jordan", "San Gerásimo del Jordán", "São Gerásimo do Jordão", "blue", { major: true }],
    [5, "Martyr Conon of Isauria; St Mark the Ascetic", "Mártir Conón de Isauria; San Marcos el Asceta", "Mártir Conão de Isaúria; São Marcos, o Asceta", "black"],
    [6, "The Forty-Two Martyrs of Amorium", "Los cuarenta y dos mártires de Amorio", "Os quarenta e dois mártires de Amório", "black"],
    [7, "The Holy Hieromartyrs of Cherson; St Paul the Simple", "Los santos hieromártires de Quersoneso; San Pablo el Simple", "Os santos hieromártires de Quersoneso; São Paulo, o Simples", "black"],
    [8, "St Theophylact of Nicomedia; Apostle Hermas", "San Teofilacto de Nicomedia; Apóstol Hermas", "São Teofilacto de Nicomédia; Apóstolo Hermas", "black"],
    [9, "The Forty Martyrs of Sebaste", "Los Cuarenta Mártires de Sebaste", "Os Quarenta Mártires de Sebaste", "red", { major: true }],
    [10, "Martyrs Codratus and companions of Corinth", "Mártires Codrato y compañeros de Corinto", "Mártires Codrato e companheiros de Corinto", "black"],
    [11, "St Sophronius, Patriarch of Jerusalem", "San Sofronio, patriarca de Jerusalén", "São Sofrónio, patriarca de Jerusalém", "blue"],
    [12, "St Gregory the Dialogist (the Great), Pope of Rome", "San Gregorio Diálogo (el Grande), papa de Roma", "São Gregório Diálogo (o Grande), papa de Roma", "blue"],
    [13, "Translation of the relics of St Nicephorus of Constantinople", "Traslación de las reliquias de San Nicéforo de Constantinopla", "Translação das relíquias de São Nicéforo de Constantinopla", "black"],
    [14, "St Benedict of Nursia", "San Benito de Nursia", "São Bento de Núrsia", "blue", { major: true }],
    [15, "Martyrs Agapius and companions; Apostle Aristobulus", "Mártires Agapio y compañeros; Apóstol Aristóbulo", "Mártires Agápio e companheiros; Apóstolo Aristóbulo", "black"],
    [16, "Martyr Sabinas of Egypt; St Christodoulos of Patmos", "Mártir Sabino de Egipto; San Cristódulo de Patmos", "Mártir Sabino do Egito; São Cristódulo de Patmos", "black"],
    [17, "St Alexis, Man of God; St Patrick, Enlightener of Ireland", "San Alexis, hombre de Dios; San Patricio, iluminador de Irlanda", "Santo Alexis, homem de Deus; São Patrício, iluminador da Irlanda", "blue"],
    [18, "St Cyril of Jerusalem", "San Cirilo de Jerusalén", "São Cirilo de Jerusalém", "blue", { major: true }],
    [19, "Martyrs Chrysanthus and Daria", "Mártires Crisanto y Daria", "Mártires Crisanto e Dária", "black"],
    [20, "The Holy Fathers slain at the Monastery of St Sabbas", "Los santos padres martirizados en el monasterio de San Sabas", "Os santos padres martirizados no mosteiro de São Sabas", "black"],
    [21, "St James the Confessor; St Thomas of Constantinople", "San Jacobo Confesor; San Tomás de Constantinopla", "São Tiago Confessor; São Tomás de Constantinopla", "black"],
    [22, "Hieromartyr Basil of Ancyra; Martyr Drosis", "Hieromártir Basilio de Ancira; Mártir Drósida", "Hieromártir Basílio de Ancira; Mártir Drósida", "black"],
    [23, "Martyr Nikon and his 199 disciples", "Mártir Nicón y sus 199 discípulos", "Mártir Nicão e seus 199 discípulos", "black"],
    [24, "Forefeast of the Annunciation; St Artemon of Seleucia", "Prefiesta de la Anunciación; San Artemón de Seleucia", "Prefesta da Anunciação; Santo Artemão de Selêucia", "blue"],
    [25, "Annunciation of the Most Holy Theotokos", "Anunciación de la Santísima Theotokos", "Anunciação da Santíssima Theotokos", "red", { major: true }],
    [26, "Synaxis of the Archangel Gabriel", "Sinaxis del Arcángel Gabriel", "Sinaxe do Arcanjo Gabriel", "blue"],
    [27, "Martyr Matrona of Thessalonica", "Mártir Matrona de Tesalónica", "Mártir Matrona de Tessalónica", "black"],
    [28, "St Hilarion the New; St Stephen the Wonderworker", "San Hilarión el Nuevo; San Esteban Taumaturgo", "Santo Hilarião, o Novo; Santo Estêvão Taumaturgo", "black"],
    [29, "Martyrs Mark, Cyril and others of Egypt; St Jonah of Egypt", "Mártires Marcos, Cirilo y otros de Egipto; San Jonás de Egipto", "Mártires Marcos, Cirilo e outros do Egito; São Jonas do Egito", "black"],
    [30, "St John Climacus of Sinai", "San Juan Clímaco del Sinaí", "São João Clímaco do Sinai", "blue", { major: true }],
    [31, "St Hypatius the Wonderworker of Gangra", "San Hipacio Taumaturgo de Gangra", "Santo Hipácio Taumaturgo de Gangra", "black"],
  ],
  4: [
    [1, "St Mary of Egypt; St Euthymius of Suzdal", "Santa María de Egipto; San Eutimio de Súzdal", "Santa Maria do Egito; São Eutímio de Súzdal", "blue", { major: true }],
    [2, "St Titus the Wonderworker; Martyrs Amphianus and Aedesius", "San Tito Taumaturgo; Mártires Anfiano y Edesio", "São Tito Taumaturgo; Mártires Anfiano e Edésio", "black"],
    [3, "St Nicetas the Confessor of Medikion", "San Nicetas Confesor de Medikion", "São Nicetas Confessor de Medikion", "black"],
    [4, "St Joseph the Hymnographer; St George of Mt Maleon", "San José el Himnógrafo; San Jorge del monte Maleón", "São José, o Hinógrafo; São Jorge do monte Maleão", "blue"],
    [5, "Martyrs Claudius and companions; St Theodora of Thessalonica", "Mártires Claudio y compañeros; Santa Teodora de Tesalónica", "Mártires Cláudio e companheiros; Santa Teodora de Tessalónica", "black"],
    [6, "St Eutychius, Patriarch of Constantinople", "San Eutiquio, patriarca de Constantinopla", "São Eutíquio, patriarca de Constantinopla", "black"],
    [7, "St George of Mytilene; Martyr Calliopius", "San Jorge de Mitilene; Mártir Calíopio", "São Jorge de Mitilene; Mártir Calíopio", "black"],
    [8, "Apostles Herodion, Agabus and companions of the Seventy", "Apóstoles Herodión, Ágabo y compañeros de los Setenta", "Apóstolos Herodião, Ágabo e companheiros dos Setenta", "black"],
    [9, "Martyr Eupsychius of Caesarea", "Mártir Eupsiquio de Cesarea", "Mártir Eupsíquio de Cesareia", "black"],
    [10, "Martyrs Terence and companions of Carthage", "Mártires Terencio y compañeros de Cartago", "Mártires Terêncio e companheiros de Cartago", "black"],
    [11, "Hieromartyr Antipas of Pergamum; St Callinicus of Cernica (BOR)", "Hieromártir Antipas de Pérgamo; San Calínico de Cernica (BOR)", "Hieromártir Antipas de Pérgamo; São Calínico de Cernica (BOR)", "blue", { major: true, ro: true }],
    [12, "St Basil the Confessor of Parium; St Isaac the Syrian (alt.)", "San Basilio Confesor de Parium; San Isaac el Sirio", "São Basílio Confessor de Pário; São Isaac, o Sírio", "black"],
    [13, "Hieromartyr Artemon of Laodicea", "Hieromártir Artemón de Laodicea", "Hieromártir Artemão de Laodiceia", "black"],
    [14, "St Martin the Confessor, Pope of Rome", "San Martín Confesor, papa de Roma", "São Martinho Confessor, papa de Roma", "blue"],
    [15, "Apostles Aristarchus, Pudens and Trophimus", "Apóstoles Aristarco, Pudente y Trófimo", "Apóstolos Aristarco, Pudente e Trófimo", "black"],
    [16, "Martyrs Agape, Irene and Chionia", "Mártires Ágape, Irene y Quionía", "Mártires Ágape, Irene e Quiónia", "black"],
    [17, "Hieromartyr Simeon of Persia; St Acacius of Melitene", "Hieromártir Simeón de Persia; San Acacio de Melitene", "Hieromártir Simeão da Pérsia; Santo Acácio de Melitene", "black"],
    [18, "St John, disciple of St Gregory of Decapolis", "San Juan, discípulo de San Gregorio de Decápolis", "São João, discípulo de São Gregório de Decápolis", "black"],
    [19, "St John of the Ancient Caves; St Paphnutius of Jerusalem", "San Juan de las Cuevas Antiguas; San Pafnucio de Jerusalén", "São João das Grutas Antigas; São Pafnúncio de Jerusalém", "black"],
    [20, "St Theodore Trichinas; St Anastasius of Sinai", "San Teodoro Trichinas; San Anastasio del Sinaí", "São Teodoro Trichinas; Santo Anastásio do Sinai", "black"],
    [21, "Hieromartyr Januarius and companions; St Maximus", "Hieromártir Januario y compañeros; San Máximo", "Hieromártir Januário e companheiros; São Máximo", "black"],
    [22, "St Theodore the Sykeote; Apostle Nathaniel", "San Teodoro el Siceota; Apóstol Natanael", "São Teodoro, o Siceota; Apóstolo Natanael", "blue"],
    [23, "Great Martyr George the Trophy-Bearer", "Gran Mártir Jorge el Portador de la Victoria", "Grande Mártir Jorge, o Vitorioso", "red", { major: true }],
    [24, "Martyr Sabbas Stratelates; St Elizabeth the Wonderworker", "Mártir Sabas Estratilates; Santa Isabel Taumaturga", "Mártir Sabas Estratilates; Santa Isabel Taumaturga", "black"],
    [25, "Holy Apostle and Evangelist Mark", "Santo Apóstol y Evangelista Marcos", "Santo Apóstolo e Evangelista Marcos", "red", { major: true }],
    [26, "Hieromartyr Basil of Amasea; St Stephen of Perm", "Hieromártir Basilio de Amasea; San Esteban de Perm", "Hieromártir Basílio de Amaseia; Santo Estêvão de Perm", "black"],
    [27, "Hieromartyr Simeon, kinsman of the Lord", "Hieromártir Simeón, pariente del Señor", "Hieromártir Simeão, parente do Senhor", "blue"],
    [28, "Apostles Jason and Sosipater; Martyrs Maximus and companions", "Apóstoles Jasón y Sosípater; Mártires Máximo y compañeros", "Apóstolos Jasão e Sosípater; Mártires Máximo e companheiros", "black"],
    [29, "The Nine Martyrs of Cyzicus; St Memnon the Wonderworker", "Los nueve mártires de Cícico; San Memnón Taumaturgo", "Os nove mártires de Cízico; São Memnão Taumaturgo", "black"],
    [30, "Holy Apostle James, son of Zebedee", "Santo Apóstol Santiago, hijo de Zebedeo", "Santo Apóstolo Tiago, filho de Zebedeu", "blue", { major: true }],
  ],
  5: [
    [1, "Prophet Jeremiah; St Tamara of Georgia", "Profeta Jeremías; Santa Tamara de Georgia", "Profeta Jeremias; Santa Tamara da Geórgia", "black"],
    [2, "Translation of the relics of St Athanasius the Great", "Traslación de las reliquias de San Atanasio el Grande", "Translação das relíquias de Santo Atanásio o Grande", "blue"],
    [3, "Martyrs Timothy and Maura; St Theodosius of the Kiev Caves", "Mártires Timoteo y Maura; San Teodosio de las Cuevas de Kiev", "Mártires Timóteo e Maura; São Teodósio das Grutas de Kiev", "blue"],
    [4, "Martyr Pelagia of Tarsus; St Hilary the Wonderworker", "Mártir Pelagia de Tarso; San Hilario Taumaturgo", "Mártir Pelágia de Tarso; Santo Hilário Taumaturgo", "black"],
    [5, "Great Martyr Irene of Thessalonica", "Gran Mártir Irene de Tesalónica", "Grande Mártir Irene de Tessalónica", "blue"],
    [6, "Righteous Job the Much-Suffering", "Justo Job el Mucho-sufriente", "Justo Job, o Muito Sofredor", "blue"],
    [7, "Appearance of the Sign of the Cross over Jerusalem; St Nilus of Sora", "Aparición de la señal de la Cruz sobre Jerusalén; San Nilo de Sora", "Aparição do sinal da Cruz sobre Jerusalém; São Nilo de Sora", "blue"],
    [8, "Holy Apostle and Evangelist John the Theologian", "Santo Apóstol y Evangelista Juan el Teólogo", "Santo Apóstolo e Evangelista João o Teólogo", "red", { major: true }],
    [9, "Prophet Isaiah; Martyr Christopher", "Profeta Isaías; Mártir Cristóbal", "Profeta Isaías; Mártir Cristóvão", "black"],
    [10, "Apostle Simon the Zealot", "Apóstol Simón el Zelote", "Apóstolo Simão, o Zelote", "blue"],
    [11, "Sts Cyril and Methodius, Equals-to-the-Apostles", "Santos Cirilo y Metodio, iguales a los apóstoles", "Santos Cirilo e Metódio, iguais aos apóstolos", "red", { major: true }],
    [12, "St Epiphanius of Cyprus; St Germanus of Constantinople", "San Epifanio de Chipre; San Germán de Constantinopla", "Santo Epifânio de Chipre; São Germano de Constantinopla", "blue"],
    [13, "Martyr Glyceria; St Sergius the Confessor", "Mártir Gliceria; San Sergio Confesor", "Mártir Glicéria; São Sérgio Confessor", "black"],
    [14, "Martyr Isidore of Chios; St Isidore of Rostov", "Mártir Isidoro de Quíos; San Isidoro de Rostov", "Mártir Isidoro de Quios; Santo Isidoro de Rostov", "black"],
    [15, "St Pachomius the Great; St Isaiah of Rostov", "San Pacomio el Grande; San Isaías de Rostov", "São Pacómio o Grande; Santo Isaías de Rostov", "blue", { major: true }],
    [16, "St Theodore the Sanctified; St Ephrem of Perekop", "San Teodoro el Santificado; San Efrén de Perekop", "São Teodoro, o Santificado; São Efrém de Perekop", "black"],
    [17, "Apostles Andronicus and Junia; St Stephen of Perm (alt.)", "Apóstoles Andrónico y Junia; San Esteban de Perm", "Apóstolos Andrónico e Júnia; Santo Estêvão de Perm", "black"],
    [18, "Martyr Theodotus of Ancyra; Martyrs Peter, Dionysius and companions", "Mártir Teódoto de Ancira; Mártires Pedro, Dionisio y compañeros", "Mártir Teódoto de Ancira; Mártires Pedro, Dionísio e companheiros", "black"],
    [19, "Hieromartyr Patrick of Prusa; St Cornelius of Komel", "Hieromártir Patricio de Prusa; San Cornelio de Komel", "Hieromártir Patrício de Prusa; São Cornélio de Komel", "black"],
    [20, "Martyr Thalelaeus; St Lydia of Thyatira", "Mártir Taleleo; Santa Lidia de Tiatira", "Mártir Taleleu; Santa Lídia de Tiatira", "black"],
    [21, "Holy Emperors Constantine and Helen, Equals-to-the-Apostles", "Santos Emperadores Constantino y Elena, iguales a los apóstoles", "Santos Imperadores Constantino e Helena, iguais aos apóstolos", "red", { major: true }],
    [22, "Martyr Basiliscus; St John Vladimir, Prince of Serbia", "Mártir Basilisco; San Juan Vladimir, príncipe de Serbia", "Mártir Basiliscos; São João Vladimir, príncipe da Sérvia", "black"],
    [23, "St Michael the Confessor of Synnada; St Euphrosyne of Polotsk", "San Miguel Confesor de Sinada; Santa Eufrosina de Polotsk", "São Miguel Confessor de Sinada; Santa Eufrósina de Polotsk", "black"],
    [24, "St Symeon the Stylite of the Wonderful Mountain", "San Simeón Estilita del Monte Admirable", "São Simeão Estilita do Monte Admirável", "blue"],
    [25, "Third Finding of the Head of St John the Baptist", "Tercer hallazgo de la cabeza de San Juan Bautista", "Terceiro achado da cabeça de São João Batista", "blue", { major: true }],
    [26, "Apostles Carpus and Alphæus; St Augustine of Canterbury", "Apóstoles Carpo y Alfeo; San Agustín de Canterbury", "Apóstolos Carpo e Alfeu; Santo Agostinho de Canterbury", "black"],
    [27, "Hieromartyr Therapon; St John the Russian", "Hieromártir Terapón; San Juan el Ruso", "Hieromártir Terapão; São João, o Russo", "blue"],
    [28, "St Nicetas, Bishop of Chalcedon; St Ignatius of Rostov", "San Nicetas, obispo de Calcedonia; San Ignacio de Rostov", "São Nicetas, bispo de Calcedónia; Santo Inácio de Rostov", "black"],
    [29, "Virgin-Martyr Theodosia of Tyre; St John of Ustiug", "Virgen-mártir Teodosia de Tiro; San Juan de Ustiug", "Virgem-mártir Teodósia de Tiro; São João de Ustiug", "black"],
    [30, "St Isaac of Dalmatia; St Macrina", "San Isaac de Dalmacia; Santa Macrina", "São Isaac da Dalmácia; Santa Macrina", "black"],
    [31, "Martyr Hermias; Apostle Hermes", "Mártir Hermias; Apóstol Hermes", "Mártir Hermias; Apóstolo Hermes", "black"],
  ],
  6: [
    [1, "Martyr Justin the Philosopher and companions", "Mártir Justino el Filósofo y compañeros", "Mártir Justino, o Filósofo, e companheiros", "blue"],
    [2, "St Nicephorus the Confessor of Constantinople", "San Nicéforo Confesor de Constantinopla", "São Nicéforo Confessor de Constantinopla", "black"],
    [3, "Martyrs Lucillian and companions; St Kevin of Glendalough", "Mártires Luciliano y compañeros; San Kevin de Glendalough", "Mártires Luciliano e companheiros; São Kevin de Glendalough", "black"],
    [4, "St Metrophanes of Constantinople; St Martha and St Mary of Bethany", "San Metrófanes de Constantinopla; Santas Marta y María de Betania", "São Metrófanes de Constantinopla; Santas Marta e Maria de Betânia", "black"],
    [5, "Hieromartyr Dorotheus of Tyre", "Hieromártir Doroteo de Tiro", "Hieromártir Doroteu de Tiro", "black"],
    [6, "St Bessarion the Wonderworker; St Hilarion of Dalmatia", "San Besarion Taumaturgo; San Hilarión de Dalmacia", "São Besarion Taumaturgo; Santo Hilarião da Dalmácia", "black"],
    [7, "Hieromartyr Theodotus of Ancyra; Martyrs of Nicaea", "Hieromártir Teódoto de Ancira; Mártires de Nicea", "Hieromártir Teódoto de Ancira; Mártires de Niceia", "black"],
    [8, "Translation of the relics of Great Martyr Theodore Stratelates", "Traslación de las reliquias del Gran Mártir Teodoro Estratilates", "Translação das relíquias do Grande Mártir Teodoro Estratilates", "blue"],
    [9, "St Cyril of Alexandria; St Columba of Iona", "San Cirilo de Alejandría; San Columba de Iona", "São Cirilo de Alexandria; São Columba de Iona", "blue", { major: true }],
    [10, "Hieromartyr Timothy of Prusa; St John of Tobolsk", "Hieromártir Timoteo de Prusa; San Juan de Tobolsk", "Hieromártir Timóteo de Prusa; São João de Tobolsk", "black"],
    [11, "Holy Apostles Bartholomew and Barnabas", "Santos Apóstoles Bartolomé y Bernabé", "Santos Apóstolos Bartolomeu e Barnabé", "blue", { major: true }],
    [12, "St Onuphrius the Great; St Peter of Athos", "San Onufrio el Grande; San Pedro del Atos", "São Onúfrio o Grande; São Pedro do Atos", "blue"],
    [13, "Martyr Aquilina; St Triphyllius of Leucosia", "Mártir Aquilina; San Trifilio de Leucosia", "Mártir Aquilina; São Trifílio de Leucósia", "black"],
    [14, "Prophet Elisha; St Methodius of Constantinople", "Profeta Eliseo; San Metodio de Constantinopla", "Profeta Eliseu; São Metódio de Constantinopla", "blue"],
    [15, "Prophet Amos; St Jonah of Moscow", "Profeta Amós; San Jonás de Moscú", "Profeta Amós; São Jonas de Moscovo", "black"],
    [16, "St Tikhon of Amathus; St Tychon of Kaluga", "San Ticón de Amatunte; San Ticón de Kaluga", "São Ticão de Amatunte; São Ticão de Kaluga", "black"],
    [17, "Martyrs Manuel, Sabel and Ismael", "Mártires Manuel, Sabel e Ismael", "Mártires Manuel, Sabel e Ismael", "black"],
    [18, "Martyrs Leontius, Hypatius and Theodulus", "Mártires Leontio, Hipacio y Teódulo", "Mártires Leôncio, Hipácio e Teódulo", "black"],
    [19, "Holy Apostle Jude (Thaddeus), brother of the Lord", "Santo Apóstol Judas (Tadeo), hermano del Señor", "Santo Apóstolo Judas (Tadeu), irmão do Senhor", "blue", { major: true }],
    [20, "Hieromartyr Methodius of Patara; St Kallistos Xanthopoulos", "Hieromártir Metodio de Patara; San Calisto Xantópulo", "Hieromártir Metódio de Pátara; São Calisto Xantópulo", "black"],
    [21, "Martyr Julian of Tarsus; St Maximus of Belinsk", "Mártir Julián de Tarso; San Máximo de Belinsk", "Mártir Julião de Tarso; São Máximo de Belinsk", "black"],
    [22, "Hieromartyr Eusebius of Samosata", "Hieromártir Eusebio de Samosata", "Hieromártir Eusébio de Samosata", "black"],
    [23, "Martyr Agrippina of Rome; Translation of St Herman of Kazan", "Mártir Agripina de Roma; Traslación de San Germán de Kazán", "Mártir Agripina de Roma; Translação de São Germano de Kazã", "black"],
    [24, "Nativity of St John the Baptist", "Natividad de San Juan Bautista", "Natividade de São João Batista", "red", { major: true }],
    [25, "St Febronia the Virgin-Martyr; St Peter of Murom", "Santa Febronia, virgen-mártir; San Pedro de Múrom", "Santa Febrónia, virgem-mártir; São Pedro de Múrom", "black"],
    [26, "St David of Thessalonica; Appearance of the Tikhvin Icon", "San David de Tesalónica; Aparición del icono de Tijvin", "São David de Tessalónica; Aparição do ícone de Tíkhvin", "blue"],
    [27, "St Sampson the Hospitable", "San Sansón el Hospitalario", "São Sansão, o Hospitalário", "blue"],
    [28, "Translation of the relics of the Unmercenaries Cyrus and John", "Traslación de las reliquias de los anárgiros Ciro y Juan", "Translação das relíquias dos anárgiros Ciro e João", "black"],
    [29, "Holy Apostles Peter and Paul", "Santos Apóstoles Pedro y Pablo", "Santos Apóstolos Pedro e Paulo", "red", { major: true }],
    [30, "Synaxis of the Twelve Apostles", "Sinaxis de los Doce Apóstoles", "Sinaxe dos Doze Apóstolos", "blue", { major: true }],
  ],
  7: [
    [1, "Unmercenaries Cosmas and Damian of Rome", "Anárgiros Cosme y Damián de Roma", "Anárgiros Cosme e Damião de Roma", "blue"],
    [2, "Deposition of the Robe of the Theotokos at Blachernae", "Deposición del manto de la Theotokos en Blanquernas", "Deposição do manto da Theotokos em Blanquernas", "blue", { major: true }],
    [3, "Martyr Hyacinth; St Anatolius of Constantinople", "Mártir Jacinto; San Anatolio de Constantinopla", "Mártir Jacinto; Santo Anatólio de Constantinopla", "black"],
    [4, "St Andrew of Crete; St Martha, mother of St Symeon", "San Andrés de Creta; Santa Marta, madre de San Simeón", "Santo André de Creta; Santa Marta, mãe de São Simeão", "blue"],
    [5, "St Athanasius of Athos; St Elizabeth of Russia (new)", "San Atanasio del Atos; Santa Isabel de Rusia", "Santo Atanásio do Atos; Santa Isabel da Rússia", "blue", { major: true }],
    [6, "St Sisoes the Great", "San Sisoes el Grande", "São Sisoe o Grande", "blue"],
    [7, "Great Martyr Kyriake; St Thomas of Mt Maleon", "Gran Mártir Ciriaca; San Tomás del monte Maleón", "Grande Mártir Ciríaca; São Tomás do monte Maleão", "black"],
    [8, "Great Martyr Procopius of Caesarea", "Gran Mártir Procopio de Cesarea", "Grande Mártir Procópio de Cesareia", "blue"],
    [9, "Hieromartyr Pancratius of Taormina", "Hieromártir Pancracio de Taormina", "Hieromártir Pancrácio de Taormina", "black"],
    [10, "The Forty-Five Martyrs of Nicopolis in Armenia", "Los cuarenta y cinco mártires de Nicópolis de Armenia", "Os quarenta e cinco mártires de Nicópolis da Arménia", "black"],
    [11, "Great Martyr Euphemia; St Olga, Equal-to-the-Apostles", "Gran Mártir Eufemia; Santa Olga, igual a los apóstoles", "Grande Mártir Eufémia; Santa Olga, igual aos apóstolos", "blue", { major: true }],
    [12, "Martyrs Proclus and Hilary; St Veronica", "Mártires Proclo e Hilario; Santa Verónica", "Mártires Proclo e Hilário; Santa Verónica", "black"],
    [13, "Synaxis of the Archangel Gabriel; St Stephen of St Sabbas", "Sinaxis del Arcángel Gabriel; San Esteban de San Sabas", "Sinaxe do Arcanjo Gabriel; Santo Estêvão de São Sabas", "blue"],
    [14, "Apostle Aquila; St Nicodemus the Hagiorite", "Apóstol Aquila; San Nicodemo el Hagiorita", "Apóstolo Áquila; São Nicodemos, o Hagiorita", "black"],
    [15, "Holy Equal-to-the-Apostles Vladimir (Boris and Gleb also)", "Santos iguales a los apóstoles Vladimir (también Boris y Gleb)", "Santos iguais aos apóstolos Vladimir (também Boris e Gleb)", "red", { major: true }],
    [16, "Hieromartyr Athenogenes; Martyr Julia of Carthage", "Hieromártir Atenógenes; Mártir Julia de Cartago", "Hieromártir Atenógenes; Mártir Júlia de Cartago", "black"],
    [17, "Great Martyr Marina (Margaret) of Antioch", "Gran Mártir Marina (Margarita) de Antioquía", "Grande Mártir Marina (Margarida) de Antioquia", "blue", { major: true }],
    [18, "Martyr Emilian of Dorostolum", "Mártir Emiliano de Dorostolo", "Mártir Emiliano de Doróstolo", "black"],
    [19, "St Macrina, sister of St Basil; St Dios of Antioch", "Santa Macrina, hermana de San Basilio; San Dios de Antioquía", "Santa Macrina, irmã de São Basílio; São Dios de Antioquia", "blue"],
    [20, "Holy Prophet Elijah the Tishbite", "Santo Profeta Elías el Tesbita", "Santo Profeta Elias, o Tesbita", "red", { major: true }],
    [21, "Sts Symeon and John the Fools-for-Christ; Prophet Ezekiel", "Santos Simeón y Juan, locos por Cristo; Profeta Ezequiel", "Santos Simeão e João, loucos por Cristo; Profeta Ezequiel", "black"],
    [22, "St Mary Magdalene, Equal-to-the-Apostles", "Santa María Magdalena, igual a los apóstoles", "Santa Maria Madalena, igual aos apóstolos", "blue", { major: true }],
    [23, "Hieromartyrs Trophimus and companions; St John Cassian (alt.)", "Hieromártires Trófimo y compañeros; San Juan Casiano", "Hieromártires Trófimo e companheiros; São João Cassiano", "black"],
    [24, "Martyr Christina; Holy Passion-Bearers Boris and Gleb", "Mártir Cristina; Santos pasionarios Boris y Gleb", "Mártir Cristina; Santos passionários Boris e Gleb", "blue", { major: true }],
    [25, "Dormition of St Anna, mother of the Theotokos", "Dormición de Santa Ana, madre de la Theotokos", "Dormição de Santa Ana, mãe da Theotokos", "blue", { major: true }],
    [26, "Hieromartyr Hermolaus; Martyr Paraskeva of Rome", "Hieromártir Hermolao; Mártir Parasceva de Roma", "Hieromártir Hermolau; Mártir Parascheva de Roma", "blue"],
    [27, "Great Martyr and Healer Panteleimon", "Gran Mártir y Sanador Pantaleón", "Grande Mártir e Curador Pantaleão", "red", { major: true }],
    [28, "Apostles Prochorus, Nicanor, Timon and Parmenas", "Apóstoles Prócoro, Nicanor, Timón y Pármenas", "Apóstolos Prócoro, Nicanor, Timão e Pármenas", "black"],
    [29, "Martyr Callinicus; St Theodota and her sons", "Mártir Calínico; Santa Teodota y sus hijos", "Mártir Calínico; Santa Teodota e seus filhos", "black"],
    [30, "Apostles Silas and Silvanus of the Seventy", "Apóstoles Silas y Silvano de los Setenta", "Apóstolos Silas e Silvano dos Setenta", "black"],
    [31, "Forefeast of the Procession of the Cross; St Eudocimus", "Prefiesta de la Procesión de la Cruz; San Eudocimo", "Prefesta da Procissão da Cruz; Santo Eudócimo", "blue"],
  ],
  8: [
    [1, "Procession of the Precious Cross; The Seven Maccabean Martyrs", "Procesión de la preciosa Cruz; Los siete mártires Macabeos", "Procissão da preciosa Cruz; Os sete mártires Macabeus", "blue", { major: true, fasting: "wine_oil" }],
    [2, "Translation of the relics of St Stephen the Protomartyr", "Traslación de las reliquias de San Esteban Protomártir", "Translação das relíquias de Santo Estêvão Protomártir", "blue"],
    [3, "Sts Isaac, Dalmatus and Faustus; St Anthony the Roman", "Santos Isaac, Dalmato y Fausto; San Antonio el Romano", "Santos Isaac, Dálmato e Fausto; Santo António, o Romano", "black"],
    [4, "The Seven Youths of Ephesus; Martyr Eudocia", "Los siete jóvenes de Éfeso; Mártir Eudocia", "Os sete jovens de Éfeso; Mártir Eudócia", "black"],
    [5, "Forefeast of the Transfiguration; Martyr Eusignius", "Prefiesta de la Transfiguración; Mártir Eusignio", "Prefesta da Transfiguração; Mártir Eusígnio", "blue"],
    [6, "Holy Transfiguration of the Lord", "Santa Transfiguración del Señor", "Santa Transfiguração do Senhor", "red", { major: true, fasting: "fish" }],
    [7, "Martyr Dometius of Persia; St Theodora of Sihla (BOR)", "Mártir Dometio de Persia; Santa Teodora de Sihla (BOR)", "Mártir Domécio da Pérsia; Santa Teodora de Sihla (BOR)", "blue", { ro: true, major: true }],
    [8, "St Emilian the Confessor; St Myron of Crete", "San Emiliano Confesor; San Mirón de Creta", "São Emiliano Confessor; São Mirão de Creta", "black"],
    [9, "Apostle Matthias; St Herman of Alaska (glorification often)", "Apóstol Matías; San Germán de Alaska", "Apóstolo Matias; São Germano do Alasca", "blue"],
    [10, "Holy Martyr and Archdeacon Laurence of Rome", "Santo Mártir y Archidiácono Lorenzo de Roma", "Santo Mártir e Arquidiácono Lourenço de Roma", "blue", { major: true }],
    [11, "Martyr Euplus of Catania", "Mártir Euplio de Catania", "Mártir Euplio de Catânia", "black"],
    [12, "Martyrs Photius and Anicetus", "Mártires Focio y Aniceto", "Mártires Fócio e Aniceto", "black"],
    [13, "St Maximus the Confessor (translation); St Tikhon of Zadonsk", "San Máximo Confesor (traslación); San Ticón de Zadonsk", "São Máximo Confessor (translação); São Ticão de Zadonsk", "blue"],
    [14, "Forefeast of the Dormition; Prophet Micah", "Prefiesta de la Dormición; Profeta Miqueas", "Prefesta da Dormição; Profeta Miqueias", "blue"],
    [15, "Dormition of the Most Holy Theotokos", "Dormición de la Santísima Theotokos", "Dormição da Santíssima Theotokos", "red", { major: true }],
    [16, "Translation of the Image Not-Made-by-Hands; Sts Constantin Brâncoveanu and companions (BOR)", "Traslación de la Imagen no hecha por manos; Santos Constantino Brâncoveanu y compañeros (BOR)", "Translação da Imagem não feita por mãos; Santos Constantino Brâncoveanu e companheiros (BOR)", "red", { major: true, ro: true }],
    [17, "Martyr Myron of Cyzicus; St Alypius the Iconographer", "Mártir Mirón de Cícico; San Alipio el Iconógrafo", "Mártir Mirão de Cízico; Santo Alípio, o Iconógrafo", "black"],
    [18, "Martyrs Florus and Laurus", "Mártires Floro y Lauro", "Mártires Floro e Lauro", "black"],
    [19, "Martyr Andrew Stratelates and companions", "Mártir Andrés Estratilates y compañeros", "Mártir André Estratilates e companheiros", "black"],
    [20, "Prophet Samuel; Martyr Lucius", "Profeta Samuel; Mártir Lucio", "Profeta Samuel; Mártir Lúcio", "black"],
    [21, "Apostle Thaddeus; Martyr Bassa and her sons", "Apóstol Tadeo; Mártir Basa y sus hijos", "Apóstolo Tadeu; Mártir Basa e seus filhos", "black"],
    [22, "Martyr Agathonicus and companions", "Mártir Agatónico y compañeros", "Mártir Agatónico e companheiros", "black"],
    [23, "Leave-taking of the Dormition; Martyr Lupus", "Despedida de la Dormición; Mártir Lupo", "Despedida da Dormição; Mártir Lupo", "blue"],
    [24, "Hieromartyr Eutyches; St Cosmas of Aetolia", "Hieromártir Eutiques; San Cosme de Etolia", "Hieromártir Eutiques; São Cosme de Etólia", "blue"],
    [25, "Translation of the relics of Apostle Bartholomew; Apostle Titus", "Traslación de las reliquias del Apóstol Bartolomé; Apóstol Tito", "Translação das relíquias do Apóstolo Bartolomeu; Apóstolo Tito", "blue"],
    [26, "Martyrs Adrian and Natalia", "Mártires Adrián y Natalia", "Mártires Adriano e Natália", "blue"],
    [27, "St Poemen the Great", "San Pimen el Grande", "São Pímen o Grande", "blue"],
    [28, "St Moses the Ethiopian; Righteous Hezekiah", "San Moisés el Etíope; Justo Ezequías", "São Moisés, o Etíope; Justo Ezequias", "blue"],
    [29, "Beheading of St John the Baptist", "Decapitación de San Juan Bautista", "Degolação de São João Batista", "red", { major: true, fasting: "strict" }],
    [30, "Sts Alexander, John and Paul the New of Constantinople", "Santos Alejandro, Juan y Pablo el Nuevo de Constantinopla", "Santos Alexandre, João e Paulo, o Novo, de Constantinopla", "black"],
    [31, "Deposition of the Cincture of the Theotokos", "Deposición del cíngulo de la Theotokos", "Deposição do cíngulo da Theotokos", "blue", { major: true }],
  ],
  9: [
    [1, "Beginning of the Church Year; St Symeon the Stylite", "Inicio del año eclesiástico; San Simeón Estilita", "Início do ano eclesiástico; São Simeão Estilita", "blue", { major: true }],
    [2, "Martyr Mamas; St John the Faster of Constantinople", "Mártir Mamas; San Juan el Ayunador de Constantinopla", "Mártir Mamas; São João, o Jejuador, de Constantinopla", "black"],
    [3, "Hieromartyr Anthimus of Nicomedia; St Theoctistus", "Hieromártir Ántimo de Nicomedia; San Teoctisto", "Hieromártir Ántimo de Nicomédia; São Teoctisto", "black"],
    [4, "Hieromartyr Babylas of Antioch; Prophet Moses", "Hieromártir Babilas de Antioquía; Profeta Moisés", "Hieromártir Babilas de Antioquia; Profeta Moisés", "black"],
    [5, "Prophet Zacharias and Righteous Elizabeth", "Profeta Zacarías y Justa Isabel", "Profeta Zacarias e Justa Isabel", "blue"],
    [6, "Miracle of the Archangel Michael at Chonae", "Milagro del Arcángel Miguel en Conas", "Milagre do Arcanjo Miguel em Conas", "blue", { major: true }],
    [7, "Forefeast of the Nativity of the Theotokos; Martyr Sozon", "Prefiesta de la Natividad de la Theotokos; Mártir Sozón", "Prefesta da Natividade da Theotokos; Mártir Sozão", "blue"],
    [8, "Nativity of the Most Holy Theotokos", "Natividad de la Santísima Theotokos", "Natividade da Santíssima Theotokos", "red", { major: true }],
    [9, "Holy Ancestors of God Joachim and Anna", "Santos antepasados de Dios Joaquín y Ana", "Santos antepassados de Deus Joaquim e Ana", "blue"],
    [10, "Martyrs Menodora, Metrodora and Nymphodora", "Mártires Menodora, Metrodora y Ninfodora", "Mártires Menodora, Metrodora e Ninfodora", "black"],
    [11, "St Theodora of Alexandria; St Euphrosynus the Cook", "Santa Teodora de Alejandría; San Eufrosino el Cocinero", "Santa Teodora de Alexandria; São Eufrósino, o Cozinheiro", "black"],
    [12, "Hieromartyr Autonomus; St Coronatus", "Hieromártir Autónomo; San Coronato", "Hieromártir Autónomo; São Coronato", "black"],
    [13, "Forefeast of the Elevation; Consecration of the Church of the Resurrection", "Prefiesta de la Exaltación; Consagración de la Iglesia de la Resurrección", "Prefesta da Exaltação; Consagração da Igreja da Ressurreição", "blue"],
    [14, "Elevation of the Precious and Life-Giving Cross", "Exaltación de la preciosa y vivificante Cruz", "Exaltação da preciosa e vivificante Cruz", "red", { major: true, fasting: "strict" }],
    [15, "Great Martyr Nicetas the Goth", "Gran Mártir Nicetas el Godo", "Grande Mártir Nicetas, o Godo", "blue"],
    [16, "Great Martyr Euphemia; St Cyprian of Carthage (often)", "Gran Mártir Eufemia; San Cipriano de Cartago", "Grande Mártir Eufémia; São Cipriano de Cartago", "blue"],
    [17, "Martyrs Sophia and her daughters Faith, Hope and Love", "Mártires Sofía y sus hijas Fe, Esperanza y Caridad", "Mártires Sofia e suas filhas Fé, Esperança e Caridade", "blue", { major: true }],
    [18, "St Eumenius of Gortyna; Martyr Ariadne", "San Eumenio de Gortina; Mártir Ariadna", "São Euménio de Gortina; Mártir Ariadna", "black"],
    [19, "Martyrs Trophimus, Sabbatius and Dorymedon", "Mártires Trófimo, Sabacio y Dorimedonte", "Mártires Trófimo, Sabácio e Dorimedonte", "black"],
    [20, "Great Martyr Eustathius Placidas and his family", "Gran Mártir Eustacio Plácido y su familia", "Grande Mártir Eustácio Plácido e sua família", "blue"],
    [21, "Apostle Quadratus of the Seventy; St Jonah of Palestine", "Apóstol Cuadrato de los Setenta; San Jonás de Palestina", "Apóstolo Quadrado dos Setenta; São Jonas da Palestina", "black"],
    [22, "Hieromartyr Phocas of Sinope; Prophet Jonah", "Hieromártir Focas de Sinope; Profeta Jonás", "Hieromártir Focas de Sinope; Profeta Jonas", "black"],
    [23, "Conception of St John the Baptist", "Concepción de San Juan Bautista", "Conceição de São João Batista", "blue", { major: true }],
    [24, "St Thecla, Protomartyr among women; St Silouan of Athos", "Santa Tecla, protomártir entre las mujeres; San Siluán del Atos", "Santa Tecla, protomártir entre as mulheres; São Silouan do Atos", "blue", { major: true }],
    [25, "St Euphrosyne of Alexandria; St Sergius of Radonezh (repose often Oct 8)", "Santa Eufrosina de Alejandría; San Sergio de Radonezh", "Santa Eufrósina de Alexandria; São Sérgio de Radonezh", "blue"],
    [26, "Repose of Holy Apostle and Evangelist John the Theologian", "Tránsito del santo Apóstol y Evangelista Juan el Teólogo", "Trânsito do santo Apóstolo e Evangelista João o Teólogo", "red", { major: true }],
    [27, "Martyr Callistratus; St Antim of Iberia (BOR)", "Mártir Calístrato; San Ántimo de Iberia (BOR)", "Mártir Calístrato; Santo Ántimo da Ibéria (BOR)", "blue", { major: true, ro: true }],
    [28, "St Chariton the Confessor; Prophet Baruch", "San Caritón Confesor; Profeta Baruc", "São Caritão Confessor; Profeta Baruc", "blue"],
    [29, "St Cyriacus the Hermit; Martyr Gudelia", "San Ciriaco el Ermitaño; Mártir Gudelia", "São Ciríaco, o Eremita; Mártir Gudelia", "black"],
    [30, "Hieromartyr Gregory of Armenia (the Enlightener)", "Hieromártir Gregorio de Armenia (el Iluminador)", "Hieromártir Gregório da Arménia (o Iluminador)", "blue", { major: true }],
  ],
  10: [
    [1, "Protection (Pokrov) of the Most Holy Theotokos", "Protección de la Santísima Theotokos", "Proteção da Santíssima Theotokos", "blue", { major: true }],
    [2, "Hieromartyr Cyprian and Virgin-Martyr Justina", "Hieromártir Cipriano y virgen-mártir Justina", "Hieromártir Cipriano e virgem-mártir Justina", "blue"],
    [3, "Hieromartyr Dionysius the Areopagite", "Hieromártir Dionisio el Areopagita", "Hieromártir Dionísio, o Areopagita", "blue", { major: true }],
    [4, "Hieromartyr Hierotheus of Athens; St Stephen Stiljanović", "Hieromártir Hieroteo de Atenas; San Esteban Stiljanović", "Hieromártir Hieroteu de Atenas; Santo Estêvão Stiljanović", "black"],
    [5, "Martyr Charitina; St Methodia of Kimolos", "Mártir Caritina; Santa Metodia de Kímolos", "Mártir Caritina; Santa Metódia de Kímolos", "black"],
    [6, "Holy Apostle Thomas", "Santo Apóstol Tomás", "Santo Apóstolo Tomé", "blue", { major: true }],
    [7, "Martyrs Sergius and Bacchus", "Mártires Sergio y Baco", "Mártires Sérgio e Baco", "blue"],
    [8, "St Pelagia; St Thaïs; St Keyne", "Santa Pelagia; Santa Tais; Santa Keyne", "Santa Pelágia; Santa Tais; Santa Keyne", "black"],
    [9, "Holy Apostle James, son of Alphaeus; St Andronicus and St Athanasia", "Santo Apóstol Santiago, hijo de Alfeo; Santos Andrónico y Atanasia", "Santo Apóstolo Tiago, filho de Alfeu; Santos Andrónico e Atanásia", "blue"],
    [10, "Martyrs Eulampius and Eulampia", "Mártires Eulampio y Eulampia", "Mártires Eulâmpio e Eulâmpia", "black"],
    [11, "Apostle Philip of the Seventy; St Theophanes the Confessor", "Apóstol Felipe de los Setenta; San Teófanes Confesor", "Apóstolo Filipe dos Setenta; São Teófanes Confessor", "black"],
    [12, "Martyrs Probus, Tarachus and Andronicus; St Cosmas the Hymnographer", "Mártires Probo, Táraco y Andrónico; San Cosme el Himnógrafo", "Mártires Probo, Táraco e Andrónico; São Cosme, o Hinógrafo", "black"],
    [13, "Martyrs Carpus, Papylus and companions", "Mártires Carpo, Pápilo y compañeros", "Mártires Carpo, Pápilo e companheiros", "black"],
    [14, "St Paraskeva of Iași (Epivat) — BOR national feast", "Santa Paraskeva de Iași (Epivat) — fiesta nacional BOR", "Santa Paraskeva de Iași (Epivat) — festa nacional BOR", "red", { major: true, ro: true }],
    [15, "St Lucian of Antioch; St Euthymius the New of Thessalonica", "San Luciano de Antioquía; San Eutimio el Nuevo de Tesalónica", "São Luciano de Antioquia; São Eutímio, o Novo, de Tessalónica", "black"],
    [16, "Martyr Longinus the Centurion", "Mártir Longinos el Centurión", "Mártir Longinos, o Centurião", "blue"],
    [17, "Prophet Hosea; Monk-Martyr Andrew of Crete", "Profeta Oseas; Monje-mártir Andrés de Creta", "Profeta Oseias; Monge-mártir André de Creta", "black"],
    [18, "Holy Apostle and Evangelist Luke", "Santo Apóstol y Evangelista Lucas", "Santo Apóstolo e Evangelista Lucas", "red", { major: true }],
    [19, "Prophet Joel; Martyr Varus; St John of Rila", "Profeta Joel; Mártir Varo; San Juan de Rila", "Profeta Joel; Mártir Varo; São João de Rila", "blue"],
    [20, "Great Martyr Artemius; St Gerasimus of Cephalonia", "Gran Mártir Artemio; San Gerásimo de Cefalonia", "Grande Mártir Artémio; São Gerásimo de Cefalónia", "blue"],
    [21, "St Hilarion the Great", "San Hilarión el Grande", "Santo Hilarião o Grande", "blue", { major: true }],
    [22, "St Abercius of Hierapolis; The Seven Youths of Ephesus (alt.)", "San Abercio de Hierápolis; Los siete jóvenes de Éfeso", "Santo Abércio de Hierápolis; Os sete jovens de Éfeso", "black"],
    [23, "Holy Apostle James, Brother of the Lord", "Santo Apóstol Santiago, hermano del Señor", "Santo Apóstolo Tiago, irmão do Senhor", "blue", { major: true }],
    [24, "Martyr Arethas and companions; St Elesbaan of Ethiopia", "Mártir Aretas y compañeros; San Elesbaán de Etiopía", "Mártir Aretas e companheiros; Santo Elesbaão da Etiópia", "black"],
    [25, "Martyrs Marcian and Martyrius the Notaries", "Mártires Marciano y Martirio los Notarios", "Mártires Marciano e Martírio, os Notários", "black"],
    [26, "Great Martyr Demetrios the Myrrh-Streamer of Thessalonica", "Gran Mártir Demetrio el Mirófluito de Tesalónica", "Grande Mártir Demétrio, o Miróforo, de Tessalónica", "red", { major: true }],
    [27, "St Dimitrie (Demetrius) the New of Basarabov (BOR)", "San Dimitrie el Nuevo de Basarabov (BOR)", "São Dimitrie, o Novo, de Basarabov (BOR)", "red", { major: true, ro: true }],
    [28, "Martyrs Terence and Eunice; St Stephen the Sabaite", "Mártires Terencio y Eunice; San Esteban el Sabaita", "Mártires Terêncio e Eunice; Santo Estêvão, o Sabaita", "black"],
    [29, "Martyr Anastasia the Roman; St Abramius the Recluse", "Mártir Anastasia la Romana; San Abrámio el Recluso", "Mártir Anastásia, a Romana; Santo Abrámio, o Recluso", "black"],
    [30, "Hieromartyrs Zenobius and Zenobia", "Hieromártires Zenobio y Zenobia", "Hieromártires Zenóbio e Zenóbia", "black"],
    [31, "Apostles Stachys, Amplias and companions; St Epimachus", "Apóstoles Estáquis, Amplias y compañeros; San Epímaco", "Apóstolos Estáquis, Amplias e companheiros; Santo Epímaco", "black"],
  ],
  11: [
    [1, "Unmercenaries Cosmas and Damian of Asia", "Anárgiros Cosme y Damián de Asia", "Anárgiros Cosme e Damião da Ásia", "blue"],
    [2, "Martyrs Acindynus, Pegasius and companions", "Mártires Acíndino, Pegásio y compañeros", "Mártires Acíndino, Pegásio e companheiros", "black"],
    [3, "Martyrs Acepsimas, Joseph and Aithalas; Renewal of St George at Lydda", "Mártires Acepimas, José y Aitalas; Renovación de San Jorge en Lidda", "Mártires Acepimas, José e Aitalas; Renovação de São Jorge em Lida", "blue"],
    [4, "St Joannicius the Great; Hieromartyr Nicander", "San Joanicio el Grande; Hieromártir Nicandro", "São Joanício o Grande; Hieromártir Nicandro", "blue"],
    [5, "Martyrs Galaction and Episteme", "Mártires Galacción y Episteme", "Mártires Galacião e Episteme", "black"],
    [6, "St Paul the Confessor of Constantinople", "San Pablo Confesor de Constantinopla", "São Paulo Confessor de Constantinopla", "blue"],
    [7, "The Thirty-Three Martyrs of Melitene; St Lazarus the Wonderworker", "Los treinta y tres mártires de Melitene; San Lázaro Taumaturgo", "Os trinta e três mártires de Melitene; São Lázaro Taumaturgo", "black"],
    [8, "Synaxis of the Archangel Michael and the Bodiless Powers", "Sinaxis del Arcángel Miguel y las Potestades Incorpóreas", "Sinaxe do Arcanjo Miguel e das Potestades Incorpóreas", "red", { major: true }],
    [9, "Martyrs Onesiphorus and Porphyrius; St Nectarios of Aegina", "Mártires Onesíforo y Porfirio; San Nectario de Egina", "Mártires Onesíforo e Porfírio; São Nectário de Egina", "blue", { major: true }],
    [10, "Apostles Olympas, Rodion and companions; St Theocteristus", "Apóstoles Olimpas, Rodión y compañeros; San Teocteristo", "Apóstolos Olímpas, Rodião e companheiros; São Teocteristo", "black"],
    [11, "Martyrs Menas, Victor and Vincent; St Theodore the Studite", "Mártires Menas, Víctor y Vicente; San Teodoro Estudita", "Mártires Menas, Vítor e Vicente; São Teodoro Estudita", "blue"],
    [12, "St John the Merciful of Alexandria; St Nilus of Sinai", "San Juan el Misericordioso de Alejandría; San Nilo del Sinaí", "São João, o Misericordioso, de Alexandria; São Nilo do Sinai", "blue", { major: true }],
    [13, "St John Chrysostom, Archbishop of Constantinople", "San Juan Crisóstomo, arzobispo de Constantinopla", "São João Crisóstomo, arcebispo de Constantinopla", "red", { major: true }],
    [14, "Holy Apostle Philip", "Santo Apóstol Felipe", "Santo Apóstolo Filipe", "blue", { major: true }],
    [15, "Martyrs Gurias, Samonas and Abibus; beginning of Nativity Fast", "Mártires Gurias, Samonas y Abibo; inicio del ayuno de Navidad", "Mártires Gurias, Samonas e Abibo; início do jejum do Natal", "blue"],
    [16, "Holy Apostle and Evangelist Matthew", "Santo Apóstol y Evangelista Mateo", "Santo Apóstolo e Evangelista Mateus", "red", { major: true }],
    [17, "St Gregory the Wonderworker of Neo-Caesarea", "San Gregorio Taumaturgo de Neocesarea", "São Gregório Taumaturgo de Neocesareia", "blue", { major: true }],
    [18, "Martyrs Plato and Romanus", "Mártires Platón y Romano", "Mártires Platão e Romano", "black"],
    [19, "Prophet Obadiah; Martyr Barlaam of Antioch", "Profeta Abdías; Mártir Barlaam de Antioquía", "Profeta Obadias; Mártir Barlaão de Antioquia", "black"],
    [20, "Forefeast of the Entrance; St Gregory of Decapolis", "Prefiesta de la Entrada; San Gregorio de Decápolis", "Prefesta da Entrada; São Gregório de Decápolis", "blue"],
    [21, "Entrance of the Theotokos into the Temple", "Entrada de la Theotokos en el Templo", "Entrada da Theotokos no Templo", "red", { major: true }],
    [22, "Apostles Philemon and Archippus; Martyr Cecilia", "Apóstoles Filemón y Arquipo; Mártir Cecilia", "Apóstolos Filémon e Arquipo; Mártir Cecília", "black"],
    [23, "St Amphilochius of Iconium; St Gregory of Agrigentum", "San Anfiloquio de Iconio; San Gregorio de Agrigento", "Santo Anfilóquio de Icónio; São Gregório de Agrigento", "black"],
    [24, "Hieromartyrs Clement of Rome and Peter of Alexandria", "Hieromártires Clemente de Roma y Pedro de Alejandría", "Hieromártires Clemente de Roma e Pedro de Alexandria", "blue"],
    [25, "Great Martyr Catherine of Alexandria; Great Martyr Mercurius", "Gran Mártir Catalina de Alejandría; Gran Mártir Mercurio", "Grande Mártir Catarina de Alexandria; Grande Mártir Mercúrio", "red", { major: true }],
    [26, "St Alypius the Stylite; St Nikon the Preacher of Repentance", "San Alipio Estilita; San Nicón, predicador del arrepentimiento", "Santo Alípio Estilita; São Nicão, pregador do arrependimento", "black"],
    [27, "Great Martyr James the Persian; St Palladius", "Gran Mártir Jacobo el Persa; San Paladio", "Grande Mártir Tiago, o Persa; São Paládio", "blue"],
    [28, "Monk-Martyr Stephen the New; Martyr Irenarchus", "Monje-mártir Esteban el Nuevo; Mártir Irenarco", "Monge-mártir Estêvão, o Novo; Mártir Irenarco", "blue"],
    [29, "Martyrs Paramon and Philumenus", "Mártires Paramón y Filúmeno", "Mártires Paramão e Filúmeno", "black"],
    [30, "Holy Apostle Andrew the First-Called", "Santo Apóstol Andrés el Primero Llamado", "Santo Apóstolo André, o Primeiro Chamado", "red", { major: true }],
  ],
  12: [
    [1, "Prophet Nahum; Romanian National Day (civil)", "Profeta Nahum; Día Nacional de Rumania (civil)", "Profeta Naum; Dia Nacional da Roménia (civil)", "blue", { civil: true, ro: true, major: true }],
    [2, "Prophet Habakkuk; St Porphyrius the Kavsokalivite", "Profeta Habacuc; San Porfirio el Kavsokalyvita", "Profeta Habacuc; São Porfírio, o Kavsokalyvita", "black"],
    [3, "Prophet Zephaniah; St John the Silent", "Profeta Sofonías; San Juan el Silencioso", "Profeta Sofonias; São João, o Silencioso", "black"],
    [4, "Great Martyr Barbara; St John of Damascus", "Gran Mártir Bárbara; San Juan Damasceno", "Grande Mártir Bárbara; São João Damasceno", "blue", { major: true }],
    [5, "St Sabbas the Sanctified", "San Sabas el Santificado", "São Sabas, o Santificado", "blue", { major: true }],
    [6, "St Nicholas the Wonderworker of Myra", "San Nicolás Taumaturgo de Mira", "São Nicolau Taumaturgo de Mira", "red", { major: true }],
    [7, "St Ambrose of Milan", "San Ambrosio de Milán", "Santo Ambrósio de Milão", "blue", { major: true }],
    [8, "St Patapius of Thebes; Apostles Sosthenes and Apollos", "San Patapio de Tebas; Apóstoles Sóstenes y Apolo", "São Patápio de Tebas; Apóstolos Sóstenes e Apolo", "black"],
    [9, "Conception of the Theotokos by St Anna", "Concepción de la Theotokos por Santa Ana", "Conceição da Theotokos por Santa Ana", "blue", { major: true }],
    [10, "Martyrs Menas, Hermogenes and Eugraphus", "Mártires Menas, Hermógenes y Eugrafo", "Mártires Menas, Hermógenes e Eugrafo", "black"],
    [11, "St Daniel the Stylite; St Luke the New of Stirion", "San Daniel Estilita; San Lucas el Nuevo de Stirion", "São Daniel Estilita; São Lucas, o Novo, de Stirion", "blue"],
    [12, "St Spyridon the Wonderworker of Trimythous", "San Espiridón Taumaturgo de Trimythous", "São Espiridão Taumaturgo de Trimythous", "red", { major: true }],
    [13, "Martyrs Eustratius, Auxentius, Eugene, Mardarius and Orestes", "Mártires Eustracio, Auxencio, Eugenio, Mardario y Orestes", "Mártires Eustrácio, Auxêncio, Eugénio, Mardário e Orestes", "blue"],
    [14, "Martyrs Thyrsus, Leucius and Callinicus", "Mártires Tirso, Leucio y Calínico", "Mártires Tirso, Léucio e Calínico", "black"],
    [15, "Hieromartyr Eleutherius; St Paul of Latros", "Hieromártir Eleuterio; San Pablo de Latros", "Hieromártir Eleutério; São Paulo de Latros", "black"],
    [16, "Prophet Haggai; St Theophano the Empress", "Profeta Ageo; Santa Teófano la Emperatriz", "Profeta Ageu; Santa Teófano, a Imperatriz", "black"],
    [17, "Prophet Daniel and the Three Holy Youths", "Profeta Daniel y los Tres Santos Jóvenes", "Profeta Daniel e os Três Santos Jovens", "blue", { major: true }],
    [18, "Martyr Sebastian and companions", "Mártir Sebastián y compañeros", "Mártir Sebastião e companheiros", "blue"],
    [19, "Martyr Boniface; St Gregory of Omirits", "Mártir Bonifacio; San Gregorio de Omirits", "Mártir Bonifácio; São Gregório de Omirits", "black"],
    [20, "Forefeast of the Nativity; Hieromartyr Ignatius the God-Bearer", "Prefiesta de la Natividad; Hieromártir Ignacio el Portador de Dios", "Prefesta da Natividade; Hieromártir Inácio, o Portador de Deus", "blue", { major: true }],
    [21, "Martyr Juliana of Nicomedia; St Peter of Kiev", "Mártir Juliana de Nicomedia; San Pedro de Kiev", "Mártir Juliana de Nicomédia; São Pedro de Kiev", "black"],
    [22, "Great Martyr Anastasia the Deliverer from Potions", "Gran Mártir Anastasia, libertadora de venenos", "Grande Mártir Anastásia, libertadora de venenos", "blue"],
    [23, "The Ten Martyrs of Crete; St Nahum of Ochrid", "Los diez mártires de Creta; San Nahum de Ohrid", "Os dez mártires de Creta; São Naum de Ohrid", "black"],
    [24, "Eve of the Nativity; Nun-Martyr Eugenia", "Víspera de la Natividad; Monja-mártir Eugenia", "Véspera da Natividade; Monja-mártir Eugénia", "blue", { major: true, fasting: "strict" }],
    [25, "Nativity of Our Lord Jesus Christ", "Natividad de Nuestro Señor Jesucristo", "Natividade de Nosso Senhor Jesus Cristo", "red", { major: true, fasting: "none" }],
    [26, "Synaxis of the Most Holy Theotokos; St Nicodemus of Tismana (BOR)", "Sinaxis de la Santísima Theotokos; San Nicodemo de Tismana (BOR)", "Sinaxe da Santíssima Theotokos; São Nicodemos de Tismana (BOR)", "blue", { major: true, ro: true }],
    [27, "Protomartyr Stephen the Archdeacon", "Protomártir Esteban el Archidiácono", "Protomártir Estêvão, o Arquidiácono", "blue", { major: true }],
    [28, "The Twenty Thousand Martyrs of Nicomedia", "Los veinte mil mártires de Nicomedia", "Os vinte mil mártires de Nicomédia", "black"],
    [29, "The Fourteen Thousand Holy Innocents; St Marcellus", "Los catorce mil Santos Inocentes; San Marcelo", "Os catorze mil Santos Inocentes; São Marcelo", "blue"],
    [30, "Martyr Anysia; St Leo of Melandudion", "Mártir Anisia; San León de Melandudion", "Mártir Anísia; São Leão de Melandudion", "black"],
    [31, "Leave-taking of the Nativity; St Melania the Younger", "Despedida de la Natividad; Santa Melania la Joven", "Despedida da Natividade; Santa Melânia, a Jovem", "blue"],
  ],
};

/** Extra Romanian / civil overlays by MM-DD (merged into title if not already). */
const RO_CIVIL = {
  "01-24": {
    en: "Union of the Romanian Principalities (civil)",
    es: "Unión de los Principados Rumanos (civil)",
    pt: "União dos Principados Romenos (civil)",
    civil: true,
  },
  "05-10": {
    en: "Romanian Independence / Monarchy Day (civil commemorations)",
    es: "Independencia / Día de la Monarquía de Rumania (civil)",
    pt: "Independência / Dia da Monarquia da Roménia (civil)",
    civil: true,
  },
  "08-15": {
    // Already Dormition — also Romanian Army Day historically; keep liturgical primacy
  },
  "11-30": {
    // St Andrew — patron of Romania; already major
  },
  "12-01": {
    // already in menaion
  },
};

function addDays(iso, n) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return dt.toISOString().slice(0, 10);
}

function weekday(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** Movable commemorations keyed by absolute date (Pascha 2026-04-12). */
function buildMovable() {
  const P = PASCHA;
  /** offset from Pascha */
  const entries = [
    [-70, "Sunday of the Publican and the Pharisee", "Domingo del Publicano y el Fariseo", "Domingo do Publicano e do Fariseu", "sunday", { major: true }],
    [-63, "Sunday of the Prodigal Son", "Domingo del Hijo Pródigo", "Domingo do Filho Pródigo", "sunday", { major: true }],
    [-56, "Sunday of the Last Judgment (Meatfare)", "Domingo del Juicio Final (Carnaval)", "Domingo do Juízo Final (Carnaval)", "sunday", { major: true }],
    [-49, "Forgiveness Sunday (Cheesefare)", "Domingo del Perdón (Quesofare)", "Domingo do Perdão (Queijofare)", "sunday", { major: true }],
    [-48, "Clean Monday — beginning of Great Lent", "Lunes limpio — comienzo de la Gran Cuaresma", "Segunda-feira limpa — início da Grande Quaresma", "black", { major: true, fasting: "strict" }],
    [-43, "Saturday of St Theodore (first Saturday of Lent)", "Sábado de San Teodoro (primer sábado de Cuaresma)", "Sábado de São Teodoro (primeiro sábado da Quaresma)", "blue", { major: true }],
    [-42, "First Sunday of Great Lent — Triumph of Orthodoxy", "Primer domingo de Gran Cuaresma — Triunfo de la Ortodoxia", "Primeiro domingo da Grande Quaresma — Triunfo da Ortodoxia", "sunday", { major: true }],
    [-35, "Second Sunday of Great Lent — St Gregory Palamas", "Segundo domingo de Gran Cuaresma — San Gregorio Palamás", "Segundo domingo da Grande Quaresma — São Gregório Palamás", "sunday", { major: true }],
    [-28, "Third Sunday of Great Lent — Veneration of the Cross", "Tercer domingo de Gran Cuaresma — Veneración de la Cruz", "Terceiro domingo da Grande Quaresma — Veneração da Cruz", "sunday", { major: true }],
    [-21, "Fourth Sunday of Great Lent — St John Climacus", "Cuarto domingo de Gran Cuaresma — San Juan Clímaco", "Quarto domingo da Grande Quaresma — São João Clímaco", "sunday", { major: true }],
    [-14, "Fifth Sunday of Great Lent — St Mary of Egypt", "Quinto domingo de Gran Cuaresma — Santa María de Egipto", "Quinto domingo da Grande Quaresma — Santa Maria do Egito", "sunday", { major: true }],
    [-8, "Lazarus Saturday", "Sábado de Lázaro", "Sábado de Lázaro", "red", { major: true, fasting: "wine_oil" }],
    [-7, "Palm Sunday — Entrance of the Lord into Jerusalem", "Domingo de Ramos — Entrada del Señor en Jerusalén", "Domingo de Ramos — Entrada do Senhor em Jerusalém", "red", { major: true, fasting: "fish" }],
    [-6, "Holy and Great Monday", "Santo y Gran Lunes", "Santa e Grande Segunda-feira", "red", { major: true, fasting: "strict" }],
    [-5, "Holy and Great Tuesday", "Santo y Gran Martes", "Santa e Grande Terça-feira", "red", { major: true, fasting: "strict" }],
    [-4, "Holy and Great Wednesday", "Santo y Gran Miércoles", "Santa e Grande Quarta-feira", "red", { major: true, fasting: "strict" }],
    [-3, "Holy and Great Thursday", "Santo y Gran Jueves", "Santa e Grande Quinta-feira", "red", { major: true, fasting: "wine_oil" }],
    [-2, "Holy and Great Friday", "Santo y Gran Viernes", "Santa e Grande Sexta-feira", "red", { major: true, fasting: "strict" }],
    [-1, "Holy and Great Saturday", "Santo y Gran Sábado", "Sábado Santo e Grande", "red", { major: true, fasting: "wine_oil" }],
    [0, "Holy and Great Pascha — Resurrection of Christ", "Santa y Gran Pascua — Resurrección de Cristo", "Santa e Grande Páscoa — Ressurreição de Cristo", "red", { major: true, fasting: "none" }],
    [1, "Bright Monday", "Lunes luminoso", "Segunda-feira luminosa", "red", { major: true, fasting: "none" }],
    [2, "Bright Tuesday", "Martes luminoso", "Terça-feira luminosa", "red", { major: true, fasting: "none" }],
    [3, "Bright Wednesday", "Miércoles luminoso", "Quarta-feira luminosa", "red", { major: true, fasting: "none" }],
    [4, "Bright Thursday", "Jueves luminoso", "Quinta-feira luminosa", "red", { major: true, fasting: "none" }],
    [5, "Bright Friday — Life-Giving Spring", "Viernes luminoso — Fuente vivificante", "Sexta-feira luminosa — Fonte vivificante", "red", { major: true, fasting: "none" }],
    [6, "Bright Saturday", "Sábado luminoso", "Sábado luminoso", "red", { major: true, fasting: "none" }],
    [7, "Thomas Sunday (Antipascha)", "Domingo de Tomás (Antipascha)", "Domingo de Tomé (Antipáscoa)", "sunday", { major: true }],
    [14, "Sunday of the Myrrh-Bearing Women", "Domingo de las Miróforas", "Domingo das Miróforas", "sunday", { major: true }],
    [21, "Sunday of the Paralytic", "Domingo del Paralítico", "Domingo do Paralítico", "sunday", { major: true }],
    [24, "Mid-Pentecost", "Mitad de Pentecostés", "Meio do Pentecostes", "blue", { major: true }],
    [28, "Sunday of the Samaritan Woman", "Domingo de la Samaritana", "Domingo da Samaritana", "sunday", { major: true }],
    [35, "Sunday of the Blind Man", "Domingo del Ciego de nacimiento", "Domingo do Cego de nascença", "sunday", { major: true }],
    [39, "Ascension of the Lord", "Ascensión del Señor", "Ascensão do Senhor", "red", { major: true }],
    [42, "Sunday of the Holy Fathers of the First Ecumenical Council", "Domingo de los Santos Padres del I Concilio Ecuménico", "Domingo dos Santos Padres do I Concílio Ecuménico", "sunday", { major: true }],
    [48, "Saturday of Souls before Pentecost", "Sábado de las Almas antes de Pentecostés", "Sábado das Almas antes do Pentecostes", "blue", { major: true }],
    [49, "Holy Pentecost", "Santo Pentecostés", "Santo Pentecostes", "red", { major: true }],
    [50, "Monday of the Holy Spirit", "Lunes del Espíritu Santo", "Segunda-feira do Espírito Santo", "red", { major: true }],
    [56, "Sunday of All Saints", "Domingo de Todos los Santos", "Domingo de Todos os Santos", "sunday", { major: true }],
  ];

  const map = new Map();
  for (const [off, en, es, pt, rank, opts] of entries) {
    map.set(addDays(P, off), { en, es, pt, rank, ...(opts || {}) });
  }
  return map;
}

function synaxarFor(title) {
  return {
    es: `Conmemoración: ${title.es}. Resumen del sinaxario pendiente (texto editorial provisional; no contenido con derechos de la Patriarhía Rumana).`,
    pt: `Comemoração: ${title.pt}. Resumo do sinaxário pendente (texto editorial provisório; não conteúdo com direitos do Patriarcado Romeno).`,
    en: `Commemoration: ${title.en}. Synaxar summary forthcoming (provisional editorial text; not copyrighted Romanian Patriarchate content).`,
  };
}

function readingsFor(rank) {
  if (rank === "red" || rank === "sunday") {
    return [
      {
        type: "epistle",
        citation: {
          es: "Citación del Apóstol (pendiente de edición bíblica licenciada)",
          pt: "Citação do Apóstolo (pendente de edição bíblica licenciada)",
          en: "Epistle citation (licensed Bible edition forthcoming)",
        },
      },
      {
        type: "gospel",
        citation: {
          es: "Citación del Evangelio (pendiente de edición bíblica licenciada)",
          pt: "Citação do Evangelho (pendente de edição bíblica licenciada)",
          en: "Gospel citation (licensed Bible edition forthcoming)",
        },
      },
    ];
  }
  return [
    {
      type: "gospel",
      citation: {
        es: "Citación del Evangelio (pendiente de edición bíblica licenciada)",
        pt: "Citação do Evangelho (pendente de edição bíblica licenciada)",
        en: "Gospel citation (licensed Bible edition forthcoming)",
      },
    },
  ];
}

function inRange(iso, a, b) {
  return iso >= a && iso <= b;
}

function baseFasting(iso) {
  // Corrected Great Lent 2026: Clean Monday Feb 23 → Holy Saturday Apr 11
  if (inRange(iso, "2026-04-12", "2026-04-18")) return "none";
  if (inRange(iso, "2026-02-23", "2026-04-11")) return "strict";
  // Apostles' Fast: day after All Saints (Jun 8) → Jun 28
  if (inRange(iso, "2026-06-08", "2026-06-28")) return "wine_oil";
  if (inRange(iso, "2026-08-01", "2026-08-14")) return "wine_oil";
  if (inRange(iso, "2026-11-15", "2026-12-24")) return "wine_oil";
  const wd = weekday(iso);
  if (wd === 3 || wd === 5) return "fast";
  return "none";
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function buildFixedIndex() {
  /** @type {Map<string, any>} */
  const map = new Map();
  for (const [month, days] of Object.entries(MENAION)) {
    for (const row of days) {
      const [d, en, es, pt, rank = "black", opts = {}] = row;
      const md = `${pad(Number(month))}-${pad(d)}`;
      map.set(md, {
        title: { en, es, pt },
        rank,
        major: !!opts.major,
        civilHoliday: !!opts.civil,
        roNational: !!opts.ro,
        fastingOverride: opts.fasting ?? null,
      });
    }
  }
  return map;
}

function mergeTitles(primary, secondary) {
  if (!secondary) return primary;
  // Avoid duplicating if secondary already contained
  if (primary.en.includes(secondary.en) || secondary.en.includes(primary.en.split(";")[0].trim())) {
    return {
      en: primary.en.includes(secondary.en) ? primary.en : `${primary.en}; ${secondary.en}`,
      es: primary.es.includes(secondary.es) ? primary.es : `${primary.es}; ${secondary.es}`,
      pt: primary.pt.includes(secondary.pt) ? primary.pt : `${primary.pt}; ${secondary.pt}`,
    };
  }
  return {
    en: `${primary.en}; ${secondary.en}`,
    es: `${primary.es}; ${secondary.es}`,
    pt: `${primary.pt}; ${secondary.pt}`,
  };
}

function buildYear() {
  const fixed = buildFixedIndex();
  const movable = buildMovable();
  const days = [];
  let curatedMajor = 0;
  let curatedNamed = 0;
  let movablePrimary = 0;

  for (let m = 1; m <= 12; m++) {
    const last = new Date(Date.UTC(YEAR, m, 0)).getUTCDate();
    for (let d = 1; d <= last; d++) {
      const iso = `${YEAR}-${pad(m)}-${pad(d)}`;
      const md = iso.slice(5);
      const fix = fixed.get(md);
      const mov = movable.get(iso);
      const civilExtra = RO_CIVIL[md];

      if (!fix) {
        throw new Error(`Missing fixed menaion for ${md}`);
      }

      let title = { ...fix.title };
      let rank = fix.rank;
      let major = fix.major;
      let civilHoliday = fix.civilHoliday;
      let roNational = fix.roNational;
      let fasting = fix.fastingOverride ?? baseFasting(iso);
      let titleSource = major ? "major" : "menaion";

      if (mov) {
        title = mergeTitles(
          { en: mov.en, es: mov.es, pt: mov.pt },
          fix.title
        );
        rank = mov.rank === "black" && fix.rank !== "black" ? fix.rank : mov.rank;
        if (mov.rank === "sunday" || mov.rank === "red") rank = mov.rank;
        // Prefer feast red over sunday when both (e.g. if needed)
        if (mov.major) major = true;
        if (mov.fasting) fasting = mov.fasting;
        titleSource = "movable+menaion";
        movablePrimary++;
      } else if (weekday(iso) === 0 && rank === "black") {
        rank = "sunday";
        title = {
          en: `Sunday — ${title.en}`,
          es: `Domingo — ${title.es}`,
          pt: `Domingo — ${title.pt}`,
        };
        titleSource = "sunday+menaion";
      }

      if (civilExtra && civilExtra.en) {
        title = mergeTitles(title, {
          en: civilExtra.en,
          es: civilExtra.es,
          pt: civilExtra.pt,
        });
        if (civilExtra.civil) civilHoliday = true;
      }

      if (major) curatedMajor++;
      else curatedNamed++;

      const synaxar = synaxarFor(title);
      const bright = inRange(iso, "2026-04-12", "2026-04-18");

      days.push({
        date: iso,
        title,
        subtitle: null,
        rank,
        fasting,
        civilHoliday,
        roNational,
        iconUrl: "/icons/placeholder-cross.svg",
        synaxar,
        readings: readingsFor(rank),
        weddingsAllowed: fasting === "none" && rank !== "red",
        memorialsAllowed: fasting !== "strict" && !bright,
        sourceRevision: "seed-2026-full-v1",
        meta: {
          titleSource,
          major,
          provisionalSynaxar: true,
          provisionalReadings: true,
        },
      });
    }
  }

  return {
    days,
    coverage: {
      year: YEAR,
      pascha: PASCHA,
      totalDays: days.length,
      curatedMajor,
      curatedNamedTitles: curatedNamed,
      movableOverlays: movablePrimary,
      provisionalSynaxarAll: days.length,
      provisionalReadingCitationsAll: days.length,
      note:
        "Every day has curated ES/PT/EN commemorations (menaion and/or movable). Synaxar and scripture citations are provisional stubs. Not scraped from Patriarhia.",
      knownGaps: [
        "Full licensed synaxar prose in ES/PT/EN",
        "Full lectionary text (Bible editions TBD)",
        "Day icons (placeholder only)",
        "Complete BOR-only local saint ranking parity pending editorial QA against Patriarhia checklist",
        "Some lesser menaion companions may differ in order/emphasis from a given year's Patriarhia CPT entry",
        "Wedding/memorial flags are heuristic from fasting/rank, not yet verified against BOR tables for every day",
      ],
      regenerate: "node scripts/generate-seed.mjs",
    },
  };
}

const { days, coverage } = buildYear();
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ year: YEAR, pascha: PASCHA, days }, null, 0));
writeFileSync(REPORT, JSON.stringify(coverage, null, 2));
console.log(JSON.stringify(coverage, null, 2));
console.log(`Wrote ${OUT} (${days.length} days)`);
