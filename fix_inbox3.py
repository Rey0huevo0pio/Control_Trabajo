# -*- coding: utf-8 -*-
import re

path = 'c:/Users/agenc/Documents/Control_Trabajo/stv-web/src/src_Chat_STV/screens/Componets_Correos/views/EmailInboxView.jsx'

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Fix 1: Loading section - missing </div> closing outer container
# Find line with "        </div>" followed by "    );" in loading section
for i in range(len(lines) - 2):
    if lines[i].strip() == '</div>' and lines[i+1].strip() == ');':
        # Check if we're in loading section (look back for "Cargando correos")
        context = ''.join(lines[max(0, i-15):i])
        if 'Cargando correos' in context:
            lines[i] = '        </div>\n'
            lines[i+1] = '      </div>\n'
            lines.insert(i+2, '    );\n')
            break

# Fix 2: Header section - missing </div> after search bar
# Find the line with "      {/* Lista de correos */}"
for i in range(len(lines)):
    if '      {/* Lista de correos */}' in lines[i]:
        lines[i] = '      </div>\n\n      {/* Lista de correos */}\n'
        break

# Fix 3: Email item - missing </div> closing Content container before unread indicator
# Find the line with "                {/* Indicador de no leído */}"
for i in range(len(lines)):
    if '{/* Indicador de no leído */}' in lines[i]:
        # Get indentation of this line
        indent = len(lines[i]) - len(lines[i].lstrip())
        base_indent = ' ' * (indent - 2)  # Parent level
        lines[i] = base_indent + '</div>\n\n' + lines[i]
        break

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Fixed!')
