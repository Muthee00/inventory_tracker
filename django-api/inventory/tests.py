from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from .models import Category


class InventoryAuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username="staff@example.com",
            email="staff@example.com",
            password="strong-pass-123",
        )
        Category.objects.create(name="Parts", description="Inventory parts")

    def test_inventory_routes_require_authentication(self):
        response = self.client.get("/api/categories/")

        self.assertEqual(response.status_code, 401)

    def test_authenticated_user_can_access_inventory_routes(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get("/api/categories/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["results"][0]["name"], "Parts")
