"""
Base view class with generic functionality.

Implements Class-generics requirement providing common CRUD operations
that can be inherited by specific resource views.
"""
from typing import Type, TypeVar, Generic, Optional, Dict, Any
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, ValidationError

from src.shared.base_model import BaseModel
from src.core.extensions import db

# Generic type for model classes
ModelType = TypeVar('ModelType', bound=BaseModel)


class BaseResourceView(Generic[ModelType]):
    """
    Generic base view class for RESTful resource operations.
    
    Implements the Class-generics requirement by providing type-safe
    CRUD operations that can be inherited and customized by specific views.
    """
    
    def __init__(
        self, 
        model_class: Type[ModelType],
        response_schema: Schema,
        create_schema: Optional[Schema] = None,
        update_schema: Optional[Schema] = None
    ):
        """
        Initialize generic view with model and schema configuration.
        
        Args:
            model_class: SQLAlchemy model class for this resource
            response_schema: Marshmallow schema for serializing responses
            create_schema: Optional schema for create operations
            update_schema: Optional schema for update operations
        """
        self.model_class = model_class
        self.response_schema = response_schema
        self.create_schema = create_schema or response_schema
        self.update_schema = update_schema or response_schema
    
    def get_list(self, **filters) -> tuple[dict, int]:
        """
        Generic list operation with filtering support.
        
        Returns paginated list of resources with optional filtering.
        Can be overridden by subclasses for custom query logic.
        """
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        
        query = self.model_class.query
        
        # Apply filters if provided
        for field, value in filters.items():
            if hasattr(self.model_class, field):
                query = query.filter(getattr(self.model_class, field) == value)
        
        paginated = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return {
            'items': self.response_schema.dump(paginated.items, many=True),
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': paginated.total,
                'pages': paginated.pages
            }
        }, 200
    
    def get_item(self, item_id: int) -> tuple[dict, int]:
        """Generic single item retrieval."""
        item = self.model_class.find_by_id(item_id)
        
        if not item:
            return {'error': f'{self.model_class.__name__} not found'}, 404
        
        return self.response_schema.dump(item), 200
    
    def create_item(self, **extra_fields) -> tuple[dict, int]:
        """
        Generic item creation with validation.
        
        Args:
            extra_fields: Additional fields to set on the model
        """
        try:
            data = self.create_schema.load(request.json)
        except ValidationError as err:
            return {'errors': err.messages}, 400
        
        # Merge request data with extra fields
        data.update(extra_fields)
        
        try:
            item = self.model_class(**data)
            item.save()
            
            return self.response_schema.dump(item), 201
            
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to create item'}, 500
    
    def update_item(self, item_id: int, **extra_fields) -> tuple[dict, int]:
        """Generic item update with validation."""
        item = self.model_class.find_by_id(item_id)
        
        if not item:
            return {'error': f'{self.model_class.__name__} not found'}, 404
        
        try:
            data = self.update_schema.load(request.json)
        except ValidationError as err:
            return {'errors': err.messages}, 400
        
        # Update item with validated data and extra fields
        for field, value in {**data, **extra_fields}.items():
            if hasattr(item, field):
                setattr(item, field, value)
        
        item.save()
        
        return self.response_schema.dump(item), 200
    
    def delete_item(self, item_id: int) -> tuple[dict, int]:
        """Generic item deletion."""
        item = self.model_class.find_by_id(item_id)
        
        if not item:
            return {'error': f'{self.model_class.__name__} not found'}, 404
        
        item.delete()
        
        return {'message': f'{self.model_class.__name__} deleted successfully'}, 200


class UserOwnedResourceView(BaseResourceView[ModelType]):
    """
    Base view for resources owned by users.
    
    Extends generic base view with user ownership validation
    ensuring users can only access their own resources.
    """
    
    def __init__(self, model_class: Type[ModelType], user_field: str = 'user_id', **kwargs):
        """
        Initialize user-owned resource view.
        
        Args:
            model_class: SQLAlchemy model class
            user_field: Field name that contains user ID reference
        """
        super().__init__(model_class, **kwargs)
        self.user_field = user_field
    
    def get_user_query(self):
        """Get base query filtered by current user."""
        user_id = get_jwt_identity()
        return self.model_class.query.filter(
            getattr(self.model_class, self.user_field) == user_id
        )
    
    def get_list(self, **filters) -> tuple[dict, int]:
        """Override to filter by current user."""
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        
        query = self.get_user_query()
        
        # Apply additional filters
        for field, value in filters.items():
            if hasattr(self.model_class, field):
                query = query.filter(getattr(self.model_class, field) == value)
        
        paginated = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return {
            'items': self.response_schema.dump(paginated.items, many=True),
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': paginated.total,
                'pages': paginated.pages
            }
        }, 200
    
    def get_item(self, item_id: int) -> tuple[dict, int]:
        """Override to ensure user ownership."""
        query = self.get_user_query()
        item = query.filter(self.model_class.id == item_id).first()
        
        if not item:
            return {'error': f'{self.model_class.__name__} not found'}, 404
        
        return self.response_schema.dump(item), 200