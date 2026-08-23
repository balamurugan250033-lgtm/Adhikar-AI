import logo from './logo.png';
import React, { useState, useEffect } from 'react';
import { apiUrl, readJsonResponse } from './api';

// 22 Official Indian Languages + English with Speech recognition locale codes
const LANGUAGES = [
  { name: 'English', code: 'en-US' },
  { name: 'Hindi', code: 'hi-IN' },
  { name: 'Bengali', code: 'bn-IN' },
  { name: 'Marathi', code: 'mr-IN' },
  { name: 'Telugu', code: 'te-IN' },
  { name: 'Tamil', code: 'ta-IN' },
  { name: 'Gujarati', code: 'gu-IN' },
  { name: 'Urdu', code: 'ur-IN' },
  { name: 'Kannada', code: 'kn-IN' },
  { name: 'Malayalam', code: 'ml-IN' },
  { name: 'Odia', code: 'or-IN' },
  { name: 'Punjabi', code: 'pa-IN' },
  { name: 'Assamese', code: 'as-IN' },
  { name: 'Maithili', code: 'mai-IN' },
  { name: 'Sanskrit', code: 'sa-IN' },
  { name: 'Kashmiri', code: 'ks-IN' },
  { name: 'Sindhi', code: 'sd-IN' },
  { name: 'Konkani', code: 'kok-IN' },
  { name: 'Nepali', code: 'ne-NP' },
  { name: 'Dogri', code: 'doi-IN' },
  { name: 'Manipuri', code: 'mni-IN' },
  { name: 'Bodo', code: 'brx-IN' },
  { name: 'Santali', code: 'sat-IN' }
];

// Complete UI Localization Dictionary for all 22 Official Indian Languages + City/Pincode fields
const STATES = ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Kerala', 'Other state'];

const SAMPLE_FORM = {
  applicant_name: 'Asha Kumar',
  address: '12 Lake View Road',
  city: 'Chennai',
  pincode: '600001',
  state: 'Tamil Nadu',
  phone: '9876543210',
  email: 'asha@example.com',
  question: 'My ration card application has been pending for four months. Please provide the file status, reasons for delay, and action taken by the responsible officials.'
};

const DEMO_HISTORY = [
  { id: 'demo-1', applicant_name: 'Demo citizen', city: 'Chennai', language: 'English', date: 'Demo example', question: SAMPLE_FORM.question, rti_draft: 'Example draft ready to review', instructions: 'Review the PIO and portal guidance before filing.' },
  { id: 'demo-2', applicant_name: 'Demo citizen', city: 'Bengaluru', language: 'English', date: 'Demo example', question: 'Request the status of a delayed street-light repair.', rti_draft: 'Example civic information request', instructions: 'Review the public authority before filing.' }
];

const UI_TEXT = {
  English: {
    brand: "Adhikar AI", tagline: "Automated RTI Drafting Assistant",
    heroTitle: "File Right to Information Applications Instantly",
    heroDesc: "Describe your problem in any language. Our legal AI drafts your application in English and guides you precisely where to submit it.",
    getStarted: "Get Started →", formTitle: "Create RTI Application",
    nameLabel: "Full Name of Applicant", namePlaceholder: "Enter your legal full name",
    addressLabel: "Correspondence Address", addressPlaceholder: "Enter your complete postal address",
    cityLabel: "City / District", cityPlaceholder: "Enter your city or district",
    pincodeLabel: "Pincode / Postal Code", pincodePlaceholder: "Enter 6-digit pincode",
    problemLabel: "Describe Your Problem / Information Needed",
    problemPlaceholder: "Describe your issue clearly (e.g., My ration card application was delayed...)",
    micButton: "🎙️ Speak Problem", stopMic: "🔴 Stop Recording",
    submitButton: "Generate Official RTI Application", loadingText: "Analyzing & Drafting Application...",
    sectionATitle: "Generated RTI Application (English - Ready to Copy/PDF)",
    copyBtn: "Copy Text", copied: "✓ Copied", pdfBtn: "📥 Download PDF",
    sectionBTitle: "Submission Guidelines & Target Department", backHome: "← Back to Home",
    historyTitle: "📜 Past Drafts History", noHistory: "No saved drafts yet.", loadDraft: "Load Draft"
  },
  Hindi: {
    brand: "अधिकार AI", tagline: "स्वचालित आरटीआई ड्राफ्टिंग सहायक",
    heroTitle: "तुरंत सूचना का अधिकार (आरटीआई) आवेदन दाखिल करें",
    heroDesc: "अपनी समस्या किसी भी भाषा में बताएं। हमारी लीगल एआई आपका आवेदन अंग्रेजी में तैयार करेगी और मार्गदर्शन करेगी।",
    getStarted: "शुरू करें →", formTitle: "आरटीआई आवेदन बनाएं",
    nameLabel: "आवेदक का पूरा नाम", namePlaceholder: "अपना पूरा कानूनी नाम दर्ज करें",
    addressLabel: "पत्रव्यवहार का पता", addressPlaceholder: "अपना पूरा डाक पता दर्ज करें",
    cityLabel: "शहर / जिला", cityPlaceholder: "अपना शहर या जिला दर्ज करें",
    pincodeLabel: "पिनकोड / पोस्टल कोड", pincodePlaceholder: "6-अंकों का पिनकोड दर्ज करें",
    problemLabel: "अपनी समस्या या आवश्यक जानकारी का वर्णन करें",
    problemPlaceholder: "अपनी समस्या स्पष्ट रूप से बताएं...",
    micButton: "🎙️ बोलकर टाइप करें", stopMic: "🔴 रिकॉर्डिंग बंद करें",
    submitButton: "आधिकारिक आरटीआई आवेदन जनरेट करें", loadingText: "विश्लेषण और ड्राफ्टिंग जारी है...",
    sectionATitle: "तैयार आरटीआई आवेदन (अंग्रेजी में)",
    copyBtn: "कॉपी करें", copied: "✓ कॉपी हो गया", pdfBtn: "📥 PDF डाउनलोड करें",
    sectionBTitle: "सबमिशन दिशा-निर्देश और लक्षित विभाग", backHome: "← होम पर वापस जाएं",
    historyTitle: "📜 पिछले ड्राफ्ट का इतिहास", noHistory: "अभी तक कोई ड्राफ्ट सहेजा नहीं गया है।", loadDraft: "लोड करें"
  },
  Tamil: {
    brand: "அதிகார் AI", tagline: "தானியங்கி RTI வரைவு உதவியாளர்",
    heroTitle: "உடனடியாக RTI விண்ணப்பத்தை உருவாக்கவும்",
    heroDesc: "உங்கள் பிரச்சினையை எந்த மொழியிலும் விவரிக்கவும். எங்களின் AI உங்கள் விண்ணப்பத்தை ஆங்கிலத்தில் தயார் செய்து வழிகாட்டும்.",
    getStarted: "தொடங்கவும் →", formTitle: "RTI விண்ணப்பத்தை உருவாக்கவும்",
    nameLabel: "விண்ணப்பதாரரின் முழு பெயர்", namePlaceholder: "உங்கள் முழு சட்டப்பூர்வ பெயரை உள்ளிடவும்",
    addressLabel: "தொடர்பு முகவரி", addressPlaceholder: "உங்கள் முழு அஞ்சல் முகவரியை உள்ளிடவும்",
    cityLabel: "நகரம் / மாவட்டம்", cityPlaceholder: "உங்கள் நகரம் அல்லது மாவட்டத்தை உள்ளிடவும்",
    pincodeLabel: "அஞ்சல் குறியீடு (Pincode)", pincodePlaceholder: "6 இலக்க அஞ்சல் குறியீட்டை உள்ளிடவும்",
    problemLabel: "உங்கள் சிக்கல் அல்லது தேவையான தகவலை விவரிக்கவும்",
    problemPlaceholder: "உங்கள் பிரச்சினையை தெளிவாக விவரிக்கவும்...",
    micButton: "🎙️ குரல் மூலம் பேசவும்", stopMic: "🔴 பதிவு செய்வதை நிறுத்தவும்",
    submitButton: "அதிகாரப்பூர்வ RTI விண்ணப்பத்தை உருவாக்க", loadingText: "விண்ணப்பம் தயாரிக்கப்படுகிறது...",
    sectionATitle: "உருவாக்கப்பட்ட RTI விண்ணப்பம் (ஆங்கிலத்தில்)",
    copyBtn: "நகலெடுக்கவும்", copied: "✓ நகலெடுக்கப்பட்டது", pdfBtn: "📥 PDF பதிவிறக்கம்",
    sectionBTitle: "சமர்ப்பிக்கும் வழிகாட்டுதல்கள் மற்றும் இலக்கு துறை", backHome: "← முகப்புக்கு திரும்பு",
    historyTitle: "📜 முந்தைய வரைவுகள் வரலாறு", noHistory: "சேமிக்கப்பட்ட வரைவுகள் இல்லை.", loadDraft: "ஏற்று"
  },
  Telugu: {
    brand: "అధికార్ AI", tagline: "ఆటోమేటెడ్ RTI డ్రాఫ్టింగ్ అసిస్టెంట్",
    heroTitle: "క్షణాల్లో RTI దరఖాస్తులను సమర్పించండి",
    heroDesc: "మీ సమస్యను ఏ భాషలోనైనా వివరించండి. మా AI మీ దరఖాస్తును ఇంగ్లీషులో తయారు చేస్తుంది.",
    getStarted: "ప్రారంభించండి →", formTitle: "RTI దరఖాస్తును సృష్టించండి",
    nameLabel: "దరఖాస్తుదారు పూర్తి పేరు", namePlaceholder: "మీ పూర్తి పేరును నమోదు చేయండి",
    addressLabel: "చిరునామా", addressPlaceholder: "మీ పూర్తి పోస్టల్ చిరునామాను నమోదు చేయండి",
    cityLabel: "నగరం / జిల్లా", cityPlaceholder: "మీ నగరం లేదా జిల్లాను నమోదు చేయండి",
    pincodeLabel: "పిన్‌కోడ్", pincodePlaceholder: "6-అంకెల పిన్‌కోడ్‌ను నమోదు చేయండి",
    problemLabel: "మీ సమస్య లేదా సమాచారాన్ని వివరించండి", problemPlaceholder: "మీ సమస్యను స్పష్టంగా వివరించండి...",
    micButton: "🎙️ మాట్లాడండి", stopMic: "🔴 రికార్డింగ్ ఆపు",
    submitButton: "అధికారిక RTI దరఖాస్తును రూపొందించండి", loadingText: "డ్రాఫ్ట్ తయారు చేయబడుతోంది...",
    sectionATitle: "రూపొందించబడిన RTI దరఖాస్తు", copyBtn: "కాపీ", copied: "✓ కాపీ అయింది", pdfBtn: "📥 PDF డౌన్‌లోడ్",
    sectionBTitle: "సమర్పణ మార్గదర్శకాలు", backHome: "← హోమ్‌కి వెళ్లండి",
    historyTitle: "📜 మునుపటి డ్రాఫ్ట్‌ల చరిత్ర", noHistory: "సేవ్ చేసిన డ్రాఫ్ట్‌లు లేవు.", loadDraft: "లోడ్ చేయి"
  },
  Bengali: {
    brand: "অধিকার AI", tagline: "স্বয়ংক্রিয় RTI ড্রাফটিং সহকারী",
    heroTitle: "তাত্ক্ষণিকভাবে RTI আবেদন জমা দিন",
    heroDesc: "যেকোনো ভাষায় আপনার সমস্যা বর্ণনা করুন। আমাদের এআই ইংরেজিতে আপনার আবেদন তৈরি করবে।",
    getStarted: "শুরু করুন →", formTitle: "RTI আবেদন তৈরি করুন",
    nameLabel: "আবেদনকারীর পূর্ণ নাম", namePlaceholder: "আপনার আইনি নাম লিখুন",
    addressLabel: "যোগাযোগের ঠিকানা", addressPlaceholder: "সম্পূর্ণ postal address লিখুন",
    cityLabel: "শহর / জেলা", cityPlaceholder: "আপনার শহর বা জেলা লিখুন",
    pincodeLabel: "পিনকোড", pincodePlaceholder: "৬-সংখ্যার পিনকোড লিখুন",
    problemLabel: "আপনার সমস্যা বা তথ্যের বিবরণ দিন", problemPlaceholder: "আপনার সমস্যা স্পষ্টভাবে লিখুন...",
    micButton: "🎙️ বলুন", stopMic: "🔴 বন্ধ করুন",
    submitButton: "অফিশিয়াল RTI আবেদন তৈরি করুন", loadingText: "ড্রাফট তৈরি হচ্ছে...",
    sectionATitle: "তৈরি করা RTI আবেদন", copyBtn: "কপি", copied: "✓ কপি করা হয়েছে", pdfBtn: "📥 PDF ডাউনলোড",
    sectionBTitle: "জমা দেওয়ার নির্দেশিকা", backHome: "← হোম পেজে ফিরে যান",
    historyTitle: "📜 পূর্ববর্তী ড্রাফটের ইতিহাস", noHistory: "কোনো সংরক্ষিত ড্রাফট নেই।", loadDraft: "লোড করুন"
  },
  Marathi: {
    brand: "अधिकार AI", tagline: "स्वयंचलित RTI मसुदा सहाय्यक",
    heroTitle: "त्वरित माहिती अधिकार अर्ज दाखल करा",
    heroDesc: "तुमची समस्या कोणत्याही भाषेत सांगा. आमची AI तुमचा अर्ज इंग्रजीत तयार करेल.",
    getStarted: "सुरू करा →", formTitle: "RTI अर्ज तयार करा",
    nameLabel: "अर्जदाराचे पूर्ण नाव", namePlaceholder: "तुमचे कायदेशीर पूर्ण नाव टाका",
    addressLabel: "पत्रव्यवहाराचा पत्ता", addressPlaceholder: "पूर्ण पत्ता टाका",
    cityLabel: "शहराचे नाव / जिल्हा", cityPlaceholder: "शहर किंवा जिल्हा प्रविष्ट करा",
    pincodeLabel: "पिनकोड", pincodePlaceholder: "६ अंकी पिनकोड प्रविष्ट करा",
    problemLabel: "तुमची समस्या किंवा माहितीचे तपशील द्या", problemPlaceholder: "तुमची समस्या स्पष्टपणे सांगा...",
    micButton: "🎙️ बोला", stopMic: "🔴 थांबवा",
    submitButton: "अधिकृत RTI अर्ज तयार करा", loadingText: "मसुदा तयार होत आहे...",
    sectionATitle: "तयार RTI अर्ज", copyBtn: "कॉपी", copied: "✓ कॉपी केले", pdfBtn: "📥 PDF डाउनलोड",
    sectionBTitle: "सादर करण्याच्या मार्गदर्शक सूचना", backHome: "← होमवर जा",
    historyTitle: "📜 मागील मसुद्यांचा इतिहास", noHistory: "कोणतेही जतन केलेले मसुदे नाहीत.", loadDraft: "लोड करा"
  },
  Gujarati: {
    brand: "અધિકાર AI", tagline: "ઓટોમેટેડ RTI ડ્રાફ્ટિંગ સહાયક",
    heroTitle: "તરત જ RTI અરજીઓ દાખલ કરો",
    heroDesc: "તમારી સમસ્યા કોઈપણ ભાષામાં વર્ણવો. અમારું AI અંગ્રેજીમાં અરજી તૈયાર કરશે.",
    getStarted: "શરૂ કરો →", formTitle: "RTI અરજી બનાવો",
    nameLabel: "અરજદારનું પૂરું નામ", namePlaceholder: "તમારું પૂરું નામ દાખલ કરો",
    addressLabel: "પત્રવ્યવહાર સરનામું", addressPlaceholder: "પૂરું સરનામું દાખલ કરો",
    cityLabel: "શહેર / જિલ્લો", cityPlaceholder: "તમારું શહેર અથવા જિલ્લો દાખલ કરો",
    pincodeLabel: "પિનકોડ", pincodePlaceholder: "૬-અંકનો પિનકોડ દાખલ કરો",
    problemLabel: "તમારી સમસ્યા વર્ણવો", problemPlaceholder: "તમારી સમસ્યા સ્પષ્ટપણે જણાવો...",
    micButton: "🎙️ બોલો", stopMic: "🔴 અટકાવો",
    submitButton: "સત્તાવાર RTI અરજી બનાવો", loadingText: "ડ્રાફ્ટ તૈયાર થઈ રહ્યો છે...",
    sectionATitle: "બનાવેલ RTI અરજી", copyBtn: "કોપી", copied: "✓ કોપી થઈ ગયું", pdfBtn: "📥 PDF ડાઉનલોડ",
    sectionBTitle: "સબમિશન માર્ગદર્શિકા", backHome: "← પાછા જાઓ",
    historyTitle: "📜 અગાઉના ડ્રાફ્ટ ઇતિહાસ", noHistory: "કોઈ સંગ્રહિત ડ્રાફ્ટ નથી.", loadDraft: "લોડ કરો"
  },
  Urdu: {
    brand: "ادھیکار AI", tagline: "خودکار آر ٹی آئی ڈرافٹنگ اسسٹنٹ",
    heroTitle: "فوری طور پر آر ٹی آئی درخواستیں داخل کریں",
    heroDesc: "کسی بھی زبان میں اپنی مشکل بیان کریں۔ ہماری AI انگریزی میں درخواست تیار کرے گی۔",
    getStarted: "شروع کریں →", formTitle: "آر ٹی آئی درخواست بنائیں",
    nameLabel: "درخواست گزار کا پورا نام", namePlaceholder: "اپنا پورا نام درج کریں",
    addressLabel: "خط و کتابت کا پتہ", addressPlaceholder: "مکمل پتہ درج کریں",
    cityLabel: "شہر / ضلع", cityPlaceholder: "اپنا شہر یا ضلع درج کریں",
    pincodeLabel: "پِن کوڈ", pincodePlaceholder: "6 ہندسوں کا پِن کوڈ درج کریں",
    problemLabel: "اپنی پریشانی یا مطلوبہ معلومات بیان کریں", problemPlaceholder: "اپنی مشکل واضح طور پر بیان کریں...",
    micButton: "🎙️ بولیں", stopMic: "🔴 بند کریں",
    submitButton: "آفیشل آر ٹی آئی درخواست بنائیں", loadingText: "ڈرافٹ تیار ہو رہا ہے...",
    sectionATitle: "تیار کردہ آر ٹی آئی درخواست", copyBtn: "کاپی", copied: "✓ کاپی ہو گیا", pdfBtn: "📥 PDF ڈاؤن لوڈ",
    sectionBTitle: "جمع کرانے کی ہدایات", backHome: "← واپس جائیں",
    historyTitle: "📜 گزشتہ ڈرافٹس کی ہسٹری", noHistory: "ابھی تک کوئی ڈرافٹ محفوظ نہیں ہے۔", loadDraft: "لوڈ کریں"
  },
  Kannada: {
    brand: "ಅಧಿಕಾರ್ AI", tagline: "ಸ್ವಯಂಚಾಲಿತ RTI ಡ್ರಾಫ್ಟಿಂಗ್ ಸಹಾಯಕ",
    heroTitle: "ತ್ವರಿತವಾಗಿ RTI ಅರ್ಜಿಗಳನ್ನು ಸಲ್ಲಿಸಿ",
    heroDesc: "ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಯಾವುದೇ ಭಾಷೆಯಲ್ಲಿ ವಿವರಿಸಿ. ನಮ್ಮ AI ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಅರ್ಜಿಯನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತದೆ.",
    getStarted: "ಪ್ರಾರಂಭಿಸಿ →", formTitle: "RTI ಅರ್ಜಿ ರಚಿಸಿ",
    nameLabel: "ಅರ್ಜಿದಾರರ ಪೂರ್ಣ ಹೆಸರು", namePlaceholder: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
    addressLabel: "ಪತ್ರವ್ಯವಹಾರ ವಿಳಾಸ", addressPlaceholder: "ನಿಮ್ಮ ಪೂರ್ಣ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ",
    cityLabel: "ನಗರ / ಜಿಲ್ಲೆ", cityPlaceholder: "ನಿಮ್ಮ ನಗರ ಅಥವಾ ಜಿಲ್ಲೆಯನ್ನು ನಮೂದಿಸಿ",
    pincodeLabel: "ಪಿನ್‌ಕೋಡ್", pincodePlaceholder: "6 ಅಂಕಿಯ ಪಿನ್‌ಕೋಡ್ ನಮೂದಿಸಿ",
    problemLabel: "ನಿಮ್ಮ ಸಮಸ್ಯೆ ಅಥವಾ ಮಾಹಿತಿಯನ್ನು ವಿವರಿಸಿ", problemPlaceholder: "ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ವಿವರಿಸಿ...",
    micButton: "🎙️ ಮಾತನಾಡಿ", stopMic: "🔴 ನಿಲ್ಲಿಸಿ",
    submitButton: "ಅಧಿಕೃತ RTI ಅರ್ಜಿ ರಚಿಸಿ", loadingText: "ಡ್ರಾಫ್ಟ್ ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...",
    sectionATitle: "ರಚಿತವಾದ RTI ಅರ್ಜಿ", copyBtn: "ಕಾಪಿ", copied: "✓ ಕಾಪಿ ಮಾಡಲಾಗಿದೆ", pdfBtn: "📥 PDF ಡೌನ್‌ಲೋಡ್",
    sectionBTitle: "ಸಲ್ಲಿಕೆ ಮಾರ್ಗಸೂಚಿಗಳು", backHome: "← ಹೋಮ್‌ಗೆ ಹಿಂತಿರುಗಿ",
    historyTitle: "📜 ಹಿಂದಿನ ಡ್ರಾಫ್ಟ್‌ಗಳ ಇತಿಹಾಸ", noHistory: "ಯಾವುದೇ ಉಳಿಸಿದ ಡ್ರಾಫ್ಟ್‌ಗಳಿಲ್ಲ.", loadDraft: "ಲೋಡ್ ಮಾಡಿ"
  },
  Malayalam: {
    brand: "അധികാർ AI", tagline: "ഓട്ടോമേറ്റഡ് RTI ഡ്രാഫ്റ്റിംഗ് അസിസ്റ്റന്റ്",
    heroTitle: "പെട്ടെന്ന് RTI അപേക്ഷകൾ സമർപ്പിക്കുക",
    heroDesc: "ഏത് ഭാഷയിലും നിങ്ങളുടെ പ്രശ്നം വിവരിക്കുക. ഞങ്ങളുടെ AI ഇംഗ്ലീഷിൽ അപേക്ഷ തയ്യാറാക്കുന്നു.",
    getStarted: "തുടങ്ങുക →", formTitle: "RTI അപേക്ഷ സൃഷ്ടിക്കുക",
    nameLabel: "അപേക്ഷകന്റെ മുഴുവൻ പേര്", namePlaceholder: "നിങ്ങളുടെ മുഴുവൻ പേര് നൽകുക",
    addressLabel: "മേൽവിലാസം", addressPlaceholder: "നിങ്ങളുടെ പൂർണ്ണമായ മേൽവിലാസം നൽകുക",
    cityLabel: "നഗരം / ജില്ല", cityPlaceholder: "നിങ്ങളുടെ നഗരം അല്ലെങ്കിൽ ജില്ല നൽകുക",
    pincodeLabel: "പിൻകോഡ്", pincodePlaceholder: "6 അക്ക പിൻകോഡ് നൽകുക",
    problemLabel: "നിങ്ങളുടെ പ്രശ്നം വിവരിക്കുക", problemPlaceholder: "നിങ്ങളുടെ പ്രശ്നം വ്യക്തമായി വിവരിക്കുക...",
    micButton: "🎙️ സംസാരിക്കുക", stopMic: "🔴 നിർത്തുക",
    submitButton: "ഔദ്യോഗിക RTI അപേക്ഷ ജനറേറ്റുചെയ്യുക", loadingText: "ഡ്രാഫ്റ്റ് തയ്യാറാക്കുന്നു...",
    sectionATitle: "ഉണ്ടാക്കിയ RTI അപേക്ഷ", copyBtn: "കോപ്പി", copied: "✓ കോപ്പി ചെയ്തു", pdfBtn: "📥 PDF ഡൗൺലോഡ്",
    sectionBTitle: "സമർപ്പിക്കാനുള്ള മാർഗ്ഗനിർദ്ദേശങ്ങൾ", backHome: "← തിരികെ പോവുക",
    historyTitle: "📜 മുൻകാല ഡ്രാഫ്റ്റ് ചരിത്രം", noHistory: "സേവ് ചെയ്ത ഡ്രാഫ്റ്റുകൾ ഒന്നും ഇല്ല.", loadDraft: "ലോഡ് ചെയ്യുക"
  },
  Odia: {
    brand: "ଅଧିକାର AI", tagline: "ସ୍ୱୟଂଚାଳିତ RTI ଡ୍ରାଫ୍ଟିଂ ସହାୟକ",
    heroTitle: "ତ୍ୱରିତ RTI ଆବେଦନ ଦାଖଲ କରନ୍ତୁ",
    heroDesc: "ଯେକୌଣସି ଭାଷାରେ ଆପଣଙ୍କ ସମସ୍ୟା ବର୍ଣ୍ଣନା କରନ୍ତୁ। ଆମର AI ଇଂରାଜୀରେ ଆବେଦନ ପ୍ରସ୍ତୁତ କରିବ।",
    getStarted: "ଆରମ୍ଭ କରନ୍ତୁ →", formTitle: "RTI ଆବେଦନ ସୃଷ୍ଟି କରନ୍ତୁ",
    nameLabel: "ଆବେଦନକାରୀଙ୍କ ପୂର୍ଣ୍ଣ ନାମ", namePlaceholder: "ଆପଣଙ୍କ ପୂର୍ଣ୍ଣ ନାମ ପ୍ରବେଶ କରନ୍ତୁ",
    addressLabel: "ପତ୍ରାଳୟ ଠିକଣା", addressPlaceholder: "ସମ୍ପୂର୍ଣ୍ଣ ଠିକଣା ପ୍ରବେଶ କରନ୍ତୁ",
    cityLabel: "ସହର / ଜିଲ୍ଲା", cityPlaceholder: "ଆପଣଙ୍କ ସହର ବା ଜିଲ୍ଲା ପ୍ରବେଶ କରନ୍ତୁ",
    pincodeLabel: "ପିନକୋଡ୍", pincodePlaceholder: "6-ଅଙ୍କ ବିଶିଷ୍ଟ ପିନକୋଡ୍ ପ୍ରବେଶ କରନ୍ତୁ",
    problemLabel: "ଆପଣଙ୍କ ସମସ୍ୟା ବର୍ଣ୍ଣନା କରନ୍ତୁ", problemPlaceholder: "ଆପଣଙ୍କ ସମସ୍ୟା ସ୍ପଷ୍ଟ ଭାବରେ ବର୍ଣ୍ଣନା କରନ୍ତୁ...",
    micButton: "🎙️ କହନ୍ତୁ", stopMic: "🔴 ବନ୍ଦ କରନ୍ତୁ",
    submitButton: "ଅଫିସିଆଲ୍ RTI ଆବେଦନ ଜେନେରେଟ୍ କରନ୍ତୁ", loadingText: "ଡ୍ରାଫ୍ଟ ପ୍ରସ୍ତୁତ ହେଉଛି...",
    sectionATitle: "ପ୍ରସ୍ତୁତ RTI ଆବେଦନ", copyBtn: "କପି", copied: "✓ କପି ହୋଇଛି", pdfBtn: "📥 PDF Download",
    sectionBTitle: "ଦାଖଲ ନିର୍ଦ୍ଦେଶାବଳୀ", backHome: "← ହୋମକୁ ଫେରନ୍ତୁ",
    historyTitle: "📜 ପୂର୍ବବର୍ତୀ ଡ୍ରାଫ୍ଟ ଇତିହାସ", noHistory: "କୌଣସି ସଂରକ୍ଷିତ ଡ୍ରାଫ୍ଟ ନାହିଁ।", loadDraft: "ଲୋଡ୍ କରନ୍ତୁ"
  },
  Punjabi: {
    brand: "ਅਧਿਕਾਰ AI", tagline: "ਆਟੋਮੇਟਿਡ RTI ਡ੍ਰਾਫਟਿੰਗ ਸਹਾਇਕ",
    heroTitle: "ਝੱਟ RTI ਅਰਜ਼ੀਆਂ ਦਾਖਲ ਕਰੋ",
    heroDesc: "ਆਪਣੀ ਸਮੱਸਿਆ ਕਿਸੇ ਵੀ ਭਾਸ਼ਾ ਵਿੱਚ ਦੱਸੋ। ਸਾਡੀ AI ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਅਰਜ਼ੀ ਤਿਆਰ ਕਰੇਗੀ।",
    getStarted: "ਸ਼ੁਰੂ ਕਰੋ →", formTitle: "RTI ਅਰਜ਼ੀ ਬਣਾਓ",
    nameLabel: "ਬਿਨੈਕਾਰ ਦਾ ਪੂਰਾ ਨਾਮ", namePlaceholder: "ਆਪਣਾ ਪੂਰਾ ਨਾਮ ਦਰਜ ਕਰੋ",
    addressLabel: "ਪਤਾ", addressPlaceholder: "ਆਪਣਾ ਪੂਰਾ ਪਤਾ ਦਰਜ ਕਰੋ",
    cityLabel: "ਸ਼ਹਿਰ / ਜ਼िला", cityPlaceholder: "अपना शहर दर्ज करो",
    pincodeLabel: "ਪਿੰਨਕੋਡ", pincodePlaceholder: "6-ಅಂಕದ ಪಿನ್ಕೋಡ್ दर्ज करो",
    problemLabel: "ਆਪਣੀ ਸਮੱਸਿਆ ਦਾ ਵਰਣਨ ਕਰੋ", problemPlaceholder: "ਆਪਣੀ ਸਮੱਸਿਆ ਸਪੱਸ਼ਟ ਤੌਰ 'ਤੇ ਦੱਸੋ...",
    micButton: "🎙️ ਬੋਲੋ", stopMic: "🔴 ਬੰਦ ਕਰੋ",
    submitButton: "ਅਧਿਕਾਰਤ RTI ਅਰਜ਼ੀ ਤਿਆਰ ਕਰੋ", loadingText: "ਡ੍ਰਾਫਟ ਤਿਆਰ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
    sectionATitle: "ਤਿਆਰ ਕੀਤੀ RTI ਅਰਜ਼ੀ", copyBtn: "ਕਾਪੀ", copied: "✓ ਕਾਪੀ ਹੋ ਗਿਆ", pdfBtn: "📥 PDF Download",
    sectionBTitle: "ਜਮ੍ਹਾਂ ਕਰਾਉਣ ਦੀਆਂ ਹਦਾਇਤਾਂ", backHome: "← ਹੋਮ 'ਤੇ ਜਾਓ",
    historyTitle: "📜 ਪਿਛਲੇ ਡ੍ਰਾਫਟਾਂ ਦਾ ਇਤਿਹਾਸ", noHistory: "ਕੋਈ ਸੁਰੱਖਿਅਤ ਡ੍ਰਾਫਟ ਨਹੀਂ ਹੈ।", loadDraft: "ਲੋਡ ਕਰੋ"
  },
  Assamese: {
    brand: "অধিকাৰ AI", tagline: "স্বয়ংক্ৰিয় RTI ড্ৰাফটিং সহকাৰী",
    heroTitle: "তক্ষনিকভাৱে RTI আবেদন দাখিল কৰক",
    heroDesc: "যিকোনো ভাষাত আপোনাৰ সমস্যা বৰ্ণনা কৰক। আমাৰ AI এ ইংৰাজীত আবেদন প্ৰস্তুত কৰিব।",
    getStarted: "আৰম্ভ কৰক →", formTitle: "RTI আবেদন সৃষ্টি কৰক",
    nameLabel: "আবেদনকাৰীৰ সম্পূৰ্ণ নাম", namePlaceholder: "আপোনাৰ সম্পূৰ্ণ নাম প্ৰৱেশ কৰক",
    addressLabel: "যোগাযোগৰ ঠিকনা", addressPlaceholder: "সম্পূৰ্ণ ঠিকনা প্ৰৱেশ কৰক",
    cityLabel: "চহৰ / জিলা", cityPlaceholder: "আপোনাৰ চহৰ বা জিলা প্ৰৱেশ কৰক",
    pincodeLabel: "পিনক’ড", pincodePlaceholder: "৬-সংখ্যাৰ পিনক’ড প্ৰৱেশ কৰক",
    problemLabel: "আপোনাৰ সমস্যা বৰ্ণনা কৰক", problemPlaceholder: "আপোনাৰ সমস্যা স্পষ্টভাৱে বৰ্ণনা কৰক...",
    micButton: "🎙️ কওক", stopMic: "🔴 বন্ধ কৰক",
    submitButton: "অফিচিয়েল RTI আবেদন জেনেৰেট কৰক", loadingText: "ড্ৰাফ্ট প্ৰস্তুত হৈ আছে...",
    sectionATitle: "প্ৰস্তুত কৰা RTI আবেদন", copyBtn: "কপি", copied: "✓ কপি কৰা হ'ল", pdfBtn: "📥 PDF Download",
    sectionBTitle: "দাখিল কৰাৰ নিৰ্দেস্নাৱলী", backHome: "← ঘৰলৈ উভতি যাওক",
    historyTitle: "📜 পূৰ্বৰ ড্ৰাফ্টসমূহৰ ইতিহাস", noHistory: "কোনো সংগৃহীত ড্ৰাফ্ট নাই।", loadDraft: "লোড কৰক"
  },
  Maithili: {
    brand: "अधिकार AI", tagline: "स्वचालित RTI ड्राफ्टिंग सहायक",
    heroTitle: "त्वरित RTI आवेदन दाखिल करू",
    heroDesc: "अपन समस्या कोनो भाषा में लिखू। हमर AI अंग्रेजी में आवेदन तैयार करत।",
    getStarted: "प्रारंभ करू →", formTitle: "RTI आवेदन बनाउ",
    nameLabel: "आवेदकक पूरा नाम", namePlaceholder: "अपन पूरा नाम लिखू",
    addressLabel: "पत्ता", addressPlaceholder: "अपन पूरा पत्ता लिखू",
    cityLabel: "शहर / जिला", cityPlaceholder: "अपन शहर वा जिला लिखू",
    pincodeLabel: "पिनकोड", pincodePlaceholder: "६ अंकक पिनकोड लिखू",
    problemLabel: "अपन समस्या वर्णन करू", problemPlaceholder: "अपन समस्या स्पष्ट रूप सँ लिखू...",
    micButton: "🎙️ बोलू", stopMic: "🔴 बन्द करू",
    submitButton: "आधिकारिक RTI आवेदन जनरेट करू", loadingText: "ड्राफ्ट तैयार भेल जा रहल अछि...",
    sectionATitle: "तैयार RTI आवेदन", copyBtn: "कॉपी", copied: "✓ कॉपी भ गेल", pdfBtn: "📥 PDF Download",
    sectionBTitle: "जमा करबाक दिशानिर्देश", backHome: "← होम पर जाउ",
    historyTitle: "📜 पिछला ड्राफ्ट इतिहास", noHistory: "कोनो सुरक्षित ड्राफ्ट नै अछि।", loadDraft: "लोड करू"
  },
  Sanskrit: {
    brand: "अधिकार AI", tagline: "स्वचालित-RTI-लेखन-सहायकः",
    heroTitle: "शीघ्रमेव RTI-आवेदनं प्रेषयन्तु",
    heroDesc: "कस्यामपि भाषायां स्वसमस्यां वदन्तु। अस्माकं AI आङ्ग्लभाषया आवेदनं रचयिष्यति।",
    getStarted: "प्रारभ्यताम् →", formTitle: "RTI-आवेदनं रचयन्तु",
    nameLabel: "वेदकस्य पूर्णं नाम", namePlaceholder: "पूर्णं नाम लिखन्तु",
    addressLabel: "पत्राचार-सङ्केतः", addressPlaceholder: "पूर्णं सङ्केतं लिखन्तु",
    cityLabel: "नगरम् / जनपदम्", cityPlaceholder: "नगरस्य नाम लिखन्तु",
    pincodeLabel: "पिन्-सङ्केतः", pincodePlaceholder: "६-अङ्कीय पिन्-सङ्केतं लिखन्तु",
    problemLabel: "समस्यायाः विवरणं ददतु", problemPlaceholder: "स्पष्टतया समस्यां लिखन्तु...",
    micButton: "🎙️ वदन्तु", stopMic: "🔴 स्थगयन्तु",
    submitButton: "कार्यालयीय-RTI-आवेदनं जनरेंट कुर्वन्तु", loadingText: "डार्फ्ट रचयते...",
    sectionATitle: "रचितं RTI-आवेदनम्", copyBtn: "प्रतिलिपि", copied: "✓ प्रतिलिपिः कृता", pdfBtn: "📥 PDF Download",
    sectionBTitle: "निर्देशाः", backHome: "← मुख्यपृष्ठं प्रति गच्छन्तु",
    historyTitle: "📜 पूर्ववर्ती ड्राफ्ट-इतिहासः", noHistory: "सुरक्षितं ड्राफ्टं नास्ति।", loadDraft: "लोड कुर्वन्तु"
  },
  Kashmiri: {
    brand: "अधिकार AI", tagline: "اتومېټیډ RTI ډرافټنګ اسسټنټ",
    heroTitle: "فوری طور پؠٹھ آر ٹی آئی درخواست جمع کریو",
    heroDesc: "پنٛنہٕ مشکل کینٛہہ ژب ہندس مَنٛز بیان کریو۔ اسٛنٛد AI کَرِ انگریزی مَنٛز درخواست تیار۔",
    getStarted: "شروع کریو →", formTitle: "RTI درخواست بنایو",
    nameLabel: "درخواست گزار سٕنز پورا ناو", namePlaceholder: "پُنٛنہٕ پورا ناو لِخیو",
    addressLabel: "پتہٕ", addressPlaceholder: "مُکَمَل پتہٕ لِخیو",
    cityLabel: "شہر / ضِلَع", cityPlaceholder: "پنٛنہٕ شہر لِخیو",
    pincodeLabel: "پِن کوڈ", pincodePlaceholder: "6 ہندسَن ہُنٛد پِن کوڈ لِخیو",
    problemLabel: "پنٛنہٕ مشکل بیان کریو", problemPlaceholder: "پنٛنہٕ مشکل صاف صاف بیان کریو...",
    micButton: "🎙️ بۄلیو", stopMic: "🔴 بند کریو",
    submitButton: "آفیشل RTI درخواست جِنریٹ کریو", loadingText: "ڈرافٹ چھُ تیار گژھان...",
    sectionATitle: "تِیار کٔرمٕژ RTI درخواست", copyBtn: "کاپی", copied: "✓ کاپی گٔے", pdfBtn: "📥 PDF Download",
    sectionBTitle: "جمع کرنہٕ ہِنٛدۍ ہدایات", backHome: "← واپس گاتیُو",
    historyTitle: "📜 گزۄرمٕژ ڈرافٹ ہسٹری", noHistory: "ਕہِ ڈرافٹ چھُنہٕ محفوظ۔", loadDraft: "لوڈ کریو"
  },
  Sindhi: {
    brand: "अधिकार AI", tagline: "خودڪار RTI ڊرافٽنگ اسسٽنٽ",
    heroTitle: "فوراً RTI درخواستون داخل ڪريو",
    heroDesc: "پنهنجي مسئلي کي ڪنهن به ٻولي ۾ بيان ڪريو. اسان جو AI انگريزيءَ ۾ درخواست تيار ڪندو.",
    getStarted: "شروع ڪريو →", formTitle: "RTI درخواست ٺاهيو",
    nameLabel: "درخواست گذار جو پورو نالو", namePlaceholder: "پنهنجو پورو نالو داخل ڪريو",
    addressLabel: "پتو", addressPlaceholder: "پنهنجو پورو پتو داخل ڪريو",
    cityLabel: "شهر / ضلعو", cityPlaceholder: "پنهنجو شهر يا ضلعو داخل ڪريو",
    pincodeLabel: "پنڪوڊ", pincodePlaceholder: "6-اکرن جو پنڪوڊ داخل ڪريو",
    problemLabel: "پنهنجو مسئلو بيان ڪريو", problemPlaceholder: "پنهنجو مسئلو واضح طور تي بيان ڪريو...",
    micButton: "🎙️ ڳالهايو", stopMic: "🔴 بند ڪريو",
    submitButton: "سرڪاري RTI درخواست پيدا ڪريو", loadingText: "ڊرافٽ تيار ٿي رهيو آهي...",
    sectionATitle: "تيار ڪيل RTI درخواست", copyBtn: "ڪاپي", copied: "✓ ڪاپي ٿي ويو", pdfBtn: "📥 PDF Download",
    sectionBTitle: "جمع ڪرائڻ جون هدايتون", backHome: "← واپس هوم ڏانهن",
    historyTitle: "📜 پوئين ڊرافٽ جو تارِيخچو", noHistory: "ڪو به محفوظ ٿيل ڊرافٽ ناهي.", loadDraft: "لوڊ ڪريو"
  },
  Konkani: {
    brand: "अधिकार AI", tagline: "ऑटोमेटेड RTI ड्राफ्टिंग सहाय्यक",
    heroTitle: "बेगोबेग RTI अर्ज सादर करा",
    heroDesc: "तुमची समस्या कोणतये भाषेत सांगा. आमची AI इंग्रजीत अर्ज तयार करतली.",
    getStarted: "सुरू करा →", formTitle: "RTI अर्ज तयार करा",
    nameLabel: "अर्जदाराचें पुराय नांव", namePlaceholder: "तुमचें पुराय नांव घाला",
    addressLabel: "पत्ता", addressPlaceholder: "पुराय पत्ता घाला",
    cityLabel: "शार / जिल्लो", cityPlaceholder: "तुमचें शार वा जिल्लो घाला",
    pincodeLabel: "पिनकोड", pincodePlaceholder: "६ अंकी पिनकोड घाला",
    problemLabel: "तुमची समस्या सांगा", problemPlaceholder: "तुमची समस्या स्पश्टपणान सांगा...",
    micButton: "🎙️ उलोवचें", stopMic: "🔴 बंद करचें",
    submitButton: "अधिकृत RTI अर्ज तयार करा", loadingText: "ड्राफ्ट तयार जाता...",
    sectionATitle: "तयार केल्लो RTI अर्ज", copyBtn: "कॉपी", copied: "✓ कॉपी जालो", pdfBtn: "📥 PDF Download",
    sectionBTitle: "सादर करपाच्यो मार्गदर्शक सुचना", backHome: "← परतून वचचें",
    historyTitle: "📜 आदीं तयार केल्ल्या ड्राफ्टाचो इतिहास", noHistory: "कोणूच जतन केल्लो ड्राफ्ट ना.", loadDraft: "लोड करचें"
  },
  Nepali: {
    brand: "अधिकार AI", tagline: "स्वचालित RTI ड्राफ्टिङ सहायक",
    heroTitle: "तत्काल सूचनाको हक (RTI) निवेदन दर्ता गर्नुहोस्",
    heroDesc: "तपाईंको समस्या जुनसुकै भाषामा वर्णन गर्नुहोस्। हाम्रो AI ले अंग्रेजीमा निवेदन तयार गर्नेछ।",
    getStarted: "सुरु गर्नुहोस् →", formTitle: "RTI निवेदन तयार गर्नुहोस्",
    nameLabel: "निवेदकको पूरा नाम", namePlaceholder: "तपाईंको पूरा नाम लेख्नुहोस्",
    addressLabel: "ठेगाना", addressPlaceholder: "तपाईंको पूरा ठेगाना लेख्नुहोस्",
    cityLabel: "शहर / जिल्ला", cityPlaceholder: "तपाईंको शहर वा जिल्ला लेख्नुहोस्",
    pincodeLabel: "पिनकोड", pincodePlaceholder: "६ अंकको पिनकोड लेख्नुहोस्",
    problemLabel: "तपाईंको समस्या वर्णन गर्नुहोस्", problemPlaceholder: "तपाईंको समस्या स्पष्ट रूपमा लेख्नुहोस्...",
    micButton: "🎙️ बोल्नुहोस्", stopMic: "🔴 बन्द गर्नुहोस्",
    submitButton: "आधिकारिक RTI निवेदन जेनेरेट गर्नुहोस्", loadingText: "ड्राफ्ट तयार हुँदैछ...",
    sectionATitle: "तयार गरिएको RTI निवेदन", copyBtn: "कपी", copied: "✓ कपी भयो", pdfBtn: "📥 PDF Download",
    sectionBTitle: "बुझाउने निर्देशिका", backHome: "← गृहपृष्ठमा फर्कनुहोस्",
    historyTitle: "📜 अघिल्ला ड्राफ्टहरूको इतिहास", noHistory: "कुनै सेभ गरिएको ड्राफ्ट छैन।", loadDraft: "लोड गर्नुहोस्"
  },
  Dogri: {
    brand: "अधिकार AI", tagline: "स्वचालित RTI ड्राफ्टिंग सहायक",
    heroTitle: "फौरन RTI अरजियां दाखिल करो",
    heroDesc: "अपनी समस्या के केह् बी भाषा च दस्सो। साड्डा AI अंग्रेजी च अरज तैयार करगा।",
    getStarted: "शुरू करो →", formTitle: "RTI अरजी बनाओ",
    nameLabel: "अरजीकर्ता दा पूरा नां", namePlaceholder: "अपना पूरा नां दर्ज करो",
    addressLabel: "पता", addressPlaceholder: "पूरा पता दर्ज करो",
    cityLabel: "शहर / जिला", cityPlaceholder: "अपना शहर या जिला दर्ज करो",
    pincodeLabel: "पिनकोड", pincodePlaceholder: "6-अंकी पिनकोड दर्ज करो",
    problemLabel: "अपनी समस्या दा बर्णन करो", problemPlaceholder: "अपनी समस्या स्पष्ट रूप कन्नै दस्सो...",
    micButton: "🎙️ बोलू", stopMic: "🔴 बंद करो",
    submitButton: "आधिकारिक RTI अरजी जनरेट करो", loadingText: "ड्राफ्ट तैयार होई रिया ऐ...",
    sectionATitle: "तैयार कीती गेदी RTI अरजी", copyBtn: "काफी", copied: "✓ काफी होई गी", pdfBtn: "📥 PDF Download",
    sectionBTitle: "जमा करा दी दिशानिर्देश", backHome: "← वापस जाओ",
    historyTitle: "📜 पिछले ड्राफ्ट दा इतिहास", noHistory: "कोई बी सेभ कीता ड्राफ्ट नेईं ऐ।", loadDraft: "लोड करो"
  },
  Manipuri: {
    brand: "अधिकार AI", tagline: "ઓటోમેટેಡ್ RTI ड्राफ्टिंग असिस्टेन्ट",
    heroTitle: "மতম ചানা RTI अपिल ਤౌרו",
    heroDesc: "ம समस्या অদু भাশাদা হায়বিয়ু।",
    getStarted: "হৌরকউ →", formTitle: "RTI अपिल শাক্তোকউ",
    nameLabel: "अपिल তৌবা মমিং", namePlaceholder: "மমিং ইবা",
    addressLabel: "অদুম", addressPlaceholder: "অদুম ইবা",
    cityLabel: "শহর / জেলা", cityPlaceholder: "শহর ইবা",
    pincodeLabel: "পিনকোড", pincodePlaceholder: "পিনকোড ইবা",
    problemLabel: "समस्या খঙহনবা", problemPlaceholder: "চানা খঙহনবা...",
    micButton: "🎙️ ಹায়নবা", stopMic: "🔴 থিংবা",
    submitButton: "RTI अपिल শাবা", loadingText: "শাজিনবা...",
    sectionATitle: "শাবা RTI अपिल", copyBtn: "কপি", copied: "✓ কপি তৌখ্রে", pdfBtn: "📥 PDF Download",
    sectionBTitle: "লমত পথপ", backHome: "← হন্না চঙশিনবা",
    historyTitle: "📜 மমাংগী ड्राफ्ट হისტРИ", noHistory: "সেভ তৌবা ड्राफ्ट লৈতে।", loadDraft: "লোড তৌবা"
  },
  Bodo: {
    brand: "अधिकार AI", tagline: "सोखोमा RTI ड्राफ्टिंग मददगिरि",
    heroTitle: "फरियायै RTI आरज थिसिन",
    heroDesc: "नोंनि प्रब्लमखौ जेब्लानो फोरमाय। जोंनि AI आ इंग्राजीजों आरज थियारी खालामगोन।",
    getStarted: "हमजाव →", formTitle: "RTI आरज थियारी खालाम",
    nameLabel: "आरज थिनगिरिनि मुं", namePlaceholder: "नोंनि मुं थिसिन",
    addressLabel: "थायनाय जायगा", addressPlaceholder: "पूरा থायनाय थिसिन",
    cityLabel: "शहर / जिल्ला", cityPlaceholder: "शहर थिसिन",
    pincodeLabel: "পিনকোড", pincodePlaceholder: "পিনকোড थिसिन",
    problemLabel: "नोंनि प्रब्लम फोरमाय", problemPlaceholder: "प्रब्लमखौ थुलुंगायै फोरमाय...",
    micButton: "🎙️ খौरां बुं", stopMic: "🔴 बोन्द खालाम",
    submitButton: "Oфициаल RTI আরজ থियारी खालाम", loadingText: "ড্ৰাফট থিয় হৈ আছে...",
    sectionATitle: "থিয় खालामनाय RTI আরজ", copyBtn: "কপি", copied: "✓ কপি खालामबाय", pdfBtn: "📥 PDF Download",
    sectionBTitle: "থিসিনবা দিকনির্দেশনা", backHome: "← गुइयाव थि फिदि",
    historyTitle: "📜 सिगांनि ड्राफ्ट ઇતિહાસ", noHistory: "जेबो सेभ खालामनाय ड्राफ्ट गैया।", loadDraft: "লোড खालाम"
  },
  Santali: {
    brand: "अधिकार AI", tagline: "स्वचालित RTI ड्राफ्टिंग सहायक",
    heroTitle: "Unka RTI arj dakhol me",
    heroDesc: "Aam-ak problem oka bhasatege ror me. Angrejite arj tayar-a.",
    getStarted: "Stru me →", formTitle: "RTI arj benao me",
    nameLabel: "Arj-ak-iaq nutum", namePlaceholder: "Nutum aled me",
    addressLabel: "Thana thikana", addressPlaceholder: "Thikana aled me",
    cityLabel: "Sahar / District", cityPlaceholder: "Sahar name aled me",
    pincodeLabel: "Pincode", pincodePlaceholder: "Pincode aled me",
    problemLabel: "Problem aled me", problemPlaceholder: "Problem sposto ro-me...",
    micButton: "🎙️ Ror me", stopMic: "🔴 Atkanto me",
    submitButton: "Ofisial RTI arj genret me", loadingText: "Draft tayarok kana...",
    sectionATitle: "Tayar RTI arj", copyBtn: "Copy", copied: "✓ Copy encana", pdfBtn: "📥 PDF Download",
    sectionBTitle: "Submission nirdes", backHome: "← Home te ropodo",
    historyTitle: "📜 Mand-ak draft history", noHistory: "Oka draft hu ba-nuq.", loadDraft: "Load me"
  }
};

export default function App() {
  const [step, setStep] = useState('landing');
  const [language, setLanguage] = useState('English');
  const [isListening, setIsListening] = useState(false);
  const [apiOnline, setApiOnline] = useState(null);

  const [formData, setFormData] = useState({
    applicant_name: '',
    address: '',
    city: '',
    pincode: '',
    state: 'Tamil Nadu',
    phone: '',
    email: '',
    question: '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [filingStatus, setFilingStatus] = useState('Draft');
  const [filedAt, setFiledAt] = useState(null);
  const [loadingStage, setLoadingStage] = useState(0);

  const t = UI_TEXT[language] || UI_TEXT['English'];

  useEffect(() => {
    fetch(apiUrl('/api/health'))
      .then(res => setApiOnline(res.ok))
      .catch(() => setApiOnline(false));

    const savedHistory = localStorage.getItem('adhikar_rti_history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(Array.isArray(parsedHistory) && parsedHistory.length ? parsedHistory : DEMO_HISTORY);
      } catch (e) {
        console.error("Failed to parse history", e);
        setHistory(DEMO_HISTORY);
      }
    } else {
      setHistory(DEMO_HISTORY);
    }
  }, []);

  useEffect(() => {
    if (!loading) return undefined;
    const timer = setInterval(() => setLoadingStage(stage => (stage + 1) % 3), 700);
    return () => clearInterval(timer);
  }, [loading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    const langObj = LANGUAGES.find(l => l.name === language);
    recognition.lang = langObj ? langObj.code : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setFormData(prev => ({
        ...prev,
        question: prev.question ? prev.question + ' ' + speechText : speechText
      }));
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

const handleSubmit = async (e, submissionData = formData) => {
  if (e) e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(apiUrl('/api/rti/draft'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...submissionData, language })
      });

      const data = await readJsonResponse(response);
      console.log("Backend Response Data:", data); // <-- Look at this in your browser F12 Console!

      setResult(data);
      setApiOnline(true);
      setFilingStatus('Draft');
      setFiledAt(null);

      const newEntry = {
        id: Date.now(),
        ...submissionData,
        rti_draft: data.rti_draft || data.draft || data.text || JSON.stringify(data),
        instructions: data.instructions || data.guidelines || data.steps || 'Follow standard portal guidelines.',
        department: data.department,
        public_authority: data.public_authority,
        pio: data.pio,
        confidence: data.confidence,
        state: data.state,
        status: 'Draft',
        language,
        date: new Date().toLocaleDateString()
      };

      const updatedHistory = [newEntry, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('adhikar_rti_history', JSON.stringify(updatedHistory));

      setStep('result');
    } catch (err) {
      console.error("Submission Error:", err);
      setApiOnline(false);
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSample = () => {
    setFormData(SAMPLE_FORM);
    setStep('form');
    handleSubmit(null, SAMPLE_FORM);
  };

  const handleCopy = () => {
    const textToCopy = result?.rti_draft || result?.draft || result?.text || result?.application || result?.response || '';
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPDF = () => {
    const textToPrint = result?.rti_draft || result?.draft || result?.text || result?.application || result?.response || '';
    const instToPrint = result?.instructions || result?.guidelines || result?.steps || '';
    if (!textToPrint) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>RTI Application - ${formData.applicant_name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
            h2 { text-align: center; margin-bottom: 20px; }
            pre { white-space: pre-wrap; font-family: Arial, sans-serif; font-size: 14px; background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .footer { margin-top: 30px; font-size: 12px; color: #445; border-top: 1px solid #ccc; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h2>RTI ONLINE PORTAL TEXT</h2>
          <pre>${textToPrint}</pre>
          <div class="footer">
            <p><strong>Submission Guidelines & Target Department:</strong><br/>${instToPrint}</p>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleLoadHistory = (item) => {
    setFormData({
      applicant_name: item.applicant_name || '',
      address: item.address || '',
      city: item.city || '',
      pincode: item.pincode || '',
      state: item.state || 'Tamil Nadu',
      phone: item.phone || '',
      email: item.email || '',
      question: item.question || ''
    });
    setResult({
      rti_draft: item.rti_draft,
      instructions: item.instructions
    });
    setStep('result');
    setFilingStatus(item.status || 'Draft');
    setFiledAt(item.filed_at || null);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('adhikar_rti_history');
  };

  const resolvedDraft = result?.rti_draft || result?.draft || result?.text || result?.application || result?.response || '';
  const resolvedInstructions = result?.instructions || result?.guidelines || result?.steps || 'Fill out the form on the landing page...';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setStep('landing')}>
            <img src={logo} alt="Adhikar AI Logo" className="w-24 h-28 object-contain rounded-xl" />
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight">{t.brand}</span>
              <span className="block text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">{t.tagline}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
              <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-500 animate-pulse' : apiOnline === false ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
              <span className="text-slate-600 font-medium">
                {apiOnline ? 'API Connected' : apiOnline === false ? 'API Offline' : 'Checking API...'}
              </span>
            </div>

            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-100 border border-slate-300 text-slate-800 text-sm rounded-lg p-2 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.name} value={lang.name}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Landing Page */}
      {step === 'landing' && (
        <main className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-block max-w-full px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold tracking-wide uppercase">
                🇮🇳 Citizen support for RTI and public services
              </span>
              <h1 className="max-w-4xl break-words text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {t.heroTitle}
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                {t.heroDesc}
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => setStep('form')}
                  className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  {t.getStarted}
                </button>
                <button
                  onClick={handleSample}
                  className="px-6 py-4 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 font-bold text-base transition-all cursor-pointer"
                >
                  Try a sample problem
                </button>
              </div>
            </div>

            {/* History Sidebar / Quick Access on Landing */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm">{t.historyTitle}</h3>
                {history.length > 0 && (
                  <button onClick={handleClearHistory} className="text-xs text-rose-600 hover:underline">Clear All</button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto space-y-3">
                {history.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-8 text-center">{t.noHistory}</p>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all flex items-center justify-between">
                      <div className="overflow-hidden pr-2">
                        <p className="text-xs font-bold text-slate-800 truncate">{item.applicant_name || 'RTI Draft'} ({item.city || 'Chennai'})</p>
                        <p className="text-[10px] text-slate-500">{item.date} • {item.language}</p>
                      </div>
                      <button
                        onClick={() => handleLoadHistory(item)}
                        className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-lg font-medium shrink-0 cursor-pointer"
                      >
                        {t.loadDraft}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Form Input Page */}
      {step === 'form' && (
        <main className="max-w-3xl mx-auto px-6 py-10">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">{t.formTitle}</h2>
              <button onClick={() => setStep('landing')} className="text-xs text-indigo-600 font-semibold hover:underline">
                {t.backHome}
              </button>
            </div>

            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t.nameLabel} *</label>
                <input
                  type="text"
                  name="applicant_name"
                  value={formData.applicant_name}
                  onChange={handleChange}
                  placeholder={t.namePlaceholder}
                  autoComplete="off"
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t.addressLabel} *</label>
                <textarea
                  name="address"
                  rows="2"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder={t.addressPlaceholder}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.cityLabel} *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder={t.cityPlaceholder}
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.pincodeLabel} *</label>
                  <input
                    type="text"
                    name="pincode"
                    maxLength="6"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder={t.pincodePlaceholder}
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm outline-none bg-white"
                >
                  {STATES.map(state => <option key={state} value={state}>{state}</option>)}
                </select>
                <p className="mt-1 text-[11px] text-slate-500">Used to tailor fee and submission guidance.</p>
              </div>
              <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                required
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email ID *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="yourname@gmail.com"
                required
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
              />
            </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">{t.problemLabel} *</label>
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className={`text-xs px-3 py-1 rounded-md font-medium flex items-center space-x-1 cursor-pointer ${
                      isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{isListening ? t.stopMic : t.micButton}</span>
                  </button>
                </div>
                <textarea
                  name="question"
                  rows="4"
                  value={formData.question}
                  onChange={handleChange}
                  placeholder={t.problemPlaceholder}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{['Reading your situation...', 'Matching the public authority...', 'Preparing your RTI draft...'][loadingStage]}</span>
                  </>
                ) : (
                  <span>{t.submitButton}</span>
                )}
              </button>
            </form>
          </div>
        </main>
      )}

      {/* Result Page */}
      {step === 'result' && (
        <main className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setStep('form')} className="text-xs text-indigo-600 font-bold hover:underline">
              {t.backHome}
            </button>
            <button onClick={() => setStep('landing')} className="text-xs text-slate-600 hover:underline">
              🏠 Home
            </button>
          </div>

          {result && (
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm md:col-span-2">
                <p className="text-[11px] uppercase tracking-wide font-bold text-indigo-600 mb-2">Routing recommendation</p>
                <h2 className="text-lg font-bold text-slate-900">{result.department || 'Public authority to verify'}</h2>
                <p className="mt-1 text-sm text-slate-600">{result.public_authority || 'Review the generated draft before filing.'}</p>
                <p className="mt-2 text-xs text-slate-500">PIO: {result.pio || 'Public Information Officer of the selected authority'}</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-600">Match confidence</span>
                  <div className="h-2 flex-1 max-w-xs rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${Math.round((result.confidence || 0) * 100)}%` }}></div></div>
                  <span className="text-xs font-bold text-emerald-700">{Math.round((result.confidence || 0) * 100)}%</span>
                </div>
                <p className="mt-2 text-[11px] text-slate-500">Confirm this recommendation on the official portal before submitting.</p>
              </div>
              <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-sm">
                <p className="text-[11px] uppercase tracking-wide font-bold text-indigo-300 mb-2">Filing tracker</p>
                <select value={filingStatus} onChange={e => { setFilingStatus(e.target.value); if (e.target.value === 'Filed') setFiledAt(new Date().toISOString()); }} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                  {(result.status_options || ['Draft', 'Filed', 'Awaiting Response', 'Appealed', 'Resolved']).map(status => <option key={status}>{status}</option>)}
                </select>
                {filedAt && <p className="mt-3 text-xs text-slate-300">Response window: 30 days from filing.</p>}
                {filedAt && <p className="mt-1 text-sm font-bold text-white">Due {new Date(new Date(filedAt).getTime() + 30 * 86400000).toLocaleDateString()}</p>}
                <p className="mt-3 text-[11px] text-slate-400">No response by day 30? Consider a First Appeal under Section 19(1).</p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* RTI Draft Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm">{t.sectionATitle}</h3>
                <div className="flex space-x-2">
                  <button onClick={handleCopy} className="text-xs px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium cursor-pointer">
                    {copied ? t.copied : t.copyBtn}
                  </button>
                  <button onClick={handleDownloadPDF} className="text-xs px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium cursor-pointer">
                    {t.pdfBtn}
                  </button>
                </div>
              </div>
              <div className="w-full h-96 p-4 bg-slate-50 border border-slate-200 rounded-xl overflow-y-auto whitespace-pre-wrap text-xs text-slate-800 font-mono">
                {resolvedDraft || 'No draft found. Please return to the form and submit again.'}
              </div>
            </div>

            {/* Submission Guidelines Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6">
              <h3 className="font-bold text-slate-900 text-sm mb-3">{t.sectionBTitle}</h3>
              <div className="w-full h-96 p-4 bg-slate-50 border border-slate-200 rounded-xl overflow-y-auto whitespace-pre-wrap text-xs text-slate-700">
                {resolvedInstructions}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}