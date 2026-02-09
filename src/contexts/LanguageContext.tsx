import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "es" | "en" | "it" | "zh";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  es: {
    // Navbar
    "nav.home": "Inicio",
    "nav.accommodation": "Alojamiento",
    "nav.things_to_do": "Cosas que hacer",
    "nav.schedule": "Horarios",
    
    // Index page
    "index.welcome": "¡Bienvenidos a nuestra boda!",
    "index.date": "14 de Noviembre de 2026",
    "index.location": "Aldea Tejera Negra, Campillo de Ranas, Guadalajara",
    "index.countdown.months": "Meses",
    "index.countdown.days": "Días",
    "index.countdown.hours": "Horas",
    "index.countdown.minutes": "Minutos",
    "index.rsvp.title": "¿Vienes a nuestra boda?",
    "index.rsvp.description": "Por favor, confirma tu asistencia rellenando el siguiente formulario. ¡Nos encantará compartir ese día contigo!",
    "index.rsvp.button": "Confirmar asistencia",
    "index.rsvp.confirmed": "¡Gracias por confirmar tu asistencia!",
    "index.rsvp.edit": "Editar respuesta",
    
    // Alojamiento page
    "accommodation.title": "Alojamientos Disponibles",
    "accommodation.subtitle": "Disponemos de varios alojamientos en la zona de los Pueblos Negros de Guadalajara. Aquí puedes ver las opciones disponibles.",
    "accommodation.included.title": "Alojamientos Incluidos en Nuestro Paquete",
    "accommodation.included.description": "Estos alojamientos están incluidos y no tienen coste adicional para nuestros invitados.",
    "accommodation.others.title": "Otros Alojamientos Disponibles en la Zona",
    
    // CosasQueHacer page
    "things.title": "Qué Hacer en la Zona",
    "things.subtitle": "Los Pueblos Negros de Guadalajara ofrecen naturaleza, cultura e historia. Aquí tienes algunas sugerencias para disfrutar de tu estancia.",
    "things.villages.title": "Pueblos Recomendados para Visitar",
    "things.tips.title": "💡 Consejos Útiles",
    
    // Activities
    "things.hayedo.title": "Hayedo de Tejera Negra",
    "things.hayedo.description": "Parque Natural declarado Patrimonio de la Humanidad por la UNESCO. Disfruta de sus rutas de senderismo entre hayas centenarias, especialmente espectaculares en otoño.",
    "things.hayedo.distance": "A 5 km",
    "things.pueblos.title": "Pueblos Negros",
    "things.pueblos.description": "Recorre los encantadores pueblos de arquitectura negra: Campillo de Ranas, Majaelrayo, Valverde de los Arroyos, Robleluengo. Casas construidas con pizarra que les dan ese color oscuro característico.",
    "things.pueblos.distance": "En la zona",
    "things.iglesias.title": "Iglesias y Ermitas",
    "things.iglesias.description": "Visita las iglesias románicas y ermitas con encanto de la zona. Destacan la iglesia de Campillo de Ranas y la ermita de la Virgen de la Soledad.",
    "things.iglesias.distance": "En el pueblo",
    "things.senderismo.title": "Rutas de Senderismo",
    "things.senderismo.description": "Múltiples rutas señalizadas por el valle del río Sorbe, cascadas, miradores naturales y paisajes de montaña. Desde rutas sencillas hasta más exigentes.",
    "things.senderismo.distance": "Diversas distancias",
    "things.miradores.title": "Miradores Naturales",
    "things.miradores.description": "Disfruta de impresionantes vistas panorámicas desde los diversos miradores de la zona. Perfectos para fotografía de paisajes y naturaleza.",
    "things.miradores.distance": "Por toda la zona",
    "things.gastronomia.title": "Gastronomía Local",
    "things.gastronomia.description": "Degusta la cocina tradicional serrana: cabrito asado, judías del Barco, trucha del río, setas de temporada y miel de la zona. Varios restaurantes en los pueblos cercanos.",
    "things.gastronomia.distance": "En los pueblos",
    
    // Villages
    "things.village.valverde": "Uno de los pueblos más bonitos de la arquitectura negra",
    "things.village.majaelrayo": "Pueblo con encanto, ideal para pasear por sus calles empedradas",
    "things.village.campillo": "Pueblo base, punto de partida para muchas rutas",
    "things.village.robleluengo": "Pequeño pueblo tranquilo con vistas impresionantes",
    "things.village.tamajon": "Pueblo más grande con servicios y restaurantes",
    
    // Tips
    "things.tip1": "Lleva calzado cómodo para caminar por las calles empedradas y rutas de montaña",
    "things.tip2": "La zona es ideal para desconectar; la cobertura móvil puede ser limitada en algunos puntos",
    "things.tip3": "En otoño (octubre-noviembre) el hayedo está en su máximo esplendor con colores espectaculares",
    "things.tip4": "Reserva con antelación en restaurantes, especialmente los fines de semana",
    
    // Schedule page
    "schedule.title": "Horarios del Evento",
    "schedule.subtitle": "14 de noviembre de 2026 — Así será el día de nuestra boda",
    "schedule.ceremony.title": "Ceremonia",
    "schedule.ceremony.time": "13:00h",
    "schedule.ceremony.description": "Ceremonia nupcial. ¡El momento más especial del día!",
    "schedule.cocktail.title": "Cóctel de Bienvenida",
    "schedule.cocktail.time": "14:00h",
    "schedule.cocktail.description": "Recepción con cóctel de bienvenida para todos los invitados.",
    "schedule.banquet.title": "Banquete",
    "schedule.banquet.time": "15:00h",
    "schedule.banquet.description": "Comienza el banquete nupcial. ¡A disfrutar de la comida!",
    "schedule.openbar.title": "Barra Libre",
    "schedule.openbar.time": "~17:15h (3 horas)",
    "schedule.openbar.description": "Comienza la barra libre con música y fiesta. ¡Durará aproximadamente 3 horas!",
    "schedule.latesupper.title": "Recena",
    "schedule.latesupper.time": "Después de la barra libre",
    "schedule.latesupper.description": "Para reponer fuerzas después de la fiesta, habrá una recena para los que sigan en pie.",
    
    // Form
    "form.title": "Confirma tu asistencia",
    "form.name": "Nombre completo",
    "form.name.placeholder": "Ej: Ana García",
    "form.plusone": "¿Llevo acompañante? (+1)",
    "form.menu": "Menú preferido",
    "form.color": "Color preferido",
    "form.color.companion": "Color del acompañante",
    "form.song": "¿Qué canción no puede faltar en la fiesta?",
    "form.song.placeholder": "Ej: La Macarena, We Found Love, Toxicity...",
    "form.comments": "Comentarios/adicionales",
    "form.comments.placeholder": "¿Alguna alergia, petición o mensaje para los novios?",
    "form.children": "¿Vienes con niños?",
    "form.children.hint": "Si es así, indícalo en los comentarios y si necesitan alguna comida especial.",
    "form.overnight": "¿Te quedas a pernoctar el sábado noche?",
    "form.consent": "Doy mi consentimiento para aparecer en fotos y vídeos públicos de la boda (en redes, web, etc).",
    "form.submit": "Enviar confirmación",
    "form.error.name": "Por favor, introduce tu nombre.",
    "form.error.companion": "Por favor, introduce el nombre de tu acompañante.",
    "form.error.consent": "Debes aceptar el consentimiento para salir en fotos/vídeos.",
    "form.error.submit": "Ocurrió un error al registrar tu invitación. Por favor intenta de nuevo.",
    "form.success": "¡Registro enviado! Gracias por confirmar tu asistencia.",
  },
  en: {
    // Navbar
    "nav.home": "Home",
    "nav.accommodation": "Accommodation",
    "nav.things_to_do": "Things to Do",
    "nav.schedule": "Schedule",
    
    // Index page
    "index.welcome": "Welcome to our wedding!",
    "index.date": "November 14th, 2026",
    "index.location": "Aldea Tejera Negra, Campillo de Ranas, Guadalajara",
    "index.countdown.months": "Months",
    "index.countdown.days": "Days",
    "index.countdown.hours": "Hours",
    "index.countdown.minutes": "Minutes",
    "index.rsvp.title": "Are you coming to our wedding?",
    "index.rsvp.description": "Please confirm your attendance by filling out the form below. We would love to share that day with you!",
    "index.rsvp.button": "Confirm attendance",
    "index.rsvp.confirmed": "Thank you for confirming your attendance!",
    "index.rsvp.edit": "Edit response",
    
    // Alojamiento page
    "accommodation.title": "Available Accommodations",
    "accommodation.subtitle": "We have several accommodations in the Black Villages area of Guadalajara. Here you can see the available options.",
    "accommodation.included.title": "Accommodations Included in Our Package",
    "accommodation.included.description": "These accommodations are included at no additional cost for our guests.",
    "accommodation.others.title": "Other Available Accommodations in the Area",
    
    // CosasQueHacer page
    "things.title": "What to Do in the Area",
    "things.subtitle": "The Black Villages of Guadalajara offer nature, culture and history. Here are some suggestions to enjoy your stay.",
    "things.villages.title": "Recommended Villages to Visit",
    "things.tips.title": "💡 Useful Tips",
    
    // Activities
    "things.hayedo.title": "Tejera Negra Beech Forest",
    "things.hayedo.description": "Natural Park declared a UNESCO World Heritage Site. Enjoy its hiking trails among centuries-old beech trees, especially spectacular in autumn.",
    "things.hayedo.distance": "5 km away",
    "things.pueblos.title": "Black Villages",
    "things.pueblos.description": "Explore the charming villages of black architecture: Campillo de Ranas, Majaelrayo, Valverde de los Arroyos, Robleluengo. Houses built with slate that give them their characteristic dark color.",
    "things.pueblos.distance": "In the area",
    "things.iglesias.title": "Churches and Chapels",
    "things.iglesias.description": "Visit the Romanesque churches and charming hermitages in the area. The church of Campillo de Ranas and the hermitage of Virgen de la Soledad stand out.",
    "things.iglesias.distance": "In the village",
    "things.senderismo.title": "Hiking Trails",
    "things.senderismo.description": "Multiple marked trails through the Sorbe river valley, waterfalls, natural viewpoints and mountain landscapes. From easy to challenging routes.",
    "things.senderismo.distance": "Various distances",
    "things.miradores.title": "Natural Viewpoints",
    "things.miradores.description": "Enjoy stunning panoramic views from the various viewpoints in the area. Perfect for landscape and nature photography.",
    "things.miradores.distance": "Throughout the area",
    "things.gastronomia.title": "Local Cuisine",
    "things.gastronomia.description": "Taste traditional mountain cuisine: roasted kid, Barco beans, river trout, seasonal mushrooms and local honey. Several restaurants in nearby villages.",
    "things.gastronomia.distance": "In the villages",
    
    // Villages
    "things.village.valverde": "One of the most beautiful villages of black architecture",
    "things.village.majaelrayo": "Charming village, ideal for strolling through its cobbled streets",
    "things.village.campillo": "Base village, starting point for many routes",
    "things.village.robleluengo": "Small quiet village with impressive views",
    "things.village.tamajon": "Larger village with services and restaurants",
    
    // Tips
    "things.tip1": "Wear comfortable shoes for walking on cobbled streets and mountain trails",
    "things.tip2": "The area is ideal for disconnecting; mobile coverage may be limited in some areas",
    "things.tip3": "In autumn (October-November) the beech forest is at its peak with spectacular colors",
    "things.tip4": "Book restaurants in advance, especially on weekends",
    
    // Schedule page
    "schedule.title": "Event Schedule",
    "schedule.subtitle": "November 14th, 2026 — Here's how our wedding day will unfold",
    "schedule.ceremony.title": "Ceremony",
    "schedule.ceremony.time": "1:00 PM",
    "schedule.ceremony.description": "Wedding ceremony. The most special moment of the day!",
    "schedule.cocktail.title": "Welcome Cocktail",
    "schedule.cocktail.time": "2:00 PM",
    "schedule.cocktail.description": "Welcome cocktail reception for all guests.",
    "schedule.banquet.title": "Banquet",
    "schedule.banquet.time": "3:00 PM",
    "schedule.banquet.description": "The wedding banquet begins. Enjoy the feast!",
    "schedule.openbar.title": "Open Bar",
    "schedule.openbar.time": "~5:15 PM (3 hours)",
    "schedule.openbar.description": "The open bar kicks off with music and partying. It will last approximately 3 hours!",
    "schedule.latesupper.title": "Late Supper",
    "schedule.latesupper.time": "After the open bar",
    "schedule.latesupper.description": "To recharge after the party, there will be a late supper for those still standing.",
    
    // Form
    "form.title": "Confirm Your Attendance",
    "form.name": "Full Name",
    "form.name.placeholder": "E.g.: Ana García",
    "form.plusone": "Am I bringing a guest? (+1)",
    "form.menu": "Preferred Menu",
    "form.color": "Preferred Color",
    "form.color.companion": "Companion's Color",
    "form.song": "What song can't be missing from the party?",
    "form.song.placeholder": "E.g.: La Macarena, We Found Love, Toxicity...",
    "form.comments": "Comments/Additional Info",
    "form.comments.placeholder": "Any allergies, requests, or message for the bride and groom?",
    "form.children": "Are you coming with children?",
    "form.children.hint": "If so, please indicate in the comments and if they need any special food.",
    "form.overnight": "Are you staying overnight on Saturday?",
    "form.consent": "I consent to appear in public photos and videos of the wedding (on social media, website, etc.).",
    "form.submit": "Send Confirmation",
    "form.error.name": "Please enter your name.",
    "form.error.companion": "Please enter your companion's name.",
    "form.error.consent": "You must accept the consent to appear in photos/videos.",
    "form.error.submit": "An error occurred while registering your invitation. Please try again.",
    "form.success": "Registration sent! Thank you for confirming your attendance.",
  },
  it: {
    // Navbar
    "nav.home": "Home",
    "nav.accommodation": "Alloggio",
    "nav.things_to_do": "Cosa Fare",
    "nav.schedule": "Orari",
    
    // Index page
    "index.welcome": "Benvenuti al nostro matrimonio!",
    "index.date": "14 Novembre 2026",
    "index.location": "Aldea Tejera Negra, Campillo de Ranas, Guadalajara",
    "index.countdown.months": "Mesi",
    "index.countdown.days": "Giorni",
    "index.countdown.hours": "Ore",
    "index.countdown.minutes": "Minuti",
    "index.rsvp.title": "Vieni al nostro matrimonio?",
    "index.rsvp.description": "Per favore conferma la tua partecipazione compilando il modulo qui sotto. Ci piacerebbe condividere quel giorno con te!",
    "index.rsvp.button": "Conferma partecipazione",
    "index.rsvp.confirmed": "Grazie per aver confermato la tua partecipazione!",
    "index.rsvp.edit": "Modifica risposta",
    
    // Alojamiento page
    "accommodation.title": "Alloggi Disponibili",
    "accommodation.subtitle": "Abbiamo diversi alloggi nella zona dei Villaggi Neri di Guadalajara. Qui puoi vedere le opzioni disponibili.",
    "accommodation.included.title": "Alloggi Inclusi nel Nostro Pacchetto",
    "accommodation.included.description": "Questi alloggi sono inclusi senza costi aggiuntivi per i nostri ospiti.",
    "accommodation.others.title": "Altri Alloggi Disponibili nella Zona",
    
    // CosasQueHacer page
    "things.title": "Cosa Fare nella Zona",
    "things.subtitle": "I Villaggi Neri di Guadalajara offrono natura, cultura e storia. Ecco alcuni suggerimenti per goderti il tuo soggiorno.",
    "things.villages.title": "Villaggi Consigliati da Visitare",
    "things.tips.title": "💡 Consigli Utili",
    
    // Activities
    "things.hayedo.title": "Faggeta di Tejera Negra",
    "things.hayedo.description": "Parco Naturale dichiarato Patrimonio dell'Umanità dall'UNESCO. Goditi i suoi sentieri escursionistici tra faggi centenari, particolarmente spettacolari in autunno.",
    "things.hayedo.distance": "A 5 km",
    "things.pueblos.title": "Villaggi Neri",
    "things.pueblos.description": "Esplora gli incantevoli villaggi dell'architettura nera: Campillo de Ranas, Majaelrayo, Valverde de los Arroyos, Robleluengo. Case costruite con ardesia che conferiscono loro il caratteristico colore scuro.",
    "things.pueblos.distance": "Nella zona",
    "things.iglesias.title": "Chiese ed Eremi",
    "things.iglesias.description": "Visita le chiese romaniche e gli affascinanti eremi della zona. Spiccano la chiesa di Campillo de Ranas e l'eremo della Virgen de la Soledad.",
    "things.iglesias.distance": "Nel villaggio",
    "things.senderismo.title": "Sentieri Escursionistici",
    "things.senderismo.description": "Numerosi sentieri segnalati attraverso la valle del fiume Sorbe, cascate, belvedere naturali e paesaggi montani. Da percorsi facili a più impegnativi.",
    "things.senderismo.distance": "Varie distanze",
    "things.miradores.title": "Belvedere Naturali",
    "things.miradores.description": "Goditi splendide viste panoramiche dai vari belvedere della zona. Perfetti per la fotografia di paesaggi e natura.",
    "things.miradores.distance": "In tutta la zona",
    "things.gastronomia.title": "Cucina Locale",
    "things.gastronomia.description": "Assaggia la cucina tradizionale di montagna: capretto arrosto, fagioli del Barco, trota di fiume, funghi di stagione e miele locale. Diversi ristoranti nei villaggi vicini.",
    "things.gastronomia.distance": "Nei villaggi",
    
    // Villages
    "things.village.valverde": "Uno dei villaggi più belli dell'architettura nera",
    "things.village.majaelrayo": "Villaggio affascinante, ideale per passeggiare tra le sue strade acciottolate",
    "things.village.campillo": "Villaggio base, punto di partenza per molti percorsi",
    "things.village.robleluengo": "Piccolo villaggio tranquillo con viste impressionanti",
    "things.village.tamajon": "Villaggio più grande con servizi e ristoranti",
    
    // Tips
    "things.tip1": "Indossa scarpe comode per camminare su strade acciottolate e sentieri di montagna",
    "things.tip2": "La zona è ideale per staccare la spina; la copertura mobile può essere limitata in alcuni punti",
    "things.tip3": "In autunno (ottobre-novembre) la faggeta è al suo massimo splendore con colori spettacolari",
    "things.tip4": "Prenota i ristoranti in anticipo, soprattutto nei fine settimana",
    
    // Schedule page
    "schedule.title": "Programma dell'Evento",
    "schedule.subtitle": "14 novembre 2026 — Ecco come si svolgerà il giorno del nostro matrimonio",
    "schedule.ceremony.title": "Cerimonia",
    "schedule.ceremony.time": "13:00",
    "schedule.ceremony.description": "Cerimonia nuziale. Il momento più speciale della giornata!",
    "schedule.cocktail.title": "Cocktail di Benvenuto",
    "schedule.cocktail.time": "14:00",
    "schedule.cocktail.description": "Ricevimento con cocktail di benvenuto per tutti gli ospiti.",
    "schedule.banquet.title": "Banchetto",
    "schedule.banquet.time": "15:00",
    "schedule.banquet.description": "Inizia il banchetto nuziale. Buon appetito!",
    "schedule.openbar.title": "Open Bar",
    "schedule.openbar.time": "~17:15 (3 ore)",
    "schedule.openbar.description": "Inizia l'open bar con musica e festa. Durerà circa 3 ore!",
    "schedule.latesupper.title": "Cena Tardiva",
    "schedule.latesupper.time": "Dopo l'open bar",
    "schedule.latesupper.description": "Per ricaricare le energie dopo la festa, ci sarà una cena tardiva per chi è ancora in piedi.",
    
    // Form
    "form.title": "Conferma la Tua Partecipazione",
    "form.name": "Nome Completo",
    "form.name.placeholder": "Es: Ana García",
    "form.plusone": "Porto un accompagnatore? (+1)",
    "form.menu": "Menu Preferito",
    "form.color": "Colore Preferito",
    "form.color.companion": "Colore dell'Accompagnatore",
    "form.song": "Quale canzone non può mancare alla festa?",
    "form.song.placeholder": "Es: La Macarena, We Found Love, Toxicity...",
    "form.comments": "Commenti/Informazioni Aggiuntive",
    "form.comments.placeholder": "Allergie, richieste o messaggi per gli sposi?",
    "form.children": "Vieni con bambini?",
    "form.children.hint": "Se sì, indicalo nei commenti e se hanno bisogno di cibo speciale.",
    "form.overnight": "Resti a dormire sabato notte?",
    "form.consent": "Acconsento ad apparire in foto e video pubblici del matrimonio (sui social, sito web, ecc.).",
    "form.submit": "Invia Conferma",
    "form.error.name": "Inserisci il tuo nome.",
    "form.error.companion": "Inserisci il nome del tuo accompagnatore.",
    "form.error.consent": "Devi accettare il consenso per apparire in foto/video.",
    "form.error.submit": "Si è verificato un errore durante la registrazione dell'invito. Riprova.",
    "form.success": "Registrazione inviata! Grazie per aver confermato la tua partecipazione.",
  },
  zh: {
    // Navbar
    "nav.home": "首页",
    "nav.accommodation": "住宿",
    "nav.things_to_do": "周边活动",
    "nav.schedule": "时间表",
    
    // Index page
    "index.welcome": "欢迎参加我们的婚礼！",
    "index.date": "2026年11月14日",
    "index.location": "Aldea Tejera Negra, Campillo de Ranas, Guadalajara",
    "index.countdown.months": "月",
    "index.countdown.days": "天",
    "index.countdown.hours": "小时",
    "index.countdown.minutes": "分钟",
    "index.rsvp.title": "你会来参加我们的婚礼吗？",
    "index.rsvp.description": "请填写下面的表格确认您的出席。我们很期待与您共度这一天！",
    "index.rsvp.button": "确认出席",
    "index.rsvp.confirmed": "感谢您确认出席！",
    "index.rsvp.edit": "修改回复",
    
    // Alojamiento page
    "accommodation.title": "可用住宿",
    "accommodation.subtitle": "我们在瓜达拉哈拉黑村地区有多处住宿可供选择。您可以在这里查看可用选项。",
    "accommodation.included.title": "我们套餐中包含的住宿",
    "accommodation.included.description": "这些住宿已包含在内，宾客无需额外付费。",
    "accommodation.others.title": "该地区其他可用住宿",
    
    // CosasQueHacer page
    "things.title": "周边活动",
    "things.subtitle": "瓜达拉哈拉的黑村提供自然、文化和历史体验。以下是一些享受您住宿的建议。",
    "things.villages.title": "推荐参观的村庄",
    "things.tips.title": "💡 实用建议",
    
    // Activities
    "things.hayedo.title": "Tejera Negra 山毛榉林",
    "things.hayedo.description": "被联合国教科文组织列为世界遗产的自然公园。在百年山毛榉间享受徒步旅行，秋季尤为壮观。",
    "things.hayedo.distance": "5公里",
    "things.pueblos.title": "黑村",
    "things.pueblos.description": "探索迷人的黑色建筑村庄：Campillo de Ranas、Majaelrayo、Valverde de los Arroyos、Robleluengo。用板岩建造的房屋赋予它们独特的深色外观。",
    "things.pueblos.distance": "在该地区",
    "things.iglesias.title": "教堂和礼拜堂",
    "things.iglesias.description": "参观该地区的罗马式教堂和迷人的小教堂。Campillo de Ranas教堂和Virgen de la Soledad小教堂尤为突出。",
    "things.iglesias.distance": "在村庄内",
    "things.senderismo.title": "徒步路线",
    "things.senderismo.description": "Sorbe河谷、瀑布、自然观景台和山地景观中有多条标记路线。从简单到具有挑战性的路线都有。",
    "things.senderismo.distance": "各种距离",
    "things.miradores.title": "自然观景台",
    "things.miradores.description": "从该地区各个观景台欣赏令人惊叹的全景。非常适合风景和自然摄影。",
    "things.miradores.distance": "遍布全区",
    "things.gastronomia.title": "当地美食",
    "things.gastronomia.description": "品尝传统山区美食：烤山羊肉、Barco豆、河鳟鱼、时令蘑菇和当地蜂蜜。附近村庄有多家餐厅。",
    "things.gastronomia.distance": "在各村庄",
    
    // Villages
    "things.village.valverde": "最美丽的黑色建筑村庄之一",
    "things.village.majaelrayo": "迷人的村庄，非常适合在鹅卵石街道漫步",
    "things.village.campillo": "基地村庄，许多路线的起点",
    "things.village.robleluengo": "安静的小村庄，景色令人印象深刻",
    "things.village.tamajon": "较大的村庄，有服务设施和餐厅",
    
    // Tips
    "things.tip1": "穿舒适的鞋子，方便在鹅卵石街道和山间小道行走",
    "things.tip2": "该地区非常适合放松身心；某些地区的手机信号可能有限",
    "things.tip3": "秋季（10月-11月）山毛榉林色彩最为壮观",
    "things.tip4": "提前预订餐厅，尤其是周末",
    
    // Schedule page
    "schedule.title": "活动时间表",
    "schedule.subtitle": "2026年11月14日——我们婚礼当天的安排",
    "schedule.ceremony.title": "婚礼仪式",
    "schedule.ceremony.time": "13:00",
    "schedule.ceremony.description": "婚礼仪式。一天中最特别的时刻！",
    "schedule.cocktail.title": "欢迎鸡尾酒会",
    "schedule.cocktail.time": "14:00",
    "schedule.cocktail.description": "为所有宾客举办的欢迎鸡尾酒会。",
    "schedule.banquet.title": "宴会",
    "schedule.banquet.time": "15:00",
    "schedule.banquet.description": "婚宴开始，尽情享用美食！",
    "schedule.openbar.title": "畅饮时间",
    "schedule.openbar.time": "约17:15（3小时）",
    "schedule.openbar.description": "畅饮时间开始，伴随音乐和派对。将持续约3小时！",
    "schedule.latesupper.title": "夜宵",
    "schedule.latesupper.time": "畅饮时间之后",
    "schedule.latesupper.description": "派对结束后，为仍在场的宾客提供夜宵补充体力。",
    
    // Form
    "form.title": "确认您的出席",
    "form.name": "全名",
    "form.name.placeholder": "例如：Ana García",
    "form.plusone": "我要带同伴吗？(+1)",
    "form.menu": "首选菜单",
    "form.color": "首选颜色",
    "form.color.companion": "同伴的颜色",
    "form.song": "派对上不能缺少什么歌曲？",
    "form.song.placeholder": "例如：La Macarena, We Found Love, Toxicity...",
    "form.comments": "评论/附加信息",
    "form.comments.placeholder": "有过敏、要求或给新人的留言吗？",
    "form.children": "您带孩子来吗？",
    "form.children.hint": "如果是，请在评论中注明，并说明是否需要特殊饮食。",
    "form.overnight": "您周六晚上留宿吗？",
    "form.consent": "我同意出现在婚礼的公开照片和视频中（社交媒体、网站等）。",
    "form.submit": "发送确认",
    "form.error.name": "请输入您的姓名。",
    "form.error.companion": "请输入您同伴的姓名。",
    "form.error.consent": "您必须接受出现在照片/视频中的同意声明。",
    "form.error.submit": "注册邀请时发生错误。请重试。",
    "form.success": "注册已发送！感谢您确认出席。",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("es");

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
