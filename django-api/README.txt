# InvenTrack Django REST API

## Setup

```bash
cd django-api
pip install -r requirements.txt
```

## Configure MySQL

1. Create the database:
```sql
CREATE DATABASE inventrack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Copy `.env.example` to `.env` and update credentials:
```bash
cp .env.example .env
```

## Run Migrations & Start

```bash
python manage.py makemigrations inventory
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## API Endpoints

| Endpoint | Methods | Description |
|---|---|---|
| `/api/products/` | GET, POST | List/Create products |
| `/api/products/{id}/` | GET, PUT, PATCH, DELETE | Product detail |
| `/api/products/dashboard_stats/` | GET | Dashboard statistics |
| `/api/products/stock_by_category/` | GET | Stock by category |
| `/api/categories/` | GET, POST | List/Create categories |
| `/api/categories/{id}/` | GET, PUT, PATCH, DELETE | Category detail |
| `/api/suppliers/` | GET, POST | List/Create suppliers |
| `/api/suppliers/{id}/` | GET, PUT, PATCH, DELETE | Supplier detail |
| `/api/purchase-orders/` | GET, POST | List/Create orders |
| `/api/purchase-orders/{id}/` | GET, PUT, PATCH, DELETE | Order detail |
| `/api/stock-alerts/` | GET, POST | List/Create alerts |
| `/api/stock-alerts/{id}/resolve/` | POST | Resolve an alert |

- Search: `?search=term`
- Filter: `?status=active`, `?category=1`
- Ordering: `?ordering=-price`
- Pagination: `?page=2`
- Admin panel: `/admin/`
