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
