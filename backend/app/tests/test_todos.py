from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def get_token():
    client.post("/api/users/register", json={
        "username": "testuser",
        "email": "test@test.com",
        "password": "testpass123"
    })
    res = client.post("/api/users/login", data={
        "username": "testuser",
        "password": "testpass123"
    })
    return res.json()["access_token"]

def test_create_todo():
    token = get_token()
    res = client.post("/api/todos/", json={"title": "Test task"},
                      headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 201
    assert res.json()["title"] == "Test task"

def test_get_todos():
    token = get_token()
    res = client.get("/api/todos/", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert isinstance(res.json(), list)

def test_update_todo():
    token = get_token()
    create = client.post("/api/todos/", json={"title": "Update me"},
                         headers={"Authorization": f"Bearer {token}"})
    todo_id = create.json()["id"]
    res = client.patch(f"/api/todos/{todo_id}", json={"done": True},
                       headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert res.json()["done"] is True

def test_delete_todo():
    token = get_token()
    create = client.post("/api/todos/", json={"title": "Delete me"},
                         headers={"Authorization": f"Bearer {token}"})
    todo_id = create.json()["id"]
    res = client.delete(f"/api/todos/{todo_id}",
                        headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 204

def test_health():
    res = client.get("/health")
    assert res.status_code == 200