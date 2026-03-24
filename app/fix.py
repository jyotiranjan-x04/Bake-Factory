import re
with open('src/app/globals.css', 'r', encoding='utf-8') as f:
    content = f.read()

idx = content.find('.material-symbols-outlined')
part1 = content[:idx]

# find next '}'
idx2 = content.find('}', idx)
part1 = content[:idx2+1]

good_css = '''
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-50% - 0.75rem)); }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}

.pause-on-hover:hover .animate-marquee {
  animation-play-state: paused;
}
'''

with open('src/app/globals.css', 'w', encoding='utf-8') as f:
    f.write(part1 + '\n\n' + good_css.strip() + '\n')
