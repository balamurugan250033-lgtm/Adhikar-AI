from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Adhikar AI API", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STATE_FEES = {
    "Tamil Nadu": ("₹10 online fee; BPL applicants are exempt with valid proof.", "rtionline.gov.in"),
    "Karnataka": ("₹10 application fee; verify the accepted payment method with the authority.", "karnataka.gov.in"),
    "Maharashtra": ("₹10 application fee; verify the accepted payment method with the authority.", "rtionline.gov.in"),
    "Delhi": ("₹10 application fee through the applicable online or postal channel.", "rtionline.gov.in"),
    "Kerala": ("₹10 application fee; verify the accepted payment method with the authority.", "kerala.gov.in"),
}


def route_problem(problem, city):
    topic = problem.lower()
    if any(word in topic for word in ("ration", "food", "pds", "rice", "wheat")):
        return "Department of Civil Supplies and Consumer Protection", "State Civil Supplies Corporation", "Public Information Officer, Civil Supplies Department", 0.94
    if any(word in topic for word in ("road", "pothole", "street light", "drainage", "garbage", "water")):
        return "Housing and Urban Affairs Ministry", f"Corporation of {city} (Municipal Body)", f"Public Information Officer, Corporation of {city}", 0.91
    if any(word in topic for word in ("police", "fir", "crime", "station", "complaint")):
        return "Ministry of Home Affairs / State Police Department", f"Office of the Commissioner of Police, {city}", f"Public Information Officer, Police Department, {city}", 0.89
    if any(word in topic for word in ("electricity", "power", "bill", "transformer")):
        return "Ministry of Power", f"State Electricity Board (DISCOM) - {city}", f"Public Information Officer, State DISCOM, {city}", 0.88
    return "Ministry of Personnel, Public Grievances and Pensions", f"District Collectorate / Public Authority, {city}", f"Public Information Officer, District Collectorate, {city}", 0.62

def summarize_request(problem):
    topic = problem.lower()
    if any(word in topic for word in ("ration", "food", "pds", "rice", "wheat")):
        return "Request for ration card application status"
    if any(word in topic for word in ("road", "pothole", "street light", "drainage", "garbage", "water")):
        return "Request for municipal service records"
    if any(word in topic for word in ("police", "fir", "crime", "station", "complaint")):
        return "Request for police complaint records"
    if any(word in topic for word in ("electricity", "power", "bill", "transformer")):
        return "Request for electricity service records"
    return "Request for public service records"


@app.get("/api/health")
async def health():
    return {"status": "online", "service": "Adhikar AI API"}


@app.post("/api/rti/draft")
async def draft_rti(data: dict):
    name = (data.get("applicant_name") or "Applicant Name").strip()
    address = (data.get("address") or "").strip()
    city = (data.get("city") or "District").strip()
    pincode = (data.get("pincode") or "").strip()
    problem = (data.get("question") or "").strip()
    state = data.get("state") if data.get("state") in STATE_FEES else "Tamil Nadu"
    if not all((name, address, city, pincode, problem)):
        raise HTTPException(status_code=400, detail="Please complete all required RTI fields.")

    department, authority, pio, confidence = route_problem(problem, city)
    fee, portal = STATE_FEES[state]
    draft = f"""APPLICATION UNDER THE RIGHT TO INFORMATION ACT, 2005\n\nTo,\nThe Public Information Officer (PIO),\n{authority},\n{city} - {pincode}\n\nSubject: Application under Section 6(1) of the Right to Information Act, 2005 - {summarize_request(problem)}\n\nI, {name}, a citizen of India, request the following information under Section 6(1) of the Right to Information Act, 2005:\n\n1. Certified records and file movement details relating to: {problem}\n2. Names and designations of officials responsible for this matter.\n3. Current status and action taken, including reasons for any delay.\n\nApplicant address: {address}, {city}, {state} - {pincode}\n\nSubmission note: This is an illustrative addressing format. Verify the exact PIO, public authority, and address on {portal} or the relevant state RTI portal before filing.\n\nI hereby declare that the above information is true to the best of my knowledge. I request that the information be provided within the statutory period as per Section 7(1) of the RTI Act, 2005.\n\nDate: {datetime.now().strftime('%d-%m-%Y')}\n\nYours faithfully,\n\n{name}\nSignature of Applicant"""
    instructions = f"1. Recommended department: {department}.\n2. Public authority: {authority}.\n3. PIO: {pio}.\n4. State: {state}.\n5. Fee: {fee}\n6. Verify the current process at {portal}.\n7. Do not include Aadhaar, PAN, passwords, or other sensitive information.\n8. Save the acknowledgement number after filing. A response is generally due within 30 days under Section 7(1)."
    return {"rti_draft": draft, "instructions": instructions, "department": department, "public_authority": authority, "pio": pio, "confidence": confidence, "state": state, "fee_instructions": fee, "appeal_info": "If there is no response within 30 days, consider a First Appeal under Section 19(1).", "response_due_days": 30, "status_options": ["Draft", "Filed", "Awaiting Response", "Appealed", "Resolved"]}


@app.post("/api/rights/navigate")
async def navigate_rights(data: dict):
    problem = (data.get("problem") or "").strip()
    if not problem:
        raise HTTPException(status_code=400, detail="Please describe the problem.")
    return {"result": "General information, not legal advice.\n\nStart by collecting dates, documents, receipts, and written replies. Contact the relevant public authority or District Legal Services Authority, and verify the current procedure on its official portal before acting."}
