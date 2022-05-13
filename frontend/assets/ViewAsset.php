<?php
/**
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 */
namespace frontend\assets;

use yii\web\AssetBundle;

/**
* Class View3dAsset
*
* @package app\assets
*/
class ViewAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';

    public $js = [
        'js/query_utils.js',
        'js/canvas_utils.js',
        'js/publication.loader.js',
        'js/editable_publication.loader.js',
        'js/edit_textures.js',
        'js/layer/create_layer_publication.loader.js',
        'js/layer/editor_utils.js',

        'js/jszip/dist/jszip.js',
        'js/jszip-utils/dist/jszip-utils.js',
        'js/FileSaver.js-master/dist/FileSaver.js',
        ];

    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap4\BootstrapAsset',
        ];
}
