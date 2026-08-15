from sqlalchemy import Column, String, Integer, Boolean, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False)
    industry = Column(String(100), nullable=False)
    environment = Column(String(50), nullable=False)
    twin_status = Column(String(50), nullable=False)
    description = Column(String(500))
    departments = Column(JSON)  # list of strings

    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    devices = relationship("Device", back_populates="organization", cascade="all, delete-orphan")
    assets = relationship("Asset", back_populates="organization", cascade="all, delete-orphan")
    data_assets = relationship("DataAsset", back_populates="organization", cascade="all, delete-orphan")
    security_controls = relationship("SecurityControl", back_populates="organization", cascade="all, delete-orphan")
    simulations = relationship("Simulation", back_populates="organization", cascade="all, delete-orphan")


class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True)
    organization_id = Column(String(50), ForeignKey("organizations.id"), nullable=False)
    name = Column(String(100), nullable=False)
    department = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    device_name = Column(String(100), nullable=False)  # Raw device name string for easy serialization / compatibility
    access_level = Column(String(20), nullable=False)  # e.g., Critical, High, Medium, Low
    mfa = Column(String(20), nullable=False)  # e.g., Enabled, Disabled
    risk = Column(String(20), nullable=False)  # e.g., High, Medium, Low
    status = Column(String(20), nullable=False)  # e.g., Active, Inactive, Blocked

    organization = relationship("Organization", back_populates="users")
    simulations = relationship("Simulation", back_populates="user")
    ml_risk = relationship("MLUserRisk", uselist=False, back_populates="user")
    device = relationship("Device", uselist=False, back_populates="owner")


class Device(Base):
    __tablename__ = "devices"

    id = Column(String(50), primary_key=True)
    organization_id = Column(String(50), ForeignKey("organizations.id"), nullable=False)
    name = Column(String(100), nullable=False)
    owner_id = Column(String(50), ForeignKey("users.id"), unique=True, nullable=True)  # FK relationship to User.id with 1:1 constraint
    owner_name = Column(String(100), nullable=False)  # Raw owner name string for easy serialization / compatibility
    os = Column(String(50), nullable=False)
    ip = Column(String(50), nullable=False)
    security = Column(String(50), nullable=False)  # e.g., Compliant, Needs Review, Outdated
    last_seen = Column(String(50), nullable=False)
    risk = Column(String(20), nullable=False)  # e.g., High, Medium, Low

    organization = relationship("Organization", back_populates="devices")
    owner = relationship("User", back_populates="device")


class Asset(Base):
    __tablename__ = "assets"

    id = Column(String(50), primary_key=True)
    organization_id = Column(String(50), ForeignKey("organizations.id"), nullable=False)
    name = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False)  # e.g., Network, Server, Database, Storage
    criticality = Column(String(20), nullable=False)  # e.g., Critical, High, Medium, Low
    owner = Column(String(100), nullable=False)
    exposure = Column(String(50), nullable=False)  # e.g., Public, Internal, Restricted
    risk = Column(String(20), nullable=False)  # e.g., Critical, High, Medium, Low
    status = Column(String(20), nullable=False)

    organization = relationship("Organization", back_populates="assets")
    data_assets = relationship("DataAsset", back_populates="storage_asset")


class DataAsset(Base):
    __tablename__ = "data_assets"

    id = Column(String(50), primary_key=True)
    organization_id = Column(String(50), ForeignKey("organizations.id"), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(String(500))
    classification = Column(String(50), nullable=False)  # e.g., Confidential, Restricted, Internal
    record_count = Column(Integer, nullable=False)
    criticality = Column(String(20), nullable=False)  # e.g., Critical, High, Medium, Low
    storage_asset_id = Column(String(50), ForeignKey("assets.id"), nullable=False)  # FK relationship to Asset.id
    storage_name = Column(String(100), nullable=False)  # Raw storage name string for easy serialization / compatibility
    exposure = Column(String(50), nullable=False)

    organization = relationship("Organization", back_populates="data_assets")
    storage_asset = relationship("Asset", back_populates="data_assets")


class SecurityControl(Base):
    __tablename__ = "security_controls"

    id = Column(String(50), primary_key=True)
    organization_id = Column(String(50), ForeignKey("organizations.id"), nullable=False)
    name = Column(String(100), nullable=False)
    short_name = Column(String(50), nullable=False)
    description = Column(String(500), nullable=False)
    status = Column(String(20), nullable=False)  # e.g., Enabled, Disabled
    impact = Column(String(20), nullable=False)
    risk_reduction = Column(Integer, nullable=False)
    affected_assets = Column(JSON)  # list of strings
    default_enabled = Column(Boolean, nullable=False)
    enabled = Column(Boolean, nullable=False)

    organization = relationship("Organization", back_populates="security_controls")


class Simulation(Base):
    __tablename__ = "simulations"

    id = Column(String(50), primary_key=True)
    organization_id = Column(String(50), ForeignKey("organizations.id"), nullable=False)
    scenario_id = Column(String(50), nullable=False)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=False)
    mfa_enabled = Column(Boolean, nullable=False)
    additional_control_id = Column(String(50), ForeignKey("security_controls.id"), nullable=False)  # FK to security_controls
    is_counterfactual = Column(Boolean, default=False, nullable=False)
    parent_simulation_id = Column(String(50), ForeignKey("simulations.id"), nullable=True)
    risk_score = Column(Integer, nullable=False)
    blast_radius = Column(Integer, nullable=False)
    critical_assets = Column(Integer, nullable=False)
    records = Column(Integer, nullable=False)
    blocked_at = Column(String(100), nullable=True)
    path_json = Column(JSON, nullable=False)  # list of node dicts
    context_json = Column(JSON, nullable=False)  # list of context dicts
    note = Column(String(500))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    organization = relationship("Organization", back_populates="simulations")
    user = relationship("User", back_populates="simulations")
    additional_control = relationship("SecurityControl")  # Relationship for mapping control characteristics
    
    # Self-referencing relationships for counterfactual simulations
    parent_simulation = relationship("Simulation", remote_side="Simulation.id", back_populates="counterfactuals")
    counterfactuals = relationship("Simulation", back_populates="parent_simulation", cascade="all, delete-orphan")
    
    blockchain_evidence = relationship("BlockchainEvidence", uselist=False, back_populates="simulation", cascade="all, delete-orphan")


class SecurityEvent(Base):
    __tablename__ = "security_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    time = Column(String(20), nullable=False)
    event = Column(String(255), nullable=False)
    severity = Column(String(20), nullable=False)  # e.g., High, Info, Critical
    status = Column(String(20), nullable=False)  # e.g., Simulated, Applied, Open, Blocked, Completed


class MLUserRisk(Base):
    __tablename__ = "ml_user_risks"

    user_id = Column(String(50), ForeignKey("users.id"), primary_key=True)
    user_name = Column(String(100), nullable=False)  # Store user name string separately for easy serialization
    score = Column(Integer, nullable=False)
    level = Column(String(20), nullable=False)
    confidence = Column(Float, nullable=False)
    signals = Column(JSON)  # list of strings

    user = relationship("User", back_populates="ml_risk")


class BlockchainEvidence(Base):
    __tablename__ = "blockchain_evidence"

    simulation_id = Column(String(50), ForeignKey("simulations.id"), primary_key=True)
    event = Column(String(100), nullable=False)
    timestamp = Column(String(50), nullable=False)
    integrity = Column(String(20), nullable=False)
    hash = Column(String(100), nullable=False)
    ledger = Column(String(20), nullable=False)
    block = Column(Integer, nullable=False)
    description = Column(String(500))

    simulation = relationship("Simulation", back_populates="blockchain_evidence")
