'use strict';

const merge = require('hexo-util').deepMerge || require('lodash/merge');
const fs = require('hexo-fs');
const path = require('path');
const yaml = require('js-yaml');

hexo.extend.filter.register('before_generate', () => {
  if (hexo.config.theme_config) {
    hexo.theme.config = merge(hexo.theme.config, hexo.config.theme_config);
  }

  const data = hexo.locals.get('data');

  hexo.theme.config.style = {}

  for (const style of ['iconfont', 'colors', 'custom']) {
    var custom_file = 'source/_data/'+style+'.styl'
    if (fs.existsSync(custom_file)) {
      hexo.theme.config.style[style] = path.resolve(hexo.base_dir, custom_file)
    }
  }

  if (data.images && data.images.length > 6) {
    hexo.theme.config.image_list = data.images
  } else {
    hexo.theme.config.image_list = yaml.load(fs.readFileSync(path.join(__dirname, '../_images.yml')))
  }
})
