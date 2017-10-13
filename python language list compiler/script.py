import re
import json
p = re.compile('(?:\[{{fullurl:)(.{1,3})(?!(?::Special))(?::).*(?:}} )(.+)(?:])', re.UNICODE)
n = re.compile("(?:''')(.+)(?:''')", re.UNICODE)
# https://simple-regex.com/build/59c1862d3e5ad

w = open('langlist.txt', 'w', encoding='utf-8')
data = []

with open('wikistat.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for i in range(len(lines)):
        m = p.search(lines[i])
        if m:
            number = int(n.search(lines[i+2]).group(0)[3:-3].replace(',', ''))
            data.append([m.group(1), m.group(2), number])
    print(data)
    json.dump(data,w, ensure_ascii=False)
f.closed
w.close()
