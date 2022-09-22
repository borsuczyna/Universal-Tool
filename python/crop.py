from utils import *
from time import sleep
from moviepy.editor import VideoFileClip
import sys

print(sys.argv)

# Setup variables
directory = parentdir() + sys.argv[1]
inputFile = sys.argv[2]
outputFile = sys.argv[3]
x = sys.argv[4]
y = sys.argv[5]
width = sys.argv[6]
height = sys.argv[7]

x = int(float(x))
y = int(float(y))
width = int(float(width))
height = int(float(height))

# Directories
absoluteInputFilePath = directory + '\\' + inputFile
absoluteOutputFilePath = directory + '\\' + outputFile

# DEBUG IS NOT SHOWED IN USER CONSOLE

println('[SUCCESS] Process started!')

println('[DEBUG] [Cut] Input: ' + inputFile + ' | output: ' + outputFile + ' | x: ' + str(x) + ' | y: ' + str(y) + ' | width: ' + str(width) + ' | height: ' + str(height))

# Load video
println('[INFO] Loading video...')
video = VideoFileClip(absoluteInputFilePath)

# Cut video
println('[INFO] Cutting...')
video = video.crop(x1=x, y1=y, x2=x+width, y2=y+height)

# Save video
println('[INFO] Saving file...')
video.write_videofile(absoluteOutputFilePath)

# Done
println('[SUCCESS] Done!')
println('[FINISH] ' + outputFile)