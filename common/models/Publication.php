<?php

namespace common\models;

use Imagine\Image\Box;
use Yii;
use yii\db\ActiveRecord;
use yii\helpers\FileHelper;
use yii\imagine\Image;

/* @property int id
* @property string name
* @property string description //description of publication
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

class Publication extends ActiveRecord
{
    //TODO: изменить PATH_STORAGE
    const HTTP_PATH_STORAGE = 'http://localhost/tracingshare/storage/';
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
            [['name'], 'required', 'message' => 'Это поле не может быть пустым'],
            ['name', 'string', 'max' => 100, 'message' => 'Максимальная длина: 32 символа'],
            ['description', 'string', 'max' => 32000, 'message' => 'Максимальная длина: 32000 символов'],
            [['imageFile'], 'file', 'skipOnEmpty' => false, 'extensions' => 'png, jpg, jpeg', 'message' => 'Ошибка при сохранении файла'],
        ];
    }

    public function upload()
    {
       //$pathToSave = self::FULL_PATH_STORAGE . self::PREFIX_PATH_IMAGES ;
       $imageDir = self::basePath() . '/' . self::PREFIX_PATH_IMAGES;
        // Создаем директорию, если не существует
        FileHelper::createDirectory($imageDir);
        if ($this->validate()) {
            $filePath = $imageDir . '/'. $this->imageFile->baseName . '.' . $this->imageFile->extension;
            if (file_exists($filePath)) {
                unlink($filePath);

                $thumbnailDir = self::basePath(). '/' . self::PREFIX_PATH_THUMBNAILS;
                $thumbnailPath =   $thumbnailDir. '/' . self::THUMBNAIL_PREFIX . $this->image;
                if (file_exists($thumbnailPath)) {
                    unlink($thumbnailPath);
                }
            }
            $this->imageFile->saveAs($filePath);
            $this->generateThumbnail();
            return true;
        } else {
            return false;
        }
    }

    public static function tableName()
    {
        return '{{%publication}}';
        //return 'exhibits';
    }

    public function generateThumbnail() {
        $thumbnailDir = self::basePath(). '/' . self::PREFIX_PATH_THUMBNAILS;
        $originalImagePath = self::basePath() . '/' . self::PREFIX_PATH_IMAGES . '/' . $this->image;

        // Создаем директорию, если не существует
        FileHelper::createDirectory($thumbnailDir);

        $thumbnailPath =   $thumbnailDir. '/' . self::THUMBNAIL_PREFIX . $this->image;

        if (!file_exists($thumbnailPath)) {
            //$newName = md5(uniqid($this->id));
            $sizes = getimagesize($originalImagePath);
            $originalWidth = $sizes[0];
            $originalHeight = $sizes[1];
            $ratio = $originalWidth/$originalHeight;
            $correspondingHeight = self::THUMBNAIL_W/$ratio;
            $newWidth = self::THUMBNAIL_W;
            $newHeight = $correspondingHeight;

           // if ($sizes[0] > self::THUMBNAIL_W) {
                Image::thumbnail($originalImagePath, $newWidth, $newHeight)
                    ->resize(new Box($newWidth, $newHeight))
                    ->save($thumbnailPath, ['quality' => 80]);
          // }
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
        $path = \Yii::getAlias('@storage');

        // Создаем директорию, если не существует
        FileHelper::createDirectory($path);

        return $path;
    }
}
