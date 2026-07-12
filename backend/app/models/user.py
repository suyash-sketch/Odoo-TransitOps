import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import get_db
from app.models.user import User

# ─────────────────────────────────────────────
# OAuth2 Setup
# Points Swagger UI to the login endpoint.
# ─────────────────────────────────────────────
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)


def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    """
    Validate JWT token and return the authenticated user.
    """

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise credentials_exception

    except InvalidTokenError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()

    if user is None:
        raise credentials_exception

    return user


# ─────────────────────────────────────────────
# Role-Based Access Control (RBAC)
# Admin automatically has access to every route.
# Other users need one of the allowed roles.
# ─────────────────────────────────────────────
def require_roles(*allowed_roles):
    """
    Usage Examples:

    Fleet Manager only:
        Depends(require_roles("Fleet Manager"))

    Dispatcher only:
        Depends(require_roles("Dispatcher"))

    Multiple roles:
        Depends(require_roles("Fleet Manager", "Dispatcher"))
    """

    def role_checker(current_user: User = Depends(get_current_user)):

        # Admin can access everything
        if current_user.role == "Admin":
            return current_user

        # Check allowed roles
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to access this resource."
            )

        return current_user

    return role_checker


# ─────────────────────────────────────────────
# Admin-only dependency
# Use for user management, settings, etc.
# ─────────────────────────────────────────────
def require_admin(
    current_user: User = Depends(get_current_user)
) -> User:

    if current_user.role != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required."
        )

    return current_user