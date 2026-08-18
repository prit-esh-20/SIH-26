from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

class ConfiguredSchema(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

class UserRiskResponse(ConfiguredSchema):
    user_id: str
    user: str
    score: float
    level: str
    confidence: float
    signals: list[str]
