#!/usr/bin/env python3
"""정책셰프 김현성 소개 영상 — 장면 코드 (9:16 · 8장면 · 약 36초 · 나레이션 없음)

콘셉트: 한 단어가 쪼개지며 한 사람의 27년이 열린다 — «소버린» → «소(상공인을) 버린» → «부리는».
킥: 1장면 «(상공인을)» 끼어들기 ↔ 7장면 «버린» 줄 긋고 «부리는» 쾅 (글귀 바뀜 · 매치)

작업 폴더에서:  python3 scenes.py --sheet  ·  --check  →  python3 scenes.py --bake
"""
import os
import sys

SKILL = os.environ.get('MOTION_SKILL') or os.path.expanduser('~/.claude/skills/motion-studio')
sys.path.insert(0, os.path.join(SKILL, 'scripts'))

from core import appear, audio, bake, camera, canvas, fx, kit, motion   # noqa: E402
from core.ease import seg, eo, eio, cl                                  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
BOARD = lambda n: os.path.join(HERE, 'canvas', '확정', n)
W, H, FPS = 1080, 1920, 30

SC = [('Main.dc.html', 4.0), ('Scene02.dc.html', 4.0), ('Scene03.dc.html', 6.0), ('Scene04.dc.html', 5.5),
      ('Scene05.dc.html', 4.0), ('Scene06.dc.html', 4.5), ('Scene07.dc.html', 4.5), ('Scene08.dc.html', 4.0)]
DURS = [d for _, d in SC]
STARTS = [sum(DURS[:i]) for i in range(len(DURS))]
SCENES = [(s, s + d) for s, d in zip(STARTS, DURS)]
DUR = SCENES[-1][1]
B = [canvas.read_board(BOARD(n)) for n, _ in SC]
KIT = '팝'
K = kit.load(KIT)
PAL = {'bg': (16, 48, 46), 'txt': (16, 48, 46), 'dim': (78, 101, 99), 'white': (245, 248, 247),
       'accent': (237, 178, 80), 'red': (217, 91, 67), 'panel': (16, 48, 46)}


def T(els, s):
    """글자로 요소 찾기 (앞부분 일치)"""
    return next(e for e in els if e['text'].startswith(s))


def boxes(els, pred):
    return [e for e in els if pred(e)]


def still_text(e, text, color=None):
    """같은 자리 · 같은 모양에 글자만 바꾼 요소 (숫자 굴리기 · 색 바꾸기용)"""
    d = {k: v for k, v in e.items() if k not in ('_layer', '_split')}
    d['text'] = text
    if color is not None: d['color'] = color[:3]; d['tcolor_a'] = color[3] if len(color) > 3 else 255
    return d


# ── 장면 1 · 훅: «소 / 버린 AI»에 바짝 붙었다가 빠지며 공개 → «(상공인을)» 툭 끼어듦 ──
def s1(lt, root, els):
    img = canvas.background(root)
    tag, so, wedge, bar, beorin, quote, who = (T(els, '2025'), T(els, '소'), T(els, '(상공'), els[3],
                                               T(els, '버린'), T(els, '“'), T(els, '—'))
    motion.put(img, so); motion.put(img, beorin)                         # 큰 두 줄은 처음부터 — 움직이는 건 카메라
    appear.put(img, tag, seg(lt, 0.9, 1.3), 'fade')
    appear.put(img, wedge, seg(lt, 1.2, 1.55), 'pop')                    # 킥 ①: 끼어들기
    appear.put(img, bar, seg(lt, 1.55, 1.85), 'wipe')
    appear.lines(img, quote, seg(lt, 2.0, 2.9))
    appear.put(img, who, seg(lt, 2.8, 3.2), 'left', dist=60)
    words = (so['x'], so['y'], beorin['w'], beorin['y'] + 300 - so['y'])   # 두 줄을 감싸는 상자
    c = camera.keys(lt, [(0, camera.on(words, img, fill=1.25)), (1.1, camera.full(img), '부드럽게')])
    return camera.shoot(img, camera.drift(c, max(0, lt - 1.1), DURS[0]), (W, H))


# ── 장면 2 · 누구인가: 사진에서 이름으로 시선 옮기기 ──
def s2(lt, root, els):
    img = canvas.background(root)
    block, photo, badge, sub, small = els[0], els[1], T(els, '정책셰프'), T(els, '디지털'), T(els, '27년')
    l1, l2, name = T(els, '뜻과'), T(els, '때를'), T(els, '김현성')
    chips = [T(els, '『'), T(els, '중랑구')]
    appear.put(img, block, seg(lt, 0.0, 0.35), 'fade')
    vis, dy, sh = fx.drop(lt, 0.1, dur=0.45, height=700, amp=8)          # 사진 카드가 툭 떨어짐
    if vis > 0: motion.put(img, photo, alpha=vis, off=(sh[0], -dy + sh[1]))
    motion.spin_in(img, badge, seg(lt, 0.55, 0.95), deg=-120)
    appear.put(img, sub, seg(lt, 0.8, 1.1), 'up', dist=30)
    appear.put(img, small, seg(lt, 0.95, 1.25), 'fade')
    for i, e in enumerate((l1, l2, name)):
        appear.put(img, e, seg(lt, 1.2 + i * 0.18, 1.6 + i * 0.18), 'up', dist=70)
    for i, e in enumerate(chips):
        appear.put(img, e, seg(lt, 2.0 + i * 0.15, 2.4 + i * 0.15), 'left', dist=120)
    c = camera.keys(lt, [(0, camera.on(photo, img, fill=0.8)), (0.9, camera.on(photo, img, fill=0.8)),
                         (1.7, camera.full(img), '부드럽게')])
    return camera.shoot(img, camera.drift(c, max(0, lt - 1.7), DURS[1]), (W, H))


# ── 장면 3 · 땀 27년: 세로 연표를 위에서 아래로 훑기 ──
Y0, Y1 = 960, 3300 - 960


def s3(lt, root, els):
    img = canvas.background(root)
    ghost, lab, yrs, q1, q2, line = els[0], T(els, '땀 ·'), T(els, '27년'), T(els, '질문을'), T(els, '골목을'), els[5]
    appear.put(img, ghost, seg(lt, 0.0, 0.6), 'fade')
    appear.put(img, lab, seg(lt, 0.1, 0.4), 'fade')
    motion.blur_in(img, yrs, seg(lt, 0.1, 0.6))
    appear.put(img, q1, seg(lt, 0.5, 0.85), 'left', dist=80)
    appear.put(img, q2, seg(lt, 0.65, 1.0), 'left', dist=80)
    pan = eio(seg(lt, 1.3, 5.3)); cy = Y0 + (Y1 - Y0) * pan
    # 연표 선은 카메라를 따라 그려 내려간다
    reach = cy + 760
    if reach > line['y']:
        appear.put(img, line, cl((reach - line['y']) / line['h']), 'wipe', dir='up', ease=lambda x: x)
    stops = els[6:]                                                      # 점 · 연도 · 직함 · 설명 × 5
    for i in range(0, len(stops), 4):
        dot, yr, role, det = stops[i:i + 4]
        t0 = 1.3 + 4.0 * cl((dot['y'] - 1200 - Y0) / (Y1 - Y0 + 1e-6))   # 점이 화면 아래쪽에 들어올 즈음
        t0 = max(0.9, min(t0, 4.9))
        appear.put(img, dot, seg(lt, t0, t0 + 0.3), 'pop')
        appear.put(img, yr, seg(lt, t0 + 0.05, t0 + 0.35), 'left', dist=60)
        appear.put(img, role, seg(lt, t0 + 0.12, t0 + 0.5), 'left', dist=80)
        appear.put(img, det, seg(lt, t0 + 0.3, t0 + 0.7), 'fade')
    return camera.shoot(img, camera.at(540, cy, 1.0), (W, H))


# ── 장면 4 · 숫자: 숫자가 굴러 멈추고, 카메라가 줄마다 내려가며 다가감 ──
ROLL = {'30억 건': ('30', '억 건'), '150번': ('150', '번'), '5만 4천 명': None, '1,547명': ('1,547', '명')}


def rolled(text, k, seed):
    """숫자 부분만 굴린다 — k 0~1 (1 = 원문 그대로)"""
    if k >= 1: return text
    import random
    r = random.Random(int(k * 18) + seed * 101)
    return ''.join(str(r.randint(0, 9)) if ch.isdigit() else ch for ch in text)


def s4(lt, root, els):
    img = canvas.background(root)
    deco, head = els[0], T(els, '땀이')
    nums = [e for e in els if e['size'] == 150]
    labs = [e for e in els if e['size'] == 40]
    rules = [e for e in els if e['h'] == 3]
    appear.put(img, deco, 1, 'none'); appear.put(img, head, seg(lt, 0.0, 0.3), 'fade')
    T0 = [0.25, 1.15, 2.05, 2.95]
    for i, (n, l) in enumerate(zip(nums, labs)):
        t0 = T0[i]
        if lt >= t0:
            k = seg(lt, t0, t0 + 0.6)
            e = n if k >= 1 else still_text(n, rolled(n['text'], k, i))
            if i == 3 and k >= 1: motion.put(img, n, s=motion.pulse(lt, 4.0, 0.08, 0.4))   # 강조 하나: 1,547명
            else: appear.put(img, e, min(1, k * 4), 'fade')
        appear.put(img, l, seg(lt, t0 + 0.45, t0 + 0.8), 'up', dist=24)
        if i < len(rules): appear.put(img, rules[i], seg(lt, t0 + 0.6, t0 + 0.9), 'wipe')
    rows = [(80, n['y'] - 20, 940, 250) for n in nums]
    ks = [(0, camera.on(rows[0], img, fill=0.86, dy=-0.05))]
    for i in range(1, 4):
        ks += [(T0[i] - 0.25, ks[-1][1]), (T0[i] + 0.1, camera.on(rows[i], img, fill=0.86, dy=-0.05), '빠르게')]
    ks += [(3.75, ks[-1][1]), (4.4, camera.full(img), '부드럽게')]
    return camera.shoot(img, camera.keys(lt, ks), (W, H))


# ── 장면 5 · 먼저 듣는다: 사진 속 얼굴에서 글로 시선이 내려옴 ──
def s5(lt, root, els):
    img = canvas.background(root)
    photo, fadebar, chip = els[0], els[1], T(els, '청책')
    l1, l2, sub = T(els, '말하기'), T(els, '먼저'), T(els, '답은')
    motion.put(img, photo); motion.put(img, fadebar)
    appear.put(img, chip, seg(lt, 0.7, 1.0), 'wipe')
    appear.lines(img, l1, seg(lt, 0.9, 1.3), rise=60)
    appear.lines(img, l2, seg(lt, 1.15, 1.55), rise=60)
    if lt > 1.6: motion.highlight(img, l2, seg(lt, 1.7, 2.2), col=(237, 178, 80), alpha=0.35)
    if lt > 1.55: appear.put(img, l2, 1, 'none')                         # 형광펜 위로 글자
    motion.blur_in(img, sub, seg(lt, 2.0, 2.6))
    face = camera.at(760, 430, 1.35)
    c = camera.keys(lt, [(0, face), (0.6, face), (1.8, camera.full(img), '부드럽게')])
    return camera.shoot(img, camera.drift(c, max(0, lt - 1.8), DURS[4]), (W, H))


# ── 장면 6 · 뜻: 기운 화면이 바로 서며 책이 툭 ──
def s6(lt, root, els):
    img = canvas.background(root)
    lab, cover, spine, title, sub, au, badge = els[0], els[1], els[2], T(els, '소상공인을'), T(els, '600만'), T(els, '김현성'), T(els, '2쇄')
    q1, q2 = T(els, '진짜'), T(els, '소상공인이')
    appear.put(img, lab, seg(lt, 0.0, 0.3), 'fade')
    vis, dy, sh = fx.drop(lt, 0.15, dur=0.5, height=1100, amp=10)
    if vis > 0:
        for e in (cover, spine, title, sub, au): motion.put(img, e, alpha=vis, off=(sh[0], -dy + sh[1]))
    appear.put(img, badge, seg(lt, 0.85, 1.15), 'pop')
    appear.put(img, q1, seg(lt, 1.3, 1.65), 'right', dist=120)
    appear.put(img, q2, seg(lt, 1.5, 1.85), 'right', dist=120)
    if lt > 2.0: motion.underline(img, q2, seg(lt, 2.0, 2.5), col=(217, 151, 43), width=10, pad=4)
    tilt = camera.at(540, 800, 1.32, -7)
    c = camera.keys(lt, [(0, tilt), (0.5, tilt), (1.4, camera.full(img), '튕김')])
    return camera.shoot(img, camera.drift(c, max(0, lt - 1.3), DURS[5]), (W, H))


# ── 장면 7 · 때 (킥 ②): «버린» 위에 줄 → «부리는 AI로» 쾅 → 카드 셋 ──
def s7(lt, root, els):
    img = canvas.background(root)
    lab, old, strike, new = els[0], T(els, '버린'), els[2], T(els, '부리는')
    rest = els[4:]
    appear.put(img, lab, seg(lt, 0.0, 0.3), 'fade')
    fade = seg(lt, 0.75, 1.1)                                           # 처음엔 진하게 → 줄이 그어지면 흐려짐
    solid = still_text(old, old['text'], (16, 48, 46, int(255 - (255 - old['tcolor_a']) * fade)))
    motion.put(img, solid if fade < 1 else old)
    appear.put(img, strike, seg(lt, 0.45, 0.75), 'wipe')
    appear.put(img, new, seg(lt, 1.0, 1.35), 'zoom')                    # 세기 3 — 내려앉기
    for i in range(0, len(rest), 3):
        t0 = 1.8 + (i // 3) * 0.2
        for e in rest[i:i + 3]: appear.put(img, e, seg(lt, t0, t0 + 0.4), 'right', dist=200)
    c = camera.keys(lt, [(0, camera.on(old, img, fill=0.92)), (1.0, camera.on(old, img, fill=0.92)),
                         (1.25, camera.full(img), '빠르게')])
    c = camera.drift(c, max(0, lt - 1.25), DURS[6])
    if 1.3 <= lt < 1.55:                                                # 착지 흔들림
        a = 14 * (1 - seg(lt, 1.3, 1.55)); c = camera.Cam(c.cx + a * (1 if int(lt * 60) % 2 else -1), c.cy, c.z, c.rot)
    return camera.shoot(img, c, (W, H))


# ── 장면 8 · 마무리: 사진에서 내려오며 뜻 · 땀 · 때가 차례로 툭 ──
def s8(lt, root, els):
    img = canvas.background(root)
    photo, shade = els[0], els[1]
    g3 = [T(els, '뜻'), T(els, '땀'), T(els, '때')]
    name, btn = T(els, '정책셰프'), T(els, '강연')
    motion.put(img, photo); motion.put(img, shade)
    for i, e in enumerate(g3):
        vis, dy, sh = fx.drop(lt, 0.45 + i * 0.22, dur=0.4, height=500, amp=6)
        if vis > 0: motion.put(img, e, alpha=vis, off=(0, -dy))
    appear.put(img, name, seg(lt, 1.35, 1.75), 'up', dist=60)
    if lt >= 1.8:
        k = seg(lt, 1.8, 2.15)
        if k < 1: appear.put(img, btn, k, 'pop')
        else: motion.put(img, btn, s=motion.pulse(lt, 2.7, 0.07, 0.45))
    top = camera.at(540, 760, 1.2)
    c = camera.keys(lt, [(0, top), (0.3, top), (1.4, camera.full(img), '부드럽게')])
    return camera.shoot(img, camera.drift(c, max(0, lt - 1.4), DURS[7]), (W, H))


SCENE_FN = [s1, s2, s3, s4, s5, s6, s7, s8]
PLAN = [
    {'level': 3, 'camera': ['빠지며 공개', '천천히 흐르기'], 'enter': ['pop', 'wipe', 'lines'], 'emph': [], 'kick': '매치 컷',
     'borrow': '밑줄 긋기(wipe) · 사장님 말 줄마다(lines) — 인용을 읽히게'},
    {'level': 1, 'camera': ['시선 옮기기', '천천히 흐르기'], 'enter': ['drop', 'spin_in', 'up', 'left'], 'emph': [], 'kick': None},
    {'level': 2, 'camera': ['훑기'], 'enter': ['blur_in', 'pop', 'left', 'wipe'], 'emph': [], 'kick': None,
     'borrow': '흐림→또렷 · 연표 선 그려 내리기(wipe) — 27년을 천천히 펼치기'},
    {'level': 2, 'camera': ['끊어 다가가기', '시선 옮기기'], 'enter': ['slot_number', 'up'], 'emph': ['pulse'], 'kick': None,
     'borrow': '숫자 굴리기(정보 효과) — 땀이 남긴 숫자를 세는 장면'},
    {'level': 1, 'camera': ['시선 옮기기', '천천히 흐르기'], 'enter': ['wipe', 'lines', 'blur_in'], 'emph': ['highlight'], 'kick': None,
     'borrow': '형광펜 · 줄마다 · 흐림→또렷(차분 키트) — «먼저 듣는다»는 조용히'},
    {'level': 2, 'camera': ['기울기', '천천히 흐르기'], 'enter': ['drop', 'pop', 'right'], 'emph': ['underline'], 'kick': None,
     'borrow': '기울기 — 기운 화면이 바로 서는 순간이 책의 등장'},
    {'level': 3, 'camera': ['빠른 줌', '천천히 흐르기'], 'enter': ['wipe', 'zoom', 'right'], 'emph': [], 'kick': None,
     'borrow': '빠른 줌 · 줄 긋기(wipe) — 킥 ②: 버린 → 부리는'},
    {'level': 2, 'camera': ['시선 옮기기', '천천히 흐르기'], 'enter': ['drop', 'up', 'pop'], 'emph': ['pulse'], 'kick': None},
]
NAMES = ['훅', '이름', '땀', '숫자', '듣기', '책', '때', '마무리']
EDIT = K.cuts([p['level'] for p in PLAN[1:]], names=NAMES)


def render(k, t, xf=0.0):
    root, els = B[k]; lt = t - STARTS[k] + (xf / 2 if k > 0 else 0)
    return SCENE_FN[k](lt, root, els)


def frame(t):
    k = max(i for i, s in enumerate(STARTS) if s <= t + 1e-9)
    for j in (k, k + 1):
        if j in EDIT:
            name, xf, opt = EDIT[j]
            if abs(t - STARTS[j]) < xf / 2:
                a = render(j - 1, STARTS[j] - xf / 2, EDIT.get(j - 1, ('', 0))[1]); b_ = render(j, t, xf)
                return K.finish(K.edit(name, a, b_, (t - (STARTS[j] - xf / 2)) / xf, **opt), t)
    return K.finish(render(k, t, EDIT.get(k, ('', 0, {}))[1]), t)


def build_audio(path):
    """배경음 «경쾌 팝» + 효과음 묶음 «경쾌 팝» — 화면에서 일어나는 일에만 소리"""
    from core import sfx as SFX
    S = SFX.Kit(K.sounds); trk = audio.new_track(DUR)
    for j, (name, xf, _) in EDIT.items():
        if name == 'impact': S.put(trk, 'impact', STARTS[j], 0.7)
        elif name != 'cut': S.put(trk, 'cut', STARTS[j] - min(0.3, xf / 2), 0.42)
    t = STARTS
    S.put(trk, 'emph', t[0] + 1.25, 0.6)                 # «(상공인을)» 끼어듦
    S.put(trk, 'enter', t[1] + 0.45, 0.45)               # 사진 툭
    S.put(trk, 'emph', t[1] + 0.6, 0.45)                 # 정책셰프 배지
    for i in range(5): S.put(trk, 'tick', t[2] + 1.6 + i * 0.8, 0.35)   # 연표 점
    for t0 in ([0.25, 1.15, 2.05, 2.95]):
        S.put(trk, 'tick', t[3] + t0 + 0.6, 0.45)                      # 숫자 멈춤
    S.put(trk, 'emph', t[3] + 4.0, 0.55)                 # 1,547명
    S.put(trk, 'enter', t[5] + 0.5, 0.55)                # 책 툭
    S.put(trk, 'emph', t[5] + 0.9, 0.5)                  # 2쇄
    S.put(trk, 'cut', t[6] + 0.45, 0.45)                 # 줄 긋기
    S.put(trk, 'impact', t[6] + 1.3, 0.75)               # 부리는 AI로
    for i in range(3): S.put(trk, 'enter', t[7] + 0.75 + i * 0.22, 0.4)  # 뜻 땀 때
    S.put(trk, 'done', t[7] + 2.2, 0.6)
    try:
        bg = audio.bgm([(0, 1.2, 'sting', {}), (1.2, t[3], 'groove', {}), (t[3], t[6], 'build', {}),
                        (t[6], DUR - 2.0, 'main', {}), (DUR - 2.0, DUR, 'outro', {'hit': DUR - 1.8})], DUR, style=K.music)
    except SystemExit as e:
        print(e); bg = None
    return audio.mixdown(DUR, path, bg, trk, [])


if __name__ == '__main__':
    bake.cli(sys.modules[__name__], out=os.path.join(HERE, 'out', '정책셰프_김현성_소개.mp4'), audio=build_audio)
    if canvas.missing: print('⚠ 못 찾음:', ' · '.join(sorted(canvas.missing)))
