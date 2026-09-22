import httpx

r = httpx.post('http://localhost:8000/auth/login', json={'email': 'customer@test.com', 'password': 'password'})
print('Login:', r.json())
token = r.json().get('token')

headers = {'Authorization': f'Bearer {token}'}
j = httpx.post('http://localhost:8000/jobs', json={'title':'Test','requiredSkill':'Plumber','budget':50.0,'location':'New York','description':'Fix it'}, headers=headers)
print('Job:', j.json())

rec = httpx.get(f'http://localhost:8000/recommend/{j.json()["id"]}', headers=headers)
print('Recommendations:', rec.json())
