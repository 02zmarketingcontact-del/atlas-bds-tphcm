import importlib.util
import pathlib
import unittest

spec = importlib.util.spec_from_file_location("audit_sources", pathlib.Path(__file__).resolve().parents[1] / "scripts/audit-source-candidates.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class TestAudit(unittest.TestCase):
    def test_empty(self):
        self.assertEqual(module.audit({"sources": []})["candidate_sources"], 0)
    def test_valid(self):
        self.assertEqual(module.audit({"sources": [{"id": "a", "url": "https://example.com"}]})["unique_domains"], 1)
    def test_duplicate(self):
        with self.assertRaises(ValueError):
            module.audit({"sources": [{"id": "a", "url": "https://example.com"}, {"id": "a", "url": "https://example.org"}]})
    def test_insecure(self):
        with self.assertRaises(ValueError):
            module.audit({"sources": [{"id": "a", "url": "http://example.com"}]})
