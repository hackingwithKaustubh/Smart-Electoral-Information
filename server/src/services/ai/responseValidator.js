const BLOCKED = [
  /vote for/i,
  /support (the )?(bjp|congress|aap|party)/i,
  /best (party|candidate)/i,
  /whom should i vote/i,
  /predict.*(win|outcome)/i,
  /campaign speech/i,
];

function validateAssistantPayload(payload) {
  const text = JSON.stringify(payload || {});
  if (BLOCKED.some((pattern) => pattern.test(text))) {
    return {
      ok: false,
      reason: 'SAFETY_FILTER',
    };
  }
  if (!payload || typeof payload.summary !== 'string') {
    return { ok: false, reason: 'INVALID_SHAPE' };
  }
  return { ok: true };
}

function fallbackStructured(language) {
  if (language === 'hi') {
    return {
      title: 'आधिकारिक जानकारी देखें',
      summary:
        'यह प्रश्न राजनीतिक सलाह या अपुष्ट जानकारी की ओर जा सकता है। Civora केवल प्रक्रिया संबंधी जानकारी देता है। कृपया चुनाव आयोग के आधिकारिक पोर्टल का उपयोग करें।',
      sections: [
        {
          heading: 'सुझाव',
          bullets: [
            'उम्मीदवार या दल की सिफारिश नहीं की जाती।',
            'पंजीकरण, पात्रता और सुधार के लिए आधिकारिक पोर्टल देखें।',
          ],
        },
      ],
      steps: ['https://www.eci.gov.in/ खोलें', 'https://voters.eci.gov.in/ पर अपनी सेवा चुनें'],
      followUps: ['मतदाता पंजीकरण कैसे करें?', 'पात्रता की सामान्य शर्तें क्या हैं?'],
      sourceKind: 'official',
    };
  }
  return {
    title: 'Please use official sources',
    summary:
      'Civora stays strictly informational and politically neutral. For binding instructions, forms and status checks, use the Election Commission of India portals.',
    sections: [
      {
        heading: 'What we can help with',
        bullets: [
          'General eligibility and registration overviews',
          'Where to find official forms and helplines',
          'Plain-language explanations of published processes',
        ],
      },
    ],
    steps: ['Open https://www.eci.gov.in/', 'Use https://voters.eci.gov.in/ for voter services'],
    followUps: ['How can I register as a voter?', 'What documents are generally required?'],
    sourceKind: 'official',
  };
}

module.exports = { validateAssistantPayload, fallbackStructured };
