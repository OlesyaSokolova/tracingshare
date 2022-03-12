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

    public $imageFile;

    public function rules()
    {
        return [
            [['name', 'description'], 'required', 'message' => 'Это поле не может быть пустым'],
            [['imageFile'], 'required', 'message' => 'Файл должен быть выбран.'],
            ['name', 'string', 'max' => 100, 'message' => 'Максимальная длина: 32 символа'],
            ['description', 'string', 'max' => 32000, 'message' => 'Максимальная длина: 32000 символов'],
            [['imageFile'], 'file', 'skipOnEmpty' => false, 'extensions' => 'png, jpg, jpeg', 'message' => 'Ошибка при сохранении файла'],
        ];
    }

    public function upload()
    {
       $pathToSave = self::FULL_PATH_STORAGE . self::PREFIX_PATH_IMAGES ;

        if ($this->validate()) {
            $this->imageFile->saveAs($pathToSave . '/'. $this->imageFile->baseName . '.' . $this->imageFile->extension);
            return true;
        } else {
            return false;
        }
//        /*if ($this->validate()) {
//
//            //$path = self::basePath();
//           $pathToSave = self::FULL_PATH_STORAGE . self::PREFIX_PATH_IMAGES ;
//           $thumbnailPath =  self::FULL_PATH_STORAGE . self::PREFIX_PATH_THUMBNAILS. '/' . self::THUMBNAIL_PREFIX;
//
//
//            /*if (!empty($this->image) and file_exists($pathToSave . '/' . $this->image)) {
//                unlink($pathToSave . '/' . $this->image);
//
//                if (file_exists($thumbnailPath . $this->image)) {
//                    unlink($thumbnailPath . $this->image);
//                }
//            }*/
//
//            //TODO: CREATE DIRECTORY IF IT DOESN'T EXIST
//            //FileHelper::createDirectory($path);
//
//            //$newName = md5(uniqid($this->id));
//            $this->imageFile->saveAs($pathToSave . '/' . $this->imageFile->baseName . '.' . $this->imageFile->extension);
//            $this->image = $this->imageFile->baseName . '.' . $this->imageFile->extension;
//
//           /* $sizes = getimagesize($path . '/' . $newName . '.' . $this->fileImage->extension);
//            if ($sizes[0] > self::THUMBNAIL_W) {
//                Image::thumbnail($path . '/' . $newName . '.' . $this->fileImage->extension, self::THUMBNAIL_W, self::THUMBNAIL_H)
//                    ->resize(new Box(self::THUMBNAIL_W, self::THUMBNAIL_H))
//                    ->save($path . '/' . self::THUMBNAIL_PREFIX . $newName . '.' . $this->fileImage->extension, ['quality' => 80]);
//            }*/
//
//            return $this->save();
//        } else {
//            return false;
//        }*/
    }

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

    /**
     * Устанавливает путь до директории
     *
     * @return string
     * @throws \yii\base\Exception
     */
    public static function basePath()
    {
        $dirimage = 'storage/images';
        $path = \Yii::getAlias('@' . $dirimage);

        // Создаем директорию, если не существует
        FileHelper::createDirectory($path);

        return $path;
    }
}
