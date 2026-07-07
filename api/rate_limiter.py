import os
import hashlib
from datetime import datetime, timezone, timedelta
from supabase import create_client, Client

class RateLimiter:
    def __init__(self):
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_SERVICE_KEY")
        self.salt = os.environ.get("IP_HASH_SALT", "")

        if not url or not key:
            print("Warning: Supabase credentials not found. Rate limiting will be disabled.")
            self.supabase = None
        else:
            try:
                self.supabase = create_client(url, key)
            except Exception as e:
                print(f"Error initializing Supabase client: {e}")
                self.supabase = None

    def hash_ip(self, ip_address: str) -> str:
        """Hashes the IP address with a salt using SHA-256."""
        return hashlib.sha256((ip_address + self.salt).encode()).hexdigest()

    def get_reset_time(self):
        """Returns the next midnight UTC in ISO format."""
        tomorrow = datetime.now(timezone.utc).date() + timedelta(days=1)
        reset_at = datetime.combine(tomorrow, datetime.min.time(), tzinfo=timezone.utc)
        return reset_at.isoformat().replace("+00:00", "Z")

    def check_and_increment(self, ip_address: str, limit: int = 3):
        """
        Checks if the IP address has exceeded the daily limit.
        If not, increments the count and returns (True, remaining, None).
        If exceeded, returns (False, 0, reset_at).
        """
        if not self.supabase:
            # Fallback: allow request if Supabase is not configured
            return True, limit, None

        hashed_ip = self.hash_ip(ip_address)
        today = datetime.now(timezone.utc).date().isoformat()

        try:
            # Get current count
            response = self.supabase.table("usage_log") \
                .select("count") \
                .eq("identifier", hashed_ip) \
                .eq("usage_date", today) \
                .execute()

            current_count = 0
            if response.data:
                current_count = response.data[0]["count"]

            if current_count >= limit:
                return False, 0, self.get_reset_time()

            # Increment and Upsert
            # Note: user_tier column exists in schema (default 'free') for future Pro-tier gating
            new_count = current_count + 1
            self.supabase.table("usage_log").upsert({
                "identifier": hashed_ip,
                "usage_date": today,
                "count": new_count
            }, on_conflict="identifier,usage_date").execute()

            return True, limit - new_count, None

        except Exception as e:
            print(f"Rate limiter error: {e}")
            # In case of DB error, we allow the request to not block users
            return True, limit, None
