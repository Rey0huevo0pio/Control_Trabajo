# -*- coding: utf-8 -*-
import re

path = 'c:/Users/agenc/Documents/Control_Trabajo/stv-web/src/src_Chat_STV/screens/Componets_Correos/views/EmailInboxView.jsx'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix literal backslash-n sequences from corruption
content = content.replace('\\n', '\n')

lines = content.split('\n')

# Fix 1: Add missing </div> closing the outer loading container
# Look for pattern: two closing divs at wrong indent then ); at wrong indent
for i in range(len(lines)):
    if '        </div>' in lines[i] and i + 1 < len(lines) and '      </div>' in lines[i+1]:
        # Check if this is loading section context
        if i > 10 and any('Cargando correos' in lines[j] for j in range(max(0, i-15), i)):
            # Check if next-next line is wrong-indent );
            if i + 2 < len(lines) and '    );' in lines[i+2]:
                lines[i+1] = '      </div>'
                lines[i+2] = '    );'
            break

# Fix 2: Add missing </div> after search bar (before Lista de correos)
# Find line with /button followed by /div (search bar close), then "      {/* Lista de correos */}"
for i in range(len(lines)-1):
    if '      {/* Lista de correos */}' in lines[i]:
        # Insert </div> before this line
        lines[i] = '      </div>\n\n      {/* Lista de correos */}'
        break

# Fix 3: Add missing </div> closing Content container before "Indicador de no leído"
# Find where comment is at wrong indentation (should be inside email item)
for i in range(len(lines)):
    if '{/* Indicador de no leído */}' in lines[i]:
        # The div before this should be </div> closing Content
        # Check if line before is closing the span (preview text) - it should be </div>
        if i > 0 and '                  </span>' in lines[i-1]:
            # It's the wrong place - insert </div> before comment
            indent = '                '  # 16 spaces
            lines[i] = indent + '</div>\n\n' + lines[i]
        break

# Rejoin
content = '\n'.join(lines)

# Fix any remaining literal \n sequences (shouldn't be any now)
content = content.replace('\\\\n', '\\n')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed InboxView')
