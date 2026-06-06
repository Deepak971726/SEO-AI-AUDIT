import unittest

from app.services.ai_service import _extract_json, _normalize_analysis, get_fallback_analysis


METRICS = {
    "performance_score": 42,
    "performance_grade": "Poor",
    "seo_score": 88,
    "accessibility_score": 91,
    "best_practices_score": 76,
    "lcp": "4.9 s",
    "fcp": "3.1 s",
    "cls": "0.223",
    "ttfb": "950 ms",
    "tbt": "640 ms",
    "speed_index": "5.2 s",
}


class JsonExtractionTests(unittest.TestCase):
    def test_extracts_json_from_wrapped_response(self):
        raw = 'Here is the result:\n{"performance_issues": ["Slow LCP"]}\nDone.'

        self.assertEqual(_extract_json(raw)["performance_issues"], ["Slow LCP"])

    def test_normalizes_roast_and_enforces_report_rating(self):
        data = {
            "performance_issues": ["Slow LCP"],
            "savage_roast": {
                "title": "Latency Has Entered the Chat",
                "message": (
                    "Performance at 42/100 and LCP at 4.9 s are moving like a "
                    "Friday deploy with no rollback plan. Rating: 10/10."
                ),
                "emoji": "🔥",
                "severity": "low",
            },
        }

        result = _normalize_analysis(data, METRICS)
        roast = result["savage_roast"]

        self.assertEqual(roast["severity"], "high")
        self.assertTrue(roast["message"].endswith("Rating: 7.4/10."))
        self.assertLessEqual(len(roast["message"].split()), 50)
        self.assertEqual(len(roast["message"].splitlines()), 2)

    def test_replaces_personal_attack_with_metric_based_fallback(self):
        data = {
            "savage_roast": {
                "title": "Bad Developer",
                "message": "Your developer failed performance basics.",
                "emoji": "🔥",
                "severity": "high",
            }
        }

        roast = _normalize_analysis(data, METRICS)["savage_roast"]

        self.assertNotIn("developer", roast["message"].lower())
        self.assertIn("Performance", roast["message"])
        self.assertRegex(roast["message"], r"(LCP|FCP|CLS|TTFB|TBT|Speed Index)")

    def test_replaces_roast_that_ignores_the_actual_issue(self):
        healthy_vitals = {
            **METRICS,
            "performance_score": 100,
            "seo_score": 80,
            "accessibility_score": 96,
            "best_practices_score": 96,
            "lcp": "0.8 s",
            "fcp": "0.8 s",
            "cls": "0.000",
            "ttfb": "2 ms",
            "tbt": "0 ms",
            "speed_index": "0.8 s",
        }
        data = {
            "savage_roast": {
                "title": "Wrong Target",
                "message": "Performance at 100/100 is somehow the whole incident report.",
                "emoji": "🔥",
                "severity": "low",
            }
        }

        roast = _normalize_analysis(data, healthy_vitals)["savage_roast"]

        self.assertIn("SEO", roast["message"])
        self.assertNotEqual(roast["title"], "Wrong Target")

    def test_fallback_analysis_matches_api_contract(self):
        result = get_fallback_analysis(METRICS)

        self.assertEqual(
            set(result),
            {
                "performance_issues",
                "seo_impact",
                "optimization_suggestions",
                "react_optimization_tips",
                "caching_recommendations",
                "image_optimization",
                "savage_roast",
            },
        )
        self.assertTrue(all(len(result[key]) == 3 for key in result if key != "savage_roast"))


if __name__ == "__main__":
    unittest.main()
