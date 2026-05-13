import os
files = ['src/index.html', 'src/contacto.html', 'src/nosotros.html']
font_link = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;800&display=swap" rel="stylesheet">'

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'fonts.googleapis.com' not in content:
        content = content.replace('</head>', f'  {font_link}\n</head>')
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f'Restored font in {f}')
