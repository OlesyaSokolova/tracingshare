<?php

namespace common\models;

use Imagine\Image\Box;
use Yii;
use yii\db\ActiveRecord;
use yii\helpers\FileHelper;
use yii\imagine\Image;

/* @property int id
* @property string name
* @property string description //description of petroglyph
* @property string image //link to an original image
* @property string thumbnail //link to an thumbnail image
* @property string settings //TEXT - json as string with drawings (and later maybe textures will be added)
 * {
"drawings": [
   {
    image: "dr1_1.png",
    layerParams: {
                   alpha: "0.5",
                   test: "hello1!!"
                }
    },
    {
    image: "dr1_2.png",
    layerParams: {
                   alpha: "0.6",
                   test: "hello2!!"
                }
    },
    {
    image: "dr1_1.png",
    layerParams: {
                   alpha: "0.8656377",
                   test: "hello3!!"
                }
    }]
}
 *
* @property string author_id //id of author from table "author"
*/

class Petroglyph extends ActiveRecord
{
    //TODO: изменить PATH_STORAGE
    const HTTP_PATH_STORAGE = 'http://localhost/tracingshare/storage/';
    const FULL_PATH_STORAGE = '/var/www/html/tracingshare/storage/';
    //const DIR_IMAGE = 'storage';
    const PREFIX_PATH_IMAGES = 'images';//folder with original images
    const PREFIX_PATH_DRAWINGS = 'drawings';//folder with drawings
    const PREFIX_PATH_THUMBNAILS = 'thumbnails';//folder with thumbnails
    const THUMBNAIL_W = 800;//пропорционально уменьшать картинки
    const THUMBNAIL_H = 500;
    const THUMBNAIL_PREFIX = 'thumbnail_';

    //public $fileImage; //File
    //public $fileTexture;
    //public $filesDrawings = array(); //Array// files-drawings from folder "PATH_STORAGE+PATH_DRAWING

    public static function tableName()
    {
        //return '{{petroglyph}}
        return 'exhibits';
    }

    public function generateThumbnail() {
        //$path = self::basePath();
        $thumbnailPath =  self::FULL_PATH_STORAGE . self::PREFIX_PATH_THUMBNAILS. '/' . self::THUMBNAIL_PREFIX . $this->image;
        $originalImagePath = self::FULL_PATH_STORAGE . self::PREFIX_PATH_IMAGES . '/' . $this->image;
        if (!file_exists($thumbnailPath)) {
            //$newName = md5(uniqid($this->id));
            $sizes = getimagesize($originalImagePath);
            if ($sizes[0] > self::THUMBNAIL_W) {
                Image::thumbnail($originalImagePath, self::THUMBNAIL_W, self::THUMBNAIL_H)
                    ->resize(new Box(self::THUMBNAIL_W, self::THUMBNAIL_H))
                    ->save($thumbnailPath, ['quality' => 80]);
                $this->thumbnail = self::THUMBNAIL_PREFIX . $this->image;
                $this->save();
            }

        }
    }

    public function getSettingsArray()
    {
        return json_decode($this->settings);
    }

    public static function basePath()
    {
       /* $path = \Yii::getAlias('@' . self::DIR_IMAGE);

        // Создаем директорию, если не существует
        FileHelper::createDirectory($path);

        return $path;*/
    }
}
