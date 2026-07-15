"""change article embedding dimension to 3072

Revision ID: f1f3af704bea
Revises: 8cf7f403eab7
Create Date: 2026-07-15 08:08:05.062159

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import VECTOR


# revision identifiers, used by Alembic.
revision: str = 'f1f3af704bea'
down_revision: Union[str, Sequence[str], None] = '8cf7f403eab7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_column("article_embeddings", "embedding")
    op.add_column(
        "article_embeddings",
        sa.Column("embedding", VECTOR(dim=3072), nullable=False),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("article_embeddings", "embedding")
    op.add_column(
        "article_embeddings",
        sa.Column("embedding", VECTOR(dim=768), nullable=False),
    )
