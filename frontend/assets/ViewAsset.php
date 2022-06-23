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
        'js/view_publication.js',

        'js/utils/query_utils.js',
        'js/utils/canvas_utils.js',
        'js/utils/drawing_utils.js',
        'js/utils/string_utils.js',

        'js/edit/edit_drawings.js',
        'js/edit/edit_textures.js',

        'js/draw/drawing.js',


        'js/jszip/dist/jszip.js',
        'js/jszip-utils/dist/jszip-utils.js',
        'js/FileSaver.js-master/dist/FileSaver.js',
        ];

    public $depends = [
        'yii\web\YiiAsset',
        'yii\bootstrap4\BootstrapAsset',
        ];
}
