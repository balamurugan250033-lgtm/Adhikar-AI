from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Enable CORS for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RTIData(BaseModel):
    applicant_name: str
    address: str
    city: str
    pincode: str
    road_name: str = ""
    area: str = ""
    complaint_number: str = ""
    question: str = ""
    language: str = "English"

@app.get("/")
def read_root():
    return {"status": "online"}

@app.post("/api/rti/draft")
def draft_rti(data: RTIData):
    issue = data.question.strip() if data.question else f"Official records regarding {data.road_name}, {data.area}"
    
    # Clean, professional, well-spaced structure
    rti_draft = f"""I, {data.applicant_name}, a citizen of India, hereby request the following information under the Right to Information Act, 2005:

SUBJECT: Request for official information, file status, and action taken regarding: {issue} ({data.city} - {data.pincode})

1. Certified copies of all official notes, file notings, memos, correspondence, and logs related to the matter of: {issue}.

2. Complete names, official designations, and department jurisdiction details of the public officials responsible for handling this matter.

3. Detailed status report on any prior representations, applications, or complaints filed in this regard (Reference / Complaint Number: {data.complaint_number or 'N/A'}), including certified copies of action taken reports and departmental remarks.

4. Explicit expected timeline for the resolution or processing of this matter, or official reasons for any delay or denial.

5. Itemized details of relevant guidelines, policies, standard operating procedures, or statutory rules governing this procedure for the current financial year.

Additional Context / Specific Details Provided: {issue}"""

    # Sequentially ordered guidelines matching the exact layout of the rtionline.gov.in form
    instructions = f"""📋 STEP-BY-STEP PORTAL SUBMISSION GUIDE (rtionline.gov.in):

1. **Public Authority Details (Top Section):**
   - **Select Ministry/Department/Apex body:** Choose the ministry responsible for your query (e.g., *Ministry of Electronics and Information Technology* for Aadhaar/UIDAI related queries, or relevant municipal/state departments for local issues).
   - **Select Public Authority:** Choose the exact sub-agency (e.g., *Unique Identification Authority of India (UIDAI)* or *Corporation of Chennai (CCMC)*).

2. **Personal Details of RTI Applicant:**
   - **Name:** {data.applicant_name}
   - **Address:** {data.address}, {data.city} - {data.pincode}
   - Complete your Email, Mobile Number, Gender, and other personal fields as required.

3. **Request Details Section:**
   - **Citizenship:** Indian
   - **BPL (Below Poverty Line):** Select Yes / No as applicable.
   - **Text for RTI Request application:** Copy and paste the cleanly formatted RTI text block directly into this box.

4. **Fee & Final Submission:**
   - Select **Online Payment** for the ₹10 statutory fee.
   - Enter the security captcha code and click **Submit**."""

    return {
        "rti_draft": rti_draft,
        "instructions": instructions
    }