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
* @property string drawings //TEXT - json as string with drawings
* @property string textures //TEXT - json as string with textures
 *
* @property string author_id //id of author from table "author"
*/

class Publication extends ActiveRecord
{
    //const HTTP_PATH_STORAGE = 'http://localhost/tracingshare/storage/';
    const PREFIX_PATH_IMAGES = 'images';//folder with original images
    const PREFIX_PATH_DRAWINGS = 'drawings';//folder with drawings
    const PREFIX_PATH_TEXTURES = 'textures';//folder with textures
    const PREFIX_PATH_THUMBNAILS = 'thumbnails';//folder with thumbnails
    const THUMBNAIL_W = 800;//пропорционально уменьшать картинки
    const THUMBNAIL_H = 500;
    const THUMBNAIL_PREFIX = 'thumbnail_';
    const DRAWING_PREFIX = 'drawing_';
    const TEXTURE_PREFIX = 'texture_';

    const DEFAULT_ALPHA = "1";
    const DEFAULT_COLOR = "#000000";
    const DEFAULT_DESCRIPTION = " ";
    const PAGE_SIZE = 12;

    public $imageFile;
    public $drawingsFiles;
    public $texturesFiles;

    public $newDrawingsFilenames;
    public $newTexturesFilenames;

    public function rules()
    {
        return [
            [['name'], 'required', 'message' => 'Это поле не может быть пустым'],
            [['drawings'], 'default', 'value'=> ''],
            ['name', 'string', 'max' => 100, 'message' => 'Максимальная длина: 32 символа'],
            ['description', 'string'],
            [['imageFile'], 'file', 'skipOnEmpty' => true, 'extensions' => 'png, jpg, jpeg', 'message' => 'Ошибка при сохранении файла'],
            [['drawingsFiles'], 'file', 'skipOnEmpty' => true, 'extensions' => 'png', 'message' => 'Ошибка при сохранении одного из файлов', 'maxFiles' => 10],
            [['texturesFiles'], 'file', 'skipOnEmpty' => true, 'extensions' => 'png, jpg, jpeg', 'message' => 'Ошибка при сохранении одного из файлов', 'maxFiles' => 10],
        ];
    }

    public function uploadOriginalImage()
    {
       $imageDir = self::basePath() . '/' . self::PREFIX_PATH_IMAGES;
        // Создаем директорию, если не существует
        FileHelper::createDirectory($imageDir);
        if ($this->validate(["imageFile"])) {
            $filePath = $imageDir . '/'. $this->image;
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

            $this->newDrawingsFilenames = array();
            $drawingsNumber = sizeof($this->getDrawings());
            foreach ($this->drawingsFiles as $file) {
                $baseName = explode('.', $this->image)[0];
                $index = $drawingsNumber;
                $drawingPrefix =  Publication::DRAWING_PREFIX . $baseName . "_";
                $filename = $drawingPrefix . $index . '.' . $file->extension;
                $this->newDrawingsFilenames[$file->baseName] = $filename;
                $drawingPath = $drawingsDir. '/' . $filename;
                if (file_exists($drawingPath)) {
                    unlink($drawingPath);
                }
                $file->saveAs($drawingPath);
                $drawingsNumber++;
            }
            return true;
        } else {
            return false;
        }
    }

    public function uploadTextures()
    {
        if ($this->validate( "texturesFiles")) {
            $texturesDir = self::basePath() . '/' . self::PREFIX_PATH_TEXTURES;

            // Создаем директорию, если не существует
            FileHelper::createDirectory($texturesDir);

            $this->newTexturesFilenames = array();
            $texturesNumber = sizeof($this->getTextures());
            foreach ($this->texturesFiles as $file) {
                $baseName = explode('.', $this->image)[0];
                $index = $texturesNumber;
                $texturePrefix =  Publication::TEXTURE_PREFIX . $baseName . "_";
                $filename = $texturePrefix . $index . '.' . $file->extension;
                $this->newTexturesFilenames[$file->baseName] = $filename;
                $texturePath = $texturesDir. '/' . $filename;
                if (file_exists($texturePath)) {
                    unlink($texturePath);
                }
                $file->saveAs($texturePath);
                $texturesNumber++;
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

    public function getOriginalImageSize() {
        $originalImagePath = self::basePath() . '/' . self::PREFIX_PATH_IMAGES . '/' . $this->image;
        return getimagesize($originalImagePath);
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

        $drawingsArray = $this->getDrawingsArray();
        $drawings = [];
        if(isset($drawingsArray['drawings'])) {
            $drawings  = $drawingsArray['drawings'];
        }
        return $drawings;
    }

    public function getDrawingsArray()
    {
        return json_decode($this->drawings, true);
    }

    public function getTextures() {

        $texturesArray = $this->getTexturesArray();
        $textures = [];
        if(isset($texturesArray['textures'])) {
            $textures  = $texturesArray['textures'];
        }
        return $textures;
    }

    public function getTexturesArray()
    {
        return json_decode($this->textures, true);
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

    public function getAuthorEmail() {
        if(($this->author_id) != null) {
            $user = User::findIdentity($this->author_id);
            return $user->email;
        }
        else return "";
    }

    public function updateDrawings()
    {
        $drawingsArray = array();
        if (strcmp($this->drawings ,'') != 0) {
            $drawingsArray = $this->getDrawingsArray();
        }
        if(!array_key_exists('drawings', $drawingsArray)) {
            $drawingsArray['drawings'] = array();
        }

        foreach ($this->newDrawingsFilenames as $baseFilename => $generatedFilename) {
            //$drawingPrefix =  Publication::DRAWING_PREFIX . $baseName . "_";
            //$filename = $drawingPrefix .$file->baseName . '.' . $file->extension;
            $newLayerInfo = array("image" => $generatedFilename,
               "layerParams" => array(
                    "title" => $baseFilename,
                    "alpha" => self::DEFAULT_ALPHA,
                    "color" => self::DEFAULT_COLOR,
                    "description" => self::DEFAULT_DESCRIPTION,
                ));
            array_push($drawingsArray['drawings'], $newLayerInfo);
        }
       return json_encode($drawingsArray);
    }

    public function updateTextures()
    {
        $texturesArray = array();
        if (strcmp($this->textures ,'') != 0) {
            $texturesArray = $this->getTexturesArray();
        }
        if(!array_key_exists('textures', $texturesArray)) {
            $texturesArray['textures'] = array();
        }

        foreach ($this->newTexturesFilenames as $baseFilename => $generatedFilename) {
            //$textureTitle = explode('.', $this->image)[0];
            $newLayerInfo = array("image" => $generatedFilename,
                "layerParams" => array(
                    "title" => $baseFilename,
                    "description" => self::DEFAULT_DESCRIPTION,
                ));
            array_push($texturesArray['textures'], $newLayerInfo);
        }
        return json_encode($texturesArray);
    }

    public function deleteThumbnail() {
        $thumbnailPath = self::basePath(). '/' . self::PREFIX_PATH_THUMBNAILS . '/' . self::THUMBNAIL_PREFIX . $this->image;
        if (file_exists($thumbnailPath)) {
            unlink($thumbnailPath);
        }
    }

    public function deleteOriginalImage() {
        $originalImagePath = self::basePath() . '/' . self::PREFIX_PATH_IMAGES . '/' . $this->image;
        if (file_exists($originalImagePath)) {
            unlink($originalImagePath);
        }
    }

    public function deleteDrawings() {
        foreach ($this->getDrawings() as $drawing) {
            $drawingPath = self::basePath(). '/' . self::PREFIX_PATH_DRAWINGS . '/' . $drawing['image'];
            if (file_exists($drawingPath)) {
                unlink($drawingPath);
            }
        }
    }

    public function deleteTextures() {
        foreach ($this->getTextures() as $texture) {
            $texturesPath = self::basePath(). '/' . self::PREFIX_PATH_TEXTURES . '/' . $texture['image'];
            if (file_exists($texturesPath)) {
                unlink($texturesPath);
            }
        }
    }

    public function deleteFilesFromStorage() {

        self::deleteOriginalImage();
        self::deleteThumbnail();
        self::deleteDrawings();
        self::deleteTextures();
    }

    public static function getStorageHttpPath() {
        return UrlUtils::getFirstPartOfUrl() ."/storage/";
    }
}
