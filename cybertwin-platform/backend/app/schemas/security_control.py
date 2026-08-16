from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

class SecurityControlResponse(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

    id: str
    organization_id: str
    name: str
    short_name: str
    description: str
    status: str
    impact: str
    risk_reduction: int
    affected_assets: list[str]
    default_enabled: bool
    enabled: bool

class ToggleRequest(BaseModel):
    enabled: bool | None = None
