<?php

namespace common\models;

use Yii;
use yii\db\ActiveRecord;
use yii\helpers\FileHelper;

/* @property int id
* @property string name
* @property string description //description of petroglyph
* @property string image //link to an original image
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
    const PATH_STORAGE = 'http://localhost/tracingshare/storage/';
    const PATH_IMAGES = 'images';//folder with original images
    const PATH_DRAWINGS = 'drawings';//folder with drawings

    //public $fileImage; //File
    //public $fileTexture;
    //public $filesDrawings = array(); //Array// files-drawings from folder "PATH_STORAGE+PATH_DRAWING

    public static function tableName()
    {
        //return '{{petroglyph}}
        return 'exhibits';
    }

    /*public function rules()
    {
        return [
            [['name'], 'required'],
            [['name', 'description', 'image', 'settings', 'author'], 'string'],
            [['fileImage'], 'file', 'skipOnEmpty' => true, 'extensions' => 'png, jpg'],
            //[['fileTexture'], 'file', 'skipOnEmpty' => true, 'extensions' => 'png, jpg, bin', 'maxFiles' => 10],
            [['fileDrawing'], 'file', 'skipOnEmpty' => true, 'extensions' => 'png, gif, webp', 'maxFiles' => 10],//'maxSize' => 8192*8192
           //['sef', 'match', 'pattern' => '/^[a-z0-9\-]*$/iu', 'message' => 'Допустима латиница, числа и -'], ??
        ];
    }*/

    /*public function upload()
    {
        if ($this->validate()) {
            //1.$this->image = link to image from database
            if ($this->fileImage) {
                $path = self::PATH_IMAGE . '/' . $this->id;

                if (!empty($this->image) and file_exists($path . '/' . $this->image)) {
                    //if link to the image is not empty we should overwrite file
                    unlink($path . '/' . $this->image);
                }

                FileHelper::createDirectory($path);

                $newName = strtotime('now');
                $this->fileImage->saveAs($path . '/' . $newName . '.' . $this->fileImage->extension);
                $this->image = $newName . '.' . $this->fileImage->extension;
            }

            if ($this->filesDrawings) {
                //path for directory
                $path = Petroglyph::PATH_IMAGE . '/' . $this->id;
                $drawingsArray = array();
                FileHelper::createDirectory($path);
                FileHelper::createDirectory($path . '/' . $this->pathDrawing);

                foreach ($this->filesDrawings as $fileDrawing) {
                    $fileDrawing->saveAs($path . '/' . $this->pathDrawing . '/' . $fileDrawing->baseName . '.' . $fileDrawing->extension);
                    $drawingsArray[] = '/' . $path . '/' . $this->pathDrawing . '/' . $fileDrawing->baseName . '.' . $fileDrawing->extension;
                }
                $this->setSetting('drawings', $drawingsArray);
            }
        }
    }*/

  /*  public function setSetting($field, $value)
    {
        $setting = $this->getSettingsArray();
        $setting->$field = $value;
        $this->setting = json_encode($setting);
    }*/

    public function getSettingsArray()
    {
        return json_decode($this->settings);
    }
}
