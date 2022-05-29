'use strict';
const yaml = require('js-yaml');

hexo.extend.filter.register('before_generate', () => {
    const data = hexo.locals.get('data');

    if (data.images && data.images.length > 6) {
        hexo.theme.config.image_list = data.images
    } else {
        hexo.theme.config.image_list = yaml.load(fs.readFileSync(path.join(__dirname, '../../_images.yml')))
    }
})