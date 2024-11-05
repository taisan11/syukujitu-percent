import { defineConfig } from 'vite';
import unocss from "unocss/vite"
import {ViteMinifyPlugin} from "vite-plugin-minify"
import { getLastCommit } from "git-last-commit"

import type { Commit } from "git-last-commit"
import type { Plugin as VitePlugin } from "vite"

export default defineConfig(async () => {
    const commit: Commit = await new Promise((resolve, reject) => {
        getLastCommit((err, commit) => {
            if (err) {
                return reject(err);
            }
            resolve(commit);
        });
    });

    return {
        plugins: [unocss(), ViteMinifyPlugin(),{
            name: "commit-info",
            generateBundle() {
                console.log(`Last commit: ${commit.shortHash}`);
            },
            transform(code,id) {
                if (id.endsWith('.js')||id.endsWith('.ts')||id.endsWith('.html')) {
                    // 置き換え処理
                    const replacedCode = code.replace(/{{latestcommitid}}/g, commit.shortHash).replace(/{{latestcommitdate}}/g, commit.committedOn);
                    return replacedCode;
                }
            }
        }],
    };
});