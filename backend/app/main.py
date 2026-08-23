from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI(title="Adhikar AI 22-Language Backend", version="2.6")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STATE_CONFIG = {
    "Tamil Nadu": {"fee": "₹10 online fee; BPL applicants are exempt with valid proof.", "portal": "rtionline.gov.in"},
    "Karnataka": {"fee": "₹10 application fee; confirm the accepted payment method with the public authority.", "portal": "karnataka.gov.in"},
    "Maharashtra": {"fee": "₹10 application fee; confirm the accepted payment method with the public authority.", "portal": "rtionline.gov.in"},
    "Delhi": {"fee": "₹10 application fee through the applicable online or postal channel.", "portal": "rtionline.gov.in"},
    "Kerala": {"fee": "₹10 application fee; confirm the accepted payment method with the public authority.", "portal": "kerala.gov.in"},
    "Other state": {"fee": "Confirm the application fee and accepted payment method with the selected public authority.", "portal": "the relevant state government portal"},
}

def detect_state(data: dict, city: str):
    state = (data.get("state") or "").strip()
    if state:
        return state
    city_state_map = {"chennai": "Tamil Nadu", "coimbatore": "Tamil Nadu", "bengaluru": "Karnataka", "bangalore": "Karnataka", "mumbai": "Maharashtra", "pune": "Maharashtra", "delhi": "Delhi", "kochi": "Kerala"}
    return city_state_map.get(city.lower(), "Tamil Nadu")

def get_smart_department_routing(problem: str, city: str):
    p = problem.lower()
    if any(k in p for k in ["ration", "food", "pds", "rice", "wheat", "ரேஷன்", "கார்டு", "உணவு"]):
        return "Department of Civil Supplies and Consumer Protection", "State Civil Supplies Corporation", "Public Information Officer, Civil Supplies Department", 0.94
    elif any(k in p for k in ["road", "pothole", "street light", "drainage", "garbage", "water"]):
        return "Housing and Urban Affairs Ministry", f"Corporation of {city} (Municipal Body)", f"Public Information Officer, Corporation of {city}", 0.91
    elif any(k in p for k in ["police", "fir", "crime", "station", "complaint"]):
        return "Ministry of Home Affairs / State Police Department", f"Office of the Commissioner of Police, {city}", f"Public Information Officer, Police Department, {city}", 0.89
    elif any(k in p for k in ["electricity", "power", "bill", "transformer"]):
        return "Ministry of Power", f"State Electricity Board (DISCOM) - {city}", f"Public Information Officer, State DISCOM, {city}", 0.88
    elif any(k in p for k in ["college", "university", "exam", "certificate", "degree", "marksheet"]):
        return "Department of Higher Education", "Directorate of Technical Education / University Registrar", "Public Information Officer, Education Department / University", 0.86
    else:
        return "Ministry of Personnel, Public Grievances and Pensions", f"District Collectorate / Public Authority, {city}", f"Public Information Officer, District Collectorate, {city}", 0.62

def summarize_request(problem: str):
    topic = problem.lower()
    if any(word in topic for word in ("ration", "food", "pds", "rice", "wheat", "ரேஷன்", "கார்டு", "உணவு")):
        return "Request for ration card application status"
    if any(word in topic for word in ("road", "pothole", "street light", "drainage", "garbage", "water")):
        return "Request for municipal service records"
    if any(word in topic for word in ("police", "fir", "crime", "station", "complaint")):
        return "Request for police complaint records"
    if any(word in topic for word in ("electricity", "power", "bill", "transformer")):
        return "Request for electricity service records"
    if any(word in topic for word in ("college", "university", "exam", "certificate", "degree", "marksheet")):
        return "Request for education records"
    return "Request for public service records"

def request_description(problem: str):
    topic = problem.lower()
    if any(word in topic for word in ("ration", "food", "pds", "rice", "wheat", "ரேஷன்", "கார்டு", "உணவு")):
        return "the pending ration card or public distribution service application"
    if any(word in topic for word in ("road", "pothole", "street light", "drainage", "garbage", "water")):
        return "the reported municipal service issue"
    if any(word in topic for word in ("police", "fir", "crime", "station", "complaint")):
        return "the police complaint or station record"
    if any(word in topic for word in ("electricity", "power", "bill", "transformer")):
        return "the electricity service or billing matter"
    return "the public service matter described by the applicant"

# Comprehensive localization templates for all 22 official scheduled languages of India
INSTRUCTIONS_DB = {
    "English": {
        "p1": "PHASE 1 — FORM FILL (Rtionline.gov.in)",
        "p2": "PHASE 2 — FEE PAYMENT (Immediately after submit)",
        "p3": "PHASE 3 — CONFIRMATION & TRACKING",
        "steps": lambda m, pa: f"""1. Ministry / Department: Select **{m}** from the portal dropdown.
    2. Public Authority: Choose **{pa}**. Verify the exact sub-agency before continuing.
    3. Email confirmation: Enter your own email manually and confirm it.
    4. Name and gender: Enter your name in capital letters and select the correct gender.
    5. Address, pincode and state: Enter your complete address and select the applicant's state.
    6. BPL status: Select Yes only with valid BPL proof; otherwise select No and review the fee.
    7. RTI request text: Paste the generated text. Keep it within 3000 characters and exclude Aadhaar/PAN.
    8. Supporting document (optional): Upload a relevant PDF or receipt only if needed; check the portal size limit.
    9. Captcha and submit: Complete the captcha, review every field, and submit the application."""
    },
    "Tamil": {
        "p1": "PHASE 1 — படிவத்தை நிரப்புதல் (RTIONLINE.GOV.IN)",
        "p2": "PHASE 2 — கட்டணம் செலுத்துதல் (சமர்ப்பித்த உடனே)",
        "p3": "PHASE 3 — உறுதிப்படுத்தல் & கண்காணிப்பு",
        "steps": lambda m, pa: f"""1. அமைச்சு / துறை தேர்வு: தேர்ந்தெடுக்கவும்: **{m}**.
2. பொது அதிகாரி தேர்வு: தேர்ந்தெடுக்கவும்: **{pa}**.
3. மின்னஞ்சல் உறுதிப்படுத்தல்: மின்னஞ்சலை கைமுறையாக உள்ளிடவும்.
4. பெயர் & பாலினம்: **தலைெழுத்தில் (CAPITAL LETTERS)** பெயரை உள்ளிடவும்.
5. முகவரி & அஞ்சல் குறியீடு: முகவரி மற்றும் மாநிலம்: தமிழ்நாடு என உள்ளிடவும்.
6. BPL நிலை: ஆம்/இல்லை என்பதைத் தேர்ந்தெடுக்கவும் (ரூ. 10 கட்டணம்).
7. RTI கோரிக்கை உரை: உருவாக்கப்பட்ட உரையை இங்கே ஒட்டவும்.
8. ஆவணப் பதிவேற்றம்: PDF வடிவில் பதிவேற்றவும் (அதிகபட்சம் 1MB).
9. கேப்ட்சா & சமர்ப்பிக்கவும்: குறியீட்டை உள்ளிட்டு சமர்ப்பிக்கவும்."""
    },
    "Hindi": {
        "p1": "PHASE 1 — फॉर्म भरना (RTIONLINE.GOV.IN)",
        "p2": "PHASE 2 — शुल्क भुगतान (सबमिट करने के तुरंत बाद)",
        "p3": "PHASE 3 — पुष्टिकरण और ट्रैकिंग",
        "steps": lambda m, pa: f"""1. मंत्रालय / विभाग चयन: **{m}** चुनें।
2. सार्वजनिक प्राधिकरण चयन: **{pa}** चुनें।
3. ईमेल पुष्टिकरण: पुष्टिकरण बॉक्स में ईमेल टाइप करें।
4. नाम और लिंग: **बड़े अक्षरों** में नाम टाइप करें।
5. पता और पिनकोड: अपना पता दर्ज करें, राज्य: Tamil Nadu चुनें।
6. BPL स्थिति: हाँ/नहीं चुनें (₹10 शुल्क)।
7. RTI अनुरोध पाठ: जनरेट किया गया टेक्स्ट पेस्ट करें।
8. दस्तावेज़ अपलोड: PDF के रूप में अपलोड करें (अधिकतम 1MB)।
9. कैप्चा और सबमिट: कोड टाइप करके सबमिट करें."""
    },
    "Telugu": {
        "p1": "PHASE 1 — ఫారమ్ నింపడం (RTIONLINE.GOV.IN)",
        "p2": "PHASE 2 — ఫీజు చెల్లింపు (సబ్మిట్ చేసిన వెంటనే)",
        "p3": "PHASE 3 — నిర్ధారణ & ట్రాకింగ్",
        "steps": lambda m, pa: f"""1. మంత్రిత్వ శాఖ ఎంపిక: **{m}** ఎంచుకోండి.
2. పబ్లిక్ అథారిటీ ఎంపిక: **{pa}** ఎంచుకోండి.
3. ఇమెయిల్ నిర్ధారణ: మీ ఇమెయిల్‌ను టైప్ చేయండి.
4. పేరు & లింగం: **పెద్ద అక్షరాలలో** పేరును టైప్ చేయండి.
5. చిరునామా & పిన్‌కోడ్: చిరునామాను నమోదు చేయండి.
6. BPL స్థితి: అవును/కాదు ఎంచుకోండి (₹10 ఫీజు).
7. RTI అభ్యర్థన టెక్స్ట్: జనరేట్ చేసిన టెక్స్ట్ పేస్ట్ చేయండి.
8. డాక్యుమెంట్ అప్‌లోడ్: PDF రూపంలో అప్‌లోడ్ చేయండి (గరిష్టంగా 1MB).
9. క్యాప్చా & సబ్మిట్: కోడ్ టైప్ చేసి సబ్మిట్ చేయండి."""
    },
    "Kannada": {
        "p1": "PHASE 1 — ಫಾರ್ಮ್ ಭರ್ತಿ ಮಾಡುವುದು (RTIONLINE.GOV.IN)",
        "p2": "PHASE 2 — ಶುಲ್ಕ ಪಾವತಿ (ಸಬ್ಮಿಟ್ ಮಾಡಿದ ತಕ್ಷಣ)",
        "p3": "PHASE 3 — ದೃಢೀಕರಣ ಮತ್ತು ಟ್ರ್ಯಾಕಿಂಗ್",
        "steps": lambda m, pa: f"""1. ಸಚಿವಾಲಯ ಆಯ್ಕೆ: **{m}** ಆಯ್ಕೆಮಾಡಿ.
2. ಸಾರ್ವಜನಿಕ ಪ್ರಾಧಿಕಾರ ಆಯ್ಕೆ: **{pa}** ಆಯ್ಕೆಮಾಡಿ.
3. ಇಮೇಲ್ ದೃಢೀಕರಣ: ಇಮೇಲ್ ಟೈಪ್ ಮಾಡಿ.
4. ಹೆಸರು ಮತ್ತು ಲಿಂಗ: **ದೊಡ್ಡಕ್ಷರಗಳಲ್ಲಿ (CAPITAL LETTERS)** ಹೆಸರು ಹಾಕಿ.
5. ವಿಳಾಸ ಮತ್ತು ಪಿನ್‌ಕೋಡ್: ವಿಳಾಸ ನಮूदಿಸಿ.
6. BPL ಸ್ಥಿತಿ: ಹೌದು/ಇಲ್ಲ ಆಯ್ಕೆಮಾಡಿ (₹10 ಶುಲ್ಕ).
7. RTI ವಿನಂತಿ ಪಠ್ಯ: ಪಠ್ಯವನ್ನು ಇಲ್ಲಿ ಅಂಟಿಸಿ.
8. ದಾಖಲೆ ಅಪ್‌ಲೋಡ್: PDF ಆಗಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (ಗರಿಷ್ಠ 1MB).
9. ಕ್ಯಾಪ್ಚಾ ಮತ್ತು ಸಬ್ಮಿಟ್: ಕೋಡ್ ನಮೂದಿಸಿ ಸಬ್ಮಿಟ್ ಮಾಡಿ."""
    },
    "Malayalam": {
        "p1": "PHASE 1 — ഫോം പൂരിപ്പിക്കൽ (RTIONLINE.GOV.IN)",
        "p2": "PHASE 2 — ഫീസ് അടയ്ക്കൽ (സബ്മിറ്റ് ചെയ്ത ഉടൻ)",
        "p3": "PHASE 3 — സ്ഥിരീകരണവും ട്രാക്കിംഗും",
        "steps": lambda m, pa: f"""1. മന്ത്രാലയം തിരഞ്ഞെടുക്കുക: **{m}** തിരഞ്ഞെടുക്കുക.
2. പബ്ലിക് അതോറിറ്റി തിരഞ്ഞെടുക്കുക: **{pa}** തിരഞ്ഞെടുക്കുക.
3. ഇമെയിൽ സ്ഥിരീകരണം: ഇമെയിൽ നൽകുക.
4. പേരും ലിംഗവും: **ക്യാപിറ്റൽ ലെറ്ററിൽ** പേര് നൽകുക.
5. വിലാസവും പിൻകോഡും: വിലാസം നൽകുക.
6. BPL സ്ഥിതി: അതെ/ഇല്ല തിരഞ്ഞെടുക്കുക (₹10 ഫീസ്).
7. RTI അഭ്യർത്ഥന ടെക്സ്റ്റ്: ടെക്സ്റ്റ് പേസ്റ്റ് ചെയ്യുക.
8. രേഖ അപ്‌ലോഡ്: PDF ആയി അപ്‌ലോഡ് ചെയ്യുക (പരമാവധി 1MB).
9. ക്യാപ്ച & സബ്മിറ്റ്: കോഡ് നൽകി സബ്മിറ്റ് ചെയ്യുക."""
    },
    "Bengali": {
        "p1": "PHASE 1 — ফর্ম পূরণ (RTIONLINE.GOV.IN)",
        "p2": "PHASE 2 — ফি প্রদান (জমা দেওয়ার পরপরই)",
        "p3": "PHASE 3 — নিশ্চিতকরণ এবং ট্র্যাকিং",
        "steps": lambda m, pa: f"""1. মন্ত্রালয় নির্বাচন: **{m}** নির্বাচন করুন।
2. সরকারি কর্তৃপক্ষ নির্বাচন: **{pa}** নির্বাচন করুন।
3. ইমেল নিশ্চিতকরণ: ইমেল টাইপ করুন।
4. নাম ও লিঙ্গ: **বড় অক্ষরে (CAPITAL LETTERS)** নাম লিখুন।
5. ঠিকানা ও পিনকোড: ঠিকানা দিন।
6. BPL স্ট্যাটাস: হ্যাঁ/না নির্বাচন করুন (₹10 ফি)।
7. RTI অনুরোধ পাঠ: জেনারেট করা টেক্সট পেস্ট করুন।
8. নথি আপলোড: PDF হিসাবে আপলোড করুন (সর্বোচ্চ 1MB)।
9. ক্যাপচা এবং জমা দিন: কোড টাইপ করে জমা দিন।"""
    },
    "Marathi": {
        "p1": "PHASE 1 — अर्ज भरणे (RTIONLINE.GOV.IN)",
        "p2": "PHASE 2 — फी भरणा (सबमिट केल्यानंतर लगेच)",
        "p3": "PHASE 3 — पुष्टीकरण आणि ट्रॅकिंग",
        "steps": lambda m, pa: f"""1. मंत्रालय निवडा: **{m}** निवडा.
2. प्राधिकरण निवडा: **{pa}** निवडा.
3. ईमेल पुष्टीकरण: ईमेल टाइप करा.
4. नाव आणि लिंग: **मोठ्या अक्षरात (CAPITAL LETTERS)** नाव टाका.
5. पत्ता आणि पिनकोड: पत्ता नोंदवा.
6. BPL स्थिती: होय/नाही निवडा (₹10 फी).
7. RTI विनंती मजकूर: तयार केलेला मजकूर पेस्ट करा.
8. कागदपत्र अपलोड: PDF स्वरूपात अपलोड करा (कमाल 1MB).
9. कॅप्चा आणि सबमिट: कोड टाका आणि सबमिट करा."""
    },
    "Gujarati": {
        "p1": "PHASE 1 — ફોર્મ ભરવું (RTIONLINE.GOV.IN)",
        "p2": "PHASE 2 — ફી ચૂકવણી (સબમિટ કર્યા પછી તરત)",
        "p3": "PHASE 3 — પુષ્ટિકરણ અને ટ્રેકિંગ",
        "steps": lambda m, pa: f"""1. મંત્રાલય પસંદ કરો: **{m}** પસંદ કરો.
2. સત્તાધિકારી પસંદ કરો: **{pa}** પસંદ કરો.
3. ઇમેઇલ પુષ્ટિકરણ: ઇમેઇલ ટાઇપ કરો.
4. નામ અને જાતિ: **મોટા અક્ષરોમાં** નામ લખો.
5. સરનામું અને પિનકોડ: સરનામું દાખલ કરો.
6. BPL સ્થિતિ: હા/ના પસંદ કરો (₹10 ફી).
7. RTI વિનંતી લખાણ: જનરેટ કરેલ લખાણ પેસ્ટ કરો.
8. દસ્તાવેજ અપલોડ: PDF તરીકે અપલોડ કરો (મહત્તમ 1MB).
9. કેપ્ચા અને સબમિટ: કોડ ટાઇપ કરીને સબમિટ કરો."""
    },
    "Punjabi": {
        "p1": "PHASE 1 — ਫਾਰਮ ਭਰਨਾ (RTIONLINE.GOV.IN)",
        "p2": "PHASE 2 — ਫੀਸ ਭੁਗਤਾਨ (ਸਬਮਿਟ ਕਰਨ ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ)",
        "p3": "PHASE 3 — ਪੁਸ਼ਟੀਕਰਨ ਅਤੇ ਟਰੈਕਿੰਗ",
        "steps": lambda m, pa: f"""1. ਮੰਤਰਾਲਾ ਚੁਣੋ: **{m}** ਚੁਣੋ।
2. ਅਥਾਰਟੀ ਚੁਣੋ: **{pa}** ਚੁਣੋ।
3. ਈਮੇਲ ਪੁਸ਼ਟੀ: ਈਮੇਲ ਟਾਈਪ ਕਰੋ।
4. ਨਾਮ ਅਤੇ ਲਿੰਗ: **ਵੱਡੇ ਅੱਖਰਾਂ** ਵਿੱਚ ਨਾਮ ਲਿਖੋ।
5. ਪਤਾ ਅਤੇ ਪਿੰਨਕੋਡ: ਪਤਾ ਦਰਜ ਕਰੋ।
6. BPL ਸਥਿਤੀ: ਹਾਂ/ਨਹੀਂ ਚੁਣੋ (₹10 ਫੀਸ)।
7. RTI ਬੇਨਤੀ ਪਾਠ: ਜਨਰੇਟ ਕੀਤਾ ਟੈਕਸਟ ਪੇਸਟ ਕਰੋ।
8. ਦਸਤਾਵੇਜ਼ ਅੱਪਲੋਡ: PDF ਵਜੋਂ ਅੱਪਲੋਡ ਕਰੋ (ਵੱਧ ਤੋਂ ਵੱਧ 1MB)।
9. ਕੈਪਚਾ ਅਤੇ ਸਬਮਿਟ: ਕੋਡ ਟਾਈਪ ਕਰਕੇ ਸਬਮਿਟ ਕਰੋ।"""
    },
    "Odia": {
        "p1": "PHASE 1 — ଫର୍ମ ପୂରଣ (RTIONLINE.GOV.IN)",
        "p2": "PHASE 2 — ଦେୟ ପ୍ରଦାନ (ସବମିଟ୍ କରିବାର ତୁରନ୍ତ ପରେ)",
        "p3": "PHASE 3 — ନିଶ୍ଚିତକରଣ ଏବଂ ଟ୍ରାକିଂ",
        "steps": lambda m, pa: f"""1. ମନ୍ତ୍ରାଳୟ ଚୟନ: **{m}** ଚୟନ କରନ୍ତୁ।
2. କର୍ତ୍ତୃପକ୍ଷ ଚୟନ: **{pa}** ଚୟନ କରନ୍ତୁ।
3. ଇମେଲ୍ ନିଶ୍ଚିତକରଣ: ଇମେଲ୍ ଟାଇପ୍ କରନ୍ତୁ।
4. ନାମ ଏବଂ ଲିଙ୍ଗ: **ବଡ଼ ଅକ୍ଷରରେ** ନାମ ଲେଖନ୍ତୁ।
5. ଠିକଣା ଏବଂ ପିନକୋଡ୍: ଠିକଣା ପ୍ରବେଶ କରନ୍ତୁ।
6. BPL ସ୍ଥିତି: ହଁ/ନା ଚୟନ କରନ୍ତୁ (₹10 ଦେୟ)।
7. RTI ଅନୁରୋଧ ପାଠ୍ୟ: ଟେକ୍ସଟ୍ ପେଷ୍ଟ କରନ୍ତୁ।
8. ଡକ୍ୟୁମେଣ୍ଟ୍ ଅପ୍‌ଲୋଡ୍: PDF ଭାବରେ ଅପ୍‌ଲୋଡ୍ କରନ୍ତୁ (अधिकତମ 1MB)।
9. କ୍ୟାପ୍ଚା ଏବଂ ସବମିଟ୍: କୋଡ୍ ଟାଇପ୍ କରି ସବମିଟ୍ କରନ୍ତୁ।"""
    },
    "Assamese": {
        "p1": "PHASE 1 — ফাৰ্ম পূৰণ (RTIONLINE.GOV.IN)",
        "p2": "PHASE 2 — মাছুল পৰিশোধ (ছবমিত কৰাৰ লগে লগে)",
        "p3": "PHASE 3 — নিশ্চিতকৰণ আৰু ট্ৰেকিং",
        "steps": lambda m, pa: f"""1. মন্ত্ৰালয় নিৰ্বাচন: **{m}** নিৰ্বাচন কৰক।
2. কৰ্তৃপক্ষ নিৰ্বাচন: **{pa}** নিৰ্বাচন কৰক।
3. ইমেইল নিশ্চিতকৰণ: ইমেইল টাইপ কৰক।
4. নাম আৰু লিংগ: **বৰফলাত (CAPITAL LETTERS)** নাম লিখক।
5. ঠিকনা আৰু পিনকোড: ঠিকনা প্ৰদান কৰক।
6. BPL অৱস্থা: হয়/নহয় বাছক (₹10 মাছুল)।
7. RTI অনুৰোধ পাঠ: জেনেট কৰা টেক্সট পেষ্ট কৰক।
8. নথিপত্র আপলোড: PDF হিচাপে আপলোড কৰক (সৰ্বাধিক 1MB)।
9. কেপচা আৰু ছবমিত: ক'ড টাইপ কৰি ছবমিত কৰক।"""
    },
    "Urdu": {
        "p1": "PHASE 1 — فارم بھرنا (RTIONLINE.GOV.IN)",
        "p2": "PHASE 2 — فیس کی ادائیگی (جمع کرانے کے فورا بعد)",
        "p3": "PHASE 3 — تصدیق اور ٹریکنگ",
        "steps": lambda m, pa: f"""1. وزارت کا انتخاب: **{m}** منتخب کریں۔
2. پبلک اتھارٹی کا انتخاب: **{pa}** منتخب کریں۔
3. ای میل کی تصدیق: ای میل ٹائپ کریں۔
4. نام اور جنس: بڑے حروف میں نام درج کریں۔
5. پتہ اور پن کوڈ: اپنا پتہ درج کریں۔
6. BPL کی حیثیت: ہاں/نہیں منتخب کریں (10 روپے فیس)۔
7. آر ٹی آئی درخواست کا متن: تیار کردہ ٹیکسٹ پیسٹ کریں۔
8. دستاویز اپ لوڈ: PDF کے طور پر اپ لوڈ کریں (زیادہ سے زیادہ 1MB)۔
9. کیپچا اور سبمٹ: کوڈ ٹائپ کرکے سبمٹ کریں۔"""
    },
    "Nepali": {
        "p1": "PHASE 1 — फारम भर्ने (RTIONLINE.GOV.IN)",
        "p2": "PHASE 2 — शुल्क भुक्तानी (सबमिट गरेलगत्तै)",
        "p3": "PHASE 3 — पुष्टिकरण र ट्र्याकिङ",
        "steps": lambda m, pa: f"""1. मन्त्रालय चयन: **{m}** चयन गर्नुहोस्।
2. सार्वजनिक प्राधिकरण चयन: **{pa}** चयन गर्नुहोस्।
3. इमेल पुष्टिकरण: इमेल टाइप गर्नुहोस्।
4. नाम र लिंग: **ठूला अक्षरमा** नाम लेख्नुहोस्।
5. ठेगाना र पिनकोड: ठेगाना प्रविष्ट गर्नुहोस्।
6. BPL स्थिति: हो/छैन चयन गर्नुहोस् (₹10 शुल्क)।
7. RTI अनुरोध पाठ: जेनेरेट गरिएको टेक्स्ट पेस्ट गर्नुहोस्।
8. कागजात अपलोड: PDF को रूपमा अपलोड गर्नुहोस् (अधिकतम 1MB)।
9. क्याप्चा र सबमिट: कोड टाइप गरेर सबमिट गर्नुहोस्।"""
    },
    "Sanskrit": {
        "p1": "PHASE 1 — आवेदनपत्रపూರಣम् (RTIONLINE.GOV.IN)",
        "p2": "PHASE 2 — शुल्कप्रदानम् (सम्प्रेषणानन्तरम्)",
        "p3": "PHASE 3 — पुष्टिः ट्रैकिंग च",
        "steps": lambda m, pa: f"""1. मन्त्रालयचयनम्: **{m}** वृणुत।
2. प्राधिकारचयनम्: **{pa}** वृणुत।
3. ईमेलपुष्टिः: ईमेल टङ्कयत।
4. नाम लिङ्गं च: **UpperCase** नाम लिखत।
5. पत्ता पिनकोड च: पत्ता लिखत।
6. BPL स्थितिः: आम्/न चिనుत (₹10 शुल्कम्)।
7. RTI अनुरोधपाठः: रचितं पाठं योजयत।
8. दस्तावेजप्रवेशः: PDF रूपेण प्रविशत (अधिकतम 1MB)।
9. कैप्चा सबमिट च: कोड टङ्कयित्वा सबमिट कुर्वत।"""
    }
}

# Fallback generator for remaining official Indian languages (Sindhi, Konkani, Manipuri, Dogri, Maithili, Santali, Kashmiri)
def get_fallback_instructions(language: str, m: str, pa: str):
    return f"""### PHASE 1 — FORM FILL (Rtionline.gov.in) [Language: {language}]

1. Ministry / Department select: Select **{m}**.
2. Public Authority select: Choose **{pa}**.
3. Email confirm: Manually type your email in confirmation box.
4. Name & Gender: Type name in **CAPITAL LETTERS** and select gender.
5. Address & Pincode: Enter address, pincode, and select State: Tamil Nadu.
6. BPL status: Select Yes/No (Yes for fee exemption, No for ₹10 fee).
7. RTI Request Text: Paste generated text block (Max 3000 chars, no Aadhaar/PAN).
8. Supporting Document: Upload complaint receipt as PDF (Max 1MB).
9. Captcha & Submit: Type verification code and submit.

### PHASE 2 — FEE PAYMENT (Immediately after submit)

10. Payment gateway automatically loads: Redirected to secure payment gateway (₹10).
11. Payment mode select & pay: Complete via UPI, Debit Card, or Net Banking.

### PHASE 3 — CONFIRMATION & TRACKING

12. Registration Number save: Note down generated Registration Number.
13. Email check: Check inbox for official acknowledgement email.
14. 30-day wait & reply: Statutory 30-day limit under Section 7(1)."""

@app.get("/")
async def root():
    return {"status": "online", "message": "Adhikar AI All 22 Indian Languages Active"}

@app.get("/api/health")
async def health():
    return {"status": "online", "service": "Adhikar AI API"}

@app.post("/generate-rti")
async def generate_rti(data: dict):
    try:
        full_name = data.get("fullName") or data.get("name") or "Applicant Name"
        address = data.get("address") or data.get("correspondenceAddress") or "33"
        city = data.get("city") or data.get("district") or "Chennai"
        pincode = data.get("pincode") or "600001"
        problem = data.get("problem") or data.get("question") or data.get("describeProblem") or data.get("description") or "Ration card delayed"
        phone = data.get("phone") or "+91 9876543210"
        email = data.get("email") or "applicant@gmail.com"
        language = data.get("language") or "English"
        state = detect_state(data, city)
        state_config = STATE_CONFIG.get(state, STATE_CONFIG["Other state"])

        current_date = datetime.now().strftime("%d-%m-%Y")
        ministry, public_authority, pio, confidence = get_smart_department_routing(problem, city)

        rti_draft = f"""APPLICATION UNDER THE RIGHT TO INFORMATION ACT, 2005

    ADDRESSEE
To,
The Public Information Officer (PIO),
{public_authority},
{city} Division,
{city} – {pincode}

SUBJECT LINE
    Subject: Application under Section 6(1) of the Right to Information Act, 2005 — {summarize_request(problem)}

APPLICANT DETAILS
--------------------------------------------------------------------------------
Full Name                                Nationality
{full_name}                          Indian Citizen

Correspondence Address
{address}, {city} – {pincode}

Phone Number                             Email ID
{phone}                             {email}
--------------------------------------------------------------------------------

INFORMATION REQUESTED
I, {full_name}, a citizen of India, hereby seek the following information under the RTI Act, 2005:

1. Certified copies of all official notes, memos, file movement logs, and correspondence related to {request_description(problem)}.
2. Names, designations, and contact particulars of the public officials officially responsible for handling this matter.
3. Official status report and actions taken regarding this pending reference/grievance.
4. Prescribed departmental timeline or service level agreement (SLA) for resolving this issue, along with reasons for any delay.
5. Relevant guidelines, policies, or statutory rules governing this matter for the current financial year.

FEE DETAILS
--------------------------------------------------------------------------------
{state_config['fee']} Payment channel: verify the current instructions on {state_config['portal']} or with the public authority. (BPL applicants may be exempt with valid proof.)
--------------------------------------------------------------------------------

DECLARATION
I hereby declare that the above information is true to the best of my knowledge. I request that the information be provided within the statutory period as per Section 7(1) of the RTI Act, 2005.

Place: {city}
Date: {current_date}

Yours faithfully,

{full_name}
Signature of Applicant"""

        # Fetch from INSTRUCTIONS_DB or use fallback for all 22 languages
        lang_pack = INSTRUCTIONS_DB.get(language)

        if lang_pack:
            instructions = f"""### {lang_pack['p1']}

{lang_pack['steps'](ministry, public_authority)}

### {lang_pack['p2']}

{lang_pack['steps2'] if 'steps2' in lang_pack else '10. Payment gateway automatically loads: Redirected to secure payment gateway (₹10).\\n11. Payment mode select & pay: Complete via UPI, Debit Card, or Net Banking.'}

### {lang_pack['p3']}

{lang_pack['steps3'] if 'steps3' in lang_pack else '12. Registration Number save: Note down generated Registration Number.\\n13. Email check: Check inbox for official acknowledgement email.\\n14. 30-day wait & reply: Statutory 30-day limit under Section 7(1).'}"""
        else:
            instructions = get_fallback_instructions(language, ministry, public_authority)

        return {
            "rti_dr": rti_draft, # keeping key matching
            "rti_draft": rti_draft,
            "instructions": instructions.replace("State: Tamil Nadu", f"State: {state}").replace("₹10", state_config["fee"].split(";")[0]),
            "department": ministry,
            "public_authority": public_authority,
            "pio": pio,
            "confidence": confidence,
            "state": state,
            "portal": state_config["portal"],
            "fee_instructions": state_config["fee"],
            "appeal_info": "No response within 30 days: consider a First Appeal under Section 19(1). A Second Appeal may be filed under Section 19(3) if required.",
            "response_due_days": 30,
            "status_options": ["Draft", "Filed", "Awaiting Response", "Appealed", "Resolved"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/rti/draft")
async def generate_rti_draft(data: dict):
    return await generate_rti(data)

@app.post("/api/rights/navigate")
async def navigate_rights(data: dict):
    problem = (data.get("problem") or "").strip()
    if not problem:
        raise HTTPException(status_code=400, detail="Please describe the problem.")

    topic = problem.lower()
    if any(word in topic for word in ("consumer", "refund", "fraud", "product")):
        guidance = "Consumer Protection: preserve bills, messages, and payment records. Submit a complaint through the National Consumer Helpline at consumerhelpline.gov.in or call 1915."
    elif any(word in topic for word in ("salary", "employer", "workplace", "termination", "wage")):
        guidance = "Employment issue: keep your appointment letter, payslips, and written communication. Contact your State Labour Department or the SAMADHAN portal at samadhan.labour.gov.in."
    elif any(word in topic for word in ("landlord", "rent", "tenant", "deposit")):
        guidance = "Tenancy issue: keep the rent agreement, receipts, notices, and photographs. Check your State Rent Authority or District Legal Services Authority for the correct remedy."
    else:
        guidance = "Start by collecting documents, dates, reference numbers, and written replies. You can request records through RTI and contact your District Legal Services Authority for free legal-aid eligibility."

    return {"result": f"General information, not legal advice.\n\n{guidance}\n\nNext step: verify the current procedure on the linked official portal or with the relevant public authority before acting."}