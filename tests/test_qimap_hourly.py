import importlib.util
import pathlib
import unittest

spec = importlib.util.spec_from_file_location("hourly", pathlib.Path(__file__).resolve().parents[1] / "scripts/qimap-hourly.py")
hourly = importlib.util.module_from_spec(spec)
spec.loader.exec_module(hourly)

class RegistryTests(unittest.TestCase):
    def test_empty_registry(self):
        self.assertEqual(hourly.validate({"feeds": []}), [])
    def test_reject_unauthorized(self):
        with self.assertRaises(ValueError):
            hourly.validate({"feeds": [{"id": "x", "enabled": True, "rights_status": "PUBLIC_REFERENCE", "url": "https://example.com/rss", "format": "rss"}]})
    def test_duplicate(self):
        with self.assertRaises(ValueError):
            hourly.validate({"feeds": [{"id": "x"}, {"id": "x"}]})
    def test_https_required(self):
        with self.assertRaises(ValueError):
            hourly.validate({"feeds": [{"id": "x", "enabled": True, "rights_status": "OFFICIAL", "permission_basis": "contract", "format": "rss", "url": "http://example.com"}]})

if __name__ == "__main__":
    unittest.main()
