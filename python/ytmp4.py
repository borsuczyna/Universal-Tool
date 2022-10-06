from utils import *
from time import sleep
from pytube import Youtube
import sys

# Setup variables
directory = parentdir() + sys.argv[1]
url = sys.argv[2]
quality = sys.argv[3]
outputFile = sys.argv[4]

# Directories
absoluteOutputFilePath = directory + '\\' + outputFile

# DEBUG IS NOT SHOWED IN USER CONSOLE

println('[SUCCESS] Process started!')

println('[DEBUG] [Youtube downloader (mp4)] Url: ' + url + ' | quality: ' + quality + ' | output: ' + outputFile)

# Download video
println('[INFO] Downloading video...')
video = Youtube('https:/youtube.com/watch?v=' + url)
print(video)