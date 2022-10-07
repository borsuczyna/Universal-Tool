from utils import *
from time import sleep
from moviepy.editor import *
import sys

# Setup variables
directory = parentdir() + sys.argv[1]
file1 = sys.argv[2]
file2 = sys.argv[3]
outputFile = sys.argv[4]

# Directories
absoluteFile1Path = directory + '\\' + file1
absoluteFile2Path = directory + '\\' + file2
absoluteOutputFilePath = directory + '\\' + outputFile

# DEBUG IS NOT SHOWED IN USER CONSOLE

println('[SUCCESS] Process started!')

println('[DEBUG] [Merge] File 1: ' + file1 + ' | file 2: ' + file2)

# Load video
println('[INFO] Loading videos...')
video1 = VideoFileClip(absoluteFile1Path)
video2 = VideoFileClip(absoluteFile2Path)

# Mute video
println('[INFO] Merging videos...')
video = concatenate_videoclips([video1, video2])

# Save video
println('[INFO] Saving file...')
video.write_videofile(absoluteOutputFilePath)

# Done
println('[SUCCESS] Done!')
println('[FINISH] ' + outputFile)