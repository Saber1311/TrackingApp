from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ScheduledDelivery
from datetime import datetime

router = APIRouter(prefix="/api/tracking", tags=["Tracking"])

# -----------------------
# 🧪 Données mock de démo
# -----------------------
MOCK_TRACKING_DB = {
    "111111111111": {
        "tracking_id": "111111111111",
        "status": "Delivered",
        "estimated_delivery": "2024-05-24T10:00:00Z",
        "location": {
            "name": "Paris",
            "address": "France",
            "latitude": 48.8566,
            "longitude": 2.3522
        },
        "steps": [
            {"label": "Order Processed", "completed": True},
            {"label": "Picked Up", "completed": True},
            {"label": "In Transit", "completed": True},
            {"label": "Out for Delivery", "completed": True},
            {"label": "Delivered", "completed": True}
        ],
        "sender": {"name": "Globex Paris", "address": "Lyon"},
        "recipient": {"name": "Jean Dupont", "address": "Paris"},
        "package": {
            "weight": "1.2 kg", "dimensions": "30x20x10 cm", "pieces": 1, "insurance": "Yes"
        },
        "history": [
            {"status": "Delivered", "location": "Paris", "timestamp": "2024-05-24T10:00:00Z"},
            {"status": "Out for Delivery", "location": "Paris", "timestamp": "2024-05-24T07:00:00Z"},
            {"status": "In Transit", "location": "Lyon", "timestamp": "2024-05-23T18:00:00Z"}
        ]
    },
    "222222222222": {
        "tracking_id": "222222222222",
        "status": "In Transit",
        "estimated_delivery": "2024-05-29T15:00:00Z",
        "location": {
            "name": "Bordeaux",
            "address": "France",
            "latitude": 44.8378,
            "longitude": -0.5792
        },
        "steps": [
            {"label": "Order Processed", "completed": True},
            {"label": "Picked Up", "completed": True},
            {"label": "In Transit", "completed": True},
            {"label": "Out for Delivery", "completed": False},
            {"label": "Delivered", "completed": False}
        ],
        "sender": {"name": "Globex Lyon", "address": "Lyon"},
        "recipient": {"name": "Marie Curie", "address": "Bordeaux"},
        "package": {
            "weight": "2.5 kg", "dimensions": "40x30x20 cm", "pieces": 2, "insurance": "No"
        },
        "history": [
            {"status": "In Transit", "location": "Bordeaux", "timestamp": "2024-05-27T14:00:00Z"},
            {"status": "Picked Up", "location": "Lyon", "timestamp": "2024-05-26T09:00:00Z"}
        ]
    },
    "333333333333": {
        "tracking_id": "333333333333",
        "status": "Label Created",
        "estimated_delivery": "2024-06-02T12:00:00Z",
        "location": {
            "name": "Lille",
            "address": "France",
            "latitude": 50.6292,
            "longitude": 3.0573
        },
        "steps": [
            {"label": "Order Processed", "completed": True},
            {"label": "Picked Up", "completed": False},
            {"label": "In Transit", "completed": False},
            {"label": "Out for Delivery", "completed": False},
            {"label": "Delivered", "completed": False}
        ],
        "sender": {"name": "Globex Nord", "address": "Lille"},
        "recipient": {"name": "Sarah Martin", "address": "Nice"},
        "package": {
            "weight": "0.5 kg", "dimensions": "15x10x5 cm", "pieces": 1, "insurance": "No"
        },
        "history": [
            {"status": "Label Created", "location": "Lille", "timestamp": "2024-05-27T11:00:00Z"}
        ]
    },
    "444444444444": {
        "tracking_id": "444444444444",
        "status": "Delayed",
        "estimated_delivery": "2024-05-28T18:00:00Z",
        "location": {
            "name": "Marseille",
            "address": "France",
            "latitude": 43.2965,
            "longitude": 5.3698
        },
        "steps": [
            {"label": "Order Processed", "completed": True},
            {"label": "Picked Up", "completed": True},
            {"label": "In Transit", "completed": True},
            {"label": "Out for Delivery", "completed": False},
            {"label": "Delivered", "completed": False}
        ],
        "sender": {"name": "Globex Sud", "address": "Toulouse"},
        "recipient": {"name": "Ali Ben", "address": "Marseille"},
        "package": {
            "weight": "3.8 kg", "dimensions": "45x35x25 cm", "pieces": 3, "insurance": "Yes"
        },
        "history": [
            {"status": "Delayed due to weather", "location": "Marseille", "timestamp": "2024-05-27T16:00:00Z"},
            {"status": "In Transit", "location": "Montpellier", "timestamp": "2024-05-26T12:00:00Z"}
        ]
    }
}


# ----------------------------
# 🧠 Fonction utilitaire interne
# ----------------------------
def get_tracking_data(tracking_id: str):
    return MOCK_TRACKING_DB.get(tracking_id)


# ----------------------------
# 📦 Route GET : /api/tracking/{tracking_id}
# ----------------------------
@router.get("/{tracking_id}")
async def get_tracking_info(tracking_id: str, db: Session = Depends(get_db)):
    data = get_tracking_data(tracking_id)
    if not data:
        raise HTTPException(status_code=404, detail="Colis non trouvé")

    # Regarde si une date planifiée existe
    plan = db.query(ScheduledDelivery).filter_by(tracking_id=tracking_id).first()
    if plan:
        data["estimated_delivery"] = plan.scheduled_date.isoformat()

    return data


# ----------------------------
# 📅 Route POST : /api/tracking/{tracking_id}/schedule
# ----------------------------
@router.post("/{tracking_id}/schedule")
async def schedule_delivery(tracking_id: str, date: str, db: Session = Depends(get_db)):
    try:
        parsed_date = datetime.fromisoformat(date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Date invalide (format ISO attendu)")

    entry = db.query(ScheduledDelivery).filter_by(tracking_id=tracking_id).first()
    if entry:
        entry.scheduled_date = parsed_date
    else:
        new_entry = ScheduledDelivery(tracking_id=tracking_id, scheduled_date=parsed_date)
        db.add(new_entry)

    db.commit()
    return {
        "message": "Livraison planifiée avec succès",
        "scheduled_date": parsed_date.isoformat()
    }
