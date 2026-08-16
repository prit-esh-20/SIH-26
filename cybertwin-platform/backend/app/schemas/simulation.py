from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

class ConfiguredSchema(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

class ScenarioResponse(ConfiguredSchema):
    id: str
    name: str
    description: str

class SimulationUserResponse(ConfiguredSchema):
    id: str
    name: str
    role: str
    department: str

class SimulationNode(ConfiguredSchema):
    id: str
    label: str
    type: str
    compromised: bool = False
    blocked: bool = False
    critical: bool = False

class SimulationRequest(ConfiguredSchema):
    scenario_id: str
    user_id: str
    mfa: bool
    control: str

class CounterfactualRequest(ConfiguredSchema):
    scenario_id: str
    user_id: str
    mfa: bool
    control: str
    control_id: str

class SimulationResponse(ConfiguredSchema):
    id: str
    scenario_id: str
    scenario_name: str
    user_name: str
    user_role: str
    mfa: bool
    control: str
    risk: int
    blast_radius: int
    critical_assets: int
    records: int
    blocked_at: str | None
    severity: str
    path: list[SimulationNode]
    graph_context: list[SimulationNode]
    note: str

class SimulationHistoryResponse(SimulationResponse):
    pass
