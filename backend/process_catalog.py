# process_catalog.py
import os, sys, json, urllib.request, io, shutil
from PIL import Image, ImageDraw

FRONTEND_DIR = os.path.abspath(os.path.join('..', 'frontend', 'public', 'products'))
BACKEND_DIR = os.path.abspath(os.path.join('static', 'products'))
os.makedirs(FRONTEND_DIR, exist_ok=True)
os.makedirs(BACKEND_DIR, exist_ok=True)

print('Directories verified.')
