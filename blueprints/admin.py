from flask import Blueprint, render_template, request, redirect, url_for, session, jsonify
from database.user_db import User
from database.auth_db import ApiKeys, Auth
from argon2.exceptions import VerifyMismatchError

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

# Dashboard
@admin_bp.route('/')
def admin_dashboard():
    if 'admin' not in session:
        return redirect(url_for('admin.admin_login_page'))
    return render_template('admin/index.html')

# Login Page (GET)
@admin_bp.route('/login', methods=['GET'])
def admin_login_page():
    return render_template('admin/login.html')

# Login Handler (POST)
@admin_bp.route('/login', methods=['POST'])
def admin_login():
    username = request.form.get('username')
    password = request.form.get('password')

    user = User.query.filter_by(username=username, is_admin=True).first()
    if user and user.check_password(password):
        session['admin'] = user.username
        return redirect(url_for('admin.admin_dashboard'))
    return render_template('admin/login.html', error="Invalid credentials")

# Logout
@admin_bp.route('/logout')
def admin_logout():
    session.pop('admin', None)
    return redirect(url_for('admin.admin_login_page'))

# User List
@admin_bp.route('/users')
def admin_users():
    if 'admin' not in session:
        return redirect(url_for('admin.admin_login_page'))
    users = User.query.all()
    return render_template('admin/users.html', users=users)

# API Keys View
@admin_bp.route('/apikeys')
def admin_apikeys():
    if 'admin' not in session:
        return redirect(url_for('admin.admin_login_page'))
    keys = ApiKeys.query.all()
    return render_template('admin/apikeys.html', keys=keys)

# Auth Tokens View
@admin_bp.route('/authtokens')
def admin_auth_tokens():
    if 'admin' not in session:
        return redirect(url_for('admin.admin_login_page'))
    tokens = Auth.query.all()
    return render_template('admin/auth_tokens.html', tokens=tokens)
