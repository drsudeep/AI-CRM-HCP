from sqlalchemy.orm import Session
from .models import Interaction


def create_interaction(db: Session, interaction):
    db_interaction = Interaction(
        doctor_name=interaction.doctor_name,
        interaction_type=interaction.interaction_type,
        date=interaction.date,
        time=interaction.time,
        attendees=interaction.attendees,
        discussion=interaction.discussion,
        outcome=interaction.outcome,
        follow_up=interaction.follow_up,
    )

    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)

    return db_interaction
def get_interactions(db: Session):
    return db.query(Interaction).all()

def update_interaction(db: Session, interaction_id: int, data):
    interaction = db.query(Interaction).filter(
        Interaction.id == interaction_id
    ).first()

    if interaction:
        interaction.doctor_name = data.doctor_name
        interaction.interaction_type = data.interaction_type
        interaction.date = data.date
        interaction.time = data.time
        interaction.attendees = data.attendees
        interaction.discussion = data.discussion
        interaction.outcome = data.outcome
        interaction.follow_up = data.follow_up

        db.commit()
        db.refresh(interaction)

    return interaction