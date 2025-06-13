const path = require('node:path');
const fs = require('node:fs');
const { promisify } = require('node:util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const Scandir = async (dir) => {
    let subdirs = await readdir(path.resolve(dir));
    let files = await Promise.all(
        subdirs.map(async (subdir) => {
            let res = path.resolve(dir, subdir);
            return (await stat(res)).isDirectory() ? Scandir(res) : res;
        }),
    );
    return files.flat();
};

class Scraper {
    #src;
    constructor(dir) {
        this.dir = dir;
        this.#src = {};
    }

    load = async () => {
        const data = await Scandir(this.dir);
        for (const file of data) {
            if (!file.endsWith('.js')) continue;
            try {
                const module = require(file);
                const name = path.basename(file).replace('.js', '');
                
                if (typeof module === 'function') {
                    this.#src[name] = module;
                } else if (typeof module === 'object') {
                    for (const [key, value] of Object.entries(module)) {
                        if (typeof value === 'function') {
                            this.#src[key] = value;
                        }
                    }
                }
            } catch (e) {
                console.log(`Failed to load ${file}: ${e}`);
            }
        }
        return this.#src;
    }

    list = () => this.#src;
}

module.exports = Scraper;