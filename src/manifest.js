/**
 * @see {@link https://developer.chrome.com/extensions/manifest}
 */
module.exports = {
    name: 'TronMask',
    description: 'Tron Browser Extension Wallet',
    author: 'TronMask',
    version: '1.1.0',
    icons: {
        '16': 'icons/16.png',
        '32': 'icons/32.png',
        '48': 'icons/48.png',
        '128': 'icons/128.png'
    },
    /**
     * @see {@link https://developer.chrome.com/extensions/declare_permissions}
     */
    permissions: [
        'storage',
        'tabs'
    ],
    browser_action: {
        default_title: 'TronMask',
        default_popup: 'popup.html'
    },
    background: {
        scripts: [
            'js/background.js'
        ],
        persistent: false
    },
    content_scripts: [{
        js: [
            'js/content.js'
        ],
        run_at: 'document_start',
        matches: ['<all_urls>'],
        all_frames: true
    }],
    web_accessible_resources: [
        'js/inpage.js'
    ],
    manifest_version: 2,
    content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'"
}
