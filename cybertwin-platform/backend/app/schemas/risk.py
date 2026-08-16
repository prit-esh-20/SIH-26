from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

class ConfiguredSchema(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

class AttackPathResponse(ConfiguredSchema):
    id: str
    name: str
    path: list[str]
    risk: str
    impact: str
    description: str

class TopRiskResponse(ConfiguredSchema):
    name: str
    severity: str
    score: int
    affected_assets: list[str]
    attack_path: str
    reason: str
    recommended_control: str

class CategoryResponse(ConfiguredSchema):
    id: str
    name: str
    score: int
    severity: str
    explanation: str
    affected_assets: list[str]
    attack_path: str
    reason: str
    recommendation: str
    top_risk: TopRiskResponse

class RiskOverviewResponse(ConfiguredSchema):
    overall_risk: int
    severity: str
    blast_radius: int
    critical_assets: int
    protected_critical: int
    attack_surface: int
    categories: list[CategoryResponse]

class SecurityEventResponse(ConfiguredSchema):
    id: int
    time: str
    event: str
    severity: str
    status: str
