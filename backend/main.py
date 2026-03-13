from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

from database import init_db, get_db, Lead as DBLead
from claude import enrich_lead_with_ai

app = FastAPI(title="AI GTM Pipeline Tool API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for the demo
    allow_credentials=False, # Must be False when allow_origins is ["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_db()

# Pydantic models for API
class EnrichRequest(BaseModel):
    domain: str

class OutreachEmails(BaseModel):
    ceo: Dict[str, str]
    cfo: Dict[str, str]
    head_of_finance: Dict[str, str]

class LeadCreate(BaseModel):
    domain: str
    company_name: str
    industry: str
    size: str
    location: str
    main_product: str
    pain_points: List[str]
    fit_score: int
    fit_justification: str
    outreach_emails: OutreachEmails

class LeadResponse(LeadCreate):
    id: int
    date_added: Any

    class Config:
        from_attributes = True

@app.post("/api/enrich")
def enrich_domain(request: EnrichRequest):
    if not request.domain:
        raise HTTPException(status_code=400, detail="Domain is required")
    
    enriched_data = enrich_lead_with_ai(request.domain)
    # Add original domain to the response
    enriched_data['domain'] = request.domain
    return enriched_data

@app.post("/api/leads", response_model=LeadResponse)
def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
    db_lead = DBLead(
        domain=lead.domain,
        company_name=lead.company_name,
        industry=lead.industry,
        size=lead.size,
        location=lead.location,
        main_product=lead.main_product,
        pain_points=lead.pain_points,
        fit_score=lead.fit_score,
        fit_justification=lead.fit_justification,
        outreach_emails=lead.outreach_emails.model_dump()
    )
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead

@app.get("/api/leads", response_model=List[LeadResponse])
def get_leads(db: Session = Depends(get_db)):
    leads = db.query(DBLead).order_by(DBLead.date_added.desc()).all()
    return leads

@app.delete("/api/leads/{lead_id}")
def delete_lead(lead_id: int, db: Session = Depends(get_db)):
    db_lead = db.query(DBLead).filter(DBLead.id == lead_id).first()
    if not db_lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    db.delete(db_lead)
    db.commit()
    return {"message": "Lead deleted successfully"}

# BOTÓN ROJO DE AUTODESTRUCCIÓN PARA LA DEMO
@app.get("/api/reset-demo-db")
def reset_database():
    import os
    if os.path.exists("./leads.db"):
        os.remove("./leads.db")
        init_db() # Vuelve a crear las tablas vacías
        return {"message": "Base de datos borrada exitosamente. ¡Lista para la entrevista!"}
    return {"message": "La base de datos ya estaba vacía."}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
