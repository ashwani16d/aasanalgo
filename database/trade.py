from extensions import db
from datetime import datetime

class Trade(db.Model):
    __tablename__ = "trade"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    symbol = db.Column(db.String(20), nullable=False)
    side = db.Column(db.String(10), nullable=False)  # BUY / SELL
    qty = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), nullable=False)  # PENDING / EXECUTED
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
