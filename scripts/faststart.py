"""Lossless MP4 fast-start: move moov before mdat and shift stco/co64 chunk offsets."""
import struct, sys

def atoms(buf, start, end):
    pos = start
    while pos + 8 <= end:
        size, kind = struct.unpack(">I4s", buf[pos:pos + 8]); hdr = 8
        if size == 1: size = struct.unpack(">Q", buf[pos + 8:pos + 16])[0]; hdr = 16
        elif size == 0: size = end - pos
        yield kind, pos, size, hdr
        pos += size

CONTAINERS = {b"moov", b"trak", b"mdia", b"minf", b"stbl", b"edts"}

def patch(moov, start, end, shift):
    for kind, pos, size, hdr in atoms(moov, start, end):
        if kind in CONTAINERS: patch(moov, pos + hdr, pos + size, shift)
        elif kind in (b"stco", b"co64"):
            n = struct.unpack(">I", moov[pos + hdr + 4:pos + hdr + 8])[0]
            fmt, w = (">I", 4) if kind == b"stco" else (">Q", 8)
            base = pos + hdr + 8
            for i in range(n):
                o = base + i * w
                moov[o:o + w] = struct.pack(fmt, struct.unpack(fmt, moov[o:o + w])[0] + shift)

src, dst = sys.argv[1], sys.argv[2]
data = open(src, "rb").read()
top = list(atoms(data, 0, len(data)))
kinds = [k for k, *_ in top]
assert kinds.index(b"moov") > kinds.index(b"mdat"), "already fast-start"
_, mpos, msize, mhdr = next(a for a in top if a[0] == b"moov")
moov = bytearray(data[mpos:mpos + msize])
patch(moov, mhdr, len(moov), msize)
out = bytearray()
for kind, pos, size, hdr in top:
    if kind == b"moov": continue
    if kind == b"mdat": out += moov
    out += data[pos:pos + size]
open(dst, "wb").write(out)
print("ok", len(data), "->", len(out), [k.decode() for k, *_ in atoms(bytes(out), 0, len(out))])
