from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .ai import generate_summary
from pydantic import BaseModel

class AIRequest(BaseModel):
    text: str

from .database import engine, Base, get_db
from .schemas import InteractionCreate
from .crud import (
    create_interaction,
    get_interactions,
    update_interaction
)
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend Running Successfully"}

@app.post("/interaction")
def add_interaction(
    interaction: InteractionCreate,
    db: Session = Depends(get_db)
):
    return create_interaction(db, interaction)

@app.get("/interactions")
def fetch_interactions(db: Session = Depends(get_db)):
    return get_interactions(db)

@app.put("/interaction/{interaction_id}")
def edit_interaction(
    interaction_id: int,
    interaction: InteractionCreate,
    db: Session = Depends(get_db),
):
    return update_interaction(db, interaction_id, interaction)

@app.post("/ai/chat")
def ai_chat(request: AIRequest):
    return {
        "response": generate_summary(request.text)
    }

@app.delete("/interaction/{id}")
def delete_interaction(id: int, db: Session = Depends(get_db)):
    interaction = db.query(models.Interaction).filter(models.Interaction.id == id).first()

    if interaction:
        db.delete(interaction)
        db.commit()

    return {"message": "Deleted Successfully"}