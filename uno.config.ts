import {
    defineConfig,
    presetIcons,
    presetUno,
    transformerDirectives,
    presetWebFonts,
    presetTypography,
    transformerCompileClass
} from 'unocss'

export default defineConfig({
    shortcuts: [
        { 'i-logo': 'i-logos-astro w-6em h-6em transform transition-800' },
    ],
    transformers: [
        transformerDirectives(),
        transformerCompileClass()
    ],
    presets: [
        presetUno(),
        presetTypography(),
        presetIcons({
            extraProperties: {
                'display': 'inline-block',
                'vertical-align': 'middle',
                // "cdn":"https://esm.sh/"
                // "autoinstall": "true",
            },
        }),
        presetWebFonts()
    ],
})