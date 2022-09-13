from time import sleep
from pathlib import Path
import sys
import os

def parentdir():
    path = Path(os.getcwd())
    return path.absolute().__str__() + '\\'

_sleep = sleep
def sleepms(ms):
    _sleep(ms/1000)

_print = print
def println(data):
    _print(data)
    sys.stdout.flush()