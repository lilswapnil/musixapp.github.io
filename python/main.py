import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os
import dotenv

dotenv.load_dotenv()

scope = "user-top-read user-library-read user-read-playback-state user-modify-playback-state user-read-recently-played"

try:
    sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
        client_id=os.getenv('SPOTIPY_CLIENT_ID'),
        client_secret=os.getenv('SPOTIPY_CLIENT_SECRET'),
        redirect_uri=os.getenv('SPOTIPY_REDIRECT_URI'),
        scope=scope
    ))

    results = sp.current_user_top_tracks(limit=50)

    for idx, item in enumerate(results['items']):
        track = item
        print(f"{idx + 1}. {track['artists'][0]['name']} – {track['name']}")
except spotipy.exceptions.SpotifyException as e:
    print(f"An error occurred: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")