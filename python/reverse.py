from utils import *
from time import sleep
from moviepy.editor import *
import moviepy.video.fx.all as vfx
from moviepy.video.fx import *
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

println('[DEBUG] Input file: ' + absoluteInputFilePath)
println('[DEBUG] Output file: ' + absoluteOutputFilePath)

# Load video
println('[INFO] Loading video...')
video = VideoFileClip(absoluteInputFilePath)

# Change video's speed
println('[INFO] Reversing video...')

video = video.fx(vfx.time_mirror)

# Save video
println('[INFO] Saving file...')
video.write_videofile(absoluteOutputFilePath)

# Done
println('[SUCCESS] Done!')
println('[FINISH] ' + outputFile)