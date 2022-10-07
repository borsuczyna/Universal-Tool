from utils import *
from time import sleep
from moviepy.editor import *
import sys

# Setup variables
directory = parentdir() + sys.argv[1]
inputFile = sys.argv[2]
outputFile = sys.argv[3]
degrees = sys.argv[4]

# Directories
absoluteInputFilePath = directory + '\\' + inputFile
absoluteOutputFilePath = directory + '\\' + outputFile

# DEBUG IS NOT SHOWED IN USER CONSOLE

println('[SUCCESS] Process started!')

println('[DEBUG] [Rotate] Input: ' + inputFile + ' | output: ' + outputFile + ' | degrees: ' + degrees)

# Load video
println('[INFO] Loading video...')
video = VideoFileClip(absoluteInputFilePath)

# Mute video
println('[INFO] Rotating video...')
video = video.rotate(-int(degrees))

# Save video
println('[INFO] Saving file...')
video.write_videofile(absoluteOutputFilePath)

# Done
println('[SUCCESS] Done!')
println('[FINISH] ' + outputFile)