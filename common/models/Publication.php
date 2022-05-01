<?php

namespace common\models;

use Imagine\Image\Box;
use Yii;
use yii\db\ActiveRecord;
use yii\helpers\FileHelper;
use yii\imagine\Image;
use common\models\User;

/* @property int id
* @property string name
* @property string description //description of publication
* @property string image //link to an original image
* @property string settings //TEXT - json as string with drawings (and later maybe textures will be added)
 *
* @property string author_id //id of author from table "author"
*/

class Publication extends ActiveRecord
{
    //const HTTP_PATH_STORAGE = 'http://localhost/tracingshare/storage/';
    const PREFIX_PATH_IMAGES = 'images';//folder with original images
    const PREFIX_PATH_DRAWINGS = 'drawings';//folder with drawings
    const PREFIX_PATH_THUMBNAILS = 'thumbnails';//folder with thumbnails
    const THUMBNAIL_W = 800;//пропорционально уменьшать картинки
    const THUMBNAIL_H = 500;
    const THUMBNAIL_PREFIX = 'thumbnail_';
    const DRAWING_PREFIX = 'drawing_';

    const DEFAULT_ALPHA = "1";
    const DEFAULT_COLOR = "#000000";
    const DEFAULT_DESCRIPTION = " ";
    const PAGE_SIZE = 8;


    public $imageFile;
    public $drawingsFiles;

    public function rules()
    {
        return [
            [['name'], 'required', 'message' => 'Это поле не может быть пустым'],
            [['settings'], 'default', 'value'=> ''],
            ['name', 'string', 'max' => 100, 'message' => 'Максимальная длина: 32 символа'],
            ['description', 'string', 'max' => 32000, 'message' => 'Максимальная длина: 32000 символов'],
            [['imageFile'], 'file', 'skipOnEmpty' => true, 'extensions' => 'png, jpg, jpeg', 'message' => 'Ошибка при сохранении файла'],
            [['drawingsFiles'], 'file', 'skipOnEmpty' => true, 'extensions' => 'png, jpg, jpeg', 'message' => 'Ошибка при сохранении одного из файлов', 'maxFiles' => 10],
        ];
    }

    public function uploadOriginalImage()
    {
       //$pathToSave = self::FULL_PATH_STORAGE . self::PREFIX_PATH_IMAGES ;
       $imageDir = self::basePath() . '/' . self::PREFIX_PATH_IMAGES;
        // Создаем директорию, если не существует
        FileHelper::createDirectory($imageDir);
        if ($this->validate(["imageFile"])) {
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

    public function uploadDrawings()
    {
        if ($this->validate( "drawingsFiles")) {
            $drawingsDir = self::basePath() . '/' . self::PREFIX_PATH_DRAWINGS;

            // Создаем директорию, если не существует
            FileHelper::createDirectory($drawingsDir);

            foreach ($this->drawingsFiles as $file) {
                $baseName = explode('.', $this->image)[0];
                $drawingPrefix =  Publication::DRAWING_PREFIX . $baseName . "_";
                $filename = $drawingPrefix .$file->baseName . '.' . $file->extension;
                $drawingPath = $drawingsDir. '/' . $filename;
                if (file_exists($drawingPath)) {
                    unlink($drawingPath);
                }
                $file->saveAs($drawingPath);
            }
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

    public function getDrawings() {

        $settingsArray = $this->getSettingsArray();
        $drawings = [];
        if(isset($settingsArray['drawings'])) {
            $drawings  = $settingsArray['drawings'];
        }
        return $drawings;
    }
    public function getSettingsArray()
    {
        return json_decode($this->settings, true);
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

    public function getAuthorName() {
        if(($this->author_id) != null) {
            $user = User::findIdentity($this->author_id);

            return $user->last_name . " " . $user->first_name . " " . $user->patronymic
                . " (" . $user->email . ")";
        }
        else return "";
    }

    public function updateSettings()
    {
        $settingsArray = array();
        if (strcmp($this->settings ,'') != 0) {
            $settingsArray = $this->getSettingsArray();
        }
        if(!array_key_exists('drawings', $settingsArray)) {
            $settingsArray['drawings'] = array();
        }

        foreach ($this->drawingsFiles as $file) {
            $baseName = explode('.', $this->image)[0];
            $drawingPrefix =  Publication::DRAWING_PREFIX . $baseName . "_";
            $filename = $drawingPrefix .$file->baseName . '.' . $file->extension;
            $newLayerInfo = array("image" => $filename,
               "layerParams" => array(
                    "title" => $file->baseName,
                    "alpha" => self::DEFAULT_ALPHA,
                    "color" => self::DEFAULT_COLOR,
                    "description" => self::DEFAULT_DESCRIPTION,
                ));
            array_push($settingsArray['drawings'], $newLayerInfo);
        }
       return json_encode($settingsArray);
    }

    public function deleteFilesFromStorage() {

        $originalImagePath = self::basePath() . '/' . self::PREFIX_PATH_IMAGES . '/' . $this->image;
        if (file_exists($originalImagePath)) {
            unlink($originalImagePath);
        }

        $thumbnailPath = self::basePath(). '/' . self::PREFIX_PATH_THUMBNAILS . '/' . self::THUMBNAIL_PREFIX . $this->image;
        if (file_exists($thumbnailPath)) {
            unlink($thumbnailPath);
        }

        if(sizeof($this->getDrawings()) > 0) {
            foreach ($this->getDrawings() as $drawing) {
                $drawingPath = self::basePath(). '/' . self::PREFIX_PATH_DRAWINGS . '/' . $drawing['image'];
                if (file_exists($drawingPath)) {
                    unlink($drawingPath);
                }
            }
        }
    }

    public static function getStorageHttpPath() {
        //TODO: FIX THIS MAGIC CONSTANT (urlManager get absolute url
        $projectFolder = 'tracingshare';
        if(isset($_SERVER['HTTPS'])){
            $protocol = ($_SERVER['HTTPS'] && $_SERVER['HTTPS'] != "off") ? "https" : "http";
        }
        else {
            $protocol = 'http';
        }
        return $protocol . "://" . $_SERVER['HTTP_HOST'] . "/". $projectFolder ."/storage/";
    }
}
