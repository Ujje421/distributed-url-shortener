import hashlib
from core.redis_client import redis_client

class BloomFilter:
    def __init__(self, name: str = "swiftzip:bloom", size: int = 1000000, hash_count: int = 5):
        """
        A custom Bloom Filter using Redis bit operations to prevent Cache Penetration.
        :param name: Redis key for the bit array
        :param size: Number of bits in the array
        :param hash_count: Number of hash functions to use
        """
        self.name = name
        self.size = size
        self.hash_count = hash_count

    def _get_indices(self, item: str) -> list[int]:
        """Generate indices for a given item using cryptographic hashes."""
        indices = []
        for i in range(self.hash_count):
            # We append an index suffix to the item to create different hash functions
            hash_str = f"{item}:{i}".encode('utf-8')
            hash_val = int(hashlib.md5(hash_str).hexdigest(), 16)
            indices.append(hash_val % self.size)
        return indices

    def add(self, item: str):
        """Add an item to the Bloom Filter."""
        indices = self._get_indices(item)
        pipeline = redis_client.pipeline()
        for idx in indices:
            pipeline.setbit(self.name, idx, 1)
        pipeline.execute()

    def might_contain(self, item: str) -> bool:
        """
        Check if the item might be in the set.
        Returns False if DEFINITELY not in the set.
        Returns True if MIGHT be in the set.
        """
        indices = self._get_indices(item)
        pipeline = redis_client.pipeline()
        for idx in indices:
            pipeline.getbit(self.name, idx)
        results = pipeline.execute()
        # If any bit is 0, the item is definitely not in the set
        return all(bit == 1 for bit in results)

bloom_filter = BloomFilter()
