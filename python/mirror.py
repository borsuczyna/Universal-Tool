from utils import *
from time import sleep
from moviepy.editor import *
import sys

# Setup variables
directory = parentdir() + sys.argv[1]
inputFile = sys.argv[2]
outputFile = sys.argv[3]
axis = sys.argv[4]

# Directories
absoluteInputFilePath = directory + '\\' + inputFile
absoluteOutputFilePath = directory + '\\' + outputFile

# DEBUG IS NOT SHOWED IN USER CONSOLE

println('[SUCCESS] Process started!')

println('[DEBUG] [Mirror] Input: ' + inputFile + ' | output: ' + outputFile + ' | axis: ' + axis)

# Load video
println('[INFO] Loading video...')
video = VideoFileClip(absoluteInputFilePath)

# Mute video
println('[INFO] Mirroring video...')
if axis == 'horizontally':
    video = video.fx(vfx.mirror_x)
else:
    video = video.fx(vfx.mirror_y)

# Save video
println('[INFO] Saving file...')
video.write_videofile(absoluteOutputFilePath)

# Done
println('[SUCCESS] Done!')
println('[FINISH] ' + outputFile)