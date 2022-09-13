from utils import *
from time import sleep
from moviepy.editor import *
import sys

# Setup variables
directory = parentdir() + sys.argv[1]
inputFile = sys.argv[2]
outputFile = sys.argv[3]
playBackRate = sys.argv[4]

# Directories
absoluteInputFilePath = directory + '\\' + inputFile
absoluteOutputFilePath = directory + '\\' + outputFile

# DEBUG IS NOT SHOWED IN USER CONSOLE

println('[SUCCESS] Process started!')

println('[DEBUG] Input file: ' + absoluteInputFilePath)
println('[DEBUG] Output file: ' + absoluteOutputFilePath)
println('[DEBUG] PlayBack Rate: ' + playBackRate)

# Load video
println('[INFO] Loading video...')
video = VideoFileClip(absoluteInputFilePath)

# Change video's speed
println('[INFO] Changin speed...')
video = video.fx(vfx.speed, playBackRate)

# Save video
println('[INFO] Saving file...')
video.write_videofile(absoluteOutputFilePath)

# Done
println('[SUCCESS] Done!')
println('[FINISH] ' + outputFile)