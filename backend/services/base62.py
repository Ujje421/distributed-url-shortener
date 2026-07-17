BASE62_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
BASE = len(BASE62_ALPHABET)

def encode_id(num: int) -> str:
    """Encodes a given integer into a Base62 string."""
    if num == 0:
        return BASE62_ALPHABET[0]
    
    encoded = []
    while num > 0:
        num, rem = divmod(num, BASE)
        encoded.append(BASE62_ALPHABET[rem])
    
    return "".join(reversed(encoded))

def decode_id(short_code: str) -> int:
    """Decodes a Base62 string back into an integer."""
    num = 0
    for char in short_code:
        num = num * BASE + BASE62_ALPHABET.index(char)
    return num
