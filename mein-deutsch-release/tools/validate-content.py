#!/usr/bin/env python3
import json, pathlib, sys
root=pathlib.Path(__file__).resolve().parents[1]
cat=json.loads((root/'content/catalog.json').read_text(encoding='utf-8'))
ids=set(); errors=[]; counts={}
for item in cat['packages']:
    p=root/item['path']; data=json.loads(p.read_text(encoding='utf-8'))
    if data.get('packageId')!=item['id']: errors.append(f'packageId mismatch: {p}')
    profile=data['profileId']; counts.setdefault(profile,0)
    for lesson in data['course'].get('lessons',[]):
        if not lesson.get('id'): errors.append(f'missing lesson id: {p}')
        for w in lesson.get('words',[]):
            wid=w.get('id')
            if not wid: errors.append(f'missing word id: {p}')
            elif wid in ids: errors.append(f'duplicate id: {wid}')
            ids.add(wid); counts[profile]+=1
            for req in ('de','uk'):
                if not str(w.get(req,'')).strip(): errors.append(f'{wid}: missing {req}')
print('Counts:', counts)
print('Unique cards:', len(ids))
if errors:
    print('\n'.join(errors[:100])); sys.exit(1)
print('Validation OK')
