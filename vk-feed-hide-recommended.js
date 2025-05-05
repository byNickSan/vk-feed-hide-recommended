// ==UserScript==
// @name         Скрыть рекомендации в ленте ВКонтакте
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Скрывает рекомендуемые посты в ленте ВКонтакте с кнопкой "Подписаться"
// @author       byNickSan
// @match        https://vk.com/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    function hideRecommendedPosts() {
        const currentUrl = window.location.href;
        if (currentUrl.includes('/feed?section=recommended')) {
            return; // Не скрывать посты на этой странице
        }

        if (window.location.pathname !== '/feed') return;

        const xpath = "//div[contains(@class, 'feed_row')]//button[.//span[contains(text(), 'Подписаться')]]";
        const buttons = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        for (let i = 0; i < buttons.snapshotLength; i++) {
            const button = buttons.snapshotItem(i);
            const feedRow = button.closest('.feed_row');
            if (feedRow) {
                feedRow.style.display = 'none';
            }
        }
    }

    const observer = new MutationObserver(() => {
        requestAnimationFrame(hideRecommendedPosts);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    const urlObserver = new MutationObserver(() => {
        if (window.location.pathname === '/feed' && !window.location.href.includes('/feed?section=recommended')) {
            requestAnimationFrame(hideRecommendedPosts);
        }
    });

    const baseElement = document.querySelector('base');
    if (baseElement) {
        urlObserver.observe(baseElement, { attributes: true });
    }

    let timeout;
    window.addEventListener('scroll', () => {
        if (window.location.pathname !== '/feed' || window.location.href.includes('/feed?section=recommended')) return;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            requestAnimationFrame(hideRecommendedPosts);
        }, 200);
    });

    window.addEventListener('load', () => {
        requestAnimationFrame(hideRecommendedPosts);
    });

    requestAnimationFrame(hideRecommendedPosts);
})();