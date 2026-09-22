import asyncio
from app.routes.auth_routes import register
from app.models.schemas import UserRegister

async def main():
    u = UserRegister(name='Test', email='t@t.com', password='password', role='CUSTOMER')
    try:
        res = await register(u)
        print(res)
    except Exception as e:
        import traceback
        traceback.print_exc()

asyncio.run(main())
