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
        return Yii::$app->urlManager->hostInfo."/frontend/web/index.php";
    }

    public static function backendUrl()
    {
        return Yii::$app->urlManager->hostInfo."/backend/web/index.php";
    }
}
