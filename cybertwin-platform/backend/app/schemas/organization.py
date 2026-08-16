from pydantic import BaseModel, ConfigDict, Field, AliasChoices
from pydantic.alias_generators import to_camel

class OrganizationResponse(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )
    
    name: str
    industry: str
    environment: str
    twin_status: str
    description: str | None
    departments: list[str]

class UserResponse(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )
    
    id: str
    name: str
    department: str
    role: str
    device: str = Field(..., validation_alias="device_name", serialization_alias="device")
    access_level: str
    mfa: str
    risk: str
    status: str


class DeviceResponse(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )
    
    id: str
    organization_id: str
    name: str
    owner_id: str | None
    owner: str = Field(..., validation_alias="owner_name", serialization_alias="owner")
    os: str
    ip: str
    security: str
    last_seen: str
    risk: str


class AssetResponse(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )
    
    id: str
    organization_id: str
    name: str
    type: str
    criticality: str
    owner: str
    exposure: str
    risk: str
    status: str


class DataAssetResponse(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )
    
    id: str
    organization_id: str
    name: str
    description: str | None
    classification: str
    record_count: int
    criticality: str
    storage_asset_id: str
    storage: str = Field(..., validation_alias="storage_name", serialization_alias="storage")
    exposure: str
