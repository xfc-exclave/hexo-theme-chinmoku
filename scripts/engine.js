
const randomBG = function (count = 1, image_server = null, image_list = []) {
    if (image_server) {
        if (count && count > 1) {
            var arr = new Array(count);
            for (var i = 0; i < arr.length; i++) {
                arr[i] = image_server + '?' + Math.floor(Math.random() * 999999)
            }

            return arr;
        }

        return image_server + '?' + Math.floor(Math.random() * 999999)
    }

    var parseImage = function (img, size) {
        if (img.startsWith('//') || img.startsWith('http')) {
            return img
        } else {
            return 'https://tva' + randomServer + '.sinaimg.cn/' + size + '/' + img
        }
    }

    if (count && count > 1) {
        var shuffled = image_list.slice(0), i = image_list.length, min = i - count, temp, index;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }

        return shuffled.slice(min).map(function (img) {
            return parseImage(img, 'large')
        });
    }

    return parseImage(image_list[Math.floor(Math.random() * image_list.length)], 'mw690')
}

hexo.extend.helper.register('_cover', function (item, num) {
    const { image_server, image_list } = hexo.theme.config;

    if (item.cover) {
        return this._image_url(item.cover, item.path)
    } else if (item.photos && item.photos.length > 0) {
        return this._image_url(item.photos[0], item.path)
    } else {
        const rbg = randomBG(num || 1, image_server, image_list);
        item.cover = rbg;
        return rbg;
    }
})

hexo.extend.helper.register('_random_cover', function () {
    const { statics, js, image_server, image_list } = hexo.theme.config;
    return randomBG(1, image_server, image_list);
})

hexo.extend.helper.register('_image_url', function(img, path = '') {
  const { statics } = hexo.theme.config;
  const { post_asset_folder } = hexo.config;

  if (img.startsWith('//') || img.startsWith('http')) {
    return img
  } else {
    return url_for.call(this, statics + (post_asset_folder ? path : '') + img)
  }
})

// 文章定制语法解析器
hexo.extend.helper.register('_customizer', function (content) {
    content = content.replace(/<p>:::info<\/p>/g, '<span class="test-ino">x</span>')
    // content.replace(/@start/g, '<div>')
    content = content.replace(/<p>:::<\/p>/g, '<span>y</sapn>')
    // content.replace(/@end/g, '</div>')
    return content
})

hexo.extend.filter.register('after_post_render', function (data) {

    // 解析自定义块标签
    let block_prefix = 'chinmoku-block-'
    let block_class_arr = ['info', 'warn', 'primary', 'success', 'danger', 'prod']
    let content = data.content
    block_class_arr.forEach(word => {
        let ori_str = '<p>@start.' + word + '</p>'
        let aim_str = '<div class="' + block_prefix + word + '">'
        content = content.replaceAll(ori_str, aim_str)
        content = content.replaceAll('<p>@end</p>', '</div>')
    })

    // 解析自定义行标签
    let inline_prefix = 'chinmoku-inline-'
    var regExp = RegExp(/\[([^\f\n\r\t\v\[\]]+)\]\{\.(\w+)\}/g);
    content = content.replace(regExp, '<span class="' + inline_prefix + '$2">$1</span>', "g")

    data.content = content
    return data
}, 9);