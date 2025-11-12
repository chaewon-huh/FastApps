"""Shop widget for displaying fashion products."""

from pydantic import BaseModel
from fastapps import BaseWidget


class ShopInput(BaseModel):
    """Input for the shop widget."""
    query: str = "best jackets"


class ShopWidget(BaseWidget):
    """Shop widget displaying fashion products with ratings and tags."""

    identifier = "shop"
    title = "Search Products"
    input_schema = ShopInput
    invoking = "Searching products..."
    invoked = "Found products"

    # CSP configuration for product images
    widget_csp = {
        "resource_domains": [
            "https://file.chaewon.me"
        ],
        "connect_domains": []
    }

    async def execute(self, input_data: ShopInput, context, user):
        """Return product data for the shop widget."""

        # Mock product data matching the target UI
        products = [
            {
                "id": 1,
                "title": "Cashmere - wool jacket",
                "brand": "Fabulous",
                "price": 138,
                "originalPrice": None,
                "rating": 4.5,
                "reviews": 2493,
                "image": "https://file.chaewon.me/custom-garments/dooi_wool_jacket.png",
                "tags": [
                    {"icon": "ShoppingBag", "text": "Outer"},
                    {"icon": "User", "text": "Mens"},
                    {"icon": "Tag", "text": "Cashmere"}
                ],
                "discount": None,
                "isNew": False
            },
            {
                "id": 2,
                "title": "Italian green - cashmere jacket",
                "brand": "Fabulous",
                "price": 161,
                "originalPrice": 177,
                "rating": 4.5,
                "reviews": 212,
                "image": "https://file.chaewon.me/custom-garments/dooi_cashmere_jacket.png",
                "tags": [
                    {"icon": "ShoppingBag", "text": "Outer"},
                    {"icon": "Tag", "text": "Cashmere"}
                ],
                "discount": "9.0",
                "isNew": False
            },
            {
                "id": 3,
                "title": "Premium leather bomber",
                "brand": "Luxe",
                "price": 299,
                "originalPrice": None,
                "rating": 5,
                "reviews": 847,
                "image": "https://file.chaewon.me/custom-garments/dooi_lether_bomber.png",
                "tags": [
                    {"icon": "ShoppingBag", "text": "Outer"},
                    {"icon": "Star", "text": "Premium"},
                    {"icon": "Tag", "text": "Leather"}
                ],
                "discount": None,
                "isNew": True
            },
            {
                "id": 4,
                "title": "Quilted winter parka",
                "brand": "Nordic",
                "price": 225,
                "originalPrice": 280,
                "rating": 4,
                "reviews": 1392,
                "image": "https://file.chaewon.me/custom-garments/dooi_quilted_parka.png",
                "tags": [
                    {"icon": "ShoppingBag", "text": "Outer"},
                    {"icon": "Snowflake", "text": "Winter"},
                    {"icon": "Shield", "text": "Waterproof"}
                ],
                "discount": "20%",
                "isNew": False
            }
        ]

        return {
            "query": input_data.query,
            "products": products,
            "totalResults": len(products)
        }