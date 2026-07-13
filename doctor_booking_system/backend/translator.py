from deep_translator import GoogleTranslator
import logging

logger = logging.getLogger("translator")

def translate_to_english(text: str, source_lang: str) -> str:
    """
    Translates input text to English.
    If source_lang is 'en', returns text as is.
    If translation fails, returns original text.
    """
    if not text or not text.strip():
        return text

    source_lang = source_lang.lower().strip()
    if source_lang == 'en':
        return text

    # Map frontend lang codes to deep-translator codes if different
    # 'ta' is Tamil, 'si' is Sinhala
    try:
        translated = GoogleTranslator(source=source_lang, target='en').translate(text)
        return translated if translated else text
    except Exception as e:
        logger.error(f"Translation to English failed for source '{source_lang}': {e}")
        return text

def translate_from_english(text: str, target_lang: str) -> str:
    """
    Translates English text to the target language (e.g. 'ta', 'si').
    If target_lang is 'en', returns text as is.
    If translation fails, returns original text.
    """
    if not text or not text.strip():
        return text

    target_lang = target_lang.lower().strip()
    if target_lang == 'en':
        return text

    try:
        translated = GoogleTranslator(source='en', target=target_lang).translate(text)
        return translated if translated else text
    except Exception as e:
        logger.error(f"Translation from English failed to target '{target_lang}': {e}")
        return text
