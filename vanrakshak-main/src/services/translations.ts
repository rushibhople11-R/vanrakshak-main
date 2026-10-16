import { SupportedLanguage } from './aiVoiceAssistant';

export interface Translations {
  // Brand & General
  brandTitle: string;
  brandSubtitle: string;
  wpcTag: string;
  prototypeBanner: string;
  startDashboard: string;
  selectLanguage: string;
  selectLanguageDesc: string;
  aiVoiceAssistant: string;
  aiVoiceSpeaking: string;
  continueInLanguage: string;
  switchLanguage: string;
  voiceReplay: string;
  voiceStop: string;

  // Navigation Items
  navCoreMonitoring: string;
  navOverview: string;
  navLiveAlerts: string;
  navThreatRadar: string;
  navFieldOperations: string;
  navPatrols: string;
  navProfile: string;
  navEdgeAiAcoustics: string;
  navSoundAnalysis: string;
  navSoundStudio: string;
  navMeshTelemetry: string;
  navNodes: string;
  navRfTelemetry: string;
  navSecurityImpact: string;
  navReports: string;
  navClimateImpact: string;
  navArchitecture: string;
  navProjectInfo: string;

  // Navbar
  loraGatewayActive: string;
  simulateAlert: string;
  searchPlaceholder: string;
  switchPersona: string;

  // Overview Page
  bannerTitle: string;
  bannerDesc: string;
  kpiActiveNodes: string;
  kpiActiveNodesSub: string;
  kpiAlertsToday: string;
  kpiAlertsTodaySub: string;
  kpiPendingReview: string;
  kpiPendingReviewSub: string;
  kpiGatewayStatus: string;
  kpiGatewayStatusSub: string;
  quickPatrols: string;
  quickPatrolsSub: string;
  quickThreatRadar: string;
  quickThreatRadarSub: string;
  quickSoundStudio: string;
  quickSoundStudioSub: string;
  quickDossiers: string;
  quickDossiersSub: string;
  recentAlertsQueue: string;
  recentAlertsQueueSub: string;
  viewAllAlerts: string;
  impactSummaryTitle: string;
  impactBox1Title: string;
  impactBox1Desc: string;
  impactBox2Title: string;
  impactBox2Desc: string;
  impactBox3Title: string;
  impactBox3Desc: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    // Brand & General
    brandTitle: 'VanRakshak',
    brandSubtitle: 'Acoustic Edge-AI Forest Protection',
    wpcTag: 'India WPC IN865 Telemetry',
    prototypeBanner: 'AI for Climate Change Hackathon Prototype',
    startDashboard: 'Start Dashboard',
    selectLanguage: 'Choose Your Language',
    selectLanguageDesc: 'Select your preferred language. Our VanRakshak AI voice assistant will guide you through the monitoring system.',
    aiVoiceAssistant: 'VanRakshak AI Voice Assistant',
    aiVoiceSpeaking: 'AI voice assistant is welcoming you...',
    continueInLanguage: 'Continue in English',
    switchLanguage: 'Language / भाषा',
    voiceReplay: 'Replay AI Voice',
    voiceStop: 'Stop Voice',

    // Navigation
    navCoreMonitoring: 'Core Monitoring',
    navOverview: 'Overview Dashboard',
    navLiveAlerts: 'Live Alerts Queue',
    navThreatRadar: 'Forest Threat Radar',
    navFieldOperations: 'Field Operations',
    navPatrols: 'Ranger Patrol Dispatch',
    navProfile: 'Ranger Profile & ID',
    navEdgeAiAcoustics: 'Edge-AI & Acoustics',
    navSoundAnalysis: 'Sound Analysis & TinyML',
    navSoundStudio: 'Acoustic Threat Studio',
    navMeshTelemetry: 'Mesh & Telemetry',
    navNodes: 'Sensor Nodes Fleet',
    navRfTelemetry: 'LoRa IN865 Diagnostics',
    navSecurityImpact: 'Security & Impact',
    navReports: 'Evidence Court Dossiers',
    navClimateImpact: 'Climate & Impact Metrics',
    navArchitecture: 'System Architecture',
    navProjectInfo: 'Project Information',

    // Navbar
    loraGatewayActive: 'LoRa Gateway Active',
    simulateAlert: 'Simulate Chainsaw Alert',
    searchPlaceholder: 'Search nodes, alerts, patrols... (Ctrl+K)',
    switchPersona: 'Switch Demo Persona',

    // Overview Page
    bannerTitle: 'Solar-Powered Acoustic Edge-AI for Forest Protection',
    bannerDesc: 'Autonomous ESP32-S3 sensor nodes classify soundscapes locally. Compact LoRa alert packets notify rangers within seconds without streaming continuous audio.',
    kpiActiveNodes: 'Active Edge Nodes',
    kpiActiveNodesSub: 'nodes currently solar-assisted',
    kpiAlertsToday: 'Alerts Detected Today',
    kpiAlertsTodaySub: 'Acoustic anomalies and possible chainsaw events',
    kpiPendingReview: 'Pending Ranger Review',
    kpiPendingReviewSub: 'Requires human verification decision',
    kpiGatewayStatus: 'LoRa Gateway Status',
    kpiGatewayStatusSub: 'Packet Delivery: 98.6% • Latency: 2.1s',
    quickPatrols: 'Ranger Patrols',
    quickPatrolsSub: 'Dispatch & Active ETA',
    quickThreatRadar: 'Threat Radar',
    quickThreatRadarSub: 'Spatial Risk Matrix',
    quickSoundStudio: 'Acoustic Studio',
    quickSoundStudioSub: 'Audio Synth & FFT',
    quickDossiers: 'Evidence Dossiers',
    quickDossiersSub: 'Legal Export / Hash',
    recentAlertsQueue: 'Incoming Acoustic Alerts Queue',
    recentAlertsQueueSub: 'AI alerts represent decision-support signals requiring human verification before field dispatch.',
    viewAllAlerts: 'View Full Alert Queue',
    impactSummaryTitle: 'Prototype Impact Pathway & Ecological Benefits',
    impactBox1Title: 'Faster Threat Response',
    impactBox1Desc: 'Edge classification detects chainsaw acoustics in under 2 seconds and transmits compact alert packets over LoRa, cutting alert latency by hours compared to manual trail patrols.',
    impactBox2Title: 'Zero High-Bandwidth Reliance',
    impactBox2Desc: 'Does not require 4G/5G cellular coverage or satellite data plans in dense deep forests. Only compact 20-30 byte event telemetry packets are transmitted over license-exempt sub-GHz RF.',
    impactBox3Title: 'Acoustic Privacy & Integrity',
    impactBox3Desc: 'Microphones process sound locally inside the ESP32-S3 SRAM. Raw audio streams are never stored or uploaded, strictly protecting forest visitor privacy and ranger communications.',
  },

  hi: {
    // Brand & General
    brandTitle: 'वनरक्षक',
    brandSubtitle: 'ध्वनिक एज-एआई वन सुरक्षा प्रणाली',
    wpcTag: 'भारतीय WPC IN865 टेलीमेट्री',
    prototypeBanner: 'जलवायु परिवर्तन एआई हैकाथॉन प्रोटोटाइप',
    startDashboard: 'डैशबोर्ड शुरू करें',
    selectLanguage: 'अपनी भाषा चुनें',
    selectLanguageDesc: 'अपनी पसंदीदा भाषा का चयन करें। वनरक्षक एआई वॉयस असिस्टेंट आपको सुरक्षा प्रणाली के माध्यम से मार्गदर्शन करेगा।',
    aiVoiceAssistant: 'वनरक्षक एआई वॉयस असिस्टेंट',
    aiVoiceSpeaking: 'एआई वॉयस असिस्टेंट आपका स्वागत कर रहा है...',
    continueInLanguage: 'हिंदी में जारी रखें',
    switchLanguage: 'भाषा / Language',
    voiceReplay: 'आवाज फिर से सुनें',
    voiceStop: 'आवाज़ रोकें',

    // Navigation
    navCoreMonitoring: 'मुख्य निगरानी',
    navOverview: 'अवलोकन डैशबोर्ड',
    navLiveAlerts: 'लाइव अलर्ट कतार',
    navThreatRadar: 'वन खतरा रडार',
    navFieldOperations: 'मैदानी अभियान',
    navPatrols: 'रेंजर गश्ती प्रेषण',
    navProfile: 'रेंजर प्रोफाइल एवं पहचान',
    navEdgeAiAcoustics: 'एज-एआई एवं ध्वनिकी',
    navSoundAnalysis: 'ध्वनि विश्लेषण एवं TinyML',
    navSoundStudio: 'ध्वनिक खतरा स्टूडियो',
    navMeshTelemetry: 'मेश एवं टेलीमेट्री',
    navNodes: 'सेंसर नोड्स फ्लीट',
    navRfTelemetry: 'LoRa IN865 निदान',
    navSecurityImpact: 'सुरक्षा एवं प्रभाव',
    navReports: 'अदालती साक्ष्य दस्तावेज',
    navClimateImpact: 'जलवायु एवं प्रभाव मेट्रिक्स',
    navArchitecture: 'सिस्टम आर्किटेक्चर',
    navProjectInfo: 'परियोजना जानकारी',

    // Navbar
    loraGatewayActive: 'LoRa गेटवे सक्रिय',
    simulateAlert: 'चेनसॉ अलर्ट सिमुलेशन',
    searchPlaceholder: 'नोड्स, अलर्ट, गश्ती खोजें... (Ctrl+K)',
    switchPersona: 'डेमो भूमिका बदलें',

    // Overview Page
    bannerTitle: 'वन सुरक्षा हेतु सौर-ऊर्जा संचालित ध्वनिक एज-एआई',
    bannerDesc: 'स्वायत्त ESP32-S3 सेंसर नोड्स ध्वनि का स्थानीय वर्गीकरण करते हैं। कॉम्पैक्ट LoRa अलर्ट पैकेट बिना निरंतर ऑडियो स्ट्रीमिंग के कुछ ही सेकंड में रेंजर्स को सूचित करते हैं।',
    kpiActiveNodes: 'सक्रिय एज नोड्स',
    kpiActiveNodesSub: 'नोड्स वर्तमान में सौर-संचालित हैं',
    kpiAlertsToday: 'आज पाए गए अलर्ट',
    kpiAlertsTodaySub: 'ध्वनिक विसंगतियाँ और संभावित चेनसॉ घटनाएँ',
    kpiPendingReview: 'समीक्षा हेतु लंबित',
    kpiPendingReviewSub: 'मानव सत्यापन निर्णय की आवश्यकता',
    kpiGatewayStatus: 'LoRa गेटवे स्थिति',
    kpiGatewayStatusSub: 'पैकेट वितरण: 98.6% • विलंबता: 2.1s',
    quickPatrols: 'रेंजर गश्ती',
    quickPatrolsSub: 'प्रेषण एवं सक्रिय ईटीए',
    quickThreatRadar: 'खतरा रडार',
    quickThreatRadarSub: 'स्थानिक जोखिम मैट्रिक्स',
    quickSoundStudio: 'ध्वनिक स्टूडियो',
    quickSoundStudioSub: 'ऑडियो सिंथ एवं FFT',
    quickDossiers: 'साक्ष्य दस्तावेज',
    quickDossiersSub: 'कानूनी निर्यात / हैश',
    recentAlertsQueue: 'आगमन ध्वनिक अलर्ट कतार',
    recentAlertsQueueSub: 'एआई अलर्ट निर्णय-सहायता संकेत हैं जिन्हें मैदानी प्रेषण से पहले मानव सत्यापन की आवश्यकता होती है।',
    viewAllAlerts: 'पूरी अलर्ट कतार देखें',
    impactSummaryTitle: 'प्रोटोटाइप प्रभाव मार्ग एवं पारिस्थितिक लाभ',
    impactBox1Title: 'तेज खतरा प्रतिक्रिया',
    impactBox1Desc: 'एज वर्गीकरण 2 सेकंड के भीतर चेनसॉ की ध्वनि पहचानता है और LoRa पर पैकेट भेजता है, जिससे अलर्ट समय घंटों से घटकर सेकंडों में आ जाता है।',
    impactBox2Title: 'शून्य हाई-बैंडविड्थ निर्भरता',
    impactBox2Desc: 'घने जंगलों में 4G/5G सेलुलर कवरेज या सैटेलाइट डेटा की आवश्यकता नहीं है। केवल कॉम्पैक्ट 20-30 बाइट्स टेलीमेट्री पैकेट भेजे जाते हैं।',
    impactBox3Title: 'ध्वनिक गोपनीयता एवं सुरक्षा',
    impactBox3Desc: 'माइक्रोफोन केवल ESP32-S3 SRAM के भीतर ध्वनि का विश्लेषण करते हैं। कच्चा ऑडियो कभी भी रिकॉर्ड या अपलोड नहीं किया जाता।',
  },

  mr: {
    // Brand & General
    brandTitle: 'वनरक्षक',
    brandSubtitle: 'ध्वनिक एज-एआय जंगल संरक्षण प्रणाली',
    wpcTag: 'भारतीय WPC IN865 टेलीमेट्री',
    prototypeBanner: 'हवामान बदल एआय हॅकाथॉन प्रोटोटाइप',
    startDashboard: 'डॅशबोर्ड सुरू करा',
    selectLanguage: 'तुमची भाषा निवडा',
    selectLanguageDesc: 'तुमची पसंतीची भाषा निवडा. वनरक्षक एआय व्हॉईस असिस्टंट तुम्हाला संपूर्ण संरक्षण प्रणाली समजून घेण्यास मदत करेल.',
    aiVoiceAssistant: 'वनरक्षक एआय व्हॉईस असिस्टंट',
    aiVoiceSpeaking: 'एआय व्हॉईस असिस्टंट आपले स्वागत करत आहे...',
    continueInLanguage: 'मराठीमध्ये चालू ठेवा',
    switchLanguage: 'भाषा / Language',
    voiceReplay: 'आवाज पुन्हा ऐका',
    voiceStop: 'आवाज थांबवा',

    // Navigation
    navCoreMonitoring: 'मुख्य देखरेख',
    navOverview: 'विहंगावलोकन डॅशबोर्ड',
    navLiveAlerts: 'थेट अलर्ट रांग',
    navThreatRadar: 'जंगल धोका रडार',
    navFieldOperations: 'क्षेत्रीय मोहीम',
    navPatrols: 'रेंजर गस्त नियंत्रण',
    navProfile: 'रेंजर प्रोफाइल आणि ओळख',
    navEdgeAiAcoustics: 'एज-एआय आणि ध्वनीशास्त्र',
    navSoundAnalysis: 'ध्वनी विश्लेषण व TinyML',
    navSoundStudio: 'ध्वनिक धोका स्टुडिओ',
    navMeshTelemetry: 'मेश आणि टेलीमेट्री',
    navNodes: 'सेन्सॉर नोड्स ताफा',
    navRfTelemetry: 'LoRa IN865 निदान',
    navSecurityImpact: 'सुरक्षा आणि परिणाम',
    navReports: 'न्यायालयीन पुरावा दस्तऐवज',
    navClimateImpact: 'पर्यावरण व प्रभाव मेट्रिक्स',
    navArchitecture: 'प्रणाली रचना',
    navProjectInfo: 'प्रकल्पाची माहिती',

    // Navbar
    loraGatewayActive: 'LoRa गेटवे सक्रिय',
    simulateAlert: 'चेनसॉ अलर्ट सिम्युलेशन',
    searchPlaceholder: 'नोड्स, अलर्ट, गस्त शोधा... (Ctrl+K)',
    switchPersona: 'डेमो भूमिका बदला',

    // Overview Page
    bannerTitle: 'जंगल संरक्षणासाठी सौर-ऊर्जेवर चालणारी ध्वनिक एज-एआय',
    bannerDesc: 'स्वायत्त ESP32-S3 सेन्सॉर नोड्स स्थानिक पातळीवर आवाजाचे वर्गीकरण करतात. कॉम्पॅक्ट LoRa अलर्ट पॅकेट्स सतत ऑडिओ स्ट्रीमिंग न करता काही सेकंदात रेंजर्सना सूचित करतात.',
    kpiActiveNodes: 'सक्रिय एज नोड्स',
    kpiActiveNodesSub: 'नोड्स सध्या सौर-संचलित आहेत',
    kpiAlertsToday: 'आज नोंदवलेले अलर्ट्स',
    kpiAlertsTodaySub: 'ध्वनिक विसंगती आणि संभाव्य चेनसॉच्या घटना',
    kpiPendingReview: 'तपासणीसाठी प्रलंबित',
    kpiPendingReviewSub: 'मानवी पडताळणी निर्णयाची आवश्यकता',
    kpiGatewayStatus: 'LoRa गेटवे स्थिती',
    kpiGatewayStatusSub: 'पॅकेट वितरण: 98.6% • विलंब: 2.1s',
    quickPatrols: 'रेंजर गस्त',
    quickPatrolsSub: 'रेंजर रवाना व प्रत्यक्ष ETA',
    quickThreatRadar: 'धोका रडार',
    quickThreatRadarSub: 'प्रादेशिक धोका मॅट्रिक्स',
    quickSoundStudio: 'ध्वनिक स्टुडिओ',
    quickSoundStudioSub: 'ऑडिओ सिंथ व FFT',
    quickDossiers: 'पुरावा दस्तऐवज',
    quickDossiersSub: 'कायदेशीर पुरावा / हॅश',
    recentAlertsQueue: 'प्राप्त ध्वनिक अलर्ट्स रांग',
    recentAlertsQueueSub: 'एआय अलर्ट्स हे निर्णय-सुलभ संकेत आहेत ज्यांना गस्त रवाना करण्यापूर्वी मानवी पडताळणीची आवश्यकता असते.',
    viewAllAlerts: 'संपूर्ण अलर्ट रांग पहा',
    impactSummaryTitle: 'प्रोटोटाइप प्रभाव आणि पर्यावरणीय फायदे',
    impactBox1Title: 'जलद धोका प्रतिसाद',
    impactBox1Desc: 'एज वर्गीकरण 2 सेकंदात चेनसॉचा आवाज ओळखते आणि LoRa वर पॅकेट्स पाठवते, ज्यामुळे प्रत्यक्ष गस्तीच्या तुलनेत अलर्टचा वेळ तासांवरून काही सेकंदांवर येतो.',
    impactBox2Title: 'शून्य हाय-बँडविड्थ अवलंबित्व',
    impactBox2Desc: 'दाट जंगलात 4G/5G किंवा उपग्रह डेटाची आवश्यकता नाही. केवळ 20-30 बाइट्सचे कॉम्पॅक्ट टेलीमेट्री पॅकेट्स सब-गीगाहर्ट्झ रेडिओवर पाठवले जातात.',
    impactBox3Title: 'ध्वनिक गोपनीयता आणि सुरक्षितता',
    impactBox3Desc: 'मायक्रोफोन फक्त ESP32-S3 SRAM मध्ये आवाजाचे विश्लेषण करतात. मूळ ऑडिओ रेकॉर्डिंग कधीही साठवले किंवा अपलोड केले जात नाही.',
  },
};
