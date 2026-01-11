from fastapi import FastAPI, HTTPException
import redis
import requests
import os
import json

app = FastAPI()
redis_client = redis.Redis(host='redis', port=6379, decode_responses=True)
API_KEY = os.getenv('OPENWEATHER_API_KEY', 'demo_key')  # Replace with actual key
BASE_URL = 'http://api.openweathermap.org/data/2.5/weather'

@app.get('/weather')
async def get_weather(city: str):
    cache_key = f'weather:{city}'
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    params = {'q': city, 'appid': API_KEY, 'units': 'metric'}
    response = requests.get(BASE_URL, params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail='Weather data not available')

    data = response.json()
    weather = {
        'city': data['name'],
        'temperature': data['main']['temp'],
        'description': data['weather'][0]['description'],
        'icon': data['weather'][0]['icon']
    }

    redis_client.setex(cache_key, 1800, json.dumps(weather))  # 30 min
    return weather

# For reminders, perhaps another endpoint, but for now, just weather.
