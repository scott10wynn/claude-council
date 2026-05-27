"""
Browser automation for auto-filling job application forms using Playwright.
Opens a visible browser so the user can review and submit manually.
"""

import asyncio
from playwright.async_api import async_playwright


async def _fill_form(url: str, profile: dict, cover_letter: str) -> dict:
    """Open browser with job URL and pre-fill common form fields."""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, slow_mo=200)
        context = await browser.new_context()
        page = await context.new_page()

        await page.goto(url, wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(2000)

        filled_fields = []

        # Common field selectors → value mappings
        field_map = [
            (["input[name*='first'][type='text']", "input[id*='first'][type='text']",
              "input[placeholder*='First']"], profile.get("name", "").split()[0] if profile.get("name") else ""),
            (["input[name*='last'][type='text']", "input[id*='last'][type='text']",
              "input[placeholder*='Last']"], profile.get("name", "").split()[-1] if profile.get("name") else ""),
            (["input[name*='name'][type='text']", "input[id*='name'][type='text']",
              "input[placeholder*='Name']", "input[placeholder*='Full']"], profile.get("name", "")),
            (["input[type='email']", "input[name*='email']", "input[id*='email']"],
             profile.get("email", "")),
            (["input[type='tel']", "input[name*='phone']", "input[id*='phone']",
              "input[placeholder*='Phone']"], profile.get("phone", "")),
            (["textarea[name*='cover']", "textarea[id*='cover']", "textarea[placeholder*='cover']",
              "textarea[name*='letter']", "textarea[id*='letter']"], cover_letter),
        ]

        for selectors, value in field_map:
            if not value:
                continue
            for selector in selectors:
                try:
                    elements = await page.query_selector_all(selector)
                    for el in elements:
                        if await el.is_visible():
                            await el.click()
                            await el.fill(value)
                            filled_fields.append(selector)
                            break
                except Exception:
                    pass

        # Keep browser open so user can review and submit manually
        await page.wait_for_timeout(60000 * 10)  # Keep open 10 minutes
        await browser.close()

        return {"filled_fields": filled_fields}


def open_and_fill_form(url: str, profile: dict, cover_letter: str) -> dict:
    try:
        result = asyncio.run(_fill_form(url, profile, cover_letter))
        return {"success": True, **result}
    except Exception as e:
        return {"success": False, "message": str(e)}
