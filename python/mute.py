from utils import *
from time import sleep
from moviepy.editor import VideoFileClip
import sys

# Setup variables
directory = parentdir() + sys.argv[1]
inputFile = sys.argv[2]
outputFile = sys.argv[3]

# Directories
absoluteInputFilePath = directory + '\\' + inputFile
absoluteOutputFilePath = directory + '\\' + outputFile

# DEBUG IS NOT SHOWED IN USER CONSOLE

println('[SUCCESS] Process started!')

println('[DEBUG] [Mute] Input: ' + inputFile + ' | output: ' + outputFile)

# Load video
println('[INFO] Loading video...')
video = VideoFileClip(absoluteInputFilePath)

# Mute video
println('[INFO] Mutting...')
video = video.without_audio()

# Save video
println('[INFO] Saving file...')
video.write_videofile(absoluteOutputFilePath)

# Done
println('[SUCCESS] Done!')
println('[FINISH] ' + outputFile)