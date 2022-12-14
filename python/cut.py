from utils import *
from time import sleep
from moviepy.editor import VideoFileClip
import sys

# Setup variables
directory = parentdir() + sys.argv[1]
inputFile = sys.argv[2]
outputFile = sys.argv[3]
start = sys.argv[4]
end = sys.argv[5]

# Directories
absoluteInputFilePath = directory + '\\' + inputFile
absoluteOutputFilePath = directory + '\\' + outputFile

# DEBUG IS NOT SHOWED IN USER CONSOLE

println('[SUCCESS] Process started!')

println('[DEBUG] [Cut] Input: ' + inputFile + ' | output: ' + outputFile + ' | start: ' + start + ' | end: ' + end)

# Load video
println('[INFO] Loading video...')
video = VideoFileClip(absoluteInputFilePath)

# Cut video
println('[INFO] Cutting...')
video = video.subclip(start, end)

# Save video
println('[INFO] Saving file...')
video.write_videofile(absoluteOutputFilePath)

# Done
println('[SUCCESS] Done!')
println('[FINISH] ' + outputFile)