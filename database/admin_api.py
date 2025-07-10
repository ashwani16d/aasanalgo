from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.user_db import User, db_session
from database.trade import Trade

admin_api = Blueprint('admin_api', __name__)

@admin_api.route('/admin/users', methods=['GET'])
@jwt_required()
def get_all_users():
    user = User.query.get(get_jwt_identity())
    if not user or not user.is_admin:
        return jsonify({"msg": "Admin access only"}), 403

    users = User.query.all()
    return jsonify([{
        "id": u.id,
        "username": u.username,
        "email": u.email,
        "is_admin": u.is_admin
    } for u in users])

@admin_api.route('/admin/trades', methods=['GET'])
@jwt_required()
def get_all_trades():
    user = User.query.get(get_jwt_identity())
    if not user or not user.is_admin:
        return jsonify({"msg": "Admin access only"}), 403

    trades = Trade.query.order_by(Trade.created_at.desc()).all()
    return jsonify([{
        "id": t.id,
        "user_id": t.user_id,
        "symbol": t.symbol,
        "side": t.side,
        "qty": t.qty,
        "status": t.status,
        "created_at": t.created_at.isoformat()
    } for t in trades])
