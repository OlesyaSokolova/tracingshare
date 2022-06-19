<?php

namespace common\models;

use Yii;

class UrlUtils
{
   public static function getFirstPartOfUrl() {
        //$projectFolder = basename(Yii::getAlias('@root'));
        //return Yii::$app->urlManager->hostInfo . "/". $projectFolder;
        return Yii::$app->urlManager->hostInfo;
    }

    public static function frontendUrl()
    {
        return self::getFirstPartOfUrl()."/frontend/web/index.php";
    }

    public static function backendUrl()
    {
        return self::getFirstPartOfUrl()."/backend/web/index.php";
    }
}
