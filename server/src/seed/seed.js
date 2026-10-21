const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { connectDb } = require('../config/db');
const env = require('../config/env');
const User = require('../models/User');
const FAQ = require('../models/FAQ');
const ElectoralInformation = require('../models/ElectoralInformation');
const OfficialSource = require('../models/OfficialSource');

const VERIFIED = new Date('2026-01-15');

const sources = [
  {
    name: 'Election Commission of India',
    url: 'https://www.eci.gov.in/',
    description: 'Official website of the Election Commission of India for electoral laws, notifications, and voter education.',
    descriptionHi: 'भारत निर्वाचन आयोग की आधिकारिक वेबसाइट।',
    lastVerified: VERIFIED,
  },
  {
    name: 'Voters’ Service Portal',
    url: 'https://voters.eci.gov.in/',
    description: 'Online voter services including registration, corrections, and EPIC-related requests as published by ECI.',
    descriptionHi: 'मतदाता सेवा पोर्टल — पंजीकरण और सुधार संबंधी सेवाएँ।',
    lastVerified: VERIFIED,
  },
  {
    name: 'Voter Helpline App / 1950',
    url: 'https://www.eci.gov.in/',
    description: 'National voter helpline number 1950 and related ECI voter assistance channels. Confirm current numbers on the official site.',
    descriptionHi: 'मतदाता हेल्पलाइन 1950। वर्तमान जानकारी आधिकारिक साइट पर जाँचें।',
    lastVerified: VERIFIED,
  },
];

const information = [
  {
    slug: 'voter-eligibility',
    category: 'eligibility',
    title: 'General voter eligibility in India',
    titleHi: 'भारत में मतदाता पात्रता (सामान्य जानकारी)',
    summary: 'A citizen of India who is 18 years of age on the qualifying date, and who is not otherwise disqualified under law, may apply to be registered as a voter in the relevant constituency.',
    summaryHi: 'भारत का नागरिक, जो निर्धारित तिथि पर 18 वर्ष का हो और विधि द्वारा अन्यथा निरर्हित न हो, संबंधित निर्वाचन क्षेत्र में मतदाता के रूप में पंजीकरण हेतु आवेदन कर सकता है।',
    content:
      'This is a general overview, not a legal determination of your case. Eligibility typically depends on Indian citizenship, age (18 years on the qualifying date), ordinary residence in the constituency, and absence of disqualifications provided in electoral law. Always confirm the latest instructions on the Election Commission of India website and complete any prescribed declaration on the official form.',
    contentHi:
      'यह सामान्य जानकारी है, व्यक्तिगत मामले का कानूनी निर्धारण नहीं। पात्रता सामान्यतः नागरिकता, आयु, सामान्य निवास और विधि में उल्लिखित निरर्हताओं पर निर्भर करती है। नवीनतम निर्देश eci.gov.in पर देखें।',
    steps: [
      'Confirm you are an Indian citizen and will be 18 on the qualifying date used for the roll.',
      'Identify the assembly constituency of your ordinary residence.',
      'Use the Voters’ Service Portal or BLO assistance to submit the prescribed form.',
      'Track the application on the official portal and respond to any notice.',
    ],
    stepsHi: [
      'नागरिकता और निर्धारित तिथि पर 18 वर्ष की आयु की पुष्टि करें।',
      'अपने सामान्य निवास का विधानसभा क्षेत्र पहचानें।',
      'आधिकारिक पोर्टल या BLO के माध्यम से निर्धारित फॉर्म जमा करें।',
      'आवेदन की स्थिति पोर्टल पर देखें।',
    ],
    lastVerified: VERIFIED,
  },
  {
    slug: 'voter-registration',
    category: 'registration',
    title: 'How voter registration generally works',
    titleHi: 'मतदाता पंजीकरण सामान्यतः कैसे होता है',
    summary: 'New electors typically apply through Form 6 (or the current equivalent published by ECI) via the Voters’ Service Portal, a BLO, or designated centres.',
    summaryHi: 'नए मतदाता आमतौर पर फॉर्म 6 (या आयोग द्वारा प्रकाशित वर्तमान समकक्ष) के माध्यम से आवेदन करते हैं।',
    content:
      'Registration is handled by electoral registration officers under the Election Commission of India. The common public path is the Voters’ Service Portal (voters.eci.gov.in). You may need to create an account, fill the new registration form, upload supporting documents, and submit. A booth level officer may verify details. Do not pay anyone for registration; official services are not a private paid shortcut. For the exact current form names and document list, use the official portal — they can change.',
    contentHi:
      'पंजीकरण निर्वाचन पंजीकरण अधिकारियों द्वारा किया जाता है। सामान्य मार्ग Voters’ Service Portal है। किसी निजी व्यक्ति को पंजीकरण के लिए भुगतान न करें।',
    steps: [
      'Open https://voters.eci.gov.in/ and choose new registration.',
      'Fill the official form with accurate personal and address details.',
      'Upload the documents listed on the portal for the current cycle.',
      'Submit and note the reference number.',
      'Cooperate with field verification if contacted.',
    ],
    stepsHi: [
      'voters.eci.gov.in खोलें और नया पंजीकरण चुनें।',
      'आधिकारिक फॉर्म सही विवरण के साथ भरें।',
      'पोर्टल पर सूचीबद्ध दस्तावेज़ अपलोड करें।',
      'जमा करें और संदर्भ संख्या सुरक्षित रखें।',
      'यदि संपर्क हो तो सत्यापन में सहयोग करें।',
    ],
    lastVerified: VERIFIED,
  },
  {
    slug: 'registration-documents',
    category: 'documents',
    title: 'Documents generally requested for registration',
    titleHi: 'पंजीकरण के लिए सामान्यतः मांगे जाने वाले दस्तावेज़',
    summary: 'Portals usually ask for proof of identity, age, and residence. The accepted list is published by ECI and can vary; always use the list shown on the live form.',
    summaryHi: 'आमतौर पर पहचान, आयु और निवास के प्रमाण मांगे जाते हैं। स्वीकृत सूची आधिकारिक फॉर्म पर देखें।',
    content:
      'Civora does not invent an exhaustive legal list. In practice, applicants are asked for photographs and documents that establish identity, date of birth/age, and ordinary residence. Aadhaar may be used where the official form permits it, but you should follow the options printed on the current ECI form rather than third-party blogs. If you lack a document, the official form or BLO can indicate permitted alternatives.',
    contentHi:
      'Civora दस्तावेज़ों की मनगढ़ंत सूची नहीं बनाता। आधिकारिक फॉर्म पर दी गई वर्तमान सूची का पालन करें।',
    steps: [
      'Open the live registration form on voters.eci.gov.in.',
      'Read the document checklist shown for that form.',
      'Prepare clear scans that match the name and address you enter.',
      'Do not submit forged documents.',
    ],
    stepsHi: [
      'लाइव फॉर्म खोलें और दस्तावेज़ सूची पढ़ें।',
      'स्पष्ट स्कैन तैयार करें।',
      'जाली दस्तावेज़ जमा न करें।',
    ],
    lastVerified: VERIFIED,
  },
  {
    slug: 'update-voter-details',
    category: 'update-details',
    title: 'Updating or correcting voter details',
    titleHi: 'मतदाता विवरण का अद्यतन या सुधार',
    summary: 'Corrections to entries in the electoral roll (name, address, photo, and similar fields) are generally requested through the form family published as Form 8 / related correction services on the Voters’ Service Portal.',
    summaryHi: 'नाम, पता, फोटो आदि के सुधार आमतौर पर फॉर्म 8 या पोर्टल की सुधार सेवा से किए जाते हैं।',
    content:
      'If you are already enrolled and need to correct or update particulars, use the official correction/migration services — not informal agents. Shifting residence to another constituency typically requires the process published for transposition or a fresh application as instructed on the portal. Keep your EPIC number handy. After submitting, monitor status online.',
    contentHi:
      'पहले से नामांकित मतदाता आधिकारिक सुधार सेवा का उपयोग करें। EPIC संख्या तैयार रखें और स्थिति ऑनलाइन देखें।',
    steps: [
      'Sign in on https://voters.eci.gov.in/',
      'Choose the correction, migration, or related service that matches your case.',
      'Submit supporting documents listed on the form.',
      'Track the request until the roll is updated.',
    ],
    stepsHi: [
      'voters.eci.gov.in पर साइन इन करें।',
      'उपयुक्त सुधार/स्थानांतरण सेवा चुनें।',
      'आवश्यक दस्तावेज़ जमा करें।',
      'अद्यतन होने तक स्थिति देखें।',
    ],
    lastVerified: VERIFIED,
  },
  {
    slug: 'electoral-process-overview',
    category: 'electoral-process',
    title: 'How voting is generally conducted',
    titleHi: 'मतदान सामान्यतः कैसे होता है',
    summary: 'On poll day, electors vote at their allotted polling station using the process notified by the Returning Officer and ECI, commonly including EVM and VVPAT in Indian elections.',
    summaryHi: 'मतदान दिवस पर निर्धारित मतदान केंद्र पर आयोग द्वारा अधिसूचित प्रक्रिया के अनुसार मतदान होता है।',
    content:
      'This platform does not tell you whom to vote for. Procedurally, you should locate your polling station from official tools, carry the identification documents notified for that election, and follow instructions of polling staff. Secrecy of the ballot is a legal duty. For current election schedules, look at eci.gov.in — Civora does not publish unofficial calendars.',
    contentHi:
      'यह प्लेटफॉर्म यह नहीं बताता कि किसे वोट दें। अपना मतदान केंद्र आधिकारिक साधनों से जानें और अधिसूचित पहचान पत्र साथ रखें।',
    steps: [
      'Find your polling station on official ECI / voter helpline channels.',
      'Carry photo ID as specified in the election instructions.',
      'Follow polling staff directions; do not photograph the voting process if prohibited.',
      'For grievances, use official helpline or observer channels listed by ECI.',
    ],
    stepsHi: [
      'आधिकारिक माध्यम से मतदान केंद्र जानें।',
      'अधिसूचित फोटो पहचान पत्र साथ रखें।',
      'कर्मचारियों के निर्देशों का पालन करें।',
    ],
    lastVerified: VERIFIED,
  },
  {
    slug: 'official-resources',
    category: 'official-resources',
    title: 'Where to find official electoral information',
    titleHi: 'आधिकारिक निर्वाचन जानकारी कहाँ मिले',
    summary: 'Use Election Commission of India properties only for status, forms, and legally relevant instructions.',
    summaryHi: 'स्थिति, फॉर्म और कानूनी निर्देशों के लिए भारत निर्वाचन आयोग के आधिकारिक माध्यमों का उपयोग करें।',
    content:
      'Primary official starting points: https://www.eci.gov.in/ for the Commission, https://voters.eci.gov.in/ for voter services, and the national voter helpline 1950 (confirm on the official site if numbers change). Treat social media forwards, paid agents, and unofficial apps as unverified.',
    contentHi:
      'मुख्य स्रोत eci.gov.in, voters.eci.gov.in और हेल्पलाइन 1950 हैं। सोशल मीडिया फॉरवर्ड को आधिकारिक न मानें।',
    steps: [
      'Bookmark eci.gov.in and voters.eci.gov.in',
      'Use 1950 after confirming it on the official website',
      'Ignore anyone asking for money to “add your name”',
    ],
    stepsHi: ['eci.gov.in बुकमार्क करें', 'आधिकारिक साइट पर हेल्पलाइन सत्यापित करें'],
    lastVerified: VERIFIED,
  },
];

const faqs = [
  {
    question: 'How can I register as a voter?',
    questionHi: 'मतदाता के रूप में पंजीकरण कैसे करें?',
    answer:
      'Use the Voters’ Service Portal at https://voters.eci.gov.in/ (or assistance from a Booth Level Officer) and submit the current new-registration form published by the Election Commission of India. Keep the reference number and track status on the same portal.',
    answerHi:
      'https://voters.eci.gov.in/ पर जाकर आयोग द्वारा प्रकाशित वर्तमान नए पंजीकरण फॉर्म को जमा करें, या BLO से सहायता लें।',
    category: 'registration',
    tags: ['registration', 'form 6', 'nvsp'],
    lastVerified: VERIFIED,
  },
  {
    question: 'What documents are generally required for registration?',
    questionHi: 'पंजीकरण के लिए सामान्यतः कौन से दस्तावेज़ चाहिए?',
    answer:
      'The live official form lists accepted proofs of identity, age and residence. Follow that checklist rather than unofficial blogs. Documents must be genuine and should match the details you enter.',
    answerHi: 'आधिकारिक फॉर्म पर दी गई दस्तावेज़ सूची का पालन करें।',
    category: 'documents',
    tags: ['documents', 'proof'],
    lastVerified: VERIFIED,
  },
  {
    question: 'How can I check whether I am eligible?',
    questionHi: 'मैं पात्र हूँ या नहीं, यह कैसे जाँचूँ?',
    answer:
      'As a general rule, Indian citizenship, 18 years of age on the qualifying date, ordinary residence in the constituency, and absence of legal disqualification are the core tests. For a determination in your case, rely on the official form declarations and ERO process — Civora cannot certify eligibility.',
    answerHi: 'सामान्य नियम: भारतीय नागरिकता, निर्धारित तिथि पर 18 वर्ष, सामान्य निवास, और विधि के अनुसार निरर्हता न होना।',
    category: 'eligibility',
    tags: ['eligibility', 'age'],
    lastVerified: VERIFIED,
  },
  {
    question: 'How can I update my voter information?',
    questionHi: 'अपनी मतदाता जानकारी कैसे अपडेट करूँ?',
    answer:
      'Sign in to https://voters.eci.gov.in/ and use the correction or related service that matches your change (name, photo, address, and similar). Do not use unofficial agents.',
    answerHi: 'voters.eci.gov.in पर साइन इन कर सुधार सेवा का उपयोग करें।',
    category: 'update',
    tags: ['update', 'form 8'],
    lastVerified: VERIFIED,
  },
  {
    question: 'Where can I find official electoral information?',
    questionHi: 'आधिकारिक निर्वाचन जानकारी कहाँ मिलेगी?',
    answer:
      'Start at https://www.eci.gov.in/ and https://voters.eci.gov.in/. The national voter helpline 1950 is published by ECI; confirm the number on the official site.',
    answerHi: 'eci.gov.in और voters.eci.gov.in देखें। हेल्पलाइन 1950 आधिकारिक साइट पर सत्यापित करें।',
    category: 'sources',
    tags: ['eci', 'official'],
    lastVerified: VERIFIED,
  },
  {
    question: 'Does Civora tell me whom to vote for?',
    questionHi: 'क्या Civora बताता है कि किसे वोट दें?',
    answer:
      'No. The platform is strictly informational and politically neutral. It will not recommend candidates or parties, rank contestants, or predict outcomes.',
    answerHi: 'नहीं। यह प्लेटफॉर्म राजनीतिक रूप से तटस्थ है और किसी उम्मीदवार या दल की सिफारिश नहीं करता।',
    category: 'about',
    tags: ['neutrality'],
    lastVerified: VERIFIED,
  },
  {
    question: 'Is voter registration a paid service?',
    questionHi: 'क्या मतदाता पंजीकरण भुगतान वाली सेवा है?',
    answer:
      'Official ECI voter services are not something you should pay a private middleman for. If someone demands money to “add your name”, treat it as a red flag and use official channels.',
    answerHi: 'आधिकारिक सेवाओं के लिए बिचौलिये को भुगतान न करें।',
    category: 'registration',
    tags: ['fraud', 'helpline'],
    lastVerified: VERIFIED,
  },
  {
    question: 'Can I use the assistant in Hindi?',
    questionHi: 'क्या सहायक हिंदी में काम करता है?',
    answer:
      'Yes. Set Hindi in your profile or ask in Hindi. You can switch language from the chat header. More languages can be added later using the same architecture.',
    answerHi: 'हाँ। प्रोफ़ाइल या चैट हेडर से हिंदी चुनें, या सीधे हिंदी में प्रश्न पूछें।',
    category: 'product',
    tags: ['language', 'hindi'],
    lastVerified: VERIFIED,
  },
];

async function seed() {
  await connectDb();
  await Promise.all([
    OfficialSource.deleteMany({}),
    ElectoralInformation.deleteMany({}),
    FAQ.deleteMany({}),
  ]);
  await OfficialSource.insertMany(sources);
  await ElectoralInformation.insertMany(information);
  await FAQ.insertMany(faqs);

  const existingAdmin = await User.findOne({ email: env.adminEmail.toLowerCase() });
  if (!existingAdmin) {
    await User.create({
      name: 'Civora Admin',
      email: env.adminEmail.toLowerCase(),
      password: env.adminPassword,
      role: 'admin',
      preferredLanguage: 'en',
    });
    console.log(`Admin user created: ${env.adminEmail}`);
  } else {
    console.log('Admin user already exists');
  }

  console.log('Seed complete');
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
