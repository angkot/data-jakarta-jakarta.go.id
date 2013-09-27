import csv
import sys
import json

def parse(f):
  d = json.load(f)
  return d

def main():
  w = csv.writer(sys.stdout)

  for f in sys.argv[1:]:
    for r in parse(open(f)):
      w.writerow(r)

if __name__ == '__main__':
  main()

