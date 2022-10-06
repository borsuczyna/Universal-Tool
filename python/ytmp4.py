from utils import *
from time import sleep
from pytube import YouTube
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

def percent(self, tem, total):
    perc = (float(tem) / float(total)) * float(100)
    return perc

def progress_function(stream, chunk, bytes_remaining):
    total_size = stream.filesize
    bytes_downloaded = total_size - bytes_remaining
    percentage_of_completion = bytes_downloaded / total_size * 100
    println('[PROGRESS] ' + str(int(percentage_of_completion)))

# Find stream
println('[INFO] Getting video info...')
video = YouTube('https://youtu.be/' + url, on_progress_callback=progress_function)
streams = video.streams.filter(progressive=True, file_extension='mp4')
stream = streams.filter(res=quality)
if len(stream) == 0:
    stream = streams.first()

if not stream:
    println('[ERROR] No valid sources for this video are available')

# Download
println('[INFO] Found stream, downloading...')
stream.download(filename=outputFile, output_path=directory)

# Done
println('[SUCCESS] Done!')
println('[FINISH] ' + outputFile)