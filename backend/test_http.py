import httpx
import asyncio

async def main():
    try:
        r = httpx.post('http://localhost:8000/auth/register', json={'name': 'Test2', 'email': 'test991@example.com', 'password': 'password', 'role': 'CUSTOMER'})
        print(r.status_code, r.text)
    except Exception as e:
        print(e)

asyncio.run(main())
