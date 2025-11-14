"""
Esquemas Pydantic para validación de datos
"""
from pydantic import BaseModel, Field, validator


class UserRegister(BaseModel):
    """Esquema para registro de usuario"""
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)
    
    @validator('username')
    def username_alphanumeric(cls, v):
        if not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError('El username solo puede contener letras, números, guiones y guiones bajos')
        return v.lower()


class UserLogin(BaseModel):
    """Esquema para login de usuario"""
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)


class UserResponse(BaseModel):
    """Esquema para respuesta de usuario"""
    id: int
    username: str
    created_at: str
    
    class Config:
        from_attributes = True

